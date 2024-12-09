<script setup>
import { computed, provide, ref, h, watch, inject, onMounted, onUnmounted, nextTick } from 'vue';
import {
    useMessage,
    useDialog,
    darkTheme,
    NConfigProvider,
    NMessageProvider,
    NCard,
    NButton,
    NInput,
    NFlex,
} from 'naive-ui';
import { useVueFlow } from '@vue-flow/core'
import { useVFlowManagement } from '@/hooks/useVFlowManagement';
import { useVFlowInitial } from '@/hooks/useVFlowInitial'
import { useFlowAOperation } from '@/services/useFlowAOperation'
import { setValueByPath } from "@/utils/tools"
import FlowSaver from "@/components/panelctrls/FlowSaver.vue"
const { TaskID, TaskName, runflow, saveWorkflow } = useFlowAOperation();
const message = useMessage();
const dialog = useDialog()
const isEditing = inject("isEditing");

const {
    buildNestedNodeGraph,
    resetNodeState,
} = useVFlowManagement()
const { reBuildCounter } = useVFlowInitial()

const { getNodes, toObject, fromObject, findNode, removeNodes } = useVueFlow()

const isShowWFSaver = ref(false);
provide("isShowWFSaver", isShowWFSaver);

const run_loading = ref(false)
const click2runflow = async () => {
    for (const node of getNodes.value) {
        resetNodeState(node);
    }
    await nextTick();
    const vflow = toObject();
    const res = await runflow(
        { name: TaskName.value, vflow: vflow },
        {
            before: async () => {
                run_loading.value = true;
            },
            success: (data) => {
                run_loading.value = false;
                if (data.success) {
                    message.success('已发送运行');
                    TaskID.value = data.tid;
                    if (!TaskName.value) TaskName.value = data.tid;
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
}
onUnmounted(() => { })
</script>

<template>
    <n-flex justify="flex-end">
        <n-button class="glow-btn" strong tertiary round type="success" @click="isShowWFSaver = true">保存</n-button>
        <!-- <n-button class="glow-btn" strong tertiary round type="success" @click="onRestore('vueflow-store')"
            :loading="restore_loading">载入</n-button> -->
        <n-button class="glow-btn" strong tertiary round type="success" @click="click2runflow"
            :loading="run_loading">运行</n-button>
        <!-- <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导入</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导出</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">工具</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">检查清单</n-button> -->
    </n-flex>
    <FlowSaver />
</template>
<style scoped>
.glow-btn:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>