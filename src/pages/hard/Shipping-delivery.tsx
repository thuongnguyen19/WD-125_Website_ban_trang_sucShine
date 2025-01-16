import React from 'react'
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';

const Shipping = () => {
  return (
      <div>
        <Header/>
          {" "}
          <div>
              <div className="tf-page-title style-2">
                  <div className="container-full">
                      <div className="heading text-center">
                          Vận chuyển & Giao hàng
                      </div>
                  </div>
              </div>
              {/* /page-title */}
              {/* main-page */}
              <section className="flat-spacing-25">
                  <div className="container">
                      <div className="tf-main-area-page tf-page-delivery">
                          <div className="box">
                              <h4>Vận chuyển</h4>
                              <p>
                                  Tất cả các đơn hàng được vận chuyển qua UPS
                                  Express.
                              </p>
                              <p>Vận chuyển miễn phí cho các đơn hàng</p>
                              <p>
                                  Tất cả các đơn hàng đều được vận chuyển theo
                                  dõi chi tiết
                              </p>
                          </div>
                          {/* <div className="box">
                              <h4>Hoàn trả</h4>
                              <p>
                                  Các mặt hàng được trả lại trong vòng 14 ngày
                                  kể từ ngày gửi hàng ban đầu và ở tình trạng
                                  như mới sẽ được hoàn tiền đầy đủ hoặc tín dụng
                                  cửa hàng.
                              </p>
                              <p>
                                  Hoàn tiền sẽ được trả lại vào phương thức
                                  thanh toán ban đầu đã sử dụng để mua hàng.
                              </p>
                              <p>
                                  Khách hàng chịu trách nhiệm phí vận chuyển khi
                                  trả lại sản phẩm và phí vận chuyển/xử lý của
                                  đơn hàng gốc là không hoàn lại.
                              </p>
                              <p>
                                  Tất cả các sản phẩm giảm giá đều là mua cuối
                                  cùng.
                              </p>
                          </div> */}
                          <div className="box">
                              <h4>Hỗ trợ</h4>
                              <p>
                                  Hãy liên hệ với chúng tôi nếu bạn có bất kỳ
                                  câu hỏi hoặc thắc mắc nào.
                              </p>
                              <p>
                                  Email:{" "}
                                  <a
                                      href="mailto:contact@shinejewelry.com"
                                      className="cf-mail"
                                  >
                                      shinejewelryshpop@gmail.com
                                  </a>
                              </p>
                              <p>Điện thoại: +1 (23) 456 789</p>
                          </div>
                      </div>
                  </div>
              </section>
          </div>
          <Footer/>
      </div>
  );
}

export default Shipping