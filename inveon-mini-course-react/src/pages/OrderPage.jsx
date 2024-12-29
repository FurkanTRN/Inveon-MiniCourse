import React from "react";
import {Accordion, Container, Button} from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {orders} from "../helpers/variables.js";
import {Link} from "react-router-dom"; // Import orders data

const OrderPage = () => {
    return (
        <>
            <TopHeader/>

            <Container className="mt-5">
                <h1 className="mb-4">My Purchased Orders</h1>

                <Accordion defaultActiveKey="0">
                    {orders.map((order, orderIndex) => (
                        <Accordion.Item eventKey={orderIndex.toString()} key={order.id}>
                            <Accordion.Header>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "15px",
                                        fontWeight: "bold",
                                        fontSize: "1.1rem"
                                    }}>
                                        <div>
                                            Order No: {order.id}
                                        </div>
                                        <div>
                                            Courses: {order.courses.length}
                                        </div>
                                    </div>

                                    <div style={{
                                        color: "#666",
                                        fontSize: "0.9rem",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        alignItems: "center"
                                    }}>
                                        <span>Date: {order.orderDate}</span>
                                        <span>Total: <strong>${order.totalPrice}</strong></span>
                                        <span>Card: **** **** **** {order.cardNumber.slice(-4)}</span>
                                    </div>
                                </div>
                            </Accordion.Header>

                            <Accordion.Body>
                                {order.courses.map((course) => (
                                    <div
                                        key={course.id}
                                        style={{
                                            display: "flex",
                                            borderBottom: "1px solid #ddd",
                                            padding: "10px 0",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* Course Thumbnail */}
                                        <div style={{flex: "0 0 150px", marginRight: "20px"}}>
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

                                        <div style={{flex: "1"}}>
                                            <h5 style={{margin: 0, fontWeight: "bold"}}>{course.name}</h5>
                                            <p
                                                style={{
                                                    margin: "5px 0 10px",
                                                    fontSize: "0.9rem",
                                                    color: "#555",
                                                }}
                                            >
                                                {course.description}
                                            </p>
                                            <p style={{fontSize: "0.9rem", margin: "5px 0", color: "#777"}}>
                                                <strong>Instructor:</strong> {course.instructorName}
                                            </p>
                                            <p style={{fontWeight: "bold"}}>{course.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Container>
        </>
    );
};

export default OrderPage;