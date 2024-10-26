<script setup>
import { computed, ref, watch } from 'vue';
import {
    useMessage,
    darkTheme,
    NConfigProvider,
    NMessageProvider,
    NCard,
    NButton,
    NFlex,
} from 'naive-ui';
import { Panel, useVueFlow } from '@vue-flow/core'
import nodepanel from './nodepanel.vue'
const message = useMessage();
const props = defineProps({
    nodeId: {
        type: [String, null],
        required: true
    }
})
const testclick = () => {
    message.success('test')
}
</script>

<template>
    <Panel position="top-right" :style="{ minWidth: '500px' }">
        <n-flex justify="flex-end">
            <n-button class="glow-btn" strong tertiary  round type="success" @click="testclick">运行</n-button>
            <n-button class="glow-btn" strong tertiary  round type="success" @click="testclick">导出</n-button>
        </n-flex>
        <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
    </Panel>
</template>
<style scoped>
.glow-btn:hover{
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>