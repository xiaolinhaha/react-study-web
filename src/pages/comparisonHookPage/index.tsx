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
  notification,
  Alert
} from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  MinusOutlined,
  ReloadOutlined,
  UserOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { 
  useCounter, 
  useMessage, 
  useUser, 
  useTheme, 
  useLoading,
  useHistory,
  useComplexAction,
  useAllState
} from './hooks';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ComparisonHookPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<number>(0);
  const [messageInput, setMessageInput] = useState<string>('');
  const [userNameInput, setUserNameInput] = useState<string>('');
  const [userAgeInput, setUserAgeInput] = useState<number>(25);

  // 🟢 使用 Hooks 风格的 API (类似 react-hooks-global-state)
  const [counter, setCounter, counterActions] = useCounter();
  const [message, setMessage, messageActions] = useMessage();
  const [user, setUser, userActions] = useUser();
  const [theme, setTheme, themeActions] = useTheme();
  const [isLoading, setLoading] = useLoading();
  const [history, addToHistory, historyActions] = useHistory();
  const [performComplexAction, complexLoading] = useComplexAction();

  // 演示组合 hook 的使用
  const allState = useAllState();

  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleSetCounter = () => {
    setCounter(inputValue); // 类似 useState 的用法
    setInputValue(0);
  };

  const handleSetMessage = () => {
    if (messageInput.trim()) {
      setMessage(messageInput); // 类似 useState 的用法
      setMessageInput('');
    }
  };

  const handleSetUser = () => {
    if (userNameInput.trim()) {
      setUser({ name: userNameInput, age: userAgeInput }); // 类似 useState 的用法
      setUserNameInput('');
      setUserAgeInput(25);
    }
  };

  const handleComplexAction = async () => {
    try {
      await performComplexAction();
      notification.success({ message: 'Hooks 风格：复杂操作执行成功！' });
    } catch (error) {
      notification.error({ message: 'Hooks 风格：复杂操作执行失败！' });
    }
  };

  const counterStatusColor = {
    negative: 'red',
    zero: 'default',
    positive: 'green'
  }[counterActions.status];

  const themeColors = {
    light: { bg: '#f9f9f9', text: '#000' },
    dark: { bg: '#1f1f1f', text: '#fff' }
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
                🎯 Hooks 风格演示 (实时联动)
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary"
                icon={<LinkOutlined />}
                onClick={() => navigate(ROUTES.COMPARISON)}
              >
                查看 Redux 风格页面
              </Button>
              <Switch
                checked={theme === 'dark'}
                onChange={themeActions.toggle} // 使用 hooks 风格的 API
                checkedChildren="🌙"
                unCheckedChildren="☀️"
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 实时同步提示 */}
      <Alert
        message="🔄 实时同步"
        description="这个页面与 Redux 风格页面共享同一个 Zustand store，所有状态变化都会实时同步！试试在两个页面之间切换操作。"
        type="info"
        showIcon
        icon={<SyncOutlined spin />}
        style={{ marginBottom: 16 }}
      />

      <Row gutter={[16, 16]}>
        {/* 左侧：计数器操作 */}
        <Col xs={24} lg={12}>
          <Card className="welcome-card" title="🔢 计数器操作 (Hooks 风格)">
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
                    onClick={counterActions.increment} // hooks 风格
                    size="large"
                  >
                    递增
                  </Button>
                </Col>
                <Col>
                  <Button 
                    icon={<MinusOutlined />} 
                    onClick={counterActions.decrement} // hooks 风格
                    size="large"
                  >
                    递减
                  </Button>
                </Col>
                <Col>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={counterActions.reset} // hooks 风格
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
                状态: <Tag color={counterStatusColor}>{counterActions.status}</Tag>
              </Text>

              <Card size="small" type="inner" title="Hooks 风格代码">
                <Text code style={{ fontSize: '11px' }}>
{`// 类似 react-hooks-global-state 的用法
const [counter, setCounter, actions] = useCounter();
setCounter(10); // 类似 useState
actions.increment(); // 额外的操作方法`}
                </Text>
              </Card>
            </Space>
          </Card>

          {/* 用户信息操作 */}
          <Card className="welcome-card" title="👤 用户信息 (Hooks 风格)">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                当前用户: <strong>{userActions.info}</strong>
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
                      onChange={(value) => userActions.updateAge(value || 25)} // hooks 风格
                      addonBefore="年龄"
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Button danger onClick={userActions.clear} block> {/* hooks 风格 */}
                      清除用户
                    </Button>
                  </Col>
                </Row>
              )}

              <Card size="small" type="inner" title="Hooks 风格代码">
                <Text code style={{ fontSize: '11px' }}>
{`const [user, setUser, actions] = useUser();
setUser({ name: 'John', age: 25 }); // 类似 useState
actions.updateAge(30); // 专门的操作方法
actions.clear(); // 清除操作`}
                </Text>
              </Card>
            </Space>
          </Card>
        </Col>

        {/* 右侧：消息和历史 */}
        <Col xs={24} lg={12}>
          <Card className="welcome-card" title="💬 消息管理 (Hooks 风格)">
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
                  <Button onClick={messageActions.clear} block> {/* hooks 风格 */}
                    清除消息
                  </Button>
                </Col>
              </Row>

              <Card size="small" type="inner" title="Hooks 风格代码">
                <Text code style={{ fontSize: '11px' }}>
{`const [message, setMessage, actions] = useMessage();
setMessage('新消息'); // 类似 useState
actions.clear(); // 清除操作`}
                </Text>
              </Card>
            </Space>
          </Card>

          {/* 历史记录 */}
          <Card 
            className="welcome-card" 
            title={
              <Space>
                <HistoryOutlined />
                <span>操作历史 ({historyActions.count})</span>
              </Space>
            }
            extra={
              <Button size="small" onClick={historyActions.clear}> {/* hooks 风格 */}
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
      <Card className="welcome-card" title="⚡ 复杂异步操作 (Hooks 风格)">
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
                <Text>Hooks 风格：正在执行复杂操作...</Text>
                <Progress percent={50} showInfo={false} />
              </Space>
            )}
            {!isLoading && (
              <Space direction="vertical">
                <Text type="secondary">
                  点击按钮执行复杂操作（与 Redux 风格页面共享同一个异步操作）
                </Text>
                <Text code style={{ fontSize: '11px' }}>
{`const [performAction, isLoading] = useComplexAction();
await performAction(); // 类似 useState 的用法`}
                </Text>
              </Space>
            )}
          </Col>
        </Row>
      </Card>

      {/* 组合 Hook 演示 */}
      <Card className="welcome-card" title="🎯 组合 Hook 演示">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card size="small" title="🟢 Hooks 风格特点" type="inner">
              <Paragraph>
                <Text code style={{ fontSize: '12px' }}>
                  {
                    `
                    // 每个状态都有独立的 hook
                    const [counter, setCounter, actions] = useCounter();
                    const [message, setMessage, msgActions] = useMessage();
                    const [user, setUser, userActions] = useUser();

                    // 或者使用组合 hook
                    const allState = useAllState();
                    console.log(allState.counter.value); // ${allState.counter.value}
                    `
                  }
                </Text>
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" title="✨ 优势对比" type="inner">
              <ul>
                <li>✅ API 与 useState 完全一致</li>
                <li>✅ 学习成本低，符合 React 习惯</li>
                <li>✅ 每个状态独立管理</li>
                <li>✅ 与 react-hooks-global-state 兼容</li>
                <li>⚠️ 复杂逻辑需要额外封装</li>
                <li>⚠️ 状态分散，需要额外组织</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 实时同步状态展示 */}
      <Card className="welcome-card" title="🔄 实时同步状态">
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small" title="计数器" type="inner">
              <Text strong>{counter}</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="用户" type="inner">
              <Text strong>{user?.name || '未设置'}</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="主题" type="inner">
              <Text strong>{theme}</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="历史数量" type="inner">
              <Text strong>{historyActions.count}</Text>
            </Card>
          </Col>
        </Row>
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          这些状态与 Redux 风格页面完全同步，试试在两个页面间切换操作！
        </Text>
      </Card>
    </div>
  );
};

export default ComparisonHookPage;