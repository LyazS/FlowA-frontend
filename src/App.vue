<template>
  <VueFlow class="basic-flow" :connection-mode="ConnectionMode.Strict" :connection-radius="30" :nodes="init_vfnodes"
    :edges="init_vfedges" :nodeTypes="nodeTypes" fit-view-on-init elevate-edges-on-select>
    <template #connection-line="{ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }">
      <ConnectionLine :source-x="sourceX" :source-y="sourceY" :target-x="targetX" :target-y="targetY"
        :source-position="sourcePosition" :target-position="targetPosition" />
    </template>
    <TestMiniMap :scale="'75%'" :translateX="'-40px'" :translateY="'-40px'" />
    <n-flex>
      <TestControls :scale="'120%'" :translateX="'5px'" />
    </n-flex>
    <Background />
    <Panel v-if="isShowNodeInfo" position="top-right">
      <div :style="{ color: 'white' }">{{ nodeInfo }}</div>
    </Panel>
  </VueFlow>
  <ContextMenu v-model:show="showMenu" :options="menuOptions" />
</template>

<script setup>
import { ref, markRaw, onMounted, reactive, watch } from 'vue'
import { ConnectionMode, VueFlow, Panel, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls, ControlButton } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { NIcon, NTag, useMessage, NButton, NModal, NDrawer, NDrawerContent, NTabs, NTab, NDropdown, NGrid, NGridItem, NH3, NText, NSpin, NFlex } from 'naive-ui';
// import { ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem } from '@imengyu/vue3-context-menu';

const {
  getNodes,
  getEdges,
  getSelectedNodes,
  addNodes,
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
const init_vfnodes = ref([]);
const init_vfedges = ref([]);
const all_node_modules = {};
const initAllNodes = async () => {
  const modules = import.meta.glob('./components/**/node.js');
  Object.keys(modules).forEach(async (key) => {
    const module = await modules[key]();
    all_node_modules[module.nodename] = {
      nodename: module.nodename,
      initNodeFunc: module.initNodeFunc,
      NodeVue: module.NodeVue,
    };
  });
  console.log("all_node_modules", all_node_modules);
};

onMounted(async () => {
  await initAllNodes();
})
const addNodeToVFlow = (node) => {

};
const removeNodeFromVFlow = (node) => {

};
const addEdgeToVFlow = (edge) => {

};
const removeEdgeFromVFlow = (edge) => {

};

</script>