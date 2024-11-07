<script setup>
import { computed, ref, watch, nextTick, inject, onUnmounted, onMounted, h } from 'vue';
import { NFlex, NH2, NCard, NScrollbar, NInput, NText, NDivider } from 'naive-ui';
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
import editable_input from './editables/input.vue';
import editable_tagoutputs from './editables/tagoutputs.vue';
import editable_packoutputs from './editables/packoutputs.vue';
import editable_textinput from './editables/textinput.vue';
import editable_textprint from './editables/textprint.vue';
import editable_texttag from './editables/texttag.vue';
import editable_header from './editables/header.vue';

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
const startEditTilte = () => {
    isEditingTitle.value = true;
    isEditing.value = true;
    nextTick(() => { titleInputRef.value?.focus(); });
}
const saveTitle = () => {
    isEditing.value = false;
    isEditingTitle.value = false;
    const newLabel = thisnode.value.data.label.trim();
    thisnode.value.data.label = newLabel || thisnode.value.data.placeholderlabel;
}

// 可供该节点使用的变量 ==================================================
const findVarFromIO = (nid, hid, findtype) => {
    const result = [];
    const thenode = findNode(nid);
    let connection = {};
    if (findtype === 'self') {
        connection = thenode.data.connections.self[hid].data;
    }
    else if (findtype === 'attach') {
        connection = thenode.data.connections.attach[hid].data;
    }
    else if (findtype === 'input') {
        connection = thenode.data.connections.inputs[hid].data;
    }
    else if (findtype === 'output') {
        connection = thenode.data.connections.outputs[hid].data;
    }
    for (const c_data of Object.values(connection)) {
        if (c_data.type === 'FromInner') {
            result.push({
                nodeId: nid,
                nlabel: thenode.data.label,
                dpath: c_data.path,
                dlabel: thenode.data[c_data.path[0]].byId[c_data.path[1]].label,
                dkey: thenode.data[c_data.path[0]].byId[c_data.path[1]].key,
                dtype: thenode.data[c_data.path[0]].byId[c_data.path[1]].type,
            });
        }
        else if (c_data.type === 'FromOuter') {
            // 对于上一个节点，则递归搜索上个节点的对应输出handle
            const in_hid = c_data.inputKey;
            const edges = getHandleConnections({ id: in_hid, type: "target", nodeId: nid });
            console.log("handle id: ", in_hid, "edges count: ", Object.keys(edges).length);
            for (const [eidx, edge] of Object.entries(edges)) {
                const src_nid = edge.source;
                const src_hid = edge.sourceHandle;
                result.push(...recursiveFindVariables(src_nid, false, false, false, [], false, [src_hid]));
            }
        }
        else if (c_data.type === 'FromAttached') {
            // 对于子节点，
            // 如果是输入节点，则搜索它的输出变量
            // 如果是输出节点，则搜索它的自身可用变量
            result.push(...recursiveFindVariables(
                thenode.data.nesting.attached_nodes[c_data.atype].nid,
                c_data.atype === 'output',
                false,
                false,
                [],
                c_data.atype === 'intput',
                [],
            ));
        }
        else if (c_data.type === 'FromParent') {
            // 如果是父节点，则递归搜索父节点的所有输入handle
            result.push(...recursiveFindVariables(thenode.parentNode, false, true, true, [], false, []));
        }
    }
    return result;
}


const recursiveFindVariables = (
    nid,
    findSelf = false,
    findAttach = false,
    findAllInput = false,
    findInput = [],
    findAllOutput = false,
    findOutput = [],
) => {
    const result = [];
    const thenode = findNode(nid);
    if (findAllInput) { findInput = Object.keys(thenode.data.connections.inputs); }
    if (findAllOutput) { findOutput = Object.keys(thenode.data.connections.outputs); }

    if (findSelf) result.push(...findVarFromIO(nid, 'self', 'self'));
    if (findAttach) result.push(...findVarFromIO(nid, 'attach', 'attach'));
    for (const hid of findInput) {
        result.push(...findVarFromIO(nid, hid, 'input'));
    }
    for (const hid of findOutput) {
        result.push(...findVarFromIO(nid, hid, 'output'));
    }
    return result;
};

const mapVarItemToSelect = (item) => {
    return {
        label: `${item.nlabel}/${item.dlabel}/${item.dkey}/${item.dtype}`,
        value: `${item.nodeId}/${item.dpath[0]}/${item.dpath[1]}`,
    }
}
// 输出变量字典{列表}
const outputVarSelections = computed(() => {
    const selections = {};
    for (const hid of Object.keys(thisnode.value.data.connections.outputs)) {
        selections[hid] = recursiveFindVariables(props.nodeId, false, false, false, [], false, [hid])
            .map((item) => mapVarItemToSelect(item));
    }
    return selections;
})
// 自身可用变量
const selfVarSelections = computed(() => {
    return recursiveFindVariables(props.nodeId, true, false, false, [], false, [])
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
        return acc;
    }, {});
});
// 渲染输出的连接 =============================================
const outputsComponent = computed(() => {
    const uitype = thisnode.value.data.connections['outputs-uitype'];
    if (uitype === 'tagoutputs') {
        return h(editable_tagoutputs, { nodeId: props.nodeId, outputVarSelections: outputVarSelections.value });
    }
    else if (uitype === 'packoutputs') {
        return h(editable_packoutputs, { nodeId: props.nodeId, selfVarSelections: selfVarSelections.value });
    }
    return null;
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
    <div class="nodepanel">
        <n-scrollbar style="max-height: calc(100vh - 80px);">
            <n-card header-style="height: 70px;">
                <template #header>
                    <n-h2 prefix="bar" align-text v-if="!isEditingTitle" class="card-title" @click="startEditTilte">
                        <n-text type="success" strong>{{ thisnode.data.label }}</n-text>
                    </n-h2>
                    <n-input v-else v-model:value="thisnode.data.label" :placeholder="thisnode.data.placeholderlabel"
                        ref="titleInputRef" :bordered="false" @blur="saveTitle" class="title-input" />
                </template>

                <!-- 渲染输入的连接 -->
                <!-- 渲染内置变量 -->
                <n-flex vertical v-if="Object.keys(payloadInnerComponents).length > 0">
                    <editable_header type="default">内置变量</editable_header>
                    <n-flex vertical>
                        <template v-for="pid in thisnode.data.payloads.order" :key="pid">
                            <component v-if="payloadInnerComponents[pid]" :is="payloadInnerComponents[pid]" />
                        </template>
                    </n-flex>
                </n-flex>
                <!-- 渲染负载数据 -->
                <n-flex vertical>
                    <template v-for="pid in thisnode.data.payloads.order" :key="pid">
                        <component v-if="payloadComponents[pid]" :is="payloadComponents[pid]" />
                    </template>
                </n-flex>
                <!-- 渲染输出的连接 -->
                <component v-if="outputsComponent" :is="outputsComponent" :key="`${nodeId}-outputs`" />
                <!-- <div>{{ sourceConnections }}</div> -->
                <!-- <pre>edge count: {{ inputConnections.length }}</pre> -->
                <!-- <pre>inputConnections: {{ inputConnections }}</pre> -->
                <n-divider />
                <pre>{{ nodedatatext }}</pre>
            </n-card>
        </n-scrollbar>
    </div>
</template>

<style scoped>
.nodepanel {
    margin-top: 20px;
    max-width: 500px;
}

.nodepanel:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}

.card-title {
    cursor: pointer;
    padding: 0;
    font-weight: 500;
}

.title-input {
    font-weight: 500;
}
</style>