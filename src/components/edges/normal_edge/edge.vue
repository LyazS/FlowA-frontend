<script setup>
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
})

const path = computed(() => getBezierPath(props))
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <BaseEdge :id="id" :style="{
    ...style,
    stroke: 'rgb(138, 203, 236)',
    strokeWidth: 2,
  }" :path="path[0]" :marker-end="markerEnd" />

</template>

<style scoped></style>