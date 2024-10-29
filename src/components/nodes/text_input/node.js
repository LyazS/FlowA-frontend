import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addPayloadsAttribute, addStateAttribute } from '../CommonNode/BaseNode.js'
import { cloneDeep } from 'lodash';
import NodeVue from '../CommonNode/UnifiedNode.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addPayloadsAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.id = "text_input_node";
_initInfo.type = "UnifiedNode";
_overwriteInfo = {
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