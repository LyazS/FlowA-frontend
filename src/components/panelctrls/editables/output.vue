<template>
    <n-flex vertical>
        <editable_header type="info">输出</editable_header>
        <n-flex v-for="item in nodeOutput" :key="item.id" :wrap="false" class="output-item">
            <n-text v-if="hasMultipleOutputs" class="handle-label">
                {{ item.label }}
            </n-text>
            <n-text class="output-id">{{ item.id }}</n-text>
            <n-text class="output-type">{{ item.type }}</n-text>
        </n-flex>
    </n-flex>
</template>

<style scoped>
.output-item {
    gap: 8px;
    padding: 4px 0;
}

.handle-label {
    min-width: 80px;
}

.output-id,
.output-type {
    color: var(--text-color-secondary);
}
</style>

<script setup>
import { computed } from 'vue'
import { NText, NFlex } from 'naive-ui'
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