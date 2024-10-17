<template>
    <div ref="outerDiv" :style="{ width: '100%', height: '100%' }">
        <Handle class="testnode-handle-com testnode-handle" id="input" type="target" :position="Position.Left" />
        <Handle class="testnode-handle-com testnode-handle" id="output" type="source" :position="Position.Right" />
        <n-flex vertical align="center" justify="center">
            <n-flex class="left-flex">
                <div :style="{ color: 'white', height: '15px' }">迭代</div>
            </n-flex>
            <div ref="lastDiv" class="dynamic-height-div"></div>
        </n-flex>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex } from 'naive-ui';
const props = defineProps(['id', 'label', 'data'])

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

<style>
.vue-flow__node-testnode {
    border: 2px solid rgb(52, 52, 56);
    background-color: rgb(52, 52, 56);
    border-radius: 10px;
    padding: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.vue-flow__node-testnode.node-name {
    align-content: left;
    align-items: left;
}

.vue-flow__node-testnode.selected {
    border: 2px solid rgb(138, 203, 236);
}

.vue-flow__node-testnode:hover {
    box-shadow: 0 0 10px rgb(138, 203, 236);
}
</style>

<style scoped>
.testnode-handle-com:hover{
    background-color: rgb(255, 255, 255);
}
.testnode-handle {
    height: 32px;
    width: 12px;
    border-radius: 4px
}

.testnode-handle-callback {
    height: 12px;
    width: 32px;
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