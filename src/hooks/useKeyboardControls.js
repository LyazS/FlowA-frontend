// hooks/useKeyboardControls.js
import { ref, provide, watch } from 'vue';
import { useVueFlow } from '@vue-flow/core';
const {
  getNodes,
  getEdges,
  getSelectedNodes,
  addNodes,
  findNode,
  removeNodes,
  onConnect,
  addEdges,
  removeEdges,
  onNodesChange,
  onEdgesChange,
  onNodeDragStart,
  onNodeDrag,
  onNodeDragStop,
  onNodeClick,
  onNodeDoubleClick,
  onNodeContextMenu,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodeMouseMove,
  onPaneContextMenu,
  onEdgeContextMenu,
  screenToFlowCoordinate,
  getViewport,
  setViewport,
} = useVueFlow();


// 单例模式
let instance = null;
export const useKeyboardControls = () => {
  if (instance) return instance;

  const isEditing = ref(false);

  watch(isEditing, (new_val) => {
    console.log("isEditing", new_val);
  })
  const isSpacePressed = ref(false);
  const lastMousePosition = ref({ x: 0, y: 0 });
  const currentMousePosition = ref({ x: 0, y: 0 });
  // 始终跟踪鼠标位置
  const trackMousePosition = (event) => {
    currentMousePosition.value = { x: event.clientX, y: event.clientY };
  }
  // 监听空格键按下和释放
  const handleKeyDown = (event) => {
    if (isEditing.value) return;
    if (event.code === 'Space') {
      // 阻止默认行为，防止触发 VueFlow 的内置平移模式
      event.preventDefault();
      isSpacePressed.value = true;
      document.body.style.cursor = 'grabbing';
      // 使用当前跟踪的鼠标位置作为起始点
      lastMousePosition.value = { ...currentMousePosition.value };
    }
  }

  const handleKeyUp = (event) => {
    if (isEditing.value) return;
    if (event.code === 'Space') {
      isSpacePressed.value = false;
      document.body.style.cursor = 'default';
    }
  }

  // 只需要监听鼠标移动事件
  const handleMouseMove = (event) => {
    trackMousePosition(event);
    if (isEditing.value) return;
    if (isSpacePressed.value) {
      const deltaX = event.clientX - lastMousePosition.value.x;
      const deltaY = event.clientY - lastMousePosition.value.y;

      const cur_viewport = getViewport();
      setViewport({
        x: cur_viewport.x + deltaX,
        y: cur_viewport.y + deltaY,
        zoom: cur_viewport.zoom
      });
      lastMousePosition.value = { x: event.clientX, y: event.clientY };
    }
  }

  const addEventListeners = () => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
  }
  const removeEventListeners = () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('mousemove', handleMouseMove);
  }

  instance = {
    isEditing,
    addEventListeners,
    removeEventListeners,
  };
  return instance;
};
