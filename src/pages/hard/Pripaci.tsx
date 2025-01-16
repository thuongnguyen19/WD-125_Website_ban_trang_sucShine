import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Pripaci = () => {
    return (
        <div>
            <Header />
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">
                        Liên hệ với chúng tôi
                    </div>
                </div>
            </div>
            <section className="flat-spacing-9">
                <div className="container">
                    <div className="tf-grid-layout gap-0 lg-col-2">
                        {/* Thay URL Google Maps */}
                        <div className="w-100">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6950823115383!2d105.7472618!3d21.0381298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2sTr%C6%B0%E1%BB%9Dng%20Cao%20%C4%91%E1%BA%B3ng%20FPT%20Polytechnic!5e0!3m2!1sen!2s!4v1719221598456!5m2!1sen!2s"
                                width="100%"
                                height="600"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Map"
                            ></iframe>
                        </div>
                        <div className="tf-content-left has-mt">
                            <div className="sticky-top">
                                <h5 className="mb_20">
                                    Ghé thăm cửa hàng của chúng tôi
                                </h5>
                                <div className="mb_20">
                                    <p className="mb_15">
                                        <strong>Địa chỉ</strong>
                                    </p>
                                    <p>
                                        Địa chỉ: Tòa nhà FPT Polytechnic, Phố
                                        Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
                                    </p>
                                </div>
                                <div className="mb_20">
                                    <p className="mb_15">
                                        <strong>Số điện thoại </strong>
                                    </p>
                                    <p>0339219385</p>
                                </div>
                                <div className="mb_20">
                                    <p className="mb_15">
                                        <strong>Email</strong>
                                    </p>
                                    <p> shinejewelryshpop@gmail.com</p>
                                </div>
                                <div className="mb_36">
                                    <p className="mb_15">
                                        <strong>Open Time</strong>
                                    </p>
                                    <p>
                                        Cửa hàng của chúng tôi đã mở cửa trở lại
                                        để mua sắm,,{" "}
                                    </p>
                                    <p>
                                        trao đổi mỗi ngày từ 11 giờ sáng đến 7
                                        giờ tối
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Pripaci;
