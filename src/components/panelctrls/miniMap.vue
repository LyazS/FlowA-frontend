<script setup>
import { MiniMap } from '@vue-flow/minimap'

</script>

<template>
    <MiniMap class="vue-flow__minimap" position="bottom-left" pannable mask-color="rgb(52, 52, 56)" />
</template>
<style>
.vue-flow__minimap {
    transform: scale(72%) translate(-48px, -25px);
    background-color: rgb(32, 32, 32);
}
</style>