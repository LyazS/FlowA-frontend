import NodeVue from './node.vue';
export const nodename = "testnode";
export function initNodeFunc() {
    const type_name = nodename;
    const init_width = 250;
    const init_height = 200;
    const init_data = {};

    return {
        type_name,
        init_width,
        init_height,
        init_data,
    }
}

export { NodeVue };