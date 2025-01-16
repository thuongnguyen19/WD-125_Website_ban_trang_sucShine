// Profile.js
import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import axiosInstance from "../configs/axios";

const Profile = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const [messageAPI, contextHolder] = message.useMessage();
    const [user, setUser] = useState<{ name: string } | null>(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            setIsAuthenticated(true);

            axiosInstance
                .get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                })
                .then((response) => {
                    if (response.data.user && response.data.user.name) {
                        setUser(response.data.user); 
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);

    const handleLogout = () => {
        Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có muốn đăng xuất không?",
            okText: "Đăng xuất",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const token = localStorage.getItem("authToken");

                    await axiosInstance.post(
                        "/logout",
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );

                    localStorage.removeItem("authToken");
                    localStorage.clear();
                    queryClient.clear();
                    messageAPI.success("Đã đăng xuất thành công!");

                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                } catch (error) {
                    messageAPI.error(
                        "Đăng xuất không thành công. Vui lòng thử lại.",
                    );
                }
            },
        });
    };

    const pageTitle = location.pathname.includes("od_histori")
        ? "Lịch sử đơn hàng của bạn"
        : location.pathname.includes("coupons")
          ? "Tất cả mã giảm giá"
          : location.pathname.includes("view")
            ? "Sản phẩm xem gần đây"
            // : location.pathname.includes("dv")
            //   ? "Thông tin dịch vụ"
              : location.pathname.includes("personal")
                ? "Thông tin cá nhân"
                : `Bảng điều khiển của ${user?.name || "người dùng"}`;

    return (
        <div>
            <Header />
            {contextHolder}
            <div className="col-xl-3 col-md-4 col-3">
                <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
                    <li className="nav-search">
                        <a
                            href="#canvasSearch"
                            data-bs-toggle="offcanvas"
                            aria-controls="offcanvasLeft"
                            className="nav-icon-item"
                        ></a>
                    </li>
                    <li className="nav-account">
                        <a
                            href="#login"
                            data-bs-toggle="modal"
                            className="nav-icon-item"
                        ></a>
                    </li>
                </ul>
            </div>
            <div className="tf-page-title">
                <div className="container-full">
                    <div className="heading text-center">{pageTitle}</div>
                </div>
            </div>
            <section className="flat-spacing-11">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <ul className="my-account-nav">
                                <li>
                                    <Link
                                        to="/profile/personal"
                                        className={`my-account-nav-item ${location.pathname.includes("personal") ? "active" : ""}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Thông tin cá nhân
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="od_histori"
                                        className={`my-account-nav-item ${location.pathname.includes("od_histori") ? "active" : ""}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Đơn hàng
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="coupons"
                                        className={`my-account-nav-item ${location.pathname.includes("coupons") ? "active" : ""}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Mã giảm giá của tôi
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="view"
                                        className={`my-account-nav-item ${location.pathname.includes("view") ? "active" : ""}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Sản phẩm xem gần đây
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link
                                        to="dv" 
                                        className={`my-account-nav-item ${location.pathname.includes("dv") ? "active" : ""}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Dịch vụ
                                    </Link>
                                </li> */}
                                <li>
                                    <a
                                        onClick={handleLogout}
                                        className="my-account-nav-item"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Đăng xuất
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-9">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Profile;
