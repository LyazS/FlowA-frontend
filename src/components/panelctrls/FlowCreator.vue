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

const { TaskID, WorkflowName, createNewWorkflow } = useFlowAOperation();
const message = useMessage();
const isEditing = inject("isEditing");
const isShowWFCreator = inject("isShowWFCreator");
const newWflowName = ref(WorkflowName.value || "");

const onPositiveClick = async () => {
    if (newWflowName.value.trim() === "") {
        newWflowName.value = TaskID.value;
    }
    await createNewWorkflow(newWflowName.value);
}
</script>

<template>
    <n-modal v-model:show="isShowWFCreator" type="info" preset="dialog" title="新建工作流" positive-text="新建"
        negative-text="取消" @positive-click="onPositiveClick">
        <n-input v-model:value="newWflowName" placeholder="新建工作流" clearable
            @focus="isEditing = true" @blur="isEditing = false" />
    </n-modal>
</template>
<style scoped></style>