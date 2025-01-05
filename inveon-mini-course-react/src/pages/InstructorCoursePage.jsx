import {useState, useEffect} from "react";
import {Container, Row, Col, Button, Alert, Spinner, Modal, Card, Form} from "react-bootstrap";
import CourseService from "../Service/CourseService";
import TopHeader from "../components/top-header/TopHeader";
import Pagination from "../components/Pagination";
import CategoryService from "../Service/CategoryService.js";

const InstructorCoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: 0,
        imagePath: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await CourseService.getInstructorCourses(currentPage);
                setCourses(response.courses);
                setTotalPages(response.totalPage);
                console.log(courseData.categoryId);
            } catch (err) {
                setError("Failed to fetch courses");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [currentPage]);

    const handleUpdateCourse = async (course) => {
        setSelectedCourse(course);
        setCourseData({
            title: course.title,
            description: course.description,
            price: course.price,
            imagePath: course.imagePath || "",
            categoryId: course.categoryId.toString()
        });
        try {
            const data = await CategoryService.getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        setShowUpdateModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "categoryId") {
            setCourseData((prevData) => ({
                ...prevData,
                [name]: parseInt(value, 10)
            }));
        } else {
            setCourseData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleImageUrlChange = (e) => {
        const {value} = e.target;
        setCourseData(prevData => ({
            ...prevData,
            imagePath: value
        }));
    };

    const handleSubmitUpdate = async () => {
        try {
            const requestData = {
                title: courseData.title,
                description: courseData.description,
                price: parseFloat(courseData.price),
                imagePath: courseData.imagePath,
                categoryId: parseInt(courseData.categoryId),
            };
            console.log(requestData);
            await CourseService.updateCourse(selectedCourse.id, requestData);
            setCourses(courses.map((course) =>
                course.id === selectedCourse.id
                    ? {
                        ...course,
                        ...requestData,
                    }
                    : course
            ));
            setShowUpdateModal(false);
            setShowConfirmUpdateModal(false);
        } catch (err) {
            setError("Failed to update course");
        }
    };

    const handleDeleteCourse = async () => {
        try {
            await CourseService.deleteCourse(selectedCourse.id);
            setCourses(courses.filter(course => course.id !== selectedCourse.id));
            setShowDeleteModal(false);
        } catch (err) {
            setError("Failed to delete course");
        }
    };

    if (isLoading) {
        return <Spinner animation="border" variant="primary"/>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <>
            <TopHeader/>
            <Container>
                <h1 className="my-4">Published Courses</h1>
                <Row>
                    {courses.map((course) => (
                        <Col key={course.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card className="h-100">
                                <Card.Img
                                    variant="top"
                                    src={course.imagePath || "https://via.placeholder.com/300x200"}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/300x200";
                                    }}
                                />
                                <Card.Body>
                                    <Card.Title>{course.title}</Card.Title>
                                    <Card.Text>{course.description}</Card.Text>
                                    <Card.Text><strong>Category:</strong> {course.categoryName}</Card.Text>
                                    <Card.Text><strong>Price:</strong> ${course.price}</Card.Text>
                                    <Button variant="primary" onClick={() => handleUpdateCourse(course)}
                                            className="me-2">
                                        Update
                                    </Button>
                                    <Button variant="danger" onClick={() => {
                                        setSelectedCourse(course);
                                        setShowDeleteModal(true);
                                    }}>
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete the course "{selectedCourse?.title}"? This action cannot be
                        undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteCourse}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter course title"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formDescription" className="mt-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter course description"
                                    name="description"
                                    value={courseData.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPrice" className="mt-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter course price"
                                    name="price"
                                    value={courseData.price}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formCategory" className="mt-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="categoryId"
                                    value={courseData.categoryId.toString()}
                                    onChange={handleInputChange}
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formImage" className="mt-3">
                                <Form.Label>Course Image URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                                    name="imagePath"
                                    value={courseData.imagePath}
                                    onChange={handleImageUrlChange}
                                />
                                {courseData.imagePath && (
                                    <div className="mt-2">
                                        <img
                                            src={courseData.imagePath}
                                            alt="Course Preview"
                                            style={{width: "100px", height: "auto"}}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/100x100";
                                            }}
                                        />
                                    </div>
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => setShowConfirmUpdateModal(true)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showConfirmUpdateModal} onHide={() => setShowConfirmUpdateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Update</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to apply the changes to the course <strong>{courseData.title}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowConfirmUpdateModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmitUpdate}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default InstructorCoursePage;