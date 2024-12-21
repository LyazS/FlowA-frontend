<template>
    <n-flex vertical>
        <n-flex>
            <editable_header>
                {{ thisnode.data.payloads.byId[pid].label }}
            </editable_header>
            <cp_var_select v-model:value="selectValue" :options="selfVarSelections" />
        </n-flex>
    </n-flex>
</template>
<style scoped></style>
<script setup>
import { ref, computed, inject, watch, nextTick, h, defineAsyncComponent } from 'vue'
import { NText, NTag, NH6, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import editable_header from './header.vue'

const cp_var_select = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_select.vue'));
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
})
const { findNode } = useVueFlow();
const { isEditorMode } = useFlowAOperation();

const thisnode = computed(() => {
    return findNode(props.nodeId);
});

const selectValue = computed({
    get() {
        return thisnode.value.data.payloads.byId[props.pid].data;
    },
    set(value) {
        thisnode.value.data.payloads.byId[props.pid].data = value;
    }
});
</script>