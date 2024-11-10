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
    setOutputsUIType,
} from '../NodeOperator.js'

import { cloneDeep } from 'lodash';
import NodeVue from '../all_node_vue/basenode.vue';

const _initInfo = createBaseNodeInfo();
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
// addHandle(_initInfo, "outputs", "output-2");
// addHandle(_initInfo, "outputs", "output-3");
addHandle(_initInfo, "callbackUsers", "callbackUser-1");
addHandle(_initInfo, "callbackUsers", "callbackUser-2");
addHandle(_initInfo, "callbackUsers", "callbackUser-3");
addHandle(_initInfo, "callbackFuncs", "callbackFunc-1");
addHandle(_initInfo, "callbackFuncs", "callbackFunc-2");
addHandle(_initInfo, "callbackFuncs", "callbackFunc-3");

// let pid = addPayload(_initInfo, { id: 123 });
// let rid = addResult(_initInfo, { id: 321 }, "output-1");
// console.log("add payload and result", JSON.stringify(_initInfo, null, 2));
// rmResult(_initInfo, rid);
// rmPayload(_initInfo, pid);
// console.log("remove payload and result", JSON.stringify(_initInfo, null, 2));

let pid = addPayload(_initInfo, { label: "Python 代码", type: "String", key: "text1", data: "import numpy as np\nimport cv2\n#your code here\n", uitype: "codeeditor" });
addConnection(_initInfo, "outputs", "output-1", { type: "FromInner", path: ["payloads", pid], useid: [] })

let rid = addResultWConnect(_initInfo, { type: "String", key: "text2", data: "", canEdit: false }, "output-1", "text2");
// console.log("init payload and result", JSON.stringify(_initInfo, null, 2));

export const initInfo = cloneDeep(_initInfo);
// 该节点需要实现，动态的handle和文字
export { NodeVue };