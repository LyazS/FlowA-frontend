<script setup>
import { ref, onMounted, reactive, inject, computed, watch } from 'vue';
import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import {
    useDialog,
    NText,
    NButton,
    NIcon,
    NButtonGroup,
    NScrollbar,
    NModal,
    NCard,
    NFlex,
    NGrid,
    NGridItem,
    NDivider,
    NEllipsis,
    NUpload,
} from 'naive-ui'
import { debounce } from 'lodash'
import { useVFlowManagement } from '@/hooks/useVFlowManagement'
import { useFlowAOperation } from '@/services/useFlowAOperation'
import { Ellipse, Close, Add, Pencil, DownloadOutline, CloudUploadOutline, CloudDownloadOutline } from '@vicons/ionicons5'
const { findNode } = useVueFlow();
// const { } = useVFlowManagement();
const {
    TaskID,
    WorkflowID,
    WorkflowName,
    getWorkflows,
    loadWorkflow,
    getResults,
    loadResult,
    deleteWorkflow,
} = useFlowAOperation();
const dialog = useDialog();
const isEditing = inject("isEditing");
const isShowFlowResults = inject("isShowFlowResults");
const isShowWFRename = inject("isShowWFRename");
const isShowWFCreator = inject("isShowWFCreator");

const titlename = computed(() => {
    return `工作流管理器`
});
const history_titlename = computed(() => {
    return `【${WorkflowName.value}】的历史记录`
});
const loadResult_btn = async (tid) => {
    if (TaskID.value !== tid) {
        await loadResult(tid);
    }
    isShowFlowResults.value = false;
}
const loadWorkflow_btn = async (wid) => {
    if (WorkflowID.value !== wid) {
        await loadWorkflow(wid);
    }
    isShowFlowResults.value = false;
}

const results = ref([]);
const workflows = ref([]);
const updateResults = async () => {
    const res = await getResults();
    // console.log(res);
    results.value = [];
    for (const item of res) {
        let result_type = "default";
        if (item.tid === TaskID.value) { result_type = 'success'; }
        let status_color = "#d5d5d6";
        if (item.status === 'Pending') { status_color = '#d5d5d6'; }
        else if (item.status === 'Running') { status_color = '#70c0e8'; }
        else if (item.status === 'Success') { status_color = '#63e2b7'; }
        else if (item.status === 'Canceled') { status_color = '#f2c97d'; }
        else if (item.status === 'Error') { status_color = '#e88080'; }
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
            status: status_color,
            label: `${st_str} -> ${ed_str}`,
        });
    }
};
const updateWorkflows = async () => {
    const res = await getWorkflows();
    // console.log(res);
    workflows.value = [];
    for (const item of res) {
        let wf_type = "default";
        if (item.wid == WorkflowID.value) { wf_type = 'success'; }
        workflows.value.push({
            ...item,
            type: wf_type,
        });
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
const downloadWorkflow_btn = async (wid) => { };
</script>
<template>
    <n-modal v-model:show="isShowFlowResults" :close-on-esc="true" transform-origin="center">
        <n-card :title="titlename" closable @close="isShowFlowResults = false"
            :style="{ width: '80%', maxWidth: '1000px' }">
            <n-grid x-gap="0" :cols="15">
                <n-grid-item :span="8">
                    <n-flex>
                        <n-flex :style="{ flexWrap: 'nowrap', width: '100%' }">
                            <n-button type="info" text @click="isShowWFCreator = true">
                                <template #icon>
                                    <n-icon>
                                        <Add />
                                    </n-icon>
                                </template>
                                新建工作流
                            </n-button>
                            <n-upload :show-file-list="false">
                                <n-flex justify="center" align="center" :style="{ height: '100%' }">
                                    <n-button type="info" text>
                                        <template #icon>
                                            <n-icon>
                                                <CloudUploadOutline />
                                            </n-icon>
                                        </template>
                                        导入工作流
                                    </n-button>
                                </n-flex>
                            </n-upload>
                        </n-flex>
                        <n-scrollbar style="max-height: 50vh">
                            <n-flex vertical :style="{ width: '100%' }">
                                <template v-for="(item, idx) in workflows" :key="'workflow_' + idx">
                                    <n-flex class="flexctitem" :style="{ width: '100%' }" :wrap="false">
                                        <n-button @click="loadWorkflow_btn(item.wid)" secondary :type="item.type"
                                            :style="{ flex: '1' }">
                                            <n-ellipsis style="max-width: 12em"> {{ item.name }}</n-ellipsis>
                                        </n-button>
                                        <n-button circle quaternary size="small" @click="isShowWFRename = true">
                                            <template #icon>
                                                <n-icon>
                                                    <Pencil />
                                                </n-icon>
                                            </template>
                                        </n-button>
                                        <n-button circle quaternary size="small"
                                            @click="downloadWorkflow_btn(item.wid)">
                                            <template #icon>
                                                <n-icon>
                                                    <CloudDownloadOutline />
                                                </n-icon>
                                            </template>
                                        </n-button>
                                        <n-button circle quaternary size="small" type="error"
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
                    </n-flex>
                </n-grid-item>
                <n-grid-item :span="1">
                    <n-flex justify="center" align="center" :style="{ height: '100%' }">
                        <n-divider vertical :style="{ height: '100%' }" />
                    </n-flex>
                </n-grid-item>
                <n-grid-item :span="6">
                    <n-text>{{ history_titlename }}</n-text>
                    <n-scrollbar style="max-height: 50vh">
                        <n-flex vertical :style="{ width: '100%' }">
                            <n-button v-for="(item, idx) in results" :key="'result_' + idx"
                                @click="loadResult_btn(item.tid)" secondary :type="item.type" style="text-align: left;">
                                <template #icon>
                                    <n-icon size="10" :color="item.status">
                                        <Ellipse />
                                    </n-icon>
                                </template>
                                {{ item.label }}
                            </n-button>
                        </n-flex>
                    </n-scrollbar>
                </n-grid-item>
            </n-grid>
        </n-card>
    </n-modal>
</template>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>