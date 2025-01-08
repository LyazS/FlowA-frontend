<template>
    <n-modal :show="isShowJinja2Render" :close-on-esc="false" transform-origin="center">
        <n-card title="Jinja2渲染" closable @close="isShowJinja2Render = false"
            :style="{ width: '80%', maxWidth: '1000px' }">
            <editable_header type="success">
                <n-collapse arrow-placement="right">
                    <n-collapse-item title="节点选择">
                        <n-transfer v-model:value="Jinja2RenderNodeIDs" :options="Jinja2NodeOptions"
                            @update:value="Jinja2RenderNodeChange" size="large" />
                    </n-collapse-item>
                </n-collapse>
            </editable_header>
            <!-- <pre> {{ thedata }}</pre> -->
            <pre> {{ Jinja2RenderNodeIDs }}</pre>
            <pre> {{ Jinja2RenderData }}</pre>
        </n-card>
    </n-modal>
</template>

<script setup>
import { ref, onMounted, reactive, inject, computed, watch, onUnmounted } from 'vue';
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
    NCollapse,
    NCollapseItem,
    NFlex,
    NGrid,
    NGridItem,
    NDivider,
    NEllipsis,
    NUpload,
    NTransfer,
} from 'naive-ui'
import editable_header from '@/components/panelctrls/editables/common/header.vue'
import { debounce, throttle } from 'lodash'
import { useVFlowManagement } from '@/hooks/useVFlowManagement'
import { useFlowAOperation } from '@/services/useFlowAOperation'
import { SubscribeSSE } from '@/services/useSSE'
import { Ellipse, Close, Add, Pencil, DownloadOutline, CloudUploadOutline, CloudDownloadOutline } from '@vicons/ionicons5'
import { nodeFlags } from '@/utils/schemas'
const { findNode, getNodes } = useVueFlow();
// const { } = useVFlowManagement();
const {
    TaskID,
    WorkflowID,
    WorkflowName,
    Jinja2RenderNodeIDs,
    getWorkflows,
    loadWorkflow,
    getResults,
    loadResult,
    deleteWorkflow,
} = useFlowAOperation();
const dialog = useDialog();
const isEditing = inject("isEditing");
const isShowJinja2Render = inject("isShowJinja2Render");

const Jinja2NodeOptions = computed(() => {
    const options = [];
    for (const node of getNodes.value) {
        if (node.data.ntype === 'jinja2_template') {
            options.push({ label: node.data.label, value: node.id });
        }
    }
    return options;
});

const Jinja2RenderData = ref({});
const { subscribe: subscribeJinja2, unsubscribe: unsubscribeJinja2 } = SubscribeSSE(
    // onOpen
    async (response) => {
        console.log("onopen SSE Jinja2", response.ok);
    },
    // onMessage
    async (event) => {
        console.log("onmessage SSE Jinja2", event.event);
        const lines = [];
        if (event.event === 'batchupdatenode') {
            const e_datas = JSON.parse(event.data);
            for (const data of e_datas) {
                lines.push(data);
            }
        }
        else if (event.event === 'updatenode') {
            const e_data = JSON.parse(event.data);
            lines.push(e_data);
        }
        for (const line of lines) {
            try {
                const parsedData = line;
                const nid = parsedData.nid;
                for (const pdata of parsedData.data) {
                    const { path, operation, new_value, old_value } = pdata.data;
                    let current = Jinja2RenderData.value[nid].content;
                    const combined_path = [...pdata.path, ...path];
                    for (let i = 0; i < combined_path.length - 1; i++) {
                        const key = combined_path[i];
                        if (!current[key]) {
                            current[key] = {};
                        }
                        current = current[key];
                    }

                    const lastKey = combined_path[combined_path.length - 1];
                    // console.log(`current ${current}, lastKey ${lastKey}, operation ${operation}, new_value ${new_value}`)
                    switch (operation) {
                        case 'set':
                            // 直接设置值
                            current[lastKey] = new_value;
                            break;
                        case 'append':
                            // 如果目标是一个数组，则追加值
                            if (!Array.isArray(current[lastKey])) {
                                current[lastKey] = []; // 如果当前值不是数组，初始化为数组
                            }
                            current[lastKey].push(new_value);
                            break;
                        default:
                            console.warn(`Unknown operation: ${operation}`);
                            break;
                    }
                }

            } catch (error) {
                console.error('Error parsing line:', line, error);
            }
        }
    },
    // onClose
    async () => {
        console.log("onclose SSE Jinja2");
    },
    // onError
    async (err) => {
        console.log("onerror SSE Jinja2", err);
    },
);

const Jinja2RenderNodeChange = throttle(async () => {
    if (!isShowJinja2Render.value) return;
    console.log("Jinja2RenderNodeChange", Jinja2RenderNodeIDs.value);
    // 取消订阅 unsubscribeJinja2
    // 预构建Jinja2渲染数据结构
    // 订阅 subscribeJinja2
    unsubscribeJinja2();
    const selected_nids = [];
    Jinja2RenderData.value = {};
    if (Jinja2RenderNodeIDs.value.length === 0) {
        return;
    }
    for (const nid of Jinja2RenderNodeIDs.value) {
        const thenode = findNode(nid);
        if (thenode) {
            let thecontent = {}
            for (const vardata of thenode.data.payloads.byId['D_VARSINPUT'].data) {
                thecontent[vardata['key']] = null;
            }
            const thetemplate = thenode.data.payloads.byId['D_CODE'].data;
            Jinja2RenderData.value[nid] = { template: thetemplate, content: thecontent };
            selected_nids.push(nid);
        }
    }
    Jinja2RenderNodeIDs.value = selected_nids;
    console.log("subscribeJinja2 nodes: ", selected_nids);
    if (selected_nids.length === 0) {
        return;
    }
    subscribeJinja2(
        `${import.meta.env.VITE_API_URL}/api/progress`,
        'POST',
        null,
        {
            tid: `${TaskID.value}/Jinja2`,
            node_type: "SELECTED",
            selected_nids: selected_nids,
        },
    );
}, 1000);

watch(isShowJinja2Render, (newVal, oldVal) => {
    if (newVal && !oldVal) {
        console.log("show Jinja2Render");
        Jinja2RenderNodeChange();
    }
    else if (!newVal && oldVal) {
        console.log("hide Jinja2Render");
        unsubscribeJinja2();
    }
});

onMounted(() => {
    console.log("mounted Jinja2Render");
});

onUnmounted(() => {
    console.log("unmounted Jinja2Render");
    unsubscribeJinja2();
});

</script>


<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>