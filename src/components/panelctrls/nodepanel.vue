<script setup>
import { computed, ref, watch, nextTick, inject, onUnmounted } from 'vue';
import { NCard, NScrollbar, NInput, NText } from 'naive-ui';
import { Panel, useVueFlow } from '@vue-flow/core'
import { find } from 'lodash';
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    }
})
const {
    findNode,
} = useVueFlow();
const isEditing = inject("isEditing");

const thisnode = computed(() => { return findNode(props.nodeId); });
const nodedatatext = computed(() => {
    if (!thisnode.value?.data) return '';
    return JSON.stringify(thisnode.value.data, null, 2);
});

// 标题相关 ======================================
const isEditingTitle = ref(false);
const titleInputRef = ref(null);
const startEditTilte = () => {
    isEditingTitle.value = true;
    isEditing.value = true;
    nextTick(() => { titleInputRef.value?.focus(); });
}
const saveTitle = () => {
    isEditing.value = false;
    isEditingTitle.value = false;
    const newLabel = thisnode.value.data.label.trim();
    thisnode.value.data.label = newLabel || thisnode.value.data.placeholderlabel;
}
onUnmounted(() => {
    isEditing.value = false;
})
</script>
<template>
    <div class="nodepanel">
        <n-scrollbar style="max-height: calc(100vh - 80px);">
            <n-card>
                <template #header>
                    <!-- 普通文本模式 -->
                    <n-text v-if="!isEditingTitle" class="card-title" @click="startEditTilte">
                        {{ thisnode.data.label }}
                    </n-text>
                    <!-- 编辑模式 -->
                    <n-input v-else v-model:value="thisnode.data.label" :placeholder="thisnode.data.placeholderlabel"
                        ref="titleInputRef" :bordered="false" @blur="saveTitle" class="title-input" />
                </template>
                <pre>{{ nodedatatext }}</pre>
            </n-card>
        </n-scrollbar>
    </div>
</template>

<style scoped>
.nodepanel {
    margin-top: 20px;
    max-width: 500px;
}

.nodepanel:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}

.card-title {
    cursor: pointer;
    padding: 0;
    font-weight: 500;
}

.title-input {
    font-weight: 500;
}
</style>