<script setup>
import { ref, onMounted, reactive, inject, computed } from 'vue';
import { useVueFlow } from '@vue-flow/core'
import { NCode, NIcon, NButton, NFlex } from 'naive-ui'
import editable_header from './common/header.vue'
import { CreateOutline } from '@vicons/ionicons5'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    }
})
const { findNode } = useVueFlow();
const { isEditorMode } = useFlowAOperation();

const isShowCodeEditor = inject("isShowCodeEditor");
const CodeEditorPath = inject("CodeEditorPath");
const CodeEditorLangType = inject("CodeEditorLangType");

const thisnode = computed(() => {
    return findNode(props.nodeId);
});

const editCode = () => {
    CodeEditorPath.value = ["data", "payloads", "byId", props.pid, "data"];
    isShowCodeEditor.value = true;
    CodeEditorLangType.value = 'python';
}

</script>
<template>
    <n-flex vertical>
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="warning">
                {{ thisnode.data.payloads.byId[pid].label }}
            </editable_header>
            <n-button :disabled="!isEditorMode" text type="warning" @click="editCode">
                <template #icon>
                    <n-icon>
                        <CreateOutline />
                    </n-icon>
                </template>
                编辑代码
            </n-button>
        </n-flex>
        <n-code :code="thisnode.data.payloads.byId[pid].data" language="python" show-line-numbers />
    </n-flex>
</template>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>