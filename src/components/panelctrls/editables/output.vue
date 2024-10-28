<template>
    <n-flex vertical>
        <n-text>输出</n-text>
        <n-flex :warp="false" v-for="(item, index) in output_name">
            <n-text>{{ item.name }}</n-text>
            <n-text>{{ item.type }}</n-text>
        </n-flex>
    </n-flex>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NText, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})
const { findNode } = useVueFlow();
const thisnode = computed(() => {
    return findNode(props.nodeId);
});

const output_name = thisnode.value.data.connections.output;

</script>