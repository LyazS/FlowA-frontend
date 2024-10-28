<template>
    <n-flex vertical>
        <editable_header type="info">输出</editable_header>
        <n-flex :warp="false" v-for="(item, index) in nodeOutput">
            <n-text>{{ item.id }}</n-text>
            <n-text>{{ item.type }}</n-text>
        </n-flex>
    </n-flex>
</template>

<style scoped></style>

<script setup>
import { ref, computed } from 'vue'
import { NText, NH6, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import { getValueByPath } from './utils.js'
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

const nodeOutput = computed(() => {
    return thisnode.value.data.connections.output.map(
        (item) => {
            const itemValue = getValueByPath(thisnode.value.data, item.path);
            return { id: itemValue.id, type: itemValue.type }
        }
    )

});

</script>