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

const { WorkflowName, renameWorkflow } = useFlowAOperation();
const message = useMessage();
const isEditing = inject("isEditing");
const isShowWFRename = inject("isShowWFRename");
const renameWflow = ref(WorkflowName.value || "");
const renameWflowPlaceHolder = computed(() => {
    return `默认为【${WorkflowName.value}】`
});

const onPositiveClick = async () => {
    if (renameWflow.value.trim() === "") {
        renameWflow.value = WorkflowName.value;
    }
    await renameWorkflow(renameWflow.value, {
        success: () => {
            message.success(`重命名为【${renameWflow.value}】`);
        },
        error: (err) => {
            message.error(`重命名【${renameWflow.value}】失败: ${err}`)
        },
    });
}
</script>

<template>
    <n-modal v-model:show="isShowWFRename" type="info" preset="dialog" title="重命名工作流" positive-text="确认"
        negative-text="取消" @positive-click="onPositiveClick">
        <n-input v-model:value="renameWflow" :placeholder="renameWflowPlaceHolder" clearable @focus="isEditing = true"
            @blur="isEditing = false" />
    </n-modal>
</template>
<style scoped></style>