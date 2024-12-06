<script setup>
import { computed, ref, h, watch, inject, onMounted, onUnmounted, nextTick } from 'vue';
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
import { useFlowAOperation } from '@/services/run_flow'
import { setValueByPath } from "@/utils/tools"
const { runflow } = useFlowAOperation();
const message = useMessage();
const dialog = useDialog()
const isEditing = inject("isEditing");

const {
    buildNestedNodeGraph,
    resetNodeState,
    TaskID,
    TaskName,
    saveWorkflow,
} = useVFlowManagement()
const { reBuildCounter } = useVFlowInitial()

const { getNodes, toObject, fromObject, findNode, removeNodes } = useVueFlow()

const saveWflowName = ref("")
const onSave = () => {
    dialog.info({
        title: '保存工作流',
        content: () => (
            h(NInput, {
                placeholder: `默认为【${TaskID.value}】`,
                value: saveWflowName.value,
                onInput: (value) => {
                    if (value.trim() !== "") {
                        saveWflowName.value = value.trim();
                    }
                    else {
                        saveWflowName.value = TaskID.value;
                    }
                },
                onFocus: () => { isEditing.value = true },
                onBlur: () => { isEditing.value = false },
            }, {}
            )),
        positiveText: '保存',
        negativeText: '取消',
        onPositiveClick: async () => {
            await saveWorkflow(saveWflowName.value,{
                success: () => {
                    message.success(`【${saveWflowName.value}】保存成功`);
                },
                error: (err) => {
                    message.error(`【${saveWflowName.value}】保存失败: ${err}`)
                },
            });
        },
        onNegativeClick: () => { },
    }
    );
}

const restore_loading = ref(false)
const onRestore = async (flowKey) => {
    restore_loading.value = true;
    removeNodes(getNodes.value);
    await nextTick();
    const flow = JSON.parse(localStorage.getItem(flowKey));
    if (flow) {
        for (const node of flow.nodes) {
            resetNodeState(node);
        }
        fromObject(flow);
        buildNestedNodeGraph();
        reBuildCounter();
    }
    restore_loading.value = false;
}

const run_loading = ref(false)
const click2runflow = async () => {
    for (const node of getNodes.value) {
        resetNodeState(node);
    }
    await nextTick();
    const vflow = toObject();
    const res = await runflow(
        vflow,
        {
            before: async () => {
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
    TaskID.value = res.tid;
}
onUnmounted(() => { })
</script>

<template>
    <n-flex justify="flex-end">
        <n-button class="glow-btn" strong tertiary round type="success" @click="onSave">保存</n-button>
        <!-- <n-button class="glow-btn" strong tertiary round type="success" @click="onRestore('vueflow-store')"
            :loading="restore_loading">载入</n-button> -->
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