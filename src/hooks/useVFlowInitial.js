import { ref, reactive, markRaw, onBeforeMount } from "vue";
import { cloneDeep } from "lodash";
import { useVueFlow } from "@vue-flow/core";
import { getUuid } from "@/utils/tools";
import { nodeFlags } from '@/utils/schemas'
// 单例模式
let instance = null;

export const useVFlowInitial = () => {
  if (instance) return instance;

  const { getNodes, addNodes, findNode, removeNodes, addEdges } = useVueFlow();

  const AllNodeInitInfos = ref([]);
  const AllNodeCounters = ref([]);
  const AllVFNodeTypes = reactive({});
  const AddNodeListFromInitInfos = ref([]);

  const initAllNodeInfos = async () => {
    const modules = import.meta.glob("../components/nodes/all_node_js/**.js");
    const promises = Object.keys(modules).map(async (key) => {
      const module = await modules[key]();
      const initInfo = module.initInfo;
      AllNodeInitInfos.value[initInfo.data.ntype] = initInfo;
      AllNodeCounters.value[initInfo.data.ntype] = 0;
      if (!AllVFNodeTypes.hasOwnProperty(initInfo.data.vtype)) {
        AllVFNodeTypes[initInfo.data.vtype] = markRaw(module.NodeVue);
      }
    });
    // 等待所有异步操作完成
    await Promise.all(promises);

    console.log("AllNodeInitInfos.value", AllNodeInitInfos.value);
    console.log("all nodeTypes", AllVFNodeTypes);

    // 排序节点列表
    AddNodeListFromInitInfos.value = Object.entries(AllNodeInitInfos.value)
      .sort((a, b) => a[0].localeCompare(b[0])) // 按key排序
      .map(([key, item]) => item)
      .filter((item) => !(nodeFlags.isAttached & item.data.flag));
    console.log(
      "AddNodeListFromInitInfos.value",
      AddNodeListFromInitInfos.value
    );
  };

  const getAddNodeList = () => {
    return AddNodeListFromInitInfos.value;
  };

  const cloneVFNodeInitInfo = (ntype) => {
    return cloneDeep(AllNodeInitInfos.value[ntype]);
  };

  const getVFNodeCount = (ntype) => {
    return AllNodeCounters.value[ntype];
  };

  const increaseVFNodeCount = (ntype, value) => {
    AllNodeCounters.value[ntype] += value;
  };

  const reBuildCounter = () => {
    for (const key in AllNodeCounters.value) {
      AllNodeCounters.value[key] = 0;
    }
    getNodes.value.forEach((node) => {
      AllNodeCounters.value[node.data.ntype]++;
    });
  };

  instance = {
    AllVFNodeTypes,
    initAllNodeInfos,
    getAddNodeList,
    cloneVFNodeInitInfo,
    getVFNodeCount,
    increaseVFNodeCount,
    reBuildCounter,
  };

  return instance;
};
