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
} from 'naive-ui';
import { Panel, useVueFlow } from '@vue-flow/core'
import nodepanel from './nodepanel.vue'
import ctrlpanel from './ctrlpanel.vue';

const AceCodeEditor = defineAsyncComponent(() => import('./AceCodeEditor.vue'));

const props = defineProps({
    nodeId: {
        type: [String, null],
        required: true
    }
})
const isShowCodeEditor = ref(false);
const CodeEditorPath = ref([]);
const CodeEditorLangType = ref('CodePython');
provide('isShowCodeEditor', isShowCodeEditor);
provide('CodeEditorPath', CodeEditorPath);
provide('CodeEditorLangType', CodeEditorLangType);
const testbtn = () => {
    console.log('testbtn')
}
</script>

<template>
    <Panel position="top-left" :style="{ width: 'auto' }">
        <n-flex justify="flex-start">
            <n-text>自动保存</n-text>
        </n-flex>
    </Panel>
    <Panel position="top-center" :style="{ width: 'auto' }">
        <n-flex justify="center">
            <n-button quaternary type="primary" @click="testbtn">
                当前工作流/xxxxxxxxxxx
            </n-button>
        </n-flex>
    </Panel>
    <Panel position="top-right" :style="{ width: 'auto' }">
        <ctrlpanel :nodeId="nodeId" />
    </Panel>
    <Panel class="nodepanel" position="top-right">
        <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
    </Panel>
    <AceCodeEditor v-if="!!nodeId" :nodeId="nodeId" :path="CodeEditorPath" :langtype="CodeEditorLangType" />

</template>

<style scoped>
.nodepanel {
    margin-top: 65px;
    width: 600px;
}

.nodepanel:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>