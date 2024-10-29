const FullNodeInfo = {
    // 节点元数据 ==========
    id: "#TODO",  // 节点唯一标识
    type: "#TODO",    // 节点类型标识
    version: "1.0.0",      // 节点版本号
    data: {
        size: {
            width: -1,// #TODO
            height: -1,// #TODO
        },
        label: "#TODO",
        placeholderlabel: "#TODO",
        // 节点特性标记 ========
        flags: {              // 重构: 将独立的标记整合到flags对象
            isNested: false,    // 是否可嵌套
            isAttached: false,  // 是否为附属节点
            isDisabled: false,  // 是否禁用
        },
        // ======================================================
        min_size: {
            width: -1,// #TODO
            height: -1,// #TODO
        },
        nesting: {
            pad: {
                top: 70,
                bottom: 40,
                left: 60,
                right: 60,
            },
            attached_pad: {
                top: 35,
                bottom: 10,
                left: 16,
                right: 16,
            },// 嵌套固定节点边距
            attached_nodes: [
                // { node_key: "attached_node", attached_type: "input", pos: "top-left" },// top|center|bottom-left|center|right
            ],
        },
        // ========================================================
        attaching: {
            type: "input",
            pos: "top-left",
        },
        // ========================================================
        connections: {
            // 单一个输入handle，数组里每个元素表示使用哪些输入
            // 用filter来搜索出符合条件的第一个输入
            inputs: [
                // { nid: "节点id", oid: "节点的输出id" }
            ],
            callbackUsers: [],
            // 多个输出handle，数组里每个元素都是一个输出handle
            callbackFuncs: [],
            outputs: [
                // { id: "output", path: ["payloads", 0] },
            ],
        },
        // ========================================================
        payloads: [
            // { id: "text", label: "内容", type: "String", data: "", uitype: "textcontent" },
        ],
        results: [
            // { id: "text", label: "内容", type: "String", data: "", uitype: "textcontent" },
        ],
        // ========================================================
        // 节点状态与结果 ======
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
    },
};

export const BaseNodeInfo = {
    // 节点元数据 ==========
    id: "#TODO",  // 节点唯一标识
    type: "#TODO",    // 节点类型标识
    version: "1.0.0",      // 节点版本号
    data: {
        size: {
            width: -1,// #TODO
            height: -1,// #TODO
        },
        label: "#TODO",
        // 节点特性标记 ========
        flags: {              // 重构: 将独立的标记整合到flags对象
            isNested: false,    // 是否可嵌套
            isAttached: false,  // 是否为附属节点
            isDisabled: false,  // 是否禁用
        },
    }
};
const AttachedAttribute = {
    attaching: {
        type: "",
        pos: "",
    },
};
const NestedAttribute = {
    min_size: {
        width: 200,// #TODO
        height: 200,// #TODO
    },
    nesting: {
        pad: {
            top: 70,
            bottom: 40,
            left: 60,
            right: 60,
        },
        attached_pad: {
            top: 35,
            bottom: 10,
            left: 16,
            right: 16,
        },// 嵌套固定节点边距
        attached_nodes: [
            // { node_key: "attached_node", attached_type: "input", pos: "top-left" },// top|center|bottom-left|center|right
        ],
    }
}
const ConnectionsAttribute = {
    connections: {
        // 单一个输入handle，数组里每个元素表示使用哪些输入
        // 用filter来搜索出符合条件的第一个输入
        inputs: [
            // {
            //     id: "input", data: [
            //         { type:"FromOuter", nid: "节点id", oid: "节点的outputs数组的id", useid: ["节点id"] }
            //     ]
            // },
        ],
        callbackUsers: [],
        // 多个输出handle，数组里每个元素都是一个输出handle
        callbackFuncs: [],
        outputs: [
            // {
            //     id: "output", data: [
            //         { type:"FromInner", path: ["payloads", 0], useid: ["节点id"] },
            //         { type:"FromInner", path: ["results", 0], useid: ["节点id"] },
            //     ]
            // },
        ],
    }
}
const RunningAttribute = {
    payloads: [
        // { id: "text", label: "内容", type: "String", data: "", uitype: "textcontent" },
    ],
    results: [
        // { id: "text", label: "内容", type: "String", data: "" },
    ],
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
}
export const addAttachedAttribute = (nodeInfo) => {
    nodeInfo.data.flags.isAttached = true;
    Object.assign(nodeInfo.data, AttachedAttribute);
};
export const addNestedAttribute = (nodeInfo) => {
    nodeInfo.data.flags.isNested = true;
    Object.assign(nodeInfo.data, NestedAttribute);
};
export const addConnectionsAttribute = (nodeInfo) => {
    Object.assign(nodeInfo.data, ConnectionsAttribute);
};
export const addRunningAttribute = (nodeInfo) => {
    Object.assign(nodeInfo.data, RunningAttribute);
};
export const addStateAttribute = (nodeInfo) => {
    Object.assign(nodeInfo.data, StateAttribute);
};
