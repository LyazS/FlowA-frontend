<template>
    <div :style="{ width: '100%', height: '100%', position: 'relative' }">
        <n-layout class="layout-container">
            <div class="corner-text"
                :style="{ top: `${handle_h_gap}px`, left: `${corner_gap_left}px`, transform: 'translateY(-50%)' }">
                INPUT
            </div>

            <template v-for="handle in handles">
                <div class="corner-text" :style="handle.text_style">
                    {{ handle.condition }}
                </div>
            </template>

            <div class="center-text">
                {{ data.label }}
            </div>
        </n-layout>
        <Handle id="input" type="target" :position="Position.Left"
            :style="{ top: `${handle_h_gap}px`, left: `${handle_h_gap}px` }" />
        <template v-for="handle in handles">
            <Handle :id="handle.id" class="vue-flow__handle-output" type="source" :position="Position.Right" :style="handle.cond_style" />
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex, NLayout } from 'naive-ui';
import { useVueFlow } from '@vue-flow/core';
const { getNodes, findNode } = useVueFlow();
const props = defineProps(['id', 'data'])

const corner_gap_left = 10;
const handle_h_gap = 6;
const handle_bottom_pos = computed(() => { return props.data.size.height - (handle_h_gap + 8); });
const handle_gap = 10;
const corner_text_gap_left = 15;

const handles = computed(() => {
    return props.data.connections.output.map((condition, index) => {
        return {
            id: condition.id,
            condition: condition.condition,
            text_style: { bottom: `${2 + handle_gap * index}px`, right: `${corner_text_gap_left}px` },
            cond_style: { top: `${handle_bottom_pos.value - handle_gap * index}px`, right: `${corner_gap_left}px` }
        }
    });
})

watch(() => props.data.output, () => {
    const node = findNode(props.id);
    const node_ht = 40 + props.data.connections.output.length * handle_gap;
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
    top: 20px;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>