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

addAttachedNode(_initInfo, "attached_node_input", "input", "top-left");
addAttachedNode(_initInfo, "attached_node_callbackUser", "callbackUser", "top-right");
addAttachedNode(_initInfo, "attached_node_output", "output", "bottom-right");
addAttachedNode(_initInfo, "attached_node_callbackFunc", "callbackFunc", "bottom-left");

setOutputsUIType(_initInfo, "tagoutputs");
addConnection(_initInfo, "attach", "attach", { type: "FromOuter", inputKey: "input" });
addConnection(_initInfo, "outputs", "output", { type: "FromAttached", atype: "output", useid: [] });

export const initInfo = cloneDeep(_initInfo);
// 该节点需要实现，动态的handle和文字
export { NodeVue };