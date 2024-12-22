<template>
    <n-flex vertical>
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="info">输出数组</editable_header>
            <n-button type="primary" text @click="handleAdd" :disabled="!isEditorMode">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                添加输出
            </n-button>
        </n-flex>
        <n-flex v-for="rid in thisnode.data.results.order" :key="rid" class="flexctitem" justify="space-between"
            :style="{ width: '100%' }" :wrap="false">
            <n-flex vertical :style="{ width: '95%' }">
                <n-flex :wrap="false">
                    <n-input :style="{ width: '50%' }" size="small" placeholder="变量名"
                        :value="thisnode.data.results.byId[rid].key" @blur="isEditing = false" @focus="isEditing = true"
                        @update:value="(v) => updateResultKey(rid, v)" :disabled="!isEditorMode" />
                    <cp_var_select :style="{ width: '50%' }" v-model:value="thisnode.data.results.byId[rid].config.ref"
                        :options="selfVarSelections" size="small" />
                </n-flex>
            </n-flex>
            <n-button circle tertiary size="small" type="error" @click="handleRemove(rid)" :disabled="!isEditorMode">
                <template #icon>
                    <n-icon>
                        <Close />
                    </n-icon>
                </template>
            </n-button>
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
import { computed, ref, inject, h, defineAsyncComponent } from 'vue'
import { NText, NIcon, NFlex, NTag, NInputGroup, NInput, NSelect, NButton } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'
import { Add, Close } from '@vicons/ionicons5'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import editable_header from './common/header.vue'
import { addResultWConnect, rmResultWConnect } from '../../nodes/NodeOperator.js'

const cp_var_select = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_select.vue'));
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
})

const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();
// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

// 处理添加
function handleAdd() {
    const newResult = { label: "", type: "List", key: "", data: [], config: { ref: "" } }
    addResultWConnect(thisnode.value, newResult, "output")
}
function handleRemove(rid) {
    rmResultWConnect(thisnode.value, rid)
}
// 更新结果的 key
function updateResultKey(rid, value) {
    if (thisnode.value.data.results.byId[rid]) {
        thisnode.value.data.results.byId[rid].key = value;
        thisnode.value.data.results.byId[rid].label = value;
    }
}
</script>