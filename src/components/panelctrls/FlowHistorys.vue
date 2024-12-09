<script setup>
import { ref, onMounted, reactive, inject, computed, watch } from 'vue';
import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import { NText, NButton, NModal, NCard, NFlex, NGrid, NGridItem, NDivider } from 'naive-ui'
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
    historys.value = res;
}, 500);
const updateWorkflows = debounce(async () => {
    const res = await getWorkflows();
    console.log(res);
    workflows.value = res;
}, 500);
watch(isShowFlowHistorys, async (newVal) => {
    if (newVal) {
        updateHistorys();
        updateWorkflows();
    }
});
onMounted(async () => {
    // updateHistorys();
});
</script>
<template>
    <n-modal v-model:show="isShowFlowHistorys" :close-on-esc="true">
        <n-card :title="TaskID" closable @close="isShowFlowHistorys = false"
            :style="{ width: '80%', maxWidth: '800px' }" content-style="padding: 10px">
            <n-grid x-gap="12" :cols="4">
                <n-grid-item :span="2">
                    <n-text>本地工作流</n-text>
                    <n-flex vertical :style="{ width: '100%' }">
                        <n-button v-for="(item, idx) in workflows" :key="'workflow_' + idx"
                            @click="loadWorkflow_btn(item.name)">
                            {{ item.name }}{{ idx }}
                        </n-button>
                    </n-flex>
                </n-grid-item>
                <n-grid-item :span="2">
                    <n-text>历史记录</n-text>
                    <n-flex vertical :style="{ width: '100%' }">
                        <n-button v-for="(item, idx) in historys" :key="'history_' + idx"
                            @click="loadHistory_btn(item.name)">
                            {{ item.name }}
                        </n-button>
                    </n-flex>
                </n-grid-item>
            </n-grid>
        </n-card>
    </n-modal>
</template>