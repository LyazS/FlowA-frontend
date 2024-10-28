import NodeVue from './node.vue';
export const initInfo = {
    node_key: "ifelse_node",
    node_type: "ifelse_node",
    init_width: 80,
    init_height: 70,
    init_data: {
        // 必要参数 ========
        _is_nested: false,// 是否可嵌套
        _is_attached: false,// 是否为附属节点
        size: {
            width: -1,
            height: -1,
        },
        label: "条件分支",
        connections: {
            input: [],
            // callbackFunc: [],
            callbackUser: [],
            output: [
                { id: "output-1", condition: "是" },
                { id: "output-2", condition: "不是" },
                { id: "output-3", condition: "包含" },
                { id: "output-4", condition: "不包含" },
                { id: "output-5", condition: "不包含" },
                { id: "output-6", condition: "不包含" },
                { id: "output-7", condition: "不包含" },
            ],
        },
        payloads: [],
        // =================
        // 可选参数
        // =================
    },
};

export { NodeVue };