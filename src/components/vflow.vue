<template>
    <VueFlow class="basic-flow" :connection-mode="ConnectionMode.Strict" :connection-radius="30"
        zoom-activation-key-code="Space" :nodeTypes="AllVFNodeTypes" fit-view-on-init :max-zoom="4" :min-zoom="0.1"
        :select-nodes-on-drag="false" elevate-edges-on-select>
        <Background />
        <!-- <miniMap /> -->
        <miniMapCtrl />
        <nuipanel :nodeId="lastClickedNodeId" />

        <template #edge-normal="buttonEdgeProps">
            <normal_edge :id="buttonEdgeProps.id" :source-x="buttonEdgeProps.sourceX"
                :source-y="buttonEdgeProps.sourceY" :target-x="buttonEdgeProps.targetX"
                :target-y="buttonEdgeProps.targetY" :source-position="buttonEdgeProps.sourcePosition"
                :target-position="buttonEdgeProps.targetPosition" :marker-end="buttonEdgeProps.markerEnd"
                :style="buttonEdgeProps.style" />
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
    background: rgb(0, 0, 0);
}
</style>

<script setup>
import { cloneDeep } from 'lodash';
import { ref, markRaw, onMounted, onBeforeUnmount, reactive, watch, provide } from 'vue'
import { ConnectionMode, VueFlow, Panel, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ContextMenu } from '@imengyu/vue3-context-menu';
import {
    useMessage,
    darkTheme,
    NConfigProvider,
    NMessageProvider,
} from 'naive-ui';
import miniMapCtrl from '@/components/panelctrls/miniMapCtrl.vue'
import nuipanel from '@/components/panelctrls/nuipanel.vue'
import normal_edge from '@/components/edges/normal_edge/edge.vue'
import connect_edge from '@/components/edges/connect_edge/edge.vue'

import { useVFlowInitial } from '@/hooks/useVFlowInitial.js'
import { useVFlowManagement } from '@/hooks/useVFlowManagement.js'
import { useFlowEvents } from '@/hooks/useFlowEvents.js'
import { useContextMenu } from '@/hooks/useContextMenu.js'
import { useKeyboardControls } from '@/hooks/useKeyboardControls.js'

const {
    AllVFNodeTypes,
    initAllNodeInfos,
    getAddNodeList,
    getVFNodeTypes,
    cloneVFNodeInitInfo,
    getVFNodeCount,
    increaseVFNodeCount,
} = useVFlowInitial()
const {
    getNestedNodeById,
    buildNestedNodeGraph,
    recursiveUpdateNodeSize,
    recursiveAddNodeToVFlow,
    addNodeToVFlow,
    removeNodeFromVFlow,
    addEdgeToVFlow,
} = useVFlowManagement()

const {
    lastClickedNodeId
} = useFlowEvents()

const {
    onClickContextMenuRmNode,
    showMenu,
    menuOptions,
    AddNodeList,
    showContextMenu,
} = useContextMenu()

const {
    isEditing,
    addKBEventListeners,
    removeKBEventListeners,
} = useKeyboardControls()

provide('isEditing', isEditing);
watch(isEditing, (new_val) => {
    console.log("isEditing", new_val);
})
onMounted(async () => {
    await initAllNodeInfos();
    buildNestedNodeGraph();
    addKBEventListeners();
})
onBeforeUnmount(() => {
    removeKBEventListeners();
})

</script>