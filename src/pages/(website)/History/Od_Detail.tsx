import { useEffect, useState } from "react";
import { fetchOrders, Order, Review, submitReview } from "../../../Interface/Order";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, message, Modal, Rate, Spin } from "antd";
import axiosInstance from "../../../configs/axios";

const Od_Detail = () => {
    const { id } = useParams<{ id: string }>();
    

    const orderStatusMap: { [key: number]: string } = {
        1: "Đang chờ xác nhận",
        2: "Đã xác nhận",
        3: "Đang giao hàng",
        4: "Giao hàng thành công",
        5: "Giao hàng thất bại",
        6: "Hoàn thành",
        7: "Đã hủy",
    };

    const paymentRoleMap: { [key: number]: string } = {
        1: "COD",
        2: "VNPay",
        3: "MoMo",
    };

    const statusPaymentMap: { [key: number]: string } = {
        1: "Chưa thanh toán",
        2: "Đã thanh toán",
    };

    

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[] | null>(null);
    const [reviewsState, setReviewsState] = useState<{ [key: number]: { rating: number; content: string } }>({});
    // const [hasReviewed, setHasReviewed] = useState<{ [key: number]: boolean }>({});
    const [selectedProduct, setSelectedProduct] = useState<{ id_order: number; id_product: number; id_variant: number } | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
    const [cancelReason, setCancelReason] = useState<string>("");
    const perPage = 1000;
    const navigate = useNavigate();

    // Chuyển thời gian sang múi giờ +7
    const convertToTimezone = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false, // Hiển thị thời gian 24 giờ
        });
    };

    const handleContinuePayment = (url: string) => {
        if (url) {
            window.location.href = url; // Điều hướng đến URL thanh toán
        } else {
            message.error("Không tìm thấy URL thanh toán.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            message.error("Bạn chưa đăng nhập.");
            navigate("/login");
            return;
        }

        const loadOrderDetails = async () => {
            try {
                const { data, total_pages } = await fetchOrders(page, perPage);
                const a = data.filter((order) => order.id == Number(id));
                setOrders(a);
                setLoading(false);
                setTotalPages(total_pages);
            } catch (err) {
                setError("Lỗi khi tải danh sách đơn hàng");
                setLoading(false);
            }
        };

        loadOrderDetails();
    }, [navigate, id, page, perPage]);

    const handleReviewCheck = (id_order: number, id_product: number, id_variant: number, is_comment: number) => {
    if (is_comment === 2) { // Nếu is_comment là 2 nghĩa là đã đánh giá
        message.warning("Bạn chỉ có thể đánh giá sản phẩm một lần.");
    } else {
        setSelectedProduct({ id_order, id_product, id_variant });
        setIsReviewModalVisible(true);
    }
};



// Sau khi gửi đánh giá thành công
const handleOk = () => {
    // Hiển thị Modal xác nhận
    Modal.confirm({
        title: "Chỉ được đánh giá một lần và không thể chỉnh sửa",
        content: "Bạn có chắc muốn gửi không?",
        okText: "Có",
        cancelText: "Không",
        onOk: async () => {
            // Nếu người dùng bấm "Có", tiếp tục gửi đánh giá
            if (selectedProduct && reviewsState[selectedProduct.id_product]) {
                const { id_order, id_product, id_variant } = selectedProduct;
                const { content, rating } = reviewsState[id_product];

                if (!content || rating === 0) {
                    message.error("Vui lòng cung cấp đầy đủ thông tin đánh giá.");
                    return;
                }

                try {
                    await submitReview(id_order, id_variant, id_product, content, rating);
                    setReviews(prev => prev ? [...prev, { id_product, content, rating, id_variant }] : [{ id_product, content, rating, id_variant }]);
                    message.success("Đánh giá của bạn đã được gửi thành công!");
                    setIsReviewModalVisible(false);
                    window.location.reload();
                } catch (error) {
                    message.error("Lỗi khi gửi đánh giá.");
                }
            }
        },
        onCancel: () => {
            // Nếu người dùng bấm "Không", không thực hiện gì
            message.info("Hủy gửi đánh giá.");
        },
    });
};


