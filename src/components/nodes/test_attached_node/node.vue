<template>
    <div :style="{ width: '100%', height: '100%' }">
        <Handle class="test_attached_node-handle-com test_attached_node-handle" id="input" type="target" :position="Position.Left" />
        <Handle class="test_attached_node-handle-com test_attached_node-handle" id="output" type="source" :position="Position.Right" />
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
.vue-flow__node-test_attached_node:hover {
    box-shadow: 0 0 0px;
}
</style>

<style scoped>
.test_attached_node-handle-com:hover {
    background-color: rgb(255, 255, 255);
}

.test_attached_node-handle {
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