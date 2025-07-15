// 导出 API 配置
export { API_CONFIG, API_ENDPOINTS, getApiUrl, replaceUrlParams } from './api';

// 导出 axios 服务实例
export { default as service } from './service';
export type { ResponseData } from './service';

// 导出 API 请求方法
export { 
  api as default,
  userApi, 
  authApi, 
  emailVerificationApi, 
  articlesApi, 
  categoriesApi 
} from './request';

// 导出类型定义
export type {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  User,
  LoginParams,
  RegisterParams,
  EmailLoginParams,
  EmailRegisterParams,
  Article,
  ArticleParams,
  ArticleQueryParams,
  Category,
  EmailVerificationParams,
  EmailVerifyParams,
  TokenResponse,
  UploadResponse
} from './types'; 