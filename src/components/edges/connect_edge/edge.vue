<script setup>
defineProps({
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
})

// 计算贝塞尔曲线的控制点
const getControlPoints = (sourceX, sourceY, targetX, targetY) => {
  const deltaX = Math.abs(targetX - sourceX);
  const deltaY = Math.abs(targetY - sourceY);
  
  // 控制点的偏移量，可以调整这个值来改变曲线的弧度
  const offsetX = deltaX * 0.5;
  
  return {
    controlPoint1X: sourceX + offsetX,
    controlPoint1Y: sourceY,
    controlPoint2X: targetX - offsetX,
    controlPoint2Y: targetY
  }
}
</script>

<template>
  <g>
    <path
      class="animated"
      fill="none"
      stroke="rgb(138, 203, 236)"
      :stroke-width="2"
      :d="`M${sourceX},${sourceY} C ${getControlPoints(sourceX, sourceY, targetX, targetY).controlPoint1X},${
        getControlPoints(sourceX, sourceY, targetX, targetY).controlPoint1Y
      } ${getControlPoints(sourceX, sourceY, targetX, targetY).controlPoint2X},${
        getControlPoints(sourceX, sourceY, targetX, targetY).controlPoint2Y
      } ${targetX},${targetY}`"
    />
    <circle 
      :cx="targetX" 
      :cy="targetY" 
      fill="#000" 
      :r="4" 
      stroke="rgb(138, 203, 236)" 
      :stroke-width="1.5"
    />
  </g>
</template>

<style scoped>

</style>