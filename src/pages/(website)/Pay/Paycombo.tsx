import React, { useEffect, useState } from "react";
import { message, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import axiosInstance from "../../../configs/axios";

// Định nghĩa kiểu cho biến thể sản phẩm
interface ProductVariant {
    id: number;
    image_color: string; // Hình ảnh màu
    selling_price: number;
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
    image: string; // Ảnh combo
    quantity: number;
    price: number; // Giá combo
    description: string; // Mô tả combo
    products: Product[]; // Danh sách sản phẩm trong combo
}

// Component PayCombo
const PayCombo: React.FC = () => {
    const navigate = useNavigate();

    const [paymentProducts, setPaymentProducts] = useState<Product[]>([]);
    const [combo, setCombo] = useState<Combo | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [paymentRole, setPaymentRole] = useState<number | null>(null);
    const [voucherId, setVoucherId] = useState<number | null>(1);
    const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    // Lấy dữ liệu đơn hàng khi component mounted
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
                    "http://127.0.0.1:8000/api/listInformationOrderCombo", // Thay đổi URL nếu cần thiết
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { comboId, quantity, variantIds },
                    },
                );

                if (response.data.status) {
                    const { productpayment, totalAmount, user } = response.data.data;

                    // Tự động điền thông tin người dùng
                    if (user) {
                        setName(user.name || "");
                        setEmail(user.email || "");
                        setPhoneNumber(user.phone_number || "");
                        setAddress(user.address || "");
                    }

                    setCombo(productpayment);
                    setPaymentProducts(productpayment.products || []);
                    setTotalAmount(totalAmount || 0);
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

    const validateForm = () => {
        const phoneRegex = /^(0|\+84)[35789]\d{8}$/;
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

        if (!name.trim()) {
            message.error("Họ và tên không được để trống");
            return false;
        }

        if (!emailRegex.test(email)) {
            message.error("Email không hợp lệ");
            return false;
        }

        if (!phoneRegex.test(phoneNumber)) {
            message.error(
                "Số điện thoại phải là số hợp lệ của Việt Nam (10 số)",
            );
            return false;
        }

        if (!address.trim()) {
            message.error("Địa chỉ không được để trống");
            return false;
        }

        if (paymentRole === null) {
            message.error("Vui lòng chọn phương thức thanh toán.");
            return false;
        }

        return true;
    };

    const handlePayment = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            message.error("Bạn chưa đăng nhập.");
            navigate("/login");
            return;
        }

        if (!validateForm()) {
            setIsOrderLoading(false);
            return;
        }

        const orderDataString = localStorage.getItem("orderData");
        const orderData = JSON.parse(orderDataString || "{}");
        const { comboId, quantity, variantIds } = orderData;

        const paymentData = {
            comboId,
            quantity,
            voucherId,
            variantIds,
            recipient_name: name,
            email,
            phone_number: phoneNumber,
            recipient_address: address,
            note:
                (document.getElementById("note") as HTMLTextAreaElement)
                    ?.value || "", // Lấy ghi chú từ textarea
            total_payment: totalAmount,
            payment_role: paymentRole,
        };

        setIsOrderLoading(true);

        try {
            const response = await axiosInstance.post(
                "/paymentCombo",
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.status) {
                message.success("Đặt hàng thành công!");
                if (paymentRole === 1) {
                    navigate("/success");
                } else if (paymentRole === 2 && response.data.data) {
                    window.location.href = response.data.data;
                }
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi trong quá trình đặt hàng:", error);
            message.error("Đã xảy ra lỗi trong quá trình đặt hàng.");
        } finally {
            setIsOrderLoading(false);
        }
    };

    if (loading) return <Spin size="large" />;

    return (
        <>
            <Header />
            {isOrderLoading && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            zIndex: 1000,
                        }}
                    >
                        <Spin size="large" />
                    </div>
                )}
            <div style={{ padding: "20px" }}>
                <div className="tf-page-title">
                    <div className="container-full">
                        <div className="heading text-center">
                            Thông tin thanh toán
                        </div>
                    </div>
                </div>

                <section className="flat-spacing-11">
                    <div className="container">
                        <div className="tf-page-cart-wrap layout-2">
                            <div className="tf-page-cart-item">
                                <h5 className="fw-5 mb_20">
                                    Thông tin người dùng
                                </h5>
                                <form className="form-checkout">
                                    <fieldset className="box fieldset">
                                        <label htmlFor="first-name">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="first-name"
                                            placeholder="Nguyễn Văn A"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="box fieldset">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="box fieldset">
                                        <label htmlFor="phone-number">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            id="phone-number"
                                            value={phoneNumber}
                                            onChange={(e) =>
                                                setPhoneNumber(e.target.value)
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="box fieldset">
                                        <label htmlFor="address">Địa chỉ</label>
                                        <input
                                            type="text"
                                            id="address"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                        />
                                    </fieldset>
                                </form>
                                <fieldset className="box fieldset">
                                    <label
                                        htmlFor="note"
                                        style={{
                                            paddingTop: 20,
                                            paddingBottom: 10,
                                        }}
                                    >
                                        Ghi chú đơn hàng (Tuỳ chọn)
                                    </label>
                                    <textarea name="note" id="note" />
                                </fieldset>
                            </div>
                            <div className="tf-page-cart-footer">
                                <div className="tf-cart-footer-inner">
                                    <h5 className="fw-5 mb_20">
                                        Sản phẩm trong bộ trang sức
                                    </h5>
                                    <div className="pay-page">
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                        style={{
                                                            padding: "10px",
                                                            textAlign: "left",
                                                            width: "20%",
                                                        }}
                                                    >
                                                        Hình ảnh
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: "10px",
                                                            textAlign: "left",
                                                            width: "30%",
                                                        }}
                                                    >
                                                        Tên sản phẩm
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: "10px",
                                                            textAlign: "left",
                                                            width: "15%",
                                                        }}
                                                    >
                                                        Màu sắc
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: "10px",
                                                            textAlign: "left",
                                                            width: "15%",
                                                        }}
                                                    >
                                                        Kích thước
                                                    </th>
                                                </tr>
                                            </thead>
                                            {/* {combo && (
                    <div
                        className="combo-info"
                        style={{ marginBottom: "20px" }}
                    >
                        <h2>{combo.name}</h2>
                        <img
                            src={combo.image}
                            alt={combo.name}
                            style={{
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "cover",
                                borderRadius: "5px",
                            }}
                        />
                        <p>{combo.description}</p>
                        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                            Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                    </div>
                )} */}
                                            <tbody>
                                                {paymentProducts.length > 0 ? (
                                                    paymentProducts.map(
                                                        (item) => {
                                                            const selectedVariant =
                                                                item.selectedVariant;
                                                            const imageUrl =
                                                                selectedVariant?.image_color ||
                                                                "https://via.placeholder.com/100";

                                                            return (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "10px",
                                                                            verticalAlign:
                                                                                "middle",
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={
                                                                                imageUrl
                                                                            }
                                                                            alt={
                                                                                item.name ||
                                                                                "Sản phẩm"
                                                                            }
                                                                            style={{
                                                                                width: "100px",
                                                                                height: "100px",
                                                                                objectFit:
                                                                                    "cover",
                                                                                borderRadius:
                                                                                    "5px",
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "10px",
                                                                            verticalAlign:
                                                                                "middle",
                                                                        }}
                                                                    >
                                                                        <p
                                                                            style={{
                                                                                margin: "0",
                                                                            }}
                                                                        >
                                                                            {item.name ||
                                                                                "Tên sản phẩm không xác định"}
                                                                        </p>
                                                                        <p
                                                                            style={{
                                                                                margin: "0",
                                                                                fontSize:
                                                                                    "12px",
                                                                                color: "gray",
                                                                            }}
                                                                        >
                                                                            Số
                                                                            lượng:{" "}
                                                                            {
                                                                                combo.quantity
                                                                            }
                                                                        </p>
                                                                        <p
                                                                            style={{
                                                                                margin: "0",
                                                                                fontSize:
                                                                                    "12px",
                                                                                color: "gray",
                                                                            }}
                                                                        >
                                                                            Giá bán:{" "}
                                                                            {
                                                                                Number(selectedVariant?.selling_price).toLocaleString(
                                                                                    "vi-VN",
                                                                                )
                                                                            }{" "}
                                                                                VNĐ
                                                                        </p>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "10px",
                                                                            verticalAlign:
                                                                                "middle",
                                                                        }}
                                                                    >
                                                                        {selectedVariant
                                                                            ?.colors
                                                                            ?.name ||
                                                                            "Không xác định"}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "10px",
                                                                            verticalAlign:
                                                                                "middle",
                                                                        }}
                                                                    >
                                                                        {selectedVariant
                                                                            ?.sizes
                                                                            ?.name ||
                                                                            "Không xác định"}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={4}
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                                padding: "10px",
                                                            }}
                                                        >
                                                            Không có sản phẩm
                                                            nào trong đơn hàng.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                        <div className="d-flex justify-content-between line pb_20 mb_10">
                                            <h6
                                                className="fw-5"
                                              
                                            >
                                                Tổng tiền bộ trang sức:{" "}
                                            </h6>
                                            <h6 className="fw-5">
                                                {totalAmount.toLocaleString(
                                                    "vi-VN",
                                                )}{" "}
                                                VNĐ
                                            </h6>
                                        </div>
                                        <div className="d-flex justify-content-between line pb_20 mb_10">
                                            <h6
                                                className="fw-5"
                                              
                                            >
                                                Thành tiền:{" "}
                                            </h6>
                                            <h6 className="fw-5">
                                                {totalAmount.toLocaleString(
                                                    "vi-VN",
                                                )}{" "}
                                                VNĐ
                                            </h6>
                                        </div>
                                        <div className="wd-check-payment">
                                            <div className="fieldset-radio mb_10">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    id="bank"
                                                    className="mr-2 form-check-input"
                                                    onChange={(e) =>
                                                        setPaymentRole(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    value="2"
                                                />
                                                <label htmlFor="bank">

                                                    Thanh toán ngân hàng

                                                </label>
                                            </div>
                                            <div className="fieldset-radio mb_20">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    id="delivery"
                                                    className=" mr-2 form-check-input"
                                                
                                                    onChange={(e) =>
                                                        setPaymentRole(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    value="1"
                                                />
                                                <label htmlFor="delivery">
                                                    Thanh toán khi nhận hàng
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            disabled={isOrderLoading}
                                            className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                                        >
                                            Đặt hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default PayCombo;
