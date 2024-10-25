<template>
    <div :style="{ width: '100%', height: '100%', position: 'relative' }">
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
                :style="{ bottom: `${handle_gap}px`, left: `${corner_gap_left}px`, transform: 'translateY(50%)' }">
                CALLBACK-FUNC
            </div>

            <div v-if="showOutputHandle" class="corner-text"
                :style="{ bottom: `${handle_gap}px`, right: `${corner_gap_left}px`, transform: 'translateY(50%)' }">
                OUTPUT
            </div>

            <div class="center-text">
                {{ data.label }}
            </div>
        </n-layout>
        <Handle v-if="showInputHandle" id="input" type="target" :position="Position.Left"
            :style="{ top: `${handle_gap}px`, left: `${handle_gap}px` }" />
        <Handle v-if="showCallbackFuncHandle" id="callbackFunc" type="target" :position="Position.Left"
            :style="{ top: `${handle_bottom_pos}px`, left: `${handle_gap}px` }" />
        <Handle v-if="showCallbackUserHandle" id="callbackUser" type="source" :position="Position.Right"
            :style="{ top: `${handle_gap}px`, right: `${handle_gap}px` }" />
        <Handle v-if="showOutputHandle" id="output" type="source" :position="Position.Right"
            :style="{ top: `${handle_bottom_pos}px`, right: `${handle_gap}px` }" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex, NLayout } from 'naive-ui';
const props = defineProps(['id', 'data'])

const corner_gap_left = 10;
const handle_gap = 6;
const handle_bottom_pos = computed(() => { return props.data.size.height - (handle_gap + 8); });

const showInputHandle = !!props.data.input;
const showCallbackFuncHandle = !!props.data.callbackFunc;
const showCallbackUserHandle = !!props.data.callbackUser;
const showOutputHandle = !!props.data.output;
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: transparent;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>