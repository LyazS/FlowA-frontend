import axios from "axios";
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useVueFlow } from "@vue-flow/core";
import { useVFlowInitial } from "@/hooks/useVFlowInitial";
import { getUuid, setValueByPath } from "@/utils/tools";
import { useRequestMethod } from "@/services/useRequestMethod";
import { useVFlowManagement } from "@/hooks/useVFlowManagement";
import { SubscribeSSE } from '@/services/useSSE'
import { debounce } from 'lodash';
import { useMessage } from 'naive-ui';

let instance = null;
export const useFlowAOperation = () => {
  if (instance) return instance;
  const { findNode, getNodes, toObject, fromObject, removeNodes } = useVueFlow();
  const { postData, getData } = useRequestMethod();
  const {
    reBuildCounter,
  } = useVFlowInitial();
  const {
    resetNodeState,
    buildNestedNodeGraph,
  } = useVFlowManagement();
  const message = useMessage();
  const TaskID = ref(null);
  const WorkflowID = ref(null);
  const WorkflowName = ref(null);
  const AutoSaveMessage = ref("");

  const runflow = async (
    data,
    callback = null,
  ) => {
    return await postData(`api/run`, data, callback);
  };

  const updateNodeFromSSE = (data) => {
    const nid = data.nid;
    const oriid = data.oriid;
    const updatedatas = data.data;
    for (const udata of updatedatas) {
      const data = udata.data;
      const path = udata.path;
      const type = udata.type;
      if (type === "overwrite") {
        // 特殊处理状态改变
        if (nid.includes('#')
          && path[0] === 'state'
          && path[1] == 'status') {
          const vf_node = findNode(oriid);
          if (vf_node && !vf_node.data.flags.isAttached) {
            vf_node.data.state.copy[nid] = { status: data };
          }
        }
        else {
          const thenode = findNode(nid);
          if (thenode) {
            setValueByPath(thenode.data, path, data);
          }
        }
      }
      else if (type === "append") { }
      else if (type === "remove") { }
    }
  }
  const { subscribe, unsubscribe } = SubscribeSSE(
    'GET',
    null,
    null,
    // onOpen
    async (response) => {
      // console.log("onopen SSE", response.ok);
    },
    // onMessage
    async (event) => {
      // console.log("onmessage SSE");
      if (event.event === "updatenode") {
        let data = JSON.parse(event.data);
        // console.log(data);
        updateNodeFromSSE(data);
      }
      else if (event.event === "batchupdatenode") {
        let datas = JSON.parse(event.data);
        for (const data of datas) {
          updateNodeFromSSE(data);
        }
      }
      else if (event.event === "internalerror") {
        let data = JSON.parse(event.data);
        // console.log(data);
        message.error(`内部错误: ${data}`);
      }
      else if (event.event === "flowfinish") {
        unsubscribe();
        message.success('工作流运行完成');
      }
    },
    // onClose
    async () => {
      console.log("onclose SSE");
    },
    // onError
    async (err) => {
      console.log("onerror SSE", err);
    },
  );

  const loadVflow = async (flow) => {
    removeNodes(getNodes.value);
    await nextTick();
    if (flow) {
      for (const node of flow.nodes) {
        resetNodeState(node);
      }
      fromObject(flow);
      buildNestedNodeGraph();
      reBuildCounter();
    }
  }

  const canSaveWorkflow = ref(true);
  const debouncedAutoSaveWorkflow = debounce(async () => {
    if (!canSaveWorkflow.value) return;
    if (!WorkflowID.value) return;
    const data = {
      wid: WorkflowID.value,
      location: "vflow",
      data: toObject(),
    }
    const res = await postData("workflow/update", data, null);
    if (res.success) {
      AutoSaveMessage.value = `已自动保存 ${new Date().toLocaleTimeString()}`;
    }
  }, 5 * 1000);

  const renameWorkflow = async (name, callback) => {
    if (!WorkflowID.value) return;
    const data = {
      wid: WorkflowID.value,
      location: "name",
      data: name,
    }
    const res = await postData("workflow/update", data, callback);
    if (res.success) {
      WorkflowName.value = name;
    }
  }

  const getWorkflows = async () => {
    const res = await getData("workflow/readall");
    if (!res.success) {
      message.error(res.message);
      return [];
    }
    return res.data;
  };

  const createNewWorkflow = async (name) => {
    const res = await postData(`workflow/create`, { name: name });
    console.log(`create Workflow: `, res);
    if (!res.success) return;

    WorkflowID.value = res.data;
    WorkflowName.value = name;
    localStorage.setItem('curWorkflowID', WorkflowID.value);
  }
  const loadWorkflow = async (wid) => {
    if (!wid) {
      await createNewWorkflow('新建工作流');
    }
    else {
      const res = await postData(`workflow/read`, { wid: wid, locations: ["name", "vflow"] });
      console.log(`read Workflow ${wid}: `, res);
      if (!res.success) {
        await createNewWorkflow('新建工作流');
      }
      else {
        const name = res.data[0];
        const flow = res.data[1];
        canSaveWorkflow.value = false;
        loadVflow(flow);
        WorkflowID.value = wid;
        WorkflowName.value = name;
        canSaveWorkflow.value = true;
        localStorage.setItem('curWorkflowID', wid);
      }
    }
  };

  const getResults = async () => {
    if (!WorkflowID.value) return [];
    const res = await getData(`workflow/readallresults?wid=${WorkflowID.value}`);
    if (!res.success) return [];
    return res.data;
  };

  const loadResult = async (tid) => {
    if (!tid) return;
    const flow = await postData(`workflow/loadresult?wid=${WorkflowID.value}&tid=${tid}`);
    console.log(`load Result ${tid}: `, flow);
    if (flow) {
      loadVflow(flow.vflow);
      TaskID.value = tid;
      WorkflowName.value = flow.name;
    }
  };

  onMounted(async () => {
    // 打开网页就加载上一次的工作流，如果没有就新建一个空白的工作流
    const ls_wid = localStorage.getItem('curWorkflowID') || null;
    await loadWorkflow(ls_wid);
    // 监听TaskID变化，第一次即订阅以获取历史记录的工作流数据
    // watch(TaskID, (newVal) => {
    //   if (newVal) {
    //     setTimeout(() => {
    //       console.log("curTaskID ", newVal);
    //       localStorage.setItem('curTaskID', newVal);
    //       subscribe(`${import.meta.env.VITE_API_URL}/api/progress?taskid=${newVal}`)
    //       console.log("subscribeSSE Done.");
    //     }, 1000);
    //   }
    // }, { immediate: true });
  });

  onUnmounted(() => {
    unsubscribe();
  });

  instance = {
    TaskID,
    WorkflowID,
    WorkflowName,
    AutoSaveMessage,
    runflow,
    debouncedAutoSaveWorkflow,
    createNewWorkflow,
    renameWorkflow,
    getWorkflows,
    loadWorkflow,
    getResults,
    loadResult,
  };
  return instance;
};
