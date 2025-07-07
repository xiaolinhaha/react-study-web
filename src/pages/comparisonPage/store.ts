import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// 数据接口
export interface ComparisonData {
  counter: number;
  message: string;
  user: {
    name: string;
    age: number;
  } | null;
  theme: 'light' | 'dark';
  isLoading: boolean;
  history: string[];
}

// Store 接口
interface ComparisonStore extends ComparisonData {
  // 计数器操作
  increment: () => void;
  decrement: () => void;
  resetCounter: () => void;
  setCounter: (value: number) => void;
  
  // 消息操作
  setMessage: (message: string) => void;
  clearMessage: () => void;
  
  // 用户操作
  setUser: (user: { name: string; age: number }) => void;
  clearUser: () => void;
  updateUserAge: (age: number) => void;
  
  // 主题操作
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // 加载状态
  setLoading: (loading: boolean) => void;
  
  // 历史记录
  addToHistory: (action: string) => void;
  clearHistory: () => void;
  
  // 复杂操作
  performComplexAction: () => Promise<void>;
  
  // 计算属性
  getCounterStatus: () => 'negative' | 'zero' | 'positive';
  getHistoryCount: () => number;
  getUserInfo: () => string;
}

// 创建 Zustand store
export const useComparisonStore = create<ComparisonStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        counter: 0,
        message: '欢迎使用 Zustand 状态管理！',
        user: null,
        theme: 'light',
        isLoading: false,
        history: [],

        // 计数器操作
        increment: () => {
          set((state) => ({ counter: state.counter + 1 }), false, 'increment');
          get().addToHistory(`计数器递增至 ${get().counter}`);
        },

        decrement: () => {
          set((state) => ({ counter: state.counter - 1 }), false, 'decrement');
          get().addToHistory(`计数器递减至 ${get().counter}`);
        },

        resetCounter: () => {
          set({ counter: 0 }, false, 'resetCounter');
          get().addToHistory('计数器重置为 0');
        },

        setCounter: (value: number) => {
          set({ counter: value }, false, 'setCounter');
          get().addToHistory(`计数器设置为 ${value}`);
        },

        // 消息操作
        setMessage: (message: string) => {
          set({ message }, false, 'setMessage');
          get().addToHistory(`消息更新: ${message.substring(0, 20)}...`);
        },

        clearMessage: () => {
          set({ message: '' }, false, 'clearMessage');
          get().addToHistory('消息已清空');
        },

        // 用户操作
        setUser: (user: { name: string; age: number }) => {
          set({ user }, false, 'setUser');
          get().addToHistory(`用户设置: ${user.name}, ${user.age}岁`);
        },

        clearUser: () => {
          set({ user: null }, false, 'clearUser');
          get().addToHistory('用户信息已清空');
        },

        updateUserAge: (age: number) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, age } }, false, 'updateUserAge');
            get().addToHistory(`用户年龄更新为 ${age}岁`);
          }
        },

        // 主题操作
        toggleTheme: () => {
          const newTheme = get().theme === 'light' ? 'dark' : 'light';
          set({ theme: newTheme }, false, 'toggleTheme');
          get().addToHistory(`主题切换为 ${newTheme}`);
        },

        setTheme: (theme: 'light' | 'dark') => {
          set({ theme }, false, 'setTheme');
          get().addToHistory(`主题设置为 ${theme}`);
        },

        // 加载状态
        setLoading: (isLoading: boolean) => {
          set({ isLoading }, false, 'setLoading');
        },

        // 历史记录
        addToHistory: (action: string) => {
          const timestamp = new Date().toLocaleTimeString();
          const historyEntry = `[${timestamp}] ${action}`;
          set((state) => ({
            history: [...state.history.slice(-9), historyEntry] // 保持最近10条记录
          }), false, 'addToHistory');
        },

        clearHistory: () => {
          set({ history: [] }, false, 'clearHistory');
        },

        // 复杂异步操作
        performComplexAction: async () => {
          const { setLoading, addToHistory, setMessage } = get();
          
          setLoading(true);
          addToHistory('开始执行复杂操作...');
          
          try {
            // 模拟异步操作
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 执行多个状态更新
            set((state) => ({
              counter: state.counter + 10,
              message: `复杂操作完成！时间: ${new Date().toLocaleTimeString()}`,
              user: { name: '异步用户', age: Math.floor(Math.random() * 50) + 20 }
            }), false, 'performComplexAction');
            
            addToHistory('复杂操作执行成功');
          } catch (error) {
            addToHistory('复杂操作执行失败');
            setMessage('操作失败，请重试');
          } finally {
            setLoading(false);
          }
        },

        // 计算属性
        getCounterStatus: () => {
          const counter = get().counter;
          if (counter < 0) return 'negative';
          if (counter === 0) return 'zero';
          return 'positive';
        },

        getHistoryCount: () => get().history.length,

        getUserInfo: () => {
          const user = get().user;
          return user ? `${user.name} (${user.age}岁)` : '未设置用户';
        },
      }),
      {
        name: 'comparison-storage',
        storage: createJSONStorage(() => localStorage),
        // 只持久化部分状态
        partialize: (state) => ({
          counter: state.counter,
          message: state.message,
          user: state.user,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'comparison-store',
    }
  )
); 