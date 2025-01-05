import {useState, useEffect} from "react";
import {Form, Button, Col, Row, Container, Alert} from "react-bootstrap";
import * as Yup from "yup";
import CourseService from "../Service/CourseService.js";
import TopHeader from "../components/top-header/TopHeader.jsx";
import CategoryService from "../Service/CategoryService.js";

const CreateCoursePage = () => {

    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        imagePath: "",
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getCategories();
                setCategories(data || []); // Ensure we always set an empty array if no data
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const validationSchema = Yup.object({
        title: Yup.string().required("Course title is required."),
        description: Yup.string().required("Course description is required."),
        category: Yup.string().required("Category is required."),
        price: Yup.number()
            .required("Price is required.")
            .positive("Price must be a positive number.")
            .moreThan(0, "Price must be greater than 0"),
        imagePath: Yup.string()
            .url("Please enter a valid URL")
            .matches(
                /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                "Please enter a valid image URL (jpg, jpeg, png, webp, or gif)"
            )
    });

    const validate = (data) => {
        try {
            validationSchema.validateSync(data, {abortEarly: false});
            return {};
        } catch (error) {
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            return validationErrors;
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCourseData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUrlChange = (e) => {
        const {value} = e.target;
        setCourseData(prevData => ({
            ...prevData,
            imagePath: value
        }));

        if (errors.imagePath) {
            setErrors(prev => {
                const {imagePath, ...rest} = prev;
                return rest;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input data
        const validationErrors = validate(courseData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage("");

        try {
            // Prepare the course data to send to the API
            const courseToCreate = {
                title: courseData.title,
                description: courseData.description,
                price: courseData.price,
                categoryId: courseData.category,
                imagePath: courseData.imagePath,
            };

            const response = await CourseService.createCourse(courseToCreate);

            if (response.status === 200) {
                setSuccessMessage("Course created successfully!");
                setCourseData({
                    title: "",
                    description: "",
                    category: "",
                    price: "",
                    imagePath: "",
                });
            } else {
                setErrors({general: response?.message || "Error creating course"});
            }
        } catch (error) {
            console.error("Submit error:", error);
            setErrors({general: "An error occurred while creating the course."});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <TopHeader/>
            <Container>
                <h2 className="my-4">Create a New Course</h2>

                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {errors.general && <Alert variant="danger">{errors.general}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formCourseTitle">
                                <Form.Label>Course Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter course title"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.title}
                                />
                                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formCourseCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category"
                                    value={courseData.category}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.category}
                                >
                                    <option value="">Select category</option>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading categories...</option>
                                    )}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="formCourseDescription" className="my-3">
                        <Form.Label>Course Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            maxLength={150}
                            name="description"
                            value={courseData.description}
                            onChange={handleInputChange}
                            isInvalid={!!errors.description}
                            style={{resize: "none"}}
                            placeholder="Max 150 characters allowed."
                        />
                        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formCoursePrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter course price"
                                    name="price"
                                    value={courseData.price}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.price}
                                />
                                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formCourseImage">
                                <Form.Label>Course Image URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                                    name="imagePath"
                                    value={courseData.imagePath}
                                    onChange={handleImageUrlChange}
                                    isInvalid={!!errors.imagePath}
                                />
                                <Form.Control.Feedback type="invalid">{errors.imagePath}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Image Preview */}
                    {courseData.imagePath && (
                        <Row className="mt-3">
                            <Col>
                                <img
                                    src={courseData.imagePath}
                                    alt="Course preview"
                                    style={{
                                        maxWidth: '200px',
                                        maxHeight: '200px',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        setErrors(prev => ({
                                            ...prev,
                                            imagePath: "Failed to load image. Please check the URL."
                                        }));
                                    }}
                                />
                            </Col>
                        </Row>
                    )}

                    <Button
                        className="mt-3"
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || Object.keys(errors).length > 0}
                    >
                        {isSubmitting ? "Creating..." : "Create Course"}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default CreateCoursePage;