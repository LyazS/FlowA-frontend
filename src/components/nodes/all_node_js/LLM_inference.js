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

addPayload(_initInfo, {
    label: "模型设置", type: "LLMModel", key: "modelconfig", data: {
        model: { type: "value", value: "DeepSeekV2.5" },
        stream: false,
        max_tokens: { type: "null", value: 4096 },
        temperature: { type: "null", value: 0.75 },
        top_p: { type: "null", value: 0.9 },
        top_k: { type: "null", value: 50 },
        frequency_penalty: { type: "null", value: 0.5 },
        response_format: { type: "null", value: "json" },// json
        stop: { type: "null", value: null },// string|string[]|null
    }, uitype: "llmmodel"
}, 'D_MODELCONFIG');
addPayload(_initInfo, {
    label: "输入变量", type: "VarsInput", key: "inputvars", data: [
        { key: "text", type: "String", value: "good assistant" },
        { key: "ask", type: "String", value: "hi" },
    ], uitype: "vars_input"
}, 'D_VARSINPUT');
addPayload(_initInfo, {
    label: "LLMPrompts", type: "Prompts", key: "prompts", data: [
        { role: "system", content: "You are a {{text}}." },
        { role: "user", content: "{{ask}}" },
    ], uitype: "llmprompts"
}, 'D_PROMPTS');
setOutputsUIType(_initInfo, "tagoutputs");
addResultWConnect(_initInfo, { label: "推理结果", type: "String", key: "answer", data: "" }, "output", "D_ANSWER");
addResultWConnect(_initInfo, { label: "LLM模型", type: "String", key: "model", data: "" }, "output", "D_MODEL");
addResultWConnect(_initInfo, { label: "输入Token", type: "Integer", key: "input_token", data: 0 }, "output", "D_IN_TOKEN");
addResultWConnect(_initInfo, { label: "输出Token", type: "Integer", key: "output_token", data: 0 }, "output", "D_OUT_TOKEN");

export const initInfo = cloneDeep(_initInfo);

export { NodeVue };