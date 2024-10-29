import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addPayloadsAttribute, addStateAttribute } from '../CommonNode/BaseNode.js'
import { cloneDeep } from 'lodash';
import NodeVue from './node.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addPayloadsAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.id = "ifelse_node";
_initInfo.type = "ifelse_node";
_overwriteInfo = {
    size: {
        width: 80,
        height: 80,
    },
    connections: {
        input: [
            { id: "input", data: [] },
        ],
        output: [
            { id: "output-1", condition: "是", data: [] },
            { id: "output-2", condition: "不是", data: [] },
            { id: "output-3", condition: "包含", data: [] },
            { id: "output-4", condition: "不包含", data: [] },
            { id: "output-5", condition: "不包含", data: [] },
            { id: "output-6", condition: "不包含", data: [] },
            { id: "output-7", condition: "不包含", data: [] },
        ],
    },
}
Object.assign(_initInfo.data, _overwriteInfo);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
