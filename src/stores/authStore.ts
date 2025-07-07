import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 用户接口
interface User {
  username: string;
  email: string;
}

// 认证状态接口
interface AuthState {
  // 状态
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  
  // 动作
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

// 创建认证 store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      user: null,
      loading: true,

      // 初始化认证状态
      initializeAuth: () => {
        try {
          const storedUser = localStorage.getItem('user');
          const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
          
          if (isAuthenticated && storedUser) {
            set({
              isAuthenticated: true,
              user: JSON.parse(storedUser),
              loading: false,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              loading: false,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      },

      // 登录函数
      login: async (username: string, password: string): Promise<boolean> => {
        try {
          // 模拟登录验证（实际项目中应该调用API）
          if (username === 'admin' && password === '123456') {
            const user: User = {
              username,
              email: `${username}@example.com`,
            };

            // 更新状态
            set({
              isAuthenticated: true,
              user,
              loading: false,
            });

            // 存储到 localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');

            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      // 登出函数
      logout: () => {
        // 清除状态
        set({
          isAuthenticated: false,
          user: null,
          loading: false,
        });

        // 清除 localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'auth-storage', // localStorage 中的 key
      storage: createJSONStorage(() => localStorage),
      // 只持久化部分状态
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
); 