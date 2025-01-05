import HomePage from "./pages/Homepage.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import SearchResultsPage from "./pages/SearchResultPage.jsx";
import CreateCoursePage from "./pages/CreateCoursePage.jsx";
import InstructorCoursePage from "./pages/InstructorCoursePage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/course/:id" element={<CourseDetailPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>

                <Route
                    path="/profile"
                    element={<ProtectedRoute element={<ProfileEditPage/>}/>}
                />
                <Route
                    path="/cart"
                    element={<CartPage/>}
                />
                <Route
                    path="/payment"
                    element={<ProtectedRoute element={<PaymentPage/>}/>}
                />
                <Route
                    path="/orders"
                    element={<ProtectedRoute element={<OrderPage/>}/>}
                />
                <Route path="/search-results" element={<SearchResultsPage/>}/>

                <Route
                    path="/course/create"
                    element={<ProtectedRoute element={<CreateCoursePage/>} allowedRoles={['Instructor']}/>}
                />
                <Route
                    path="/my-courses"
                    element={<ProtectedRoute element={<InstructorCoursePage/>} allowedRoles={['Instructor']}/>}
                />
                <Route path="/category/:id" element={<CategoryPage/>}/>


                <Route path="*" element={<HomePage/>}/>
            </Routes>
        </Router>
    );
};
export default App
