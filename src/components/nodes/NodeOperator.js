import { clone, cloneDeep } from "lodash";
import { getUuid } from "../../utils/tools.js"
const BaseNodeInfo = {
    // 节点元数据 ==========
    data: {
        ntype: "#TODO",  // 节点类型
        vtype: "#TODO",    // 节点使用的vue组件类型
        size: {
            width: -1,// #TODO
            height: -1,// #TODO
        },
        label: "#TODO",
        placeholderlabel: "#TODO",
        // 节点特性标记 ========
        flags: {              // 将独立的标记整合到flags对象
            isNested: false,    // 是否可嵌套
            isAttached: false,  // 是否为附属节点
            isDisabled: false,  // 是否禁用
        },
    }
};
const AttachedAttribute = {
    attaching: {
        type: "",// input/output/callbackFunc/callbackUser
        pos: "",// top|center|bottom-left|center|right
    },
};
const NestedAttribute = {
    min_size: {
        width: 200,// #TODO
        height: 200,// #TODO
    },
    nesting: {
        pad: {
            top: 60,
            bottom: 40,
            left: 60,
            right: 60,
        },
        attached_pad: {
            top: 30,
            bottom: 25,
            left: 17,
            right: 17,
        },// 嵌套固定节点边距
        attached_nodes: {
            // <atype>: { ntype: "attached_node", nid: "", apos: "top-left" },// top|center|bottom-left|center|right
        },
    }
}
const ConnectionsAttribute = {
    connections: {
        // 自身可用变量，默认存在
        self: {
            self: {
                label: "self",
                data: {}
            }
        },
        // 附属节点可用变量，默认存在
        attach: {
            attach: {
                label: "attach",
                data: {}
            }
        },
        // 单一个输入handle，数组里每个元素表示使用哪些输入
        inputs: {
            // input: {// 输入handle的id
            //     label: "输入1",
            //     data: {
            //         "idxxx-it": { type: "FromInner", path: ["payloads", "idxxx-pr"], useid: ["使用节点id"] },
            //         "idxxx-it": { type: "FromInner", path: ["results", "idxxx-pr"], useid: ["使用节点id"] },
            //     }
            // }
        },
        callbackUsers: {},
        // 多个输出handle，数组里每个元素都是一个输出handle
        callbackFuncs: {},
        outputs: {// 透传外部、内部变量、附属节点的链接
            // output: {// 输出handle的id
            //     label: "",
            //     data: {
            //         "idxxx-ot": { type: "FromOuter", inputKey: "input" },
            //         "idxxx-ot": { type: "FromAttached", atype: "output", useid: [] },
            //         "idxxx-ot": { type: "FromInner", path: ["payloads", "idxxx-pr"], useid: ["使用节点id"] },
            //         "idxxx-ot": { type: "FromInner", path: ["results", "idxxx-pr"], useid: ["使用节点id"] },
            //     }
            // }
        },
        // 用于设置节点输出的ui类型
        "outputs-uitype": "",// 【packoutputs】或者其他啥的
    }
}
const RunningAttribute = {
    payloads: {
        byId: {
            // "idxxx1-p": { label: "内容", type: "String", key: "text", data: "", uitype: "textcontent" },
            // "idxxx2-p": { label: "内容", type: "String", key: "text", data: "", uitype: "textcontent" },
        },
        order: [
            // "idxxx1-p",
            // "idxxx2-p"
        ]
    },
    results: {
        byId: {
            // "idxxx1-r": { type: "String", key: "text", data: "", hid: "output-1", oid: "idxxx1-ot" },
            // "idxxx2-r": { type: "String", key: "text", data: "", hid: "output-1", oid: "idxxx2-ot" },
        },
        order: [
            // "idxxx1-r",
            // "idxxx2-r"
        ]
    },
}
const StateAttribute = {
    state: {              // 节点状态
        isProcessing: false,
        error: null,
        lastUpdated: null
    },
    // 节点配置项 ==========
    config: {             // 节点级配置
        timeout: 30000,     // 执行超时时间
        retryAttempts: 0,   // 重试次数
        cacheResults: false // 是否缓存结果
    }
};

