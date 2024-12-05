import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { useVFlowInitial } from '@/hooks/useVFlowInitial.js';
import { getUuid, setValueByPath } from '@/utils/tools.js';
import { SubscribeSSE } from '@/services/useSSE'
import { useMessage } from 'naive-ui';
import { resetState } from "@/components/nodes/NodeOperator.js"

// 单例模式
let instance = null;
export const useVFlowManagement = () => {
    if (instance) return instance;
    const message = useMessage();
    const {
        TaskID,
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

    function getNumberWithPrefix(prefix, str) {
        const regex = new RegExp(`^${prefix}(\\d+)$`);
        const match = str.match(regex);
        return match ? parseInt(match[1], 10) : 0;
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

    const updateNodeFromSSE = (data) => {
        const nid = data.nid;
        const oriid = data.oriid;
        const updatedatas = data.data;
        for (const udata of updatedatas) {
            const data = udata.data;
            const path = udata.path;
            const type = udata.type;
            if (type === "overwrite") {
                // 特殊处理状态改变
                if (nid.includes('#')
                    && path[0] === 'state'
                    && path[1] == 'status') {
                    const vf_node = findNode(oriid);
                    if (vf_node && !vf_node.data.flags.isAttached) {
                        vf_node.data.state.copy[nid] = { status: data };
                    }
                }
                else {
                    const thenode = findNode(nid);
                    if (thenode) {
                        setValueByPath(thenode.data, path, data);
                    }
                }
            }
            else if (type === "append") { }
            else if (type === "remove") { }
        }
    }
    const { subscribe, unsubscribe } = SubscribeSSE(
        'GET',
        null,
        null,
        // onOpen
        async (response) => {
            // console.log("onopen SSE", response.ok);
        },
        // onMessage
        async (event) => {
            // console.log("onmessage SSE");
            if (event.event === "updatenode") {
                let data = JSON.parse(event.data);
                // console.log(data);
                updateNodeFromSSE(data);
            }
            else if (event.event === "batchupdatenode") {
                let datas = JSON.parse(event.data);
                for (const data of datas) {
                    updateNodeFromSSE(data);
                }
            }
            else if (event.event === "internalerror") {
                let data = JSON.parse(event.data);
                // console.log(data);
                message.error(`内部错误: ${data}`);
            }
            else if (event.event === "flowfinish") {
                unsubscribe();
                message.success('工作流运行完成');
            }
        },
        // onClose
        async () => {
            console.log("onclose SSE");
        },
        // onError
        async (err) => {
            console.log("onerror SSE", err);
        },
    );

    onMounted(() => {
        watch(TaskID, (newVal, oldVal) => {
            if (newVal && newVal !== oldVal) {
                setTimeout(() => {
                    console.log("TaskID ", newVal);
                    subscribe(`${import.meta.env.VITE_API_URL}/api/progress?taskid=${newVal}`)
                    console.log("subscribeSSE Done.");
                }, 1000);
            }
        });
    });
    onUnmounted(() => {
        unsubscribe();
    });
    instance = {
        getNestedNodeById,
        buildNestedNodeGraph,
        recursiveUpdateNodeSize,
        recursiveAddNodeToVFlow,
        addNodeToVFlow,
        removeNodeFromVFlow,
        resetNodeState,
        addEdgeToVFlow,
    }
    return instance;
};