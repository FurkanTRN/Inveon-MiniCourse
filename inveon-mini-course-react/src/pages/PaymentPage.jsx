import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, ListGroup, Card, Button, Form, Alert} from "react-bootstrap";
import {useCartContext} from "../context/CartContext";
import {useNotificationContext} from "../context/ToastContext";
import * as Yup from "yup";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {isValidCardNumber, isValidExpirationDate} from "../helpers/credit-card-helper.js"; // Import Yup for validation

const PaymentPage = () => {
    const navigate = useNavigate();

    const {cart, calculateTotalPrice, clearCart} = useCartContext();
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
        name: Yup.string()
            .required("Name on card is required."),
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

    // Handle input changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setPaymentData({
            ...paymentData,
            [name]: value,
        });

        // Validate the individual field on change
        Yup.reach(validationSchema, name)
            .validate(value)
            .then(() => {
                setErrors((prevErrors) => ({...prevErrors, [name]: ""}));
            })
            .catch((err) => {
                setErrors((prevErrors) => ({...prevErrors, [name]: err.message}));
            });
    };

    // Handle form submission
    const handlePayment = async (e) => {
        e.preventDefault();
        setSubmissionError("");
        setIsSubmitting(true);

        try {
            await validationSchema.validate(paymentData, {abortEarly: false});
            setTimeout(() => {
                if (paymentData.cardNumber === "4242424242424242") {
                    setIsSubmitting(false);
                    showToast("Payment successful! Thank you for your purchase.", "success");
                    clearCart();
                    navigate("/");
                } else {
                    setIsSubmitting(false);
                    setSubmissionError("Payment failed. Please check your card details and try again.");
                    showToast("Payment failed. Please try again.", "error");
                }
            }, 2000);
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach((error) => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
            setIsSubmitting(false);
        }
    };

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
                                {cart.length === 0 ? (
                                    <Alert variant="info">Your cart is empty!</Alert>
                                ) : (
                                    <ListGroup>
                                        {cart.map((item) => (
                                            <ListGroup.Item
                                                key={item.id}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <span>{item.name}</span>
                                                <strong>${item.price}</strong>
                                            </ListGroup.Item>
                                        ))}
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <strong>Total:</strong>
                                            <strong>${calculateTotalPrice()}</strong>
                                        </ListGroup.Item>
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Payment Details</Card.Title>
                                <Form onSubmit={handlePayment}>
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

                                    <div className="d-grid">
                                        <Button
                                            type="submit"
                                            variant="success"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : "Pay Now"}
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