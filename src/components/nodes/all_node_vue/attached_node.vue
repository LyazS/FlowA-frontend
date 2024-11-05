<template>
    <div class="node-container">
        <div class="corner-text" :style="{ justifyContent: justCont }">
            {{ node_text }}
        </div>
        <Handle :id="handle_id" :type="handle_type" :position="posLR" :style="handle_style" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex, NLayout } from 'naive-ui';
const props = defineProps(['id', 'data']);

const showOutputHandle = !!(props.data.attaching.type === 'input');
const showCallbackUserHandle = !!(props.data.attaching.type === 'callbackFunc');
const showCallbackFuncHandle = !!(props.data.attaching.type === 'callbackUser');
const showInputHandle = !!(props.data.attaching.type === 'output');

const [yPart, xPart] = props.data.attaching.pos.split('-');
const posLR = xPart === 'left' ? Position.Right : Position.Left;
const handle_style = xPart === 'left' ? { right: '2px' } : { left: '2px' };
const justCont = xPart === 'left' ? 'flex-start' : 'flex-end';
const node_text = showOutputHandle ? 'INPUT' : showCallbackUserHandle ? 'CB-FUN' : showCallbackFuncHandle ? 'USE-CB' : showInputHandle ? 'OUTPUT' : "";
const handle_type = (showOutputHandle || showCallbackUserHandle) ? 'source' : (showCallbackFuncHandle || showInputHandle) ? 'target' : "";
const handle_id = showOutputHandle ? 'output' : showCallbackUserHandle ? 'callbackUser' : showCallbackFuncHandle ? 'callbackFunc' : showInputHandle ? 'input' : "";
</script>

<style>
.vue-flow__node-attached_node {
    pointer-events: none;
    border: 1px solid rgb(52, 52, 56);
    padding: 3px;
    border-radius: 6px;

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