import React, { useEffect, useState } from "react";
import Footer from "../../../components/common/Footer";
import Header from "../../../components/common/Header";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import axiosInstance from "../../../configs/axios";

// Interfaces
interface Variant {
    id: number;
    import_price: string;
    list_price: string;
    selling_price: string;
    quantity: number;
    image_color: string;
    colors: {
        id: number;
        name: string;
        code: string;
    };
    sizes: {
        id: number;
        name: string;
    };
}

interface RelatedProduct {
    id: number;
    name: string;
    thumbnail: string; // Hình ảnh sản phẩm
    variants: Variant[];
}

interface Combo {
    id: number;
    name: string;
    image: string;
    price: number;
    sum_price: number;
    description?: string; // Mô tả combo
    available_quantity: number;
    products: RelatedProduct[];
}

const ComboDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [combo, setCombo] = useState<Combo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<{
        [productId: string]: string;
    }>({});
    const [selectedSize, setSelectedSize] = useState<{
        [productId: string]: string;
    }>({});
    const [availableQuantity, setAvailableQuantity] = useState(0);

    useEffect(() => {
        const fetchComboDetails = async () => {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            try {
                const response = await axiosInstance.get(
                    `/detailCombos/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const comboData: Combo = response.data.data;
                setCombo(comboData || null);
                if (comboData) {
                    setAvailableQuantity(comboData.available_quantity);
                } else {
                    setError("Thông tin combo không khả dụng.");
                }
            } catch {
                setError("Không tìm thấy sản phẩm.");
            } finally {
                setLoading(false);
            }
        };
        fetchComboDetails();
    }, [id]);

    const handleQuantityChange = (change: number) => {
        setQuantity((prev) => {
            const newQuantity = prev + change;
            return newQuantity > 0 &&
                newQuantity <= (combo?.available_quantity || 0)
                ? newQuantity
                : prev;
        });
    };
const getAllUniqueSizes = (variants: Variant[]) => {
    return Array.from(
        new Set(variants.map((variant) => variant.sizes.name))
    );
};
    const handleColorChange = (color: string, product: RelatedProduct) => {
        const productId = product.id.toString();
        setSelectedColor((prev) => ({ ...prev, [productId]: color }));
        setSelectedSize((prev) => ({ ...prev, [productId]: "" }));
    };

    const handleSizeChange = (size: string, productId: string) => {
        setSelectedSize((prev) => ({ ...prev, [productId]: size }));
    };

    const validateSelections = () => {
        return combo?.products.every((product) => {
            const color = selectedColor[product.id.toString()];
            const size = selectedSize[product.id.toString()];
            return color && size;
        });
    };
    
const getSizesForColor = (variants: Variant[], selectedColor: string) => {
    return variants.filter((variant) => variant.colors.name === selectedColor);
};

    const handleBuyNow = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            message.error("Vui lòng đăng nhập để mua sản phẩm.");
            navigate("/login");
            return;
        }

        if (!validateSelections()) {
            message.error(
                "Vui lòng chọn đầy đủ màu sắc và kích thước cho tất cả sản phẩm.",
            );
            return;
        }

        // Kiểm tra số lượng combo
        if (quantity === 0 || availableQuantity === 0) {
            message.error("Số lượng combo không đủ.");
            return;
        }

        try {
            const orderData = combo!.products
                .map((product) => {
                    const productId = product.id.toString();
                    const color = selectedColor[productId];
                    const size = selectedSize[productId];
                    const variant = product.variants.find(
                        (v) => v.colors.name === color && v.sizes.name === size,
                    );
                    return {
                        variantId: variant?.id || null,
                    };
                })
                .filter((item) => item.variantId);

            const params = {
                comboId: combo?.id,
                quantity,
                variantIds: orderData.map((item) => item.variantId),
            };

            const response = await axiosInstance.get(
                "/listInformationOrderCombo",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params,
                },
            );

            if (response.data.status) {
                message.success("Lấy thông tin sản phẩm thành công.");
                const orderDetails = {
                    comboId: combo?.id,
                    quantity,
                    variantIds: orderData.map((item) => item.variantId),
                };
                localStorage.setItem("orderData", JSON.stringify(orderDetails));
                navigate("/payCombo", { state: orderDetails });
            } else {
                message.error(response.data.message);
            }
        } catch {
            message.error("Có lỗi xảy ra khi lấy thông tin sản phẩm.");
        }
    };

    // Định nghĩa hàm getUniqueColors
    const getUniqueColors = (variants: Variant[]) => {
        return variants.reduce((unique: Variant[], variant: Variant) => {
            if (!unique.some((v) => v.colors.name === variant.colors.name)) {
                unique.push(variant);
            }
            return unique;
        }, []);
    };
  const handleProductClick = (id: number) => {
      navigate(`/detail/${id}`);
  };
    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!combo) return <div>Không tìm thấy bộ trang sức!</div>;

    return (
        <div>
            <Header />
            <div className="tf-breadcrumb">
                <div className="container">
                    <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
                        <div className="tf-breadcrumb-list">
                            <a href="/" className="text">
                                Trang chủ -
                            </a>
                            <span className="text">{combo?.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="flat-spacing-4 pt_0">
                <div className="tf-main-product section-image-zoom">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="tf-product-media-wrap sticky-top">
                                    <div className="product-images-wrapper">
                                        <Swiper
                                            spaceBetween={20}
                                            slidesPerView={1}
                                            loop
                                            style={{
                                                width: "100%",
                                                height: "500px",
                                            }}
                                        >
                                            <SwiperSlide>
                                                <img
                                                    src={combo?.image}
                                                    style={{
                                                        width: "100%",
                                                        height: "500px",
                                                        objectFit: "cover",
                                                    }}
                                                    alt={combo?.name}
                                                />
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="tf-product-info-wrap position-relative">
                                    <div className="tf-product-info-title">
                                        <h5 className="product-name">
                                            {combo?.name}
                                        </h5>
                                    </div>

                                    <div className="tf-product-info-price">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                className="price-on-sale"
                                                style={{ marginRight: "10px" }}
                                            >
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
                                                    ).format(combo?.price)}
                                                </span>
                                            </div>
                                            <div className="price-list">
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
                                                    ).format(combo?.sum_price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {combo.products.map((product) => (
                                        <div
                                            className="combo-product"
                                            key={product.id}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "15px",
                                                }}
                                            >
                                                <img
                                                    onClick={() =>
                                                        handleProductClick(
                                                            product.id,
                                                        )
                                                    }
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        marginRight: "10px",
                                                    }}
                                                />
                                                <div>
                                                    <h6
                                                        onClick={() =>
                                                            handleProductClick(
                                                                product.id,
                                                            )
                                                        }
                                                    >
                                                        {product.name}
                                                    </h6>

                                                    {/* Màu sắc */}
                                                    <div
                                                        className="tf-variant-colors d-flex align-items-center"
                                                        style={{
                                                            margin: "10px 0",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                marginRight:
                                                                    "10px",
                                                            }}
                                                        >
                                                            Màu sắc:
                                                        </span>
                                                        {getUniqueColors(
                                                            product.variants,
                                                        ).map((variant) => (
                                                            <input
                                                                key={variant.id}
                                                                type="radio"
                                                                name={`color-${product.id}`}
                                                                checked={
                                                                    selectedColor[
                                                                        product.id.toString()
                                                                    ] ===
                                                                    variant
                                                                        .colors
                                                                        .name
                                                                }
                                                                onChange={() =>
                                                                    handleColorChange(
                                                                        variant
                                                                            .colors
                                                                            .name,
                                                                        product,
                                                                    )
                                                                }
                                                                style={{
                                                                    appearance:
                                                                        "none",
                                                                    width: "20px",
                                                                    height: "20px",
                                                                    borderRadius:
                                                                        "50%",
                                                                    backgroundColor:
                                                                        variant
                                                                            .colors
                                                                            .code,
                                                                    border:
                                                                        selectedColor[
                                                                            product.id.toString()
                                                                        ] ===
                                                                        variant
                                                                            .colors
                                                                            .name
                                                                            ? "2px solid gray"
                                                                            : "1px solid #ccc",
                                                                    margin: "0 5px",
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>

                                                    <div className="tf-size-selection d-flex align-items-center">
                                                        <span>
                                                            Kích thước :
                                                            <span
                                                                style={{
                                                                    color: "Gray",
                                                                }}
                                                            >
                                                                (đường kính cm)
                                                            </span>
                                                        </span>
                                                        <div className="tf-variant-sizes d-flex flex-wrap">
                                                            {getAllUniqueSizes(
                                                                product.variants,
                                                            ).map(
                                                                (sizeName) => {
                                                                    const isSizeAvailableForColor =
                                                                        product.variants.some(
                                                                            (
                                                                                variant,
                                                                            ) =>
                                                                                variant
                                                                                    .colors
                                                                                    .name ===
                                                                                    selectedColor[
                                                                                        product.id.toString()
                                                                                    ] &&
                                                                                variant
                                                                                    .sizes
                                                                                    .name ===
                                                                                    sizeName,
                                                                        );

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                sizeName
                                                                            }
                                                                            className={`size-box ${
                                                                                selectedSize[
                                                                                    product.id.toString()
                                                                                ] ===
                                                                                    sizeName &&
                                                                                selectedColor[
                                                                                    product.id.toString()
                                                                                ]
                                                                                    ? "selected"
                                                                                    : ""
                                                                            }`}
                                                                            onClick={() =>
                                                                                isSizeAvailableForColor &&
                                                                                selectedColor[
                                                                                    product.id.toString()
                                                                                ]
                                                                                    ? handleSizeChange(
                                                                                          sizeName,
                                                                                          product.id.toString(),
                                                                                      )
                                                                                    : undefined
                                                                            }
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                justifyContent:
                                                                                    "center",
                                                                                alignItems:
                                                                                    "center",
                                                                                width: "40px",
                                                                                height: "40px",
                                                                                margin: "5px",
                                                                                cursor:
                                                                                    selectedColor[
                                                                                        product.id.toString()
                                                                                    ] &&
                                                                                    isSizeAvailableForColor
                                                                                        ? "pointer"
                                                                                        : "not-allowed", 
                                                                                border:
                                                                                    selectedSize[
                                                                                        product.id.toString()
                                                                                    ] ===
                                                                                    sizeName
                                                                                        ? "2px solid lightgray"
                                                                                        : "1px solid #ccc",
                                                                                borderRadius:
                                                                                    "5px",
                                                                                backgroundColor:
                                                                                    selectedSize[
                                                                                        product.id.toString()
                                                                                    ] ===
                                                                                    sizeName
                                                                                        ? "lightgray"
                                                                                        : "#f9f9f9",
                                                                                opacity:
                                                                                    isSizeAvailableForColor
                                                                                        ? 1
                                                                                        : 0.5,
                                                                            }}
                                                                        >
                                                                            {
                                                                                sizeName
                                                                            }
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="remaining-quantity mt-3">
                                        <p>
                                            Số lượng còn lại:{" "}
                                            <strong>{availableQuantity}</strong>
                                        </p>
                                    </div>

                                    <div className="tf-product-info-quantity mt-4">
                                        <div className="wg-quantity">
                                            <span
                                                className="btn-quantity minus-btn"
                                                onClick={() =>
                                                    handleQuantityChange(-1)
                                                }
                                                style={{
                                                    cursor:
                                                        quantity > 1
                                                            ? "pointer"
                                                            : "not-allowed",
                                                    opacity:
                                                        quantity > 1 ? 1 : 0.5,
                                                }}
                                            >
                                                -
                                            </span>
                                            <input
                                                type="text"
                                                value={quantity}
                                                readOnly
                                            />
                                            <span
                                                className="btn-quantity plus-btn"
                                                onClick={() =>
                                                    handleQuantityChange(1)
                                                }
                                                style={{
                                                    cursor:
                                                        quantity <
                                                        (combo?.available_quantity ||
                                                            0)
                                                            ? "pointer"
                                                            : "not-allowed",
                                                    opacity:
                                                        quantity <
                                                        (combo?.available_quantity ||
                                                            0)
                                                            ? 1
                                                            : 0.5,
                                                }}
                                            >
                                                +
                                            </span>
                                        </div>
                                    </div>

                                    <div className="tf-product-info-buy-now-button mt-3">
                                        <button
                                            className="btns-full btn-buy-now"
                                            onClick={handleBuyNow}
                                            style={{
                                                backgroundColor: "#FFA500",
                                                color: "#fff",
                                                padding: "15px 0",
                                                width: "100%",
                                                textAlign: "center",
                                                display: "block",
                                                fontSize: "18px",
                                                borderRadius: "5px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hiển thị chi tiết combo */}
                    <div
                        className="mt-4 tf-product-description"
                        style={{
                            fontSize: "18px",
                            padding: "20px",
                            lineHeight: "1.6",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                        }}
                    >
                        <h5 style={{ fontSize: "24px", marginBottom: "16px" }}>
                            Mô tả sản phẩm
                        </h5>
                        <p style={{ fontSize: "18px" }}>{combo?.description}</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ComboDetail;
