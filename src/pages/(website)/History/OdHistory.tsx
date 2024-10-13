import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import Link cho điều hướng
import { fetchOrders, Order } from "../../../Interface/Order";
import {  message } from "antd";

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const orderStatusMap: { [key: number]: string } = {
    1: "Đang chờ xác nhận",
    2: "Đã xác nhận",
    3: "Đang giao hàng",
    4: "Giao hàng thành công",
    5: "Giao hàng thất bại",
    6: "Hoàn thành",
    7: "Đã hủy",
    };


    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            message.error("Bạn chưa đăng nhập.");
            navigate("/login");
            return;
        }

        // Gọi API lấy danh sách đơn hàng
        const loadOrders = async () => {
            try {
                const ordersData = await fetchOrders();
                setOrders(ordersData);
                setLoading(false);
            } catch (err) {
                setError("Lỗi khi tải danh sách đơn hàng");
                setLoading(false);
            }
        };

        loadOrders();
    }, [navigate]);

    
    

    const handleProductClick = (id: number) => {
    navigate(`/profile/od_histori/od_detail/${id}`);
  };

    if (loading) {
        return <p>Đang tải...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    return (
        <div className="order-history-container">
            <table className="order-history-table">
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Ngày đặt hàng</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Tổng tiền</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
    {orders.map((order) => (
        <tr key={order.id} className="tf-order-item">
            <td>#{order.id}</td>
            <td>{new Date(order.order_date).toLocaleDateString()}</td>
            <td>{orderStatusMap[Number(order.status)]}</td>
            <td>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_payment)}
                {/* {order.total_payment
                    ? order.total_payment.toLocaleString() + " VND"
                    : "Chưa xác định"} */}
            </td>
            <td>
                <a
                    onClick={() => handleProductClick(order.id)}
                    className="view-btn"
                    style={{backgroundColor: 'black', width: '110px'}}
                >
                    Xem chi tiết
                </a>
                
                
            </td>
        </tr>
    ))}
</tbody>
            </table>
        </div>
    );
};

export default OrderHistory;