import {useEffect, useState} from "react";
import {Container, Form, Button, Alert} from "react-bootstrap";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {login, user} = useAuth();


    const schema = yup.object().shape({
        email: yup.string().email("Invalid email format.").required("Email is required."),
        password: yup.string().required("Password is required."),
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate(formData, {abortEarly: false});
            setErrors({});
            setIsSubmitting(true);
            console.log(formData);
            await login(formData.email, formData.password);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <Container style={{maxWidth: "480px"}}>
                <div className="shadow p-4 rounded bg-white">
                    <h2 className="text-primary fw-bold mb-3 text-center">Welcome Back!</h2>
                    <p className="text-muted text-center">Log in to your account to continue.</p>
                    {message && <Alert variant="success">{message}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}

                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}

                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 fw-bold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Log In"}
                        </Button>
                    </Form>

                    <hr className="my-4"/>
                    <p className="text-muted">
                        Don't have an account?{" "}
                        <a href="/register" className="text-primary fw-bold">
                            Sign Up
                        </a>
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default LoginPage;