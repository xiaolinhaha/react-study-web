import React, { useState } from 'react';
import { Card, Button, Input, Space, Typography, Avatar } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ChildPageProps {
  data: {
    name: string;
    age: number;
    message?: string;
  };
  onCallback?: (message: string) => void;
}

const ChildPage: React.FC<ChildPageProps> = ({ data, onCallback }) => {
  const [childInput, setChildInput] = useState('');

  const handleSendToParent = () => {
    if (childInput.trim() && onCallback) {
      onCallback(childInput);
      setChildInput('');
    }
  };

  return (
    <Card 
      size="small" 
      title={
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>子组件</span>
        </Space>
      }
      extra={<MessageOutlined />}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>接收到的父组件数据:</Text>
          <div style={{ 
            background: '#f6f6f6', 
            padding: '12px', 
            borderRadius: '6px',
            marginTop: '8px'
          }}>
            <Text>姓名: <Text code>{data.name}</Text></Text><br />
            <Text>年龄: <Text code>{data.age}</Text></Text><br />
            <Text>消息: <Text type="success">{data.message || '无消息'}</Text></Text>
          </div>
        </div>

        <div>
          <Text strong>向父组件发送消息:</Text>
          <Input
            value={childInput}
            onChange={(e) => setChildInput(e.target.value)}
            placeholder="输入要发送给父组件的消息"
            onPressEnter={handleSendToParent}
            style={{ marginTop: '8px' }}
          />
          <Button 
            type="primary" 
            size="small"
            onClick={handleSendToParent}
            disabled={!childInput.trim()}
            style={{ marginTop: '8px' }}
          >
            发送给父组件
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default ChildPage;