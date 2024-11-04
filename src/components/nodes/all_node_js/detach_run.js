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
    setSize,
    getSize,
    setAttachedAttribute,
    addHandle,
    addConnection,
    rmConnection,
    addPayload,
    addResult,
    rmPayload,
    rmResult,
} from '../NodeOperator.js'

import { add, cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/basenode.vue';

const _initInfo = createBaseNodeInfo();
initNestedAttribute(_initInfo);
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "detach_run");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "分离运行");
initSize(_initInfo, 150, 150);

// 嵌套节点只能添加一个handle
addHandle(_initInfo, "inputs", "input");
addHandle(_initInfo, "outputs", "output");
addHandle(_initInfo, "callbackUsers", "callbackUser");
addHandle(_initInfo, "callbackFuncs", "callbackFunc");

addAttachedNode(_initInfo, "attached_node", "input", "top-left");
addAttachedNode(_initInfo, "attached_node", "callbackUser", "top-right");
addAttachedNode(_initInfo, "attached_node", "output", "bottom-right");
addAttachedNode(_initInfo, "attached_node", "callbackFunc", "bottom-left");

addConnection(_initInfo, "outputs", "output", { type: "FromAttached", atype: "output", useid: [] });

export const initInfo = cloneDeep(_initInfo);
// 该节点需要实现，动态的handle和文字
export { NodeVue };