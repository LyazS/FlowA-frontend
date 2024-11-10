<script setup>
import { ref, onMounted, reactive, inject, computed } from 'vue';
import { useVueFlow, useHandleConnections } from '@vue-flow/core'
import { NText, NCode, NH6, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
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


</script>
<template>
    <n-flex vertical>
        <editable_header>
            {{ thisnode.data.payloads.byId[pid].label }}
        </editable_header>
        <n-code :code="thisnode.data.payloads.byId[pid].data" language="python" />
    </n-flex>
</template>