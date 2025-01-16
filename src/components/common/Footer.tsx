import { FacebookOutlined, InstagramOutlined, PinterestOutlined, TikTokOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
   import { Button, Card, Carousel } from "antd"; // Import Carousel từ Ant Design
   import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper và SwiperSlide
   import { Pagination } from "swiper/modules";
   import axios from "axios";
   import { useNavigate } from "react-router-dom";
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

const Footer = () => {
 



    // const [adConfig, setAdConfig] = useState<ApiResponse | null>(null);
    // const navigate = useNavigate();
    // useEffect(() => {
    //     const fetchAdConfig = async () => {
    //         try {
    //             const response = await axios.get<ApiResponse>(
    //                 "http://127.0.0.1:8000/api/getConfig",
    //             );
    //             setAdConfig(response.data);
    //         } catch (error) {
    //             console.error("Failed to fetch ad config:", error);
    //         }
    //     };

    //     fetchAdConfig();
    // }, []);
    
    // const handleNavigate = () => {
    //     navigate("/banner"); // Điều hướng đến trang "/banner"
    // };

    // const handleAdClick = async (id: number) => {
    //     try {
    //         const response = await axios.get(
    //             `http://127.0.0.1:8000/api/visits/${id}`,
    //         );
    //         console.log(response.data); // Log kết quả trả về từ API
    //     } catch (error) {
    //         console.error("Failed to register ad click:", error);
    //     }
    // };
    return (
        <div>
            <footer id="footer" className="footer md-pb-70">
                <div className="footer-wrap wow fadeIn" data-wow-delay="0s">
                    <div className="footer-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-3 col-md-6 col-12">
                                    <div className="footer-infor">
                                        <div className="footer-logo">
                                            <a href="index.html">
                                                <img
                                                    src="/public/duan/Logo. shine.2.png"
                                                    style={{
                                                        height: "60px",
                                                        width: "60px",
                                                    }}
                                                    alt=""
                                                />
                                            </a>
                                        </div>
                                        <ul>
                                            <li>
                                                <p>
                                                    Địa chỉ: Tòa nhà FPT
                                                    Polytechnic, Phố Trịnh Văn
                                                    Bô, Nam Từ Liêm, Hà Nội
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    Email:{" "}
                                                    <a href="#">
                                                        shinejewelryshpop@gmail.com
                                                    </a>
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    Số điện thoại:{" "}
                                                    <a href="#">
                                                        0339219385
                                                    </a>
                                                </p>
                                            </li>
                                        </ul>
                                        <ul className="tf-social-icon d-flex gap-10">
                                            <li>
                                                <a
                                                    href="#"
                                                    className="box-icon w_34 round social-facebook social-line"
                                                >
                                                    <FacebookOutlined />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="box-icon w_34 round social-instagram social-line"
                                                >
                                                    <InstagramOutlined />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="box-icon w_34 round social-tiktok social-line"
                                                >
                                                    <TikTokOutlined />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="box-icon w_34 round social-pinterest social-line"
                                                >
                                                    <PinterestOutlined />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                                    <div className="footer-heading footer-heading-desktop">
                                        <h6>Giúp đỡ</h6>
                                    </div>
                                    <div className="footer-heading footer-heading-moblie">
                                        <h6>Giúp đỡ</h6>
                                    </div>
                                    <ul className="footer-menu-list tf-collapse-content">
                                        <li>
                                            <a
                                                href="ac"
                                                className="footer-menu_item"
                                            >
                                                Chính sách bảo mật
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                href="shipping"
                                                className="footer-menu_item"
                                            >
                                                Vận chuyển
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="terms-conditions.html"
                                                className="footer-menu_item"
                                            >
                                                Điều khiển &amp; Điều kiện
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="faq-1.html"
                                                className="footer-menu_item"
                                            >
                                                Câu hỏi thường gặp
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                                    <div className="footer-heading footer-heading-desktop">
                                        <h6>Về chúng tôi</h6>
                                    </div>
                                    <div className="footer-heading footer-heading-moblie">
                                        <h6>Về chúng tôi</h6>
                                    </div>
                                    <ul className="footer-menu-list tf-collapse-content">
                                        <li>
                                            <a
                                                href="about"
                                                className="footer-menu_item"
                                            >
                                                Câu chuyện của chúng tôi
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                href="lienhe"
                                                className="footer-menu_item"
                                            >
                                                Liên hệ
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="/login"
                                                className="footer-menu_item"
                                            >
                                                Tài khoản
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer


