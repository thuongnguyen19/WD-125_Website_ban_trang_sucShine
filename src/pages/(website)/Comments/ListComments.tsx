import { useEffect, useState } from 'react'
import { Comment, fetchComment } from '../../../Interface/Order';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

const ListComments = () => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const perPage = 5;
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
        if (!token) {
            message.error("Bạn chưa đăng nhập.");
            return;
        }
        const loadComments = async () => {
        try {
            const { data, total_pages } = await fetchComment(page, perPage);
            setComments(data);
            setLoading(false);
            setTotalPages(total_pages);
        } catch (err) {
            setError("Chưa có đánh giá nào");
                setLoading(false);
        }
        };
        loadComments();
    }, [page, perPage]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    

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
      
        <div className="wd-form-order">
            {Array.isArray(comments) && comments.length > 0 ? (
            comments.map(comment => (
                <div className='list-comment'>
                <div key={comment.id} className="product-infor"
                onClick={() =>
                    handleProductClick(
                        comment.product_id
                    )
                }
                >
                <img
                    className="product-image"
                    src={comment.image_variant}
                    alt={comment.product_name}
                />
                <div className="product-details">
                    <div className="product-name"
                    onClick={() =>
                        handleProductClick(
                            comment.product_id
                        )
                    }
                    >
                        {comment.product_name}</div>
                    <div className="stars">
                        {Array.from({ length: 5 }, (_, i) => (
                                                    <span key={i} className={`star ${i < comment.rating ? "filled" : ""}`}>
                                                        ★
                                                    </span>
                                                ))}
                    </div>
                    <div className="product-type">{new Date(comment.created_at).toLocaleString()} | Phân loại: {comment.color}, {comment.size}</div>
                    
                    <div className="review-details">{comment.content}</div>
                </div>
                </div>
            
                </div>
            ))
            ):(
            <p>Không có đánh giá nào để hiển thị.</p>
            )}
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

    </div>
  )
}

export default ListComments