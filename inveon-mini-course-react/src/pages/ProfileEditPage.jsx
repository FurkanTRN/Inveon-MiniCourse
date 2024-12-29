import React, { useState } from "react";
import { Container, Row, Col, Button, Tabs, Tab, Form, Card, Image } from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";

const ProfilePage = () => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        bio: "Passionate learner and teacher. Exploring the world of coding.",
    });

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setEditMode(false);
        alert("Profile has been updated!");
        // Here, add API request to save the data
    };

    return (
        <div className="bg-light min-vh-100">
            {/* Add the Top Header */}
            <TopHeader />

            <Container className="py-5">
                <Row>
                    {/* Rest of the code remains unchanged */}
                    <Col md={4} className="mb-4">
                        <Card className="text-center shadow">
                            <Card.Body>
                                <div className="mb-3">
                                    <Image
                                        src="https://via.placeholder.com/150"
                                        roundedCircle
                                        className="img-fluid"
                                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                    />
                                </div>
                                <h4 className="fw-bold">{formData.firstName + " " + formData.lastName}</h4>
                                <p className="text-muted">{formData.email}</p>
                                <p className="mt-2">{formData.bio}</p>
                                <Button variant="primary" onClick={handleEditClick}>
                                    {editMode ? "Cancel" : "Edit Profile"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={8}>
                        <Card className="shadow">
                            <Card.Body>
                                <Tabs defaultActiveKey="profile" className="mb-3">
                                    <Tab eventKey="profile" title="Profile">
                                        {editMode ? (
                                            <Form>
                                                <Form.Group className="mb-3" controlId="formFirstName">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formLastName">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formEmail">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formBio">
                                                    <Form.Label>Bio</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>

                                                <Button variant="success" onClick={handleSave}>
                                                    Save Changes
                                                </Button>
                                            </Form>
                                        ) : (
                                            <div>
                                                <h5>Full Name:</h5>
                                                <p>{formData.firstName + " " + formData.lastName}</p>
                                                <h5>Email:</h5>
                                                <p>{formData.email}</p>
                                                <h5>Bio:</h5>
                                                <p>{formData.bio}</p>
                                            </div>
                                        )}
                                    </Tab>

                                    <Tab eventKey="myCourses" title="My Courses">
                                        <div>
                                            <h5>Your Active Courses</h5>
                                            <p>You are not enrolled in any courses yet.</p>
                                        </div>
                                    </Tab>

                                    <Tab eventKey="settings" title="Settings">
                                        <div>
                                            <h5>Account Settings</h5>
                                            <p>
                                                Settings section is currently under development. Check back later!
                                            </p>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfilePage;