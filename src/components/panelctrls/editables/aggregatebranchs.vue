<template>
    <n-flex vertical>
        <editable_header type="warning">聚合设计</editable_header>
        <VueDraggable ghostClass="ghost" :animation="150" v-model="branchesData" :disabled="!isEditorMode">
            <n-flex v-for="(item, index) in branchesData" :key="`branch-${index}-${Date.now()}`"
                :style="{ flexWrap: 'nowrap', paddingBottom: '5px', alignItems: 'center' }">
                <n-icon size="16">
                    <EllipsisVerticalIcon />
                </n-icon>
                <n-select :style="{ width: '40%' }" size="small" :options="inputNodesOptions" :disabled="!isEditorMode"
                    v-model:value="item.node" />
                <cp_var_select :style="{ width: '60%' }" v-model:value="item.refdata"
                    :options="getBuildNodeOutVars(item.node)" />
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
            <n-button text type="warning" @click="addVar" :disabled="!isEditorMode">
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
import { ref, computed, h, inject, watch, defineAsyncComponent } from 'vue';
import {
    NFlex,
    NIcon,
    NSelect,
    NButton,
} from 'naive-ui';
import {
    Add as AddIcon,
    Close as CloseIcon,
    EllipsisVertical as EllipsisVerticalIcon
} from '@vicons/ionicons5';
import { useVueFlow } from '@vue-flow/core';
import editable_header from './common/header.vue';
import { mapVarItemToSelect } from '@/utils/tools'
import { VueDraggable } from 'vue-draggable-plus';
import { useFlowAOperation } from '@/services/useFlowAOperation.js';
import { useVFlowManagement } from '@/hooks/useVFlowManagement';

const cp_var_select = defineAsyncComponent(() => import('@/components/panelctrls/editables/common/var_select.vue'));
const {
    findVarFromIO,
    recursiveFindVariables
} = useVFlowManagement();

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
    inputNodes: {
        type: Object,
        required: true
    }
});

const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();

const { findNode } = useVueFlow();
const thisnode = computed(() => findNode(props.nodeId));

const branchesData = computed({
    get() {
        return thisnode.value.data.payloads.byId[props.pid].data || [];
    },
    set(value) {
        thisnode.value.data.payloads.byId[props.pid].data = value;
    }
});

const inputNodesOptions = computed(() => {
    const options = [];
    if (!props.inputNodes.hasOwnProperty('input')) return options;
    for (const node of props.inputNodes.input) {
        const nid = node.srcid;
        const thenode = findNode(nid);
        if (thenode) {
            let olabel = thenode.data.connections.outputs[node.srcohid].label;
            const pattern = /^\d+\/[^/]*$/;
            if (pattern.test(olabel)) {
                olabel = olabel.split('/')[1];
            }
            options.push({
                label: `${thenode.data.label}-${olabel.toUpperCase()}`,
                value: `${nid}/${node.srcohid}`
            });
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

                thisnode.value.data.results.byId['D_OUTPUT'].type = node?.data[dpath]?.byId[rid]?.type;
            }
        }
    },
    { immediate: true, deep: true }
);
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