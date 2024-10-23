<template>
    <div class="node-container">
        <Icon class="icon-wrapper">
            <EnterOutline />
        </Icon>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { Icon } from '@vicons/utils'
import {
    EnterOutline,
    ExitOutline,
} from "@vicons/ionicons5";

</script>

<style scoped>
.node-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.icon-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
}
</style>