<template>
    <n-flex vertical>
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="info">
                输出变量
            </editable_header>
            <n-button text type="info" @click="addVariable" :disabled="!isEditorMode">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                新增变量
            </n-button>
        </n-flex>
        <n-flex v-for="rid in thisnode.data.results.order" class="flexctitem" justify="space-between"
            :style="{ width: '100%' }" :wrap="false">
            <n-flex vertical :style="{ width: '95%' }">
                <n-flex :wrap="false">
                    <n-input :style="{ width: '50%' }" size="small" placeholder="变量名"
                        :value="thisnode.data.results.byId[rid].key" @blur="isEditing = false" @focus="isEditing = true"
                        @update:value="(v) => updateVariable(rid, v)" :disabled="!isEditorMode" />
                    <n-select :style="{ width: '50%' }" size="small" placeholder="变量类型"
                        v-model:value="thisnode.data.results.byId[rid].type" :options="CodeVarTypes"
                        :disabled="!isEditorMode" />
                </n-flex>
            </n-flex>
            <n-button circle tertiary size="small" type="error" @click="rmVariable(rid)" :disabled="!isEditorMode">
                <template #icon>
                    <n-icon>
                        <Close />
                    </n-icon>
                </template>
            </n-button>
        </n-flex>

    </n-flex>

</template>

<script setup>
import { ref, computed, h, inject } from 'vue'
import { useMessage, NSwitch, NFlex, NText, NIcon, NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import {
    addResult,
    rmResult,
    addConnection,
    rmConnection,
    addResultWConnect,
    rmResultWConnect,
} from '../../nodes/NodeOperator.js'
import { getUuid } from '@/utils/tools.js'
import { VariableTypes, FileVariableTypes } from '@/utils/schemas.js'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})
const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();
// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))
const CodeVarTypes = [...VariableTypes, ...FileVariableTypes]
const addVariable = () => {
    const rid = getUuid();
    const cid = `c-${rid}`;
    const newVariable = {
        label: "",
        type: "String",
        key: "",
        data: null,
    };
    addResultWConnect(thisnode.value, newVariable, "output", rid, cid);
};
const updateVariable = (rid, key) => {
    thisnode.value.data.results.byId[rid].key = key;
    thisnode.value.data.results.byId[rid].label = key;
};
const rmVariable = (rid) => {
    rmResultWConnect(thisnode.value, rid);
};


</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>