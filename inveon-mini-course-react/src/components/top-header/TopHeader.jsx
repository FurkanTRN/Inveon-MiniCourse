import {useState} from "react";
import {Form, FormControl, InputGroup, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import {FaSearch, FaShoppingCart} from "react-icons/fa";

const NAV_CATEGORIES = [{label: 'All', href: '#'}, {label: 'Web Development', href: '#'},];
const TopHeader = ({isLoggedIn = true}) => {
    const [isOffcanvasVisible, setOffcanvasVisibility] = useState(false);
    const [isCategoriesVisible, setCategoriesVisibility] = useState(false);
    const [cartCount] = useState(3);

    const toggleOffcanvas = () => setOffcanvasVisibility(!isOffcanvasVisible);
    const toggleCategories = (isVisible) => setCategoriesVisibility(isVisible);

    const CategoriesDropdown = ({id, className}) => (<NavDropdown
        title="Categories"
        id={id}
        className={className}
        onMouseEnter={() => toggleCategories(true)}
        onMouseLeave={() => toggleCategories(false)}
        show={isCategoriesVisible}
    >
        {NAV_CATEGORIES.map((category) => (<NavDropdown.Item key={category.href} href={category.href}>
            {category.label}
        </NavDropdown.Item>))}
    </NavDropdown>);

    const CartIcon = () => {
        return (<Nav.Link href="#cart" className="position-relative me-3">
            <FaShoppingCart size={20} className="cart-icon"/>
            {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge">
    {cartCount}
</span>)}
        </Nav.Link>);
    }

    const AuthButtons = () => (<div className="d-flex gap-2 me-2">
        <button className="btn btn-outline-primary" onClick={() => alert('Login')} aria-label="Login">
            Login
        </button>
        <button className="btn btn-primary" onClick={() => alert('Signup')} aria-label="Signup">
            Signup
        </button>
    </div>);

    const ProfileDropdown = ({id, className, align}) => (<NavDropdown
        title={<img
            src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
            alt="Profile"
            className="rounded-circle"
            style={{width: '36px', height: '36px', objectFit: 'cover'}}
        />}
        id={id}
        className={className}
        align={align}
    >
        <NavDropdown.Item href="#action/profile">Profile</NavDropdown.Item>
        <NavDropdown.Item href="#action/settings">Settings</NavDropdown.Item>
        <NavDropdown.Divider/>
        <NavDropdown.Item href="#action/logout">Log Out</NavDropdown.Item>
    </NavDropdown>);

    return (<Navbar bg="light" expand="lg" className="shadow-sm sticky-top" // Sticky navbar at the top of the page
                    style={{height: "70px"}}>
        <Navbar.Brand className="px-2" href="#home">
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
                    {CategoriesDropdown('categories-offcanvas-dropdown', 'no-caret')}
                    <Nav.Link href="#my-learning">My Learning</Nav.Link>
                    <Nav.Link href="#cart" className="position-relative">
                        Cart
                    </Nav.Link>
                    {isLoggedIn ? (<ProfileDropdown
                        id="profile-offcanvas-dropdown"
                        className="no-caret"
                        align="start"
                    />) : (AuthButtons())}
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            <Nav className="me-auto">
                {CategoriesDropdown('categories-nav-dropdown', 'no-caret')}
            </Nav>
            <Form className="d-flex flex-grow-1 mx-2">
                <InputGroup className="flex-grow-1">
                    <InputGroup.Text className="bg-white border-end-0">
                        <FaSearch/>
                    </InputGroup.Text>
                    <FormControl
                        type="search"
                        placeholder="Search for anything"
                        className="border-start-0 no-focus-shadow"
                        aria-label="Search"
                    />
                </InputGroup>
            </Form>
            <Nav className="align-items-center me-2">
                <Nav.Link href="#my-learning" className="me-2">
                    My Learning
                </Nav.Link>
                {CartIcon()}
                {isLoggedIn ? (<ProfileDropdown
                    id="profile-nav-dropdown"
                    className="no-caret"
                    align="end"
                />) : (AuthButtons())}
            </Nav>
        </Navbar.Collapse>
    </Navbar>);
};
export default TopHeader;