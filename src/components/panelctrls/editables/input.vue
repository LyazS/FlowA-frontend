<template>
    <n-flex vertical>
        <n-text>输入</n-text>
        <n-input-group>
            <n-input :style="{ width: '33%' }" placeholder="变量名字" :disabled="!isEditorMode" />
            <n-select :style="{ width: '22%' }" v-model:value="selectOption" :options="selectOptions"
                :disabled="!isEditorMode" />

            <n-select v-if="selectOption == 1" :style="{ width: '44%' }" v-model:value="refOption"
                :disabled="!isEditorMode" :options="refOptions" />
            <n-input v-else :style="{ width: '44%' }" placeholder="变量值" :disabled="!isEditorMode" />
        </n-input-group>
    </n-flex>
</template>

<script setup>
import { ref } from 'vue'
import { NText, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})
const { isEditorMode } = useFlowAOperation();
const selectOption = ref(1);
const selectOptions = ref([
    // 整数、浮点数、字符串、布尔值、数组、字典、集合
    { label: '引用', value: 1 },
    { label: '整数值', value: 2 },
    { label: '浮点值', value: 3 },
    { label: '字符串', value: 4 },
    { label: '布尔值', value: 5 },
    { label: '数组', value: 6 },
    { label: '字典', value: 7 },
    { label: '集合', value: 8 },
]);
const refOption = ref(1);
const refOptions = [
    { label: '测试1', value: 1 },
    { label: '测试2', value: 2 },
    { label: '测试3', value: 3 },
]
</script>