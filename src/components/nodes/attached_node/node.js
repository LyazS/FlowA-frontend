import { BaseNodeInfo, addAttachedAttribute } from '../CommonNode/BaseNode.js'
import { cloneDeep } from 'lodash';
import NodeVue from './node.vue';

let _initInfo = cloneDeep(BaseNodeInfo);
_initInfo = addAttachedAttribute(_initInfo);
_initInfo.id = "attached_node"
_initInfo.type = "attached_node"
_overwriteInfo = {
    flags: {
        isAttached: true,
    },
    size: {
        width: 20,
        height: 6,
    },
}
Object.assign(_initInfo.data, _overwriteInfo);

export const initInfo = cloneDeep(_initInfo);
export { NodeVue };