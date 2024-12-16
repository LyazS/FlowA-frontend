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
    addResult,
    setOutputsUIType,
} from '../NodeOperator.js'

import { cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/basenode.vue';

const _initInfo = createBaseNodeInfo();
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "branch_aggregate");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "分支聚合");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input");
addHandle(_initInfo, "outputs", "output");

addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input" });
addPayload(_initInfo, {
    label: "聚合分支", type: "AggregateBranch", key: "branches", data: [
        // { node: "1/1", refdata: "" },
        // { node: "2/2", refdata: "" },
    ], uitype: "aggregatebranch"
}, "D_BRANCHES");

addResultWConnect(_initInfo, { label: "输出变量", type: null, key: "output", data: null }, "output", "D_OUTPUT");
setOutputsUIType(_initInfo, "tagoutputs");
export const initInfo = cloneDeep(_initInfo);
export { NodeVue };