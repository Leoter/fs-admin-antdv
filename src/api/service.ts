import axios from "axios";
import { get } from "lodash-es";
import Adapter from "axios-mock-adapter";
import { errorLog, errorCreate } from "./tools";
import { env } from "/src/utils/util.env";
import { useUserStore } from "../store/modules/user";


/**
 * @description 创建请求实例
 */
function createService() {
  // 创建一个 axios 实例
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    (error) => {
      // 发送失败
      console.log(error);
      return Promise.reject(error);
    }
  );
  // 响应拦截
  service.interceptors.response.use(
    (response) => {
      if (response.config.responseType === "blob") {
        // return response;
        // 使用点号语法获取属性值
        const contentDisposition = response.headers['content-disposition'];
        console.log("@header: ", response.headers);
        
        let filename = contentDisposition.split('filename=')[1];
        // url 反编译
        filename = decodeURIComponent(filename);
        // 处理 blob 类型的文件下载
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", filename); // 设置下载的文件名和扩展名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        return response;
      }
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response.data;
      // 这个状态码是和后端约定的
      const { errcode, errmsg } = dataAxios;
      // 根据 code 进行判断
      if (errcode === undefined) {
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        errorCreate(`非标准返回：${dataAxios}， ${response.config.url}`);
        return dataAxios;
      } else {
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        switch (errcode) {
          case "0000":
            // [ 示例 ] code === 0 代表没有错误
            // @ts-ignore
            if (response.config.unpack === false) {
              //如果不需要解包
              return dataAxios;
            }
            return dataAxios.data;
          default:
            // 不是正确的 code
            errorCreate(`${dataAxios.errmsg}: ${response.config.url}`);
            return dataAxios;
        }
      }
    },
    (error) => {
      const status = get(error, "response.status");
      switch (status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          break;
      }
      errorLog(error);
      if (status === 401) {
        const userStore = useUserStore();
        userStore.logout();
      }
      return Promise.reject(error);
    }
  );
  return service;
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service: any) {
  return function (config: any) {
    const configDefault = {
      headers: {
        "Content-Type": get(config, "headers.Content-Type", "application/json"),
        "scid": "b_66bd2f5e18ab62ee"
      },
      timeout: 5000,
      baseURL: env.API,
      data: {}
    };
    const userStore = useUserStore();
    const token = userStore.getToken;
    if (token != null) {
      // @ts-ignore
      configDefault.headers.Authorization = token;
    }
    return service(Object.assign(configDefault, config));
  };
}

// 用于真实网络请求的实例和请求方法
export const service = createService();
export const request = createRequestFunction(service);

// 用于模拟网络请求的实例和请求方法
export const serviceForMock = createService();
export const requestForMock = createRequestFunction(serviceForMock);

// 网络请求数据模拟工具
export const mock = new Adapter(serviceForMock, { delayResponse: 200 });
