<template>
    <n-flex vertical>
        <editable_header type="success">
            模型设置
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
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">最长回复</n-tag>
                            <n-switch v-model:value="thisConfig_max_tokens_switch" />
                            <n-slider v-if="thisConfig_max_tokens_switch" v-model:value="thisConfig_max_tokens"
                                :min="256" :max="8192" />
                            <n-input-number v-if="thisConfig_max_tokens_switch" v-model:value="thisConfig_max_tokens"
                                size="tiny" />
                        </n-flex>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">温度设置</n-tag>
                            <n-switch v-model:value="thisConfig_temperature_switch" />
                            <n-slider v-if="thisConfig_temperature_switch" v-model:value="thisConfig_temperature"
                                :min="0.0" :max="1.0" :step="0.01" />
                            <n-input-number v-if="thisConfig_temperature_switch" v-model:value="thisConfig_temperature"
                                size="tiny" :step="0.01" />
                        </n-flex>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">Top_p</n-tag>
                            <n-switch v-model:value="thisConfig_top_p_switch" />
                            <n-slider v-if="thisConfig_top_p_switch" v-model:value="thisConfig_top_p" :min="0.0"
                                :max="1.0" :step="0.01" />
                            <n-input-number v-if="thisConfig_top_p_switch" v-model:value="thisConfig_top_p" size="tiny"
                                :step="0.01" />
                        </n-flex>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">Top_k</n-tag>
                            <n-switch v-model:value="thisConfig_top_k_switch" />
                            <n-slider v-if="thisConfig_top_k_switch" v-model:value="thisConfig_top_k" :min="0"
                                :max="100" :step="1" />
                            <n-input-number v-if="thisConfig_top_k_switch" v-model:value="thisConfig_top_k" size="tiny"
                                :step="1" />
                        </n-flex>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">frequency_penalty</n-tag>
                            <n-switch v-model:value="thisConfig_frequency_penalty_switch" />
                            <n-slider v-if="thisConfig_frequency_penalty_switch"
                                v-model:value="thisConfig_frequency_penalty" :min="0.0" :max="1.0" :step="0.01" />
                            <n-input-number v-if="thisConfig_frequency_penalty_switch"
                                v-model:value="thisConfig_frequency_penalty" size="tiny" :step="0.01" />
                        </n-flex>
                        <n-flex class="flexctitem" :wrap="false">
                            <n-tag :bordered="false" type="info">response_format</n-tag>
                            <n-switch v-model:value="thisConfig_response_format_switch" />
                            <n-select v-if="thisConfig_response_format_switch"
                                v-model:value="thisConfig_response_format" :options="response_format_selections"
                                size="tiny" />
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
import { useFlowAOperation } from '@/services/useFlowAOperation.js'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    }
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

const createComputedSwitch = (prop) => {
    return computed({
        get() {
            return thisnode.value.data.payloads.byId[props.pid].data[prop].enable;
        },
        set(value) {
            thisnode.value.data.payloads.byId[props.pid].data[prop].enable = value;
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
const thisConfig_max_tokens_switch = createComputedSwitch("max_tokens");
const thisConfig_max_tokens = createComputedConfig("max_tokens", 4096);
const thisConfig_temperature_switch = createComputedSwitch("temperature");
const thisConfig_temperature = createComputedConfig("temperature", 0.8);
const thisConfig_top_p_switch = createComputedSwitch("top_p");
const thisConfig_top_p = createComputedConfig("top_p", 0.9);
const thisConfig_top_k_switch = createComputedSwitch("top_k");
const thisConfig_top_k = createComputedConfig("top_k", 50);
const thisConfig_frequency_penalty_switch = createComputedSwitch("frequency_penalty");
const thisConfig_frequency_penalty = createComputedConfig("frequency_penalty", 0.5);
const thisConfig_response_format_switch = createComputedSwitch("response_format");
const thisConfig_response_format = createComputedConfig("response_format", "json");
const thisConfig_stop = createComputedConfig("stop", null);
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
</style>