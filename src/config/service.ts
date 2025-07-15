import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { API_CONFIG } from "./api";

export interface ResponseData {
  statusCode: number;
  data?: any;
  message: string;
}

// 创建 axios 实例
let service: AxiosInstance | any;

// 根据环境决定 baseURL
const getBaseURL = () => {
  // 生产环境直接使用后端地址，开发环境使用代理
  if (process.env.NODE_ENV === 'production') {
    return API_CONFIG.PROD_TARGET;
  }
  return API_CONFIG.BASE_PATH;
};

service = axios.create({
  baseURL: getBaseURL(),
  timeout: API_CONFIG.TIMEOUT // 请求超时时间
});

// request 拦截器 axios 的一些配置
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在每个请求的头部添加Authorization字段，并将JWT令牌包含在其中
    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `${token}`;
      }
    }
    return config;
  },
  (error: any) => {
    // Do something with request error
    console.error("error:", error); // for debug
    return Promise.reject(error);
  }
);

// respone 拦截器 axios 的一些配置
service.interceptors.response.use(
  (res: AxiosResponse) => {
    // Some example codes here:
    // code == 0: success
    if (res.status === 200) {
      const data: ResponseData = res.data
      return data;
    } else {
      // React 中可以使用 toast 或其他提示组件替代 ElMessage
      console.error("网络错误!");
      return Promise.reject(new Error(res.data.message || "Error"));
    }
  },
  (error: any) => {
    // 检查是否是HTTP错误响应
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("401错误，跳转到登录页面")
          // React 中可以使用 toast 或其他提示组件
          console.error("登录已过期，请重新登录");
          // 清除本地存储的token
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userInfo');
          // 跳转到登录页面 - React 中可以使用 navigate 或 window.location
          window.location.href = '/login';
          break;
        case 403:
          console.error("没有权限访问");
          break;
        case 404:
          console.error("请求的资源不存在");
          break;
        case 500:
          console.log("500错误，跳转到登录页面")
          // 如果是主页，则跳转到登录页面
          if (window.location.pathname === '/') {
            window.location.href = '/login';
          }
          console.error("服务器内部错误");
          break;
        default:
          console.error(error.response.data?.message || "网络错误!");
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.log("网络错误，没有收到响应")
      console.error("网络连接失败，请检查网络");
    } else {
      // 其他错误
      console.log("其他错误 ---->", error.message)
      console.error("请求失败");
    }
    return Promise.reject(error)
  }
);

// 新增方法：以 formData 格式发送 POST 请求
service.postFormData = async function (
  url: string,
  formData: FormData,
  headers: AxiosRequestConfig['headers'] = {}
) {
  try {
    const response = await service.post(url, formData, {
      headers: { ...headers, 'Content-Type': 'multipart/form-data' }
    });
    return response;
  } catch (error) {
    console.error('Error in postFormData request:', error);
    throw error;
  }
};

export default service; 