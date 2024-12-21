<template>
    <n-flex vertical>
        <editable_header type="success">
            <n-collapse arrow-placement="right">
                <n-collapse-item title="模型设置">
                    <n-flex vertical>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">模型选择</n-tag>
                            <n-select v-model:value="modelConfig.cpType.value" :options="typeSelections" size="tiny"
                                :style="{ width: '8em' }" :consistent-menu-width="false" />
                            <template v-if="modelConfig.cpType.value === 'value'">
                                <n-select v-model:value="modelConfig.cpValue.value" :options="modelConfig.options"
                                    size="tiny" />
                            </template>
                            <template v-else>
                                <n-select v-model:value="modelConfig.cpValue.value" :options="selfVarSelections"
                                    size="tiny" :render-label="renderLabel" />
                            </template>
                        </n-flex>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">流式传输</n-tag>
                            <n-switch v-model:value="streamConfig" />
                        </n-flex>
                        <n-flex v-for="config in configs" class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">{{ config.label }}</n-tag>
                            <n-select v-model:value="config.cpType.value" :options="typeSelectionsWNull" size="tiny"
                                :style="{ width: '8em' }" :consistent-menu-width="false" />
                            <template v-if="config.cpType.value === 'value'">
                                <n-slider v-model:value="config.cpValue.value" :min="config.min" :max="config.max"
                                    :step="config.step" />
                                <n-input-number v-model:value="config.cpValue.value" size="tiny" :min="config.min"
                                    :max="config.max" :step="config.step" />
                            </template>
                            <template v-else-if="config.cpType.value === 'ref'">
                                <n-select v-model:value="config.cpValue.value" :options="selfVarSelections" size="tiny"
                                    :render-label="renderLabel" />
                            </template>
                        </n-flex>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">{{ responseFormatConfig.label }}</n-tag>
                            <n-select v-model:value="responseFormatConfig.cpType.value" :options="typeSelectionsWNull"
                                size="tiny" :style="{ width: '8em' }" :consistent-menu-width="false" />
                            <template v-if="responseFormatConfig.cpType.value === 'value'">
                                <n-select v-model:value="responseFormatConfig.cpValue.value"
                                    :options="responseFormatConfig.options" size="tiny" />
                            </template>
                            <template v-else-if="responseFormatConfig.cpType.value === 'ref'">
                                <n-select v-model:value="responseFormatConfig.cpValue.value"
                                    :options="selfVarSelections" size="tiny" :render-label="renderLabel" />
                            </template>
                        </n-flex>
                    </n-flex>
                </n-collapse-item>
            </n-collapse>
        </editable_header>
    </n-flex>

</template>

<script setup>
import { ref, computed, h, inject } from 'vue'
import {
    useMessage,
    NSwitch,
    NFlex,
    NText,
    NIcon,
    NButton,
    NCollapse,
    NCollapseItem,
    NCard,
    NForm,
    NFormItem,
    NGrid,
    NGridItem,
    NInput,
    NSelect,
    NSlider,
    NSpace,
    NTag,
    NInputNumber,
} from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import { mapVarItemToSelect, renderLabel4Select } from '@/utils/tools'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import { typeSelectionsWNull, typeSelections } from '@/utils/schemas'
const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
})
const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();
// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))
const createComputedConfig = (prop, defaultValue = null) => {
    thisnode.value.data.payloads.byId[props.pid].data[prop].value = defaultValue;
    return computed({
        get() {
            return thisnode.value.data.payloads.byId[props.pid].data[prop].value;
        },
        set(value) {
            thisnode.value.data.payloads.byId[props.pid].data[prop].value = value;
        }
    });
};

const createComputedType = (prop) => {
    return computed({
        get() {
            return thisnode.value.data.payloads.byId[props.pid].data[prop].type;
        },
        set(value) {
            thisnode.value.data.payloads.byId[props.pid].data[prop].type = value;
        }
    });
};

const modelSelections = [
    { label: "DeepSeekV2.5", value: "DeepSeekV2.5" },
    { label: "GPT4o", value: "GPT4o" },
]
const response_format_selections = [
    { label: "text", value: "text" },
    { label: "json", value: "json" },
]

const streamConfig = computed({
    get() {
        return thisnode.value.data.payloads.byId[props.pid].data.stream;
    },
    set(value) {
        thisnode.value.data.payloads.byId[props.pid].data.stream = value;
    }
});

// const thisConfig_stop = createComputedConfig("stop", null);

const modelConfig = { label: '模型选择', cpType: createComputedType("model"), cpValue: createComputedConfig("model", "DeepSeekV2.5"), options: modelSelections };
const configs = [
    { label: '最长回复', cpType: createComputedType("max_tokens"), cpValue: createComputedConfig("max_tokens", 4096), min: 256, max: 8192, step: 1 },
    { label: '温度', cpType: createComputedType("temperature"), cpValue: createComputedConfig("temperature", 0.8), min: 0, max: 1, step: 0.1 },
    { label: 'Top P', cpType: createComputedType("top_p"), cpValue: createComputedConfig("top_p", 0.9), min: 0, max: 1, step: 0.1 },
    { label: 'Top K', cpType: createComputedType("top_k"), cpValue: createComputedConfig("top_k", 50), min: 0, max: 100, step: 1 },
    { label: '频率惩罚', cpType: createComputedType("frequency_penalty"), cpValue: createComputedConfig("frequency_penalty", 0.5), min: 0, max: 1, step: 0.1 },
];
const responseFormatConfig = { label: '响应格式', cpType: createComputedType("response_format"), cpValue: createComputedConfig("response_format", "json"), options: response_format_selections };

const renderLabel = (option) => {
    const [nlabel, dlabel, dkey, dtype] = option.label.split("/");
    const isError = !props.selfVarSelections.some(select => select.value === option.value);
    return renderLabel4Select(nlabel, dlabel, dtype, isError);
};
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
</style>