<template>
  <VueFlow :connection-mode="ConnectionMode.Strict" :connection-radius="30" :nodes="InitVFNodes" :edges="InitVFEdges"
    :nodeTypes="AllVFNodeTypes" fit-view-on-init elevate-edges-on-select>
    <Background />
  </VueFlow>
  <ContextMenu v-model:show="showMenu" :options="menuOptions" />
</template>

<script setup>
import _ from 'lodash';
import { ref, markRaw, onMounted, reactive, watch } from 'vue'
import { ConnectionMode, VueFlow, Panel, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls, ControlButton } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { NIcon, NTag, useMessage, NButton, NModal, NDrawer, NDrawerContent, NTabs, NTab, NDropdown, NGrid, NGridItem, NH3, NText, NSpin, NFlex } from 'naive-ui';
import { ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem } from '@imengyu/vue3-context-menu';
import { getUuid } from './utils/tools.js';
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
} = useVueFlow();
const InitVFNodes = ref([]);
const InitVFEdges = ref([]);
const NestedNodeGraph = ref({});
const AllNodeInitInfos = {};
const AllVFNodeTypes = reactive({});

const getVFNodeById = (id) => {
  const node = findNode(id);
  if (node) {
    return node;
  }
  return null;
}
const getNestedNodeById = (id) => {
  return NestedNodeGraph.value[id];
}

const initAllNodes = async () => {
  const modules = import.meta.glob('./components/**/node.js');
  Object.keys(modules).forEach(async (key) => {
    const module = await modules[key]();
    const initInfo = module.initInfo;
    AllNodeInitInfos[initInfo.type] = initInfo;
    AllVFNodeTypes[initInfo.type] = markRaw(module.NodeVue);
  });

  console.log("all_node_modules", AllNodeInitInfos);
  console.log("nodeTypes", AllVFNodeTypes);
};

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
  console.log("NestedNodeGraph", NestedNodeGraph.value);
  console.log("getNodes", getNodes.value);
  console.log("edges", getEdges.value);
}

const recursiveUpdateNodeSize = (nodeId) => {
  let vf_node = getVFNodeById(nodeId);
  let nested_node = getNestedNodeById(nodeId);
  if (!vf_node || !nested_node) return;
  if (nested_node.children.length <= 0) return;

  let vf_node_pos = vf_node.position;
  // 遍历子节点，计算最小包围盒
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  nested_node.children.forEach(childId => {
    let vf_node_child = getVFNodeById(childId);
    // 固定位置的子节点不计算
    if (!!vf_node_child.data._is_fixed_child_in_nest) return;
    minX = Math.min(minX, vf_node_child.position.x + vf_node_pos.x);
    minY = Math.min(minY, vf_node_child.position.y + vf_node_pos.y);
    maxX = Math.max(maxX, vf_node_child.position.x + vf_node_pos.x + vf_node_child.data._size.width);
    maxY = Math.max(maxY, vf_node_child.position.y + vf_node_pos.y + vf_node_child.data._size.height);
  })

  // 按照最小尺寸更新父节点尺寸
  let vf_node_tgt_wd = (maxX - minX) + vf_node.data._nested_edge_gap.left + vf_node.data._nested_edge_gap.right;
  let vf_node_tgt_ht = (maxY - minY) + vf_node.data._nested_edge_gap.top + vf_node.data._nested_edge_gap.bottom;
  vf_node.data._size.width = Math.max(vf_node_tgt_wd, vf_node.data._min_size.width);
  vf_node.data._size.height = Math.max(vf_node_tgt_ht, vf_node.data._min_size.height);
  vf_node.style.width = `${vf_node.data._size.width}px`;
  vf_node.style.height = `${vf_node.data._size.height}px`;

  // 更新子节点位置
  nested_node.children.forEach(childId => {
    let vf_node_child = getVFNodeById(childId);
    // 固定位置的子节点
    if (!!vf_node_child.data._is_fixed_child_in_nest) {
      let [yPart, xPart] = vf_node_child.data._fixed_position_in_nest.split('-');
      if (yPart == "bottom") {
        vf_node_child.position.y = vf_node.data._size.height - vf_node.data._fixed_nested_edge_gap.bottom;
      }
      else if (yPart == "center") {
        vf_node_child.position.y = vf_node.data._size.height / 2 - vf_node.data._fixed_nested_edge_gap.bottom;
      }
      if (xPart == "right") {
        vf_node_child.position.x = vf_node.data._size.width - vf_node.data._fixed_nested_edge_gap.right;
      }
      else if (xPart == "center") {
        vf_node_child.position.x = vf_node.data._size.width / 2 - vf_node.data._fixed_nested_edge_gap.right;
      }
      if (yPart != "top") vf_node_child.position.y -= vf_node_child.data._size.height / 2;
      if (xPart != "left") vf_node_child.position.x -= vf_node_child.data._size.width / 2;
    }
    else {
      vf_node_child.position.x += vf_node_pos.x - (minX - vf_node.data._nested_edge_gap.left);
      vf_node_child.position.y += vf_node_pos.y - (minY - vf_node.data._nested_edge_gap.top);
    }
  });

  // 更新父节点位置
  vf_node.position = { x: minX - vf_node.data._nested_edge_gap.left, y: minY - vf_node.data._nested_edge_gap.top };

  // 递归更新父节点大小
  recursiveUpdateNodeSize(nested_node.parentNode);
}


onMounted(async () => {
  await initAllNodes();
  buildNestedNodeGraph();
})

