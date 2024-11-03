<template>
    <n-flex vertical>
        <n-flex>
            <editable_header>
                {{ thisnode.data.payloads.byId[pid].label }}
            </editable_header>
            <n-select multiple v-model:value="selectValue" :options="inputSelections"></n-select>
        </n-flex>
        <n-text v-for="printtext in printtexts" :key="printtext">
            {{ printtext }}
        </n-text>
    </n-flex>
</template>
<style scoped></style>
<script setup>
import { ref, computed, inject, watch, nextTick } from 'vue'
import { NText, NH6, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { Panel, useVueFlow, useHandleConnections } from '@vue-flow/core'
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
    inputSelections: {
        type: Array,
        required: true
    },
})
const { findNode } = useVueFlow();
const isEditing = inject("isEditing");

const thisnode = computed(() => {
    return findNode(props.nodeId);
});

const selectValue = ref(thisnode.value.data.payloads.byId[props.pid].data);

watch(selectValue, (newVal) => {
    // 当 selectValue 变化时更新原始数据
    thisnode.value.data.payloads.byId[props.pid].data = newVal;
});

watch([() => props.inputSelections], ([newSelections]) => {
    // 过滤现有的 selectValue，只保留在 inputSelections 中存在的值
    const newdata = selectValue.value.filter(select =>
        newSelections.some(item => item.value === select)
    );
    // 更新两个地方的值
    selectValue.value = newdata;
    thisnode.value.data.payloads.byId[props.pid].data = newdata;
}, { immediate: true });

const printtexts = computed(() => {
    return thisnode.value.data.payloads.byId[props.pid].data.map(item => {
        const [nid, dpath, did] = item.split("/");
        const thenode = findNode(nid);
        const data = thenode.data[dpath].byId[did].data;
        return data;
    });
});
</script>