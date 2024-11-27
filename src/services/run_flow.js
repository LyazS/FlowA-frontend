import axios from "axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useVueFlow } from "@vue-flow/core";
import { useVFlowInitial } from "@/hooks/useVFlowInitial";
import { getUuid } from "@/utils/tools";
import { useRequestMethod } from "@/services/useRequestMethod";

let instance = null;
export const useFlowAOperation = () => {
  if (instance) return instance;
  const { toObject, fromObject } = useVueFlow();
  const { postData } = useRequestMethod();

  const runflow = async (
    vflow,
    callback = null,
  ) => {
    const data = {
      vflow: vflow,
    };
    return await postData(`api/run`, data, callback);
  };

  instance = {
    runflow,
  };
  return instance;
};
