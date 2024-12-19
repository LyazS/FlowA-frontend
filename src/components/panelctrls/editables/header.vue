<template>
    <level prefix="bar" :type="type" class="header">
        <slot></slot>
    </level>
</template>

<style scoped>
.header {
    margin-top: 0;
    margin-bottom: 0;
}
</style>

<script setup>
import { computed } from 'vue'
import { NH1, NH2, NH3, NH4, NH5, NH6, NText } from 'naive-ui'
const props = defineProps({
    type: {
        type: String,
        required: false,
        default: 'default'
    },
    level: {
        type: Number,
        required: false,
        default: 3
    }
})
const levelMap = {
    1: NH1,
    2: NH2,
    3: NH3,
    4: NH4,
    5: NH5,
    6: NH6
}
const level = computed(() => levelMap[props.level])
</script>