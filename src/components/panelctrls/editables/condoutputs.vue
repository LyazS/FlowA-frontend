<template>
    <n-flex vertical>
        <!-- 添加条件分支按钮 -->
        <n-flex class="flexctitem" justify="space-between">
            <editable_header type="info">分支设计</editable_header>
            <n-button type="primary" text @click="addBranch">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                新增分支
            </n-button>
        </n-flex>

        <!-- 条件分支列表 -->
        <n-card v-for="(branch, bindex) in branches">
            <template #header>
                <n-flex class="flexctitem" justify="flex-start">
                    <n-text> {{ branch.data.label }} </n-text>
                </n-flex>
            </template>
            <template #header-extra>
                <n-switch v-if="branch.data.data.conditions.length > 1" :value="branch.data.data.condType === 'AND'"
                    @update:value="(val) => updateCondType(branch.rid, val)" size="medium"
                    :style="{ paddingRight: '40px' }" :rail-style="railStyle">
                    <template #checked>AND</template>
                    <template #unchecked>OR</template>
                    <template #checked-icon>&</template>
                    <template #unchecked-icon>|</template>
                </n-switch>
                <n-button circle tertiary type="error" @click="rmBranch(branch.rid)">
                    <template #icon>
                        <n-icon>
                            <Close />
                        </n-icon>
                    </template>
                </n-button>
            </template>
            <n-card v-for="(cond, cindex) in branch.data.data.conditions" hoverable size="small">
                <n-flex class="flexctitem" :style="{ width: '100%' }" :wrap="false">
                    <n-flex vertical :style="{ width: '90%' }">
                        <n-flex :wrap="false">
                            <n-select :style="{ width: '65%' }" size="small" placeholder="变量"
                                v-model:value="cond.refdata" :options="selfVarSelections" :render-label="renderLabel" />
                            <n-select :style="{ width: '35%' }" size="small" placeholder="操作"
                                :options="opTypeSelections" v-model:value="cond.op" />
                        </n-flex>
                        <n-flex :wrap="false">
                            <n-select :style="{ width: '35%' }" size="small" placeholder="类型"
                                :options="compTypeSelections" v-model:value="cond.comparetype" />
                            <n-select v-if="cond.comparetype === 'ref'" :style="{ width: '65%' }" size="small"
                                placeholder="比较变量" :options="selfVarSelections" :render-label="renderLabel"
                                v-model:value="cond.value" />
                            <n-input v-else :style="{ width: '65%' }" size="small" placeholder="数值"
                                v-model:value="cond.value" @blur="isEditing = false" @focus="isEditing = true" />
                        </n-flex>
                    </n-flex>
                    <n-button circle tertiary size="small" type="error" @click="rmBranchCondition(branch.rid, cindex)">
                        <template #icon>
                            <n-icon>
                                <Close />
                            </n-icon>
                        </template>
                    </n-button>
                </n-flex>
            </n-card>
            <n-button quaternary type="info" @click="addCondition(branch.rid)">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                新增条件
            </n-button>
        </n-card>
    </n-flex>

</template>

