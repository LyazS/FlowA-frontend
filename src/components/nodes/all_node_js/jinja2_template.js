import {
    createBaseNodeInfo,
    initAttachedAttribute,
    initNestedAttribute,
    initConnectionsAttribute,
    initRunningAttribute,
    initStateAttribute,
    initMinSize,
    initSize,
    setNodeType,
    setVueType,
    setLabel,
    addAttachedNode,
    addHandle,
    addConnection,
    rmConnection,
    addPayload,
    addResultWConnect,
    rmPayload,
    rmResultWConnect,
    setOutputsUIType,
    addResult,
    rmResult,
} from '../NodeOperator.js'

import { cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/basenode.vue';
import { watch } from 'vue';

const _initInfo = createBaseNodeInfo();
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "jinja2_template");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "Jinja2模板");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input");
// addHandle(_initInfo, "outputs", "output");
// addHandle(_initInfo, "callbackUsers", "callbackUser");
// addHandle(_initInfo, "callbackFuncs", "callbackFunc");

addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input" });
addPayload(_initInfo, {
    label: "输入变量", type: "VarsInput", key: "inputvars", data: [
        { key: "arg1", type: "String", value: "hello" },
        { key: "arg2", type: "String", value: "world" },
    ], uitype: "vars_input"
}, 'D_VARSINPUT');
addPayload(_initInfo, {
    label: "Jinja2 模板", type: "String", key: "Code",
    data: "{{ arg1 }} {{ arg2 }}",
    uitype: "codeeditor", config: { language: "django" }
}, 'D_CODE');

addResult(_initInfo, {
    label: "输入变量", type: "Dict", key: "inputvars", data: {
    }
}, "D_OUTPUT");

export const initInfo = cloneDeep(_initInfo);
export const initFunc = (node) => {
    watch(
        () => node.data.payloads.byId["D_VARSINPUT"].data,
        (newVal) => {
            node.data.results.byId["D_OUTPUT"].data = {};
            for (let i = 0; i < newVal.length; i++) {
                node.data.results.byId["D_OUTPUT"].data[newVal[i].key] = newVal[i].value;
            }
        }
    )
}
export { NodeVue };