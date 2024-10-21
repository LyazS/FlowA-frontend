<template>
    <div ref="outerDiv" :style="{ width: '100%', height: '100%' }">
        <Handle class="test_nested_node-handle-com test_nested_node-handle" id="input" type="target" :position="Position.Left" />
        <Handle class="test_nested_node-handle-com test_nested_node-handle" id="output" type="source" :position="Position.Right" />
        <n-flex vertical align="center" justify="center">
            <n-flex class="left-flex">
                <div :style="{ color: 'white', height: '15px' }">测试节点-迭代</div>
            </n-flex>
            <div ref="lastDiv" class="dynamic-height-div"></div>
        </n-flex>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex } from 'naive-ui';
const props = defineProps(['id', 'label', 'data'])

const outerDiv = ref(null)
const lastDiv = ref(null)

let resizeObserver = null

function updateLastDivHeight() {
    if (outerDiv.value && lastDiv.value) {
        const outerHeight = outerDiv.value.clientHeight
        const lastDivTop = lastDiv.value.offsetTop
        const remainingHeight = outerHeight - lastDivTop
        lastDiv.value.style.height = `${remainingHeight}px`
    }
}

onMounted(() => {
    if (outerDiv.value) {
        resizeObserver = new ResizeObserver(() => {
            updateLastDivHeight()
        })
        resizeObserver.observe(outerDiv.value)
    }
})

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect()
    }
})
</script>

<style>
</style>

<style scoped>
.test_nested_node-handle-com:hover{
    background-color: rgb(255, 255, 255);
}
.test_nested_node-handle {
    height: 32px;
    width: 12px;
    border-radius: 4px
}

.test_nested_node-handle-callback {
    height: 12px;
    width: 32px;
    border-radius: 4px
}

.left-flex {
    width: 100%;
    justify-content: flex-start;
}

.dynamic-height-div {
    width: 98%;
    background-color: rgb(32, 32, 32);
}
</style>