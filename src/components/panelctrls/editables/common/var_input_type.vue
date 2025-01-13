<template>
    <!-- 值输入 -->
    <cp_var_select v-if="itemType === 'ref'" :size="size" :options="selfVarSelections" :value="itemValue"
        @update:value="updateValue" />
    <n-switch v-else-if="itemType === 'Boolean'" :size="nswitchSize" :disabled="!isEditorMode" :value="itemValue"
        @update:value="updateValue" />
    <n-input v-else-if="itemType === 'String'" :size="size" :value="itemValue" :disabled="!isEditorMode"
        @blur="isEditing = false" @focus="isEditing = true" @update:value="updateValue" />
    <n-input-number v-else-if="itemType === 'Integer'" :size="size" :value="itemValue" :disabled="!isEditorMode"
        @blur="isEditing = false" @focus="isEditing = true" @update:value="updateValue" :show-button="false"
        :precision="0" />
    <n-input-number v-else-if="itemType === 'Number'" :size="size" :value="itemValue" :disabled="!isEditorMode"
        @blur="isEditing = false" @focus="isEditing = true" @update:value="updateValue" :show-button="false" />
</template>

<script setup>
import { ref, computed, h, inject, defineAsyncComponent } from 'vue'
import { NSwitch, NInput, NInputNumber } from 'naive-ui'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'

const cp_var_select = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_select.vue'));

const props = defineProps({
    itemType: {
        type: String,
        required: true,
    },
    itemValue: {
        type: [String, Boolean, Number],
        required: true,
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
    size: {
        type: String,
        default: 'small'
    }
});

const emit = defineEmits(['update:itemValue']);

const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();

// 更新 value
const updateValue = (newValue) => {
    emit('update:itemValue', newValue);
};

const nswitchSize = computed(() => {
    if (props.size === 'large') return 'large'
    else if (props.size === 'medium') return 'large'
    else if (props.size === 'small') return 'medium'
    else if (props.size === 'tiny') return 'small'
    else return 'medium'
});
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>