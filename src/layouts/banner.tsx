import React, { useState } from "react";
import { Form, Input, Button, Radio, notification } from "antd";
import axios from "axios";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

// Interface cho dữ liệu từ form
interface BannerFormValues {
    name: string; // Tên người dùng
    phone: string; // Số điện thoại người dùng
    email: string; // Email người dùng
    location: string; // Vị trí (lựa chọn địa chỉ quảng cáo)
    duration: string; // Thời gian đăng ký (1, 3, 6, 12 tháng)
}

const Banner = () => {
    const [price, setPrice] = useState<number>(0); // Dùng để lưu giá

    // Hàm xử lý khi người dùng submit form
    const onFinish = async (values: BannerFormValues) => {
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                notification.error({
                    message: "Lỗi",
                    description: "Vui lòng đăng nhập để tiếp tục.",
                });
                return;
            }

            const response = await axios.post(
                "http://127.0.0.1:8000/api/addAdsService",
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            console.log("API Response Full Data:", response.data);

            if (response.data.status && response.data.data) {
                console.log("Redirecting to:", response.data.data);
                window.location.href = response.data.data; // Chuyển hướng đến URL thanh toán
            } else {
                console.log("Payment URL missing:", response.data.data);
                notification.error({
                    message: "Lỗi",
                    description:
                        response.data.message ||
                        "Không tìm thấy URL thanh toán. Vui lòng thử lại!",
                });
            }

            if (response.data.status) {
                setPrice(response.data.data.price); // Cập nhật giá từ response
                notification.success({
                    message: "Đăng ký thành công",
                    description:
                        "Bạn đã đăng ký dịch vụ quảng cáo Banner Ads thành công!",
                });
            }
        } catch (error: any) {
            console.error("Error during registration:", error);

            if (axios.isAxiosError(error) && error.response) {
                console.error("Error response:", error.response);
            }

            notification.error({
                message: "Lỗi hệ thống",
                description: "Đã có lỗi xảy ra. Vui lòng thử lại!",
            });
        }
    };

    return (
        <div>
            <Header/>
            <div className="tf-page-title">
                <div className="container-full">
                    <div className="heading text-center">
                        Đăng kí dịch vụ cửa hàng
                    </div>
                </div>
            </div>

            <div
                className="container"
                style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
            >
                <Form
                    name="banner-form"
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{ duration: "1", location: "1" }}
                >
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên của bạn!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập email của bạn!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Vị trí"
                        name="location"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn địa chỉ!",
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="1">Vị trí 1</Radio>
                            <Radio value="2">Vị trí 2</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Thời gian quảng cáo"
                        name="duration"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn thời gian thuê!",
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="1h">1 Giờ</Radio>
                            <Radio value="12h">12 Giờ</Radio>
                            <Radio value="1d">1 Ngày</Radio>
                            <Radio value="1w">1 Tuần</Radio>
                            <Radio value="1m">1 Tháng</Radio>
                            <Radio value="6m">6 Tháng</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Đăng ký dịch vụ
                    </Button>
                </Form>

                {price > 0 && (
                    <div className="mt-3">
                        <p>Giá dịch vụ: {price} VND</p>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default Banner;
