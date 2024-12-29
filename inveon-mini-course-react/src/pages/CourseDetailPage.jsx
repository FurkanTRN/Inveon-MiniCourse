import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Container, Image, ListGroup, Row} from "react-bootstrap";
import {courses} from "../helpers/variables.js";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {useCartContext} from "../context/CartContext.jsx";

const CourseDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {cart,addToCart} = useCartContext();

    const course = courses.find((course) => course.id === parseInt(id));

    if (!course) {
        return (
            <Container className="text-center py-5">
                <h2 className="text-danger">Course Not Found</h2>
                <Button onClick={() => navigate("/")} variant="primary" className="mt-3">
                    Back to Courses
                </Button>
            </Container>
        );
    }

    const {
        name,
        instructorName,
        image,
        description,
        curriculum = [],
        price,
        rating = "No rating",
        lectures = "N/A",
        language = "Not specified",
    } = course;

    const isInCart = cart.some((item) => item.id === course.id);
    const handleAddToCart = () => {
        if (!isInCart) {
            addToCart({
                id: course.id,
                name: course.name,
                price: parseFloat(course.price.replace("$", "")),
                image: course.image,
            });
        }
    };
    return (
        <>
            <TopHeader isLoggedIn={true}/>
            <section className="py-5 bg-light">
                <Container>
                    <Row className="mb-4">
                        <Col md={8} className="order-md-1">
                            <Image
                                src={image}
                                alt={name}
                                className="mb-4 rounded shadow w-100"
                                style={{objectFit: "cover", height: "400px"}}
                            />
                        </Col>
                        <Col md={4} className="order-md-2">
                            <div className="p-4 bg-white rounded shadow-sm">
                                <h3 className="text-primary text-center mb-3">{price}</h3>
                                <Button
                                    variant="success"
                                    className="w-100 mb-4"
                                    size="lg"
                                    onClick={handleAddToCart}
                                    disabled={isInCart}
                                >
                                    {isInCart ? "Already in Cart" : "Add to Cart"}
                                </Button>
                                <div className="mt-3">
                                    <h5 className="text-success">Course Features</h5>
                                    <ul className="list-unstyled p-0 m-0">
                                        <li className="py-2">⭐ Rating: {rating}</li>
                                        <li className="py-2">📚 Lectures: {lectures}</li>
                                        <li className="py-2">🌍 Language: {language}</li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <h1 className="text-primary">{name}</h1>
                            <p className="text-muted fst-italic">By {instructorName}</p>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <h4 className="text-success">About this Course</h4>
                            <p>{description}</p>
                        </Col>
                    </Row>

                </Container>
            </section>
        </>
    );
};

export default CourseDetailPage;