<template>
    <n-flex vertical>
        <editable_header type="info">聚合设计</editable_header>
        <VueDraggable ghostClass="ghost" :animation="150" v-model="thisnode.data.payloads.byId['branches'].data"
            :disabled="!isEditorMode">
            <n-flex v-for="(item, index) in thisnode.data.payloads.byId['branches'].data"
                :style="{ flexWrap: 'nowrap', paddingBottom: '5px', alignItems: 'center' }">
                <n-icon size="16">
                    <EllipsisVertical />
                </n-icon>
                <n-select :style="{ width: '40%' }" size="small" :options="inputNodesOptions" v-model:value="item.node"
                    @update:value="" />
                <n-select :style="{ width: '60%' }" size="small" :options="buildNodeOutVars(item.node)"
                    v-model:value="item.refdata" :render-label="renderLabel" />
                <n-button circle tertiary type="error" @click="removeVar(index)">
                    <template #icon>
                        <n-icon>
                            <Close />
                        </n-icon>
                    </template>
                </n-button>
            </n-flex>
        </VueDraggable>
        <n-flex justify="flex-start">
            <n-button text type="info" @click="addVar">
                <template #icon>
                    <n-icon>
                        <Add />
                    </n-icon>
                </template>
                添加分支变量
            </n-button>
        </n-flex>
    </n-flex>

</template>

<script setup>
import { ref, computed, h, inject, watch } from 'vue'
import {
    useMessage,
    NSwitch,
    NFlex,
    NIcon,
    NText,
    NButton,
    NCard,
    NForm,
    NFormItem,
    NGrid,
    NGridItem,
    NInput,
    NSelect,
    NSpace,
    NTag
} from 'naive-ui'
import { Add, Close, EllipsisVertical } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import {
    VueDraggable
} from 'vue-draggable-plus'
import { mapVarItemToSelect } from '@/utils/tools'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import { useVFlowManagement } from '@/hooks/useVFlowManagement';
const {
    findVarFromIO,
    recursiveFindVariables,
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
})
const isEditing = inject("isEditing");
const { isEditorMode } = useFlowAOperation();
// 获取节点数据
const {
    findNode,
    getHandleConnections,
    updateNodeInternals,
    removeEdges,
    getEdges,
} = useVueFlow()
const thisnode = computed(() => findNode(props.nodeId))

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

const buildNodeOutVars = (nid_ohid) => {
    const [nid, ohid] = nid_ohid.split('/');
    const thenode = findNode(nid);
    const outvars = [];
    if (thenode) {
        outvars.push(...recursiveFindVariables(nid, [], [], [], false, [], false, [ohid])
            .map((item) => mapVarItemToSelect(item)));
    }
    return outvars;
}
const addVar = () => {
    if (thisnode.value.data.payloads.byId['branches'].data) {
        thisnode.value.data.payloads.byId['branches'].data.push({
            node: '',
            refdata: ''
        });
    }
};
const removeVar = (index) => {
    if (thisnode.value.data.payloads.byId['branches'].data) {
        thisnode.value.data.payloads.byId['branches'].data.splice(index, 1);
    }
};

watch(() => thisnode.value.data.payloads.byId['branches'].data, (newLists) => {
    if (newLists.length > 0) {
        const [nid, cname, rid] = thisnode.value.data.payloads.byId['branches'].data[0].refdata.split('/');
        const thenode = findNode(nid);
        thisnode.value.data.results.byId['output'].type = thenode.data[cname].byId[rid].type;
    }
}, { immediate: true });

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