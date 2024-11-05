<script setup>
import { computed, ref, watch, nextTick, inject, onUnmounted, onMounted, h } from 'vue';
import { NFlex, NH2, NCard, NScrollbar, NInput, NText, NDivider } from 'naive-ui';
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
import editable_input from './editables/input.vue';
import editable_output from './editables/output.vue';
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
// 渲染节点payload的内置变量 =======================================
const payloadInnerComponents = computed(() => {
    return thisnode.value.data.payloads.order.reduce((acc, pid) => {
        const payload = thisnode.value.data.payloads.byId[pid];
        // 只追踪需要的属性
        const { uitype } = payload; if (uitype === 'texttag') {
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
            acc[pid] = h(editable_textprint, { nodeId: props.nodeId, pid, inputSelections: inputSelections.value });
        }
        return acc;
    }, {});
});
// 渲染输出的连接 =============================================
const isShowOutput = computed(() => {
    return Object.keys(thisnode.value.data.connections.outputs).length > 0;
});

// 可供该节点使用的变量 ==================================================
const recursiveFindVariables = (nid, findInput) => {
    const result = [];
    const thenode = findNode(nid);
    for (const [hid, connection] of Object.entries(thenode.data.connections.inputs)) {
        // 添加该节点的变量
        if (findInput) {
            for (const c_data of Object.values(connection.data)) {
                if (c_data.type === 'FromInner') {
                    result.push({
                        nodeId: nid,
                        nlabel: thenode.data.label,
                        dpath: c_data.path,
                        dlabel: thenode.data[c_data.path[0]].byId[c_data.path[1]].label,
                        dtype: thenode.data[c_data.path[0]].byId[c_data.path[1]].type,
                    });
                }
            }
        }
        // 添加边连接的其他节点的输出变量
        const edges = getHandleConnections({ id: hid, type: "target", nodeId: nid });
        console.log("handle id: ", hid, "edges count: ", Object.keys(edges).length);
        for (const [eidx, edge] of Object.entries(edges)) {
            const src_nid = edge.source;
            const src_hid = edge.sourceHandle;
            console.log("snid: ", src_nid, "shid: ", src_hid);
            const src_node = findNode(src_nid);
            const src_ots = src_node.data.connections.outputs[src_hid];
            for (const [src_otid, src_ot] of Object.entries(src_ots.data)) {
                if (src_ot.type === 'FromInner') {
                    result.push({
                        nodeId: src_nid,
                        nlabel: src_node.data.label,
                        dpath: src_ot.path,
                        dlabel: src_node.data[src_ot.path[0]].byId[src_ot.path[1]].label,
                        dtype: src_node.data[src_ot.path[0]].byId[src_ot.path[1]].type,
                    });
                }
                else if (src_ot.type === 'FromOuter') {
                    result.push(...recursiveFindVariables(src_nid, false));
                }
                else if (src_ot.type === 'FromAttached') {
                    result.push(...recursiveFindVariables(
                        src_node.data.nesting.attached_nodes[src_ot.atype].nid, false
                    ));
                }
                else if (src_ot.type === 'FromParent') {
                    result.push(...recursiveFindVariables(src_node.parentNode, true));
                }
            }
        }
    }
    return result;
};

const inputSelections = computed(() => {
    return recursiveFindVariables(props.nodeId, true).map((item) => {
        return {
            label: `${item.nlabel} / ${item.dlabel}[${item.dtype}]`,
            value: `${item.nodeId}/${item.dpath[0]}/${item.dpath[1]}`,
        }
    });
})
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
                <editable_output v-if="isShowOutput" :nodeId="nodeId" :key="`${nodeId}-outputs`" />

                <!-- <editable_textcontent :nodeId="nodeId" :payloadidx="0" /> -->
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