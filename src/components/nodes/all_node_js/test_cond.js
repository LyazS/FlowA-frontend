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

import { cloneDeep } from 'lodash';
import NodeVue from './basenode.vue';

const _initInfo = createBaseNodeInfo();
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "test_cond");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "测试条件分支");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input9");
addHandle(_initInfo, "outputs", "output-1", "条件1");
addHandle(_initInfo, "outputs", "output-2", "条件2");
addHandle(_initInfo, "outputs", "output-3", "条件3");

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
// 该节点需要实现，动态的handle和文字