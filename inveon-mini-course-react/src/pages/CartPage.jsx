import React, {useState} from "react";
import { useCartContext } from "../context/CartContext";
import { Container, Row, Col, Button, ListGroup, Card } from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import RemoveItemModal from "../components/modals/RemoveItemModal.jsx";

const CartPage = () => {
    const { cart, removeFromCart, clearCart, calculateTotalPrice } = useCartContext();
    const [modalItem, setModalItem] = useState(null);
    const handleRemove = (item) => {
        removeFromCart(item);
    };
    return (
        <>
            <TopHeader />
            <Container className="mt-5">
                <h1 className="mb-4">Your Cart</h1>
                {cart.length === 0 ? (
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Your Cart is Empty!</Card.Title>
                            <Card.Text>
                                You don’t have any course in your cart. Add some courses to get started!
                            </Card.Text>
                            <Button variant="primary" href="/" className="mt-2">
                                Explorer Courses
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <>
                        <Row>
                            <Col lg={8}>
                                <ListGroup className="shadow-sm">
                                    {cart.map((item) => (
                                        <ListGroup.Item
                                            key={item.id}
                                            className="d-flex justify-content-between align-items-center py-3"
                                        >
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "15px" }}
                                                />
                                                <div>
                                                    <h5 className="mb-1">{item.name}</h5>
                                                    <p className="mb-0 text-muted">{item.price} USD</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => setModalItem(item)}
                                            >
                                                Remove
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Col>
                            <Col lg={4}>
                                <Card className="shadow-sm p-3">
                                    <Card.Body>
                                        <Card.Title>Order Summary</Card.Title>
                                        <Card.Text>
                                            <strong>Total Price:</strong> {calculateTotalPrice()} USD
                                        </Card.Text>
                                        <Button variant="success" className="w-100 mb-2">
                                            Proceed to Checkout
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            className="w-100"
                                            onClick={clearCart}
                                        >
                                            Clear Cart
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
            <RemoveItemModal
                item={modalItem}
                onConfirm={handleRemove}
                onHide={() => setModalItem(null)}
            />
        </>
    );
};

export default CartPage;