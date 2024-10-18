import NodeVue from './node.vue';
export const initInfo = {
    name: "测试嵌套节点",
    type: "test_nested_node",
    init_width: 200,
    init_height: 150,
    init_data: {
        // 必要参数 ========
        _is_nested: true,// 是否可嵌套
        _is_attached: false,// 是否为附属节点
        _size: {
            width: -1,
            height: -1,
        },// 会在创建时自动应用init_width和init_height
        // =================
        // 可选参数
        _min_size: {
            width: 200,
            height: 150,
        },// 最小尺寸
        _nested_edge_gap: {
            top: 70,
            bottom: 40,
            left: 60,
            right: 60,
        },// 嵌套节点边距
        _fixed_nested_edge_gap: {
            top: 45,
            bottom: 30,
            left: 20,
            right: 20,
        },// 嵌套固定节点边距
        _fixed_nested_nodes: [
            { type: "test_attached_node", position: "top-left" },// top|center|bottom-left|center|right
            { type: "test_attached_node", position: "top-center" },
            { type: "test_attached_node", position: "bottom-right" },
        ],// 固定嵌套节点，会自动给子节点data添加"_is_fixed_child_in_nest=true"，同时设置为不可拖动

        // =================
    },
};

export { NodeVue };