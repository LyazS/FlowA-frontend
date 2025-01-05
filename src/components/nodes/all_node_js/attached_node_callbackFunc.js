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
import { nodeFlags } from '@/utils/schemas'

import { cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/attached_node.vue';

const _initInfo = createBaseNodeInfo();
initAttachedAttribute(_initInfo);
initNodeFlag(_initInfo, nodeFlags.isAttached);
setNodeType(_initInfo, "attached_node_callbackFunc");
setVueType(_initInfo, "attached_node");
setLabel(_initInfo, "附属节点");
setAttaching(_initInfo, "callbackFunc", "bottom-left", "CB-FUN");
initSize(_initInfo, 20, 6);

initConnectionsAttribute(_initInfo);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
