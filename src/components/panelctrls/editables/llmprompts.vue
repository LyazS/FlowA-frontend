<template>
    <n-flex vertical>
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="warning">
                Prompts设计
            </editable_header>
            <n-button text type="warning" @click="addVariable" :disabled="!isEditorMode">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                新增Prompt
            </n-button>
        </n-flex>
        <n-flex vertical v-for="(pvar, vindex) in thisnode.data.payloads.byId[pid].data"
            :style="{ border: '1px solid #555', padding: '5px' }">
            <n-flex :style="{ width: '100%', marginBottom: '2px' }" class="flexctitem" justify="space-between"
                :wrap="false">
                <n-flex :style="{ width: '90%' }" class="flexctitem" justify="space-between" :wrap="false">
                    <n-select :style="{ width: '130px' }" size="small" placeholder="类型" :options="roleSelections"
                        :disabled="!isEditorMode" v-model:value="pvar.role" />
                    <n-button text size="small" type="warning" @click="openEditor(vindex)" :disabled="!isEditorMode">
                        <template #icon>
                            <n-icon>
                                <CreateOutline />
                            </n-icon>
                        </template>
                        放大编辑
                    </n-button>
                </n-flex>
                <n-button circle tertiary size="small" type="error" @click="rmVariable(vindex)"
                    :disabled="!isEditorMode">
                    <template #icon>
                        <n-icon>
                            <Close />
                        </n-icon>
                    </template>
                </n-button>
            </n-flex>
            <n-input type="textarea" placeholder="请输入Prompt" clearable :disabled="!isEditorMode" :autosize="{
                minRows: 3,
                maxRows: 5,
            }" v-model:value="pvar.content" @blur="isEditing = false" @focus="isEditing = true" />
        </n-flex>
    </n-flex>

</template>

<script setup>
import { ref, computed, h, inject } from 'vue'
import { useMessage, NSwitch, NFlex, NText, NIcon, NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import { CreateOutline } from '@vicons/ionicons5'
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
const isShowCodeEditor = inject("isShowCodeEditor");
const CodeEditorPath = inject("CodeEditorPath");
const CodeEditorLangType = inject("CodeEditorLangType");

// 获取节点数据
const { findNode } = useVueFlow()
const { isEditorMode } = useFlowAOperation();
const thisnode = computed(() => findNode(props.nodeId))

const roleSelections = [
    { label: "系统提示词", value: "system" },
    { label: "用户提示词", value: "user" },
    { label: "AI回复", value: "assistant" },
]

const addVariable = () => {
    const newVar = { key: "", type: "value", value: "" };
    thisnode.value.data.payloads.byId[props.pid].data.push(newVar);
};

const rmVariable = (index) => {
    thisnode.value.data.payloads.byId[props.pid].data.splice(index, 1);
};

const openEditor = (index) => {
    isShowCodeEditor.value = true;
    CodeEditorPath.value = ["data", "payloads", "byId", props.pid, "data", index, "content"];
    CodeEditorLangType.value = "text";
};
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>