import React, { useState } from 'react';
import { Card, Button, Typography, Space, Row, Col, Input, message, List, Tag } from 'antd';
import { ArrowLeftOutlined, UserOutlined, ClearOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useParentChildStore } from '@/stores/parentChildStore';
import { ROUTES } from '@/constants/routes';
import ChildPage from '@/pages/components/ChildPage';
import './index.scss';

const { Title, Text } = Typography;

const ParentPage: React.FC = () => {
    const navigate = useNavigate();
    const [parentInput, setParentInput] = useState('');
    
    // 使用 Zustand stores
    const { user } = useAuthStore();
    const { 
        childData, 
        messageHistory, 
        updateChildData, 
        addMessage, 
        clearHistory,
        getMessageCount 
    } = useParentChildStore();

    const handleGoBack = () => {
        navigate(ROUTES.HOME);
    };

    const handleUpdateChild = () => {
        if (parentInput.trim()) {
            // 更新子组件数据
            updateChildData({ message: parentInput });
            // 添加到消息历史
            addMessage('parent', parentInput);
            message.success('数据已传递给子组件！');
            setParentInput('');
        }
    };

    const handleChildCallback = (childMessage: string) => {
        // 添加子组件消息到历史
        addMessage('child', childMessage);
        message.info(`子组件说: ${childMessage}`);
    };

    return (
        <div className="home-container">
            {/* 头部导航 */}
            <Card>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                onClick={handleGoBack}
                            >
                                返回首页
                            </Button>
                            <Title level={2} style={{ margin: 0 }}>
                                父子组件传值示例
                            </Title>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* 父组件控制区域 */}
            <Card className="welcome-card" title="父组件控制区域" extra={<UserOutlined />}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>当前传递给子组件的数据:</Text>
                    <Text code>{JSON.stringify(childData, null, 2)}</Text>
                    
                    <Input
                        value={parentInput}
                        onChange={(e) => setParentInput(e.target.value)}
                        placeholder="输入要传递给子组件的新消息"
                        onPressEnter={handleUpdateChild}
                    />
                    <Button type="primary" onClick={handleUpdateChild}>
                        更新子组件数据
                    </Button>
                </Space>
            </Card>

            {/* 子组件区域 */}
            <Card className="welcome-card" title="子组件区域">
                <ChildPage 
                    data={childData} 
                    onCallback={handleChildCallback}
                />
            </Card>

            {/* 说明文档 */}
            <Card className="welcome-card" title="实现原理">
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Card size="small" title="父传子 (Props Down)">
                            <ul className='list-disc'>
                                <li>通过 props 传递数据</li>
                                <li>子组件接收并展示数据</li>
                                <li>单向数据流</li>
                            </ul>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card size="small" title="子传父 (Events Up)">
                            <ul className='list-disc'>
                                <li>通过回调函数传递事件</li>
                                <li>父组件定义处理函数</li>
                                <li>子组件调用回调函数</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* 消息历史记录 */}
            <Card 
                className="welcome-card" 
                title={
                    <Space>
                        <HistoryOutlined />
                        <span>消息历史记录 ({getMessageCount()})</span>
                    </Space>
                }
                extra={
                    <Button 
                        size="small" 
                        icon={<ClearOutlined />}
                        onClick={clearHistory}
                        disabled={messageHistory.length === 0}
                    >
                        清空历史
                    </Button>
                }
            >
                {messageHistory.length === 0 ? (
                    <Text type="secondary">暂无消息历史</Text>
                ) : (
                    <List
                        size="small"
                        dataSource={messageHistory}
                        renderItem={(item) => (
                            <List.Item>
                                <Space>
                                    <Tag color={item.from === 'parent' ? 'blue' : 'green'}>
                                        {item.from === 'parent' ? '父组件' : '子组件'}
                                    </Tag>
                                    <Text>{item.message}</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                    </Text>
                                </Space>
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            {/* Zustand 使用说明 */}
            <Card className="welcome-card" title="Zustand 状态管理">
                <Space direction="vertical">
                    <Text><strong>🎉 现在使用 Zustand 进行状态管理！</strong></Text>
                    <Text>• <strong>authStore</strong>: 认证状态管理（持久化）</Text>
                    <Text>• <strong>parentChildStore</strong>: 父子组件通信（带 DevTools）</Text>
                    <Text>• <strong>优势</strong>: 更简洁的API，更好的性能，TypeScript友好</Text>
                    <Text type="success">
                        当前用户: <strong>{user?.username}</strong>
                    </Text>
                    <Text type="warning">
                        打开浏览器 DevTools 可以看到 Zustand 状态变化！
                    </Text>
                </Space>
            </Card>
        </div>
    );
};

export default ParentPage;