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
} from '../NodeOperator.js'

import { cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/basenode.vue';

const _initInfo = createBaseNodeInfo();
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "text_print");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "文本输出");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input");
addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input" });
addPayload(_initInfo, { label: "内容", type: "ArrayString", key: "text", data: [], uitype: "textprint" });

export const initInfo = cloneDeep(_initInfo);

export { NodeVue };