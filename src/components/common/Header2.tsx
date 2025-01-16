import React, { useEffect, useState } from "react";
import { Button, Card, Carousel } from "antd"; // Import Carousel từ Ant Design
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper và SwiperSlide
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../configs/axios";
import {
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { Combo, fetchCombos } from "../../Interface/ProductsNew";

// Định nghĩa các interface
interface AdConfig {
    title?: string;
    highlight?: string;
    url?: string;
    image?: string;
    id_ads?: number;
}

interface ApiResponse {
    status: boolean;
    message: string;
    data: {
        [key: string]: string | AdConfig;
    };
}


const Header2 = () => {
    const [adConfig, setAdConfig] = useState<ApiResponse | null>(null);
    const [combos, setCombos] = useState<Combo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdConfig = async () => {
            try {
                const response =
                    await axiosInstance.get<ApiResponse>("/getConfig");
                setAdConfig(response.data);
            } catch (error) {
                console.error("Failed to fetch ad config:", error);
            }
        };

        fetchAdConfig();
    }, []);

    useEffect(() => {
        const fetchCombosData = async () => { // Đổi tên hàm để tránh xung đột
            try {
                const response = await fetchCombos(); // Gọi hàm fetchCombos toàn cục
                setCombos(response); // Gán kết quả vào state
            } catch (error) {
                console.error("Lỗi khi gọi API combo:", error);
            }
        };

        fetchCombosData(); // Gọi hàm bên trong useEffect
    }, []);
        const handleAdClick = (id: number) => {
            try {
                axiosInstance.get<ApiResponse>(`/visits/${id}`); // Điều hướng đến trang combo_detail với id của combo
            } catch (error) {
                console.error("Lỗi khi gọi API combo:", error);
            }
        };

    const handleProductClick = (id: number) => {
        navigate(`/combo_detail/${id}`);
    };


    return (
        <div>
            {/* Carousel */}
            <div className="carousel-container">
                <Carousel
                    autoplay
                    dots={{ className: "custom-dots" }}
                    arrows={true}
                    autoplaySpeed={3000}
                >
                    <div className="wrap-slider">
                        <img
                            src="https://theme.hstatic.net/200000061680/1000549213/14/ms_banner_img3.jpg?v=1348"
                            alt="Slide 1"
                            loading="lazy"
                            className="carousel-image"
                            style={{ height: "800px" }}
                        />
                    </div>
                    <div className="wrap-slider">
                        <img
                            src="https://file.hstatic.net/1000381168/collection/1920x820px_0a49db5dd4d141b2847493aecbda1d78.jpg"
                            alt="Slide 2"
                            loading="lazy"
                            className="carousel-image"
                            style={{ height: "800px" }}
                        />
                    </div>
                    <div className="wrap-slider">
                        <img
                            src="https://huythanhjewelry.vn/storage/photos/uploads/banner-cnc-03_1726623182.jpg"
                            alt="Slide 4"
                            loading="lazy"
                            className="carousel-image"
                            style={{ height: "800px" }}
                            
                        />
                    </div>
                </Carousel>
            </div>

            <div style={{ padding: 20 }}>
                {adConfig?.status ?  (

                        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                                <a
                                    href={adConfig.data?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() =>
                                        handleAdClick(adConfig.data?.id_ads!)
                                    }
                                >
                                    <div style={{ position: "relative" }}>
                                        <img
                                            alt="Banner"
                                            src={adConfig.data?.image}
                                            style={{
                                                width: "1000px",
                                                height: "300px",
                                            }}
                                            className="banner-image"
                                        />
                                        {/* Tiêu đề trên nút */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "40px",
                                                left: "20px",
                                                color: "white",
                                                fontSize: "24px",
                                                fontWeight: "bold",
                                                paddingBottom: "140px",
                                                paddingLeft: "190px",
                                            }}
                                            className="banner-title"
                                        >
                                            {adConfig.data?.title}
                                        </div>


                                        {/* Nút "Xem ngay tại đây" ở giữa */}
                                        {/* <Button
                                            type="primary"
                                            style={{
                                                position: "absolute",
                                                bottom: "100px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                backgroundColor: "#ff5722",
                                                borderColor: "#ff5722",
                                                padding: "10px 10px",
                                                width: "120px",
                                            }}
                                                className="banner-button"
                                        >
                                            Xem ngay tại đây
                                        </Button> */}

                                        {/* Dòng chữ highlight chạy ở góc dưới */}

                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "5px",
                                                left: "20px",
                                                color: "white",
                                                fontSize: "18px",
                                                fontWeight: "normal",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                width: "100%",
                                                animation:
                                                    "scroll-text 10s linear infinite",
                                            }}
                                            className="banner-highlight"
                                        >
                                            {adConfig.data?.highlight}
                                        </div>
                                    </div>
                                </a>
                            
                            
                       </div>

                    
                ) : (
                   ''
                )}
            </div>

            {/* Swiper */}
            <div className="flat-tab-store flat-animate-tab overflow-unset">
                <ul
                    className="widget-tab-3 d-flex justify-content-center flex-wrap wow fadeInUp"
                    data-wow-delay="0s"
                    role="tablist"
                >
                    <li className="nav-tab-item" role="presentation">
                        <a
                            href="#combo"
                            className="active"
                            data-bs-toggle="tab"
                        >
                            Bộ trang sức
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div
                        className="tab-pane active show"
                        id="combo"
                        role="tabpanel"
                        style={{margin: "50px"}}
                    >
                        <div className="wrap-carousel">
                            <div
                                className="swiper tf-sw-product-sell-1"
                                data-preview="4"
                                data-tablet="3"
                                data-mobile="2"
                                data-space-lg="30"
                                data-space-md="15"
                                data-pagination="2"
                                data-pagination-md="3"
                                data-pagination-lg="3"
                            >
                                <div className="swiper-wrapper">
                                    {/* Nút điều hướng slider */}
                                    <div
                                        className="swiper-button-prev"
                                        style={{ color: "black" }}
                                    >
                                        <LeftOutlined />
                                    </div>
                                    <div
                                        className="swiper-button-next"
                                        style={{ color: "black" }}
                                    >
                                        <RightOutlined />
                                    </div>

                                    <Swiper
                                        modules={[Navigation]} // Sử dụng module Navigation cho Swiper
                                        spaceBetween={20}
                                        slidesPerView={4} 
                                        navigation={{
                                            nextEl: ".swiper-button-next",
                                            prevEl: ".swiper-button-prev",
                                        }}
                                        loop={true} // Cho phép slider chạy vòng lặp
                                        className="swiper-container"
                                    >
                                        {combos.map((combo) => (
                                            <SwiperSlide
                                                key={combo.id}
                                            >
                                                <div className="card-product">
                                                    <div className="card-product-wrapper">
                                                        <div
                                                            onClick={() =>
                                                                handleProductClick(
                                                                    combo.id,
                                                                )
                                                            }
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            className="product-img"
                                                        >
                                                            <img
                                                                className="lazyload img-product"
                                                                src={
                                                                    combo.image
                                                                }
                                                                alt={
                                                                    combo.name
                                                                }
                                                                style={{
                                                                    width: "700px",
                                                                    height: "400px",
                                                                }}
                                                            />
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="card-product-info text-center">
                                                        <h3
                                                            onClick={() =>
                                                                handleProductClick(
                                                                    combo.id,
                                                                )
                                                            }
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            className="title link"
                                                        >
                                                            {
                                                                combo.name
                                                            }
                                                        </h3>

                                                        

                                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <div className="price-on-sale">
                                                <span
                                                    style={{
                                                        fontWeight:
                                                            "bold",
                                                        color: "#f00",
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
                                                        combo.price
                                                    )}
                                                </span>
                                            </div>
                                            
                                            
                                        </div>

                                                        {/* <span className="price">Giá cũ: {product.variants[0]?.list_price.toLocaleString()} VND</span> */}
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>

                            <div className="sw-dots style-2 sw-pagination-sell-1 justify-content-center"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Header2;
