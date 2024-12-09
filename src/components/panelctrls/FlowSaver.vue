<script setup>
import {
    computed,
    ref,
    h,
    watch,
    inject,
    onMounted,
    onUnmounted,
    nextTick
} from 'vue';
import {
    useMessage,
    NInput,
    NModal,
} from 'naive-ui';
import { useFlowAOperation } from '@/services/useFlowAOperation'

const { TaskID, TaskName, saveWorkflow } = useFlowAOperation();
const message = useMessage();
const isEditing = inject("isEditing");
const isShowWFSaver = inject("isShowWFSaver");
const saveWflowName = ref(TaskName.value || "");
const saveWflowNamePlaceHolder = computed(() => {
    return `默认为【${TaskID.value}】`
});

const onPositiveClick = async () => {
    if (saveWflowName.value.trim() === "") {
        saveWflowName.value = TaskID.value;
    }
    await saveWorkflow(saveWflowName.value, {
        success: () => {
            message.success(`【${saveWflowName.value}】保存成功`);
        },
        error: (err) => {
            message.error(`【${saveWflowName.value}】保存失败: ${err}`)
        },
    });
}
</script>

<template>
    <n-modal v-model:show="isShowWFSaver" type="info" preset="dialog" title="保存工作流" positive-text="确认"
        negative-text="取消" @positive-click="onPositiveClick">
        <n-input v-model:value="saveWflowName" :placeholder="saveWflowNamePlaceHolder" clearable
            @focus="isEditing = true" @blur="isEditing = false" />
    </n-modal>
</template>
<style scoped></style>