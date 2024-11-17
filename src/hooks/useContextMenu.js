// hooks/useContextMenu.js
import { ref, reactive } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { useVFlowManagement } from './useVFlowManagement.js';
import { useVFlowInitial } from './useVFlowInitial.js';

// 单例模式
let instance = null;
export const useContextMenu = () => {
  if (instance) return instance;
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
  const {
    getNestedNodeById,
    buildNestedNodeGraph,
    recursiveUpdateNodeSize,
    recursiveAddNodeToVFlow,
    addNodeToVFlow,
    removeNodeFromVFlow,
    addEdgeToVFlow,
  } = useVFlowManagement();

  const { AllVFNodeTypes,
    initAllNodeInfos,
    getAddNodeList,
    getVFNodeTypes,
    cloneVFNodeInitInfo,
    getVFNodeCount,
    increaseVFNodeCount,
  } = useVFlowInitial();

  const onClickContextMenuRmNode = (event_cm) => {
    console.log('删除节点');
    const node = event_cm.node;
    const parent_id = node.parentNode;

    removeNodeFromVFlow(node);
    buildNestedNodeGraph();
    recursiveUpdateNodeSize(parent_id);
  }
  const showMenu = ref(false);
  const menuOptions = reactive({
    theme: 'mac dark',
    zIndex: 3,
    minWidth: 50,
    x: 0,
    y: 0,
    items: [],
  });

  const AddNodeList = (event_cm) => {
    return getAddNodeList().map(item => ({
      label: item.data.label,
      onClick: () => {
        console.log("add node", item.data.ntype);
        let node_info = {
          ntype: item.data.ntype,
          type: 'client',
          ...screenToFlowCoordinate({
            x: event_cm.event.clientX,
            y: event_cm.event.clientY,
          })
        };
        addNodeToVFlow(event_cm.node?.id, node_info);
      },
    }));
  };

  const showContextMenu = (event_cm) => {
    menuOptions.x = event_cm.event.clientX
    menuOptions.y = event_cm.event.clientY
    showMenu.value = (event_cm.type === 'node' && !event_cm.node.data.flags.isAttached) || (event_cm.type === 'pane') || (event_cm.type === 'edge');
    let show_add_node = (event_cm.type === 'node' && event_cm.node.data.flags.isNested) || (event_cm.type === 'pane');
    let show_rm_node = (event_cm.type === 'node' && !event_cm.node.data.flags.isAttached);
    let show_rm_edge = (event_cm.type === 'edge');
    menuOptions.items = [];

    if (show_add_node) {
      menuOptions.items.push({
        label: '添加节点',
        children: AddNodeList(event_cm),
      })
    }
    if (show_rm_node) {
      menuOptions.items.push({
        label: '删除节点',
        onClick: () => onClickContextMenuRmNode(event_cm),
      });
    }
    if (show_rm_edge) {
      menuOptions.items.push({
        label: '删除边',
        onClick: () => removeEdges([event_cm.edge]),
      });
    }
  };

  instance = {
    showMenu,
    menuOptions,
    showContextMenu,
    AddNodeList,
    onClickContextMenuRmNode,
  }
  return instance;

};