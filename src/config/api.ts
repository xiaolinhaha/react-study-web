/**
 * API 配置文件
 * 统一管理 API 相关配置
 */

// API 基础配置
export const API_CONFIG = {
  // 代理路径前缀
  BASE_PATH: '/api',
  
  // 请求超时时间
  TIMEOUT: 50000,
  
  // 开发环境后端地址
  DEV_TARGET: 'http://127.0.0.1:9000',
  
  // 生产环境后端地址
  PROD_TARGET: 'http://115.190.25.151:9000'
} as const;

// 获取完整的 API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_PATH}${endpoint}`;
};

// 替换 URL 参数
export const replaceUrlParams = (url: string, params: Record<string, string | number>): string => {
  let result = url;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

// API 端点定义
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/signin',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PUBLIC_KEY: '/auth/public-key',
    EMAIL_REGISTER: '/auth/email-register',
    EMAIL_LOGIN: '/auth/email-login'
  },

  // 邮箱验证码相关
  EMAIL_VERIFICATION: {
    SEND: '/email-verification/send',
    VERIFY: '/email-verification/verify'
  },

  // 用户相关
  USER: {
    REGISTER: '/user/register',
    GET_USER_INFO: '/user/getUserInfo',
  },
  
  // 文章相关
  ARTICLES: {
    LIST: '/articles',
    DETAIL: '/articles/:id',
    CREATE: '/articles',
    UPDATE: '/articles/:id',
    DELETE: '/articles/:id'
  },
  
  // 分类相关
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: '/categories/:id'
  }
} as const; 