<script setup>
import { ref, computed, h, inject } from 'vue'
import { useMessage, NSwitch, NFlex, NText, NIcon, NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import {
    addResult,
    rmResult,
    addConnection,
    rmConnection,
    addHandle,
    rmHandle,
} from '../../nodes/NodeOperator.js'
import { getUuid } from '@/utils/tools.js'
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
const {
    findNode,
    getHandleConnections,
    updateNodeInternals,
    removeEdges,
    getEdges,
} = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

const railStyle = ({ focused, checked }) => {
    let style = {};
    style.background = "#2080f0";
    return style;
};

const renderLabel = (option) => {
    const [nlabel, dlabel, dkey, dtype] = option.label.split("/");

    const isError = !props.selfVarSelections.some(select => select.value === option.value);
    if (isError) {
        return h(NText, { type: "error", strong: true }, { default: () => `❓${nlabel}` });

    }
    return [
        h(NText, { type: "default", strong: true }, { default: () => `${nlabel}` }),
        h(NText, { type: "default" }, { default: () => "/ " }),
        h(NText, { type: "info", }, { default: () => dlabel }),
        h(NText, { type: "info", }, { default: () => ` ${dtype}` }),
    ]
};
const branches = computed(() => {
    const conddata = [];
    for (const rid of thisnode.value.data.results.order) {
        if (thisnode.value.data.results.byId[rid].key !== 'cond-else') {
            conddata.push({ rid, data: thisnode.value.data.results.byId[rid] })
        }
    }
    return conddata;
});

const updateOutputsLabel = () => {
    const elsekey = Object.keys(thisnode.value.data.connections.outputs)
        .filter(key => thisnode.value.data.connections.outputs[key].label.endsWith('ELSE'));
    thisnode.value.data.connections.outputs[elsekey[0]].label = `${Object.keys(thisnode.value.data.connections.outputs).length}/ELSE`;
    const hids = Object.keys(thisnode.value.data.connections.outputs)
        .filter(key => !thisnode.value.data.connections.outputs[key].label.endsWith('ELSE'));
    for (let index = 0; index < hids.length; index++) {
        const hid = hids[index];
        thisnode.value.data.connections.outputs[hid].label = `${index + 1}/CASE ${index + 1}`;
        const rid = hid.replace('output-', '');
        thisnode.value.data.results.byId[rid].label = `CASE ${index + 1}`;
    }
};
const addBranch = () => {
    const bid = getUuid();
    const hid = `output-${bid}`;
    const cid = `c-${bid}`;
    const newBranch = {
        label: "-",
        type: "ConditionDict",
        key: `cond-${bid}`,
        data: {
            outputKey: hid,
            condType: "AND",
            conditions: [// 创建时默认存在一个
                {
                    refdata: "",
                    op: "eq",
                    comparetype: "ref",
                    value: ""
                },
            ]
        },
    };
    addResult(thisnode.value, newBranch, bid);
    addHandle(thisnode.value, "outputs", hid, "分支");
    addConnection(thisnode.value, "outputs", hid, { type: "FromOuter", inputKey: "input-var" }, cid);
    updateNodeInternals(props.nodeId);
    updateOutputsLabel();
};
const rmBranch = (rid) => {
    const hid = `output-${rid}`;
    const cid = `c-${rid}`;
    rmResult(thisnode.value, rid);
    rmConnection(thisnode.value, "outputs", hid, cid);
    // 在去掉handle之前，还需要搜索并去掉对应的edges
    const edges = getHandleConnections({ id: hid, type: "source", nodeId: props.nodeId });
    removeEdges(edges.map(edge => edge.edgeId));
    rmHandle(thisnode.value, "outputs", hid);
    updateOutputsLabel();
};

const addCondition = (rid) => {
    const newCond = {
        refdata: "",
        op: "eq",
        comparetype: "ref",
        value: ""
    };
    thisnode.value.data.results.byId[rid].data.conditions.push(newCond);
};
const rmBranchCondition = (rid, cindex) => {
    thisnode.value.data.results.byId[rid].data.conditions.splice(cindex, 1);
};

// 更新条件类型(AND/OR)
const updateCondType = (rid, value) => {
    thisnode.value.data.results.byId[rid].data.condType = value ? 'AND' : 'OR';
}

// 更新条件变量
const opTypeSelections = [
    { label: "等于", value: "eq" },
    { label: "不等于", value: "ne" },
    { label: "大于", value: "gt" },
    { label: "大于等于", value: "gte" },
    { label: "小于", value: "lt" },
    { label: "小于等于", value: "lte" },
    { label: "包含", value: "contains" },
    { label: "不包含", value: "notcontains" },
    { label: "为空", value: "isnull" },
    { label: "不为空", value: "notnull" },
]
const compTypeSelections = [
    { label: "引用", value: "ref" },
    { label: "数值", value: "value" },
]

</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
}
</style>