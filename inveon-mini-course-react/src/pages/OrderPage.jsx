import {useEffect, useState} from "react";
import {Accordion, Badge, Container, Spinner} from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import OrderService from "../Service/OrderService.js";
import {formatDate} from "../helpers/date-formatter.js";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await OrderService.getUserOrders();
                setOrders(response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5 text-center">
                <p className="text-danger">Error: {error}</p>
            </Container>
        );
    }

    return (
        <>
            <TopHeader/>
            <Container className="mt-5">
                <h1 className="mb-4">Order History</h1>
                <OrderList orders={orders}/>
            </Container>
        </>
    );
};

const OrderList = ({orders}) => {
    return (
        <Accordion defaultActiveKey="0">
            {orders.map((order) => (
                <OrderItem key={order.id} order={order} eventKey={order.id.toString()}/>
            ))}
        </Accordion>
    );
};

const OrderItem = ({order, eventKey}) => {
    return (
        <Accordion.Item eventKey={eventKey}>
            <Accordion.Header>
                <OrderHeader order={order}/>
            </Accordion.Header>
            <Accordion.Body>
                <CourseList courses={order.courses}/>
            </Accordion.Body>
        </Accordion.Item>
    );
};

const OrderHeader = ({order}) => {
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Pending":
                return "warning";
            case "PaymentFailed":
                return "danger";
            case "Cancelled":
                return "secondary";
            default:
                return "success";
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center gap-3 fw-bold fs-6">
                <div>Order No: {order.id}</div>
                <div>Courses: {order.courses.length}</div>
                <Badge bg={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
            </div>
            <div className="text-muted fs-7 d-flex flex-wrap gap-2 align-items-center">
                <span>Date: {formatDate(order.orderDate)}</span>
                <span>
                    Total: <strong>${order.totalAmount.toFixed(2)}</strong>
                </span>
            </div>
        </div>
    );
};
const CourseList = ({courses}) => {
    return (
        <>
            {courses.map((course) => (
                <CourseItem key={course.id} course={course}/>
            ))}
        </>
    );
};

const CourseItem = ({course}) => {
    return (
        <div className="d-flex border-bottom py-3 align-items-center">
            <div className="flex-shrink-0 me-3" style={{width: "150px"}}>
                <img
                    src={course.imagePath || "https://via.placeholder.com/150"}
                    alt={course.title}
                    className="img-fluid rounded"
                    style={{width: "150px", height: "100px", objectFit: "cover"}}
                />
            </div>
            <div className="flex-grow-1">
                <h5 className="fw-bold mb-1">{course.title}</h5>
                <p className="text-muted mb-2">{course.description || "No description available."}</p>
                <p className="text-muted mb-1">
                    <strong>Price:</strong> ${course.priceAtPurchase.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default OrderPage;