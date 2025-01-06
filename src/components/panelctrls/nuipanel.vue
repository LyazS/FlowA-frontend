<script setup>
import { computed, ref, watch, provide, defineAsyncComponent } from 'vue';
import {
    useMessage,
    darkTheme,
    NConfigProvider,
    NMessageProvider,
    NCard,
    NButton,
    NFlex,
    NText,
    NSelect,
    NInputGroup,
    NInputGroupLabel,
    NEllipsis,
} from 'naive-ui';
import { Panel, useVueFlow } from '@vue-flow/core'
import { useVFlowManagement } from '@/hooks/useVFlowManagement'
import { useFlowAOperation } from '@/services/useFlowAOperation'
import nodepanel from './nodepanel.vue'
import ctrlpanel from './ctrlpanel.vue';
const AceCodeEditor = defineAsyncComponent(() => import('./AceCodeEditor.vue'));
const FlowResults = defineAsyncComponent(() => import('./FlowResults.vue'));
const FlowRename = defineAsyncComponent(() => import('@/components/panelctrls/FlowRename.vue'));
const FlowCreator = defineAsyncComponent(() => import('@/components/panelctrls/FlowCreator.vue'));
const Jinja2Render = defineAsyncComponent(() => import('@/components/panelctrls/Jinja2Render.vue'));
const props = defineProps({
    nodeId: {
        type: [String, null],
        required: true
    }
})
const { TaskID, WorkflowName, AutoSaveMessage } = useFlowAOperation();
const isShowCodeEditor = ref(false);
const CodeEditorPath = ref([]);
const CodeEditorLangType = ref('CodePython');
provide('isShowCodeEditor', isShowCodeEditor);
provide('CodeEditorPath', CodeEditorPath);
provide('CodeEditorLangType', CodeEditorLangType);
const isShowFlowResults = ref(false);
provide('isShowFlowResults', isShowFlowResults);
const isShowWFRename = ref(false);
provide("isShowWFRename", isShowWFRename);
const isShowWFCreator = ref(false);
provide("isShowWFCreator", isShowWFCreator);
const isShowJinja2Render = ref(false);
provide("isShowJinja2Render", isShowJinja2Render);
</script>

<template>
    <Panel position="top-left" :style="{ width: 'auto' }">
        <n-flex justify="flex-start">
            <n-text depth="3">{{ AutoSaveMessage }}</n-text>
        </n-flex>
    </Panel>
    <Panel position="top-right" :style="{ width: 'auto' }">
        <ctrlpanel />
    </Panel>
    <Panel class="nodepanel" position="top-right">
        <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
    </Panel>
    <AceCodeEditor v-if="!!nodeId" :nodeId="nodeId" :path="CodeEditorPath" :langtype="CodeEditorLangType" />
    <FlowResults />
    <FlowRename />
    <FlowCreator />
    <Jinja2Render v-if="isShowJinja2Render && TaskID" />
</template>

<style scoped>
.nodepanel {
    margin-top: 65px;
    width: 600px;
    border-radius: 10px;
}

.nodepanel:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>