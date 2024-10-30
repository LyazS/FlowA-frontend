import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addRunningAttribute, addStateAttribute } from '../NodeOperator.js'
import { cloneDeep } from 'lodash';
import NodeVue from '../CommonNode/UnifiedNode.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addRunningAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.ntype = "text_input_node";
_initInfo.vtype = "UnifiedNode";
let _overwriteInfo = {
    size: {
        width: 80,
        height: 40,
    },
    connections: {
        output: [
            {
                id: "output",
                data: [
                    { type: "FromInner", path: ["payloads", 0] },
                ]
            },
        ],
    },
    payloads: [
        { id: "text", label: "内容", type: "String", data: "", uitype: "textcontent" },
    ],
}
Object.assign(_initInfo.data, _overwriteInfo);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };