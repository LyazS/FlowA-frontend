<script setup>
import { computed, ref, watch } from 'vue';
import { NCard } from 'naive-ui';
import { Panel, useVueFlow } from '@vue-flow/core'
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})
const {
    getNodes,
    getEdges,
    getSelectedNodes,
    addNodes,
    findNode,
    removeNodes,
    onConnect,
    addEdges,
    removeEdges,
} = useVueFlow();
const nodetext = computed(() => {
    const node = findNode(props.nodeId)
    return node?.data;
})
</script>

<template>
    <Panel class="nodepanel" position="top-right">
        <n-card title="卡片">
            {{ nodetext }}
        </n-card>
    </Panel>
</template>
<style scoped>
.nodepanel {
    transform: translateY(50px);
}
</style>