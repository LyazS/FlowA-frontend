import NodeVue from './node.vue';
export const initInfo = {
    node_key: "attached_node",
    node_type: "attached_node",
    init_width: 20,
    init_height: 6,
    init_data: {
        // 必要参数 ========
        _is_nested: false,// 是否可嵌套
        _is_attached: true,// 是否为附属节点
        size: {
            width: -1,
            height: -1,
        },
        label: "附属节点",
        // =================
        // 可选参数
        // attached_pos: "top-left",// 固定子节点在嵌套节点中的位置，会自动添加
        // attached_type: "callbackUser",// 附属节点类型，会自动添加
        // =================
    },
};

export { NodeVue };