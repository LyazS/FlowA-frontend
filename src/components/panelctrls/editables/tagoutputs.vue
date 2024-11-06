<template>
    <n-flex vertical>
        <editable_header type="info">输出</editable_header>
        <n-flex vertical v-for="(items, hid) in nodeOutputs2">
            <n-flex v-for="item in items" class="flexctitem" :wrap="false">
                <n-text v-if="hasMultipleOutputs">
                    {{ item.label }}
                </n-text>
                <n-text>{{ item.nid }}</n-text>
                <n-tag :bordered="false" type="info">{{ item.key }}</n-tag>
                <n-text>{{ item.type }}</n-text>
            </n-flex>
        </n-flex>
    </n-flex>
</template>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>

<script setup>
import { computed } from 'vue'
import { NText, NFlex, NTag } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    outputVarSelections: {
        type: Object,
        required: true
    },
})

// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

// 判断是否有多个输出
const hasMultipleOutputs = computed(() => {
    return Object.keys(thisnode.value.data.connections.outputs).length > 1;
})

// 转换输出数据
const nodeOutputs2 = computed(() => {
    const vars = {};
    for (const [hid, items] of Object.entries(props.outputVarSelections)) {
        vars[hid] = [];
        for (const item of items) {
            const [nid, dpath, did] = item.value.split("/");
            const thenode = findNode(nid);
            const data = thenode.data[dpath].byId[did];
            vars[hid].push({
                nid: nid,
                label: data.label,
                key: data.key,
                type: data.type,
            });
        }
    }
    return vars;
});
</script>