<template>
    <n-flex vertical>
        <n-text>{{ text_label }}</n-text>
        <n-input type="textarea" :autosize="{ minRows: 3 }" v-model:value="text_value" @blur="isEditing = false"
            @focus="isEditing = true" />
    </n-flex>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { NText, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    payloadidx: {
        type: Number,
        required: true
    }
})
const { findNode } = useVueFlow();
const isEditing = inject("isEditing");

const thisnode = computed(() => {
    return findNode(props.nodeId);
});

const text_label = computed({
    get() {
        return thisnode.value.data.payloads[props.payloadidx].label;
    },
    set(new_val) {
        thisnode.value.data.payloads[props.payloadidx].label = new_val;
    }
})
const text_value = computed({
    get() {
        return thisnode.value.data.payloads[props.payloadidx].text;
    },
    set(new_val) {
        thisnode.value.data.payloads[props.payloadidx].text = new_val;
    }
})
</script>