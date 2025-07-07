import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 数据接口
interface ChildData {
  name: string;
  age: number;
  message: string;
}

// 消息历史接口
interface MessageHistory {
  id: string;
  from: 'parent' | 'child';
  message: string;
  timestamp: number;
}

// Store 状态接口
interface ParentChildState {
  // 状态
  childData: ChildData;
  messageHistory: MessageHistory[];
  
  // 动作
  updateChildData: (data: Partial<ChildData>) => void;
  addMessage: (from: 'parent' | 'child', message: string) => void;
  clearHistory: () => void;
  
  // 计算属性（selectors）
  getMessageCount: () => number;
  getLatestMessage: () => MessageHistory | null;
}

// 创建 parent-child store
export const useParentChildStore = create<ParentChildState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      childData: {
        name: 'John',
        age: 30,
        message: '这是来自父组件的消息'
      },
      messageHistory: [],

      // 更新子组件数据
      updateChildData: (data: Partial<ChildData>) => {
        set(
          (state) => ({
            childData: { ...state.childData, ...data }
          }),
          false,
          'updateChildData'
        );
      },

      // 添加消息到历史记录
      addMessage: (from: 'parent' | 'child', message: string) => {
        const newMessage: MessageHistory = {
          id: Date.now().toString(),
          from,
          message,
          timestamp: Date.now(),
        };

        set(
          (state) => ({
            messageHistory: [...state.messageHistory, newMessage]
          }),
          false,
          'addMessage'
        );
      },

      // 清除历史记录
      clearHistory: () => {
        set(
          { messageHistory: [] },
          false,
          'clearHistory'
        );
      },

      // 获取消息数量
      getMessageCount: () => {
        return get().messageHistory.length;
      },

      // 获取最新消息
      getLatestMessage: () => {
        const messages = get().messageHistory;
        return messages.length > 0 ? messages[messages.length - 1] : null;
      },
    }),
    {
      name: 'parent-child-store', // Redux DevTools 中显示的名称
    }
  )
); 