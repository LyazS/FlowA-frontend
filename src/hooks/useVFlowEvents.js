import { ref, reactive, watch } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { useVFlowManagement } from './useVFlowManagement.js'
import { useContextMenu } from './useContextMenu.js'
import { useFlowAOperation } from '@/services/useFlowAOperation.js';
import { nodeFlags } from '@/utils/schemas'
import { selectedNodeId } from "@/hooks/useSelectedNodeId.js";

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
        onPaneClick,
        onEdgeContextMenu,
        screenToFlowCoordinate,
        getViewport,
        setViewport,
    } = useVueFlow();
    const { autoSaveWorkflow } = useFlowAOperation();
    // 节点选择事件 =================================================
    const selcetNodeEvent = (event) => {
        const node = event.node;
        if (nodeFlags.isAttached & node.data.flag) return;
        // 如果点击的是同一个节点，不做任何操作
        if (selectedNodeId.value === node.id) return;
        // 如果之前有选中的节点，先取消选中
        if (selectedNodeId.value) {
            console.log(`Node ${selectedNodeId.value} de selected`);
            selectedNodeId.value = null;
        }
        console.log(`Node ${node.id} selected`);
        selectedNodeId.value = node.id;
    };

    // vueflow事件监听 =============================================
    onPaneClick((event) => {
        selectedNodeId.value = null;
        // console.log("空白区域点击", event);
    })
    onNodeClick((event) => {
        selcetNodeEvent(event);
        // console.log("节点点击", event);
    })
    onNodeDrag((event) => {
        const e_nodes = event.nodes;
        e_nodes.forEach(node => {
            if (node.parentNode) {
                recursiveUpdateNodeSize(node.parentNode)
            }
        })
        autoSaveWorkflow();
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
        autoSaveWorkflow();
    })

    instance = {
        selectedNodeId,
    };
    return instance;
};
