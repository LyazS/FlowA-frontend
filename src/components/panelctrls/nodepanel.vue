<script setup>
import { computed, ref, watch, nextTick, inject, defineAsyncComponent, onUnmounted, onMounted, h } from 'vue';
import { NFlex, NH2, NCard, NScrollbar, NInput, NIcon, NText, NDivider } from 'naive-ui';
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
import { CreateOutline } from '@vicons/ionicons5'
import { useVFlowManagement } from '@/hooks/useVFlowManagement';
import { mapVarItemToSelect } from '@/utils/tools'
const {
    findVarFromIO,
    recursiveFindVariables,
} = useVFlowManagement();

const editable_tagoutputs = defineAsyncComponent(() => import('./editables/tagoutputs.vue'));
const editable_packoutputs = defineAsyncComponent(() => import('./editables/packoutputs.vue'));
const editable_condoutputs = defineAsyncComponent(() => import('./editables/condoutputs.vue'));
const editable_codeoutputs = defineAsyncComponent(() => import('./editables/codeoutputs.vue'));
const editable_iter_input = defineAsyncComponent(() => import('./editables/iter_input.vue'));
const editable_textinput = defineAsyncComponent(() => import('./editables/textinput.vue'));
const editable_textprint = defineAsyncComponent(() => import('./editables/textprint.vue'));
const editable_texttag = defineAsyncComponent(() => import('./editables/texttag.vue'));
const editable_header = defineAsyncComponent(() => import('./editables/header.vue'));
const editable_codeeditor = defineAsyncComponent(() => import('./editables/codeeditor.vue'));
const editable_codeinputs = defineAsyncComponent(() => import('./editables/codeinputs.vue'));
const editable_llminputs = defineAsyncComponent(() => import('./editables/llminputs.vue'));
const editable_llmprompts = defineAsyncComponent(() => import('./editables/llmprompts.vue'));
const editable_aggregatebranchs = defineAsyncComponent(() => import('./editables/aggregatebranchs.vue'));

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})
const {
    findNode,
    getHandleConnections,
} = useVueFlow();
const isEditing = inject("isEditing");

// 获取节点
const thisnode = computed(() => {
    return findNode(props.nodeId);
});
// 节点标题相关 ======================================
const isEditingTitle = ref(false);
const titleInputRef = ref(null);
const titleInputText = ref("");
watch(() => props.nodeId, (newVal) => {
    titleInputText.value = thisnode.value.data.label;
}, { immediate: true })
const startEditTilte = () => {
    isEditingTitle.value = true;
    isEditing.value = true;
    nextTick(() => { titleInputRef.value?.focus(); });
}
const saveTitle = () => {
    isEditing.value = false;
    isEditingTitle.value = false;
    const newLabel = titleInputText.value.trim();
    thisnode.value.data.label = newLabel || thisnode.value.data.placeholderlabel;
}

// 可供该节点使用的变量 ==================================================



