// 基础响应类型
export interface ApiResponse<T = any> {
  statusCode: number;
  data?: T;
  message: string;
}

// 分页相关类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  pagination: PaginationParams;
}

// 用户相关类型
export interface User {
  id: string | number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EmailLoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface EmailRegisterParams {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

// 文章相关类型
export interface Article {
  id: string | number;
  title: string;
  content: string;
  summary?: string;
  author: string;
  categoryId: string | number;
  tags?: string[];
  coverImage?: string;
  viewCount?: number;
  likeCount?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleParams {
  title: string;
  content: string;
  summary?: string;
  categoryId: string | number;
  tags?: string[];
  coverImage?: string;
  isPublished?: boolean;
}

export interface ArticleQueryParams extends PaginationParams {
  categoryId?: string | number;
  keyword?: string;
  author?: string;
  isPublished?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

// 分类相关类型
export interface Category {
  id: string | number;
  name: string;
  description?: string;
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
}

// 邮箱验证相关类型
export interface EmailVerificationParams {
  email: string;
  type: 'register' | 'login' | 'reset_password';
}

export interface EmailVerifyParams {
  email: string;
  verificationCode: string;
  type: 'register' | 'login' | 'reset_password';
}

// Token 相关类型
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 文件上传相关类型
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
} 