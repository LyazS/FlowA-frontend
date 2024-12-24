import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { useVFlowInitial } from '@/hooks/useVFlowInitial.js';
import { useRequestMethod } from '@/services/useRequestMethod';
import { getUuid, setValueByPath } from '@/utils/tools.js';
import { useMessage } from 'naive-ui';
import { resetState } from "@/components/nodes/NodeOperator.js"
// 单例模式
let instance = null;
export const useVFlowManagement = () => {
    if (instance) return instance;
    const message = useMessage();

    const {
        getAddNodeList,
        getVFNodeTypes,
        cloneVFNodeInitInfo,
        getVFNodeCount,
        increaseVFNodeCount,
        reBuildCounter,
    } = useVFlowInitial();
    const {
        getNodes,
        addNodes,
        findNode,
        removeNodes,
        addEdges,
        toObject,
        fromObject,
        getHandleConnections,
    } = useVueFlow();
    const { getData, postData } = useRequestMethod();

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
        // console.log("getNodes.value", getNodes.value);
        // console.log("buildNestedNodeGraph", NestedNodeGraph.value);
    }

    function getNumberWithPrefix(prefix, str) {
        const regex = new RegExp(`^${prefix}(\\d+)$`);
        const match = str.match(regex);
        return match ? parseInt(match[1], 10) : 0;
    }
    const recursiveUpdateNodeSize = (nodeId) => {
        let vf_node = findNode(nodeId);
        let nested_node = getNestedNodeById(nodeId);
        if (!vf_node || !nested_node) return;
        const nested_node_childs = nested_node.children.reduce((acc, childId) => {
            let vf_node_child = findNode(childId);
            // 子节点不计算
            if (!vf_node_child.data.flags.isAttached) acc += 1;
            return acc;
        }, 0);
        if (nested_node_childs <= 0) return;

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
                if (yPart.startsWith("bottom")) {
                    const yOffset = getNumberWithPrefix("bottom", yPart) * vf_node.data.nesting.attached_pad.gap;
                    vf_node_child.position.y = vf_node.data.size.height - vf_node.data.nesting.attached_pad.bottom - yOffset;
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
        let new_node_id = nodeinfo.nid || getUuid();
        if (nodeinfo.type === 'client' && parentNode) {
            const nest_regex = /#(\w+)/g;
            const pid_matches = parentNode.id.match(nest_regex) || [];
            console.log("pid_matches", pid_matches);
            if (parentNode.data.flags.isNested) {
                new_node_id += pid_matches.join('') + `#${parentNode.data.nesting.tag}`;
            }
        }
        const new_node = {
            id: new_node_id,
            type: node_init_info.data.vtype,
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
        if (nodeinfo.type === 'attached' && !!parentNode) {
            const [yPart, xPart] = node_init_info.data.attaching.pos.split('-');
            if (yPart.startsWith("top")) {
                const yOffset = getNumberWithPrefix("top", yPart) * parentNode.data.nesting.attached_pad.gap;
                new_node_position.y = parentNode.position.y + parentNode.data.nesting.attached_pad.top + yOffset;
            }
            else if (yPart.startsWith("bottom")) {
                const yOffset = getNumberWithPrefix("bottom", yPart) * parentNode.data.nesting.attached_pad.gap;
                new_node_position.y = parentNode.position.y + parentNode.data.size.height - parentNode.data.nesting.attached_pad.bottom - yOffset;
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
            // new_node.data.flags.isAttached = true;
            // new_node.data.attaching.pos = nodeinfo.position;
            // new_node.data.attaching.type = nodeinfo.attached_type;
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
            for (const antype of Object.keys(node_init_info.data.nesting.attached_nodes)) {
                const anid = getUuid();
                recursiveAddNodeToVFlow(new_node.id, {
                    ntype: antype,
                    nid: anid,
                    type: "attached",
                });
                node_init_info.data.nesting.attached_nodes[antype].nid = anid;
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

    const resetNodeState = (node) => {
        resetState(node);
    }

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

    const findVarFromIO = (nid, findconnect, hid) => {
        const result = [];
        const thenode = findNode(nid);
        if (!thenode.data.connections.hasOwnProperty(findconnect)
            || !thenode.data.connections[findconnect].hasOwnProperty(hid)) {
            return result;
        }

        const connection = thenode.data.connections[findconnect][hid].data;
        for (const c_data of Object.values(connection)) {
            if (c_data.type === 'FromInner') {
                result.push({
                    nodeId: nid,
                    nlabel: thenode.data.label,
                    dpath: c_data.path,
                    dlabel: thenode.data[c_data.path[0]].byId[c_data.path[1]].label,
                    dkey: thenode.data[c_data.path[0]].byId[c_data.path[1]].key,
                    dtype: thenode.data[c_data.path[0]].byId[c_data.path[1]].type,
                });
            }
            else if (c_data.type === 'FromOuter') {
                // 对于上一个节点，则递归搜索上个节点的对应输出handle
                const in_hid = c_data.inputKey;
                const edges = getHandleConnections({ id: in_hid, type: "target", nodeId: nid });
                console.log("handle id: ", in_hid, "edges count: ", Object.keys(edges).length);
                for (const [eidx, edge] of Object.entries(edges)) {
                    const src_nid = edge.source;
                    const src_hid = edge.sourceHandle;
                    result.push(...recursiveFindVariables(src_nid, [], [], [], false, [], false, [src_hid]));
                }
            }
            else if (c_data.type === 'FromAttached') {
                // 对于子节点，
                // 如果是输入节点，则搜索它的输出变量
                // 如果是输出节点，则搜索它的自身可用变量
                result.push(...recursiveFindVariables(
                    thenode.data.nesting.attached_nodes[c_data.atype].nid,
                    c_data.atype === 'attached_node_output' ? ['self'] : [],
                    [],
                    [],
                    false,
                    [],
                    c_data.atype === 'attached_node_input',
                    [],
                ));
            }
            else if (c_data.type === 'FromParent') {
                // 如果是父节点，则递归搜索父节点的所有输入handle
                result.push(...recursiveFindVariables(thenode.parentNode, [], ['attach'], [], true, [], false, []));
            }
        }
        return result;
    }


    const recursiveFindVariables = (
        nid,
        findSelf = [],
        findAttach = [],
        findNext = [],
        findAllInput = false,
        findInput = [],
        findAllOutput = false,
        findOutput = [],
    ) => {
        const result = [];
        const thenode = findNode(nid);
        if (findAllInput) { findInput = Object.keys(thenode.data.connections.inputs); }
        if (findAllOutput) { findOutput = Object.keys(thenode.data.connections.outputs); }

        for (const hid of findSelf) {
            result.push(...findVarFromIO(nid, 'self', hid));
        }
        for (const hid of findAttach) {
            result.push(...findVarFromIO(nid, 'attach', hid));
        }
        for (const hid of findNext) {
            result.push(...findVarFromIO(nid, 'next', hid));
        }
        for (const hid of findInput) {
            result.push(...findVarFromIO(nid, 'inputs', hid));
        }
        for (const hid of findOutput) {
            result.push(...findVarFromIO(nid, 'outputs', hid));
        }
        return result;
    };
    instance = {
        getNestedNodeById,
        buildNestedNodeGraph,
        recursiveUpdateNodeSize,
        recursiveAddNodeToVFlow,
        addNodeToVFlow,
        removeNodeFromVFlow,
        resetNodeState,
        addEdgeToVFlow,
        findVarFromIO,
        recursiveFindVariables,
    };
    return instance;
};