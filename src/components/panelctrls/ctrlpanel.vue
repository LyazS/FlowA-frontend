<script setup>
import { computed, provide, ref, h, watch, inject, onMounted, onUnmounted, nextTick } from 'vue';
import {
    useMessage,
    useDialog,
    darkTheme,
    NConfigProvider,
    NMessageProvider,
    NCard,
    NButton,
    NButtonGroup,
    NDropdown,
    NInput,
    NFlex,
    NIcon,
    NEllipsis,
} from 'naive-ui';
import { Add, CaretDown } from '@vicons/ionicons5'
import { useVueFlow } from '@vue-flow/core'
import { useVFlowManagement } from '@/hooks/useVFlowManagement';
import { useVFlowInitial } from '@/hooks/useVFlowInitial'
import { useFlowAOperation } from '@/services/useFlowAOperation'
import { setValueByPath } from "@/utils/tools"

const {
    TaskID,
    WorkflowID,
    WorkflowName,
    runflow,
    createNewWorkflow,
    isEditorMode,
    returnEditorMode,
} = useFlowAOperation();
const message = useMessage();
const dialog = useDialog()
const isEditing = inject("isEditing");

const {
    buildNestedNodeGraph,
    resetNodeState,
} = useVFlowManagement()
const { reBuildCounter } = useVFlowInitial()

const { getNodes, toObject, fromObject, findNode, removeNodes } = useVueFlow()

const isShowWFCreator = inject("isShowWFCreator");
const isShowWFRename = inject("isShowWFRename");
const isShowFlowResults = inject("isShowFlowResults");

const run_loading = ref(false)
const click2runflow = async () => {
    const res = await runflow(
        {
            before: async () => {
                run_loading.value = true;
                console.log("before run");
            },
            success: (data) => {
                console.log("success run");
                run_loading.value = false;
                if (data.success) {
                    message.success('已发送运行');
                }
                else {
                    message.error(`工作流验证失败，请检查`);
                }
            },
            error: (err) => {
                run_loading.value = false;
                message.error(`运行失败: ${err}`)
            },
        },
    );
    console.log(res);
}
const startOptions = [
    {
        label: '运行',
        key: 'run_workflow'
    },
    {
        label: '新建',
        key: 'new_workflow',
    },
    {
        label: '重命名',
        key: 'rename_workflow'
    },
]
const handleSelect = (key) => {
    if (key === 'run_workflow') {
        click2runflow();
    }
    else if (key === 'new_workflow') {
        isShowWFCreator.value = true;
    }
    else if (key === 'rename_workflow') {
        isShowWFRename.value = true;
    }
}
</script>

<template>
    <n-flex justify="flex-end">
        <n-button quaternary type="primary" style="min-width: 200px;" @click="isShowFlowResults = true">
            <n-ellipsis v-if="WorkflowName" style="max-width: 240px">
                {{ WorkflowName }}
            </n-ellipsis>
            <n-ellipsis v-else style="max-width: 240px">
                工作流管理器
            </n-ellipsis>
        </n-button>
        <template v-if="isEditorMode">
            <n-dropdown placement="bottom-start" trigger="hover" size="small" :options="startOptions"
                @select="handleSelect">
                <n-button class="glow-btn" circle secondary type="success">
                    <template #icon>
                        <n-icon>
                            <CaretDown />
                        </n-icon>
                    </template>
                </n-button>
            </n-dropdown>
        </template>
        <template v-else>
            <n-button class="glow-btn" strong tertiary round type="success" @click="returnEditorMode">返回编辑模式</n-button>
        </template>
    </n-flex>

</template>
<style scoped>
.glow-btn:hover {
    box-shadow: 0 0 20px rgb(138, 203, 236);
    transition: box-shadow 0.2s ease;
}
</style>