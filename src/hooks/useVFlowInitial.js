import { ref, reactive } from "vue";
import { cloneDeep } from 'lodash';

// 单例模式
let AllNodeInitInfos = null;
let AllNodeCounters = null;
let AllVFNodeTypes = null;
let AddNodeListFromInitInfos = null;

export const initAllNodeInfos = async () => {
  AllNodeInitInfos = {};
  AllNodeCounters = {};
  AllVFNodeTypes = reactive({});
  AddNodeListFromInitInfos = [];

  const modules = import.meta.glob('../components/nodes/all_node_js/**.js');
  const promises = Object.keys(modules).map(async (key) => {
    const module = await modules[key]();
    const initInfo = module.initInfo;
    AllNodeInitInfos[initInfo.ntype] = initInfo;
    AllNodeCounters[initInfo.ntype] = 0;
    if (!AllVFNodeTypes.hasOwnProperty(initInfo.vtype)) {
      AllVFNodeTypes[initInfo.vtype] = markRaw(module.NodeVue);
    }
  });
  // 等待所有异步操作完成
  await Promise.all(promises);

  console.log("AllNodeInitInfos", AllNodeInitInfos);
  console.log("all nodeTypes", AllVFNodeTypes);

  // 排序节点列表
  AddNodeListFromInitInfos = Object.entries(AllNodeInitInfos)
    .sort((a, b) => a[0].localeCompare(b[0])) // 按key排序
    .map(([key, item]) => item)
    .filter(item => !item.data.flags.isAttached);
  console.log("AddNodeListFromInitInfos", AddNodeListFromInitInfos);
};

export const getAddNodeList = () => {
  return AddNodeListFromInitInfos;
};

export const getVFNodeTypes = () => {
  return AllVFNodeTypes;
};

export const cloneVFNodeInitInfo = (ntype) => {
  return cloneDeep(AllNodeInitInfos[ntype]);
};

export const getVFNodeCount = (ntype) => {
  return AllNodeCounters[ntype];
};

export const increaseVFNodeCount = (ntype, value) => {
  AllNodeCounters[ntype] += value;
};