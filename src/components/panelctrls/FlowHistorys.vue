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
    getHistorys,
    loadHistory,
} = useFlowAOperation();

const isEditing = inject("isEditing");
const isShowFlowHistorys = inject("isShowFlowHistorys");

const titlename = computed(() => {
    return `当前工作流：${TaskID.value}`
});
const loadHistory_btn = (tid) => {
    loadHistory(tid);
    isShowFlowHistorys.value = false;
}
const loadWorkflow_btn = (name) => {
    loadWorkflow(name);
    isShowFlowHistorys.value = false;
}

const historys = ref([]);
const workflows = ref([]);
const updateHistorys = debounce(async () => {
    const res = await getHistorys(TaskID.value);
    console.log(res);
    historys.value = [];
    for (const item of res) {
        if (!item.result) {
            historys.value.push({
                name: item.name,
                type: 'tertiary',
            });
        }
        else {
            if (item.result.status === 'Pending') {
                historys.value.push({
                    name: item.name,
                    type: 'default',
                });
            }
            else if (item.result.status === 'Running') {
                historys.value.push({
                    name: item.name,
                    type: 'success',
                });
            }
            else if (item.result.status === 'Success') {
                historys.value.push({
                    name: item.name,
                    type: 'success',
                });
            }
            else if (item.result.status === 'Canceled') {
                historys.value.push({
                    name: item.name,
                    type: 'warning',
                });
            }
            else if (item.result.status === 'Error') {
                historys.value.push({
                    name: item.name,
                    type: 'error',
                });
            }
        }
    }
}, 500);
const updateWorkflows = debounce(async () => {
    const res = await getWorkflows();
    console.log(res);
    workflows.value = [];
    for (const item of res) {
        workflows.value.push(item);
    }
}, 500);
watch(isShowFlowHistorys, async (newVal) => {
    if (newVal) {
        updateHistorys();
        updateWorkflows();
    }
});
onMounted(async () => { });
</script>
<template>
    <n-modal v-model:show="isShowFlowHistorys" :close-on-esc="true">
        <n-card :title="titlename" closable @close="isShowFlowHistorys = false"
            :style="{ width: '80%', maxWidth: '800px' }">
            <n-grid x-gap="12" :cols="4">
                <n-grid-item :span="2">
                    <n-text>本地工作流</n-text>
                    <n-scrollbar style="max-height: 50vh">
                        <n-flex vertical :style="{ width: '100%' }">
                            <n-button v-for="(item, idx) in workflows" :key="'workflow_' + idx"
                                @click="loadWorkflow_btn(item.name)" tertiary type="default">
                                {{ item.name }}
                            </n-button>
                        </n-flex>
                    </n-scrollbar>
                </n-grid-item>
                <n-grid-item :span="2">
                    <n-text>历史记录</n-text>
                    <n-scrollbar style="max-height: 50vh">
                        <n-flex vertical :style="{ width: '100%' }">
                            <n-button v-for="(item, idx) in historys" :key="'history_' + idx"
                                @click="loadHistory_btn(item.name)" secondary :type="item.type">
                                {{ item.name }}
                            </n-button>
                        </n-flex>
                    </n-scrollbar>
                </n-grid-item>
            </n-grid>
        </n-card>
    </n-modal>
</template>