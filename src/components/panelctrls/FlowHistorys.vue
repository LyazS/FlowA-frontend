<script setup>
import { ref, onMounted, reactive, inject, computed, watch } from 'vue';
import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import { NText, NButton, NModal, NCard, NFlex, NGrid, NGridItem, NDivider } from 'naive-ui'
import { debounce } from 'lodash'
import { useVFlowManagement } from '@/hooks/useVFlowManagement'
const { findNode } = useVueFlow();
const {
    getWorkflows,
    loadWorkflow,
    getHistorys,
    loadHistory,
    TaskID,
} = useVFlowManagement();

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
    historys.value = res.historys;
}, 1000);
const updateWorkflows = debounce(async () => {
    const res = await getWorkflows();
    console.log(res);
    workflows.value = res.workflows;
}, 1000);
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
                        <n-button v-for="item in workflows" :key="item.tid" @click="loadWorkflow_btn(item.tid)">
                            {{ item.tid }}
                        </n-button>
                    </n-flex>
                </n-grid-item>
                <n-grid-item :span="2">
                    <n-text>历史记录</n-text>
                    <n-flex vertical :style="{ width: '100%' }">
                        <n-button v-for="item in historys" :key="item.tid" @click="loadHistory_btn(item.tid)">
                            {{ item.tid }}
                        </n-button>
                    </n-flex>
                </n-grid-item>
            </n-grid>
            <!-- <pre>{{ historys }}</pre> -->
        </n-card>
    </n-modal>
</template>