import React from 'react';
import { Card, Button, Typography, Space, Avatar, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, CodeOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const { Title, Text, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const features = [
    {
      title: '父子组件传值',
      description: '使用React Hooks和函数式组件构建父子组件传值',
      icon: <CodeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: ROUTES.PARENT
    },
    {
      title: 'Zustand Redux 风格',
      description: '使用 Zustand 的 Redux 风格进行状态管理',
      icon: <CodeOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      path: ROUTES.COMPARISON
    },
    {
      title: 'Zustand Hooks 风格',
      description: '使用 Zustand 的 Hooks 风格，实时联动演示',
      icon: <CodeOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
      path: ROUTES.COMPARISON_HOOKS
    },
    {
      title: '虚拟滚动大数据渲染',
      description: '只渲染可视区域组件，高性能处理大量数据',
      icon: <CodeOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: ROUTES.VIRTUAL_SCROLL
    },
  ];

  return (
    <div className="home-container">
      {/* 头部用户信息 */}
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="middle">
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  欢迎回来，{user?.username}！
                </Title>
                <Text type="secondary">{user?.email}</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                onClick={() => navigate(ROUTES.PROFILE)}
              >
                个人中心
              </Button>
              <Button 
                type="primary" 
                danger 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                退出登录
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 项目特性 */}
      <Card className="welcome-card" title="项目特性">
        <Row gutter={[16, 16]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card size="small" hoverable onClick={() => navigate(feature.path)}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  {feature.icon}
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ textAlign: 'center', margin: 0 }}>
                    {feature.description}
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default HomePage; 