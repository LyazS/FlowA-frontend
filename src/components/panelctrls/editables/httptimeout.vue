<template>
    <editable_header type="error" :level="6">
        <n-collapse arrow-placement="right">
            <n-collapse-item :title="thislabel">
                <n-flex vertical>
                    <n-flex v-for="timeout in timeouts" class="flexctitem" justify="space-between"
                        :style="{ width: '50%' }" :wrap="false">
                        <n-text>{{ timeout.label }}</n-text>
                        <n-input-number v-model:value="timeout.cpValue.value" :style="{ flex: '1' }" size="small"
                            @blur="isEditing = false" @focus="isEditing = true" :precision="0" />
                    </n-flex>
                </n-flex>
            </n-collapse-item>
        </n-collapse>
    </editable_header>
</template>

<script setup>
import { ref, computed, h, inject, defineAsyncComponent } from 'vue'
import {
    NFlex,
    NText,
    NIcon,
    NButton,
    NInput,
    NSelect,
    NAutoComplete,
    NCollapse,
    NCollapseItem,
    NInputNumber,
} from 'naive-ui'
import { Add, Close, CreateOutline } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './common/header.vue'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import { HeaderKeySelectGroup, HeaderValueSelect, HttpMethodSelect, HttpBodyTypeSelect, FormDataContentTypeSelect } from '@/utils/http_schemas'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    },
})
const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();
// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))
const thislabel = computed(() => thisnode.value.data.payloads.byId[props.pid].label);
const createComputed = (prop) => {
    return computed({
        get() {
            return thisnode.value.data.payloads.byId[props.pid].data[prop];
        },
        set(value) {
            thisnode.value.data.payloads.byId[props.pid].data[prop] = value;
        }
    });
};
const timeouts = [
    { label: '连接超时（秒）', cpValue: createComputed("connect") },
    { label: '读取超时（秒）', cpValue: createComputed("read") },
    { label: '写入超时（秒）', cpValue: createComputed("write") },
]
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
</style>