import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// 动态虚拟滚动配置
export interface DynamicVirtualScrollConfig {
  estimatedItemHeight: number; // 预估高度
  containerHeight: number;
  overscan?: number;
  itemGap?: number; // 新增：项目之间的间距
  getItemKey?: (index: number, item: any) => string | number; // 获取项目唯一标识
}

// 动态虚拟项目
export interface DynamicVirtualItem {
  index: number;
  key: string | number;
  start: number;
  end: number;
  height: number;
  measured: boolean; // 是否已测量实际高度
}

// 项目高度缓存
interface ItemHeightCache {
  [key: string | number]: number;
}

// 可视区域范围
export interface DynamicVisibleRange {
  start: number;
  end: number;
  offsetY: number; // 顶部偏移量
}

// 改进的动态虚拟滚动Hook
export const useDynamicVirtualScroll = (
  items: any[],
  config: DynamicVirtualScrollConfig
) => {
  const {
    estimatedItemHeight,
    containerHeight,
    overscan = 5,
    itemGap = 16, // 默认16px间距
    getItemKey = (index) => index
  } = config;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const heightCache = useRef<ItemHeightCache>({});
  const measuredIndexes = useRef<Set<number>>(new Set());
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  
  // 新增：已渲染项目的索引集合
  const renderedIndexes = useRef<Set<number>>(new Set());
  
  // 新增：强制重新计算的标志
  const [forceRecalculate, setForceRecalculate] = useState(0);

  // 清理无效的缓存（当数据变化时）
  useEffect(() => {
    const validKeys = new Set(items.map((item, index) => getItemKey(index, item)));
    const cachedKeys = Object.keys(heightCache.current);
    
    cachedKeys.forEach(key => {
      if (!validKeys.has(key)) {
        delete heightCache.current[key];
      }
    });
    
    // 重置所有状态
    measuredIndexes.current = new Set();
    renderedIndexes.current = new Set();
    setForceRecalculate(prev => prev + 1);
  }, [items, getItemKey]);

  // 获取项目高度
  const getItemHeight = useCallback((index: number, item: any): number => {
    const key = getItemKey(index, item);
    return heightCache.current[key] || estimatedItemHeight;
  }, [getItemKey, estimatedItemHeight]);

  // 设置项目高度
  const setItemHeight = useCallback((index: number, item: any, height: number) => {
    const key = getItemKey(index, item);
    const currentHeight = heightCache.current[key];
    
    if (currentHeight !== height) {
      heightCache.current[key] = height;
      measuredIndexes.current.add(index);
      renderedIndexes.current.add(index);
      
      // 触发重新计算
      setForceRecalculate(prev => prev + 1);
    }
  }, [getItemKey]);

  // 计算项目位置信息 - 加上间距
  const itemPositions = useMemo(() => {
    const positions: DynamicVirtualItem[] = [];
    let currentTop = 0;

    // 首次渲染时，先计算可视区域的项目
    if (renderedIndexes.current.size === 0) {
      const initialVisibleCount = Math.ceil(containerHeight / (estimatedItemHeight + itemGap)) + overscan * 2;
      const endIndex = Math.min(items.length - 1, initialVisibleCount);
      
      for (let i = 0; i <= endIndex; i++) {
        const item = items[i];
        const key = getItemKey(i, item);
        const height = estimatedItemHeight; // 首次使用预估高度
        
        positions.push({
          index: i,
          key,
          start: currentTop,
          end: currentTop + height,
          height,
          measured: false
        });
        
        currentTop += height + itemGap; // 加上间距
      }
      
      return positions;
    }

    // 后续渲染：计算所有项目的位置
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = getItemKey(i, item);
      const height = getItemHeight(i, item);
      const measured = measuredIndexes.current.has(i);

      positions.push({
        index: i,
        key,
        start: currentTop,
        end: currentTop + height,
        height,
        measured
      });

      currentTop += height + itemGap; // 加上间距
    }

    return positions;
  }, [items, getItemHeight, getItemKey, containerHeight, estimatedItemHeight, overscan, itemGap, forceRecalculate]);

  // 总高度
  const totalHeight = useMemo(() => {
    return itemPositions.length > 0 
      ? itemPositions[itemPositions.length - 1].end 
      : 0;
  }, [itemPositions]);

  // 二分查找找到滚动位置对应的项目索引
  const findItemIndexByScrollTop = useCallback((scrollTop: number): number => {
    if (itemPositions.length === 0) return 0;
    
    let left = 0;
    let right = itemPositions.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const position = itemPositions[mid];

      if (position.start <= scrollTop && scrollTop < position.end) {
        return mid;
      } else if (position.end <= scrollTop) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return Math.min(left, itemPositions.length - 1);
  }, [itemPositions]);

  // 计算可视区域范围
  const visibleRange = useMemo((): DynamicVisibleRange => {
    if (itemPositions.length === 0) {
      return { start: 0, end: 0, offsetY: 0 };
    }

    const startIndex = findItemIndexByScrollTop(scrollTop);
    const endScrollTop = scrollTop + containerHeight;
    let endIndex = findItemIndexByScrollTop(endScrollTop);

    // 确保 endIndex 不超出范围
    if (endIndex < itemPositions.length - 1 && 
        itemPositions[endIndex].end < endScrollTop) {
      endIndex++;
    }

    // 添加 overscan
    const startWithOverscan = Math.max(0, startIndex - overscan);
    const endWithOverscan = Math.min(itemPositions.length - 1, endIndex + overscan);

    return {
      start: startWithOverscan,
      end: endWithOverscan,
      offsetY: startWithOverscan > 0 ? itemPositions[startWithOverscan].start : 0
    };
  }, [scrollTop, containerHeight, itemPositions, findItemIndexByScrollTop, overscan]);

  // 可视区域的虚拟项目
  const virtualItems = useMemo(() => {
    const result: DynamicVirtualItem[] = [];
    
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      if (itemPositions[i]) {
        result.push(itemPositions[i]);
        // 标记为已渲染
        renderedIndexes.current.add(i);
      }
    }
    
    return result;
  }, [visibleRange, itemPositions]);

  // 滚动事件处理
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 设置新的定时器，在停止滚动后重置状态
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 重新测量指定项目
  const remeasureItem = useCallback((index: number) => {
    if (items[index]) {
      const key = getItemKey(index, items[index]);
      delete heightCache.current[key];
      measuredIndexes.current.delete(index);
      setForceRecalculate(prev => prev + 1);
    }
  }, [items, getItemKey]);

  // 重新测量所有项目
  const remeasureAll = useCallback(() => {
    heightCache.current = {};
    measuredIndexes.current = new Set();
    renderedIndexes.current = new Set();
    setForceRecalculate(prev => prev + 1);
  }, []);

  return {
    virtualItems,
    totalHeight,
    visibleRange,
    isScrolling,
    handleScroll,
    setItemHeight,
    remeasureItem,
    remeasureAll,
    getItemHeight
  };
};

