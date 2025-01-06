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
    NFlex,
    NGrid,
    NGridItem,
    NDivider,
    NEllipsis,
    NUpload,
} from 'naive-ui'
import { debounce, get } from 'lodash'
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
    getWorkflows,
    loadWorkflow,
    getResults,
    loadResult,
    deleteWorkflow,
} = useFlowAOperation();
const dialog = useDialog();
const isEditing = inject("isEditing");
const isShowJinja2Render = inject("isShowJinja2Render");
const thedata = ref({ "arg1": [] });
const { subscribe: subscribeJinja2, unsubscribe: unsubscribeJinja2 } = SubscribeSSE(
    // onOpen
    async (response) => {
        console.log("onopen SSE Jinja2", response.ok);
    },
    // onMessage
    async (event) => {
        // console.log("onmessage SSE Jinja2", event.event);
        // themsg.value.push(event.data);
        if (event.event === 'batchupdatenode') return;
        let line = event.data;
        if (line.trim() === '') return; // 忽略空行

        try {
            const parsedData = JSON.parse(line);
            for (const pdata of parsedData.data) {
                const { path, data } = pdata;
                const { operation, new_value } = data;

                let current = thedata.value;
                for (let i = 0; i < path.length - 1; i++) {
                    const key = path[i];
                    if (!current[key]) {
                        current[key] = {};
                    }
                    current = current[key];
                }

                const lastKey = path[path.length - 1];
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

onMounted(() => {
    let selected_nids = [];
    for (const node of getNodes.value) {
        const nid = node.id;
        if (node.data.flag & nodeFlags.isPassive) {
            selected_nids.push(nid);
        }
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
});

onUnmounted(() => {
    unsubscribeJinja2();
});

</script>
<template>
    <n-modal v-model:show="isShowJinja2Render" :close-on-esc="true" transform-origin="center">
        <n-card title="Jinja2渲染" closable @close="isShowJinja2Render = false"
            :style="{ width: '80%', maxWidth: '1000px' }">
            <pre> {{ thedata }}</pre>
        </n-card>
    </n-modal>
</template>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>