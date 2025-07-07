import { useComparisonStore } from '../comparisonPage/store';
import type { ComparisonData } from '../comparisonPage/store';

// 🟢 Hooks 风格的封装 - 模仿 react-hooks-global-state 的 API

// 计数器 hook
export const useCounter = () => {
  const counter = useComparisonStore(state => state.counter);
  const setCounter = useComparisonStore(state => state.setCounter);
  const increment = useComparisonStore(state => state.increment);
  const decrement = useComparisonStore(state => state.decrement);
  const resetCounter = useComparisonStore(state => state.resetCounter);
  const getCounterStatus = useComparisonStore(state => state.getCounterStatus);
  
  return [
    counter, 
    setCounter, 
    { 
      increment, 
      decrement, 
      reset: resetCounter, 
      status: getCounterStatus() 
    }
  ] as const;
};

// 消息 hook
export const useMessage = () => {
  const message = useComparisonStore(state => state.message);
  const setMessage = useComparisonStore(state => state.setMessage);
  const clearMessage = useComparisonStore(state => state.clearMessage);
  
  return [
    message, 
    setMessage, 
    { clear: clearMessage }
  ] as const;
};

// 用户 hook
export const useUser = () => {
  const user = useComparisonStore(state => state.user);
  const setUser = useComparisonStore(state => state.setUser);
  const clearUser = useComparisonStore(state => state.clearUser);
  const updateUserAge = useComparisonStore(state => state.updateUserAge);
  const getUserInfo = useComparisonStore(state => state.getUserInfo);
  
  return [
    user, 
    setUser, 
    { 
      clear: clearUser, 
      updateAge: updateUserAge, 
      info: getUserInfo() 
    }
  ] as const;
};

// 主题 hook
export const useTheme = () => {
  const theme = useComparisonStore(state => state.theme);
  const setTheme = useComparisonStore(state => state.setTheme);
  const toggleTheme = useComparisonStore(state => state.toggleTheme);
  
  return [
    theme, 
    setTheme, 
    { toggle: toggleTheme }
  ] as const;
};

// 加载状态 hook
export const useLoading = () => {
  const isLoading = useComparisonStore(state => state.isLoading);
  const setLoading = useComparisonStore(state => state.setLoading);
  
  return [isLoading, setLoading] as const;
};

// 历史记录 hook
export const useHistory = () => {
  const history = useComparisonStore(state => state.history);
  const addToHistory = useComparisonStore(state => state.addToHistory);
  const clearHistory = useComparisonStore(state => state.clearHistory);
  const getHistoryCount = useComparisonStore(state => state.getHistoryCount);
  
  return [
    history, 
    addToHistory, 
    { 
      clear: clearHistory, 
      count: getHistoryCount() 
    }
  ] as const;
};

// 复杂操作 hook
export const useComplexAction = () => {
  const performComplexAction = useComparisonStore(state => state.performComplexAction);
  const isLoading = useComparisonStore(state => state.isLoading);
  
  return [performComplexAction, isLoading] as const;
};

// 通用的 hooks 风格工厂函数
export function createHooksStyleStore<T extends Record<string, any>>(
  selector: (state: ComparisonData) => T[keyof T],
  setter: (value: T[keyof T]) => void
) {
  return () => {
    const value = useComparisonStore(selector as any);
    return [value, setter] as const;
  };
}

// 使用工厂函数创建的 hooks
export const useCounterValue = createHooksStyleStore(
  state => state.counter,
  useComparisonStore.getState().setCounter
);

export const useMessageValue = createHooksStyleStore(
  state => state.message,
  useComparisonStore.getState().setMessage
);

// 组合 hook - 获取所有状态
export const useAllState = () => {
  const [counter, setCounter, counterActions] = useCounter();
  const [message, setMessage, messageActions] = useMessage();
  const [user, setUser, userActions] = useUser();
  const [theme, setTheme, themeActions] = useTheme();
  const [isLoading, setLoading] = useLoading();
  const [history, addToHistory, historyActions] = useHistory();
  
  return {
    counter: { value: counter, setValue: setCounter, ...counterActions },
    message: { value: message, setValue: setMessage, ...messageActions },
    user: { value: user, setValue: setUser, ...userActions },
    theme: { value: theme, setValue: setTheme, ...themeActions },
    loading: { value: isLoading, setValue: setLoading },
    history: { value: history, addValue: addToHistory, ...historyActions },
  };
}; 