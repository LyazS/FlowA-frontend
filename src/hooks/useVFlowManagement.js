import { ref, reactive } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { useVFlowInitial } from './useVFlowInitial.js';
import { getUuid } from '../utils/tools.js';

// 单例模式
let instance = null;
export const useVFlowManagement = () => {
    if (instance) return instance;
    const {
        getAddNodeList,
        getVFNodeTypes,
        cloneVFNodeInitInfo,
        getVFNodeCount,
        increaseVFNodeCount,
    } = useVFlowInitial();
    const {
        getNodes,
        addNodes,
        findNode,
        removeNodes,
        addEdges,
    } = useVueFlow();

    const NestedNodeGraph = ref({});

    const getNestedNodeById = (id) => {
        return NestedNodeGraph.value[id];
    }
    const buildNestedNodeGraph = () => {
        NestedNodeGraph.value = {}
        getNodes.value.forEach((node) => {
            NestedNodeGraph.value[node.id] = { parentNode: node.parentNode, children: [] }
        })

        Object.entries(NestedNodeGraph.value).forEach(([nid, node]) => {
            if (node.parentNode) {
                NestedNodeGraph.value[node.parentNode].children.push(nid)
            }
        })
    }

    const recursiveUpdateNodeSize = (nodeId) => {
        let vf_node = findNode(nodeId);
        let nested_node = getNestedNodeById(nodeId);
        if (!vf_node || !nested_node) return;
        if (nested_node.children.length <= 0) return;

        let vf_node_pos = vf_node.position;
        // 遍历子节点，计算最小包围盒
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        nested_node.children.forEach(childId => {
            let vf_node_child = findNode(childId);
            // 固定位置的子节点不计算
            if (vf_node_child.data.flags.isAttached) return;
            minX = Math.min(minX, vf_node_child.position.x + vf_node_pos.x);
            minY = Math.min(minY, vf_node_child.position.y + vf_node_pos.y);
            maxX = Math.max(maxX, vf_node_child.position.x + vf_node_pos.x + vf_node_child.data.size.width);
            maxY = Math.max(maxY, vf_node_child.position.y + vf_node_pos.y + vf_node_child.data.size.height);
        })

        // 按照最小尺寸更新父节点尺寸
        let vf_node_tgt_wd = (maxX - minX) + vf_node.data.nesting.pad.left + vf_node.data.nesting.pad.right;
        let vf_node_tgt_ht = (maxY - minY) + vf_node.data.nesting.pad.top + vf_node.data.nesting.pad.bottom;
        vf_node.data.size.width = Math.max(vf_node_tgt_wd, vf_node.data.min_size.width);
        vf_node.data.size.height = Math.max(vf_node_tgt_ht, vf_node.data.min_size.height);
        vf_node.style.width = `${vf_node.data.size.width}px`;
        vf_node.style.height = `${vf_node.data.size.height}px`;

        // 更新子节点位置
        nested_node.children.forEach(childId => {
            let vf_node_child = findNode(childId);
            // 固定位置的子节点
            if (vf_node_child.data.flags.isAttached) {
                let [yPart, xPart] = vf_node_child.data.attaching.pos.split('-');
                if (yPart == "bottom") {
                    vf_node_child.position.y = vf_node.data.size.height - vf_node.data.nesting.attached_pad.bottom;
                }
                else if (yPart == "center") {
                    vf_node_child.position.y = vf_node.data.size.height / 2 - vf_node.data.nesting.attached_pad.bottom;
                }
                if (xPart == "right") {
                    vf_node_child.position.x = vf_node.data.size.width - vf_node.data.nesting.attached_pad.right;
                }
                else if (xPart == "center") {
                    vf_node_child.position.x = vf_node.data.size.width / 2 - vf_node.data.nesting.attached_pad.right;
                }
                if (yPart != "top") vf_node_child.position.y -= vf_node_child.data.size.height / 2;
                if (xPart != "left") vf_node_child.position.x -= vf_node_child.data.size.width / 2;
            }
            else {
                vf_node_child.position.x += vf_node_pos.x - (minX - vf_node.data.nesting.pad.left);
                vf_node_child.position.y += vf_node_pos.y - (minY - vf_node.data.nesting.pad.top);
            }
        });

        // 更新父节点位置
        vf_node.position = { x: minX - vf_node.data.nesting.pad.left, y: minY - vf_node.data.nesting.pad.top };

        // 递归更新父节点大小
        recursiveUpdateNodeSize(nested_node.parentNode);
    }

    const recursiveAddNodeToVFlow = (parentNodeId, nodeinfo) => {
        const nodetype = nodeinfo.ntype;
        console.log("addNodeToVFlow parent:", parentNodeId, " nodetype:", nodetype, " nodeinfo:", nodeinfo);
        const parentNode = findNode(parentNodeId);

        const node_init_info = cloneVFNodeInitInfo(nodetype);
        const offset_size = { width: node_init_info.data.size.width + 8, height: node_init_info.data.size.height + 8 };
        const new_node = {
            id: nodeinfo.nid || getUuid(),
            type: node_init_info.vtype,
            data: node_init_info.data,
            style: {
                width: `${offset_size.width}px`,
                height: `${offset_size.height}px`,
            },
        };
        new_node.data.size.width = offset_size.width;
        new_node.data.size.height = offset_size.height;
        const nodecount = getVFNodeCount(nodetype);
        const new_node_label = (nodecount > 0) ? `${node_init_info.data.label}${nodecount}` : node_init_info.data.label;
        increaseVFNodeCount(nodetype, 1);
        new_node.data.placeholderlabel = new_node_label;
        new_node.data.label = new_node_label;

        // 设置全局position
        let new_node_position = { x: 0, y: 0 };
        if (nodeinfo.type == 'attached' && !!parentNode) {
            const [yPart, xPart] = nodeinfo.position.split('-');
            if (yPart == "top") {
                new_node_position.y = parentNode.position.y + parentNode.data.nesting.attached_pad.top;
            }
            else if (yPart == "bottom") {
                new_node_position.y = parentNode.position.y + parentNode.data.size.height - parentNode.data.nesting.attached_pad.bottom;
            }
            else if (yPart == "center") {
                new_node_position.y = parentNode.position.y + parentNode.data.size.height / 2 - parentNode.data.nesting.attached_pad.bottom;
            }
            if (xPart == "left") {
                new_node_position.x = parentNode.position.x + parentNode.data.nesting.attached_pad.left;
            }
            else if (xPart == "right") {
                new_node_position.x = parentNode.position.x + parentNode.data.size.width - parentNode.data.nesting.attached_pad.right;
            }
            else if (xPart == "center") {
                new_node_position.x = parentNode.position.x + parentNode.data.size.width / 2 - parentNode.data.nesting.attached_pad.right;
            }
            new_node.data.flags.isAttached = true;
            new_node.data.attaching.pos = nodeinfo.position;
            new_node.data.attaching.type = nodeinfo.attached_type;
            new_node.draggable = false;
            new_node.selectable = false;
            new_node_position.x -= offset_size.width / 2;
            new_node_position.y -= offset_size.height / 2;
            console.log("add attached node in", new_node.data.attaching.pos)
        }
        else if (nodeinfo.type === 'client') {
            new_node_position = { x: nodeinfo.x, y: nodeinfo.y };
        }
        // 递归设置局部position
        if (parentNodeId) {
            new_node.parentNode = parentNodeId;
            let curparentnode = parentNodeId;
            while (curparentnode) {
                if (curparentnode) {
                    new_node_position.x -= findNode(curparentnode).position.x;
                    new_node_position.y -= findNode(curparentnode).position.y;
                }
                curparentnode = getNestedNodeById(curparentnode)?.parentNode;
            }
        }

        new_node.position = new_node_position;

        addNodes(new_node);
        if (node_init_info.data.nesting?.attached_nodes) {
            console.log(`add ${Object.keys(node_init_info.data.nesting.attached_nodes).length} fixed nested nodes`);
            for (const [atype, anode] of Object.entries(node_init_info.data.nesting.attached_nodes)) {
                const anid = getUuid();
                recursiveAddNodeToVFlow(new_node.id, {
                    ntype: anode.ntype,
                    type: "attached",
                    position: anode.apos,
                    attached_type: atype,
                    nid: anid,
                });
                node_init_info.data.nesting.attached_nodes[atype].nid = anid;
            }
        }
    };

    const addNodeToVFlow = (parentNodeId, nodeinfo) => {
        recursiveAddNodeToVFlow(parentNodeId, nodeinfo);
        buildNestedNodeGraph();
        recursiveUpdateNodeSize(parentNodeId);
    };

    const removeNodeFromVFlow = (node) => {
        removeNodes(node, true, true);
    };


    const addEdgeToVFlow = (params) => {
        let is_match_port = (params.sourceHandle.startsWith("output") && params.targetHandle.startsWith("input"))
            || (params.sourceHandle.startsWith("callbackUser") && params.targetHandle.startsWith("callbackFunc"));
        let is_diff_node = (params.source !== params.target);
        let is_same_parent = (getNestedNodeById(params.source)?.parentNode === getNestedNodeById(params.target)?.parentNode);
        let is_all_attached = (findNode(params.source)?.data.flags.isAttached && findNode(params.target)?.data.flags.isAttached);
        console.log("is_match_port", is_match_port, "is_diff_node", is_diff_node, "is_same_parent", is_same_parent, "is_all_attached", is_all_attached);
        if (is_match_port
            && is_diff_node
            && !!is_same_parent
            && !is_all_attached
        ) {
            console.log("add edge");
            params.type = 'normal';
            addEdges(params);
        }
    };

    instance={
        getNestedNodeById,
        buildNestedNodeGraph,
        recursiveUpdateNodeSize,
        recursiveAddNodeToVFlow,
        addNodeToVFlow,
        removeNodeFromVFlow,
        addEdgeToVFlow,
    }
    return instance;
};