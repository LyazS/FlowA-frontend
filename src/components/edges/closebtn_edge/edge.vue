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

const { removeEdges } = useVueFlow()

const path = computed(() => getBezierPath(props))
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <BaseEdge 
    :id="id" 
    :style="{
      ...style,
      stroke: 'rgb(138, 203, 236)',
      strokeWidth: 2,
    }" 
    :path="path[0]" 
    :marker-end="markerEnd" 
  />

  <EdgeLabelRenderer>
    <button
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      class="edgebutton nodrag nopan"
      @click="removeEdges(id)"
    >×</button>
  </EdgeLabelRenderer>
</template>

<style scoped>
.edgebutton {
    width: 16px;
    height: 16px;
    background: transparent;
    color: rgb(138, 203, 236);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    padding: 0;
    line-height: 1;
    position: relative;
}

.edgebutton::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: rgb(138, 203, 236);
    border-radius: 50%;
    box-shadow: 0 0 10px rgb(138, 203, 236), 0 0 20px rgba(0,255,255,0.8);
}

.edgebutton:hover {
    background: #000;
    border: 1px solid rgb(138, 203, 236);
    box-shadow: 0 0 15px rgb(138, 203, 236), 
                0 0 30px rgba(0,255,255,0.8),
                0 0 45px rgba(0,255,255,0.6);
}

.edgebutton:hover::before {
    opacity: 0;
}

</style>