<script setup>
import { ref, onMounted, reactive, inject, computed } from 'vue';
// =======================================================================================
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
import modePythonUrl from 'ace-builds/src-noconflict/mode-python?url';
ace.config.setModuleUrl('ace/mode/python', modePythonUrl);
import themeUrl from 'ace-builds/src-noconflict/theme-tomorrow_night_bright?url';
ace.config.setModuleUrl('ace/theme/tomorrow_night_bright', themeUrl);

// import workerBaseUrl from "ace-builds/src-noconflict/worker-base?url";
// ace.config.setModuleUrl("ace/mode/base", workerBaseUrl);
import snippetsPyhontUrl from "ace-builds/src-noconflict/snippets/python?url";
ace.config.setModuleUrl("ace/snippets/python", snippetsPyhontUrl);
import extSearchboxUrl from 'ace-builds/src-noconflict/ext-searchbox?url';
ace.config.setModuleUrl('ace/ext/searchbox', extSearchboxUrl);
import "ace-builds/src-noconflict/ext-language_tools";
ace.require("ace/ext/language_tools");
import extAutocompleterUrl from 'ace-builds/src-noconflict/ext-language_tools?url';
ace.config.setModuleUrl('ace/ext/autocompleter', extAutocompleterUrl);
const options = reactive({
    // useWorker: true, // 启用语法检查,必须为true
    enableBasicAutocompletion: true, // 自动补全
    enableLiveAutocompletion: true, // 智能补全
    enableSnippets: true, // 启用代码段
    showPrintMargin: false, // 去掉灰色的线，printMarginColumn
    highlightActiveLine: true, // 高亮行
    highlightSelectedWord: true, // 高亮选中的字符
    copyWithEmptySelection: true, // 复制时不选中任何内容则复制一整行
    tabSize: 4, // tab锁进字符
    fontSize: 14, // 设置字号
    cursorStyle: "ace", // 光标样式
    wrap: false, // 是否换行
    readOnly: false, // 是否可编辑
    // minLines: 10, // 最小行数，minLines和maxLines同时设置之后，可以不用给editor再设置高度
    // maxLines: 50, // 最大行数
    customScrollbar: true, // 自定义滚动条
    vScrollBarAlwaysVisible: true, // 永远显示垂直滚动条
});
// =======================================================================================

import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import { NText, NModal, NCard, NFlex } from 'naive-ui'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    }
})
const { findNode } = useVueFlow();
const isEditing = inject("isEditing");
const isShowCodeEditor = inject("isShowCodeEditor");
const thisnode = computed(() => {
    return findNode(props.nodeId);
});

</script>
<template>
    <n-modal v-model:show="isShowCodeEditor" :close-on-esc="false">
        <n-card :title="`${thisnode.data.label} —— ${thisnode.data.payloads.byId[pid].label}`" closable
            @close="isShowCodeEditor = false" :style="{ width: '90%' }" content-style="padding: 10px">
            <v-ace-editor v-model:value="thisnode.data.payloads.byId[pid].data" lang="python"
                theme="tomorrow_night_bright" :options="options" style="height: calc(100vh - 200px)"
                @blur="isEditing = false" @focus="isEditing = true" />
        </n-card>
    </n-modal>
</template>