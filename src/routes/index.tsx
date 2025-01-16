import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layoutweb from "../layouts/ClientLayout";
import Register from "../pages/(website)/dkdn/Register";
import Login from "../pages/(website)/dkdn/Login";
import { LogOut } from "lucide-react";
import ListCart from "../pages/(website)/Cart/ListCart";
import Detail from "../pages/(website)/Details/Detail";
import Od_Detail from "../pages/(website)/History/Od_Detail";
import OdHistory from "../pages/(website)/History/OdHistory";
import Pay from "../pages/(website)/Pay/Pay";
import Success from "../pages/(website)/Pay/Success";
import ListProducts from "../pages/(website)/listProducts/ListProducts";
import Profile from "../layouts/profile";
import OrderHistory from "../pages/(website)/History/OdHistory";
import ProductList from "../pages/(website)/listProducts/Filter";
import { useEffect } from "react";

import Coupons from "../pages/(website)/Pay/Coupons";

import ListComments from "../pages/(website)/Comments/ListComments";
import ResetPassword from "../pages/(website)/dkdn/ResetPassword";
import ForgotPassword from "../pages/(website)/dkdn/ForgotPassword";
import Favorite from "../pages/(website)/Details/Favorite";
import Personal from "../layouts/Personal ";
import View from "../pages/(website)/Details/View";
import Service from "../layouts/Service";
import Banner from "../layouts/banner";
import Dv from "../layouts/Dv";
import Service_details from "../layouts/Service_details";
import ComboDetail from "../pages/(website)/Details/ComboDetail";
import Paycombo from "../pages/(website)/Pay/Paycombo";
import About_us from "../pages/hard/About_us";
import Ac from "../pages/hard/Ac";
import Shipping from "../pages/hard/Shipping-delivery";
import Pripaci from "../pages/hard/Pripaci";


const Router = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");

        if (
            authToken &&
            (location.pathname === "/login" ||
                location.pathname === "/register")
        ) {
            navigate("/");
        }
    }, [navigate, location.pathname]);
    return (
        <>
            <Routes>
                <Route path="/profile" element={<Profile />}>
                    <Route path="coupons" element={<Coupons />} />{" "}
                    <Route path="od_histori" element={<OrderHistory />} />{" "}
                    <Route path="personal" element={<Personal />} />{" "}
                    <Route path="view" element={<View />} />{" "}
                    <Route path="dv" element={<Dv />} />{" "}
                    <Route
                        path="dv/detail_service/:id"
                        element={<Service_details />}
                    />
                    <Route
                        path="od_histori/od_detail/:id"
                        element={<Od_Detail />}
                    />
                    <Route path="comment" element={<ListComments />} />
                </Route>

                <Route path="/" element={<Layoutweb />}></Route>
                <Route path="cart" element={<ListCart />} />
                <Route path="favorite" element={<Favorite />} />
                <Route path="detail/:id" element={<Detail />} />
                <Route path="combo_detail/:id" element={<ComboDetail />} />
                <Route path="od_detail" element={<Od_Detail />} />
                <Route path="od_histori" element={<OdHistory />} />
                <Route path="comment" element={<ListComments />} />
                <Route path="pay" element={<Pay />} />
                <Route path="success" element={<Success />} />
                <Route path="products" element={<ListProducts />} />
                <Route path="pricefilter" element={<ProductList />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="forgotpassword" element={<ForgotPassword />} />
                <Route path="payCombo" element={<Paycombo />}></Route>
                <Route path="ser" element={<Service />}></Route>

                <Route path="banner" element={<Banner />} />

                <Route path="lienhe" element={<Pripaci />} />
                <Route path="about" element={<About_us />} />
                <Route path="ac" element={<Ac />} />
                <Route path="shipping" element={<Shipping />} />
                <Route
                    path="reset-password/:token"
                    element={<ResetPassword />}
                />
                <Route path="logout" element={<LogOut />} />
            </Routes>
        </>
    );
};

export default Router;