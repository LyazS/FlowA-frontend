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
setNodeType(_initInfo, "http_requests");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "网络请求");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input");
addHandle(_initInfo, "outputs", "output");
addHandle(_initInfo, "callbackUsers", "callbackUser");
addHandle(_initInfo, "callbackFuncs", "callbackFunc");

addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input" });

addPayload(_initInfo, {
    label: "输入变量", type: "VarsInput", key: "inputvars", data: [
        { key: "text", type: "value", value: "good assistant" },
        { key: "ask", type: "value", value: "hi" },
    ], uitype: "vars_input"
});

addPayload(_initInfo, {
    label: "配置", type: "RequestConfig", key: "request", data: {
        method: "GET",
        url: "https://api.example.com/users",
        headers: [
            { key: "Content-Type", value: "application/json" },
            { key: "Authorization", value: "Bearer ???" }
        ],
        queryParams: [
            { key: "page", value: 1 },
            { key: "limit", value: 10 }
        ],
        body: {
            type: "json",
            content: {}
        },
        cookies: [
            { key: "session", value: "abc123" }
        ]
    }, uitype: "httprequests"
});

setOutputsUIType(_initInfo, "tagoutputs");
addResultWConnect(_initInfo, { label: "请求状态", type: "String", key: "answer", data: "" }, "output", "D_STATUS");
addResultWConnect(_initInfo, { label: "请求结果", type: "Dict", key: "answer", data: {} }, "output", "D_RESPONSE");

export const initInfo = cloneDeep(_initInfo);

export { NodeVue };