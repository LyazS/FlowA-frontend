<template>
  <VueFlow class="basic-flow" :connection-mode="ConnectionMode.Strict" :connection-radius="30"
    zoom-activation-key-code="Space" :nodeTypes="AllVFNodeTypes" fit-view-on-init :max-zoom="4" :min-zoom="0.1"
    :select-nodes-on-drag="false">
    <Background />
    <miniMap />
    <miniMapCtrl />
    <nuipanel :nodeId="lastClickedNodeId" />
    <template #edge-closebtn="buttonEdgeProps">
      <closebtn_edge :id="buttonEdgeProps.id" :source-x="buttonEdgeProps.sourceX" :source-y="buttonEdgeProps.sourceY"
        :target-x="buttonEdgeProps.targetX" :target-y="buttonEdgeProps.targetY"
        :source-position="buttonEdgeProps.sourcePosition" :target-position="buttonEdgeProps.targetPosition"
        :marker-end="buttonEdgeProps.markerEnd" :style="buttonEdgeProps.style" />
    </template>
    <template #connection-line="{ sourceX, sourceY, targetX, targetY }">
      <connect_edge :source-x="sourceX" :source-y="sourceY" :target-x="targetX" :target-y="targetY" />
    </template>
  </VueFlow>
  <ContextMenu v-model:show="showMenu" :options="menuOptions" />
</template>

<style scoped>
.basic-flow {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background: rgb(16, 16, 20);
}
</style>

<script setup>
import _ from 'lodash';
import { ref, markRaw, onMounted, onBeforeUnmount, reactive, watch } from 'vue'
import { darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui'
import { ConnectionMode, VueFlow, Panel, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls, ControlButton } from '@vue-flow/controls'
import { NIcon, NTag, useMessage, NButton, NModal, NDrawer, NDrawerContent, NTabs, NTab, NDropdown, NGrid, NGridItem, NH3, NText, NSpin, NFlex } from 'naive-ui';
import { ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem } from '@imengyu/vue3-context-menu';
import { getUuid } from './utils/tools.js';
import miniMap from './components/panelctrls/miniMap.vue'
import miniMapCtrl from './components/panelctrls/miniMapCtrl.vue'
import nuipanel from './components/panelctrls/nuipanel.vue'
import closebtn_edge from './components/edges/closebtn_edge/edge.vue'
import connect_edge from './components/edges/connect_edge/edge.vue'
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

const NestedNodeGraph = ref({});
const AllNodeInitInfos = {};
const AllVFNodeTypes = reactive({});
let AddNodeListFromInitInfos = [];

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

const initAllNodeInfos = async () => {
  const modules = import.meta.glob('./components/nodes/**/node.js');
  const promises = Object.keys(modules).map(async (key) => {
    const module = await modules[key]();
    const initInfo = module.initInfo;
    AllNodeInitInfos[initInfo.node_key] = initInfo;
    if (!AllVFNodeTypes.hasOwnProperty(initInfo.node_type)) {
      AllVFNodeTypes[initInfo.node_type] = markRaw(module.NodeVue);
    }
  });

  // 等待所有异步操作完成
  await Promise.all(promises);

  console.log("AllNodeInitInfos", AllNodeInitInfos);
  console.log("all nodeTypes", AllVFNodeTypes);

  // 排序节点列表
  AddNodeListFromInitInfos = Object.entries(AllNodeInitInfos)
    .sort((a, b) => a[0].localeCompare(b[0])) // 按key排序
    .map(([key, item]) => item)
    .filter(item => !item.init_data._is_attached);
  console.log("AddNodeListFromInitInfos", AddNodeListFromInitInfos);
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
  // console.log("NestedNodeGraph", NestedNodeGraph.value);
  // console.log("getNodes", getNodes.value);
  // console.log("edges", getEdges.value);
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
    if (!!vf_node_child.data._is_attached) return;
    minX = Math.min(minX, vf_node_child.position.x + vf_node_pos.x);
    minY = Math.min(minY, vf_node_child.position.y + vf_node_pos.y);
    maxX = Math.max(maxX, vf_node_child.position.x + vf_node_pos.x + vf_node_child.data.size.width);
    maxY = Math.max(maxY, vf_node_child.position.y + vf_node_pos.y + vf_node_child.data.size.height);
  })

  // 按照最小尺寸更新父节点尺寸
  let vf_node_tgt_wd = (maxX - minX) + vf_node.data.nested_pad.left + vf_node.data.nested_pad.right;
  let vf_node_tgt_ht = (maxY - minY) + vf_node.data.nested_pad.top + vf_node.data.nested_pad.bottom;
  vf_node.data.size.width = Math.max(vf_node_tgt_wd, vf_node.data.min_size.width);
  vf_node.data.size.height = Math.max(vf_node_tgt_ht, vf_node.data.min_size.height);
  vf_node.style.width = `${vf_node.data.size.width}px`;
  vf_node.style.height = `${vf_node.data.size.height}px`;

  // 更新子节点位置
  nested_node.children.forEach(childId => {
    let vf_node_child = getVFNodeById(childId);
    // 固定位置的子节点
    if (!!vf_node_child.data._is_attached) {
      let [yPart, xPart] = vf_node_child.data.attached_pos.split('-');
      if (yPart == "bottom") {
        vf_node_child.position.y = vf_node.data.size.height - vf_node.data.attached_pad.bottom;
      }
      else if (yPart == "center") {
        vf_node_child.position.y = vf_node.data.size.height / 2 - vf_node.data.attached_pad.bottom;
      }
      if (xPart == "right") {
        vf_node_child.position.x = vf_node.data.size.width - vf_node.data.attached_pad.right;
      }
      else if (xPart == "center") {
        vf_node_child.position.x = vf_node.data.size.width / 2 - vf_node.data.attached_pad.right;
      }
      if (yPart != "top") vf_node_child.position.y -= vf_node_child.data.size.height / 2;
      if (xPart != "left") vf_node_child.position.x -= vf_node_child.data.size.width / 2;
    }
    else {
      vf_node_child.position.x += vf_node_pos.x - (minX - vf_node.data.nested_pad.left);
      vf_node_child.position.y += vf_node_pos.y - (minY - vf_node.data.nested_pad.top);
    }
  });

  // 更新父节点位置
  vf_node.position = { x: minX - vf_node.data.nested_pad.left, y: minY - vf_node.data.nested_pad.top };

  // 递归更新父节点大小
  recursiveUpdateNodeSize(nested_node.parentNode);
}

