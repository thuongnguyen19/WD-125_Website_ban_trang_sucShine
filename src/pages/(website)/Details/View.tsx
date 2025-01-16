import { useEffect, useState } from 'react';
import { fetchViews, Product } from '../../../Interface/Product';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const View = () => {
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      message.error("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }

    const loadViews = async () => {
      try {
        const data = await fetchViews();
        setViews(data || []); 
        console.log(data);
        
      } catch (err) {
        setError("Không có sản phẩm nào xem gần đây");
      } finally {
        setLoading(false);
      }
    };

    loadViews();
  }, []);

  const handleProductClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="wrapper-control-shop">
        <div
            className="grid-layout wrapper-shop"
            data-grid="grid-4"
        >
            {views.length > 0 ? (
              views.map((product) => (
                <div key={product.id} className="product-item">
                  <div key={product.id} className="card-product">
                        <div className="card-product-wrapper">
                            
                            <div    
                                className="product-img"
                                onClick={() => handleProductClick(product.id)}
                                style={{ cursor: "pointer", height: "305px" }}
                            >
                                <img
                                    className="lazyload img-product"
                                    src={product.thumbnail}
                                    alt={product.name}
                                />
                            </div>
                            <div className="card-product-info">
                                <h3
                                    onClick={() => handleProductClick(product.id)}
                                    style={{ cursor: "pointer" }}
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
                                                
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants[0]?.selling_price)}
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
                                                
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants[0]?.list_price)}
                                            </span>
                                        </div>
                                    </div>
                                
                            </div>
                        </div>
                    </div>
                  
                </div>
              ))
            ) : (
              <p>Không có sản phẩm nào xem gần đây</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default View;
