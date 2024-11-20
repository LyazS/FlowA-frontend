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
  const { userUuid } = useVFlowInitial();
  const { postData } = useRequestMethod();

  const runflow = async (
    vflow,
    callback_before = null,
    callback_success = null,
    callback_error = null
  ) => {
    const data = {
      vflow: vflow,
      uid: userUuid,
    };
    return await postData(
      `api/run`,
      data,
      callback_before,
      callback_success,
      callback_error
    );
  };

  instance = {
    runflow,
  };
  return instance;
};
