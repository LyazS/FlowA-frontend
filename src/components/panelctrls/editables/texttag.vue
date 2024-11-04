<template>
    <!-- 横向的展示label以及对应的key，key放在ntag里 -->
    <n-flex class="flexctitem">
        <n-text :bordered="false">{{ nodeTextTag.label }}</n-text>
        <n-tag :bordered="false" type="info">{{ nodeTextTag.key }}</n-tag>
    </n-flex>
</template>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>

<script setup>
import { computed } from 'vue'
import { NText, NTag, NFlex } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    }
})

// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

// 获取文本标签数据
const nodeTextTag = computed(() => {
    const tagdata = thisnode.value.data.payloads.byId[props.pid];
    return {
        label: tagdata.label,
        key: tagdata.key,
    };
})
</script>
