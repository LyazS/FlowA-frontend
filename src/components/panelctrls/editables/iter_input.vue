<template>
    <n-flex vertical>
        <n-flex>
            <editable_header>
                {{ thisnode.data.payloads.byId[pid].label }}
            </editable_header>
            <n-select clearable  v-model:value="selectValue" :options="selfVarSelections"
                :render-tag="renderTag" :disabled="!isEditorMode"></n-select>
        </n-flex>
    </n-flex>
</template>
<style scoped></style>
<script setup>
import { ref, computed, inject, watch, nextTick, h } from 'vue'
import { NText, NTag, NH6, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import editable_header from './header.vue'
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

const selectValue = ref(thisnode.value.data.payloads.byId[props.pid].data);

watch(selectValue, (newVal) => {
    // 当 selectValue 变化时更新原始数据
    thisnode.value.data.payloads.byId[props.pid].data = newVal;
});

const renderTag = ({ option, handleClose }) => {
    const [nlabel, dlabel, dkey, dtype] = option.label.split("/");

    const isError = !props.selfVarSelections.some(select => select.value === option.value);
    const tagtype = isError ? "error" : "default";
    return h(
        NTag,
        {
            type: tagtype,
            closable: true,
            onMousedown: (e) => {
                e.preventDefault();
            },
            onClose: (e) => {
                e.stopPropagation();
                handleClose();
            }
        },
        {
            default: () => {
                if (isError) {
                    return `❓${nlabel}`;
                }
                return [
                    h(NText, { type: "default", strong: true }, { default: () => `${nlabel}` }),
                    h(NText, { type: "default" }, { default: () => "/ " }),
                    h(NText, { type: "info", }, { default: () => dlabel }),
                    h(NText, { type: "info", }, { default: () => ` {${dkey}: ${dtype}}` }),
                ]
            }
        }
    );
};
</script>