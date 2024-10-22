<script setup>
import { computed, ref, watch } from 'vue';
import { darkTheme, NConfigProvider, NMessageProvider, NCard, NButton } from 'naive-ui';
import { Panel, useVueFlow } from '@vue-flow/core'
import nodepanel from './nodepanel.vue'

const props = defineProps({
    nodeId: {
        type: [String, null],
        required: true
    }
})
</script>

<template>
    <Panel position="top-right" :style="{ width: '500px' }">
        <n-config-provider :theme="darkTheme">
            <n-message-provider>
                <n-button type="success">测试按钮</n-button>
                <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
            </n-message-provider>
        </n-config-provider>
    </Panel>
</template>
<style scoped></style>