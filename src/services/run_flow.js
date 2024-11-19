import axios from "axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useVueFlow } from "@vue-flow/core";
import { useVFlowInitial } from "@/hooks/useVFlowInitial";
import { getUuid } from "@/utils/tools";

const { toObject, fromObject } = useVueFlow();
const { userUuid } = useVFlowInitial();
async function postData(url, data) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/${url}`, data);
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    let errorMsg = "";

    if (error.response) {
      errorMsg = `响应状态码: ${error.response.status}, 响应数据: ${error.response.data}`;
    } else if (error.request) {
      errorMsg = "没有收到响应";
    } else {
      errorMsg = `错误信息: ${error.message}`;
    }

    return {
      success: false,
      data: null,
      error: errorMsg,
    };
  }
}
export const runflow = async () => {
  const vflow = toObject();
  const task_uuid = getUuid();
  const data = {
    vflow: vflow,
    task_uuid,
    user_uuid: userUuid,
  };
  return await postData(`api/validate`, data);
};
