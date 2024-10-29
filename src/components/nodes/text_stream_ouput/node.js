import { BaseNodeInfo, addNestedAttribute, addConnectionsAttribute, addRunningAttribute, addStateAttribute } from '../CommonNode/BaseNode.js'
import { cloneDeep } from 'lodash';
import NodeVue from '../CommonNode/UnifiedNode.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addConnectionsAttribute(_initInfo);
_initInfo = addRunningAttribute(_initInfo);
_initInfo = addStateAttribute(_initInfo);
_initInfo.id = "text_steam_output";
_initInfo.type = "UnifiedNode";
_overwriteInfo = {
    size: {
        width: 80,
        height: 40,
    },
    connections: {
        inupt: [
            { id: "input", data: [] },
        ],
    },
}
Object.assign(_initInfo.data, _overwriteInfo);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };
