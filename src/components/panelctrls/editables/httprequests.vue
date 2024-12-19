<template>
    <n-flex vertical>
        <editable_header type="success">
            {{ thislabel }}
        </editable_header>
        <n-flex vertical :style="{ width: '100%' }">
            <editable_header type="info" :level="6">
                请求 Method & URL
            </editable_header>
            <n-flex class="flexctitem" justify="space-between" :style="{ width: '100%' }" :wrap="false">
                <n-select v-model:value="thisMethod" :options="HttpMethodSelect" :style="{ width: '8em' }" />
                <n-input v-model:value="thisUrl" :style="{ flex: '1' }" />
            </n-flex>
        </n-flex>
        <n-flex vertical :style="{ width: '100%' }">
            <n-flex class="flexctitem" justify="space-between">
                <editable_header type="info" :level="6">
                    请求头 Header
                </editable_header>
                <n-button text type="info" :disabled="!isEditorMode">
                    <template #icon>
                        <n-icon>
                            <Add />
                        </n-icon>
                    </template>
                    新增Header
                </n-button>
            </n-flex>
            <template v-for="(item, index) in thisHeaders">
                <n-flex class="flexctitem" justify="space-between" :style="{ width: '100%' }" :wrap="false">
                    <n-flex class="flexctitem" :style="{ width: '95%' }" :wrap="false">
                        <n-auto-complete size="small" v-model:value="item.key" :options="HeaderKeySelectGroup"
                            :get-show="headerKeyGetShow" :style="{ width: '50%' }" @focus="isEditing = true"
                            @blur="isEditing = false" />
                        <n-auto-complete size="small" v-model:value="item.value"
                            :options="buildHeaderValueSelect(item.key)"
                            :get-show="(value) => headerValueGetShow(item.key, value)" :style="{ width: '50%' }"
                            @focus="isEditing = true" @blur="isEditing = false" />
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
            </template>
        </n-flex>
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
    NAutoComplete,
} from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import { mapVarItemToSelect, renderLabel4Select } from '@/utils/tools'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import { typeSelectionsWNull, typeSelections } from '@/utils/schemas'
import { HeaderKeySelectGroup, HeaderValueSelect, HttpMethodSelect } from '@/utils/CmdHTTPConfiguration'

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
const createComputedConfig = (prop) => {
    return computed({
        get() {
            return thisnode.value.data.payloads.byId[props.pid].data[prop];
        },
        set(value) {
            thisnode.value.data.payloads.byId[props.pid].data[prop] = value;
        }
    });
};

const thisMethod = createComputedConfig('method');
const thisUrl = createComputedConfig('url');
const thisQueryParams = createComputedConfig('queryParams');

const thisHeaders = createComputedConfig('headers');
const headerKeyGetShow = (value) => {
    if (value.endsWith('/')) return true;
    return false;
};
const headerValueGetShow = (key, value) => {
    if (value.endsWith('/') && HeaderValueSelect.hasOwnProperty(key)) return true;
    return false;
};
const buildHeaderValueSelect = (key) => {
    if (HeaderValueSelect.hasOwnProperty(key)) {
        return HeaderValueSelect[key];
    }
    return [];
};

</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
</style>