<template>
    <n-flex vertical>
        <editable_header type="info">输出</editable_header>
        <n-flex :warp="false" v-for="(item, index) in nodeOutput">
            <n-text v-if="isShowHandleName">{{ item.label }}</n-text>
            <n-text>{{ item.id }}</n-text>
            <n-text>{{ item.type }}</n-text>
        </n-flex>
    </n-flex>
</template>

<style scoped></style>

<script setup>
import { ref, computed } from 'vue'
import { NText, NH6, NInput, NSelect, NInputGroup, NFlex } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import { getValueByPath } from './utils.js'
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})
const { findNode } = useVueFlow();
const thisnode = computed(() => {
    return findNode(props.nodeId);
});
const isShowHandleName = computed(() => {
    const otlen = Object.keys(thisnode.value.data.connections.outputs).length
    return otlen > 1;
});
function transformInputs(connections) {
    const cdata = Object.values(connections).reduce((acc, cur) => {
        Object.entries(cur.data).forEach(([cid, value]) => {
            if (value.type === 'FromInner') {
                acc.push({ label: cur.label, path: value.path });
            }
        });
        return acc;
    }, []);

    return cdata.map(item => {
        const pvalue = thisnode.value.data[item.path[0]].byId[item.path[1]]
        return {
            label: item.label,
            id: pvalue.key,
            type: pvalue.type,
        }
    });
}
const nodeOutput = computed(() => {
    return transformInputs(thisnode.value.data.connections.outputs);
});

</script>