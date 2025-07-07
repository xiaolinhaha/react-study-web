import { useState, useEffect, useCallback, useMemo } from 'react';

// 虚拟滚动配置接口
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // 预渲染的额外项目数量
}

// 虚拟滚动项目接口
export interface VirtualItem {
  index: number;
  start: number;
  end: number;
}

// 可视区域范围接口
export interface VisibleRange {
  start: number;
  end: number;
}

// 虚拟滚动hook
export const useVirtualScroll = (
  itemCount: number,
  config: VirtualScrollConfig
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const { itemHeight, containerHeight, overscan = 5 } = config;

  // 计算可视区域的项目范围
  const visibleRange = useMemo((): VisibleRange => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      itemCount - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    );

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(itemCount - 1, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  // 计算虚拟项目列表
  const virtualItems = useMemo((): VirtualItem[] => {
    const items: VirtualItem[] = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight
      });
    }
    return items;
  }, [visibleRange, itemHeight]);

  // 总高度
  const totalHeight = useMemo(() => itemCount * itemHeight, [itemCount, itemHeight]);

  // 滚动事件处理
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    handleScroll,
    visibleRange
  };
};

// 大数据生成hook
export const useBigData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 生成大量数据
  const generateData = useCallback(async (count: number) => {
    setLoading(true);
    
    // 模拟异步数据生成
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newData = Array.from({ length: count }, (_, index) => ({
      id: index,
      name: `Item ${index + 1}`,
      value: Math.floor(Math.random() * 1000),
      description: `This is description for item ${index + 1}`,
      timestamp: new Date().toISOString(),
      category: ['Category A', 'Category B', 'Category C'][index % 3]
    }));
    
    setData(newData);
    setLoading(false);
  }, []);

  // 清空数据
  const clearData = useCallback(() => {
    setData([]);
  }, []);

  return {
    data,
    loading,
    generateData,
    clearData
  };
};

// 性能监控hook
export const usePerformanceMonitor = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState<number | null>(null);

  useEffect(() => {
    const now = performance.now();
    setRenderCount(prev => prev + 1);
    setLastRenderTime(now);
  });

  const resetCounters = useCallback(() => {
    setRenderCount(0);
    setLastRenderTime(null);
  }, []);

  return {
    renderCount,
    lastRenderTime,
    resetCounters
  };
}; 