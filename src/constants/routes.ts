// 路由路径常量
export const ROUTES = {
  // 公共路由
  LOGIN: '/login',
  
  // 受保护的路由
  HOME: '/home',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PARENT: '/parent',
  COMPARISON: '/comparison',
  COMPARISON_HOOKS: '/comparison-hooks',
  VIRTUAL_SCROLL: '/virtual-scroll',
  
  // 默认路由
  ROOT: '/',
} as const;

// 路由标题映射
export const ROUTE_TITLES = {
  [ROUTES.LOGIN]: '登录',
  [ROUTES.HOME]: '首页',
  [ROUTES.PROFILE]: '个人中心',
  [ROUTES.SETTINGS]: '设置',
  [ROUTES.PARENT]: '父组件',
  [ROUTES.COMPARISON]: 'Redux vs Hooks 风格对比',
  [ROUTES.COMPARISON_HOOKS]: 'Hooks 风格演示',
  [ROUTES.VIRTUAL_SCROLL]: '虚拟滚动大数据渲染',
} as const;

// 导航菜单配置
export interface NavMenuItem {
  key: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  requireAuth: boolean;
}

// 可以在这里配置导航菜单项
export const NAV_MENU_ITEMS: NavMenuItem[] = [
  {
    key: 'home',
    label: '首页',
    path: ROUTES.HOME,
    requireAuth: true,
  },
  // 未来可以添加更多菜单项
  // {
  //   key: 'profile',
  //   label: '个人中心',
  //   path: ROUTES.PROFILE,
  //   requireAuth: true,
  // },
  // {
  //   key: 'settings',
  //   label: '设置',
  //   path: ROUTES.SETTINGS,
  //   requireAuth: true,
  // },
]; 