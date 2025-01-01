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

const _initInfo = createBaseNodeInfo();
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "code_interpreter");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "代码解释器");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input");
addHandle(_initInfo, "outputs", "output");
addHandle(_initInfo, "callbackUsers", "callbackUser");
addHandle(_initInfo, "callbackFuncs", "callbackFunc");

addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input" });
addPayload(_initInfo, {
    label: "输入变量", type: "VarsInput", key: "inputvars", data: [
        { key: "arg1", type: "String", value: "hello" },
        { key: "arg2", type: "String", value: "world" },
    ],
    config: { instance: { key: "", type: "ref", value: "" } },
    uitype: "vars_input"
}, 'D_VARSINPUT');
addPayload(_initInfo, {
    label: "Python 代码", type: "String", key: "Code",
    data: "#You can use numpy and cv2 by import\ndef main(arg1, arg2):\n    # do something\n    return {\n        \"output1\": arg1,\n        \"output2\": arg2\n    }",
    uitype: "codeeditor", config: { language: "python" }
}, 'D_CODE');
setOutputsUIType(_initInfo, "codeoutputs");
addResultWConnect(_initInfo, { label: "output1", type: "String", key: "output1", data: null, }, "output");
addResultWConnect(_initInfo, { label: "output2", type: "String", key: "output2", data: null, }, "output");

export const initInfo = cloneDeep(_initInfo);

export { NodeVue };