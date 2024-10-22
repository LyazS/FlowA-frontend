<template>
    <div :style="{ width: '100%', height: '100%' }">
        <Handle id="input" type="target" :position="Position.Left" :style="{ top: '6px', left: '4px' }" />
        <Handle id="callback-func" type="target" :position="Position.Left" :style="{ top: '40px', left: '4px' }" />
        <Handle id="callback-user" type="source" :position="Position.Right" :style="{ top: '6px', right: '4px' }" />
        <Handle id="output" type="source" :position="Position.Right" :style="{ top: '40px', right: '4px' }" />
        <div class="center-flex">
            <div class="handle-container">
                <div class="handle-label handle-label-left">INPUT</div>
                <div class="handle-label handle-label-right">USE-CALLBACK</div>
            </div>
            <div class="center-flex-div">文本输入</div>
            <div class="handle-container">
                <div class="handle-label handle-label-left">CALLBACK-FUNC</div>
                <div class="handle-label handle-label-right">OUTPUT</div>
            </div>
        </div>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.center-flex-div {
    color: white;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
}

.handle-container {
    width: 100%;
    /* height: 100%; */
    display: flex;
    flex-direction: row;
    align-items: space-between;
    justify-content: space-between;
}

.handle-label {
    font-size: 5px;
    color: white;
    /* 添加等宽字体 */
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    /* 可选：添加字母间距使文本更清晰 */
    letter-spacing: 0.1px;
    /* 可选：使文字更清晰 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.handle-label-left {
    transform: translateX(7px);
}

.handle-label-right {
    transform: translateX(-7px);
}
</style>