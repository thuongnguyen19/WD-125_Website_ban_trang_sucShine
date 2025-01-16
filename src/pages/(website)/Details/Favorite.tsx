import { useState, useEffect } from "react";
import { HeartFilled } from "@ant-design/icons";
import { message, Modal, Spin } from "antd";
import Footer from "../../../components/common/Footer";
import Header from "../../../components/common/Header";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../configs/axios";

interface Variant {
    id_product: number;
    selling_price: string;
    list_price: string;
}

interface Product {
    id: number;
    name: string;
    thumbnail: string;
    variants: Variant[];
}

interface Favorite {
    id: number;
    id_user: number;
    id_product: number;
    product: Product;
}

const FavoritesList = () => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    message.error("Bạn chưa đăng nhập.");
                    navigate("/login");
                    return;
                }

                const response = await axiosInstance.get(
                    "/favoriteProduct",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                updateLocalStorageFavorite(response.data);

                if (Array.isArray(response.data)) {
                    setFavorites(response.data);
                } else {
                    setError("Dữ liệu trả về không phải là mảng JSON.");
                }
            } catch (error) {
                setError("Không thể tải sản phẩm yêu thích.");
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const updateLocalStorageFavorite = (favorite: Favorite[]) => {
        localStorage.setItem("favorite", JSON.stringify(favorite));
        window.dispatchEvent(new Event("storage"));
    };

    const handleDelete = async (productId: string) => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            message.error("Bạn cần đăng nhập để thực hiện hành động này.");
            return;
        }

        try {
            const response = await axiosInstance.delete(
                `/favoriteProduct/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            message.success(response.data.message);

            const favoriteData = JSON.parse(
                localStorage.getItem("favorite") || "",
            );

            const favorites = favoriteData.filter(
                (item) => item.id_product !== productId,
            );
            setFavorites(favorites);
            updateLocalStorageFavorite(favorites);
        } catch (error) {
            message.error("Không thể xóa sản phẩm yêu thích.");
            console.error("Error deleting favorite:", error);
        }
    };

    const confirmDelete = (productId: string) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content:
                "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích không?",
            onOk: () => handleDelete(productId),
            onCancel() {
                // Thao tác khi người dùng hủy
            },
        });
    };

    if (loading) return <Spin size="large" />;
    if (error) return <p>{error}</p>
    
    // const hadleproduct = (id: number) => {
    //     navigate();
    // };

    function handleProductClick(id: number): void {
       navigate(`/detail/${id}`);
    }

    return (
        <div>
            <Header />
            <div className="tf-page-title">
                <div className="container-full">
                    <div className="heading text-center">
                        Sản phẩm yêu thích
                    </div>
                </div>
            </div>
            <div className="wrapper-control-shop" style={{ padding: "40px" }}>
                <div className="grid-layout wrapper-shop" data-grid="grid-4">
                    {Array.isArray(favorites) && favorites.length > 0 ? (
                        favorites.map((item) => (
                            <div key={item.id} className="card-product">
                                <div className="card-product-wrapper">
                                    <div
                                        className="product-img"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            handleProductClick(item.product.id)
                                        }
                                    >
                                        <img
                                        
                                            className="lazyload img-product"
                                            src={item.product.thumbnail}
                                            alt={item.product.name}
                                            style={{ height: 300 }}
                                        />
                                    </div>
                                    <div className="list-product-btn absolute-2">
                                        <a className="box-icon bg_white wishlist btn-icon-action">
                                            <span>
                                                <HeartFilled
                                                    onClick={() => {
                                                        if (item.product.id) {
                                                            confirmDelete(
                                                                item.product.id,
                                                            );
                                                        } else {
                                                            console.error(
                                                                "ID sản phẩm không hợp lệ",
                                                                item,
                                                            );
                                                        }
                                                    }}
                                                    style={{
                                                        fontSize: "25px",
                                                        color: "red",
                                                        cursor: "pointer",
                                                        transition:
                                                            "color 0.3s ease",
                                                    }}
                                                />
                                            </span>
                                            <span className="tooltip">
                                                Xóa khỏi yêu thích
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <div className="card-product-info">
                                    <h3
                                        onClick={() =>
                                            handleProductClick(item.product.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                        className="title link"
                                    >
                                        {item.product.name}
                                    </h3>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div className="price-on-sale">
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "#f00",
                                                }}
                                            >
                                                {new Intl.NumberFormat(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    },
                                                ).format(
                                                    Number(
                                                        item.product.variants[0]
                                                            ?.selling_price,
                                                    ),
                                                )}
                                            </span>
                                        </div>
                                        <div
                                            className="price-list"
                                            style={{ marginLeft: "10px" }}
                                        >
                                            <span
                                                style={{
                                                    textDecoration:
                                                        "line-through",
                                                    color: "#999",
                                                }}
                                            >
                                                {new Intl.NumberFormat(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    },
                                                ).format(
                                                    Number(
                                                        item.product.variants[0]
                                                            ?.list_price,
                                                    ),
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Không có sản phẩm nào.</div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FavoritesList;
