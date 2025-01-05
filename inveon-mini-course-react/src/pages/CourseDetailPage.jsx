import  {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Container, Image, Row, Alert} from "react-bootstrap";
import {useCartContext} from "../context/CartContext.jsx";
import CourseService from "../Service/CourseService.js";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {useAuth} from "../context/AuthContext.jsx";

const CourseDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {cart, addToCart} = useCartContext();
    const {user} = useAuth();

    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await CourseService.getCourseById(id);
                setCourse(data);
            } catch (error) {
                setError("Failed to fetch course data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (isLoading) {
        return (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="mt-3 text-muted">Loading course details...</h4>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className="bi bi-exclamation-circle text-danger fs-1"></i>
                    <h2 className="text-danger mt-3">{error}</h2>
                    <Button onClick={() => navigate("/")} variant="outline-primary" className="mt-3">
                        <i className="bi bi-arrow-left me-2"></i>Back to Courses
                    </Button>
                </div>
            </Container>
        );
    }

    if (!course) {
        return (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className="bi bi-question-circle text-warning fs-1"></i>
                    <h2 className="text-warning mt-3">Course Not Found</h2>
                    <Button onClick={() => navigate("/")} variant="outline-primary" className="mt-3">
                        <i className="bi bi-arrow-left me-2"></i>Back to Courses
                    </Button>
                </div>
            </Container>
        );
    }
    const isInCart = cart.some((item) => item.id === course.id);
    const isOwnCourse = user?.id === course.instructorId;

    const handleAddToCart = () => {
        if (!isInCart && !isOwnCourse) {
            addToCart({
                id: course.id,
                name: course.title,
                price: course.price,
                image: course.imagePath || "https://via.placeholder.com/150",
            });
        }
    };

    // Format the date to be more readable
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-light min-vh-100">
            <TopHeader/>
            <section className="py-5">
                <Container>
                    <div className="bg-white rounded-3 shadow-sm p-4 mb-5">
                        <Row className="g-4">
                            <Col lg={8}>
                                <div className="position-relative">
                                    <Image
                                        src={course.imagePath || "https://via.placeholder.com/800x500"}
                                        alt={course.title}
                                        className="rounded-3 w-100"
                                        style={{
                                            objectFit: "cover",
                                            height: "500px",
                                            backgroundColor: "#f8f9fa"
                                        }}
                                    />
                                    <span
                                        className="position-absolute top-0 end-0 bg-primary text-white px-3 py-2 m-3 rounded-pill">
                                        {course.categoryName}
                                    </span>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="sticky-top" style={{top: "2rem"}}>
                                    <div className="bg-light p-4 rounded-3">
                                        <h2 className="text-center mb-4" style={{fontWeight: 'inherit'}}>
                                            Price: ${course.price}
                                        </h2>
                                        <Button
                                            variant={isInCart ? "secondary" : "primary"}
                                            className="w-100 py-3 mb-4"
                                            size="lg"
                                            onClick={handleAddToCart}
                                            disabled={isInCart || isOwnCourse}
                                        >
                                            {isInCart ? (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Added to Cart
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-cart-plus me-2"></i>
                                                    {isOwnCourse ? "Your Course" : "Add to Cart"}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="bg-white rounded-3 shadow-sm p-4 mb-5">
                        <h1 className="mb-3" style={{fontWeight: 'normal'}}>{course.title}</h1>
                        <div className="d-flex align-items-center mb-4">
                            <div>
                                <p className="h4 mb-0 text-muted" style={{fontWeight: 'normal'}}>Instructor</p>
                                <h5 className="mt-2" style={{fontWeight: 'bold'}}>{course.instructorName}</h5>
                            </div>
                        </div>
                        <hr/>
                        <h4 className="mb-4" style={{fontWeight: 'normal'}}>About This Course</h4>
                        <p className="h6 text-muted" style={{fontWeight: 'normal'}}>{course.description}</p>
                        <div className="mt-4 text-muted">
                            <small>
                                Created on: {formatDate(course.createdDate)}
                                {course.updatedDate !== course.createdDate &&
                                    ` • Last updated: ${formatDate(course.updatedDate)}`}
                            </small>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default CourseDetailPage;