const handleCancel = () => {
    setIsReviewModalVisible(false);
};


    const showCancelModal = (orderId: number,order: Order) => {
        if (order.payment_role === 2) {
            // Nếu phương thức thanh toán là VNPay
            Modal.confirm({
                title: "Cảnh báo",
                content: "Hủy đơn hàng sẽ không hoàn tiền. Bạn có chắc chắn muốn tiếp tục?",
                okText: "Đồng ý",
                cancelText: "Hủy",
                 onOk: () => {
                    setCancelOrderId(orderId); // Đặt ID của đơn hàng cần hủy
                    setIsModalVisible(true);  // Hiển thị modal nhập lý do hủy đơn
                },
            });
        } else {
            setCancelOrderId(orderId);
            setIsModalVisible(true);
        }
        
    };

    const handleCancelOrder = async () => {
        if (!cancelOrderId) {
            message.error("Đơn hàng không hợp lệ.");
            return;
        }

        if (!cancelReason.trim()) {
            message.error("Lý do hủy không được để trống.");
            return;
        }
        setIsOrderLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("Bạn chưa đăng nhập.");
                return;
            }
            const response = await axiosInstance.get(`/purchasedOrders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    cancel_id: cancelOrderId,
                    note: cancelReason,
                },
            });

            message.success(
                response.data.message || "Đơn hàng đã hủy thành công.",
            );
            setIsModalVisible(false);
            setCancelReason("");
            window.location.reload();
        } catch (error) {
        Modal.confirm({
            title: "Không thể hủy đơn hàng",
            content: "Đơn hàng đã được xác nhận và không thể hủy.",
            okText: "Tôi đã hiểu",
            onOk() {
                window.location.reload();
            },
        });
    } finally {
        setIsOrderLoading(false); // Tắt loading
    }
    };


    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCancelReason(e.target.value);
    };

    const handleConfirmReceived = async (orderId: number) => {
        setIsOrderLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("Bạn chưa đăng nhập.");
                return;
            }
            const response = await axiosInstance.get("/purchasedOrders", {
                params: {
                    complete_id: orderId,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                message.success(response.data.message);

                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId
                            ? { ...order, status: "6" }
                            : order,
                    ),
                );
            } else {
                message.error("Có lỗi xảy ra khi xác nhận đơn hàng.");
            }
        } catch (error) {
            message.error("Không thể kết nối với server.");
        } finally {
            setIsOrderLoading(false);
        }
    };

    const calculateTotalPrice = (order: Order) => {
        return order.order_detail.reduce((total, item) => {
            return total + item.selling_price * item.quantity;
        }, 0);
    };

    const handleProductClick = (id: number) => {
    navigate(`/profile/comment`);
    };

    const handleProductsClick = (id: number) => {
        navigate(`/detail/${id}`);
    };

    if (loading) return <p>Đang tải...</p>


    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
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
                <div className="col-lg-15">
                    {orders.map((order) => (
                        <div className="wd-form-order" key={order.id}>
                            <div className="order-head">
                                <figure className="img-product">
                                    <img
                                        src={
                                            order.order_detail[0]?.product_image
                                        }
                                        alt={
                                            order.order_detail[0]?.product_name
                                        }
                                    />
                                </figure>
                                <div className="content">
                                    <h6 className="mt-2 fw-5">
                                        Đơn hàng #{order.id}
                                    </h6>
                                    {order.urlBackPayment!=null && (
                                        <div
                                            className="button"
                                            style={{textAlign: 'right'}}
                                        >
                                            <a
                                                className="view-btn"
                                                
                                                onClick={() => handleContinuePayment(order.urlBackPayment)}
                                            >
                                                Tiếp tục thanh toán
                                            </a>
                                            
                                        </div>
                                    )}
                                    {Number(
                                        order.status,
                                    ) === 1 && (
                                        <div className="button">
                                            <a
                                                className="view-btn"
                                                onClick={() =>
                                                    showCancelModal(
                                                        order.id,
                                                        order
                                                    )
                                                }
                                            >
                                                Hủy đơn hàng
                                            </a>
                                        </div>
                                    )}

                                    {Number(order.status) === 4 && (
    <div className="button">
        <button
            className="view-btn"
            disabled={isOrderLoading}
onClick={() =>
                                                    handleConfirmReceived(
                                                        order.id,
                                                    )
                                                }        >
            Đã nhận được hàng
        </button>
    </div>
)}



                                </div>
                            </div>
                            <div className="tf-grid-layout md-col-2 gap-15">
                                <div className="item">
                                    <div className="text-2 text_black-2">
                                        Thời gian đặt hàng
                                    </div>
                                    <div className="text-2 mt_4 fw-6">
                                        {convertToTimezone(order.created_at)}
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="text-2 text_black-2">
                                        Họ và tên 
                                    </div>
                                    <div className="text-2 mt_4 fw-6">
                                        {order.recipient_name}
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="text-2 text_black-2">
                                        Địa chỉ
                                    </div>
                                    <div className="text-2 mt_4 fw-6">
                                        {order.recipient_address}
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="text-2 text_black-2">
                                        Số điện thoại
                                    </div>
                                    <div className="text-2 mt_4 fw-6">
                                        {order.phone_number}
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="text-2 text_black-2">
                                        Phương thức thanh toán
                                    </div>
                                    <div className="text-2 mt_4 fw-6">
                                        {paymentRoleMap[Number(order.payment_role)]}
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="text-2 text_black-2">
                                        Trạng thái thanh toán
                                    </div>
                                    <div className="text-2 mt_4 fw-6">
                                        {statusPaymentMap[Number(order.status_payment)]}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="widget-tabs style-has-border widget-order-tab">
                                <ul className="widget-menu-tab">
                                    <li className="item-title">
                                        <span className="inner">
                                            Chi tiết đơn hàng
                                        </span>
                                    </li>
                                    
                                </ul>
                                

                                <div className="widget-content-tab">
                                        <div className="widget-content-inner active">
                                            {order.order_detail.map((item) => (
                                                <div
                                                    className="order-head"
                                                    key={item.id}
                                                >
                                                    <div
                                                        className="product-details-container"
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <div
                                                            className="product-info"
                                                            style={{
                                                                display: "flex",
                                                            }}
                                                        >
                                                            <figure
                                                                className="img-product"
                                                                onClick={() =>
                                                                    handleProductsClick(
                                                                        item.id_product
                                                                    )
                                                                }
                                                                
                                                            >
                                                                <img
                                                                    src={
                                                                        item.product_image
                                                                    }
                                                                    alt={
                                                                        item.product_name
                                                                    }
                                                                    style={{
                                                                        
                                                                        objectFit:
                                                                            "cover",
                                                                    }}
                                                                />
                                                            </figure>
                                                            <div className="content" >
                                                                <div className="text-3 fw-6"
                                                                onClick={() =>
                                                                    handleProductsClick(
                                                                        item.id_product
                                                                    )
                                                                }
                                                                >
                                                                    <a>
                                                                    {
                                                                        item.product_name
                                                                    }
                                                                    </a>
                                                                    
                                                                </div>
                                                                <div className="mt_4">
                                                                    <span className="fw-6">
                                                                        Màu sắc:
                                                                    </span>{" "}
                                                                    {
                                                                        item
                                                                            .product_variant
                                                                            .color
                                                                            .name
                                                                    }
                                                                </div>
                                                                <div className="mt_4">
                                                                    <span className="fw-6">
                                                                        Kích
                                                                        thước:
                                                                    </span>{" "}
                                                                    {
                                                                        item
                                                                            .product_variant
                                                                            .size
                                                                            .name
                                                                    }
                                                                </div>
                                                                
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="product-price-quantity"
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                            }}
                                                        >
                                                            <div
                                                                className="quantity"
                                                                style={{
                                                                    marginBottom:
                                                                        "8px",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                x{item.quantity}
                                                            </div>
                                                            <div
                                                                className="price"
                                                                style={{
                                                                    textAlign:
                                                                        "right",
                                                                    width: "400px",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        color: "red",
                                                                        fontSize:
                                                                            "15px",
                                                                        fontWeight:
                                                                            "bold",
                                                                    }}
                                                                >
                                                                    {new Intl.NumberFormat(
                                                                        "vi-VN",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "VND",
                                                                        },
                                                                    ).format(
                                                                        item.selling_price,
                                                                    )}
                                                                </span>
                                                                {Number(
                                                                    order.status,
                                                                ) === 6 && (
                                                                    <div className="button">
                                                                        <Button 
                                                                            style={{ backgroundColor: 'black' }} 
                                                                            type="primary" 
                                                                            onClick={() => item.is_comment === 2 
                                                                                ? handleProductClick(item.id_product) // Chuyển đến trang chi tiết đánh giá nếu đã đánh giá
                                                                                : handleReviewCheck(order.id, item.id_product, item.id_variant, item.is_comment)
                                                                            }
                                                                        >
                                                                            {item.is_comment === 2 ? "Xem chi tiết đánh giá" : "Đánh giá"}
                                                                        </Button>
                                                                        <Modal
                                                                            title="Đánh giá sản phẩm"
                                                                            open={isReviewModalVisible && selectedProduct?.id_product === item.id_product}
                                                                            onOk={handleOk}
                                                                            onCancel={handleCancel}
                                                                            okText="Gửi đánh giá"
                                                                            cancelText="Hủy bỏ"
                                                                        >
                                                                            <Rate onChange={value => setReviewsState(prev => ({
                                                                                ...prev,
                                                                                [item.id_product]: { ...prev[item.id_product], rating: value }
                                                                            }))} value={reviewsState[item.id_product]?.rating} />
                                                                            <Input.TextArea
                                                                                rows={4}
                                                                                value={reviewsState[item.id_product]?.content || ''}
                                                                                onChange={e => setReviewsState(prev => ({
                                                                                    ...prev,
                                                                                    [item.id_product]: { ...prev[item.id_product], content: e.target.value }
                                                                                }))}
                                                                            />
                                                                        </Modal>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="price-summary">
                                                <div className="row">
                                                    <div className="label">Tổng tiền:</div>
                                                    <div className="value">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(calculateTotalPrice(order))}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="label">Giảm giá:</div>
                                                    <div className="value">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(order.discount_value)}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="label">Thành tiền:</div>
                                                    <div className="value">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(order.total_payment)}
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                         <ul className="widget-menu-tab">
                                    
                                    <li className="item-title">
                                        <span className="inner">
                                            Lịch sử đơn hàng
                                        </span>
                                    </li>
                                </ul>

                                        <div className="widget-content-tab">
                                            <div className="widget-content-inner active">
                                                <div className="widget-timeline">
                                                    <ul className="timeline">
                                                        {Number(
                                                            order.status,
                                                        ) === 7 ? (
                                                            <li>
                                                                <div className="timeline-badge success"></div>
                                                                <div className="timeline-box">
                                                                    <a
                                                                        className="timeline-panel"
                                                                        href="javascript:void(0);"
                                                                    >
                                                                        <div
                                                                            className="text-2 fw-6"
                                                                            style={{
                                                                                color: "green",
                                                                            }}
                                                                        >
                                                                            {
                                                                                orderStatusMap[7]
                                                                            }
                                                                        </div>
                                                                        <span>
                                                                            {
                                                                                order.updated_at
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                        ) : (
                                                            Object.keys(
                                                                orderStatusMap,
                                                            ).map((key) => {
                                                                const statusKey =
                                                                    Number(key);
                                                                const currentStatus =
                                                                    Number(
                                                                        order.status,
                                                                    );

                                                                if (
                                                                    statusKey ===
                                                                    7
                                                                )
                                                                    return null;
                                                                if (
                                                                    statusKey ===
                                                                        5 &&
                                                                    currentStatus !==
                                                                        5
                                                                )
                                                                    return null;
                                                                if (
                                                                    currentStatus ===
                                                                        5 &&
                                                                    (statusKey ===
                                                                        4 ||
                                                                        statusKey ===
                                                                            6)
                                                                )
                                                                    return null;

                                                                const isCompleted =
                                                                    statusKey <=
                                                                    currentStatus;

                                                                return (
                                                                    <li
                                                                        key={
                                                                            statusKey
                                                                        }
                                                                    >
                                                                        <div
                                                                            className={`timeline-badge ${isCompleted ? "success" : ""}`}
                                                                        ></div>
                                                                        <div className="timeline-box">
                                                                            <a
                                                                                className="timeline-panel"
                                                                                href="javascript:void(0);"
                                                                            >
                                                                                <div
                                                                                    className="text-2 fw-6"
                                                                                    style={{
                                                                                        color: isCompleted
                                                                                            ? "green"
                                                                                            : "gray",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        orderStatusMap[
                                                                                            statusKey
                                                                                        ]
                                                                                    }
                                                                                </div>
                                                                                {isCompleted && (
                                                                                    <span>
                                                                                        {
                                                                                            order.updated_at
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            </a>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })
                                                        )}

                                                        
                                                    </ul>

                                                    <Modal
                                                        title="Lý do hủy đơn hàng"
                                                        open={isModalVisible}
                                                        onOk={handleCancelOrder}
                                                        onCancel={() =>
                                                            setIsModalVisible(
                                                                false,
                                                            )
                                                        }
                                                        okText="Xác nhận"
                                                        cancelText="Hủy"
                                                        confirmLoading={isOrderLoading} 
                                                    >
                                                        <Input.TextArea
                                                            value={cancelReason}
                                                            onChange={
                                                                handleReasonChange
                                                            }
                                                            placeholder="Nhập lý do hủy đơn hàng"
                                                            rows={4}
                                                        />
                                                    </Modal>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    
                                </div>
                               
                            </div>
                        </div>
                    ))}
                </div>
        </>
    );
};

export default Od_Detail;
