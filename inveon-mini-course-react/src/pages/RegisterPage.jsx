import {useState} from "react";
import {Container, Form, Button, Alert} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useAuth} from "../Context/AuthContext";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {register} = useAuth();

    const schema = yup.object().shape({
        firstName: yup.string().required("First Name is required."),
        lastName: yup.string().required("Last Name is required."),
        email: yup.string().email("Invalid email format.").required("Email is required."),
        password: yup
            .string()
            .required("Password is required.")
            .min(6, "Password must be at least 6 characters.")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .matches(/[0-9]/, "Password must contain at least one number."),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match.")
            .required("Please confirm your password."),
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await schema.validate(formData, {abortEarly: false});
            setErrors({});
            setIsSubmitting(true);

            await register(formData.firstName, formData.lastName, formData.email, formData.password);
            setTimeout(() => {
                setIsSubmitting(false);
                setMessage(`Welcome, ${formData.firstName}! Registration successful.`);
                navigate("/login");
            }, 2000);
        } catch (err) {
            if (err.inner) {
                const validationErrors = {};
                err.inner.forEach((validationError) => {
                    validationErrors[validationError.path] = validationError.message;
                });
                setErrors(validationErrors);
            }
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <Container style={{maxWidth: "480px"}} className="text-start">
                <div className="shadow p-4 rounded bg-white">
                    <h2 className="text-primary fw-bold mb-3">Join Us</h2>
                    <p className="text-muted">Create your new account and start learning today!</p>

                    {message && <Alert variant="success">{message}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your first name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your last name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                            </Form.Control.Feedback>
                        </Form.Group>

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
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
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

                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Re-enter your password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 fw-bold" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </Form>

                    <hr className="my-4"/>
                    <p className="text-muted">
                        Already have an account?{" "}
                        <a href="/login" className="text-primary fw-bold">
                            Login
                        </a>
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default RegisterPage;
