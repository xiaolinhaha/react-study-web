import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Input, 
  InputNumber,
  List,
  Tag,
  Switch,
  Spin,
  Progress,
  notification
} from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  MinusOutlined,
  ReloadOutlined,
  UserOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useComparisonStore } from './store';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<number>(0);
  const [messageInput, setMessageInput] = useState<string>('');
  const [userNameInput, setUserNameInput] = useState<string>('');
  const [userAgeInput, setUserAgeInput] = useState<number>(25);

  // 使用 Zustand store (Redux 风格)
  const {
    // 状态
    counter,
    message,
    user,
    theme,
    isLoading,
    history,
    
    // 操作方法
    increment,
    decrement,
    resetCounter,
    setCounter,
    setMessage,
    clearMessage,
    setUser,
    clearUser,
    updateUserAge,
    toggleTheme,
    clearHistory,
    performComplexAction,
    
    // 计算属性
    getCounterStatus,
    getHistoryCount,
    getUserInfo,
  } = useComparisonStore();

  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleSetCounter = () => {
    setCounter(inputValue);
    setInputValue(0);
  };

  const handleSetMessage = () => {
    if (messageInput.trim()) {
      setMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleSetUser = () => {
    if (userNameInput.trim()) {
      setUser({ name: userNameInput, age: userAgeInput });
      setUserNameInput('');
      setUserAgeInput(25);
    }
  };

  const handleComplexAction = async () => {
    try {
      await performComplexAction();
      notification.success({ message: '复杂操作执行成功！' });
    } catch (error) {
      notification.error({ message: '复杂操作执行失败！' });
    }
  };

  const counterStatusColor = {
    negative: 'red',
    zero: 'default',
    positive: 'green'
  }[getCounterStatus()];

  const themeColors = {
    light: { bg: '#f0f2f5', text: '#000' },
    dark: { bg: '#141414', text: '#fff' }
  };

  return (
    <div 
      className="home-container" 
      style={{ 
        backgroundColor: themeColors[theme].bg,
        color: themeColors[theme].text,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}
    >
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
                🎯 Zustand Redux 风格演示
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary"
                icon={<LinkOutlined />}
                onClick={() => navigate(ROUTES.COMPARISON_HOOKS)}
              >
                查看 Hooks 风格页面
              </Button>
              <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 左侧：计数器操作 */}
        <Col xs={24} lg={12}>
          <Card className="welcome-card" title="🔢 计数器操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="center" align="middle">
                <Col>
                  <Title level={1} style={{ margin: 0, fontSize: '3rem' }}>
                    <Tag color={counterStatusColor} style={{ fontSize: '2rem', padding: '8px 16px' }}>
                      {counter}
                    </Tag>
                  </Title>
                </Col>
              </Row>
              
              <Row justify="center" gutter={8}>
                <Col>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={increment}
                    size="large"
                  >
                    递增
                  </Button>
                </Col>
                <Col>
                  <Button 
                    icon={<MinusOutlined />} 
                    onClick={decrement}
                    size="large"
                  >
                    递减
                  </Button>
                </Col>
                <Col>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={resetCounter}
                    size="large"
                  >
                    重置
                  </Button>
                </Col>
              </Row>

              <Row gutter={8} align="middle">
                <Col flex="auto">
                  <InputNumber
                    value={inputValue}
                    onChange={(value) => setInputValue(value || 0)}
                    style={{ width: '100%' }}
                    placeholder="输入数值"
                  />
                </Col>
                <Col>
                  <Button type="dashed" onClick={handleSetCounter}>
                    设置
                  </Button>
                </Col>
              </Row>

              <Text type="secondary">
                状态: <Tag color={counterStatusColor}>{getCounterStatus()}</Tag>
              </Text>
            </Space>
          </Card>

          {/* 用户信息操作 */}
          <Card className="welcome-card" title="👤 用户信息">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                当前用户: <strong>{getUserInfo()}</strong>
              </Text>
              
              <Row gutter={8}>
                <Col span={12}>
                  <Input
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    placeholder="用户名"
                    prefix={<UserOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    value={userAgeInput}
                    onChange={(value) => setUserAgeInput(value || 25)}
                    placeholder="年龄"
                    min={1}
                    max={100}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={4}>
                  <Button type="primary" onClick={handleSetUser} block>
                    设置
                  </Button>
                </Col>
              </Row>

              {user && (
                <Row gutter={8}>
                  <Col span={12}>
                    <InputNumber
                      value={user.age}
                      onChange={(value) => updateUserAge(value || 25)}
                      addonBefore="年龄"
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Button danger onClick={clearUser} block>
                      清除用户
                    </Button>
                  </Col>
                </Row>
              )}
            </Space>
          </Card>
        </Col>

        {/* 右侧：消息和历史 */}
        <Col xs={24} lg={12}>
          <Card className="welcome-card" title="💬 消息管理">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small" type="inner">
                <Text>{message || '暂无消息'}</Text>
              </Card>
              
              <TextArea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="输入新消息"
                rows={3}
              />
              
              <Row gutter={8}>
                <Col span={12}>
                  <Button type="primary" onClick={handleSetMessage} block>
                    设置消息
                  </Button>
                </Col>
                <Col span={12}>
                  <Button onClick={clearMessage} block>
                    清除消息
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>

          {/* 历史记录 */}
          <Card 
            className="welcome-card" 
            title={
              <Space>
                <HistoryOutlined />
                <span>操作历史 ({getHistoryCount()})</span>
              </Space>
            }
            extra={
              <Button size="small" onClick={clearHistory}>
                清空
              </Button>
            }
          >
            <List
              size="small"
              dataSource={history.slice().reverse()}
              renderItem={(item, index) => (
                <List.Item>
                  <Text style={{ fontSize: '12px' }}>
                    {item}
                  </Text>
                </List.Item>
              )}
              style={{ maxHeight: '200px', overflow: 'auto' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 底部：复杂操作演示 */}
      <Card className="welcome-card" title="⚡ 复杂异步操作">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Button 
              type="primary" 
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={handleComplexAction}
              loading={isLoading}
              block
            >
              执行复杂操作
            </Button>
          </Col>
          <Col span={16}>
            {isLoading && (
              <Space>
                <Spin />
                <Text>正在执行复杂操作，请稍候...</Text>
                <Progress percent={50} showInfo={false} />
              </Space>
            )}
            {!isLoading && (
              <Text type="secondary">
                点击按钮执行一个包含多个状态更新的异步操作
              </Text>
            )}
          </Col>
        </Row>
      </Card>

      {/* 说明文档 */}
      <Card className="welcome-card" title="📚 Redux 风格特点">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card size="small" title="🔴 Redux 风格写法" type="inner">
              <Paragraph>
                <Text code style={{ fontSize: '12px' }}>
{`// 在 store 中定义 actions
const useStore = create((set, get) => ({
  counter: 0,
  increment: () => set(state => ({ 
    counter: state.counter + 1 
  })),
  performComplexAction: async () => {
    // 复杂的异步逻辑
  }
}));

// 使用时直接调用方法
const { counter, increment } = useStore();
increment(); // 调用 store 中的方法`}
                </Text>
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" title="✨ 优势" type="inner">
              <ul>
                <li>逻辑集中在 store 中</li>
                <li>支持复杂的异步操作</li>
                <li>DevTools 调试支持</li>
                <li>持久化存储</li>
                <li>计算属性支持</li>
                <li>更适合大型应用</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ComparisonPage; 