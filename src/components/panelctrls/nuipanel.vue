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
} from 'naive-ui';
import { Panel, useVueFlow } from '@vue-flow/core'
import nodepanel from './nodepanel.vue'
import ctrlpanel from './ctrlpanel.vue';
import hljs from 'highlight.js/lib/core'
import python_hljs from 'highlight.js/lib/languages/python'
import javascript_hljs from 'highlight.js/lib/languages/javascript'

const AceCodeEditor = defineAsyncComponent(() => import('./AceCodeEditor.vue'));

hljs.registerLanguage('python', python_hljs)
hljs.registerLanguage('javascript', javascript_hljs)

const props = defineProps({
    nodeId: {
        type: [String, null],
        required: true
    }
})
const isShowCodeEditor = ref(false);
const CodeEditorPath = ref([]);
const CodeEditorLangType = ref('Code<Python>');
provide('isShowCodeEditor', isShowCodeEditor);
provide('CodeEditorPath', CodeEditorPath);
provide('CodeEditorLangType', CodeEditorLangType);
</script>

<template>
    <n-config-provider :theme="darkTheme" :hljs="hljs">
        <n-message-provider>
            <Panel position="top-right" :style="{ width: '600px' }">
                <ctrlpanel :nodeId="nodeId" />
                <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
            </Panel>
            <AceCodeEditor :nodeId="nodeId" :path="CodeEditorPath" :langtype="CodeEditorLangType" />
        </n-message-provider>
    </n-config-provider>
</template>

<style scoped></style>