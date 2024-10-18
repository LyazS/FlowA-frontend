import NodeVue from './node.vue';
export const initInfo = {
    name: "测试子节点",
    type: "test_child_node",
    init_width: 30,
    init_height: 30,
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
        // _fixed_position_in_nest: "top-left",// 固定子节点在嵌套节点中的位置，会自动添加
        // =================
    },
};

export { NodeVue };