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
    <n-config-provider :theme="darkTheme">
        <n-message-provider>
            <nodepanel v-if="!!nodeId" :nodeId="nodeId" />
        </n-message-provider>
    </n-config-provider>
</template>
<style scoped></style>