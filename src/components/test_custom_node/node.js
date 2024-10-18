import NodeVue from './node.vue';
export const initInfo = {
    name: "测试自定义节点",
    type: "test_custom_node",
    init_width: 100,
    init_height: 100,
    init_data: {
        // 必要参数 ========
        _is_nested: false,// 是否可嵌套
        _size: {
            width: -1,
            height: -1,
        },
        // =================
        // 可选参数
        // _is_fixed_child_in_nest: true,// 是否是嵌套节点中的固定子节点，会自动添加
        // =================
    },
};

export { NodeVue };