import HomePage from "./pages/Homepage.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import OrderDetailPage from "./pages/OrderDetail.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/course/:id" element={<CourseDetailPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/profile" element={<ProfileEditPage/>}/>
                <Route path="*" element={<HomePage/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/payment" element={<PaymentPage/>}/>
                <Route path="/orders" element={<OrderPage/>}/>
                <Route path="/order/:id" element={<OrderDetailPage />} />

            </Routes>
        </Router>
    )
}

export default App
