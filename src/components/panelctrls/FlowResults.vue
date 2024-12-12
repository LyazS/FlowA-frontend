<script setup>
import { ref, onMounted, reactive, inject, computed, watch } from 'vue';
import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import { useDialog, NText, NButton, NIcon, NButtonGroup, NScrollbar, NModal, NCard, NFlex, NGrid, NGridItem, NDivider } from 'naive-ui'
import { debounce } from 'lodash'
import { useVFlowManagement } from '@/hooks/useVFlowManagement'
import { useFlowAOperation } from '@/services/useFlowAOperation'
import { Add, Close } from '@vicons/ionicons5'
const { findNode } = useVueFlow();
// const { } = useVFlowManagement();
const {
    TaskID,
    getWorkflows,
    loadWorkflow,
    getResults,
    loadResult,
    deleteWorkflow,
} = useFlowAOperation();
const dialog = useDialog();
const isEditing = inject("isEditing");
const isShowFlowResults = inject("isShowFlowResults");

const titlename = computed(() => {
    return `当前历史记录：${TaskID.value}`
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
    // console.log(res);
    results.value = [];
    for (const item of res) {
        let result_type = "default";
        if (item.status === 'Pending') { result_type = 'default'; }
        else if (item.status === 'Running') { result_type = 'success'; }
        else if (item.status === 'Success') { result_type = 'success'; }
        else if (item.status === 'Canceled') { result_type = 'warning'; }
        else if (item.status === 'Error') { result_type = 'error'; }
        let st_str = '', ed_str = '';
        if (item.starttime) {
            const sttime = new Date(item.starttime);
            const formatted_sttime = `【${(sttime.getMonth() + 1).toString().padStart(2, '0')}.${sttime.getDate().toString().padStart(2, '0')}】 ${sttime.toTimeString().split(' ')[0]}`;
            st_str = formatted_sttime;
        }
        else { st_str = '未开始'; }
        if (item.endtime) {
            const edtime = new Date(item.endtime);
            const formatted_edtime = `${edtime.toTimeString().split(' ')[0]}`;
            ed_str = formatted_edtime;
        }
        else { ed_str = '未结束'; }
        results.value.push({
            tid: item.tid,
            type: result_type,
            label: `${st_str} -> ${ed_str}`,
        });
    }
}, 500);
const updateWorkflows = async () => {
    const res = await getWorkflows();
    // console.log(res);
    workflows.value = [];
    for (const item of res) {
        workflows.value.push(item);
    }
};
const deleteWorkflow_btn = async (wid, wname) => {
    dialog.warning({
        title: '即将删除工作流',
        content: `【${wname}】`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            await deleteWorkflow(wid);
            updateWorkflows();
        },
    });
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
            <n-grid x-gap="0" :cols="13">
                <n-grid-item :span="6">
                    <n-text>本地工作流</n-text>
                    <n-scrollbar style="max-height: 50vh">
                        <n-flex vertical :style="{ width: '100%' }">
                            <template v-for="(item, idx) in workflows" :key="'workflow_' + idx">
                                <n-flex :style="{ width: '100%' }" :warp="false">
                                    <n-button @click="loadWorkflow_btn(item.wid)" tertiary type="default"
                                        :style="{ flex: '1' }">
                                        {{ item.name }}
                                    </n-button>
                                    <n-button circle tertiary size="small" type="error"
                                        @click="deleteWorkflow_btn(item.wid, item.name)">
                                        <template #icon>
                                            <n-icon>
                                                <Close />
                                            </n-icon>
                                        </template>
                                    </n-button>
                                </n-flex>
                            </template>
                        </n-flex>
                    </n-scrollbar>
                </n-grid-item>
                <n-grid-item :span="1">
                    <n-flex justify="center" align="center" :style="{ height: '100%' }">
                        <n-divider vertical :style="{ height: '100%' }" />
                    </n-flex>
                </n-grid-item>
                3 <n-grid-item :span="6">
                    <n-text>历史记录</n-text>
                    <n-scrollbar style="max-height: 50vh">
                        <n-flex vertical :style="{ width: '100%' }">
                            <n-button v-for="(item, idx) in results" :key="'result_' + idx"
                                @click="loadResult_btn(item.tid)" secondary :type="item.type">
                                {{ item.label }}
                            </n-button>
                        </n-flex>
                    </n-scrollbar>
                </n-grid-item>
            </n-grid>
        </n-card>
    </n-modal>
</template>