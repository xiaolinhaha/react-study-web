import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useDynamicVirtualScroll, useDynamicData } from '@/pages/virtualScrollPage/enhancedHooks';
import './index.scss';

// 子项目类型
interface SubItem {
  id: string;
  title: string;
  content: string;
  status: 'active' | 'pending' | 'completed' | 'error';
  progress?: number;
  tags?: string[];
  metadata?: {
    priority: 'low' | 'medium' | 'high';
    assignee?: string;
    dueDate?: string;
  };
}

// 数据项类型
interface DataItem {
  id: number;
  name: string;
  value: number;
  description: string;
  content: string; // 动态内容，长度不固定
  timestamp: string;
  category: string;
  type: 'simple' | 'complex' | 'mega'; // 复杂度类型，影响子项目数量
  subItems: SubItem[]; // 子项目列表
  expanded?: boolean; // 是否展开
  metrics?: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  };
}

// 子项目组件
const SubItemComponent: React.FC<{
  subItem: SubItem;
  onUpdate: (id: string, updates: Partial<SubItem>) => void;
  onDelete: (id: string) => void;
}> = ({ subItem, onUpdate, onDelete }) => {
  const getStatusColor = (status: SubItem['status']) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'active': return '#007bff';
      case 'pending': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="sub-item">
      <div className="sub-item-header">
        <div className="sub-item-title">
          <span className="title">{subItem.title}</span>
          <div className="badges">
            <span 
              className="status-badge" 
              style={{ backgroundColor: getStatusColor(subItem.status) }}
            >
              {subItem.status}
            </span>
            {subItem.metadata?.priority && (
              <span 
                className="priority-badge" 
                style={{ backgroundColor: getPriorityColor(subItem.metadata.priority) }}
              >
                {subItem.metadata.priority}
              </span>
            )}
          </div>
        </div>
        <div className="sub-item-actions">
          <button 
            className="mini-btn" 
            onClick={() => onUpdate(subItem.id, { 
              status: subItem.status === 'completed' ? 'active' : 'completed' 
            })}
          >
            {subItem.status === 'completed' ? '重做' : '完成'}
          </button>
          <button 
            className="mini-btn delete" 
            onClick={() => onDelete(subItem.id)}
          >
            删除
          </button>
        </div>
      </div>
      
      <div className="sub-item-content">
        <p>{subItem.content}</p>
        
        {subItem.progress !== undefined && (
          <div className="progress-container">
            <div className="progress-label">
              <span>进度: {subItem.progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${subItem.progress}%`,
                  backgroundColor: getStatusColor(subItem.status)
                }}
              />
            </div>
          </div>
        )}
        
        {subItem.tags && subItem.tags.length > 0 && (
          <div className="tags">
            {subItem.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        {subItem.metadata && (
          <div className="metadata">
            {subItem.metadata.assignee && (
              <span className="assignee">👤 {subItem.metadata.assignee}</span>
            )}
            {subItem.metadata.dueDate && (
              <span className="due-date">📅 {subItem.metadata.dueDate}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 虚拟项目组件
const VirtualItem: React.FC<{
  item: DataItem;
  index: number;
  style: React.CSSProperties;
  onHeightMeasured: (height: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  onUpdateSubItem: (subItemId: string, updates: Partial<SubItem>) => void;
  onDeleteSubItem: (subItemId: string) => void;
  isScrolling: boolean;
}> = ({ item, index, style, onHeightMeasured, onEdit, onDelete, onToggleExpand, onUpdateSubItem, onDeleteSubItem, isScrolling }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const lastHeightRef = useRef<number>(0);

  // 使用ResizeObserver进行高度监听
  useEffect(() => {
    if (!itemRef.current) return;

    const measureHeight = () => {
      if (itemRef.current) {
        const height = itemRef.current.offsetHeight;
        if (height !== lastHeightRef.current) {
          lastHeightRef.current = height;
          onHeightMeasured(height);
        }
      }
    };

    // 立即测量一次
    measureHeight();

    // 设置ResizeObserver
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(() => {
        measureHeight();
      });
      resizeObserverRef.current.observe(itemRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [onHeightMeasured]);

  // 当内容变化时重新测量
  useEffect(() => {
    if (itemRef.current) {
      const height = itemRef.current.offsetHeight;
      if (height !== lastHeightRef.current) {
        lastHeightRef.current = height;
        onHeightMeasured(height);
      }
    }
  }, [item.content, item.expanded, item.subItems, onHeightMeasured]);

  const handleEdit = useCallback(() => {
    onEdit();
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    onDelete();
  }, [onDelete]);

  const getTypeIcon = (type: DataItem['type']) => {
    switch (type) {
      case 'simple': return '📝';
      case 'complex': return '🔧';
      case 'mega': return '🚀';
      default: return '📄';
    }
  };

  const completionRate = item.metrics ? 
    Math.round((item.metrics.completedTasks / item.metrics.totalTasks) * 100) : 0;

  return (
    <div
      ref={itemRef}
      className={`dynamic-virtual-item ${item.type} ${isScrolling ? 'scrolling' : ''} ${item.expanded ? 'expanded' : ''}`}
      style={style}
    >
      <div className="item-header">
        <div className="item-title">
          <div className="title-main">
            <span className="type-icon">{getTypeIcon(item.type)}</span>
            <span className="item-name">{item.name}</span>
            <span className={`item-type ${item.type}`}>{item.type}</span>
          </div>
          <div className="item-stats">
            <span className="completion-rate">完成率: {completionRate}%</span>
            <span className="sub-count">{item.subItems.length} 个子任务</span>
          </div>
        </div>
        <div className="item-actions">
          <button 
            className="action-btn expand-btn" 
            onClick={onToggleExpand}
          >
            {item.expanded ? '收起' : '展开'}
          </button>
          <button className="action-btn edit-btn" onClick={handleEdit}>
            编辑
          </button>
          <button className="action-btn delete-btn" onClick={handleDelete}>
            删除
          </button>
        </div>
      </div>
      
      <div className="item-content">
        <div className="main-info">
          <div className="item-value">值: {item.value}</div>
          <div className="item-description">{item.description}</div>
          <div className="item-dynamic-content">{item.content}</div>
        </div>
        
        {item.metrics && (
          <div className="metrics-bar">
            <div className="metric">
              <span className="label">总任务:</span>
              <span className="value">{item.metrics.totalTasks}</span>
            </div>
            <div className="metric">
              <span className="label">已完成:</span>
              <span className="value completed">{item.metrics.completedTasks}</span>
            </div>
            <div className="metric">
              <span className="label">待处理:</span>
              <span className="value pending">{item.metrics.pendingTasks}</span>
            </div>
          </div>
        )}
        
        {item.expanded && (
          <div className="sub-items-container">
            <div className="sub-items-header">
              <h4>子任务列表</h4>
            </div>
            <div className="sub-items">
              {item.subItems.map((subItem) => (
                <SubItemComponent
                  key={subItem.id}
                  subItem={subItem}
                  onUpdate={onUpdateSubItem}
                  onDelete={onDeleteSubItem}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="item-footer">
        <span className="item-category">{item.category}</span>
        <span className="item-time">{new Date(item.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

const DynamicVirtualContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dataCount, setDataCount] = useState(1000);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // 使用动态数据管理
  const {
    data,
    loading,
    addItem,
    removeItem,
    removeItems,
    updateItem,
    generateData,
    clearData
  } = useDynamicData<DataItem>();

  // 虚拟滚动配置 - 使用更智能的预估高度
  const virtualConfig = useMemo(() => ({
    estimatedItemHeight: 300, // 调整预估高度，更接近实际平均高度
    containerHeight: 600,
    overscan: 2, // 减少overscan，提升性能
    itemGap: 16, // 项目之间的间距
    getItemKey: (index: number, item: DataItem) => item.id
  }), []);

  // 使用动态虚拟滚动
  const {
    virtualItems,
    totalHeight,
    visibleRange,
    isScrolling,
    handleScroll,
    setItemHeight,
    remeasureItem,
    remeasureAll
  } = useDynamicVirtualScroll(data, virtualConfig);

  // 生成随机内容
  const generateRandomContent = (type: 'simple' | 'complex' | 'mega'): string => {
    const sentences = [
      '这是一段描述性文本。',
      '虚拟滚动可以有效提升大列表的性能。',
      '动态高度支持让内容展示更加灵活。',
      'React Hooks提供了强大的状态管理能力。',
      'TypeScript增强了代码的可维护性。',
      '现代前端框架让开发变得更加高效。'
    ];

    let content = '';
    const sentenceCount = type === 'simple' ? 1 : type === 'complex' ? 3 : 6;
    
    for (let i = 0; i < sentenceCount; i++) {
      content += sentences[Math.floor(Math.random() * sentences.length)];
      if (i < sentenceCount - 1) content += ' ';
    }
    
    return content;
  };

  // 生成子项目
  const generateSubItems = (count: number, parentId: number): SubItem[] => {
    const statuses: SubItem['status'][] = ['active', 'pending', 'completed', 'error'];
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const taskTypes = ['设计', '开发', '测试', '部署', '优化', '文档', '审核', '修复'];
    const assignees = ['张三', '李四', '王五', '赵六', '孙七'];
    
    return Array.from({ length: count }, (_, index) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const assignee = assignees[Math.floor(Math.random() * assignees.length)];
      
      return {
        id: `${parentId}-sub-${index}`,
        title: `${taskType}任务 ${index + 1}`,
        content: `这是${taskType}相关的详细内容描述，包含了具体的任务要求和实现细节。`,
        status,
        progress: status === 'completed' ? 100 : status === 'active' ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 30),
        tags: [`${taskType}`, priority, status].slice(0, Math.floor(Math.random() * 3) + 1),
        metadata: {
          priority,
          assignee,
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      };
    });
  };

  // 生成数据
  const handleGenerateData = useCallback(async () => {
    await generateData(dataCount, (index) => {
      const types: ('simple' | 'complex' | 'mega')[] = ['simple', 'complex', 'mega'];
      const type = types[index % 3];
      const subItemCount = type === 'simple' ? 1 : type === 'complex' ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 4) + 3;
      const subItems = generateSubItems(subItemCount, index);
      
      return {
        id: index,
        name: `动态项目 ${index + 1}`,
        value: Math.floor(Math.random() * 1000),
        description: `这是第 ${index + 1} 个项目的描述`,
        content: generateRandomContent(type),
        timestamp: new Date().toISOString(),
        category: ['类别 A', '类别 B', '类别 C', '类别 D'][index % 4],
        type,
        subItems,
        expanded: Math.random() > 0.7, // 30% 概率默认展开
        metrics: {
          totalTasks: subItems.length,
          completedTasks: subItems.filter(item => item.status === 'completed').length,
          pendingTasks: subItems.filter(item => item.status === 'pending').length,
        }
      };
    });
  }, [dataCount, generateData]);

  // 添加新项目
  const handleAddItem = useCallback(() => {
    const type: 'simple' | 'complex' | 'mega' = 'complex';
    const subItems = generateSubItems(2, Date.now());
    
    const newItem: DataItem = {
      id: Date.now(),
      name: `新项目 ${Date.now()}`,
      value: Math.floor(Math.random() * 1000),
      description: '这是一个新添加的项目',
      content: generateRandomContent(type),
      timestamp: new Date().toISOString(),
      category: '新类别',
      type,
      subItems,
      expanded: true,
      metrics: {
        totalTasks: subItems.length,
        completedTasks: subItems.filter(item => item.status === 'completed').length,
        pendingTasks: subItems.filter(item => item.status === 'pending').length,
      }
    };
    addItem(newItem, 0); // 添加到顶部
  }, [addItem]);

  // 删除选中项目
  const handleDeleteSelected = useCallback(() => {
    removeItems(Array.from(selectedItems));
    setSelectedItems(new Set());
  }, [removeItems, selectedItems]);

  // 项目高度测量回调 - 添加防抖机制
  const heightMeasureTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());
  
  const handleHeightMeasured = useCallback((index: number, height: number) => {
    // 清除之前的定时器
    const existingTimeout = heightMeasureTimeouts.current.get(index);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // 设置新的防抖定时器
    const timeout = setTimeout(() => {
      if (data[index]) {
        setItemHeight(index, data[index], height);
      }
      heightMeasureTimeouts.current.delete(index);
    }, 16); // 16ms防抖，约1帧的时间
    
    heightMeasureTimeouts.current.set(index, timeout);
  }, [data, setItemHeight]);

  // 清理定时器
  useEffect(() => {
    return () => {
      heightMeasureTimeouts.current.forEach(timeout => clearTimeout(timeout));
      heightMeasureTimeouts.current.clear();
    };
  }, []);

  // 项目编辑
  const handleItemEdit = useCallback((item: DataItem) => {
    const newContent = prompt('编辑内容:', item.content);
    if (newContent !== null) {
      updateItem(item.id, { content: newContent });
      // 重新测量该项目的高度
      const index = data.findIndex(d => d.id === item.id);
      if (index !== -1) {
        remeasureItem(index);
      }
    }
  }, [updateItem, data, remeasureItem]);

  // 项目删除
  const handleItemDelete = useCallback((item: DataItem) => {
    if (window.confirm(`确定要删除 ${item.name} 吗？`)) {
      removeItem(item.id);
    }
  }, [removeItem]);

  // 切换展开/收起
  const handleToggleExpand = useCallback((item: DataItem) => {
    updateItem(item.id, { expanded: !item.expanded });
    // 重新测量该项目的高度
    const index = data.findIndex(d => d.id === item.id);
    if (index !== -1) {
      remeasureItem(index);
    }
  }, [updateItem, data, remeasureItem]);

  // 更新子项目
  const handleUpdateSubItem = useCallback((item: DataItem, subItemId: string, updates: Partial<SubItem>) => {
    const updatedSubItems = item.subItems.map(subItem => 
      subItem.id === subItemId ? { ...subItem, ...updates } : subItem
    );
    
    // 重新计算指标
    const metrics = {
      totalTasks: updatedSubItems.length,
      completedTasks: updatedSubItems.filter(subItem => subItem.status === 'completed').length,
      pendingTasks: updatedSubItems.filter(subItem => subItem.status === 'pending').length,
    };
    
    updateItem(item.id, { subItems: updatedSubItems, metrics });
    
    // 重新测量该项目的高度
    const index = data.findIndex(d => d.id === item.id);
    if (index !== -1) {
      remeasureItem(index);
    }
  }, [updateItem, data, remeasureItem]);

  // 删除子项目
  const handleDeleteSubItem = useCallback((item: DataItem, subItemId: string) => {
    const updatedSubItems = item.subItems.filter(subItem => subItem.id !== subItemId);
    
    // 重新计算指标
    const metrics = {
      totalTasks: updatedSubItems.length,
      completedTasks: updatedSubItems.filter(subItem => subItem.status === 'completed').length,
      pendingTasks: updatedSubItems.filter(subItem => subItem.status === 'pending').length,
    };
    
    updateItem(item.id, { subItems: updatedSubItems, metrics });
    
    // 重新测量该项目的高度
    const index = data.findIndex(d => d.id === item.id);
    if (index !== -1) {
      remeasureItem(index);
    }
  }, [updateItem, data, remeasureItem]);

  return (
    <div className="dynamic-virtual-container-wrapper">
      {/* 增强控制面板 */}
      <div className="enhanced-controls-panel">
        <div className="control-row">
          <div className="control-group">
            <label>数据量:</label>
            <input
              type="number"
              value={dataCount}
              onChange={(e) => setDataCount(Number(e.target.value))}
              min="0"
              max="100000"
              className="count-input"
            />
          </div>
          
          <div className="control-buttons">
            <button 
              className="btn generate-btn" 
              onClick={handleGenerateData}
              disabled={loading}
            >
              {loading ? '生成中...' : '生成数据'}
            </button>
            <button 
              className="btn add-btn" 
              onClick={handleAddItem}
              disabled={loading}
            >
              添加项目
            </button>
            <button 
              className="btn clear-btn" 
              onClick={clearData}
              disabled={loading}
            >
              清空数据
            </button>
          </div>
        </div>

        <div className="control-row">
          <div className="selected-actions">
            <span>已选择: {selectedItems.size} 项</span>
            {selectedItems.size > 0 && (
              <button 
                className="btn delete-selected-btn"
                onClick={handleDeleteSelected}
              >
                删除选中
              </button>
            )}
          </div>
          
          <div className="measure-buttons">
            <button 
              className="btn measure-btn"
              onClick={remeasureAll}
            >
              重新测量
            </button>
          </div>
        </div>
      </div>

      {/* 状态信息 */}
      <div className="enhanced-status-info">
        <div className="status-group">
          <span>总数据: {data.length.toLocaleString()}</span>
          <span>总高度: {totalHeight.toLocaleString()}px</span>
        </div>
        <div className="status-group">
          <span>可视范围: {visibleRange.start} - {visibleRange.end}</span>
          <span>渲染项: {virtualItems.length}</span>
        </div>
        <div className="status-group">
          <span>滚动状态: {isScrolling ? '滚动中' : '静止'}</span>
          <span>偏移: {visibleRange.offsetY}px</span>
        </div>
      </div>

      {/* 动态虚拟滚动容器 */}
      <div 
        ref={containerRef}
        className="dynamic-virtual-scroll-container"
        style={{ height: virtualConfig.containerHeight }}
        onScroll={handleScroll}
      >
        {/* 总高度占位 */}
        <div 
          className="virtual-total-height"
          style={{ height: totalHeight }}
        >
          {/* 渲染可视区域的项目 */}
          <div 
            className="virtual-items-container"
            style={{ transform: `translateY(${visibleRange.offsetY}px)` }}
          >
            {virtualItems.map((virtualItem) => {
              const item = data[virtualItem.index];
              if (!item) return null;

              return (
                <VirtualItem
                  key={virtualItem.key}
                  item={item}
                  index={virtualItem.index}
                  style={{
                    position: 'absolute',
                    top: virtualItem.start - visibleRange.offsetY,
                    left: 0,
                    right: 0,
                    minHeight: virtualItem.height,
                  }}
                  onHeightMeasured={(height) => handleHeightMeasured(virtualItem.index, height)}
                  onEdit={() => handleItemEdit(item)}
                  onDelete={() => handleItemDelete(item)}
                  onToggleExpand={() => handleToggleExpand(item)}
                  onUpdateSubItem={(subItemId, updates) => handleUpdateSubItem(item, subItemId, updates)}
                  onDeleteSubItem={(subItemId) => handleDeleteSubItem(item, subItemId)}
                  isScrolling={isScrolling}
                />
              );
            })}
          </div>
        </div>
        
        {/* 空状态 */}
        {data.length === 0 && !loading && (
          <div className="empty-state">
            <p>暂无数据</p>
            <p>点击"生成数据"按钮开始体验动态高度虚拟滚动</p>
          </div>
        )}
        
        {/* 加载状态 */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>正在生成数据...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicVirtualContainer; 