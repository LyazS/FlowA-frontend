<template>
    <n-flex vertical>
        <editable_header type="info">输出</editable_header>
        <!-- <n-flex vertical v-for="item in nodeOutputs">
            <n-tag :bordered="false" type="info">{{ item.dkey }}</n-tag>
            <n-text>{{ item.dtype }}</n-text>
        </n-flex> -->
        <n-tag :bordered="false" type="info">{{ dkey }}</n-tag>
        <n-text>{{ dtype }}</n-text>
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
    rid: {
        type: String,
        required: true
    }
})

// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))
const dkey = computed(() => thisnode.data.result.byId[props.rid].key);
const dtype = computed(() => thisnode.data.result.byId[props.rid].type);
// const nodeOutputs = computed(() => {
//     const outputs = [];
//     for (const rid in thisnode.data.result.order) {
//         const data = thisnode.data.result.byId[rid];
//         outputs.push(
//             {
//                 dkey: data.key,
//                 dtype: data.type,
//             });
//     }
//     return outputs;
// });

</script>