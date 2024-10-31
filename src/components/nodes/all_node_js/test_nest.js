import {
    BaseNodeInfo,
    initAttachedAttribute,
    initNestedAttribute,
    initConnectionsAttribute,
    initRunningAttribute,
    initStateAttribute,
    setNodeType,
    setVueType,
    setLabel,
    addAttachedNode,
    initMinSize,
    initSize,
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

import { cloneDeep } from 'lodash';
import NodeVue from './basenode.vue';

const _initInfo = cloneDeep(BaseNodeInfo);
initNestedAttribute(_initInfo);
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "test_nest");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "测试嵌套节点");
initSize(_initInfo, 200, 200);

// 嵌套节点只能添加一个handle
addHandle(_initInfo, "inputs", "input");
addHandle(_initInfo, "outputs", "output");
addHandle(_initInfo, "callbackUsers", "callbackUser");
addHandle(_initInfo, "callbackFuncs", "callbackFunc");

addAttachedNode(_initInfo, "attached_node", "input", "top-left");
addAttachedNode(_initInfo, "attached_node", "callbackUser", "top-right");
addAttachedNode(_initInfo, "attached_node", "output", "bottom-right");
addAttachedNode(_initInfo, "attached_node", "callbackFunc", "bottom-left");

export const initInfo = cloneDeep(_initInfo);
// 该节点需要实现，动态的handle和文字
export { NodeVue };