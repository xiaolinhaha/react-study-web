import React from 'react';
import { Card, Button, Typography, Space, Avatar, Row, Col, Form, Input, Divider, Statistic } from 'antd';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleSaveProfile = (values: any) => {
    console.log('保存个人信息:', values);
    // 这里可以添加保存个人信息的逻辑
  };

  return (
    <div className="home-container">
      {/* 头部导航 */}
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              个人中心
            </Title>
          </Col>
          <Col>
            <Space>
              <Button onClick={handleGoHome}>
                返回首页
              </Button>
              <Button 
                type="primary" 
                danger 
                onClick={handleLogout}
              >
                退出登录
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 用户信息卡片 */}
      <Card className="welcome-card" title="用户信息">
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={120} icon={<UserOutlined />} />
              <div style={{ marginTop: 16 }}>
                <Title level={4}>{user?.username}</Title>
                <Text type="secondary">{user?.email}</Text>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={16}>
            <Form
              layout="vertical"
              onFinish={handleSaveProfile}
              initialValues={{
                username: user?.username,
                email: user?.email,
                phone: '',
                address: '',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱！' },
                      { type: 'email', message: '请输入有效的邮箱地址！' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="手机号"
                    name="phone"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="地址"
                    name="address"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                >
                  保存信息
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      {/* 账户统计 */}
      <Card className="welcome-card" title="账户统计">
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small">
              <Statistic title="登录次数" value={12} />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic title="在线时长" value="2.5小时" />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic title="最后登录" value="今天" />
            </Card>
          </Col>
        </Row>
      </Card>
      
      <Divider />
      
      <Card className="welcome-card" title="功能说明">
        <Text>
          这是一个示例的个人中心页面，展示了如何轻松地在路由配置中添加新页面：
        </Text>
        <ul style={{ marginTop: 16 }}>
          <li>在 <code>src/pages/</code> 目录下创建新的页面组件</li>
          <li>在 <code>src/constants/routes.ts</code> 中添加新的路由路径</li>
          <li>在 <code>src/router/index.tsx</code> 中的路由配置数组里添加新路由</li>
          <li>所有的路由保护和导航逻辑都会自动生效</li>
        </ul>
      </Card>
    </div>
  );
};

export default ProfilePage; 