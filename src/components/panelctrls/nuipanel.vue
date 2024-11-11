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
import AceCodeEditor from './AceCodeEditor.vue';
import hljs from 'highlight.js/lib/core'
import python_hljs from 'highlight.js/lib/languages/python'
import javascript_hljs from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('python', python_hljs)
hljs.registerLanguage('javascript', javascript_hljs)

const props = defineProps({
    nodeId: {
        type: [String, null],
        required: true
    }
})
const isShowCodeEditor = ref(false);
const CodeEditorPid = ref('');
provide('isShowCodeEditor', isShowCodeEditor);
provide('CodeEditorPid', CodeEditorPid);

</script>

<template>
    <n-config-provider :theme="darkTheme" :hljs="hljs">
        <n-message-provider>
            <Panel position="top-right" :style="{ width: '600px' }">
                <ctrlpanel :nodeId="nodeId" />
                <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
            </Panel>
            <AceCodeEditor v-if="!!nodeId" :nodeId="nodeId" :pid="CodeEditorPid" />
        </n-message-provider>
    </n-config-provider>
</template>

<style scoped></style>