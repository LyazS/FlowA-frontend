<template>
    <n-flex vertical>
        <n-flex vertical :style="{ width: '100%' }">
            <editable_header type="warning" :level="6">
                请求 Method & URL
            </editable_header>
            <n-flex class="flexctitem" justify="space-between" :style="{ width: '100%' }" :wrap="false">
                <n-select v-model:value="thisMethod" :options="HttpMethodSelect" :style="{ width: '8em' }" />
                <n-input v-model:value="thisUrl" :style="{ flex: '1' }" />
            </n-flex>
        </n-flex>
        <n-flex vertical :style="{ width: '100%' }">
            <n-flex class="flexctitem" justify="space-between">
                <editable_header type="warning" :level="6">
                    Query参数
                </editable_header>
                <n-button text type="warning" @click="addQuery" :disabled="!isEditorMode">
                    <template #icon>
                        <n-icon>
                            <Add />
                        </n-icon>
                    </template>
                    新增Query
                </n-button>
            </n-flex>
            <template v-for="(item, index) in thisQueryParams">
                <n-flex class="flexctitem" justify="space-between" :style="{ width: '100%' }" :wrap="false">
                    <n-flex class="flexctitem" :style="{ width: '95%' }" :wrap="false">
                        <n-input size="small" v-model:value="item.key" :style="{ width: '50%' }" placeholder="键"
                            @focus="isEditing = true" @blur="isEditing = false" />
                        <n-input size="small" v-model:value="item.value" :style="{ width: '50%' }" placeholder="值"
                            @focus="isEditing = true" @blur="isEditing = false" />
                    </n-flex>
                    <n-button circle tertiary size="small" type="error" @click="rmQuery(index)"
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
        <n-flex vertical :style="{ width: '100%' }">
            <n-flex class="flexctitem" justify="space-between">
                <editable_header type="warning" :level="6">
                    请求头 Header
                </editable_header>
                <n-button text type="warning" @click="addHeader" :disabled="!isEditorMode">
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
                            placeholder="按'/'键自动填充" :get-show="headerKeyGetShow" :style="{ width: '50%' }"
                            @focus="isEditing = true" @blur="isEditing = false" />
                        <n-auto-complete size="small" v-model:value="item.value" placeholder="按'/'键自动填充"
                            :options="buildHeaderValueSelect(item.key)"
                            :get-show="(value) => headerValueGetShow(item.key, value)" :style="{ width: '50%' }"
                            @focus="isEditing = true" @blur="isEditing = false" />
                    </n-flex>
                    <n-button circle tertiary size="small" type="error" @click="rmHeader(index)"
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
        <n-flex vertical :style="{ width: '100%' }">
            <n-flex class="flexctitem" justify="space-between">
                <editable_header type="warning" :level="6">
                    请求体 Body
                </editable_header>
                <n-flex class="flexctitem" justify="flex-end">
                    <n-button v-if="isShowEditBtn" :disabled="!isEditorMode" text type="warning" @click="editBody_Json">
                        <template #icon>
                            <n-icon>
                                <CreateOutline />
                            </n-icon>
                        </template>
                        放大编辑
                    </n-button>
                    <n-select v-model:value="thisBody.type" :options="HttpBodyTypeSelect" :consistent-menu-width="false"
                        :style="{ width: 'auto' }" @update:value="updateBodyContentByType" />
                </n-flex>
            </n-flex>
            <n-code v-if="isShowEditBtn && thisBody.content" :code="thisBody.content" :language="codeLang"
                show-line-numbers />
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
    NCode,
} from 'naive-ui'
import { Add, Close, CreateOutline } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import editable_header from './header.vue'
import { mapVarItemToSelect, renderLabel4Select, isPlainObject, isString, isJsonString } from '@/utils/tools'
import { useFlowAOperation } from '@/services/useFlowAOperation.js'
import { typeSelectionsWNull, typeSelections } from '@/utils/schemas'
import { HeaderKeySelectGroup, HeaderValueSelect, HttpMethodSelect, HttpBodyTypeSelect } from '@/utils/CmdHTTPConfiguration'

const props = defineProps({
    nodeId: {
        type: String,
        required: true
    },
    selfVarSelections: {
        type: Array,
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
// 查询参数
const thisQueryParams = createComputedConfig('queryParams');
const rmQuery = (index) => {
    thisQueryParams.value.splice(index, 1);
};
const addQuery = () => {
    thisQueryParams.value.push({ key: '', value: '' });
};
// 请求头
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
const rmHeader = (index) => {
    thisHeaders.value.splice(index, 1);
};
const addHeader = () => {
    thisHeaders.value.push({ key: '', value: '' });
};
// 请求体
const isShowCodeEditor = inject("isShowCodeEditor");
const CodeEditorPath = inject("CodeEditorPath");
const CodeEditorLangType = inject("CodeEditorLangType");
const thisBody = createComputedConfig('body');
const isShowEditBtn = computed(() => {
    if (thisBody.value.type === 'json') return true;
    if (thisBody.value.type === 'plain-text') return true;
    return false;
});
const codeLang = computed(() => {
    if (thisBody.value.type === 'json') {
        return 'json'
    } else if (thisBody.value.type === 'plain-text') {
        return 'text'
    }
})
const editBody_Json = () => {
    if (thisBody.value.content == null) thisBody.value.content = "{}";
    CodeEditorPath.value = ["data", "payloads", "byId", props.pid, "data", "body", "content"];
    isShowCodeEditor.value = true;
    CodeEditorLangType.value = "CodeJSON";
}
const updateBodyContentByType = (btype) => {
    console.log(btype);
    if (btype === 'json' && !isJsonString(thisBody.value.content)) {
        thisBody.value.content = "{}";
    }
    else if (btype === 'plain-text' && !isString(thisBody.value.content)) {
        thisBody.value.content = "";
    }
    else if (btype === 'x-www-form-urlencoded' && !Array.isArray(thisBody.value.content)) {
        thisBody.value.content = [];
    }
    else if (btype === 'form-data' && !Array.isArray(thisBody.value.content)) {
        thisBody.value.content = [];
    }
}
</script>

<style scoped>
.flexctitem {
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
</style>