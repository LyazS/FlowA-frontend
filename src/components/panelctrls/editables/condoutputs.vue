<template>

    <n-flex vertical>

        <!-- 添加条件分支按钮 -->
        <div class="header">
            <div>分支设计</div>
            <n-button type="primary" text @click="addConditionBranch">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                新增分支
            </n-button>
        </div>

        <!-- 条件分支列表 -->
        <div class="branches">
            <n-card v-for="(branch, index) in branches" :key="index" :title="'如果' + (index === 0 ? ' 优先级 1' : '')"
                class="branch-card">
                <template #header-extra>
                    <n-button circle tertiary type="error" @click="removeBranch(index)">
                        <template #icon>
                            <n-icon>
                                <Close />
                            </n-icon>
                        </template>
                    </n-button>
                </template>

                <n-form :model="branch" label-placement="left" label-width="80">
                    <n-grid :cols="4" :x-gap="12">
                        <n-grid-item>
                            <n-form-item label="引用变量">
                                <n-select v-model:value="branch.variable" placeholder="开始 - BOT_L"
                                    :options="variableOptions" />
                            </n-form-item>
                        </n-grid-item>
                        <n-grid-item>
                            <n-form-item label="选择条件">
                                <n-select v-model:value="branch.condition" placeholder="长度小于"
                                    :options="conditionOptions" />
                            </n-form-item>
                        </n-grid-item>
                        <n-grid-item>
                            <n-form-item label="比较值">
                                <n-select v-model:value="branch.compareType" placeholder="输入"
                                    :options="compareOptions" />
                            </n-form-item>
                        </n-grid-item>
                        <n-grid-item>
                            <n-form-item label=" ">
                                <n-input v-model:value="branch.value" placeholder="输入参数值" />
                            </n-form-item>
                        </n-grid-item>
                    </n-grid>

                    <!-- AND 条件 -->
                    <n-space align="center" style="margin-top: 12px">
                        <div class="and-line"></div>
                        <n-tag type="info" size="small">且</n-tag>
                        <n-button text type="primary" @click="addAndCondition(branch)">
                            <template #icon>
                                <n-icon>
                                    <Add />
                                </n-icon>
                            </template>
                            新增
                        </n-button>
                    </n-space>

                    <div v-for="(condition, cIndex) in branch.andConditions" :key="cIndex">
                        <n-grid :cols="4" :x-gap="12" style="margin-top: 12px">
                            <n-grid-item>
                                <n-select v-model:value="condition.variable" placeholder="请选择"
                                    :options="variableOptions" />
                            </n-grid-item>
                            <n-grid-item>
                                <n-select v-model:value="condition.condition" placeholder="请选择"
                                    :options="conditionOptions" />
                            </n-grid-item>
                            <n-grid-item>
                                <n-select v-model:value="condition.compareType" placeholder="引用"
                                    :options="compareOptions" />
                            </n-grid-item>
                            <n-grid-item>
                                <n-space>
                                    <n-select v-model:value="condition.value" placeholder="请选择" style="width: 100%" />
                                    <n-button circle tertiary type="error" @click="removeAndCondition(branch, cIndex)">
                                        <template #icon>
                                            <n-icon>
                                                <Close />
                                            </n-icon>
                                        </template>
                                    </n-button>
                                </n-space>
                            </n-grid-item>
                        </n-grid>
                    </div>
                </n-form>
            </n-card>

            <!-- 否则分支 -->
            <n-card title="否则如果 优先级 2" class="branch-card">
                <n-form label-placement="left" label-width="80">
                    <n-grid :cols="4" :x-gap="12">
                        <n-grid-item>
                            <n-form-item label="引用变量">
                                <n-select placeholder="请选择" :options="variableOptions" />
                            </n-form-item>
                        </n-grid-item>
                        <n-grid-item>
                            <n-form-item label="选择条件">
                                <n-select placeholder="请选择" :options="conditionOptions" />
                            </n-form-item>
                        </n-grid-item>
                        <n-grid-item>
                            <n-form-item label="比较值">
                                <n-select placeholder="引用" :options="compareOptions" />
                            </n-form-item>
                        </n-grid-item>
                        <n-grid-item>
                            <n-form-item label=" ">
                                <n-select placeholder="请选择" />
                            </n-form-item>
                        </n-grid-item>
                    </n-grid>
                </n-form>
            </n-card>

            <!-- 否则分支 -->
            <n-card title="否则" class="branch-card">
            </n-card>
        </div>
    </n-flex>

</template>

<script setup>
import { ref } from 'vue'
import { Add, Close } from '@vicons/ionicons5'
import { useMessage, NFlex, NText, NIcon, NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from 'naive-ui'
const branches = ref([
    {
        variable: 'BOT_L',
        condition: 'lessThan',
        compareType: 'input',
        value: '',
        andConditions: []
    }
])

const variableOptions = [
    { label: '开始 - BOT_L', value: 'BOT_L' }
]

const conditionOptions = [
    { label: '长度小于', value: 'lessThan' }
]

const compareOptions = [
    { label: '输入', value: 'input' },
    { label: '引用', value: 'reference' }
]

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
.condition-selector {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.branches {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.branch-card {
    width: 100%;
}

.and-line {
    width: 24px;
    height: 1px;
    background-color: #ccc;
}
</style>