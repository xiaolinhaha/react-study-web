import { create } from 'zustand';

// 🟢 简单版本 - 类似 react-hooks-global-state 的风格
export const useSimpleStore = create<{
  count: number;
  setCount: (count: number) => void;
}>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
}));

// 🔥 复杂版本 - 展示 Zustand 的强大功能
interface ComplexState {
  // 状态
  count: number;
  history: number[];
  maxHistory: number;
  
  // 基础操作
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (count: number) => void;
  
  // 高级功能
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  
  // 计算属性
  canUndo: () => boolean;
  canRedo: () => boolean;
  getAverage: () => number;
}

export const useComplexStore = create<ComplexState>((set, get) => ({
  // 初始状态
  count: 0,
  history: [0],
  maxHistory: 10,
  
  // 基础操作
  increment: () => {
    const newCount = get().count + 1;
    set((state) => ({
      count: newCount,
      history: [...state.history.slice(-state.maxHistory + 1), newCount]
    }));
  },
  
  decrement: () => {
    const newCount = get().count - 1;
    set((state) => ({
      count: newCount,
      history: [...state.history.slice(-state.maxHistory + 1), newCount]
    }));
  },
  
  reset: () => {
    set((state) => ({
      count: 0,
      history: [...state.history.slice(-state.maxHistory + 1), 0]
    }));
  },
  
  setCount: (count: number) => {
    set((state) => ({
      count,
      history: [...state.history.slice(-state.maxHistory + 1), count]
    }));
  },
  
  // 高级功能
  undo: () => {
    const { history } = get();
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousCount = newHistory[newHistory.length - 1];
      set({
        count: previousCount,
        history: newHistory
      });
    }
  },
  
  redo: () => {
    // 这里简化了 redo 逻辑，实际项目中需要更复杂的实现
    console.log('Redo functionality would be implemented here');
  },
  
  clearHistory: () => {
    set({
      history: [get().count]
    });
  },
  
  // 计算属性
  canUndo: () => get().history.length > 1,
  canRedo: () => false, // 简化实现
  getAverage: () => {
    const { history } = get();
    return history.reduce((sum, val) => sum + val, 0) / history.length;
  },
})); 