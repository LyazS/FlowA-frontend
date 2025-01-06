<template>
    <n-flex class="flexctitem" justify="space-between" :style="{ width: '100%' }" :wrap="false">
        <n-flex class="flexctitem" :style="{ width: '95%' }" :wrap="false">
            <!-- 变量名 -->
            <n-input :style="{ width: '30%' }" size="small" placeholder="变量名" :value="itemKey" :disabled="!isEditorMode"
                @blur="isEditing = false" @focus="isEditing = true" @update:value="updateKey" />
            <!-- 类型选择 -->
            <n-select :style="{ width: '20%' }" size="small" :options="typeSelectionsEx" :disabled="!isEditorMode"
                :value="itemType" @update:value="updateType" :consistent-menu-width="false" />
            <!-- 值输入 -->
            <cp_var_input_type :style="{ width: '50%' }" size="small" :itemType="itemType" :itemValue="itemValue"
                :selfVarSelections="selfVarSelections" @update:itemValue="updateValue" />
        </n-flex>
        <!-- 删除按钮 -->
        <n-button circle tertiary size="small" type="error" @click="rmItem" :disabled="!isEditorMode">
            <template #icon>
                <n-icon>
                    <Close />
                </n-icon>
            </template>
        </n-button>
    </n-flex>
</template>

<script setup>
import { ref, computed, h, inject, defineAsyncComponent } from 'vue'
import { useMessage, NSwitch, NFlex, NText, NIcon, NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NInputNumber, NSelect, NSpace, NTag } from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { typeSelectionsEx } from '@/utils/schemas'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'

const cp_var_select = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_select.vue'));
const cp_var_input_type = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_input_type.vue'));

const props = defineProps({
    itemKey: {
        type: String,
        required: true,
    },
    itemType: {
        type: String,
        required: true,
    },
    itemValue: {
        type: [String, Boolean, Number],
        required: true,
    },
    itemIdx: {
        type: Number,
        required: true,
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
});

const emit = defineEmits(['update:itemKey', 'update:itemType', 'update:itemValue', 'remove']);

const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();

// 更新 key
const updateKey = (newKey) => {
    emit('update:itemKey', newKey);
};

// 更新 type
const updateType = (newType) => {
    emit('update:itemType', newType);
};

// 更新 value
const updateValue = (newValue) => {
    emit('update:itemValue', newValue);
};

// 删除项
const rmItem = () => {
    emit('remove');
};
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>