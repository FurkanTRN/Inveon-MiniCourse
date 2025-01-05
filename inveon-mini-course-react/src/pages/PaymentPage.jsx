import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Container, Row, Col, ListGroup, Card, Button, Form, Alert} from "react-bootstrap";
import {useNotificationContext} from "../context/ToastContext";
import * as Yup from "yup";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {isValidCardNumber, isValidExpirationDate} from "../helpers/credit-card-helper.js";
import PaymentService from "../Service/PaymentService.js";
import {useCartContext} from "../context/CartContext.jsx";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state.order;
    const {clearCart} = useCartContext();
    console.log(order);
    const {showToast} = useNotificationContext();
    const [paymentData, setPaymentData] = useState({
        name: "",
        cardNumber: "",
        expiration: "",
        cvv: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState("");

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name on card is required."),
        cardNumber: Yup.string()
            .matches(/^\d{16}$/, "Card number must be exactly 16 digits.")
            .test("valid-card-number", "Invalid card number.", (value) =>
                isValidCardNumber(value || "")
            )
            .required("Card number is required."),
        expiration: Yup.string()
            .test("valid-expiration-date", "Expiration date is invalid or expired.", (value) =>
                isValidExpirationDate(value)
            )
            .required("Expiration date is required."),
        cvv: Yup.string()
            .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits.")
            .required("CVV is required."),
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setPaymentData({
            ...paymentData,
            [name]: value,
        });

        Yup.reach(validationSchema, name)
            .validate(value)
            .then(() => {
                setErrors((prevErrors) => ({...prevErrors, [name]: ""}));
            })
            .catch((err) => {
                setErrors((prevErrors) => ({...prevErrors, [name]: err.message}));
            });
    };

    const handlePayment = async (e, status) => {
        e.preventDefault();
        setSubmissionError("");
        setIsSubmitting(true);

        try {
            await validationSchema.validate(paymentData, {abortEarly: false});
            const orderData = {
                orderId: order.id,
                transactionId: Math.random().toString(36).substr(2, 9),
                amount: order.totalAmount,
                status: status,
            };
            const response = await PaymentService.processPayment(orderData);
            if (response.status === 200) {
                setIsSubmitting(false);
                showToast("Payment is processing. Thank you for your purchase.", "info");
                clearCart();
                setTimeout(() => {
                    navigate("/orders");
                }, 2000);

            } else {
                showToast("Payment failed. Please try again.");
            }
        } catch (err) {
            setSubmissionError(err.message || "An error occurred during payment.");
            setIsSubmitting(false);
            showToast("Payment failed. Please try again.", "error");
        }
    };

    if (!order) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    No order data found. Please go back to the cart and try again.
                </Alert>
                <Button variant="primary" onClick={() => navigate("/")}>
                    Go to Home
                </Button>
            </Container>
        );
    }

    return (
        <>
            <TopHeader/>
            <Container className="mt-5">
                <h1 className="mb-4">Payment</h1>
                <Row>
                    <Col lg={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Order Summary</Card.Title>
                                <ListGroup>
                                    {order.courses.map((course) => (
                                        <ListGroup.Item
                                            key={course.courseId}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <span>{course.courseTitle}</span>
                                            <strong>${course.priceAtPurchase}</strong>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <strong>Total:</strong>
                                        <strong>${order.totalAmount}</strong>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Payment Details</Card.Title>
                                <Form onSubmit={(e) => handlePayment(e, 3)}>
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label>Name on Card</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={paymentData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formCardNumber">
                                        <Form.Label>Card Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cardNumber"
                                            value={paymentData.cardNumber}
                                            onChange={handleChange}
                                            placeholder="Enter card number"
                                            maxLength="16"
                                            isInvalid={!!errors.cardNumber}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cardNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formExpiration">
                                        <Form.Label>Expiration Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="expiration"
                                            value={paymentData.expiration}
                                            onChange={handleChange}
                                            placeholder="MM/YY"
                                            isInvalid={!!errors.expiration}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.expiration}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formCVV">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cvv"
                                            value={paymentData.cvv}
                                            onChange={handleChange}
                                            placeholder="CVV"
                                            maxLength="4"
                                            isInvalid={!!errors.cvv}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cvv}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {submissionError && (
                                        <Alert variant="danger">{submissionError}</Alert>
                                    )}

                                    <div className="d-grid gap-2">
                                        <Button
                                            type="submit"
                                            variant="success"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : "Successful Payment)"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            disabled={isSubmitting}
                                            onClick={(e) => handlePayment(e, 2)}
                                        >
                                            {isSubmitting ? "Processing..." : "Rejected Pay"}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PaymentPage;