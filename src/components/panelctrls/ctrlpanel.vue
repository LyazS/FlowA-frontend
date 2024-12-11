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
import FlowRename from "@/components/panelctrls/FlowRename.vue"
import FlowCreator from '@/components/panelctrls/FlowCreator.vue';

const { TaskID, WorkflowID, WorkflowName, runflow, createNewWorkflow } = useFlowAOperation();
const message = useMessage();
const dialog = useDialog()
const isEditing = inject("isEditing");

const {
    buildNestedNodeGraph,
    resetNodeState,
} = useVFlowManagement()
const { reBuildCounter } = useVFlowInitial()

const { getNodes, toObject, fromObject, findNode, removeNodes } = useVueFlow()

const isShowWFRename = ref(false);
provide("isShowWFRename", isShowWFRename);
const isShowWFCreator = ref(false);
provide("isShowWFCreator", isShowWFCreator);

const run_loading = ref(false)
const click2runflow = async () => {
    for (const node of getNodes.value) {
        resetNodeState(node);
    }
    await nextTick();
    const vflow = toObject();
    const res = await runflow(
        { wid: WorkflowID.value, vflow: vflow },
        {
            before: async () => {
                run_loading.value = true;
            },
            success: (data) => {
                run_loading.value = false;
                if (data.success) {
                    message.success('已发送运行');
                    TaskID.value = data.tid;
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

const newWorkflow = async () => {
    dialog.info({

    })
}
</script>

<template>
    <n-flex justify="flex-end">
        <n-button class="glow-btn" strong tertiary round type="success" @click="isShowWFCreator = true">新建</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="isShowWFRename = true">重命名</n-button>
        <!-- <n-button class="glow-btn" strong tertiary round type="success" @click="onRestore('vueflow-store')"
            :loading="restore_loading">载入</n-button> -->
        <n-button class="glow-btn" strong tertiary round type="success" @click="click2runflow"
            :loading="run_loading">运行</n-button>
        <!-- <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导入</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">导出</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">工具</n-button>
        <n-button class="glow-btn" strong tertiary round type="success" @click="testclick">检查清单</n-button> -->
    </n-flex>
    <FlowRename />
    <FlowCreator />
</template>
<style scoped>
.glow-btn:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>