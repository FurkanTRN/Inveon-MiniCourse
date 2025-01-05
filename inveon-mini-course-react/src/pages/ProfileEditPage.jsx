import {useState, useEffect} from "react";
import {Container, Row, Col, Button, Form, Card, Image, Nav} from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {useAuth} from "../Context/AuthContext";
import AuthService from "../Service/AuthService.js";
import UserService from "../Service/UserService.js";

const ProfilePage = () => {
        const {user, loading} = useAuth();
        const [activeTab, setActiveTab] = useState('profile');
        const [formData, setFormData] = useState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            newPassword: "",
            confirmPassword: "",
            avatarPath: "" // URL for the profile picture
        });

        useEffect(() => {
            if (user) {
                setFormData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    password: "",
                    newPassword: "",
                    confirmPassword: "",
                    avatarPath: user.avatarPath || "" // Set the initial avatar URL
                });
            }
        }, [user]);

        const handleChange = (e) => {
            setFormData({...formData, [e.target.name]: e.target.value});
        };

        const handleSaveProfile = async () => {
            console.log(formData);
            const response = await UserService.updateProfile(formData.firstName, formData.lastName, formData.avatarPath, formData.email);

            if (response.status === 200 || response.status === 204) {
                alert("Profile has been updated successfully!");
            } else {
                alert("Failed to update profile. Please try again.");
            }
        }


        const handleSavePassword = async () => {
            if (formData.newPassword !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const response = await AuthService.updatePassword(formData.password, formData.newPassword);

                if (response.status === 204) {
                    alert("Password has been updated successfully!");
                    setFormData({...formData, password: "", newPassword: "", confirmPassword: ""});
                } else {
                    alert("Failed to update password. Please try again.");
                }
            } catch (error) {
                console.error("Error updating password:", error);
                alert("An error occurred while updating the password.");
            }
        };

        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <div className="bg-light min-vh-100">
                <TopHeader/>

                <Container className="py-5">
                    <Row>
                        <Col md={3} className="mb-4">
                            <Card className="shadow">
                                <Card.Body>
                                    <div className="text-center mb-4">
                                        <Image
                                            src={formData.avatarPath || "https://via.placeholder.com/150"}
                                            roundedCircle
                                            className="img-fluid"
                                            style={{width: "90px", height: "90px", objectFit: "cover"}}
                                        />
                                        <h5 className="mt-3">{formData.firstName + " " + formData.lastName}</h5>
                                    </div>

                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link
                                                active={activeTab === 'profile'}
                                                onClick={() => setActiveTab('profile')}
                                            >
                                                Profile Settings
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link
                                                active={activeTab === 'password'}
                                                onClick={() => setActiveTab('password')}
                                            >
                                                Change Password
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={9}>
                            {activeTab === 'profile' && (
                                <Card className="shadow-lg rounded mb-4">
                                    <Card.Body>
                                        <div className="text-center mb-4">
                                            <Image
                                                src={formData.avatarPath || "https://via.placeholder.com/150"}
                                                roundedCircle
                                                className="img-fluid"
                                                style={{width: "120px", height: "120px", objectFit: "cover"}}
                                            />
                                            <h3 className="mt-3">{formData.firstName + " " + formData.lastName}</h3>
                                            <p className="text-muted">{formData.email}</p>
                                        </div>

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

                                            <Form.Group className="mb-3" controlId="formAvatarPath">
                                                <Form.Label>Profile Picture URL</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="avatarPath"
                                                    value={formData.avatarPath}
                                                    onChange={handleChange}
                                                    placeholder="Enter a URL for your profile picture"
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    readOnly
                                                />
                                            </Form.Group>

                                            <Button variant="success" onClick={handleSaveProfile}>
                                                Save Profile Changes
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            )}

                            {activeTab === 'password' && (
                                <Card className="shadow-lg rounded mb-4">
                                    <Card.Body>
                                        <h5>Change Password</h5>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formPassword">
                                                <Form.Label>Current Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formNewPassword">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                                <Form.Label>Confirm New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Button variant="success" onClick={handleSavePassword}>
                                                Save Password Changes
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
;

export default ProfilePage;