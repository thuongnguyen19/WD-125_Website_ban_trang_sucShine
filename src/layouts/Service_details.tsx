import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface FormData {
    title: string;
    image: string | null; // Dữ liệu ảnh có thể là string (URL hoặc null)
    highlight: string;
    url: string;
}

const ServiceDetails = () => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        image: null,
        highlight: "",
        url: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false); // Để xác định xem đang ở chế độ chỉnh sửa hay không
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/getConfig", // API lấy dữ liệu hiện tại
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                // Kiểm tra xem có dữ liệu hay không và cập nhật form
                if (response.data && response.data.status) {
                    const data = response.data.data; // Dữ liệu từ response
                    setFormData({
                        title: data.title || "",
                        image: data.image || null, // Nếu có ảnh, lưu nó vào form
                        highlight: data.highlight || "",
                        url: data.url || "",
                    });
                    setIsEditing(true); // Bật chế độ chỉnh sửa nếu có dữ liệu
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, []); // Chỉ chạy 1 lần khi component được render lần đầu

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({
                ...prev,
                image: e.target.files[0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("highlight", formData.highlight);
                formDataToSend.append("id", id);
        formDataToSend.append("url", formData.url);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/addConfig", // API để thêm hoặc chỉnh sửa thông tin
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setMessage(response.data.message || "Thành công!");
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Đã xảy ra lỗi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Service Details</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Highlight:</label>
                    <input
                        type="text"
                        name="highlight"
                        value={formData.highlight}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>URL:</label>
                    <input
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                    />
                    {/* Nếu có ảnh hiện tại, bạn có thể hiển thị thumbnail ảnh ở đây */}
                    {isEditing && formData.image === null && (
                        <div>Image chưa có sẵn</div>
                    )}
                    {formData.image && formData.image !== null && (
                        <div>
                            <p>Ảnh hiện tại:</p>
                            <img
                                src={formData.image || ""}
                                alt="Current Image"
                                style={{ width: "200px", height: "auto" }}
                            />
                        </div>
                    )}
                </div>
                <button type="submit" disabled={loading}>
                    {loading
                        ? "Đang xử lý..."
                        : isEditing
                          ? "Chỉnh sửa"
                          : "Gửi"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ServiceDetails;
