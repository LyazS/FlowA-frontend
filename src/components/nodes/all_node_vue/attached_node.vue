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
import { Position, Handle, useVueFlow } from '@vue-flow/core'
const { findNode } = useVueFlow();
const props = defineProps(['id', 'data']);
const thisnode = findNode(props.id);
const [yPart, xPart] = props.data.attaching.pos.split('-');

const posLR = xPart === 'left' ? Position.Right : Position.Left;
const node_text = props.data.attaching.label;
const handle_style = xPart === 'left' ? { right: '2px' } : { left: '2px' };
const justCont = xPart === 'left' ? 'flex-start' : 'flex-end';

let handle_type = null;
let handle_id = null;
if (props.data.attaching.type === 'output') {
    handle_type = 'target';
    handle_id = 'input';
}
else if (props.data.attaching.type === 'input') {
    handle_type = 'source';
    handle_id = 'output';
}
else if (props.data.attaching.type === 'callbackFunc') {
    handle_type = 'source';
    handle_id = 'callbackUser';
}
else if (props.data.attaching.type === 'callbackUser') {
    handle_type = 'target';
    handle_id = 'callbackFunc';
}
onMounted(() => {
    thisnode.class = "vue-flow__node-attached_node";
});

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
    border: 1px solid rgb(52, 52, 56);
    box-shadow: 0 0 0px rgb(52, 52, 56);
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
    font-family: var(--font-mono);
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    height: auto;
    text-align: center;
}
</style>