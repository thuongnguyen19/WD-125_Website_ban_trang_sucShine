import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Header2 from "../components/common/Header2";
import Footer from "../components/common/Footer";
import { Avatar, Input, message, Modal, Spin } from "antd";
import {
    CaretDownOutlined,
    HeartOutlined,
    MenuOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Home from "../pages/(website)/home/page";
import { Category, fetchCategorys } from "../Interface/Category";
import axiosInstance from "../configs/axios";
import { fetchSearchs, Search } from "../Interface/Product";

const Layoutweb: React.FC = () => {
    const navigate = useNavigate();
    const [messageAPI, contextHolder] = message.useMessage();
    const [user, setUser] = useState<{ name: string; image: string } | null>(
        null,
    ); // Lưu thông tin người dùng
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Kiểm tra người dùng đăng nhập
    const [favorite, setFavorite] = useState<number>(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);

    const [cartCount, setCartCount] = useState<number>(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [query, setQuery] = useState("");
  const [results, setResults] = useState<Search[]>([]);
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setQuery(""); // Reset query
    setResults([]); // Reset kết quả
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    
    try {
      const data = await fetchSearchs(value); // Gọi API tìm kiếm
      setResults(data); // Lưu kết quả tìm kiếm
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("Vui lòng đăng nhập lại.");
                return;
            }

            try {
                const response = await axiosInstance.get(
                    "/listInformationOrder",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                setIsAuthenticated(true);
                setUser(response.data.data.user);
            } catch (error) {
                message.error("Lấy thông tin người dùng không thành công!");
            }
        };

        fetchUserData();
    }, []);
    console.log(user);

    useEffect(() => {
    // Hàm tải danh mục sản phẩm
    const loadCategories = async () => {
        try {
            const data = await fetchCategorys(); // Gọi API để tải danh mục
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục sản phẩm:", error);
        }
        setLoading(false);
    };

    // Hàm tính số sản phẩm trong giỏ hàng
    const fetchCartCount = () => {
        const cartData = localStorage.getItem("cartItems");
        const favoriteData = localStorage.getItem("favorite");

        if (favoriteData) {
            const favoriteItems = JSON.parse(favoriteData);
            setFavorite(favoriteItems.length);
        }

        if (cartData) {
            const cartItems = JSON.parse(cartData);
            setCartCount(cartItems.length); // Đếm số sản phẩm thay vì tổng số lượng
        } else {
            setCartCount(0); // Nếu không có sản phẩm nào thì đặt về 0
        }
    };

    const token = localStorage.getItem("authToken");
    if (token) {
        setIsLoggedIn(true);
    }

    loadCategories();
    fetchCartCount();

    window.addEventListener("storage", fetchCartCount);

    return () => {
        window.removeEventListener("storage", fetchCartCount);
    };
}, []);


    if (loading) {
        return <p>Đang tải...</p>;
    }

    const handleProductClick = (id: number) => {
        navigate(`/detail/${id}`);
    };
    const goToProfile = () => {
        navigate("/profile");
    };

    return (
        <>
            {contextHolder}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    transition: "top 0.3s",
                }}
            >
                <div>
                    <header
                        id="header"
                        className="header-default header-absolute header-black"
                    >
                        <div className="container-full px_15 lg-px_40">
                            <div className="row wrapper-header align-items-center">
                                <div className="col-md-4 col-3 tf-lg-hidden">
                                    <a
                                        href="#mobileMenu"
                                        data-bs-toggle="offcanvas"
                                        aria-controls="mobileMenu"
                                    >
                                        <MenuOutlined
                                            style={{ fontSize: "24px" }}
                                        />
                                    </a>
                                </div>
                                <div
                                    className="offcanvas offcanvas-start"
                                    tabIndex={-1}
                                    id="mobileMenu"
                                    aria-labelledby="offcanvasLabel"
                                >
                                    <div className="offcanvas-header">
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="offcanvas"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="offcanvas-body">
                                        <ul className="list-group">
                                            <li className="list-group-item">
                                                <Link to="/">Trang chủ</Link>
                                            </li>
                                            <li className="list-group-item">
                                                <div>Danh mục</div>
                                                <ul>
                                                    {categories.map(
                                                        (category) => (
                                                            <li
                                                                key={
                                                                    category.id
                                                                }
                                                            >
                                                                <a
                                                                    href={`/products?category=${category.id}`}
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </a>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to="/products">
                                                    Sản phẩm
                                                </Link>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to="/ser">Dịch vụ</Link>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to="/about">
                                                    Về chúng tôi
                                                </Link>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to="/lienhe">
                                                    Liên hệ
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-4 col-6">
                                    <a
                                        href="index.html"
                                        className="logo-header"
                                    >
                                        <img
                                            src="/public/duan/Logo. shine.2.png"
                                            style={{
                                                height: "60px",
                                                width: "60px",
                                            }}
                                            alt="logo"
                                            className="logo"
                                        />
                                    </a>
                                </div>

                                <div className="col-xl-6 tf-md-hidden">
                                    <nav className="box-navigation text-center">
                                        <ul className="box-nav-ul d-flex align-items-center justify-content-center gap-30">
                                            <li className="menu-item">
                                                <Link
                                                    to="/"
                                                    className="item-link"
                                                >
                                                    Trang chủ
                                                </Link>
                                            </li>
                                            <li className="menu-item">
                                                <a
                                                    href="#"
                                                    className="item-link"
                                                >
                                                    Danh mục
                                                </a>
                                                <div className="sub-menu submenu-default">
                                                    <ul className="menu-list">
                                                        {categories.map(
                                                            (category) => (
                                                                <li
                                                                    key={
                                                                        category.id
                                                                    }
                                                                >
                                                                    <Link
                                                                        to={`/products?category=${category.id}`}
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            </li>
                                            <li className="menu-item">
                                                <Link
                                                    to="/products"
                                                    className="item-link"
                                                >
                                                    Sản phẩm
                                                </Link>
                                            </li>
                                            {/* <li className="menu-item">
                                                <Link
                                                    to="/ser"
                                                    className="item-link"
                                                >
                                                    Dịch vụ
                                                </Link>
                                            </li> */}
                                            <li className="menu-item">
                                                <Link
                                                    to="/about"
                                                    className="item-link"
                                                >
                                                    Về chúng tôi
                                                </Link>
                                            </li>
                                            <li className="menu-item">
                                                <Link
                                                    to="/lienhe"
                                                    className="item-link"
                                                >
                                                    Liên hệ
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="col-xl-3 col-md-4 col-3">
                                    <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
                                        <li className="nav-search">
                                            <a
                                                href="#canvasSearch"
                                                data-bs-toggle="offcanvas"
                                                aria-controls="offcanvasLeft"
                                                className="nav-icon-item"
                                            >
                                                <SearchOutlined
                                                    style={{ fontSize: "24px" }}
                                                    onClick={handleOpenModal}
                                                />
                                            </a>
                                        </li>
                                        <Modal
                                            open={isModalVisible}
                                            onCancel={handleCloseModal}
                                            footer={null}
                                            centered
                                            width={500}
                                        >
                                            {/* Input tìm kiếm */}
                                            <div className="modal-header">
                                                <Input
                                                    placeholder="Nhập tên sản phẩm..."
                                                    value={query}
                                                    onChange={handleSearch}
                                                />
                                            </div>

                                            {/* Kết quả tìm kiếm */}
                                            <div className="search-results">
                                                {loading ? (
                                                    <Spin tip="Đang tìm kiếm..." />
                                                ) : results.length > 0 ? (
                                                    <ul>
                                                        {results.map(
                                                            (product) => (
                                                                <li
                                                                    key={
                                                                        product.id
                                                                    }
                                                                    className="result-item"
                                                                >
                                                                    <img
                                                                        onClick={() =>
                                                                            handleProductClick(
                                                                                product.id,
                                                                            )
                                                                        }
                                                                        src={
                                                                            product.thumbnail
                                                                        }
                                                                        alt={
                                                                            product.name
                                                                        }
                                                                        className="result-thumbnail"
                                                                    />
                                                                    <div
                                                                        className="result-details"
                                                                        onClick={() =>
                                                                            handleProductClick(
                                                                                product.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <span className="result-name">
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                ) : query.length >= 3 ? (
                                                    <p
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Không tìm thấy sản phẩm
                                                    </p>
                                                ) : null}
                                            </div>
                                        </Modal>
                                        <li className="nav-cart">
                                            <Link
                                                to="/favorite"
                                                className="nav-icon-item"
                                            >
                                                <HeartOutlined
                                                    style={{ fontSize: "24px" }}
                                                />
                                                <span className="count-box">
                                                    {favorite}
                                                </span>
                                            </Link>
                                        </li>
                                        <li className="nav-account">
                                            {isAuthenticated ? (
                                                <div>
                                                    <span
                                                        onClick={goToProfile}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Avatar
                                                            style={{
                                                                marginLeft: 10,
                                                            }}
                                                            size={40}
                                                            src={user?.image}
                                                            alt={user?.name}
                                                        />
                                                    </span>
                                                </div>
                                            ) : (
                                                <Link
                                                    to="/login"
                                                    className="nav-icon-item"
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            fontSize: "24px",
                                                        }}
                                                    />
                                                </Link>
                                            )}
                                        </li>
                                        <li className="nav-cart">
                                            <Link
                                                to="/cart"
                                                className="nav-icon-item"
                                            >
                                                <ShoppingCartOutlined
                                                    style={{ fontSize: "24px" }}
                                                />
                                                <span className="count-box">
                                                    {cartCount}
                                                </span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                <Header2 />

                <Home />

                <Footer />
            </div>
        </>
    );
};

export default Layoutweb;
