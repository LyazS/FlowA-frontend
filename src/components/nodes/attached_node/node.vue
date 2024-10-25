<template>
    <div class="node-container">
        <template v-if="showInputHandle">
            <div class="corner-text" :style="{justifyContent: 'flex-end'}">
                OUTPUT
            </div>
            <Handle id="input" type="target" :position="Position.Left" :style="{ left: `2px` }" />
        </template>
        <template v-if="showCallbackUserHandle">
            <div class="corner-text" :style="{justifyContent: 'flex-start'}">
                CB-FUN
            </div>
            <Handle id="callbackUser" type="source" :position="Position.Right" :style="{ right: `2px` }" />
        </template>
        <template v-if="showCallbackFuncHandle">
            <div class="corner-text" :style="{justifyContent: 'flex-end'}">
                USE-CB
            </div>
            <Handle id="callbackFunc" type="target" :position="Position.Left" :style="{ left: `2px` }" />
        </template>
        <template v-if="showOutputHandle">
            <div class="corner-text" :style="{justifyContent: 'flex-start'}">
                INPUT
            </div>
            <Handle id="output" type="source" :position="Position.Right" :style="{ right: `2px` }" />
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex, NLayout } from 'naive-ui';
const props = defineProps(['id', 'data']);
const showOutputHandle = !!(props.data.attached_type === 'input');
const showCallbackUserHandle = !!(props.data.attached_type === 'callbackFunc');
const showCallbackFuncHandle = !!(props.data.attached_type === 'callbackUser');
const showInputHandle = !!(props.data.attached_type === 'output');
</script>

<style>
.vue-flow__node-attached_node {
    pointer-events: none;
    /* border-top-left-radius: 0px; */
    /* border-top-right-radius: 0px; */
    /* border-bottom-left-radius: 0px; */
    /* border-bottom-right-radius: 0px; */
}

.vue-flow__node-attached_node:hover {
    box-shadow: 0 0 0px;
}
</style>
<style scoped>
.node-container {
    width: 100%;
    height: 100%;
    position: relative;
    
}

.corner-text {
    font-size: 4px;
    color: white;
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* position: absolute; */
    display: flex;
    /* align-items: flex-end; */
    height: auto;
    text-align: center;
}
</style>