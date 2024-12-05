<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
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
import { useFlowAOperation } from '@/services/run_flow'
import { setValueByPath } from "@/utils/tools"
const { runflow } = useFlowAOperation();
const message = useMessage();

const {
    buildNestedNodeGraph,
    subscribeSSE,
    unsubscribeSSE,
} = useVFlowManagement()
const { reBuildCounter, TaskID } = useVFlowInitial()

const { toObject, fromObject, findNode } = useVueFlow()

function onSave(flowKey) {
    localStorage.setItem(flowKey, JSON.stringify(toObject()));
}

function onRestore(flowKey) {
    const flow = JSON.parse(localStorage.getItem(flowKey));

    if (flow) {
        for (const node of flow.nodes) {
            if (node.data.state?.status) { node.data.state.status = "Default"; }
        }
        fromObject(flow);
        buildNestedNodeGraph();
        reBuildCounter();
    }
}

const run_loading = ref(false)
const click2runflow = async () => {
    const vflow = toObject();
    const res = await runflow(
        vflow,
        {
            before: () => {
                run_loading.value = true;
            },
            success: (data) => {
                run_loading.value = false;
                if (data.success) {
                    message.success('已发送运行');
                }
                else {
                    message.error(`工作流验证失败，请检查`);
                }
            },
            error: (err) => {
                run_loading.value = false;
                message.error(`运行失败: ${err}`)
            },
        },
    );
    console.log(res);
    if (res.success) {
        TaskID.value = res.tid;
        console.log("TaskID ", TaskID.value);
        subscribeSSE(`${import.meta.env.VITE_API_URL}/api/progress?taskid=${TaskID.value}`)
    }
}
onUnmounted(() => {
    unsubscribeSSE();
})
</script>

<template>
    <n-flex justify="flex-end">
        <n-button class="glow-btn" strong tertiary round type="success" @click="onSave('vueflow-store')">自动保存</n-button>
        <n-button class="glow-btn" strong tertiary round type="success"
            @click="onRestore('vueflow-store')">载入</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="click2runflow"
            :loading="run_loading">运行</n-button>
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