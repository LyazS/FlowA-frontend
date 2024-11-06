<template>
    <n-flex vertical>
        <editable_header type="info">输出</editable_header>
        <n-flex class="flexctitem" v-for="item in nodeOutput" :key="item.id" :wrap="false">
            <n-text v-if="hasMultipleOutputs">
                {{ item.label }}
            </n-text>
            <n-tag :bordered="false" type="info">{{ item.id }}</n-tag>
            <n-text>{{ item.type }}</n-text>
        </n-flex>
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
import { NText, NFlex, NTag } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})

// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

// 判断是否有多个输出
const hasMultipleOutputs = computed(() =>
    Object.keys(thisnode.value.data.connections.outputs).length > 1
)

// 转换输出数据
const nodeOutput = computed(() => {
    const connections = thisnode.value.data.connections.outputs
    const nodeData = thisnode.value.data

    return Object.values(connections)
        .flatMap(connection =>
            Object.entries(connection.data)
                .filter(([_, value]) => value.type === 'FromInner')
                .map(([_, value]) => ({
                    label: connection.label,
                    path: value.path
                }))
        )
        .map(({ label, path: [pathKey, pathId] }) => {
            const payload = nodeData[pathKey].byId[pathId]
            return {
                label,
                id: payload.key,
                type: payload.type
            }
        })
})
</script>