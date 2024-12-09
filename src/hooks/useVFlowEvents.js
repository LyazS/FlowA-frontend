import { ref, reactive, watch } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { useVFlowManagement } from './useVFlowManagement.js'
import { useContextMenu } from './useContextMenu.js'


// 单例模式
let instance = null;
export const useVFlowEvents = () => {
    if (instance) return instance;
    const {
        getNestedNodeById,
        buildNestedNodeGraph,
        recursiveUpdateNodeSize,
        recursiveAddNodeToVFlow,
        addNodeToVFlow,
        removeNodeFromVFlow,
        addEdgeToVFlow,
    } = useVFlowManagement();
    const {
        showContextMenu,
    } = useContextMenu();
    const {
        getNodes,
        getEdges,
        getSelectedNodes,
        addNodes,
        findNode,
        removeNodes,
        onConnect,
        addEdges,
        removeEdges,
        onNodesChange,
        onEdgesChange,
        onNodeDragStart,
        onNodeDrag,
        onNodeDragStop,
        onNodeClick,
        onNodeDoubleClick,
        onNodeContextMenu,
        onNodeMouseEnter,
        onNodeMouseLeave,
        onNodeMouseMove,
        onPaneContextMenu,
        onEdgeContextMenu,
        screenToFlowCoordinate,
        getViewport,
        setViewport,
    } = useVueFlow();

    // 节点选择事件 =================================================
    const lastClickedNodeId = ref(null);
    const selcetNodeEvent = (event) => {
        const node = event.node;
        if (node.data.flags.isAttached) return;
        // 如果点击的是同一个节点，不做任何操作
        if (lastClickedNodeId.value === node.id) return;
        // 如果之前有选中的节点，先取消选中
        if (lastClickedNodeId.value) {
            console.log(`Node ${lastClickedNodeId.value} de selected`);
            lastClickedNodeId.value = null;
        }
        console.log(`Node ${node.id} selected`);
        lastClickedNodeId.value = node.id;
    };
    watch(getSelectedNodes, (nodes) => {
        // 如果选中的节点数量不为1，说明是批量选择或取消选择
        if (nodes.length !== 1) {
            if (lastClickedNodeId.value) {
                console.log(`Node ${lastClickedNodeId.value} de selected`);
                lastClickedNodeId.value = null;
            }
        }
    })

    // vueflow事件监听 =============================================
    onNodeClick((event) => {
        selcetNodeEvent(event);
    })
    onNodeDrag((event) => {
        const e_nodes = event.nodes;
        e_nodes.forEach(node => {
            if (node.parentNode) {
                recursiveUpdateNodeSize(node.parentNode)
            }
        })
    })
    onNodeContextMenu((event) => {
        console.log("右键节点", event.node.id);
        event.event.preventDefault();
        let event_cm = {
            type: 'node',
            event: event.event,
            node: event.node,
        }
        showContextMenu(event_cm);
    })
    onPaneContextMenu((event) => {
        console.log("右键空白");
        event.preventDefault();
        let event_cm = {
            type: 'pane',
            event: event,
            node: null,
        }
        showContextMenu(event_cm);
    })
    onEdgeContextMenu((event) => {
        console.log("右键边");
        event.event.preventDefault();
        let event_cm = {
            type: 'edge',
            event: event.event,
            edge: event.edge,
        }
        showContextMenu(event_cm);
    })

    onConnect((event) => {
        addEdgeToVFlow(event);
    })

    instance = {
        lastClickedNodeId,
    };
    return instance;
};
