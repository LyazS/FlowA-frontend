<template>
    <n-flex vertical>
        <editable_header>
            {{ thisnode.data.payloads.byId[pid].label }}
        </editable_header>
        <n-input type="textarea" :autosize="{ minRows: 3, maxRows: 20 }" v-model:value="text_value"
            @blur="isEditing = false" @focus="isEditing = true" placeholder="输入点内容吧" />
    </n-flex>
</template>
<style scoped></style>
<script setup>
import { ref, computed, inject } from 'vue'
import { NText, NH6, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import editable_header from './header.vue'
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
const { findNode } = useVueFlow();
const isEditing = inject("isEditing");

const thisnode = computed(() => {
    return findNode(props.nodeId);
});

const text_value = computed({
    get() {
        return thisnode.value.data.payloads.byId[props.pid].data;
    },
    set(new_val) {
        thisnode.value.data.payloads.byId[props.pid].data = new_val;
    }
})
</script>