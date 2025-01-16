import { Button, Card, Form, Input, message, Spin } from 'antd';
import axios from 'axios';
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../configs/axios';

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [messageAPI, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        try {
            setLoading(true);
            await axiosInstance.post(`/resetpassword/${token}`, {
                password: values.password,
                password_confirmation: values.confirmPassword
            });
            messageAPI.success('Mật khẩu của bạn đã được đặt lại thành công.');
            navigate('/login');
        } catch (error: any) {
            messageAPI.error(error.response?.data?.message || 'Đã có lỗi xảy ra!');
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
                    title="Đăng kí tài khoản"
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
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu!",
                                    },
                                    {
                                        min: 8,
                                        message:
                                            "Mật khẩu phải có ít nhất 8 ký tự!",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password className="custom-input" />
                            </Form.Item>

                            <Form.Item
                                label="Nhập lại mật khẩu"
                                name="confirmPassword"
                                dependencies={["password"]}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập lại mật khẩu!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("password") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "Mật khẩu không khớp!",
                                                ),
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password className="custom-input" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="custom-btn"
                                    disabled={loading}
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>

                        
                        </Form>
                    </Spin>
                </Card>
            </div>
    </div>
  )
}

export default ResetPassword