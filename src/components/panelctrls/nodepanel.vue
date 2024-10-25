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
    <n-card class="nodepanel-card" title="卡片">
        {{ nodetext }}
    </n-card>
</template>
<style scoped>
.nodepanel-card {
    transform: translateY(20px);
    max-width: 500px;
}

.nodepanel-card:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
}
</style>