import {useState, useEffect} from "react";
import {Form, FormControl, InputGroup, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import {FaSearch, FaShoppingCart, FaSignOutAlt, FaUser} from "react-icons/fa";
import {useCartContext} from "../../context/CartContext.jsx";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import CourseService from "../../Service/CourseService.js";
import CategoryService from "../../Service/CategoryService.js";

const TopHeader = () => {
    const {cart} = useCartContext();
    const {user, logout} = useAuth();
    const [isOffcanvasVisible, setOffcanvasVisibility] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!debouncedQuery.trim()) {
                setSearchResult({courses: []});
                return;
            }
            try {
                const response = await CourseService.searchCourse(1, 10, debouncedQuery.trim());
                if (response?.courses?.length > 0) {
                    setSearchResult(response);
                } else {
                    setSearchResult({courses: [], message: response});
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setSearchResult({courses: [], message: "An error occurred while fetching courses."});
            }
        };

        fetchCourses();
    }, [debouncedQuery]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getCategories();
                setCategories(response || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() && searchResult.courses.length > 0) {
            navigate(`/search-results?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleCategorySelect = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };
    const isInstructor = user && user.Roles && user.Roles.includes('Instructor');
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm sticky-top" style={{height: "70px"}}>
            <Navbar.Brand className="px-2" href="/">
                MiniUdemy
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvas-nav" onClick={() => setOffcanvasVisibility(!isOffcanvasVisible)}/>
            <Offcanvas
                show={isOffcanvasVisible}
                onHide={() => setOffcanvasVisibility(false)}
                id="offcanvas-nav"
                placement="start"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#my-learning">My Learning</Nav.Link>
                        <Nav.Link href="#cart" className="position-relative">
                            Cart
                        </Nav.Link>
                        {isInstructor && (
                            <>
                                <Nav.Link href="/course/create">Create Course</Nav.Link>
                                <Nav.Link href="/my-courses">My Courses</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
            <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
                <Nav className="me-auto"></Nav>
                <NavDropdown title="Categories" id="category-nav-dropdown" align="start">
                    {categories.map((category) => (
                        <NavDropdown.Item
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                        >
                            {category.name}
                        </NavDropdown.Item>
                    ))}
                </NavDropdown>
                <Form className="d-flex flex-grow-1 mx-2 position-relative" onSubmit={handleSearchSubmit}>
                    <InputGroup className="flex-grow-1">
                        <InputGroup.Text className="bg-white border-end-0">
                            <FaSearch/>
                        </InputGroup.Text>
                        <FormControl
                            type="search"
                            placeholder="Search for anything"
                            className="border-start-0 no-focus-shadow"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                    </InputGroup>
                    {searchQuery && (
                        <div
                            className="position-absolute bg-white shadow rounded"
                            style={{
                                top: "100%",
                                left: 0,
                                right: 0,
                                zIndex: 1050,
                                maxHeight: "200px",
                                overflowY: "auto",
                                border: "1px solid #ddd",
                            }}
                        >
                            {searchResult.courses?.length > 0 ? (
                                searchResult.courses.slice(0, 5).map((course) => (
                                    <div
                                        key={course.id}
                                        className="d-flex align-items-center p-2 border-bottom"
                                        style={{cursor: "pointer"}}
                                        onClick={() => navigate(`/course/${course.id}`)}
                                    >
                                        <img
                                            src={course.imagePath}
                                            alt={course.title}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                marginRight: "10px",
                                                objectFit: "cover",
                                                borderRadius: "5px",
                                            }}
                                        />
                                        <span>{course.title}</span>
                                    </div>
                                ))
                            ) : (
                                <div
                                    className="p-2 text-center text-muted"> {searchResult.message || "No results found."}
                                </div>
                            )}
                        </div>
                    )}
                </Form>

                <Nav className="align-items-center me-2">

                    <Nav.Link href="/cart" className="position-relative">
                        <FaShoppingCart size={20} />
                        {cart.length > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: "0.75rem" }}
                            >
            {cart.length}
        </span>
                        )}
                    </Nav.Link>
                    {isInstructor && (
                        <>
                            <Nav.Link href="/course/create">Create Course</Nav.Link>
                            <Nav.Link href="/my-courses">My Courses</Nav.Link>
                        </>
                    )}
                    {user ? (
                        <NavDropdown
                            title={
                                <img
                                    src={user.avatarPath}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{width: "36px", height: "36px", objectFit: "cover"}}
                                />
                            }
                            id="profile-nav-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="/orders">My Orders</NavDropdown.Item>
                            <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                        <>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/register">Register</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default TopHeader;