const recursiveAddNodeToVFlow = (parentNodeId, nodetype, position) => {
  console.log("addNodeToVFlow", parentNodeId, nodetype, position);
  const parentNode = getVFNodeById(parentNodeId);
  const node_init_info = _.cloneDeep(AllNodeInitInfos[nodetype]);
  let new_node = {
    id: getUuid(),
    type: node_init_info.type,
    data: node_init_info.init_data,
    style: {
      width: `${node_init_info.init_width}px`,
      height: `${node_init_info.init_height}px`,
    },
  };
  new_node.data._size.width = node_init_info.init_width;
  new_node.data._size.height = node_init_info.init_height;

  // 设置全局position
  let new_node_position = { x: 0, y: 0 };
  if (position.type == 'fixed' && !!parentNode) {
    const [yPart, xPart] = position.position.split('-');
    if (yPart == "top") {
      new_node_position.y = parentNode.position.y + parentNode.data._fixed_nested_edge_gap.top;
    }
    else if (yPart == "bottom") {
      new_node_position.y = parentNode.position.y + parentNode.data._size.height - parentNode.data._fixed_nested_edge_gap.bottom;
    }
    else if (yPart == "center") {
      new_node_position.y = parentNode.position.y + parentNode.data._size.height / 2 - parentNode.data._fixed_nested_edge_gap.bottom;
    }
    if (xPart == "left") {
      new_node_position.x = parentNode.position.x + parentNode.data._fixed_nested_edge_gap.left;
    }
    else if (xPart == "right") {
      new_node_position.x = parentNode.position.x + parentNode.data._size.width - parentNode.data._fixed_nested_edge_gap.right;
    }
    else if (xPart == "center") {
      new_node_position.x = parentNode.position.x + parentNode.data._size.width / 2 - parentNode.data._fixed_nested_edge_gap.right;
    }
    new_node.data._is_fixed_child_in_nest = true;
    new_node.data._fixed_position_in_nest = position.position;
    console.log("add fixed child node", new_node.data._fixed_position_in_nest)
    new_node.draggable = false;
  }
  else if (position.type === 'client') {
    new_node_position = { x: position.x, y: position.y };
  }
  // 递归设置局部position
  if (parentNodeId) {
    new_node.parentNode = parentNodeId;
    let curparentnode = parentNodeId;
    while (curparentnode) {
      if (curparentnode) {
        new_node_position.x -= getVFNodeById(curparentnode).position.x;
        new_node_position.y -= getVFNodeById(curparentnode).position.y;
      }
      curparentnode = getNestedNodeById(curparentnode)?.parentNode;
    }
  }
  // 设置为节点中心
  new_node_position.x -= node_init_info.init_width / 2;
  new_node_position.y -= node_init_info.init_height / 2;
  new_node.position = new_node_position;

  addNodes(new_node);
  if (node_init_info.init_data._fixed_nested_nodes) {
    console.log(`add ${node_init_info.init_data._fixed_nested_nodes.length} fixed nested nodes`);
    node_init_info.init_data._fixed_nested_nodes.forEach((n_node) => {
      recursiveAddNodeToVFlow(new_node.id, n_node.type, { type: "fixed", position: n_node.position });
    })
  }
};
const addNodeToVFlow = (parentNodeId, nodetype, position) => {
  recursiveAddNodeToVFlow(parentNodeId, nodetype, position);
  buildNestedNodeGraph();
  recursiveUpdateNodeSize(parentNodeId);
};
const removeNodeFromVFlow = (nodeId) => {

};
const addEdgeToVFlow = (edge) => {

};
const removeEdgeFromVFlow = (edge) => {

};
onNodeDrag((event) => {
  const e_nodes = event.nodes;
  e_nodes.forEach(node => {
    if (node.parentNode) {
      recursiveUpdateNodeSize(node.parentNode)
    }
  })
})
// 右键菜单相关代码
const showMenu = ref(false);
const menuOptions = reactive({
  theme: 'mac dark',
  zIndex: 3,
  minWidth: 50,
  x: 0,
  y: 0,
  items: [],
})
const showContextMenu = (event_cm) => {
  event_cm.event.preventDefault()
  showMenu.value = true
  menuOptions.x = event_cm.event.clientX
  menuOptions.y = event_cm.event.clientY
  menuOptions.items = [
    {
      label: '添加节点',
      children: Object.values(AllNodeInitInfos).map((node_init_info) => ({
        label: node_init_info.name,
        onClick: () => {
          const node_position = {
            type: 'client',
            ...screenToFlowCoordinate({
              x: event_cm.event.clientX,
              y: event_cm.event.clientY,
            })
          }
          addNodeToVFlow(event_cm.node?.id, node_init_info.type, node_position);
        },
      })),
    },
  ];
  if (event_cm.type === 'node') {
    menuOptions.items.push({
      label: '删除节点',
      onClick: () => onClickContextMenuRmNode(event_cm),
    });
  }
}
onNodeContextMenu((event) => {
  console.log("右键节点", event.node.id);
  const event_cm = {
    type: 'node',
    event: event.event,
    node: event.node,
  }
  showContextMenu(event_cm);
})
onPaneContextMenu((event) => {
  console.log("右键空白");
  const event_cm = {
    type: 'pane',
    event: event,
    node: null,
  }
  showContextMenu(event_cm);
})
onEdgeContextMenu((event) => {
  console.log("右键边");
  event.event.preventDefault();
})
</script>