const recursiveAddNodeToVFlow = (parentNodeId, nodekey, position) => {
  console.log("addNodeToVFlow", parentNodeId, nodekey, position);
  const parentNode = getVFNodeById(parentNodeId);

  const node_init_info = _.cloneDeep(AllNodeInitInfos[nodekey]);
  const offset_size = { width: node_init_info.init_width + 8, height: node_init_info.init_height + 8 };
  let new_node = {
    id: getUuid(),
    type: node_init_info.node_type,
    data: node_init_info.init_data,
    style: {
      width: `${offset_size.width}px`,
      height: `${offset_size.height}px`,
    },
  };
  new_node.data.size.width = offset_size.width;
  new_node.data.size.height = offset_size.height;

  // 设置全局position
  let new_node_position = { x: 0, y: 0 };
  if (position.type == 'attached' && !!parentNode) {
    const [yPart, xPart] = position.position.split('-');
    if (yPart == "top") {
      new_node_position.y = parentNode.position.y + parentNode.data.attached_pad.top;
    }
    else if (yPart == "bottom") {
      new_node_position.y = parentNode.position.y + parentNode.data.size.height - parentNode.data.attached_pad.bottom;
    }
    else if (yPart == "center") {
      new_node_position.y = parentNode.position.y + parentNode.data.size.height / 2 - parentNode.data.attached_pad.bottom;
    }
    if (xPart == "left") {
      new_node_position.x = parentNode.position.x + parentNode.data.attached_pad.left;
    }
    else if (xPart == "right") {
      new_node_position.x = parentNode.position.x + parentNode.data.size.width - parentNode.data.attached_pad.right;
    }
    else if (xPart == "center") {
      new_node_position.x = parentNode.position.x + parentNode.data.size.width / 2 - parentNode.data.attached_pad.right;
    }
    new_node.data._is_attached = true;
    new_node.data.attached_pos = position.position;
    new_node.data._attached_type = position.attached_type;
    new_node.draggable = false;
    new_node.selectable = false;
    console.log("add fixed child node in", new_node.data.attached_pos)
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
  new_node_position.x -= offset_size.width / 2;
  new_node_position.y -= offset_size.height / 2;
  new_node.position = new_node_position;

  addNodes(new_node);
  if (node_init_info.init_data.attached_nodes) {
    console.log(`add ${node_init_info.init_data.attached_nodes.length} fixed nested nodes`);
    node_init_info.init_data.attached_nodes.forEach((n_node) => {
      recursiveAddNodeToVFlow(new_node.id, n_node.node_type, { type: "attached", position: n_node.pos, attached_type: n_node.attached_type });
    })
  }
};
const addNodeToVFlow = (parentNodeId, nodekey, position) => {
  recursiveAddNodeToVFlow(parentNodeId, nodekey, position);
  buildNestedNodeGraph();
  recursiveUpdateNodeSize(parentNodeId);
};
const removeNodeFromVFlow = (node) => {
  let need_del = [];
  let want_del = [node];
  while (want_del.length > 0) {
    let cur_node = want_del.shift();
    need_del.push(cur_node);
    let children = NestedNodeGraph.value[cur_node.id].children;
    children.forEach(child_id => {
      let child_node = getVFNodeById(child_id);
      if (child_node) {
        want_del.push(child_node);
      }
    })
  }
  removeNodes(need_del);
};
const addEdgeToVFlow = (params) => {
  if ((params.sourceHandle == "output"
    && params.targetHandle == "input")
    || (params.sourceHandle == "callbackUser"
      && params.targetHandle == "callbackFunc")) {
    params.type = 'closebtn';
    addEdges(params);
  }
};

// 右键菜单相关代码 ========================================================
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
  return AddNodeListFromInitInfos.map(item => ({
    label: item.init_data.label,
    onClick: () => {
      console.log("add node", item.node_key);
      let node_position = {
        type: 'client',
        ...screenToFlowCoordinate({
          x: event_cm.event.clientX,
          y: event_cm.event.clientY,
        })
      };
      addNodeToVFlow(event_cm.node?.id, item.node_key, node_position);
    },
  }));
};

