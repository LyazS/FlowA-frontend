<script setup>
import { computed, ref, watch, nextTick, inject, onUnmounted, h } from 'vue';
import { NFlex, NH2, NCard, NScrollbar, NInput, NText } from 'naive-ui';
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
import editable_input from './editables/input.vue';
import editable_output from './editables/output.vue';
import editable_textinput from './editables/textinput.vue';
import editable_textprint from './editables/textprint.vue';
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
// 标题相关 ======================================
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
            acc[pid] = h(editable_textprint, { nodeId: props.nodeId, pid, inputConnections: inputConnections.value });
        }
        return acc;
    }, {});
});
// 渲染输出的连接 =============================================
const isShowOutput = computed(() => {
    return Object.keys(thisnode.value.data.connections.outputs).length > 0;
});
const renderConnections = (ctype) => {
    if (ctype === 'inputs') {
        return h(editable_input, {});
    }
    else if (ctype === 'outputs') {
        return h(editable_output, { nodeId: props.nodeId });
    }
};

// 待用信息 ==================================================
const getHandleConnectInfos = (id, type, nodeId) => {
    const connections = getHandleConnections({
        type,
        nodeId,
        id,
    });

    return connections.reduce((acc, c) => {
        const c_node = findNode(c.source);
        let src_node = c_node;
        let src_id = c.source;
        let handleid = c.sourceHandle;

        if (c_node.data._is_attached) {
            src_id = c_node.parentNode;
            src_node = findNode(src_id);
            handleid = id;
        }

        acc[src_id] = {
            srcid: src_id,
            handleid: handleid,
        };

        return acc;
    }, {});
}
const inputConnections = computed(() => {
    const inputIds = Object.keys(thisnode.value?.data?.connections?.inputs);
    const connections = inputIds.reduce((acc, id) => {
        const handleConnectInfos = getHandleConnections({ id: id, type: "target", nodeId: props.nodeId });
        acc = [...acc, ...handleConnectInfos];
        return acc;
    }, []);
    return connections;
});

const nodedatatext = computed(() => {
    if (!thisnode.value?.data) return '';
    return JSON.stringify(thisnode.value.data, null, 2);
});


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
                <pre>edge count: {{ inputConnections.length }}</pre>
                <pre>edge: {{ inputConnections }}</pre>
                <!-- <pre>{{ nodedatatext }}</pre> -->
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