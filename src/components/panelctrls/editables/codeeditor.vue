<script setup>
import { ref, onMounted, reactive, inject, computed } from 'vue';
import { useVueFlow } from '@vue-flow/core'
import { NText, NCode, NIcon, NButton, NH6, NInput, NSelect, NInputGroup, NFlex, NDivider } from 'naive-ui'
import editable_header from './header.vue'
import { LogoPython } from '@vicons/ionicons5'

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

const isShowCodeEditor = inject("isShowCodeEditor");
const CodeEditorPid = inject("CodeEditorPid");
const thisnode = computed(() => {
    return findNode(props.nodeId);
});

const editCode = () => {
    CodeEditorPid.value = props.pid;
    isShowCodeEditor.value = true;
}

</script>
<template>
    <n-flex vertical>
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="info">
                {{ thisnode.data.payloads.byId[pid].label }}
            </editable_header>
            <n-button text type="info" @click="editCode">
                <template #icon>
                    <n-icon>
                        <LogoPython />
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