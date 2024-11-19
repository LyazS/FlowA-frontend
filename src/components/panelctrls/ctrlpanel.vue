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
import { useVueFlow } from '@vue-flow/core'
import { useVFlowManagement } from '@/hooks/useVFlowManagement';
import { useVFlowInitial } from '@/hooks/useVFlowInitial'
import { runflow } from '@/services/run_flow'
const message = useMessage();

const { buildNestedNodeGraph } = useVFlowManagement()
const { reBuildCounter } = useVFlowInitial()
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
        buildNestedNodeGraph();
        reBuildCounter();
    }
}
const click2runflow = async () => {
    await runflow();
    message.success('已发送运行')
}
</script>

<template>
    <n-flex justify="flex-end">
        <n-button class="glow-btn" strong tertiary round type="success" @click="onSave('vueflow-store')">自动保存</n-button>
        <n-button class="glow-btn" strong tertiary round type="success"
            @click="onRestore('vueflow-store')">载入</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="click2runflow">运行</n-button>
        <!-- <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导入</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导出</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">工具</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">检查清单</n-button> -->
    </n-flex>
</template>
<style scoped>
.glow-btn:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>