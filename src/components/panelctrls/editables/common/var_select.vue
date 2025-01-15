<template>
    <n-select :style="style" :value="value" @update:value="updateValue" :options="options" :render-label="renderLabel"
        :disabled="!isEditorMode" :size="size" :placeholder="placeholder" :consistent-menu-width="false" placement="bottom-end"/>
</template>

<script setup>
import { h } from 'vue'
import { NSelect, NText } from 'naive-ui'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import { isString } from '@/utils/tools'

const { isEditorMode } = useFlowAOperation();

const props = defineProps({
    value: {
        // type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true
    },
    size: {
        type: String,
        default: 'small'
    },
    style: {
        type: Object,
        default: () => ({})
    },
    placeholder: {
        type: String,
        default: '请选择'
    }
});

const emit = defineEmits(['update:value']);

// 更新值的方法
const updateValue = (value) => {
    emit('update:value', value);
};

const renderLabel = (option) => {
    try {
        if (!isString(option.label)) {
            throw new TypeError("label must be a string")
        }
        const isError = !props.options.some(select => select.value === option.value);
        if (isError) {
            throw new Error("value not in options")
        }
        const [nlabel, dlabel, dkey, dtype] = option.label.split("/");
        return [
            h(NText, { type: "default", strong: true }, { default: () => `${nlabel}` }),
            h(NText, { type: "default" }, { default: () => "/ " }),
            h(NText, { type: "info", }, { default: () => dlabel }),
            h(NText, { type: "info", }, { default: () => ` ${dtype}` }),
        ]
    }
    catch (e) {
        // console.warn(e);
        return h(NText, { type: "error", strong: true }, { default: () => `❓${option.label}` });
    }
};

</script>