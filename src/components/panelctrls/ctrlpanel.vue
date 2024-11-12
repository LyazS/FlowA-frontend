<script setup>
import { computed, ref, watch, defineAsyncComponent } from 'vue';
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
// import { onSave, onRestore } from '../../utils/tools.js'
const message = useMessage();

const testclick = () => {
    message.success('test')
}
const { toObject, fromObject } = useVueFlow()

function onSave(flowKey) {
    localStorage.setItem(flowKey, JSON.stringify(toObject()));
}

function onRestore(flowKey) {
    const flow = JSON.parse(localStorage.getItem(flowKey));

    if (flow) {
        fromObject(flow);
    }
}
</script>

<template>
    <n-flex justify="flex-end">
        <n-button class="glow-btn" strong tertiary round type="success" @click="onSave('vueflow-store')">保存</n-button>
        <n-button class="glow-btn" strong tertiary round type="success"
            @click="onRestore('vueflow-store')">载入</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">运行</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导入</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导出</n-button>
    </n-flex>
</template>
<style scoped>
.glow-btn:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>