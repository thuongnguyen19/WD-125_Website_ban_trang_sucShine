import React from 'react'
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const About_us = () => {
    return (
        <div>
            <Header />
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">
                       Về chúng tôi 
                    </div>
                </div>
            </div>
            {/* Slider */}
            <section className="tf-slideshow about-us-page position-relative">
                <div className="banner-wrapper">
                    <img
                        className="lazyload"
                        src="https://lh3.googleusercontent.com/5u9aVfhtAIS5UZzZofYBuj5A7Vx4jUZRvGuByxhPDwGZQcO9POO9gNl5Zx3ZJQ6MEJlijNZ9pVkKbaS9vaAcC3XcQaTq6D2sD68XhN46H974yESOaOw5Q0_lHhTCkQBn1g=s800"
                        alt="hình ảnh trang sức"
                    />
                    <div className="box-content text-center">
                        <div className="container">
                            <div className="text text-white">
                                Tôn vinh vẻ đẹp của bạn
                                <br className="d-xl-block d-none" /> với những
                                món trang sức tinh tế
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flat Title */}
            <section className="flat-spacing-9">
                <div className="container">
                    <div className="flat-title my-0">
                        <span className="title">Chúng tôi là Shine </span>
                        <p className="sub-title text_black-2">
                            Chào mừng đến với cửa hàng trang sức của chúng tôi,
                            nơi vẻ đẹp và sự tinh tế hòa quyện.
                            <br className="d-xl-block d-none" />
                            Bộ sưu tập của chúng tôi bao gồm những món trang sức
                            được chế tác
                            <br className="d-xl-block d-none" />
                            bởi các nghệ nhân tài năng, giúp bạn tỏa sáng trong
                            mọi dịp.
                        </p>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="line"></div>
            </div>

            {/* Image Text */}
            <section className="flat-spacing-23 flat-image-text-section">
                <div className="container">
                    <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                        <div className="tf-image-wrap">
                            <img
                                className="lazyload w-100"
                                src="https://cafefcdn.com/203337114487263232/2023/9/14/rose-bi-quyet-so-huu-vong-eo-con-kien-1694666706617-1694666706967123901034.jpg"
                                alt="hình ảnh trang sức"
                            />
                        </div>
                        <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                            <div>
                                <div className="heading">Thành lập - 2024</div>
                                <div className="text">
                                    Shine được thành lập năm 2024 bởi nghệ nhân
                                    Nguyễn Hồng Phát,
                                    <br className="d-xl-block d-none" />
                                    với niềm đam mê mang đến vẻ đẹp đẳng cấp cho
                                    phụ nữ. Cửa hàng đầu tiên
                                    <br className="d-xl-block d-none" />
                                    được mở tại Hà Nội và nhanh chóng trở thành
                                    điểm đến yêu thích
                                    <br className="d-xl-block d-none" />
                                    cho những người yêu thích trang sức tinh tế
                                    và chất lượng.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flat-spacing-15">
                <div className="container">
                    <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                        <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                            <div>
                                <div className="heading">
                                    Sứ mệnh của chúng tôi
                                </div>
                                <div className="text">
                                    Shine cam kết mang đến những sản phẩm trang
                                    sức
                                    <br className="d-xl-block d-none" />
                                    có thiết kế đẳng cấp, chất lượng vượt trội,
                                    và dịch vụ tận tâm.
                                    <br className="d-xl-block d-none" />
                                    Chúng tôi mong muốn mỗi món trang sức không
                                    chỉ là một phụ kiện
                                    <br className="d-xl-block d-none" />
                                    mà còn là biểu tượng của tình yêu và sự tôn
                                    trọng.
                                </div>
                            </div>
                        </div>
                        <div className="grid-img-group">
                            <div className="tf-image-wrap box-img item-1">
                                <div className="img-style">
                                    <img
                                        className="lazyload"
                                        src="https://tierra.vn/wp-content/uploads/2024/07/NCH1701-R_4-1.webp"
                                        alt="hình ảnh trang sức"
                                    />
                                </div>
                            </div>
                            <div className="tf-image-wrap box-img item-2">
                                <div className="img-style">
                                    <img
                                        className="lazyload"
                                        src="https://cf.shopee.vn/file/5213ef5eb3dc95b6197183ad46605fcc"
                                        alt="hình ảnh trang sức"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Icon Box */}
            <section>
                <div className="container">
                    <div className="bg_grey-2 radius-10 flat-wrap-iconbox">
                        <div className="flat-title lg">
                            <span className="title fw-5">
                                Chất lượng là ưu tiên hàng đầu
                            </span>
                            <div>
                                <p className="sub-title text_black-2">
                                    Đội ngũ nghệ nhân của chúng tôi đã tạo ra
                                    những món trang sức
                                    <br className="d-xl-block d-none" />
                                    tuyệt đẹp để tôn lên phong cách của bạn
                                    trong mọi sự kiện.
                                </p>
                                <p className="sub-title text_black-2">
                                    Khám phá các thiết kế trang sức độc đáo và
                                    hiện đại tại Shine .
                                </p>
                            </div>
                        </div>
                        <div className="flat-iconbox-v3 lg">
                            <div className="wrap-carousel wrap-mobile">
                                <div
                                    className="swiper tf-sw-mobile"
                                    data-preview="1"
                                    data-space="15"
                                >
                                    <div className="swiper-wrapper wrap-iconbox lg">
                                        {/* Add Swiper slides here */}
                                    </div>
                                </div>
                                <div className="sw-dots style-2 sw-pagination-mb justify-content-center"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};
  

export default About_us