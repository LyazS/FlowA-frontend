<template>
    <div :style="{ width: '100%', height: '100%', position: 'relative' }">
        <template v-for="(handle, index) in inputHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-input" type="target" :position="Position.Left" :style="{
                top: `${handle_h_pad + index * handle_h_gap}px`, left: `${handle_h_pad}px`, transform: 'translateY(0)'
            }" />
            <div class="corner-text" :style="{
                top: `${handle_h_pad + index * handle_h_gap}px`, left: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>
        <template v-for="(handle, index) in outputHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-output" type="source" :position="Position.Right" :style="{
                top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap}px`, right: `${handle_h_pad}px`, transform: 'translateY(0)'
            }" />
            <div class="corner-text" :style="{
                top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap - 1}px`, right: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>
        <template v-for="(handle, index) in cbuserHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-callbackUser" type="source" :position="Position.Right"
                :style="{
                    top: `${handle_h_pad + index * handle_h_gap}px`, right: `${handle_h_pad}px`, transform: 'translateY(0)'
                }" />
            <div class="corner-text" :style="{
                top: `${handle_h_pad + index * handle_h_gap}px`, right: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>
        <template v-for="(handle, index) in cbfuncHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-callbackFunc" type="target" :position="Position.Left" :style="{
                top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap}px`, left: `${handle_h_pad}px`, transform: 'translateY(0)'
            }" />
            <div class="corner-text" :style="{
                top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap - 1}px`, left: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>

        <div class="center-text" :style="{ top: `${handle_h_pad + max_handles_top * handle_h_gap + 10}px` }">
            {{ data.label }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle, useVueFlow } from '@vue-flow/core'
const { getNodes, findNode } = useVueFlow();
const props = defineProps(['id', 'data'])

const handle_h_pad = 1;
const handle_h_gap = 7;
const handle_text_edge_pad = 6;


const inputHandles = computed(() => {
    return Object.entries(props.data.connections.inputs)
        .map(([key, value]) => ({ key, label: value.label }))
        .sort((a, b) => a.key.localeCompare(b.key));
});

const outputHandles = computed(() => {
    return Object.entries(props.data.connections.outputs)
        .map(([key, value]) => ({ key, label: value.label }))
        .sort((a, b) => a.key.localeCompare(b.key));
});

const cbfuncHandles = computed(() => {
    return Object.entries(props.data.connections.callbackFuncs)
        .map(([key, value]) => ({ key, label: value.label }))
        .sort((a, b) => a.key.localeCompare(b.key));
});

const cbuserHandles = computed(() => {
    return Object.entries(props.data.connections.callbackUsers)
        .map(([key, value]) => ({ key, label: value.label }))
        .sort((a, b) => a.key.localeCompare(b.key));
});

const max_handles_top = computed(() => {
    return Math.max(inputHandles.value.length, cbuserHandles.value.length);
});
const max_handles_bottom = computed(() => {
    return Math.max(outputHandles.value.length, cbfuncHandles.value.length);
});

watch(() => [max_handles_top.value, max_handles_bottom.value], (newValues) => {
    const [newtop, newbottom] = newValues;
    const node = findNode(props.id);
    const node_ht = 30 + (newtop + newbottom) * handle_h_gap;
    node.style.height = `${node_ht}px`;
    node.data.size.height = node_ht;
}, { immediate: true })
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: transparent;
}

.corner-text {
    text-transform: uppercase;
    font-size: 4px;
    color: white;
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    display: flex;
    align-items: flex-end;
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
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>