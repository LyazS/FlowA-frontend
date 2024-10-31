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
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "test");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "测试字数补丁");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input-1");
addHandle(_initInfo, "inputs", "input-2");
addHandle(_initInfo, "inputs", "input-3");
addHandle(_initInfo, "outputs", "output-1");
addHandle(_initInfo, "outputs", "output-2");
addHandle(_initInfo, "outputs", "output-3");
addHandle(_initInfo, "callbackUsers", "callbackUser-1");
addHandle(_initInfo, "callbackUsers", "callbackUser-2");
addHandle(_initInfo, "callbackUsers", "callbackUser-3");
addHandle(_initInfo, "callbackFuncs", "callbackFunc-1");
addHandle(_initInfo, "callbackFuncs", "callbackFunc-2");
addHandle(_initInfo, "callbackFuncs", "callbackFunc-3");

const pid = addPayload(_initInfo, { id: 123 });
const rid = addResult(_initInfo, { id: 321 }, "output-1");
console.log("add payload and result", JSON.stringify(_initInfo, null, 2));
rmResult(_initInfo, rid);
rmPayload(_initInfo, pid);
console.log("remove payload and result", JSON.stringify(_initInfo, null, 2));

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
// 该节点需要实现，动态的handle和文字