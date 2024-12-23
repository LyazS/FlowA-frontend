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
        <cp_var_input v-for="(pvar, vindex) in thisnode.data.payloads.byId[pid].data" v-model:itemKey="pvar.key"
            v-model:itemType="pvar.type" v-model:itemValue="pvar.value" :selfVarSelections="selfVarSelections"
            :itemIdx="vindex" @remove="rmVariable(vindex)" />
    </n-flex>

</template>

<script setup>
import { ref, computed, h, inject, defineAsyncComponent } from 'vue'
import { useMessage, NSwitch, NFlex, NText, NIcon, NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './common/header.vue'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'

const cp_var_select = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_select.vue'));
const cp_var_input = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_input.vue'));
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
    const newVar = { key: "", type: "String", value: "" };
    thisnode.value.data.payloads.byId[props.pid].data.push(newVar);
};

const rmVariable = (index) => {
    thisnode.value.data.payloads.byId[props.pid].data.splice(index, 1);
};
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>