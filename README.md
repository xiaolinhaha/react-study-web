# React Study Web

一个基于React的练习项目，使用函数式编程、TypeScript和Ant Design构建。

## 🚀 技术栈

- **React 18** - 现代化的前端框架
- **TypeScript** - 类型安全的JavaScript超集
- **Ant Design** - 企业级UI组件库
- **React Router** - 前端路由管理
- **函数式编程** - 使用React Hooks和纯函数

## 📦 功能特性

- ✅ 用户登录认证
- ✅ 路由保护和重定向
- ✅ 本地存储状态管理
- ✅ 响应式设计
- ✅ TypeScript类型安全
- ✅ 函数式编程范式

## 🛠️ 安装和运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

项目将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 🔐 测试账号

- **用户名**: admin
- **密码**: 123456

## 📁 项目结构

```
src/
├── constants/       # 常量配置
│   └── routes.ts    # 路由路径常量
├── hooks/           # 自定义Hooks
│   └── useAuth.ts   # 认证状态管理
├── pages/           # 页面组件
│   ├── LoginPage.tsx    # 登录页面
│   ├── HomePage.tsx     # 首页
│   └── ProfilePage.tsx  # 个人中心页面
├── router/          # 路由配置
│   └── index.tsx    # 路由配置和保护逻辑
├── App.tsx          # 主应用组件
├── index.tsx        # 应用入口
└── index.css        # 全局样式
```

## 🎯 学习要点

### 函数式编程实践

1. **纯函数**: 所有组件都是纯函数，没有副作用
2. **不可变性**: 使用useState和useCallback管理状态
3. **高阶函数**: 使用map、filter等函数式方法
4. **组合**: 通过组合小函数构建复杂功能

### React Hooks使用

- `useState` - 状态管理
- `useEffect` - 副作用处理
- `useCallback` - 函数缓存
- `useAuth` - 自定义认证Hook

### TypeScript集成

- 接口定义 (User, AuthState)
- 类型安全的Props
- 泛型使用
- 类型推断

## 🔧 开发说明

### 认证流程

1. 用户在登录页面输入凭据
2. `useAuth` Hook验证用户信息
3. 成功后将用户信息存储到localStorage
4. 路由保护确保只有认证用户可以访问受保护页面
5. 用户可以在任何页面退出登录

### 路由管理

项目采用模块化的路由配置：
- `src/constants/routes.ts` - 定义所有路由路径常量
- `src/router/index.tsx` - 配置路由规则和保护逻辑
- `ProtectedRoute` 组件自动处理认证检查和重定向

### 添加新页面的步骤

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/constants/routes.ts` 中添加新的路由路径
3. 在 `src/router/index.tsx` 的 `routeConfig` 数组中添加路由配置
4. 路由保护和导航逻辑会自动生效

### 状态管理

项目使用React的内置状态管理：
- `useState` 管理组件本地状态
- `useAuth` 自定义Hook管理全局认证状态
- localStorage 持久化用户会话

## �� 许可证

MIT License 