<template>
    <div ref="outerDiv" :style="{ width: '100%', height: '100%', position: 'relative' }">
        <n-layout class="layout-container">
            <div class="corner-text"
                :style="{ top: `${handle_gap}px`, left: `${corner_gap_left}px`, transform: 'translateY(-50%)' }">
                INPUT
            </div>

            <div class="corner-text"
                :style="{ top: `${handle_gap}px`, right: `${corner_gap_left}px`, transform: 'translateY(-50%)' }">
                USE-CALLBACK
            </div>

            <div class="corner-text"
                :style="{ top: `${handle_gap * 1.5}px`, left: `${corner_gap_left}px`, transform: 'translateY(50%)' }">
                CALLBACK-FUNC
            </div>

            <div class="corner-text"
                :style="{ top: `${handle_gap * 1.5}px`, right: `${corner_gap_left}px`, transform: 'translateY(50%)' }">
                OUTPUT
            </div>
            <div class="center-text">
                {{ data.label }}
            </div>

        </n-layout>

        <Handle id="input" type="target" :position="Position.Left"
            :style="{ top: `${handle_gap}px`, left: `${handle_gap}px` }" />
        <Handle id="callbackFunc" type="target" :position="Position.Left"
            :style="{ top: `${handle_gap * 2.9}px`, left: `${handle_gap}px` }" />
        <Handle id="callbackUser" type="source" :position="Position.Right"
            :style="{ top: `${handle_gap}px`, right: `${handle_gap}px` }" />
        <Handle id="output" type="source" :position="Position.Right"
            :style="{ top: `${handle_gap * 2.9}px`, right: `${handle_gap}px` }" />

    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch, computed } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex, NLayout } from 'naive-ui';
const props = defineProps(['id', 'label', 'data'])
const corner_gap_left = 10;
const handle_gap = 6;

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

<style></style>

<style scoped>
.stacked-flex {
    position: absolute;
    top: 0;
    left: 0;
}

.layout-container {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
}

.corner-text {
    font-size: 4px;
    color: white;
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    display: flex;
    align-items: flex-end;
    height: 8px;
    text-align: center;
}

.center-text {
    font-size: 12px;
    color: white;
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    text-wrap: nowrap;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
}
</style>