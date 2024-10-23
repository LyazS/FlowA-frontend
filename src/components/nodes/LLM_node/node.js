import NodeVue from '../UnifiedNode/node.vue';
export const initInfo = {
    node_key: "LLM_node",
    node_type: "UnifiedNode",
    init_width: 80,
    init_height: 40,
    init_data: {
        // 必要参数 ========
        _is_nested: false,// 是否可嵌套
        _is_attached: false,// 是否为附属节点
        _size: {
            width: -1,
            height: -1,
        },
        label: "LLM推理",
        // =================
        // 可选参数
        input: {},
        callbackFunc: {},
        callbackUser: {},
        output: {},
        // =================
    },
};

export { NodeVue };