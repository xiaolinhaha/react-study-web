import service, { ResponseData } from './service';
import { API_ENDPOINTS, replaceUrlParams } from './api';

// 用户相关 API
export const userApi = {
  // 用户注册
  register: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.USER.REGISTER, data);
  },

  // 获取用户信息
  getUserInfo: (): Promise<ResponseData> => {
    return service.get(API_ENDPOINTS.USER.GET_USER_INFO);
  },
};

// 认证相关 API
export const authApi = {
  // 登录
  login: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  // 登出
  logout: (): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // 刷新token
  refresh: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.AUTH.REFRESH, data);
  },

  // 获取公钥
  getPublicKey: (): Promise<ResponseData> => {
    return service.get(API_ENDPOINTS.AUTH.PUBLIC_KEY);
  },

  // 邮箱注册
  emailRegister: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.AUTH.EMAIL_REGISTER, data);
  },

  // 邮箱登录
  emailLogin: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.AUTH.EMAIL_LOGIN, data);
  },
};

// 邮箱验证码相关 API
export const emailVerificationApi = {
  // 发送验证码
  send: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.EMAIL_VERIFICATION.SEND, data);
  },

  // 验证验证码
  verify: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.EMAIL_VERIFICATION.VERIFY, data);
  },
};

// 文章相关 API
export const articlesApi = {
  // 获取文章列表
  getList: (params?: any): Promise<ResponseData> => {
    return service.get(API_ENDPOINTS.ARTICLES.LIST, { params });
  },

  // 获取文章详情
  getDetail: (id: string | number): Promise<ResponseData> => {
    const url = replaceUrlParams(API_ENDPOINTS.ARTICLES.DETAIL, { id });
    return service.get(url);
  },

  // 创建文章
  create: (data: any): Promise<ResponseData> => {
    return service.post(API_ENDPOINTS.ARTICLES.CREATE, data);
  },

  // 更新文章
  update: (id: string | number, data: any): Promise<ResponseData> => {
    const url = replaceUrlParams(API_ENDPOINTS.ARTICLES.UPDATE, { id });
    return service.put(url, data);
  },

  // 删除文章
  delete: (id: string | number): Promise<ResponseData> => {
    const url = replaceUrlParams(API_ENDPOINTS.ARTICLES.DELETE, { id });
    return service.delete(url);
  },
};

// 分类相关 API
export const categoriesApi = {
  // 获取分类列表
  getList: (): Promise<ResponseData> => {
    return service.get(API_ENDPOINTS.CATEGORIES.LIST);
  },

  // 获取分类详情
  getDetail: (id: string | number): Promise<ResponseData> => {
    const url = replaceUrlParams(API_ENDPOINTS.CATEGORIES.DETAIL, { id });
    return service.get(url);
  },
};

// 导出所有 API
export const api = {
  user: userApi,
  auth: authApi,
  emailVerification: emailVerificationApi,
  articles: articlesApi,
  categories: categoriesApi,
};

export default api; 