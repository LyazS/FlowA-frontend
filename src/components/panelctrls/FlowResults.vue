<script setup>
import { ref, onMounted, reactive, inject, computed, watch } from 'vue';
import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import { NText, NButton, NScrollbar, NModal, NCard, NFlex, NGrid, NGridItem, NDivider } from 'naive-ui'
import { debounce } from 'lodash'
import { useVFlowManagement } from '@/hooks/useVFlowManagement'
import { useFlowAOperation } from '@/services/useFlowAOperation'
const { findNode } = useVueFlow();
// const { } = useVFlowManagement();
const {
    TaskID,
    getWorkflows,
    loadWorkflow,
    getResults,
    loadResult,
} = useFlowAOperation();

const isEditing = inject("isEditing");
const isShowFlowResults = inject("isShowFlowResults");

const titlename = computed(() => {
    return `当前工作流：${TaskID.value}`
});
const loadResult_btn = async (tid) => {
    await loadResult(tid);
    isShowFlowResults.value = false;
}
const loadWorkflow_btn = async (wid) => {
    await loadWorkflow(wid);
    isShowFlowResults.value = false;
}

const results = ref([]);
const workflows = ref([]);
const updateResults = debounce(async () => {
    const res = await getResults();
    console.log(res);
    results.value = [];
    for (const item of res) {
        if (item.status === 'Pending') {
            results.value.push({
                tid: item.tid,
                type: 'default',
            });
        }
        else if (item.status === 'Running') {
            results.value.push({
                tid: item.tid,
                type: 'success',
            });
        }
        else if (item.status === 'Success') {
            results.value.push({
                tid: item.tid,
                type: 'success',
            });
        }
        else if (item.status === 'Canceled') {
            results.value.push({
                tid: item.tid,
                type: 'warning',
            });
        }
        else if (item.status === 'Error') {
            results.value.push({
                tid: item.tid,
                type: 'error',
            });
        }
    }
}, 500);
const updateWorkflows = async () => {
    const res = await getWorkflows();
    console.log(res);
    workflows.value = [];
    for (const item of res) {
        workflows.value.push(item);
    }
};
watch(isShowFlowResults, async (newVal) => {
    if (newVal) {
        updateResults();
        updateWorkflows();
    }
});
onMounted(async () => { });
</script>
<template>
    <n-modal v-model:show="isShowFlowResults" :close-on-esc="true">
        <n-card :title="titlename" closable @close="isShowFlowResults = false"
            :style="{ width: '80%', maxWidth: '800px' }">
            <n-grid x-gap="12" :cols="4">
                <n-grid-item :span="2">
                    <n-text>本地工作流</n-text>
                    <n-scrollbar style="max-height: 50vh">
                        <n-flex vertical :style="{ width: '100%' }">
                            <n-button v-for="(item, idx) in workflows" :key="'workflow_' + idx"
                                @click="loadWorkflow_btn(item.wid)" tertiary type="default">
                                {{ item.name }}
                            </n-button>
                        </n-flex>
                    </n-scrollbar>
                </n-grid-item>
                <n-grid-item :span="2">
                    <n-text>历史记录</n-text>
                    <n-scrollbar style="max-height: 50vh">
                        <n-flex vertical :style="{ width: '100%' }">
                            <n-button v-for="(item, idx) in results" :key="'result_' + idx"
                                @click="loadResult_btn(item.tid)" secondary :type="item.type">
                                {{ item.tid }}
                            </n-button>
                        </n-flex>
                    </n-scrollbar>
                </n-grid-item>
            </n-grid>
        </n-card>
    </n-modal>
</template>