// 输出变量字典{列表}
const outputVarSelections = computed(() => {
    const selections = {};
    for (const hid of Object.keys(thisnode.value.data.connections.outputs)) {
        selections[hid] = recursiveFindVariables(props.nodeId, [], [], [], false, [], false, [hid])
            .map((item) => mapVarItemToSelect(item));
    }
    return selections;
})
// 自身可用变量
const selfVarSelections = computed(() => {
    return recursiveFindVariables(props.nodeId, ['self'], [], [], false, [], false, [])
        .map((item) => mapVarItemToSelect(item));
})
// 自身可用变量
const selfVarSelections_aouput = computed(() => {
    return recursiveFindVariables(props.nodeId, ['attach_output'], [], [], false, [], false, [])
        .map((item) => mapVarItemToSelect(item));
})
// 渲染节点payload的内置变量 =======================================
const payloadInnerComponents = computed(() => {
    return thisnode.value.data.payloads.order.reduce((acc, pid) => {
        const payload = thisnode.value.data.payloads.byId[pid];
        // 只追踪需要的属性
        const { uitype } = payload;
        if (uitype === 'texttag') {
            acc[pid] = h(editable_texttag, { nodeId: props.nodeId, pid });
        }
        console.log(payload.label, pid);
        return acc;
    }, {});
});
// 渲染节点payload数据 =======================================
const payloadComponents = computed(() => {
    return thisnode.value.data.payloads.order.reduce((acc, pid) => {
        const payload = thisnode.value.data.payloads.byId[pid];
        // 只追踪需要的属性
        const { uitype } = payload;
        if (uitype === 'textinput') {
            acc[pid] = h(editable_textinput, { nodeId: props.nodeId, pid });
        }
        else if (uitype === 'textprint') {
            acc[pid] = h(editable_textprint, { nodeId: props.nodeId, pid, selfVarSelections: selfVarSelections.value });
        }
        else if (uitype === 'codeeditor') {
            acc[pid] = h(editable_codeeditor, { nodeId: props.nodeId, pid });
        }
        else if (uitype === 'codeinputs') {
            acc[pid] = h(editable_codeinputs, { nodeId: props.nodeId, pid, selfVarSelections: selfVarSelections.value });
        }
        else if (uitype === 'llminputs') {
            acc[pid] = h(editable_llminputs, { nodeId: props.nodeId, pid, selfVarSelections: selfVarSelections.value });
        }
        else if (uitype === 'llmprompts') {
            acc[pid] = h(editable_llmprompts, { nodeId: props.nodeId, pid });
        }
        else if (uitype === 'iter_input') {
            acc[pid] = h(editable_iter_input, { nodeId: props.nodeId, pid, selfVarSelections: selfVarSelections.value });
        }
        else if (uitype === 'aggregatebranch') {
            acc[pid] = h(editable_aggregatebranchs, { nodeId: props.nodeId, pid, selfVarSelections: selfVarSelections.value, inputNodes: inputNodes.value });
        }
        return acc;
    }, {});
});
// 渲染输出的连接 =============================================
const outputsComponents = computed(() => {
    const uitype = thisnode.value.data.connections['outputs-uitype'];
    if (uitype === 'tagoutputs') {
        return h(editable_tagoutputs, { nodeId: props.nodeId, outputVarSelections: outputVarSelections.value });
    }
    else if (uitype === 'packoutputs') {
        return h(editable_packoutputs, { nodeId: props.nodeId, selfVarSelections: selfVarSelections_aouput.value });
    }
    else if (uitype === 'condoutputs') {
        return h(editable_condoutputs, { nodeId: props.nodeId, selfVarSelections: selfVarSelections.value });
    }
    else if (uitype === 'codeoutputs') {
        return h(editable_codeoutputs, { nodeId: props.nodeId });
    }
    return null;
});
// 
const inputNodes = computed(() => {
    const pre_nodes = {};
    for (const hid of Object.keys(thisnode.value.data.connections.inputs)) {
        const handle_nodes = [];
        const edges = getHandleConnections({ id: hid, type: "target", nodeId: props.nodeId });
        handle_nodes.push(...edges.map((edge) => {
            return {
                srcid: edge.source,
                srcohid: edge.sourceHandle,
            }
        }));
        pre_nodes[hid] = handle_nodes;
    }
    return pre_nodes;
});

// 节点数据文本 ================================================================================================
const nodedatatext = computed(() => {
    if (!thisnode.value?.data) return '';
    return JSON.stringify(thisnode.value.data, null, 2);
});

onMounted(() => { });
onUnmounted(() => {
    isEditing.value = false;
});
</script>

<template>
    <n-scrollbar style="max-height: calc(100vh - 80px); border-radius:10px;">
        <n-card header-style="height: 70px;">
            <template #header>
                <n-h2 prefix="bar" align-text v-if="!isEditingTitle" class="card-title" @click="startEditTilte">
                    <n-text type="success" strong>{{ thisnode.data.label }}</n-text>
                    <n-icon size="17" depth="2">
                        <CreateOutline />
                    </n-icon>
                </n-h2>
                <n-input v-else v-model:value="titleInputText" :placeholder="thisnode.data.placeholderlabel"
                    ref="titleInputRef" :bordered="false" @blur="saveTitle" class="title-input" />
            </template>
            <n-flex vertical :key="`${nodeId}-main`">
                <!-- 渲染输入的连接 -->
                <!-- 渲染内置变量 -->
                <n-flex vertical v-if="Object.keys(payloadInnerComponents).length > 0"
                    :style="{ 'padding-bottom': '10px' }" :key="`${nodeId}-inner`">
                    <editable_header type="default">内置变量</editable_header>
                    <n-flex vertical>
                        <template v-for="(comp, pid) in payloadInnerComponents" :key="`${nodeId}-${pid}-inner`">
                            <component v-if="comp" :is="comp" />
                        </template>
                    </n-flex>
                </n-flex>
                <!-- 渲染负载数据 -->
                <n-flex vertical v-if="Object.keys(payloadComponents).length > 0" :key="`${nodeId}-payloads`">
                    <template v-for="(comp, pid) in payloadComponents" :key="`${nodeId}-${pid}-payloads`">
                        <component v-if="comp" :is="comp" :style="{ 'padding-bottom': '10px' }" />
                    </template>
                </n-flex>
                <!-- 渲染输出 -->
                <component v-if="outputsComponents" :is="outputsComponents" :key="`${nodeId}-outputs`" />
                <!-- 渲染节点数据文本 -->
                <n-divider />
                <pre>{{ inputNodes }}</pre>
                <pre>{{ nodeId }}</pre>
                <pre>{{ nodedatatext }}</pre>
            </n-flex>
        </n-card>
    </n-scrollbar>
</template>

<style scoped>
.card-title {
    cursor: pointer;
    padding: 0;
    font-weight: 500;
}

.title-input {
    font-weight: 500;
}
</style>