<template>
    <div :style="{ width: '100%', height: '100%', position: 'relative' }">
        <template v-for="(handle, index) in inputHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-input" type="target" :position="Position.Left" :style="{
                top: `${handle_h_pad + index * handle_h_gap}px`, left: `${handle_h_pad}px`, transform: 'translateY(0)'
            }" />
            <div class="corner-text" :style="{
                top: `${handle_h_pad + index * handle_h_gap}px`, left: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>

        <template v-for="(handle, index) in outputHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-output" type="source" :position="Position.Right" :style="{
                top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap}px`, right: `${handle_h_pad}px`, transform: 'translateY(0)'
            }" />
            <div class="corner-text" :style="{
                top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap - 1.5}px`, right: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>

        <template v-for="(handle, index) in cbuserHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-callbackUser" type="source" :position="Position.Right"
                :style="{
                    top: `${handle_h_pad + index * handle_h_gap}px`, right: `${handle_h_pad}px`, transform: 'translateY(0)'
                }" />
            <div class="corner-text" :style="{
                top: `${handle_h_pad + index * handle_h_gap}px`, right: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>

        <template v-for="(handle, index) in cbfuncHandles" :key="handle.key">
            <Handle :id="handle.key" class="vue-flow__handle-callbackFunc" type="target" :position="Position.Left"
                :style="{
                    top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap}px`, left: `${handle_h_pad}px`, transform: 'translateY(0)'
                }" />
            <div class="corner-text" :style="{
                top: 'auto', bottom: `${handle_h_pad + index * handle_h_gap - 1.5}px`, left: `${handle_h_pad + handle_text_edge_pad}px`, transform: 'translateY(0)'
            }">
                {{ handle.label }}
            </div>
        </template>

        <div class="center-text" @click="testclick"
            :style="{ top: `${center_text_pos.top}px`, transform: `translate(-50%, ${center_text_pos.trfY}%)` }">
            {{ data.label }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle, useVueFlow } from '@vue-flow/core'
const { findNode } = useVueFlow();
const props = defineProps(['id', 'data'])
const thisnode = findNode(props.id);

const handle_h_pad = 1;
const handle_h_gap = 8;
const handle_text_edge_pad = 6;

const inputHandles = computed(() => {
    return Object.entries(props.data.connections.inputs)
        .map(([key, value]) => ({ key, label: value.label }))
        .sort((a, b) => a.key.localeCompare(b.key));
});

const outputHandles = computed(() => {
    const pattern = /^\d+\/[^/]*$/;
    // 先对数据进行排序
    const sortedEntries = Object.entries(props.data.connections.outputs)
        .sort(([aKey, aValue], [bKey, bValue]) => {
            if (pattern.test(aValue.label) && pattern.test(bValue.label)) {
                const a_num = parseInt(aValue.label.split('/')[0]);
                const b_num = parseInt(bValue.label.split('/')[0]);
                return b_num - a_num;
            } else {
                return aKey.localeCompare(bKey);
            }
        });

    // 然后对排序后的数据进行映射
    return sortedEntries.map(([key, value]) => {
        if (pattern.test(value.label)) {
            return { key, label: value.label.split('/')[1] };
        }
        else {
            return { key, label: value.label };
        }
    });
});

const cbfuncHandles = computed(() => {
    return Object.entries(props.data.connections.callbackFuncs)
        .map(([key, value]) => ({ key, label: value.label }))
        .sort((a, b) => a.key.localeCompare(b.key));
});

const cbuserHandles = computed(() => {
    return Object.entries(props.data.connections.callbackUsers)
        .map(([key, value]) => ({ key, label: value.label }))
        .sort((a, b) => a.key.localeCompare(b.key));
});

const max_handles_top = computed(() => {
    return Math.max(inputHandles.value.length, cbuserHandles.value.length);
});
const max_handles_bottom = computed(() => {
    return Math.max(outputHandles.value.length, cbfuncHandles.value.length);
});
const center_text_pos = computed(() => {
    if (props.data.flags.isNested)
        return { top: 0, trfY: 0 }
    else
        return { top: handle_h_pad + max_handles_top.value * handle_h_gap + 10, trfY: -50 };
});

onMounted(() => {
    if (!props.data.flags.isNested) {
        watch(() => [max_handles_top.value, max_handles_bottom.value], (newValues) => {
            const [newtop, newbottom] = newValues;
            const node_ht = 30 + (newtop + newbottom) * handle_h_gap;
            thisnode.style.height = `${node_ht}px`;
            thisnode.data.size.height = node_ht;
        }, { immediate: true })
    }
    else { }
});
const testclick = () => {
    if (thisnode.data.state.status === 'Default') {
        thisnode.data.state.status = 'Error';
        thisnode.class = 'node-status-error';
    }
    else {
        thisnode.data.state.status = 'Default';
        thisnode.class = 'node-status-default';
    }
}
</script>

<style>
.node-status-default {}

.node-status-success {}

.node-status-pending {}

.node-status-running {}

.node-status-canceled {}

.node-status-error {
    background: linear-gradient(45deg, #f8312fd2 25%, transparent 25%, transparent 50%, #f8312fd2 50%, #f8312fd2 75%, transparent 75%, transparent);
    background-size: 20px 20px;
    animation: wave 1s linear infinite;
}

.node-status-error.selected {
    border: 2px solid #f8312f;
}

@keyframes wave {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 20px 0;
    }
}
</style>
<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: transparent;
}

.corner-text {
    text-transform: uppercase;
    font-size: 4px;
    color: white;
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    display: flex;
    align-items: flex-end;
    text-align: center;
}

.center-text {
    font-size: 12px;
    color: white;
    font-family: 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', monospace;
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    text-wrap: nowrap;
    left: 50%;
}
</style>