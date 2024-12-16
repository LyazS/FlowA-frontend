<template>
    <n-flex vertical>
        <editable_header type="info">聚合设计</editable_header>
        <VueDraggable ghostClass="ghost" :animation="150" v-model="branchesData" :disabled="!isEditorMode">
            <n-flex v-for="(item, index) in branchesData" :key="`branch-${index}-${Date.now()}`"
                :style="{ flexWrap: 'nowrap', paddingBottom: '5px', alignItems: 'center' }">
                <n-icon size="16">
                    <EllipsisVerticalIcon />
                </n-icon>
                <n-select :style="{ width: '40%' }" size="small" :options="inputNodesOptions" :disabled="!isEditorMode"
                    v-model:value="item.node" />
                <n-select :style="{ width: '60%' }" size="small" :options="getBuildNodeOutVars(item.node)"
                    :disabled="!isEditorMode" v-model:value="item.refdata" :render-label="renderLabel" />
                <n-button circle tertiary type="error" @click="removeVar(index)" :disabled="!isEditorMode">
                    <template #icon>
                        <n-icon>
                            <CloseIcon />
                        </n-icon>
                    </template>
                </n-button>
            </n-flex>
        </VueDraggable>
        <n-flex justify="flex-start">
            <n-button text type="info" @click="addVar" :disabled="!isEditorMode">
                <template #icon>
                    <n-icon>
                        <AddIcon />
                    </n-icon>
                </template>
                添加分支变量
            </n-button>
        </n-flex>
    </n-flex>
</template>

<script setup>
import { ref, computed, h, inject, watch } from 'vue';
import {
    NFlex,
    NIcon,
    NSelect,
    NButton,
    NText,
    NSwitch,
    NCard,
    NForm,
    NFormItem,
    NGrid,
    NGridItem,
    NInput,
    NSpace,
    NTag
} from 'naive-ui';
import {
    Add as AddIcon,
    Close as CloseIcon,
    EllipsisVertical as EllipsisVerticalIcon
} from '@vicons/ionicons5';
import { useVueFlow } from '@vue-flow/core';
import editable_header from './header.vue';
import { mapVarItemToSelect, renderLabel4Select } from '@/utils/tools'
import { VueDraggable } from 'vue-draggable-plus';
import { useFlowAOperation } from '@/services/useFlowAOperation.js';
import { useVFlowManagement } from '@/hooks/useVFlowManagement';

const {
    findVarFromIO,
    recursiveFindVariables
} = useVFlowManagement();

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    selfVarSelections: {
        type: Array,
        required: true
    },
    inputNodes: {
        type: Object,
        required: true
    }
});

const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();

const { findNode, getHandleConnections, updateNodeInternals, removeEdges, getEdges } = useVueFlow();
const thisnode = computed(() => findNode(props.nodeId));

const branchesData = computed({
    get() {
        return thisnode.value.data.payloads.byId['D_BRANCHES'].data || [];
    },
    set(value) {
        thisnode.value.data.payloads.byId['D_BRANCHES'].data = value;
    }
});

const inputNodesOptions = computed(() => {
    const options = [];
    if (!props.inputNodes.hasOwnProperty('input')) return options;
    for (const node of props.inputNodes.input) {
        const nid = node.srcid;
        const thenode = findNode(nid);
        if (thenode) {
            options.push({
                label: thenode.data.label,
                value: `${nid}/${node.srcohid}`
            })
        }
    }
    return options;
})

const getBuildNodeOutVars = (nid_ohid) => {
    const [nid, ohid] = nid_ohid.split('/');
    const node = findNode(nid);
    if (!node) return [];
    return recursiveFindVariables(nid, [], [], [], false, [], false, [ohid])
        .map(mapVarItemToSelect);
};

const addVar = () => {
    branchesData.value.push({ node: '', refdata: '' });
};

const removeVar = (index) => {
    branchesData.value.splice(index, 1);
};

watch(
    () => branchesData.value,
    (newLists) => {
        if (Array.isArray(newLists) && newLists.length > 0) {
            const firstElement = newLists[0];
            if (firstElement.refdata) {
                const [nid, dpath, rid] = firstElement.refdata.split('/');
                const node = findNode(nid);
                thisnode.value.data.results.byId['D_OUTPUT'].type = node?.data[dpath].byId[rid].type;
            }
        }
    },
    { immediate: true, deep: true }
);

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
}

.ghost {
    opacity: 0.5;
    background: #8e9192;
}
</style>