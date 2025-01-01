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
        { key: "query", type: "String", value: "say" },
        { key: "ask", type: "String", value: "hi" },
        { key: "token", type: "String", value: "xxx" },
        { key: "cooker", type: "String", value: "yyy" },
    ],
    config: { instance: { key: "", type: "ref", value: "" } },
    uitype: "vars_input",
}, 'D_VARSINPUT');

addPayload(_initInfo, {
    label: "网络配置", type: "HttpRequestConfig", key: "request", data: {
        method: "GET",
        url: "https://api.example.com?{{query}}={{ask}}",
        headers: [
            { key: "Authorization", value: "Bearer {{token}}" }
        ],
        body: {
            type: "none",// none|json|text|form_data|x_www_form_urlencoded
            content1: "",// json|text
            content2: [
                // { key: "", value: "" },
            ],// x-www-form-urlencoded
            content3: [
                // { key: "", type: "File", value: "" },// String|File
            ],// form-data
        },
        cookies: [
            { key: "cook", value: "{{cooker}}" }
        ],
    }, uitype: "httprequests"
}, 'D_CONFIG');
addPayload(_initInfo, {
    label: "超时配置", type: "HttpTimeoutConfig", key: "timeout", data: {
        connect: 3,
        read: 10,
        write: 5,
    }, uitype: "httptimeout"
}, 'D_TIMEOUT');

setOutputsUIType(_initInfo, "tagoutputs");
addResultWConnect(_initInfo, { label: "返回状态", type: "String", key: "status_code", data: "" }, "output", "DR_STATUS");
addResultWConnect(_initInfo, { label: "返回头", type: "List", key: "header", data: [] }, "output", "DR_HEADER");
addResultWConnect(_initInfo, { label: "返回Cookie", type: "List", key: "cookie", data: [] }, "output", "DR_COOKIE");
addResultWConnect(_initInfo, { label: "返回类型", type: "String", key: "content_type", data: [] }, "output", "DR_CONTENTTYPE");
addResultWConnect(_initInfo, { label: "返回结果", type: "String", key: "response", data: "" }, "output", "DR_RESPONSE");

export const initInfo = cloneDeep(_initInfo);

export { NodeVue };