// 初始化函数
export const createBaseNodeInfo = () => {
    return cloneDeep(BaseNodeInfo);
};
export const initAttachedAttribute = (_BaseNodeInfo) => {
    _BaseNodeInfo.data.flags.isAttached = true;
    Object.assign(_BaseNodeInfo.data, cloneDeep(AttachedAttribute));
};
export const initNestedAttribute = (_BaseNodeInfo) => {
    _BaseNodeInfo.data.flags.isNested = true;
    Object.assign(_BaseNodeInfo.data, cloneDeep(NestedAttribute));
};
export const initConnectionsAttribute = (_BaseNodeInfo) => {
    Object.assign(_BaseNodeInfo.data, cloneDeep(ConnectionsAttribute));
};
export const initRunningAttribute = (_BaseNodeInfo) => {
    Object.assign(_BaseNodeInfo.data, cloneDeep(RunningAttribute));
};
export const initStateAttribute = (_BaseNodeInfo) => {
    Object.assign(_BaseNodeInfo.data, cloneDeep(StateAttribute));
};
export const initMinSize = (_BaseNodeInfo, width, height) => {
    _BaseNodeInfo.data.min_size.width = width;
    _BaseNodeInfo.data.min_size.height = height;
};
export const initSize = (_Node, width, height) => {
    _Node.data.size.width = width;
    _Node.data.size.height = height;
};
export const setNodeType = (_BaseNodeInfo, ntype) => {
    _BaseNodeInfo.data.ntype = ntype;
};
export const setVueType = (_BaseNodeInfo, vtype) => {
    _BaseNodeInfo.data.vtype = vtype;
};
export const setLabel = (_BaseNodeInfo, label) => {
    _BaseNodeInfo.data.label = label;
    _BaseNodeInfo.data.placeholderlabel = label;
};
export const addAttachedNode = (_BaseNodeInfo, ntype, atype, apos) => {
    _BaseNodeInfo.data.nesting.attached_nodes[atype] = { ntype, nid: null, apos };
};

// 节点数据操作函数 ==========
export const setOutputsUIType = (_Node, uitype) => {
    _Node.data.connections['outputs-uitype'] = uitype;
};
export const addHandle = (_Node, handletype, handleId, label = null) => {
    _Node.data.connections[handletype][handleId] = { label: label || handleId, data: {} };
};
export const rmHandle = (_Node, handletype, handleId) => {
    if (_Node.data.connections[handletype].hasOwnProperty(handleId)) {
        delete _Node.data.connections[handletype][handleId];
    }
};
export const addConnection = (_Node, handletype, handleId, ConnectData, cid = null) => {
    const _cid = cid || getUuid();
    if (!_Node.data.connections[handletype].hasOwnProperty(handleId)) {
        addHandle(_Node, handletype, handleId);
    }
    _Node.data.connections[handletype][handleId].data[_cid] = cloneDeep(ConnectData);
    return _cid;
};
export const rmConnection = (_Node, handletype, handleId, cid) => {
    if (_Node.data.connections[handletype].hasOwnProperty(handleId)
        && _Node.data.connections[handletype][handleId].data.hasOwnProperty(cid)) {
        delete _Node.data.connections[handletype][handleId].data[cid];
    }
};
export const addPayload = (_Node, payload) => {
    const pid = getUuid();
    _Node.data.payloads.byId[pid] = cloneDeep(payload);
    _Node.data.payloads.order.push(pid);
    return pid;
};
export const rmPayload = (_Node, pid) => {
    if (_Node.data.payloads.byId.hasOwnProperty(pid)) {
        delete _Node.data.payloads.byId[pid];
        _Node.data.payloads.order.splice(_Node.data.payloads.order.indexOf(pid), 1);
    }
};
export const addResultWConnect = (_Node, result, hid, rid = null, cid = null) => {
    const _rid = cloneDeep(rid) || getUuid();
    const oid = addConnection(_Node, "outputs", hid, { type: "FromInner", path: ["results", _rid], useid: [] }, cid);
    _Node.data.results.byId[_rid] = { ...cloneDeep(result), hid, oid };
    _Node.data.results.order.push(_rid);
    return _rid;
};
export const rmResultWConnect = (_Node, rid) => {
    if (_Node.data.results.byId.hasOwnProperty(rid)) {
        const hid = _Node.data.results.byId[rid].hid;
        const oid = _Node.data.results.byId[rid].oid;
        rmConnection(_Node, "outputs", hid, oid);
        delete _Node.data.results.byId[rid];
        _Node.data.results.order.splice(_Node.data.results.order.indexOf(rid), 1);
    }
};
export const clearResultsWConnect = (_Node) => {
    const tmp_rid = _Node.data.results.order.slice();
    tmp_rid.forEach(rid => {
        rmResultWConnect(_Node, rid);
    });
};
export const addResult = (_Node, result, rid = null) => {
    const _rid = cloneDeep(rid) || getUuid();
    _Node.data.results.byId[_rid] = cloneDeep(result);
    _Node.data.results.order.push(_rid);
    return _rid;
};
export const rmResult = (_Node, rid) => {
    if (_Node.data.results.byId.hasOwnProperty(rid)) {
        delete _Node.data.results.byId[rid];
        _Node.data.results.order.splice(_Node.data.results.order.indexOf(rid), 1);
    }
};