import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addRunningAttribute, addStateAttribute } from '../NodeOperator.js'
import { cloneDeep } from 'lodash';
import NodeVue from './node.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addRunningAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.ntype = "ifelse_node";
_initInfo.vtype = "ifelse_node";
let _overwriteInfo = {
    size: {
        width: 80,
        height: 80,
    },
    connections: {
        inputs: { input: {} },
        outputs: {
            "output-1": { "condition-1": { type: "FromOuter" } },
            "output-2": {},
            "output-3": {},
            "output-4": {},
            "output-5": {},
            "output-6": {},
        },
    },
    payloads: {
        byId: {
            "condition-1": { label: "是", type: "Condition", key: "Condition1", data: "func(==)", uitype: "select", outputId: "output-1" },
            "condition-2": { label: "不是", type: "Condition", key: "Condition2", data: "func(!=)", uitype: "select", outputId: "output-2" },
            "condition-3": { label: "大于", type: "Condition", key: "Condition3", data: "func(>)", uitype: "select", outputId: "output-3" },
            "condition-4": { label: "小于", type: "Condition", key: "Condition4", data: "func(<)", uitype: "select", outputId: "output-4" },
            "condition-5": { label: "大于等于", type: "Condition", key: "Condition5", data: "func(>=)", uitype: "select", outputId: "output-5" },
            "condition-6": { label: "小于等于", type: "Condition", key: "Condition6", data: "func(<=)", uitype: "select", outputId: "output-6" },
        },
        order: [
            // "idxxx1-p",
            // "idxxx2-p"
        ]
    },
};
Object.assign(_initInfo.data, _overwriteInfo);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
