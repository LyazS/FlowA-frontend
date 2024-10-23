<template>
    <div ref="outerDiv" :style="{ width: '100%', height: '100%', position: 'relative' }">
        <n-layout class="layout-container">
            <div v-if="showInputHandle" class="corner-text"
                :style="{ top: `${handle_gap}px`, left: `${corner_gap_left}px`, transform: 'translateY(-50%)' }">
                INPUT
            </div>

            <div v-if="showCallbackUserHandle" class="corner-text"
                :style="{ top: `${handle_gap}px`, right: `${corner_gap_left}px`, transform: 'translateY(-50%)' }">
                USE-CALLBACK
            </div>

            <div v-if="showCallbackFuncHandle" class="corner-text"
                :style="{ top: `${handle_gap * 1.5}px`, left: `${corner_gap_left}px`, transform: 'translateY(50%)' }">
                CALLBACK-FUNC
            </div>

            <div v-if="showOutputHandle" class="corner-text"
                :style="{ top: `${handle_gap * 1.5}px`, right: `${corner_gap_left}px`, transform: 'translateY(50%)' }">
                OUTPUT
            </div>
            <div class="center-text">
                {{ data.label }}
            </div>

        </n-layout>

        <!-- <n-flex class="stacked-flex" vertical align="center" justify="center">
        </n-flex> -->
        <!-- <div ref="lastDiv" class="dynamic-height-div"></div> -->
        <div class="dynamic-height-div"></div>

        <Handle v-if="showInputHandle" id="input" type="target" :position="Position.Left"
            :style="{ top: `${handle_gap}px`, left: `${handle_gap}px` }" />
        <Handle v-if="showCallbackFuncHandle" id="callbackFunc" type="target" :position="Position.Left"
            :style="{ top: `${handle_gap * 2.9}px`, left: `${handle_gap}px` }" />
        <Handle v-if="showCallbackUserHandle" id="callbackUser" type="source" :position="Position.Right"
            :style="{ top: `${handle_gap}px`, right: `${handle_gap}px` }" />
        <Handle v-if="showOutputHandle" id="output" type="source" :position="Position.Right"
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
const handle_bottom_pos = computed(() => { return props.data.size.height - (handle_gap + 8); });

const showInputHandle = !!props.data.input;
const showCallbackFuncHandle = !!props.data.callbackFunc;
const showCallbackUserHandle = !!props.data.callbackUser;
const showOutputHandle = !!props.data.output;
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
    z-index: 1;
}

.layout-container {
    width: 100%;
    height: 100%;
    /* position: relative; */
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
    z-index: 2;
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
    z-index: 2;
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