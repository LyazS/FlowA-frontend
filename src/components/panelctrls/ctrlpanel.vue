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
import { SubscribeSSE } from '@/services/useSSE'
import { setValueByPath } from "@/utils/tools"
const { runflow } = useFlowAOperation();
const message = useMessage();

const { buildNestedNodeGraph } = useVFlowManagement()
const { reBuildCounter } = useVFlowInitial()

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
const updateNodeFromSSE = (data) => {
    const nid = data.nid;
    const updatedatas = data.data;
    for (const udata of updatedatas) {
        const data = udata.data;
        const path = udata.path;
        const type = udata.type;
        if (type === "overwrite") {
            const thenode = findNode(nid);
            setValueByPath(thenode.data, path, data);
        }
        else if (type === "append") { }
        else if (type === "remove") { }
    }
}
const { subscribe, unsubscribe } = SubscribeSSE(
    'GET',
    null,
    null,
    // onOpen
    async (response) => {
        console.log("onopen SSE", response.ok);
    },
    // onMessage
    async (event) => {
        console.log("onmessage SSE");
        if (event.event === "updatenode") {
            let data = JSON.parse(event.data);
            console.log(data);
            updateNodeFromSSE(data);
        }
        else if (event.event === "batchupdatenode") {
            let datas = JSON.parse(event.data);
            for (const data of datas) {
                updateNodeFromSSE(data);
            }
        }
        else if (event.event === "internalerror") {
            let data = JSON.parse(event.data);
            console.log(data);
            message.error(`内部错误: ${data}`);
        }
        else if (event.event === "flowfinish") {
            message.success('工作流运行完成');
            unsubscribe();
        }
    },
    // onClose
    async () => {
        console.log("onclose SSE");
    },
    // onError
    async (err) => {
        console.log("onerror SSE", err);
    },
);
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
        subscribe(`${import.meta.env.VITE_API_URL}/api/progress?taskid=${res.tid}`)
    }
}
onUnmounted(() => {
    unsubscribe();
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