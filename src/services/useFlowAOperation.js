import axios from "axios";
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useVueFlow } from "@vue-flow/core";
import { useVFlowInitial } from "@/hooks/useVFlowInitial";
import { getUuid, setValueByPath, downloadJson } from "@/utils/tools";
import { useRequestMethod } from "@/services/useRequestMethod";
import { useVFlowManagement } from "@/hooks/useVFlowManagement";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { SubscribeSSE } from '@/services/useSSE'
import { debounce } from 'lodash';
import { useMessage } from 'naive-ui';
import { nodeFlags } from '@/utils/schemas'

let instance = null;
export const useFlowAOperation = () => {
  if (instance) return instance;
  const { findNode, getNodes, toObject, fromObject, removeNodes, nodesDraggable, nodesConnectable } = useVueFlow();
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
  const Jinja2RenderNodeIDs = ref([]);
  const isEditorMode = computed(() => {
    return TaskID.value === null;
  });


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
          if (vf_node && !(nodeFlags.isAttached & vf_node.data.flag)) {
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
    // onOpen
    async (response) => {
      console.log("onopen SSE", response.ok);
    },
    // onMessage
    async (event) => {
      // console.log("onmessage SSE", event.event);
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
    if (!WorkflowID.value) return;
    const data = {
      wid: WorkflowID.value,
      location: "vflow",
      data: toObject(),
    }
    const res = await postData("workflow/update", data, null);
    if (res.success) {
      AutoSaveMessage.value = `自动保存 ${new Date().toLocaleTimeString()}`;
    }
  }, 1000);
  const autoSaveWorkflow = () => {
    if (!canSaveWorkflow.value) return;
    if (!isEditorMode.value) return;
    console.log("try to autoSaveWorkflow");
    debouncedAutoSaveWorkflow();
  }

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
    canSaveWorkflow.value = false;
    removeNodes(getNodes.value);
    await nextTick();
    canSaveWorkflow.value = true;
    const res = await postData(`workflow/create`, { name: name });
    console.log(`create Workflow: `, res);
    if (!res.success) return;

    WorkflowID.value = res.data;
    WorkflowName.value = name;
    localStorage.setItem('curWorkflowID', WorkflowID.value);
    await returnEditorMode(false);
  }

  const loadWorkflow = async (wid) => {
    clearTaskID();

    if (wid) {
      const res = await postData(`workflow/read`, { wid: wid, locations: ["name", "vflow"] });
      console.log(`read Workflow ${wid}: `, res);
      if (!res.success) {
        WorkflowID.value = null;
        WorkflowName.value = null;
        message.error(res.message);
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
    else {
      WorkflowID.value = null;
      WorkflowName.value = null;
    }
  };

  const uploadWorkflow = async (name, wf_json) => {
    const vflow = wf_json.vflow;
    const res = await postData(`workflow/create`, { name, vflow });
    if (!res.success) {
      message.error(res.message);
      return;
    }
    else {
      const wid = res.data;
      await loadWorkflow(wid);
      message.success(`上传工作流【${name}】成功`);
    }
  };

  const downloadWorkflow = async (wid) => {
    const res = await postData(`workflow/read`, { wid: wid, locations: ["name", "vflow"] });
    console.log(`Download Workflow ${wid}: `, res);
    if (!res.success) {
      message.error(res.message);
    }
    else {
      const wfname = res.data[0];
      const flow = JSON.stringify({ version: "0.0.1", vflow: res.data[1] });
      // 要符合文件名规范，不能包含特殊字符
      const wfname_safe = wfname.replace(/[\\/:*?"<>|]/g, '_');
      downloadJson(flow, `${wfname_safe}.json`);
    }
  };

  const runflow = async (callback = null) => {
    const vflow = toObject();
    const re_callback = {
      before: callback?.before,
      success: (data) => {
        if (callback?.success) callback.success(data);
        if (data.success) {
          console.log("start subscribe");
          if (data.data.hasOwnProperty("tid")) {
            setTaskID(data.data["tid"]);
            subscribe(
              `${import.meta.env.VITE_API_URL}/api/progress`,
              'POST',
              null,
              {
                tid: data.data["tid"],
                node_type: "ALL_TASK_NODE",
                selected_nids: null,
              },
            );
          }
          else {
            console.log(data.data);
          }
        }
        else {
          message.error(data.data["validation_errors"]);
        }
      },
      error: callback?.error,
    }
    return await postData(`api/run`, { wid: WorkflowID.value, vflow: vflow }, re_callback);
  };

  const deleteWorkflow = async (wid) => {
    const res = await postData(`workflow/delete?wid=${wid}`);
    console.log(`delete Workflow ${wid}: `, res);
    if (res.success) {
      if (WorkflowID.value == wid) {
        await returnEditorMode(false);
        canSaveWorkflow.value = false;
        WorkflowID.value = null;
        WorkflowName.value = null;
        localStorage.removeItem('curWorkflowID');
        removeNodes(getNodes.value);
        canSaveWorkflow.value = true;
      }
    }
  };

  const setTaskID = (tid) => {
    TaskID.value = tid;
    nodesDraggable.value = false;
    nodesConnectable.value = false;
  }

  const clearTaskID = () => {
    TaskID.value = null;
    nodesDraggable.value = true;
    nodesConnectable.value = true;
  }

  const returnEditorMode = async (isLoad = false) => {
    clearTaskID();
    unsubscribe();
    if (isLoad) {
      await loadWorkflow(WorkflowID.value);
    }
  }

  const getResults = async () => {
    if (!WorkflowID.value) return [];
    const res = await getData(`workflow/readallresults?wid=${WorkflowID.value}`);
    if (!res.success) return [];
    return res.data;
  };

  const loadResult = async (tid) => {
    if (!tid) return;
    const res = await postData(`workflow/loadresult?wid=${WorkflowID.value}&tid=${tid}`);
    console.log(`load Result ${tid}: `, res);
    if (res.success) {
      loadVflow(res.data);
      TaskID.value = tid;
      nodesDraggable.value = false;
      nodesConnectable.value = false;
      console.log("loadResult Done.");
      subscribe(
        `${import.meta.env.VITE_API_URL}/api/progress`,
        'POST',
        null,
        {
          tid: tid,
          node_type: "ALL_TASK_NODE",
          selected_nids: null,
        },
      )
    }
  };

  const onMountedFunc = async () => {
    // 打开网页就加载上一次的工作流，如果没有就新建一个空白的工作流
    const ls_wid = localStorage.getItem('curWorkflowID') || null;
    if (ls_wid) {
      Jinja2RenderNodeIDs.value = JSON.parse(localStorage.getItem(`${ls_wid}:Jinja2RenderNodeIDs`) || '[]') ?? [];
    }
    await loadWorkflow(ls_wid);
    console.log("loadWorkflow Done.");
  };

  onUnmounted(() => {
    unsubscribe();
  });

  instance = {
    TaskID,
    WorkflowID,
    WorkflowName,
    Jinja2RenderNodeIDs,
    AutoSaveMessage,
    isEditorMode,
    runflow,
    autoSaveWorkflow,
    createNewWorkflow,
    uploadWorkflow,
    renameWorkflow,
    getWorkflows,
    loadWorkflow,
    getResults,
    loadResult,
    returnEditorMode,
    deleteWorkflow,
    downloadWorkflow,
    onMountedFunc,
  };
  return instance;
};
