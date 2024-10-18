<template>
    <div :style="{ width: '100%', height: '100%' }">
        <Handle class="test_child_node-handle-com test_child_node-handle" id="input" type="target" :position="Position.Left" />
        <Handle class="test_child_node-handle-com test_child_node-handle" id="output" type="source" :position="Position.Right" />
        <n-flex vertical align="center" justify="center">
            <n-flex class="left-flex">
                <div :style="{ color: 'white', height: '5px' }">子</div>
            </n-flex>
        </n-flex>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex } from 'naive-ui';
const props = defineProps(['id', 'label', 'data'])

</script>

<style>
.vue-flow__node-test_child_node {
    border: 2px solid rgb(52, 52, 56);
    background-color: rgb(52, 52, 56);
    border-radius: 10px;
    padding: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.vue-flow__node-test_child_node.node-name {
    align-content: left;
    align-items: left;
}

.vue-flow__node-test_child_node.selected {
    border: 2px solid rgb(138, 203, 236);
}

.vue-flow__node-test_child_node:hover {
    box-shadow: 0 0 10px rgb(138, 203, 236);
}
</style>

<style scoped>
.test_child_node-handle-com:hover {
    background-color: rgb(255, 255, 255);
}

.test_child_node-handle {
    height: 5px;
    width: 5px;
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