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
        <!-- 隐藏用于测量的元素 -->
        <div ref="hiddenText" class="center-text hidden">
            {{ data.label }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount, onUnmounted, watch } from 'vue';
import { Position, Handle, useVueFlow } from '@vue-flow/core'
const { findNode } = useVueFlow();
const props = defineProps(['id', 'data'])
const thisnode = findNode(props.id);

const handle_h_pad = 1;
const handle_h_gap = 8;
const handle_text_edge_pad = 6;
const label_gap = 15;

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
const hiddenText = ref(null); // 隐藏测量元素的引用

onMounted(() => {
    if (!props.data.flags.isNested) {
        watch(() => [max_handles_top.value, max_handles_bottom.value], (newValues) => {
            const [newtop, newbottom] = newValues;
            const node_ht = 30 + (newtop + newbottom) * handle_h_gap;
            thisnode.style.height = `${node_ht}px`;
            thisnode.data.size.height = node_ht;
        }, { immediate: true })
        watch(() => props.data.label, async (newLabel) => {
            if (hiddenText.value && newLabel !== '') {
                const node_wd = hiddenText.value.offsetWidth + label_gap * 2;
                thisnode.style.width = `${node_wd}px`;
                thisnode.data.size.width = node_wd;
                // console.log(node_wd, newLabel);
            }
            await nextTick();
        }, { immediate: true })
        watch(() => thisnode.data.state.status, async (newStatus) => {
            if (newStatus === 'Default') {
                thisnode.class = 'node-status-default';
            }
            else if (newStatus === 'Pending') {
                thisnode.class = 'node-status-pending';
            }
            else if (newStatus === 'Running') {
                thisnode.class = 'node-status-running';
            }
            else if (newStatus === 'Success') {
                thisnode.class = 'node-status-success';
            }
            else if (newStatus === 'Canceled') {
                thisnode.class = 'node-status-canceled';
            }
            else if (newStatus === 'Error') {
                thisnode.class = 'node-status-error';
            }
        }, { immediate: true })

    }
    else { }
});
const testclick = () => {
    if (thisnode.data.state.status === 'Default') {
        thisnode.data.state.status = 'Pending';
    }
    else if (thisnode.data.state.status === 'Pending') {
        thisnode.data.state.status = 'Running';
    }
    else if (thisnode.data.state.status === 'Running') {
        thisnode.data.state.status = 'Success';
    }
    else if (thisnode.data.state.status === 'Success') {
        thisnode.data.state.status = 'Canceled';
    }
    else if (thisnode.data.state.status === 'Canceled') {
        thisnode.data.state.status = 'Error';
    }
    else if (thisnode.data.state.status === 'Error') {
        thisnode.data.state.status = 'Default';
    }
}
</script>

<style>
.node-status-default,
.node-status-pending,
.node-status-running,
.node-status-success,
.node-status-canceled,
.node-status-error {
    overflow: hidden;
}

.node-status-pending {
    background: linear-gradient(45deg,
            #2c3e50,
            #546e7a,
            #78909c,
            #546e7a,
            #2c3e50
        );
    background-size: 300% 300%;
    animation: emeraldWave 8s ease infinite;
}

.node-status-pending.selected,
.node-status-pending:hover {
    --color: #78909c;
    border: 2px solid var(--color);
    box-shadow: 0 0 10px var(--color),
        inset 0 0 3px 1px var(--color);
    transition: box-shadow 0.2s ease, border 0.2s ease;
}

.node-status-running {
    --c: #2196F3;
    --w1: radial-gradient(100% 57% at top, #0000 100%, var(--c) 100.5%) no-repeat;
    --w2: radial-gradient(100% 57% at bottom, var(--c) 100%, #0000 100.5%) no-repeat;
    background: var(--w1), var(--w2), var(--w1), var(--w2);
    background-position-x: -200%, -100%, 0%, 100%;
    background-position-y: 100%;
    background-size: 50.5% 100%;
    animation: wavewater 1s infinite linear;
}

@keyframes wavewater {
    0% {
        background-position-x: -200%, -100%, 0%, 100%
    }

    100% {
        background-position-x: 0%, 100%, 200%, 300%
    }
}

.node-status-running.selected,
.node-status-running:hover {
    --color: #2196F3d2;
    border: 2px solid var(--color);
    box-shadow: 0 0 10px var(--color),
        inset 0 0 3px 1px var(--color);
    transition: box-shadow 0.2s ease, border 0.2s ease;
}

.node-status-success {
    background: linear-gradient(45deg,
            #004d40,
            #00897b,
            #00bfa5,
            #00897b,
            #004d40);
    background-size: 300% 300%;
    animation: emeraldWave 8s ease infinite;
}

@keyframes emeraldWave {
    0% {
        background-position: 10% 50%;
    }

    50% {
        background-position: 90% 50%;
    }

    100% {
        background-position: 10% 50%;
    }
}

.node-status-success.selected,
.node-status-success:hover {
    --color: #00bfa5;
    border: 2px solid var(--color);
    box-shadow: 0 0 10px var(--color),
        inset 0 0 3px 1px var(--color);
    transition: box-shadow 0.2s ease, border 0.2s ease;
}

.node-status-canceled::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="20" fill="gray"/><text x="5" y="10" font-family="ui-monospace" font-size="3" fill="black" text-anchor="middle" dominant-baseline="middle" transform="translate(0, 0) rotate(90 5,10)">CANCELED</text></svg>');
    background-repeat: repeat;
    transform: translate(-50%, -50%) rotate(-135deg);
    animation: scrollBackground 60s linear infinite;
}

.node-status-canceled.selected,
.node-status-canceled:hover {
    --color: #5b5555;
    border: 2px solid var(--color);
    box-shadow: 0 0 10px var(--color),
        inset 0 0 3px 1px var(--color);
    transition: box-shadow 0.2s ease, border 0.2s ease;
}

.node-status-error::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="20" fill="red"/><text x="5" y="10" font-family="ui-monospace" font-size="4" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle" transform="translate(0, 0) rotate(90 5,10)">ERROR</text></svg>');
    background-repeat: repeat;
    transform: translate(-50%, -50%) rotate(-45deg);
    animation: scrollBackground 15s linear infinite, opacityBackground 3s cubic-bezier(.2, .06, .17, .98) infinite;
}

.node-status-error.selected,
.node-status-error:hover {
    --color: #e43d3a;
    border: 2px solid var(--color);
    box-shadow: 0 0 10px var(--color),
        inset 0 0 3px 1px var(--color);
    transition: box-shadow 0.2s ease, border 0.2s ease;
}

@keyframes scrollBackground {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 120px 400px;
    }
}

@keyframes opacityBackground {
    0% {
        opacity: 0.1;
    }

    50% {
        opacity: 0.9;
    }

    100% {
        opacity: 0.1;
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
    font-family: var(--font-mono);
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
    letter-spacing: 0.1px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    text-wrap: nowrap;
    left: 50%;
}

/* 隐藏用于测量的文字样式 */
.hidden {
    visibility: hidden;
    position: absolute;
    white-space: nowrap;
    pointer-events: none;
}
</style>