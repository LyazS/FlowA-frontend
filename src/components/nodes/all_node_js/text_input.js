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
    addResult,
    rmPayload,
    rmResult,
    setOutputsUIType,
} from '../NodeOperator.js'

import { cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/basenode.vue';

const _initInfo = createBaseNodeInfo();
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "text_input");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "文本输入");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "outputs", "output");

let pid = addPayload(_initInfo, { label: "内容", type: "String", key: "text", data: "", uitype: "textinput" });
addConnection(_initInfo, "outputs", "output", { type: "FromInner", path: ["payloads", pid], useid: [] })
setOutputsUIType(_initInfo, "tagoutputs");


export const initInfo = cloneDeep(_initInfo);
// 该节点需要实现，动态的handle和文字
export { NodeVue };