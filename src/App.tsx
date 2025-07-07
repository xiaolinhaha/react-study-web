import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useAuthStore } from '@/stores/authStore';
import AppRouter from '@/router';

const App: React.FC = () => {
  const { loading, isAuthenticated, initializeAuth } = useAuthStore();

  // 初始化认证状态
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 显示加载状态
  if (loading) {
    return (
      <div className="app-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <AppRouter isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default App; 