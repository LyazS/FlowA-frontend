<template>
    <n-flex vertical>
        <!-- 添加条件分支按钮 -->
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="info">分支设计</editable_header>
            <n-button type="primary" text @click="addConditionBranch">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                新增分支
            </n-button>
        </n-flex>

        <!-- 条件分支列表 -->
        <n-card v-for="(branch, index) in branches">
            <template #header>
                <n-text>
                    {{ `分支 ${index + 1}` }}
                </n-text>
                <n-switch size="medium" :style="{ paddingLeft: '30px' }" :rail-style="railStyle">
                    <template #checked>
                        AND
                    </template>
                    <template #unchecked>
                        OR
                    </template>
                    <template #checked-icon>
                        &
                    </template>
                    <template #unchecked-icon>
                        |
                    </template>
                </n-switch>
            </template>
            <template #header-extra>
                <n-button circle tertiary type="error" @click="removeBranch(index)">
                    <template #icon>
                        <n-icon>
                            <Close />
                        </n-icon>
                    </template>
                </n-button>
            </template>
            <n-card hoverable size="small">
                <n-flex class="flexctitem" :style="{ width: '100%' }" :wrap="false">
                    <n-flex vertical :style="{ width: '90%' }">
                        <n-flex :wrap="false">
                            <n-select :style="{ width: '70%' }" size="small" placeholder="变量"> </n-select>
                            <n-select :style="{ width: '30%' }" size="small" placeholder="操作"> </n-select>
                        </n-flex>
                        <n-flex :wrap="false">
                            <n-select :style="{ width: '30%' }" size="small" placeholder="比较值"> </n-select>
                            <n-select :style="{ width: '70%' }" size="small" placeholder="比较变量"> </n-select>
                        </n-flex>
                    </n-flex>
                    <n-button circle tertiary size="small" type="error">
                        <template #icon>
                            <n-icon>
                                <Close />
                            </n-icon>
                        </template>
                    </n-button>
                </n-flex>
            </n-card>
        </n-card>

    </n-flex>

</template>

<script setup>
import { ref, computed, h, inject } from 'vue'
import { useMessage, NSwitch, NFlex, NText, NIcon, NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import { addResult, rmResult, addConnection, rmConnection } from '../../nodes/NodeOperator.js'
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

const railStyle = ({ focused, checked }) => {
    let style = {};
    style.background = "#2080f0";
    return style;
};
const branches = ref([
    {
        variable: 'BOT_L',
        condition: 'lessThan',
        compareType: 'input',
        value: '',
        andConditions: []
    }
])


const addConditionBranch = () => {
    branches.value.push({
        variable: '',
        condition: '',
        compareType: '',
        value: '',
        andConditions: []
    })
}

const removeBranch = (index) => {
    branches.value.splice(index, 1)
}

const addAndCondition = (branch) => {
    branch.andConditions.push({
        variable: '',
        condition: '',
        compareType: '',
        value: ''
    })
}

const removeAndCondition = (branch, index) => {
    branch.andConditions.splice(index, 1)
}
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>