// 动态数据管理Hook
export const useDynamicData = <T extends { id: string | number }>() => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  // 新增项目
  const addItem = useCallback((item: T, index?: number) => {
    setData(prevData => {
      const newData = [...prevData];
      if (index !== undefined && index >= 0 && index <= newData.length) {
        newData.splice(index, 0, item);
      } else {
        newData.push(item);
      }
      return newData;
    });
  }, []);

  // 删除项目
  const removeItem = useCallback((id: string | number) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  }, []);

  // 批量删除
  const removeItems = useCallback((ids: (string | number)[]) => {
    const idsSet = new Set(ids);
    setData(prevData => prevData.filter(item => !idsSet.has(item.id)));
  }, []);

  // 更新项目
  const updateItem = useCallback((id: string | number, updates: Partial<T>) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  // 移动项目
  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setData(prevData => {
      if (fromIndex < 0 || fromIndex >= prevData.length || 
          toIndex < 0 || toIndex >= prevData.length) {
        return prevData;
      }

      const newData = [...prevData];
      const [movedItem] = newData.splice(fromIndex, 1);
      newData.splice(toIndex, 0, movedItem);
      return newData;
    });
  }, []);

  // 批量生成数据
  const generateData = useCallback(async (count: number, generator: (index: number) => T) => {
    setLoading(true);
    
    try {
      // 分批生成，避免阻塞UI
      const batchSize = 1000;
      const newData: T[] = [];
      
      for (let i = 0; i < count; i += batchSize) {
        const batchEnd = Math.min(i + batchSize, count);
        const batch: T[] = [];
        
        for (let j = i; j < batchEnd; j++) {
          batch.push(generator(j));
        }
        
        newData.push(...batch);
        
        // 让出执行权，避免长时间阻塞
        if (i + batchSize < count) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      setData(newData);
    } catch (error) {
      console.error('Failed to generate data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 清空数据
  const clearData = useCallback(() => {
    setData([]);
  }, []);

  // 搜索数据
  const searchData = useCallback((predicate: (item: T) => boolean) => {
    return data.filter(predicate);
  }, [data]);

  return {
    data,
    loading,
    setData,
    addItem,
    removeItem,
    removeItems,
    updateItem,
    moveItem,
    generateData,
    clearData,
    searchData
  };
}; 