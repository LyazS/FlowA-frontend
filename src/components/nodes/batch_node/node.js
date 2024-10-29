import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addPayloadsAttribute, addStateAttribute } from '../CommonNode/BaseNode.js'
import { cloneDeep } from 'lodash';
import NodeVue from '../CommonNode/NestedNode.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addNestedAttribute(_initInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addPayloadsAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.id = "batch_node";
_initInfo.type = "NestedNode";
_overwriteInfo = {
    flags: {
        isNested: true,
    },
    size: {
        width: 200,
        height: 200,
    },
    connections: {
        input: [
            { id: "input", data: [] },
        ],
        output: [
            { id: "output", data: [] },
        ],
    },
    nesting: {
        attached_nodes: [
            { node_key: "attached_node", attached_type: "input", pos: "top-left" },// top|center|bottom-left|center|right
            { node_key: "attached_node", attached_type: "callbackUser", pos: "top-right" },
            { node_key: "attached_node", attached_type: "output", pos: "bottom-right" },
            { node_key: "attached_node", attached_type: "callbackFunc", pos: "bottom-left" },
        ]
    }
}
Object.assign(_initInfo.data, _overwriteInfo);
export const initInfo = cloneDeep(_initInfo);

export { NodeVue };