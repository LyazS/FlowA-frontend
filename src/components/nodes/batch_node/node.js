import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addRunningAttribute, addStateAttribute } from '../NodeOperator.js'
import { cloneDeep } from 'lodash';
import NodeVue from '../CommonNode/NestedNode.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addNestedAttribute(_initInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addRunningAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.ntype = "batch_node";
_initInfo.vtype = "NestedNode";
let _overwriteInfo = {
    flags: {
        isNested: true,
    },
    size: {
        width: 200,
        height: 200,
    },
    connections: {
        inputs: { input: {} },
        outputs: { output: {} },
    },
    nesting: {
        attached_nodes: [
            { ntype: "attached_node", atype: "input", apos: "top-left" },// top|center|bottom-left|center|right
            { ntype: "attached_node", atype: "callbackUser", apos: "top-right" },
            { ntype: "attached_node", atype: "output", apos: "bottom-right" },
            { ntype: "attached_node", atype: "callbackFunc", apos: "bottom-left" },
        ]
    }
}
Object.assign(_initInfo.data, _overwriteInfo);
export const initInfo = cloneDeep(_initInfo);

export { NodeVue };