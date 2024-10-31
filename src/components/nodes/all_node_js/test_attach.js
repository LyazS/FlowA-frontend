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
import NodeVue from './attached_node.vue';

const _initInfo = cloneDeep(BaseNodeInfo);
initAttachedAttribute(_initInfo);
setNodeType(_initInfo, "attached_node");
setVueType(_initInfo, "attached_node");
setLabel(_initInfo, "附属节点");
initSize(_initInfo, 20, 6);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
// 该节点需要实现，动态的handle和文字