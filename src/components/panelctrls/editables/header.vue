<template>
    <n-h6 prefix="bar" :type="type" class="header">
        <slot></slot>
    </n-h6>
</template>

<style scoped>
.header {
    margin-top: 0;
    margin-bottom: 0;
}
</style>

<script setup>
import { NH6 } from 'naive-ui'
const props = defineProps({
    type: {
        type: String,
        required: false,
        default: 'default'
    }
})
</script>