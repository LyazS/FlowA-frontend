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
setNodeType(_initInfo, "LLM_inference");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "LLM推理");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input");
addHandle(_initInfo, "outputs", "output");
addHandle(_initInfo, "callbackUsers", "callbackUser");
addHandle(_initInfo, "callbackFuncs", "callbackFunc");

addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input" });
addPayload(_initInfo, { label: "输入变量", type: "LLMInput", key: "inputvars", data: [
    { key: "text", type: "value", value: "good assistant" },
    { key: "ask", type: "value", value: "hi" },
], uitype: "llminputs" });
addPayload(_initInfo, { label: "LLM Prompt", type: "Prompts", key: "prompts", data: [
    { role: "system", content: "You are a {{text}}." },
    { role: "user", content: "{{ask}}" },
], uitype: "llmprompts" });
setOutputsUIType(_initInfo, "tagoutputs");
addResultWConnect(_initInfo, { label: "推理结果", type: "String", key: "output", data: "" }, "output");

export const initInfo = cloneDeep(_initInfo);

export { NodeVue };