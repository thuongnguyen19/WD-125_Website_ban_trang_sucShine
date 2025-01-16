import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Định nghĩa interface
interface AdsConfig {
    id: number;
    id_user: number;
    name: string;
    phone: string;
    email: string;
    location: number;
    duration: string;
    price: string;
    start: string;
    end: string;
    visits: number;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    config: any | null;
}

const Dv = () => {
    const [adsData, setAdsData] = useState<AdsConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
    useEffect(() => {
        const fetchAdsData = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Bạn chưa đăng nhập.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/getAds",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (response.data.status) {
                    setAdsData(response.data.data);
                } else {
                    setError(
                        response.data.message || "Không tìm thấy dữ liệu.",
                    );
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Lỗi không xác định.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdsData();
    }, []);
        const handleProductClick = (id: number) => {
            navigate(`/profile/dv/detail_service/${id}`);
        };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="order-history-container">
            
            <h1>Thông tin Dịch vụ</h1>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {adsData ? (
                <table className="order-history-table">
                    <thead>
                        <tr>
                            <th>Mã Dịch Vụ</th>
                            <th>Tên Dịch Vụ</th>
                            <th>Số Điện Thoại</th>
                            <th>Email</th>
                            <th>Vị Trí</th>
                            <th>Thời Gian Bắt Đầu</th>
                            <th>Thời Gian Kết Thúc</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="tf-order-item">
                            <td>#{adsData.id}</td>
                            <td>{adsData.name}</td>
                            <td>{adsData.phone}</td>
                            <td>{adsData.email}</td>
                            <td>{adsData.location}</td>
                            <td>{new Date(adsData.start).toLocaleString()}</td>
                            <td>{new Date(adsData.end).toLocaleString()}</td>
                            <td>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(parseFloat(adsData.price))}
                            </td>
                            <td>
                                <a
                                    onClick={() =>
                                        handleProductClick(adsData.id)
                                    }
                                    className="view-btn"
                                    style={{
                                        backgroundColor: "black",
                                        width: "110px",
                                    }}
                                >
                                    Xem chi tiết
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Không có thông tin dịch vụ để hiển thị.</p>
            )}
        </div>
    );
};

export default Dv;
