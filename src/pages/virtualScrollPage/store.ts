import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 数据项接口
export interface DataItem {
  id: number;
  name: string;
  value: number;
  description: string;
  timestamp: string;
  category: string;
}

// 虚拟滚动配置
export interface ScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number;
}

// Store状态接口
interface VirtualScrollState {
  // 数据相关
  data: DataItem[];
  loading: boolean;
  dataCount: number;
  
  // 滚动配置
  scrollConfig: ScrollConfig;
  
  // 性能统计
  renderStats: {
    totalRenders: number;
    averageRenderTime: number;
    lastRenderTime: number;
  };
  
  // Actions
  setData: (data: DataItem[]) => void;
  generateData: (count: number) => Promise<void>;
  clearData: () => void;
  setLoading: (loading: boolean) => void;
  setDataCount: (count: number) => void;
  updateScrollConfig: (config: Partial<ScrollConfig>) => void;
  updateRenderStats: (renderTime: number) => void;
  resetRenderStats: () => void;
}

// 默认配置
const defaultScrollConfig: ScrollConfig = {
  itemHeight: 50,
  containerHeight: 600,
  overscan: 5
};

const defaultRenderStats = {
  totalRenders: 0,
  averageRenderTime: 0,
  lastRenderTime: 0
};

// 创建Store
export const useVirtualScrollStore = create<VirtualScrollState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      data: [],
      loading: false,
      dataCount: 10000,
      scrollConfig: defaultScrollConfig,
      renderStats: defaultRenderStats,

      // 设置数据
      setData: (data: DataItem[]) => {
        set({ data }, false, 'setData');
      },

      // 生成大量数据
      generateData: async (count: number) => {
        set({ loading: true }, false, 'generateData/start');
        
        try {
          // 模拟异步数据生成
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const newData: DataItem[] = Array.from({ length: count }, (_, index) => ({
            id: index,
            name: `Item ${index + 1}`,
            value: Math.floor(Math.random() * 1000),
            description: `This is description for item ${index + 1}. Generated at ${new Date().toLocaleTimeString()}`,
            timestamp: new Date().toISOString(),
            category: ['Category A', 'Category B', 'Category C', 'Category D'][index % 4]
          }));
          
          set({ 
            data: newData, 
            loading: false 
          }, false, 'generateData/success');
          
        } catch (error) {
          console.error('Failed to generate data:', error);
          set({ loading: false }, false, 'generateData/error');
        }
      },

      // 清空数据
      clearData: () => {
        set({ 
          data: [],
          renderStats: defaultRenderStats
        }, false, 'clearData');
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ loading }, false, 'setLoading');
      },

      // 设置数据数量
      setDataCount: (count: number) => {
        set({ dataCount: count }, false, 'setDataCount');
      },

      // 更新滚动配置
      updateScrollConfig: (config: Partial<ScrollConfig>) => {
        set(state => ({
          scrollConfig: { ...state.scrollConfig, ...config }
        }), false, 'updateScrollConfig');
      },

      // 更新渲染统计
      updateRenderStats: (renderTime: number) => {
        set(state => {
          const newTotalRenders = state.renderStats.totalRenders + 1;
          const newAverageRenderTime = 
            (state.renderStats.averageRenderTime * state.renderStats.totalRenders + renderTime) 
            / newTotalRenders;

          return {
            renderStats: {
              totalRenders: newTotalRenders,
              averageRenderTime: newAverageRenderTime,
              lastRenderTime: renderTime
            }
          };
        }, false, 'updateRenderStats');
      },

      // 重置渲染统计
      resetRenderStats: () => {
        set({ 
          renderStats: defaultRenderStats 
        }, false, 'resetRenderStats');
      }
    }),
    {
      name: 'virtual-scroll-store',
      // 只在开发环境启用devtools
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 选择器函数，用于性能优化
export const selectData = (state: VirtualScrollState) => state.data;
export const selectLoading = (state: VirtualScrollState) => state.loading;
export const selectScrollConfig = (state: VirtualScrollState) => state.scrollConfig;
export const selectRenderStats = (state: VirtualScrollState) => state.renderStats; 