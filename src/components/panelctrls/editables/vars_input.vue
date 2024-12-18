<template>
    <n-flex vertical>
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="success">
                输入变量
            </editable_header>
            <n-button text type="success" @click="addVariable" :disabled="!isEditorMode">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                新增变量
            </n-button>
        </n-flex>
        <n-flex v-for="(pvar, vindex) in thisnode.data.payloads.byId[pid].data" class="flexctitem"
            justify="space-between" :style="{ width: '100%' }" :wrap="false">
            <n-flex vertical :style="{ width: '95%' }">
                <n-flex :wrap="false">
                    <n-input :style="{ width: '30%' }" size="small" placeholder="变量名" v-model:value="pvar.key"
                        :disabled="!isEditorMode" @blur="isEditing = false" @focus="isEditing = true" />
                    <n-select :style="{ width: '20%' }" size="small" placeholder="类型" :options="typeSelections"
                        :disabled="!isEditorMode" v-model:value="pvar.type" />
                    <n-select v-if="pvar.type === 'ref'" :style="{ width: '50%' }" size="small" placeholder="引用"
                        :disabled="!isEditorMode" :options="selfVarSelections" :render-label="renderLabel"
                        v-model:value="pvar.value" />
                    <n-input v-else :style="{ width: '50%' }" size="small" placeholder="数值" v-model:value="pvar.value"
                        :disabled="!isEditorMode" @blur="isEditing = false" @focus="isEditing = true" />
                </n-flex>
            </n-flex>
            <n-button circle tertiary size="small" type="error" @click="rmVariable(vindex)" :disabled="!isEditorMode">
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
import { mapVarItemToSelect, renderLabel4Select } from '@/utils/tools'
import { typeSelections } from '@/utils/schemas'
import editable_header from './header.vue'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
    pid: {
        type: String,
        required: true
    }
})
const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();
// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

const addVariable = () => {
    const newVar = { key: "", type: "value", value: "" };
    thisnode.value.data.payloads.byId[props.pid].data.push(newVar);
};

const rmVariable = (index) => {
    thisnode.value.data.payloads.byId[props.pid].data.splice(index, 1);
};
const renderLabel = (option) => {
    const [nlabel, dlabel, dkey, dtype] = option.label.split("/");
    const isError = !props.selfVarSelections.some(select => select.value === option.value);
    return renderLabel4Select(nlabel, dlabel, dtype, isError);
};
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>