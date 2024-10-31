<script setup>
import { computed, ref, watch, nextTick, inject, onUnmounted, h } from 'vue';
import { NFlex, NH2, NCard, NScrollbar, NInput, NText } from 'naive-ui';
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
import editable_input from './editables/input.vue';
import editable_output from './editables/output.vue';
import editable_textcontent from './editables/textcontent.vue';
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
const renderPayload = (payload, pid) => {
    if (payload.uitype === 'textcontent') {
        return h(editable_textcontent, { nodeId: props.nodeId, pid });
    }
    else return null;
};
const payloadsComp = computed(() => {
    return thisnode.value.data.payloads.order
        .map((pid) => {
            return renderPayload(
                thisnode.value.data.payloads.byId[pid],
                pid,
            );
        })
        .filter((vue_h) => vue_h !== null);
});
// 渲染输出的连接 =============================================
const renderConnections = (connection, type) => {
    if (type === 'input') {
        return h(editable_input, {});
    }
    else if (type === 'output') {
        return h(editable_output, { nodeId: props.nodeId });
    }
};


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
                    <component v-for="(comp, compidx) in payloadsComp" :key="`${compidx}`" :is="comp" />
                </n-flex>
                <!-- 渲染输出的连接 -->
                <component v-if="thisnode.data.connections.output" :key="`rd-output`"
                    :is="rederConnections(thisnode.data.connections.output, 'output')" />

                <!-- <editable_textcontent :nodeId="nodeId" :payloadidx="0" /> -->
                <!-- <div>{{ sourceConnections }}</div> -->
                <pre>edge count: {{ inputConnections.length }}</pre>
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