<template>
    <n-flex vertical>
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="info">封装输出数组</editable_header>
            <n-button type="primary" text @click="handleAdd">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                添加输出
            </n-button>
        </n-flex>
        <n-flex vertical>
            <n-input-group v-for="rid in thisnode.data.results.order" :key="rid">
                <n-input :style="{ width: '25%' }" placeholder="输出变量Key" :value="thisnode.data.results.byId[rid].key"
                    @blur="isEditing = false" @focus="isEditing = true"
                    @update:value="(val) => updateResultKey(rid, val)" />
                <n-select :style="{ width: '60%' }" placeholder="选择变量" :value="thisnode.data.results.byId[rid].data"
                    :options="selfVarSelections" @update:value="(val) => updateResultType(rid, val)"
                    :render-tag="renderTag" />
                <n-button :style="{ width: '15%' }" type="error" @click="() => handleRemove(rid)">
                    删除
                </n-button>
            </n-input-group>
        </n-flex>
    </n-flex>
</template>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>

<script setup>
import { computed, ref, inject, h } from 'vue'
import { NText, NIcon, NFlex, NTag, NInputGroup, NInput, NSelect, NButton } from 'naive-ui'
import { useVueFlow } from '@vue-flow/core'
import { Add, Close } from '@vicons/ionicons5'
import editable_header from './header.vue'
import { addResultWConnect, rmResultWConnect } from '../../nodes/NodeOperator.js'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
})

const isEditing = inject("isEditing");
// 获取节点数据
const { findNode } = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

// 处理添加
function handleAdd() {
    const newResult = { label: "", type: "", key: "", data: null }
    addResultWConnect(thisnode.value, newResult, "output")
}
function handleRemove(rid) {
    rmResultWConnect(thisnode.value, rid)
}
// 更新结果的 key
function updateResultKey(rid, value) {
    if (thisnode.value.data.results.byId[rid]) {
        thisnode.value.data.results.byId[rid].key = value;
        thisnode.value.data.results.byId[rid].label = value;
    }
}

// 更新结果的类型
function updateResultType(rid, value) {
    const [nid, dpath, did] = value.split("/");
    const thenode = findNode(nid);
    const thedata = thenode.data[dpath].byId[did];
    if (thisnode.value.data.results.byId[rid]) {
        thisnode.value.data.results.byId[rid].data = value;
        thisnode.value.data.results.byId[rid].type = `Array<${thedata.type}>`;
    }
}
const PYTHON_KEYWORDS = [
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
    'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
    'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
    'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
    'with', 'yield'
];
const isPythonVariable = (value) => {
    // 空字符串不是有效的变量名
    if (!value) return false;

    // 检查是否包含非法字符（只允许字母、数字和下划线）
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        return false;
    }

    // 检查是否是Python关键字
    if (PYTHON_KEYWORDS.includes(value)) {
        return false;
    }

    return true;
};

const renderTag = ({ option, handleClose }) => {
    const [nlabel, dlabel, dkey, dtype] = option.label.split("/");

    const isError = !props.selfVarSelections.some(select => select.value === option.value);
    const tagtype = isError ? "error" : "default";
    return h(
        NTag,
        {
            type: tagtype,
            closable: true,
            onMousedown: (e) => {
                e.preventDefault();
            },
            onClose: (e) => {
                e.stopPropagation();
                handleClose();
            }
        },
        {
            default: () => {
                if (isError) {
                    return `❓${nlabel}`;
                }
                return [
                    h(NText, { type: "default", strong: true }, { default: () => `${nlabel}` }),
                    h(NText, { type: "default" }, { default: () => "/ " }),
                    h(NText, { type: "info", }, { default: () => dlabel }),
                    h(NText, { type: "info", }, { default: () => ` ${dtype}` }),
                ]
            }
        }
    );
};
</script>