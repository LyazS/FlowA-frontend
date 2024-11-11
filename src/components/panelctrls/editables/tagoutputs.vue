<template>
    <n-flex vertical>
        <editable_header type="info">输出</editable_header>
        <n-flex vertical v-for="(items, hid) in nodeOutputs2">
            <n-flex v-for="item in items" class="flexctitem" :wrap="false">
                <n-text v-if="hasMultipleOutputs">
                    {{ hid }}
                </n-text>
                <n-text v-if="!isUniqueNlabel">
                    {{ item.nlabel }}
                </n-text>
                <n-text v-if="!isSingleOutput">
                    {{ item.dlabel }}
                </n-text>
                <n-tag :bordered="false" type="info">{{ item.dkey }}</n-tag>
                <n-text>{{ item.dtype }}</n-text>
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
                nlabel: thenode.data.label,
                dlabel: data.label,
                dkey: data.key,
                dtype: data.type,
            });
        }
    }
    return vars;
});

// 检查nodeOutputs2长度是否只有一个
const isSingleOutput = computed(() => {
    return Object.keys(nodeOutputs2.value).length <= 1;
});

// 检查nodeOutputs2每一个hid的数组，nlabel是不是唯一的
const isUniqueNlabel = computed(() => {
    const allNlabels = Object.values(nodeOutputs2.value)
        .flatMap(items => items.map(item => item.nlabel));
    return new Set(allNlabels).size <= 1;
});
</script>