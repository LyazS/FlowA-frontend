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
setNodeType(_initInfo, "cond_branch");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "条件分支");
initSize(_initInfo, 80, 80);

addHandle(_initInfo, "inputs", "input-cond", "CONDITION");
addHandle(_initInfo, "inputs", "input-var", "VARIABLE");
addHandle(_initInfo, "outputs", "output-else", "0/ELSE");

addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input-cond" });

setOutputsUIType(_initInfo, "condoutputs");
addConnection(_initInfo, "outputs", "output-else", { type: "FromOuter", inputKey: "input-var" });
addResult(_initInfo, { "label": "其他", "type": "ConditionDict", "key": "cond-else", "data": {} });

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };