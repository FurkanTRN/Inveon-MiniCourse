import {useState} from "react";
import {Form, FormControl, InputGroup, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import {FaSearch, FaShoppingBag, FaShoppingCart, FaSignOutAlt, FaUser} from "react-icons/fa";
import {MY_LEARNING_COURSES} from "../../helpers/variables.js";
import {useCartContext} from "../../context/CartContext.jsx";

const TopHeader = ({isLoggedIn = true}) => {
    const {cart} = useCartContext(); // Access cart from context

    const [isOffcanvasVisible, setOffcanvasVisibility] = useState(false);
    const [visibleMenus, setVisibleMenus] = useState({
        myLearning: false,
    });

    const [searchQuery, setSearchQuery] = useState("");

    const [cartCount] = useState(3);

    const toggleOffcanvas = () => setOffcanvasVisibility(!isOffcanvasVisible);
    const toggleMenuVisibility = (menu, isVisible) => {
        setVisibleMenus((prevState) => ({
            ...prevState,
            [menu]: isVisible,
        }));
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredCourses = MY_LEARNING_COURSES.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ).slice(0, 4);
    const CartMenu = () => {
        return (
            <Nav.Link href="/cart" className="position-relative me-3">
                <FaShoppingCart size={20} className="cart-icon"/>
                {cart.length > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge"
                        style={{fontSize: "0.75rem"}}
                    >
                        {cart.length}
                    </span>
                )}
            </Nav.Link>
        );
    };

    const AuthButtons = () => (
        <div className="d-flex gap-2 me-2">
            <button
                className="btn btn-outline-primary"
                onClick={() => alert("Login")}
                aria-label="Login"
            >
                Login
            </button>
            <button
                className="btn btn-primary"
                onClick={() => alert("Signup")}
                aria-label="Signup"
            >
                Signup
            </button>
        </div>
    );

    const ProfileDropdown = ({id, className, align}) => (
        <NavDropdown
            title={
                <img
                    src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
                    alt="Profile"
                    className="rounded-circle"
                    style={{width: '36px', height: '36px', objectFit: 'cover'}}
                />
            }
            id={id}
            className={className}
            align={align}
        >
            <NavDropdown.Item href="/profile">
                <FaUser style={{ marginRight: "10px" }} />
                Profile
            </NavDropdown.Item>
            <NavDropdown.Item href="/orders">
                <FaShoppingBag style={{ marginRight: "10px" }} />
                My Purchases
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/logout">
                <FaSignOutAlt style={{ marginRight: "10px" }} />
                Log Out
            </NavDropdown.Item>
        </NavDropdown>
    );

    return (
        <Navbar
            bg="light"
            expand="lg"
            className="shadow-sm sticky-top"
            style={{height: "70px"}}
        >
            <Navbar.Brand className="px-2" href="/">
                MiniUdemy
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvas-nav" onClick={toggleOffcanvas}/>
            <Offcanvas
                show={isOffcanvasVisible}
                onHide={toggleOffcanvas}
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
                        {isLoggedIn ? (
                            <ProfileDropdown
                                id="profile-offcanvas-dropdown"
                                className="no-caret"
                                align="start"
                            />
                        ) : (
                            AuthButtons()
                        )}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
            <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
                <Nav className="me-auto"></Nav>
                <Form className="d-flex flex-grow-1 mx-2 position-relative">
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
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="d-flex align-items-center p-2 border-bottom"
                                        style={{cursor: "pointer"}}
                                        onClick={() => alert(`Selected: ${course.name}`)} // Örnek işlem
                                    >
                                        <img
                                            src={course.image}
                                            alt={course.name}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                marginRight: "10px",
                                                objectFit: "cover",
                                                borderRadius: "5px",
                                            }}
                                        />
                                        <span>{course.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-2 text-center text-muted">
                                    No results found
                                </div>
                            )}
                        </div>
                    )}
                </Form>

                <Nav className="align-items-center me-2">
                    <NavDropdown
                        title="My Learning"
                        id="my-learning-dropdown"
                        onMouseEnter={() => toggleMenuVisibility("myLearning", true)}
                        onMouseLeave={() => toggleMenuVisibility("myLearning", false)}
                        show={visibleMenus.myLearning}
                        align="end"
                    >
                        {MY_LEARNING_COURSES.map((course) => (
                            <NavDropdown.Item key={course.id} href={`course/${course.id}`}>
                                <div className="d-flex align-items-center">
                                    <img
                                        src={course.image}
                                        alt={course.name}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            marginRight: "10px",
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    <span>{course.name}</span>
                                </div>
                            </NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    {CartMenu()}
                    {isLoggedIn ? (
                        <ProfileDropdown
                            id="profile-nav-dropdown"
                            className="no-caret"
                            align="end"
                        />
                    ) : (
                        AuthButtons()
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default TopHeader;