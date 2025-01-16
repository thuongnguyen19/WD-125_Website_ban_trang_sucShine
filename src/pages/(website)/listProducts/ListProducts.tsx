import React, { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    CloseOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
    FilterOutlined,
    HeartFilled,
    HeartOutlined, // Thêm biểu tượng trái tim
} from "@ant-design/icons";
import { fetchProducts, Product } from "../../../Interface/Product";
import { Category, fetchCategorys } from "../../../Interface/Category";
import { message } from "antd"; // Đảm bảo import message từ antd
import axiosInstance from "../../../configs/axios";
import { debounce } from "lodash";

const ListProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("none");
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | number>("");
    const [search, setSearch] = useState("");
    const perPage = 12;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || ""; // Lấy từ khóa từ URL
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]); // Danh sách sản phẩm yêu thích
    const [minPrice, setMinPrice] = useState<number>(1000000); // Giá trị tối thiểu
    const [maxPrice, setMaxPrice] = useState<number>(20000000); // Giá trị tối đa

    // Hàm cập nhật giá trị bộ lọc
    const handlePriceFilterChange = debounce((min: number, max: number) => {
        setMinPrice(min);
        setMaxPrice(max);
        setPage(1); // Reset về trang đầu tiên
    }, 300); // Chỉ thực thi sau 300ms dừng tương tác

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMinPrice = Number(e.target.value);
        handlePriceFilterChange(newMinPrice, maxPrice);
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMaxPrice = Number(e.target.value);
        handlePriceFilterChange(minPrice, newMaxPrice);
    };

    useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (keyword.trim()) {
        setLoading(true);
        try {
          const response = await axiosInstance.get<Product[]>(
            `/search-product?query=${encodeURIComponent(keyword)}`
          );
          setProducts(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFilteredProducts();
  }, [keyword]);

    // Gọi API để lấy sản phẩm
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("category");
        const query = params.get("query");
        const selectedCategory = categoryId == 'all'? '':categoryId??'';
        const search = query ? query : '';
        // setSearch(query);
        setSelectedCategory(selectedCategory);
        const loadProducts = async () => {
            try {
                const { data, total_pages } = await fetchProducts(
                    sortBy,
                    sortOrder,
                    minPrice,
                    maxPrice,
                    selectedCategory,
                    search,
                    page,
                    perPage,
                );
                setProducts(data);
                setTotalPages(total_pages);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải sản phẩm.");
            }
        };

        loadProducts();
    }, [sortBy, sortOrder, minPrice, maxPrice, selectedCategory, search, page, perPage]);


    useEffect(() => {
        const loadFavorites = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const response = await axiosInstance.get(
                    "/favoriteProduct",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setFavorites(
                    response.data.map(
                        (fav: { id_product: number }) => fav.id_product,
                    ),
                );
            } catch (error) {
                console.error("Lỗi khi tải yêu thích:", error);
            }
        };
        loadFavorites();
    }, []);

    // Lấy dữ liệu danh mục khi component được load
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await fetchCategorys();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Lỗi khi tải giỏ hàng:", error);
            }
        };
        loadCategories();
    }, []);

    // Hàm thay đổi trang
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // Hàm thay đổi sắp xếp
    const handleSortChange = (value: string) => {
        if (value.includes("Giá")) {
            setSortBy("price");
            setSortOrder(value === "Giá, từ thấp đến cao" ? "asc" : "desc");
        } else {
            setSortBy("name");
            setSortOrder(value === "Theo thứ tự, A-Z" ? "asc" : "desc");
        }
    };

    // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedCategory(e.target.value);
    //     navigate(`/products?category=${e.target.value}`)
    //     setPage(1);
    // };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
        navigate(`/products?category=${categoryId}`);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        navigate(`/products?query=${e.target.value}`)
        setPage(1);
    };

    const handleProductClick = (id: number) => {
        navigate(`/detail/${id}`);
    };

    const updateLocalStorageFavorite = (updatedFavorites: any[]) => {
        localStorage.setItem("favorite", JSON.stringify(updatedFavorites));
        window.dispatchEvent(new Event("storage"));
    };

    const handleFavoriteToggle = async (productId: number) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            message.error(
                "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích.",
            );
            navigate("/login");
            return;
        }

        const isFavorite = favorites.includes(productId);

        try {
            if (isFavorite) {
                // Xóa khỏi danh sách yêu thích nếu đã yêu thích
                await axiosInstance.delete(
                    `/favoriteProduct/${productId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );

                // Cập nhật trạng thái yêu thích trong giao diện
                setFavorites(favorites.filter((id) => id !== productId));

                // Cập nhật localStorage
                const favoriteData = JSON.parse(
                    localStorage.getItem("favorite") || "[]",
                );
                const updatedFavorites = favoriteData.filter(
                    (item: { id_product: number }) =>
                        item.id_product !== productId,
                );
                updateLocalStorageFavorite(updatedFavorites);

                localStorage.setItem(`isFavorite_${productId}`, "false");
                message.success("Đã xóa sản phẩm khỏi danh sách yêu thích.");
            } else {
                // Thêm vào danh sách yêu thích nếu chưa yêu thích
                await axiosInstance.post(
                    "/favoriteProduct",
                    { product_id: productId },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );

                setFavorites([...favorites, productId]);

                const favoriteData = JSON.parse(
                    localStorage.getItem("favorite") || "[]",
                );
                favoriteData.push({ id_product: productId });
                updateLocalStorageFavorite(favoriteData);

                localStorage.setItem(`isFavorite_${productId}`, "true");
                message.success("Đã thêm sản phẩm vào danh sách yêu thích.");
            }
        } catch (error) {
            message.error(
                "Có lỗi xảy ra khi thêm hoặc xóa sản phẩm yêu thích.",
            );
        }
    };

    if (loading) {
        return <p>Đang tải...</p>;
    }

    return (
        <div>
            <Header />
            <div className="tf-page-title">
                <div className="container-full">
                    <div className="heading text-center">Tất cả sản phẩm</div>
                </div>
            </div>

            <section className="flat-spacing-2">
                <div className="container">
                    <div className="tf-shop-control grid-3 align-items-center">
                        {/* <div className="tf-control-filter">
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        <div className="tf-control-filter">
                            <a href="#filterShop" data-bs-toggle="offcanvas" aria-controls="offcanvasLeft" className="tf-btn-filter"><span><FilterOutlined /></span><span className="text">Lọc</span></a>
                        </div>
                        <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
                            <div className="canvas-wrapper">
                                <header className="canvas-header">
                                    <div className="filter-icon">
                                        <span><FilterOutlined /></span>
                                        <span>Lọc</span>
                                    </div>
                                    <span data-bs-dismiss="offcanvas" aria-label="Close"><CloseOutlined /></span>
                                </header>
                                <div className="canvas-body">
                                    <div className="widget-facet wd-categories">
                                        <div
                                            className="facet-title"
                                            data-bs-target="#categories"
                                            
                                            aria-expanded="true"
                                            aria-controls="categories"
                                        >
                                            <span>Danh mục</span>
                                        </div>
                                        <div id="categories">
                                            <ul className="list-categoris current-scrollbar mb_36">
                                                <li
                                                    className={`cate-item ${selectedCategory === "all" ? "current" : ""}`}
                                                    onClick={() => handleCategoryClick("")}
                                                >
                                                    <a>Tất cả</a>
                                                </li>
                                                {categories.map((category) => (
                                                    <li
                                                        key={category.id}
                                                        className={`cate-item ${selectedCategory === String(category.id) ? "current" : ""}`}
                                                        onClick={() => handleCategoryClick(String(category.id))}
                                                    >
                                                        <a>{category.name}</a>
                                                    </li>

                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <form action="#" id="facet-filter-form" className="facet-filter-form">
                                        
                                        <div className="widget-facet">
                                            <div className="facet-title" data-bs-target="#price"  aria-expanded="true" aria-controls="price">
                                                <span>Giá</span>
                                            </div>
                                            <div id="price">
                                                <div className="widget-price filter-price">
                                                    <div className="tow-bar-block">
                                                        <div className="progress-price"></div>
                                                    </div>
                                                    <div className="range-input">
                                                        <input
                                                            className="range-min"
                                                            type="range"
                                                            min="1000000"
                                                            max="20000000"
                                                            value={minPrice}
                                                            onChange={handleMinPriceChange}
                                                        />
                                                        <input
                                                            className="range-max"
                                                            type="range"
                                                            min="1000000"
                                                            max="20000000"
                                                            value={maxPrice}
                                                            onChange={handleMaxPriceChange}
                                                        />

                                                    </div>
                                                    <div className="box-title-price">
                                                        <span className="title-price">Giá :</span>
                                                        <div className="caption-price">
                                                            <div>
                                                                <span className="min-price">
                                                                    {new Intl.NumberFormat(
                                                                        "vi-VN",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "VND",
                                                                        },
                                                                    ).format(
                                                                        minPrice
                                                                    )}
                                                                </span>
                                                                
                                                            </div>
                                                            <span>-</span>
                                                            <div>
                                                                <span className="max-price">
                                                                    {new Intl.NumberFormat(
                                                                        "vi-VN",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "VND",
                                                                        },
                                                                    ).format(
                                                                        maxPrice
                                                                    )}
                                                                </span>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        
                                    </form>    
                                </div>
                                
                            </div>       
                        </div>
                        <div className="tf-control-layout d-flex justify-content-center">
                            <div className="search">
                                <div className="search-container">
                                    <input
                                        className="search-input"
                                        style={{ width: "400px" }}
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                {error && (
                                    <div className="error-message">{error}</div>
                                )}
                            </div>
                        </div>

                        <div className="tf-control-sorting d-flex justify-content-end">
                            <div className="tf-dropdown-sort">
                                <select
                                    onChange={(e) =>
                                        handleSortChange(e.target.value)
                                    }
                                >
                                    <option>Lựa chọn</option>
                                    <option value="Giá, từ thấp đến cao">
                                        Giá, từ thấp đến cao
                                    </option>
                                    <option value="Giá, từ cao đến thấp">
                                        Giá, từ cao đến thấp
                                    </option>
                                    <option value="Theo thứ tự, A-Z">
                                        Theo thứ tự, A-Z
                                    </option>
                                    <option value="Theo thứ tự, Z-A">
                                        Theo thứ tự, Z-A
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="wrapper-control-shop">
                        <div
                            className="grid-layout wrapper-shop"
                            data-grid="grid-4"
                        >
      
                            {loading ? (
                                <p>Đang tải...</p>
                            ) :Array.isArray(products) && products.length > 0 ? (
                                products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="card-product"
                                    >
                                        <div className="card-product-wrapper">
                                            <div
                                                className="product-img"
                                                onClick={() =>
                                                    handleProductClick(
                                                        product.id,
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            >
                                                <img
                                                    className="lazyload img-product"
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    style={{ height: 400 }}
                                                />
                                            </div>
                                            <div className="list-product-btn absolute-2">
                                                                                
                                                <a className="box-icon bg_white wishlist btn-icon-action">
                                                    <span>
                                                        {favorites.includes(product.id) ? (
                                                            <HeartFilled
                                                                onClick={() => handleFavoriteToggle(product.id)}
                                                                style={{
                                                                    fontSize: "25px",
                                                                    color: "red",
                                                                    cursor: "pointer",
                                                                    transition: "color 0.3s ease",
                                                                }}
                                                            />
                                                        ) : (
                                                            <HeartOutlined
                                                                onClick={() => handleFavoriteToggle(product.id)}
                                                                style={{
                                                                    fontSize: "25px",
                                                                    color: undefined,
                                                                    cursor: "pointer",
                                                                    transition: "color 0.3s ease",
                                                                }}
                                                            />
                                                        )}

                                                    </span>
                                                    <span className="tooltip">Add to Wishlist</span>
                                                    
                                                </a>
                                                
                                            </div>
                                        </div>
                                            <div className="card-product-info">
                                                <h3
                                                    onClick={() =>
                                                        handleProductClick(
                                                            product.id,
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    className="title link"
                                                >
                                                    {product.name}
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
                                                                product
                                                                    .variants[0]
                                                                    ?.selling_price,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="price-list"
                                                        style={{
                                                            marginLeft: "10px",
                                                        }}
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
                                                                    currency:
                                                                        "VND",
                                                                },
                                                            ).format(
                                                                product
                                                                    .variants[0]
                                                                    ?.list_price,
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

                    {/* Phân trang */}
                        <div className="phantrang">
                            <ul className="tf-pagination-wrap tf-pagination-list tf-pagination-btn">
                                {/* Nút chuyển đến trang trước */}
                                <li className={page === 1 ? "disabled" : ""}>
                                    <a
                                        href="#"
                                        className="pagination-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) handlePageChange(page - 1);
                                        }}
                                    >
                                        <span>
                                            <DoubleLeftOutlined />
                                        </span>
                                    </a>
                                </li>

                                {/* Logic hiển thị các trang */}
                                
                                {page > 2 && (
                                    <li>
                                        <span className="pagination-ellipsis">...</span>
                                    </li>
                                )}

                                {/* Hiển thị trang hiện tại và các trang xung quanh */}
                                {Array.from({ length: 3 }, (_, i) => page - 1 + i)
                                    .filter((pageNumber) => pageNumber > 0 && pageNumber <= totalPages)
                                    .map((pageNumber) => (
                                        <li
                                            key={pageNumber}
                                            className={page === pageNumber ? "active" : ""}
                                        >
                                            <a
                                                href="#"
                                                className="pagination-link animate-hover-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(pageNumber);
                                                }}
                                            >
                                                {pageNumber}
                                            </a>
                                        </li>
                                    ))}

                            
                                {/* Nút chuyển đến trang sau */}
                                <li className={page === totalPages ? "disabled" : ""}>
                                    <a
                                        href="#"
                                        className="pagination-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < totalPages) handlePageChange(page + 1);
                                        }}
                                    >
                                        <span>
                                            <DoubleRightOutlined />
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ListProducts;
