import NodeVue from './node.vue';
export const initInfo = {
    name: "文本输入",
    type: "text_input_node",
    init_width: 100,
    init_height: 50,
    init_data: {
        // 必要参数 ========
        _is_nested: false,// 是否可嵌套
        _is_attached: false,// 是否为附属节点
        _size: {
            width: -1,
            height: -1,
        },
        input: {},
        callback: {},
        output: {},
        // =================
        // 可选参数
        // =================
    },
};

export { NodeVue };