import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import ParentPage from '@/pages/parent/index';
import ComparisonPage from '@/pages/comparisonPage/index';
import ComparisonHookPage from '@/pages/comparisonHookPage/index';
import VirtualScrollPage from '@/pages/virtualScrollPage/index';
import { ROUTES, ROUTE_TITLES } from '@/constants/routes';

// 路由配置接口
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
}

// 受保护的路由组件
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requireAuth: boolean;
  isAuthenticated: boolean;
}> = ({ children, requireAuth, isAuthenticated }) => {
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  
  return <>{children}</>;
};

// 路由配置数组
export const routeConfig: RouteConfig[] = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    requireAuth: false,
    title: ROUTE_TITLES[ROUTES.LOGIN]
  },
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    requireAuth: true,
    title: ROUTE_TITLES[ROUTES.HOME]
  },
  // 新增的个人中心页面 - 看，添加新路由就是这么简单！
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
    requireAuth: true,
    title: ROUTE_TITLES[ROUTES.PROFILE]
  },
  // {
  //   path: ROUTES.SETTINGS,
  //   element: <SettingsPage />,
  //   requireAuth: true,
  //   title: ROUTE_TITLES[ROUTES.SETTINGS]
  // },
  {
    path: ROUTES.PARENT,
    element: <ParentPage />,
    requireAuth: true,
    title: ROUTE_TITLES[ROUTES.PARENT]
  },
  {
    path: ROUTES.COMPARISON,
    element: <ComparisonPage />,
    requireAuth: true,
    title: ROUTE_TITLES[ROUTES.COMPARISON]
  },
  {
    path: ROUTES.COMPARISON_HOOKS,
    element: <ComparisonHookPage />,
    requireAuth: true,
    title: ROUTE_TITLES[ROUTES.COMPARISON_HOOKS]
  },
  {
    path: ROUTES.VIRTUAL_SCROLL,
    element: <VirtualScrollPage />,
    requireAuth: true,
    title: ROUTE_TITLES[ROUTES.VIRTUAL_SCROLL]
  },
];

// 路由组件
const AppRouter: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {

  return (
    <Routes>
      {routeConfig.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute 
              requireAuth={route.requireAuth || false}
              isAuthenticated={isAuthenticated}
            >
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}
      
      {/* 默认路由重定向 */}
      <Route 
        path={ROUTES.ROOT} 
        element={<Navigate to={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN} replace />} 
      />
      
      {/* 404 路由 */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN} replace />} 
      />
    </Routes>
  );
};

export default AppRouter; 