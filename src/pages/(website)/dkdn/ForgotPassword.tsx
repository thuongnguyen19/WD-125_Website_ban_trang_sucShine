import { Button, Card, Form, Input, message, Spin } from 'antd';
import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../configs/axios';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [messageAPI, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const handleSubmit = async (values: { email: string }) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/forgotpassword', values);
            messageAPI.success('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!');
            navigate('/');
            
        } catch (error: any) {
            message.error(error.response?.data?.messageAPI || 'Đã có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };
    
  return (
    <div>
        {contextHolder}
        <div className="register-container">
                <Card
                    className="register-card"
                    title="Quên mật khẩu"
                    bordered={false}
                >
                    <Spin spinning={loading}>
                        <Form
                            name="register"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={handleSubmit}
                            autoComplete="off"
                        >
                            

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập email!",
                                    },
                                    {
                                        type: "email",
                                        message: "Viết đúng định dạng email!",
                                    },
                                ]}
                            >
                                <Input className="custom-input" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="custom-btn"
                                    disabled={loading}
                                >
                                    Gửi yêu cầu
                                </Button>
                            </Form.Item>

                        
                        </Form>
                    </Spin>
                </Card>
            </div>
    </div>
  )
}

export default ForgotPassword