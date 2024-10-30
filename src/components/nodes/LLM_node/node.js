import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addRunningAttribute, addStateAttribute } from '../NodeOperator.js'
import { cloneDeep } from 'lodash';
import NodeVue from '../CommonNode/UnifiedNode.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addRunningAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.ntype = "LLM_node";
_initInfo.vtype = "UnifiedNode";
let _overwriteInfo = {
    size: {
        width: 80,
        height: 40,
    },
    connections: {
        inupt: [
            { id: "input", data: [] },
        ],
        output: [
            {
                id: "output",
                data: [
                    { type: "FromInner", path: ["results", 0] },
                ]
            },
        ],
    },
    results: [
        { id: "text", label: "结果", type: "String", data: "" },
    ],
}
Object.assign(_initInfo.data, _overwriteInfo);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };