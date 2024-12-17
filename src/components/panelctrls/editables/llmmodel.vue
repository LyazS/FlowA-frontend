<template>
    <n-flex vertical>
        <editable_header type="success">
            模型设置
        </editable_header>
        <n-collapse>
            <n-collapse-item :title="thisConfig_model">
                <n-flex vertical>
                    <n-flex class="flexctitem" :wrap="false">
                        <n-tag :bordered="false" type="info">模型选择</n-tag>
                        <n-select v-model:value="thisConfig_model" :options="modelSelections" size="tiny" />
                    </n-flex>
                    <n-flex class="flexctitem" :wrap="false">
                        <n-tag :bordered="false" type="info">流式传输</n-tag>
                        <n-switch v-model:value="thisConfig_stream" />
                    </n-flex>
                    <n-flex v-for="config in configs" class="flexctitem" :wrap="false">
                        <n-tag :bordered="false" type="info">{{ config.label }}</n-tag>
                        <n-select v-model:value="config.cpType" :options="llmTypeSelections" size="tiny" />
                        <!-- <template v-if="config.cpType === 'value'">
                            <n-slider v-model:value="config.cpValue" :min="config.min" :max="config.max"
                                :step="config.step" />
                            <n-input-number v-model:value="config.cpValue" size="tiny" :min="config.min"
                                :max="config.max" :step="config.step" />
                        </template>
                        <template v-else-if="config.cpType === 'ref'">
                            <n-select v-model:value="config.cpValue" :options="selfVarSelections" size="tiny" />
                        </template> -->
                    </n-flex>
                </n-flex>
            </n-collapse-item>
        </n-collapse>
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
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import { llmTypeSelections } from '@/utils/schemas'
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
    // { label: "text", value: "text" },
    { label: "json", value: "json" },
]

const thisConfig_model = computed({
    get() {
        return thisnode.value.data.payloads.byId[props.pid].data.model || "";
    },
    set(value) {
        thisnode.value.data.payloads.byId[props.pid].data.model = value;
    }
});
const thisConfig_stream = computed({
    get() {
        return thisnode.value.data.payloads.byId[props.pid].data.stream || false;
    },
    set(value) {
        thisnode.value.data.payloads.byId[props.pid].data.stream = value;
    }
});

const thisConfig_response_format = createComputedConfig("response_format", "json");
const thisConfig_stop = createComputedConfig("stop", null);

const configs = [
    { label: '最长回复', cpType: createComputedType("max_tokens"), cpValue: createComputedConfig("max_tokens", 4096), min: 256, max: 8192, step: 1 },
    { label: '温度', cpType: createComputedType("temperature"), cpValue: createComputedConfig("temperature", 0.8), min: 0, max: 1, step: 0.1 },
    { label: 'Top P', cpType: createComputedType("top_p"), cpValue: createComputedConfig("top_p", 0.9), min: 0, max: 1, step: 0.1 },
    { label: 'Top K', cpType: createComputedType("top_k"), cpValue: createComputedConfig("top_k", 50), min: 0, max: 100, step: 1 },
    { label: '频率惩罚', cpType: createComputedType("frequency_penalty"), cpValue: createComputedConfig("frequency_penalty", 0.5), min: 0, max: 1, step: 0.1 },
];
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
</style>