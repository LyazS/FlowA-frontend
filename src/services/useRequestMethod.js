import axios from "axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useMessage } from "naive-ui";

let instance = null;
export const useRequestMethod = () => {
  if (instance) return instance;

  const message = useMessage();
  async function postData(
    url,
    data,
    callback_before = null,
    callback_success = null,
    callback_error = null,
  ) {
    try {
      if (callback_before) callback_before();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${url}`,
        data
      );
      if(callback_success) callback_success(response.data);
      return response.data;
    } catch (error) {
      let errorMsg = "";
      if (error.response) {
        errorMsg = `响应状态码: ${
          error.response.status
        }, 响应数据: ${JSON.stringify(error.response.data, null, 2)}`;
      } else if (error.request) {
        errorMsg = "没有收到响应";
      } else {
        errorMsg = `错误信息: ${error.message}`;
      }
      if (callback_error) callback_error(errorMsg);
      throw error;
    }
  }

  instance = {
    postData,
  };
  return instance;
};
