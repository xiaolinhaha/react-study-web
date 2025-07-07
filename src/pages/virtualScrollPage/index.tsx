import React from 'react';
import './index.scss';
import DynamicVirtualContainer from '@/pages/components/dynamicVirtualContainer/index';

const VirtualScrollPage: React.FC = () => {
  return (
    <div className="virtual-scroll-page">
      
      <div className="content-area">
        {/* 左侧功能说明 */}
        <div className="left-panel">
          <div className="feature-description">
            <div className="description-content">
              <h3>🔥 动态高度虚拟滚动特性</h3>
              <ul>
                <li>✅ 支持动态高度项目</li>
                <li>✅ 高度自动测量和缓存</li>
                <li>✅ 完整的CRUD操作</li>
                <li>✅ 批量操作支持</li>
                <li>✅ 项目编辑和重新测量</li>
                <li>✅ 滚动性能优化</li>
              </ul>
            </div>
          </div>

          {/* 技术说明 */}
          <div className="tech-description">
            <h4>🛠️ 技术实现</h4>
            <div className="tech-items">
              <div className="tech-item">
                <strong>动态高度测量</strong>
                <p>使用 ResizeObserver 自动测量每个项目的实际高度</p>
              </div>
              <div className="tech-item">
                <strong>智能缓存</strong>
                <p>基于项目ID的高度缓存，数据变化时自动清理</p>
              </div>
              <div className="tech-item">
                <strong>二分查找</strong>
                <p>快速定位滚动位置对应的项目索引</p>
              </div>
              <div className="tech-item">
                <strong>批量操作</strong>
                <p>支持大量数据的增删改查，分批处理避免阻塞</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧虚拟列表演示 */}
        <div className="right-panel">
          <div className="demo-section">
            <DynamicVirtualContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualScrollPage; 