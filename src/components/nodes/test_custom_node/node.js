import NodeVue from './node.vue';
export const initInfo = {
    name: "测试自定义节点",
    type: "test_custom_node",
    init_width: 100,
    init_height: 100,
    init_data: {
        // 必要参数 ========
        _is_nested: false,// 是否可嵌套
        _is_attached: false,// 是否为附属节点
        _size: {
            width: -1,
            height: -1,
        },
        // =================
        // 可选参数
        // =================
    },
};

export { NodeVue };