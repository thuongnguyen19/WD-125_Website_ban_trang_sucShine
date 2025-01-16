import React, { useEffect, useState } from "react";
import { Spin, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import axiosInstance from "../../../configs/axios";

// Định nghĩa kiểu cho sản phẩm biến thể
interface ProductVariant {
    id: number;
    image_color: string; // Ảnh màu sắc
    colors: { id: number; name: string }; // Thông tin màu sắc
    sizes: { id: number; name: string }; // Thông tin kích thước
}

// Định nghĩa kiểu cho sản phẩm
interface Product {
    id: number;
    name: string;
    thumbnail: string; // Ảnh sản phẩm
    selectedVariant: ProductVariant | null; // Biến thể đã chọn
    quantity: number; // Số lượng sản phẩm
}

// Định nghĩa kiểu cho combo
interface Combo {
    id: number;
    name: string;
    image: string; // Hình ảnh combo
    price: number; // Giá combo
    description: string; // Mô tả combo
    products: Product[]; // Danh sách sản phẩm trong combo
}

// Thành phần thanh toán Combo
const PayCombo: React.FC = () => {
    const navigate = useNavigate();

    const [paymentProducts, setPaymentProducts] = useState<Product[]>([]);
    const [combo, setCombo] = useState<Combo | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    // Trạng thái thông tin người dùng
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    // Sử dụng useEffect để lấy dữ liệu đơn hàng khi component được gắn
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            message.error("Bạn chưa đăng nhập.");
            navigate("/login");
            return;
        }

        const orderDataString = localStorage.getItem("orderData");

        if (!orderDataString) {
            message.error("Không có sản phẩm nào để thanh toán.");
            navigate("/");
            return;
        }

        const orderData = JSON.parse(orderDataString);
        const { comboId, quantity, variantIds } = orderData;

        const fetchInformationOrder = async () => {
            try {
                const response = await axiosInstance.get(
                    "http://127.0.0.1:8000/api/listInformationOrderCombo",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { comboId, quantity, variantIds },
                    },
                );

                if (response.data.status) {
                    const { productpayment, user } = response.data.data;

                    // Tự động điền thông tin người dùng
                    if (user) {
                        setName(user.name || "");
                        setEmail(user.email || "");
                        setPhoneNumber(user.phone_number || "");
                        setAddress(user.address || "");
                    }

                    setCombo(productpayment);
                    setPaymentProducts(productpayment.products || []);
                    setTotalAmount(productpayment.price || 0);
                } else {
                    message.error(response.data.message);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sản phẩm:", error);
                message.error("Có lỗi xảy ra khi lấy thông tin sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchInformationOrder();
    }, [navigate]);

    if (loading) return <Spin size="large" />;

    // Xử lý thanh toán
    const handleSubmitPayment = async (): Promise<void> => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            message.error("Bạn chưa đăng nhập.");
            return;
        }

        const paymentData = {
            name,
            email,
            phone_number: phoneNumber,
            address,
            comboId: combo?.id,
            products: paymentProducts.map((product) => ({
                id: product.id,
                variantId: product.selectedVariant?.id || null,
                quantity: product.quantity,
            })),
        };

        try {
            const response = await axiosInstance.post(
                "http://127.0.0.1:8000/api/submitPayment",
                paymentData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (response.data.status) {
                message.success("Thanh toán thành công!");
                navigate("/success");
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu thanh toán:", error);
            message.error("Có lỗi xảy ra khi gửi yêu cầu thanh toán.");
        }
    };

    return (
        <div>
            <Header />
            <div style={{ padding: "20px" }}>
                <h2>Thanh Toán Combo</h2>
                {combo && (
                    <div>
                        <h3>{combo.name}</h3>
                        <img
                            src={combo.image}
                            alt={combo.name}
                            style={{
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "cover",
                            }}
                        />
                        <p>{combo.description}</p>
                        <p>
                            Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                    </div>
                )}
                <div>
                    <h4>Thông tin người dùng</h4>
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <h4>Thông tin sản phẩm trong combo</h4>
                {paymentProducts.map((product) => (
                    <div key={product.id} style={{ marginBottom: "20px" }}>
                        <h5>
                            {product.name} (x{product.quantity})
                        </h5>
                        <img
                            src={product.thumbnail}
                            alt={product.name}
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                            }}
                        />
                        {product.selectedVariant ? (
                            <div>
                                <p>
                                    Màu sắc:{" "}
                                    {product.selectedVariant.colors.name}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "20px",
                                            height: "20px",
                                            backgroundColor:
                                                product.selectedVariant.colors,
                                            borderRadius: "50%",
                                            marginLeft: "10px",
                                        }}
                                    />
                                </p>
                                <p>
                                    Kích thước:{" "}
                                    {product.selectedVariant.sizes.name}
                                </p>
                            </div>
                        ) : (
                            <p>Không có biến thể nào được chọn.</p>
                        )}
                    </div>
                ))}
                <Button type="primary" onClick={handleSubmitPayment}>
                    Xác nhận thanh toán
                </Button>
            </div>
            <Footer />
        </div>
    );
};

export default PayCombo;
