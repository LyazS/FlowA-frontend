// hooks/useContextMenu.js
import { ref, reactive } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { useNodeManagement } from './useVFlowManagement';

export function useContextMenu() {
  const showMenu = ref(false);
  const menuOptions = reactive({
    theme: 'mac dark',
    zIndex: 3,
    minWidth: 50,
    x: 0,
    y: 0,
    items: [],
  });

  const { addNodeToVFlow, removeNodeFromVFlow, AddNodeListFromInitInfos } = useNodeManagement();
  const { removeEdges, screenToFlowCoordinate } = useVueFlow();

  // ... AddNodeList, showContextMenu, and other context menu related functions
  const AddNodeList = (event_cm) => {
    return AddNodeListFromInitInfos.map(item => ({
      label: item.data.label,
      onClick: () => {
        console.log("add node", item.ntype);
        let node_info = {
          ntype: item.ntype,
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
  }
  
  return {
    showMenu,
    menuOptions,
    showContextMenu
  };
}