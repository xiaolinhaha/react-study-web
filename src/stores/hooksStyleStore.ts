import { create } from 'zustand';

// 🔴 Redux 风格的 Zustand (我之前写的风格)
interface ReduxStyleState {
  count: number;
  user: any;
  loading: boolean;
  increment: () => void;
  decrement: () => void;
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  fetchUser: () => Promise<void>;
}

export const useReduxStyleStore = create<ReduxStyleState>((set, get) => ({
  count: 0,
  user: null,
  loading: false,
  
  // 动作方法 (类似 Redux actions)
  increment: () => set((state: any) => ({ count: state.count + 1 })),
  decrement: () => set((state: any) => ({ count: state.count - 1 })),
  setUser: (user: any) => set({ user }),
  setLoading: (loading: boolean) => set({ loading }),
  
  // 复杂逻辑
  fetchUser: async () => {
    set({ loading: true });
    try {
      // 模拟 API 调用
      const user = await new Promise(resolve => 
        setTimeout(() => resolve({ name: 'John' }), 1000)
      );
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  }
}));

// 🟢 Hooks 风格的 Zustand (更接近 react-hooks-global-state)
interface HooksStyleState {
  count: number;
  user: any;
  loading: boolean;
}

export const useHooksStyleStore = create<HooksStyleState>(() => ({
  count: 0,
  user: null,
  loading: false
}));

// 创建类似 useState 的自定义 hooks
export const useCount = () => {
  const count = useHooksStyleStore(state => state.count);
  const setCount = (newCount: number) => {
    useHooksStyleStore.setState({ count: newCount });
  };
  const increment = () => {
    useHooksStyleStore.setState(state => ({ count: state.count + 1 }));
  };
  const decrement = () => {
    useHooksStyleStore.setState(state => ({ count: state.count - 1 }));
  };
  
  return [count, setCount, { increment, decrement }] as const;
};

export const useUser = () => {
  const user = useHooksStyleStore(state => state.user);
  const setUser = (newUser: any) => {
    useHooksStyleStore.setState({ user: newUser });
  };
  
  return [user, setUser] as const;
};

export const useLoading = () => {
  const loading = useHooksStyleStore(state => state.loading);
  const setLoading = (newLoading: boolean) => {
    useHooksStyleStore.setState({ loading: newLoading });
  };
  
  return [loading, setLoading] as const;
};

// 🎨 更进一步 - 创建一个通用的 hooks 风格工厂函数
function createHooksStyleStore<T extends Record<string, any>>(initialState: T) {
  const useStore = create<T>(() => initialState);
  
  const createHook = <K extends keyof T>(key: K) => {
    return () => {
      const value = useStore(state => state[key]);
      const setValue = (newValue: T[K]) => {
        useStore.setState({ [key]: newValue } as unknown as Partial<T>);
      };
      return [value, setValue] as const;
    };
  };
  
  return { useStore, createHook };
}

// 使用工厂函数创建 hooks 风格的 store
const { createHook } = createHooksStyleStore({
  theme: 'light',
  language: 'zh',
  notifications: true
});

export const useTheme = createHook('theme');
export const useLanguage = createHook('language');
export const useNotifications = createHook('notifications'); 