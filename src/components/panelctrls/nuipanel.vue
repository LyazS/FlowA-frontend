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
import hljs from 'highlight.js/lib/core'
import python_hljs from 'highlight.js/lib/languages/python'
import javascript_hljs from 'highlight.js/lib/languages/javascript'
import { max } from 'lodash';

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

const testbtn = () => {
    console.log('testbtn')
}
</script>

<template>
    <n-config-provider :theme="darkTheme" :hljs="hljs">
        <n-message-provider>
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
            <Panel position="top-right" :style="{ width: '600px' }">
                <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
            </Panel>
            <AceCodeEditor v-if="!!nodeId" :nodeId="nodeId" :path="CodeEditorPath" :langtype="CodeEditorLangType" />
        </n-message-provider>
    </n-config-provider>
</template>

<style scoped></style>