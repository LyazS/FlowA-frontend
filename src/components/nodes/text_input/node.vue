<template>
    <div :style="{ width: '100%', height: '100%' }">
        <Handle id="input" type="target" :position="Position.Left" :style="{ left: '3px' }" />
        <Handle id="output" type="source" :position="Position.Right" :style="{ right: '3px' }" />
        <Handle id="callback-user" type="target" :position="Position.Top" :style="{ top: '3px' }" />
        <Handle id="callback-provider" type="source" :position="Position.Bottom" :style="{ bottom: '3px' }" />
        <n-flex vertical class="center-flex" justify="center" align="center">
            <div class="center-flex-div">文本输入</div>
        </n-flex>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import { NTag, NText, NH3, NFlex } from 'naive-ui';
const props = defineProps(['id', 'label', 'data'])

</script>

<style scoped>
.center-flex {
    width: 100%;
    height: 100%;
}

.center-flex-div {
    color: white;
    height: 20px;
    display: flex;
    align-items: center;
}
</style>