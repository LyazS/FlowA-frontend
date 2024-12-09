import axios from "axios";
import { useMessage } from "naive-ui";

let instance = null;
export const useRequestMethod = () => {
  if (instance) return instance;

  const message = useMessage();

  async function axiosRequest(
    url,
    data,
    method = "post",
    callback = null,
  ) {
    try {
      if (callback && callback.hasOwnProperty('before')) await callback.before();
      let reqmethod = axios.post;
      if (method === "post") {
      } else if (method === "get") {
        reqmethod = axios.get;
      }
      const response = await reqmethod(
        `${import.meta.env.VITE_API_URL}/${url}`,
        data
      );
      if (callback && callback.hasOwnProperty('success')) await callback.success(response.data);
      return response.data;
    } catch (error) {
      let errorMsg = "";
      if (error.response) {
        errorMsg = `响应状态码: ${error.response.status
          }, 响应数据: ${JSON.stringify(error.response.data, null, 2)}`;
      } else if (error.request) {
        errorMsg = "没有收到响应";
      } else {
        errorMsg = `错误信息: ${error.message}`;
      }
      if (callback && callback.hasOwnProperty('error')) await callback.error(errorMsg);
      throw error;
    }
  }

  async function postData(
    url,
    data,
    callback = null,
  ) {
    return await axiosRequest(url, data, "post", callback);
  }
  async function getData(
    url,
    params,
    callback = null,
  ) {
    return await axiosRequest(url, params, "get", callback);
  }

  instance = {
    postData,
    getData,
  };
  return instance;
};
