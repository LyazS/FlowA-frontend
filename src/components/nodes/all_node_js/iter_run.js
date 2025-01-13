import {
    createBaseNodeInfo,
    initNodeFlag,
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
import { nodeFlags } from '@/utils/schemas'

import { add, cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/basenode.vue';

const _initInfo = createBaseNodeInfo();
initNodeFlag(_initInfo, nodeFlags.isTask | nodeFlags.isNested);
initNestedAttribute(_initInfo, "ITER");
initConnectionsAttribute(_initInfo);
initRunningAttribute(_initInfo);
initStateAttribute(_initInfo);
setNodeType(_initInfo, "iter_run");
setVueType(_initInfo, "basenode");
setLabel(_initInfo, "迭代运行");
initSize(_initInfo, 200, 200);

// 嵌套节点只能添加一个handle
addHandle(_initInfo, "inputs", "input");
addHandle(_initInfo, "outputs", "output");
addHandle(_initInfo, "callbackUsers", "callbackUser");
addHandle(_initInfo, "callbackFuncs", "callbackFunc");

addAttachedNode(_initInfo, "attached_node_input");
addAttachedNode(_initInfo, "attached_node_callbackUser");
addAttachedNode(_initInfo, "attached_node_output");
addAttachedNode(_initInfo, "attached_node_next");
addAttachedNode(_initInfo, "attached_node_callbackFunc");

addConnection(_initInfo, "self", "self", { type: "FromOuter", inputKey: "input" });
addConnection(_initInfo, "self", "attach_output", { type: "FromAttached", atype: "attached_node_output", useid: [] });
addConnection(_initInfo, "next", "next", { type: "FromAttached", atype: "attached_node_next", useid: [] });

addPayload(_initInfo, { label: "迭代数组", type: "List", key: "iter_list", data: "", uitype: "iter_input" }, 'D_ITERLIST');
let pid = addPayload(_initInfo, { label: "迭代索引", type: "IterIndex", key: "iter_index", data: null, uitype: "texttag" });
addConnection(_initInfo, "attach", "attach", { type: "FromInner", path: ["payloads", pid], useid: [] });
pid = addPayload(_initInfo, { label: "迭代项目", type: "IterItem", key: "iter_item", data: null, uitype: "texttag" });
addConnection(_initInfo, "attach", "attach", { type: "FromInner", path: ["payloads", pid], useid: [] });
addConnection(_initInfo, "attach", "attach", { type: "FromOuter", inputKey: "input" });

setOutputsUIType(_initInfo, "packoutputs");

export const initInfo = cloneDeep(_initInfo);

export { NodeVue };