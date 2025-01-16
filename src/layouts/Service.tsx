import React, { useEffect } from "react";
import { ForwardOutlined } from "@ant-design/icons";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Button } from "antd"; // Import Button từ Ant Design
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Service = () => {
    const navigate = useNavigate(); // Khởi tạo hàm navigate

    useEffect(() => {
        // Hiệu ứng marquee cuộn chữ ngang
        const marquee = document.querySelector(".marquee-text");
        let scrollAmount = 0;

        const scrollText = () => {
            if (marquee) {
                scrollAmount -= 4; // Tốc độ cuộn (âm để cuộn sang trái)
                marquee.style.transform = `translateX(${scrollAmount}px)`;

                // Khi dòng chữ chạy hết, reset lại vị trí ban đầu
                if (Math.abs(scrollAmount) >= marquee.scrollWidth) {
                    scrollAmount = marquee.offsetWidth;
                }
                requestAnimationFrame(scrollText);
            }
        };

        requestAnimationFrame(scrollText);

        // Hiệu ứng chữ từ hai bên chạy vào
        const slideInWrappers = document.querySelectorAll(".slide-in-wrapper");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("slide-in-visible");
                    }
                });
            },
            { threshold: 0.1 },
        );

        slideInWrappers.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div>
            <Header />
            {/* Hiển thị giao diện dịch vụ */}
            <div>
                <div className="tf-page-title">
                    <div className="container-full">
                        <div className="heading text-center">
                            Dịch vụ cửa hàng
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: "20px",
                    }}
                >
                    <Button
                        type="primary"
                        size="large"
                        className="button-animated"
                        onClick={() => navigate("/banner")} // Chuyển hướng đến trang banner
                    >
                        Đăng ký ngay
                    </Button>
                </div>

                <div className="swiper-slide" style={{ position: "relative" }}>
                    <div className="wrap-slider">
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1587291884142-M5S7GLDMLCWTEVMZLSJO/chup-anh-san-pham-PNJ-16.jpg"
                            alt="fashion-slideshow-01"
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                                opacity: 0.3,
                            }}
                        />
                        {/* Overlay text */}
                        <div
                            className="overlay-text"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                textAlign: "center",
                                color: "white",
                                fontWeight: "bold",
                                zIndex: 1,
                            }}
                        >
                            <div className="slide-in-wrapper slide-in-left">
                                <h1
                                    className="hover-zoom-text"
                                    style={{
                                        fontSize: "50px",
                                        paddingBottom: 20,
                                        color: "red",
                                    }}
                                >
                                    SHINE-Website bán trang sức uy tín
                                </h1>
                            </div>
                            <h4
                                className="hover-zoom-text"
                                style={{ marginBottom: "20px" }}
                            >
                                Dịch vụ quảng cáo Banner Ads
                            </h4>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    paddingBottom: "60px",
                                    color: "black",
                                    fontSize: "15px",
                                }}
                            >
                                <div className="slide-in-wrapper slide-in-right">
                                    <p
                                        className=" hover-zoom-text"
                                        style={{ marginBottom: "10px" }}
                                    >
                                        Dịch vụ giúp nội dung quảng cáo sẽ giúp
                                        làm nổi bật ưu điểm của dịch vụ và thu
                                        hút sự chú ý của khách hàng tiềm năng
                                    </p>
                                </div>
                                <div className="slide-in-wrapper slide-in-left">
                                    <p
                                        className="hover-zoom-text"
                                        style={{ marginBottom: "10px" }}
                                    >
                                        Tăng nhận diện thương hiệu: Giúp thương
                                        hiệu được nhiều người biết đến hơn.
                                    </p>
                                </div>
                                <div className="slide-in-wrapper slide-in-right">
                                    <p
                                        className="hover-zoom-text"
                                        style={{ marginBottom: "10px" }}
                                    >
                                        Tăng doanh số bán hàng: Gợi ý sản
                                        phẩm/dịch vụ phù hợp với người dùng.
                                    </p>
                                </div>
                                <div className="slide-in-wrapper slide-in-left">
                                    <p className="hover-zoom-text">
                                        Chi phí linh hoạt
                                    </p>
                                </div>
                            </div>

                            <a
                                href="shop-collection-list.html"
                                className="fade-item fade-item-3 tf-btn btn-light-icon animate-hover-btn btn-xl radius-3"
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                    border: "2px solid white",
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    backgroundColor: "white",
                                }}
                            >
                                Đăng ký ngay hôm nay{" "}
                                <ForwardOutlined
                                    style={{
                                        paddingLeft: "10px",
                                        fontSize: 20,
                                    }}
                                />
                            </a>
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                color: "white",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                padding: "10px 0",
                                zIndex: 2,
                            }}
                        >
                            <div className="marquee-container">
                                <div className="marquee-text">
                                    Chào mừng bạn đến với dịch vụ quảng cáo
                                    Banner Ads. Tăng cường nhận diện thương hiệu
                                    của bạn ngay hôm nay và thu hút khách hàng
                                    một cách hiệu quả!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Service;
