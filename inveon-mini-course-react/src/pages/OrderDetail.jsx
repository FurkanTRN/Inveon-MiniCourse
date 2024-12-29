import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { orders } from "../helpers/variables.js";

const OrderDetailPage = () => {
    const { id } = useParams(); // Retrieve the order ID from the route
    const order = orders.find((o) => o.id === parseInt(id)); // Find the order with the given ID

    if (!order) {
        return (
            <Container className="mt-5">
                <h1>Order Not Found</h1>
                <p>The order with the specified ID does not exist.</p>
                <Link to="/">
                    <Button variant="primary">Back to Orders</Button>
                </Link>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1>Order Details</h1>

            {/* Order Metadata */}
            <div style={{ marginBottom: "30px" }}>
                <h4>Order #{order.id}</h4>
                <p>
                    <strong>Date:</strong> {order.orderDate}
                </p>
                <p>
                    <strong>Total Price:</strong> {order.totalPrice}
                </p>
                <Link to="/orders">
                    <Button variant="outline-primary" size="sm">
                        Back to Orders
                    </Button>
                </Link>
            </div>

            {/* Courses in the Order */}
            <div>
                {order.courses.map((course) => (
                    <div
                        key={course.id}
                        style={{
                            display: "flex",
                            borderBottom: "1px solid #ddd",
                            padding: "20px 0",
                            alignItems: "center",
                        }}
                    >
                        {/* Course Thumbnail */}
                        <div style={{ flex: "0 0 150px", marginRight: "20px" }}>
                            <img
                                src={course.image}
                                alt={course.name}
                                style={{
                                    width: "150px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                }}
                            />
                        </div>

                        {/* Course Details */}
                        <div style={{ flex: "1" }}>
                            <h5 style={{ margin: 0, fontWeight: "bold" }}>{course.name}</h5>
                            <p
                                style={{
                                    margin: "5px 0 10px",
                                    fontSize: "0.9rem",
                                    color: "#555",
                                }}
                            >
                                {course.description}
                            </p>
                            <p style={{ fontSize: "0.9rem", margin: "5px 0", color: "#777" }}>
                                <strong>Instructor:</strong> {course.instructorName}
                            </p>
                            <p style={{ fontWeight: "bold" }}>{course.price}</p>
                        </div>


                    </div>
                ))}
            </div>
        </Container>
    );
};

export default OrderDetailPage;