const showContextMenu = (event_cm) => {
  menuOptions.x = event_cm.event.clientX
  menuOptions.y = event_cm.event.clientY
  showMenu.value = (event_cm.type === 'node' && !event_cm.node.data._is_attached) || (event_cm.type === 'pane');
  let show_add_node = (event_cm.type === 'node' && event_cm.node.data._is_nested) || (event_cm.type === 'pane');
  let show_rm_node = (event_cm.type === 'node' && !event_cm.node.data._is_attached);
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
}

// 节点选择事件 =================================================
const lastClickedNodeId = ref(null);
const selcetNodeEvent = (event) => {
  const node = event.node;
  if (node.data._is_attached) return;
  // 如果点击的是同一个节点，不做任何操作
  if (lastClickedNodeId.value === node.id) return;
  // 如果之前有选中的节点，先取消选中
  if (lastClickedNodeId.value) {
    console.log(`Node ${lastClickedNodeId.value} deselected`);
    lastClickedNodeId.value = null;
  }
  console.log(`Node ${node.id} selected`);
  lastClickedNodeId.value = node.id;
};
watch(getSelectedNodes, (nodes) => {
  // 如果选中的节点数量不为1，说明是批量选择或取消选择
  if (nodes.length !== 1) {
    if (lastClickedNodeId.value) {
      console.log(`Node ${lastClickedNodeId.value} deselected`);
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
})

onConnect((event) => {
  console.log("连接", event);
  addEdgeToVFlow(event);
})
onMounted(async () => {
  await initAllNodeInfos();
  buildNestedNodeGraph();

  // 快捷键监听
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('mousemove', handleMouseMove)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('mousemove', handleMouseMove)
})

// 快捷键设置 ===============================================================
const isSpacePressed = ref(false);
const lastMousePosition = ref({ x: 0, y: 0 });
const currentMousePosition = ref({ x: 0, y: 0 });
// 始终跟踪鼠标位置
const trackMousePosition = (event) => {
  currentMousePosition.value = { x: event.clientX, y: event.clientY };
}
// 监听空格键按下和释放
const handleKeyDown = (event) => {
  if (event.code === 'Space') {
    // 阻止默认行为，防止触发 VueFlow 的内置平移模式
    event.preventDefault();
    isSpacePressed.value = true;
    document.body.style.cursor = 'grabbing';
    // 使用当前跟踪的鼠标位置作为起始点
    lastMousePosition.value = { ...currentMousePosition.value };
  }
}

const handleKeyUp = (event) => {
  if (event.code === 'Space') {
    isSpacePressed.value = false;
    document.body.style.cursor = 'default';
  }
}

// 只需要监听鼠标移动事件
const handleMouseMove = (event) => {
  trackMousePosition(event);
  if (isSpacePressed.value) {
    const deltaX = event.clientX - lastMousePosition.value.x;
    const deltaY = event.clientY - lastMousePosition.value.y;

    const cur_viewport = getViewport();
    setViewport({
      x: cur_viewport.x + deltaX,
      y: cur_viewport.y + deltaY,
      zoom: cur_viewport.zoom
    });
    lastMousePosition.value = { x: event.clientX, y: event.clientY };
  }
}
</script>