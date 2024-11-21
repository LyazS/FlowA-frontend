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
    setAttaching,
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
import NodeVue from '../all_node_vue/attached_node.vue';

const _initInfo = createBaseNodeInfo();
initAttachedAttribute(_initInfo);
setNodeType(_initInfo, "attached_node_input");
setVueType(_initInfo, "attached_node");
setLabel(_initInfo, "附属节点");
setAttaching(_initInfo, "input", "top-left", "INPUT");
initSize(_initInfo, 20, 6);

initConnectionsAttribute(_initInfo);
// 在output里加一个，去搜索父节点
addHandle(_initInfo, "outputs", "output");
addConnection(_initInfo, "outputs", "output", { type: "FromParent" });

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
// 该节点需要实现，动态的handle和文字