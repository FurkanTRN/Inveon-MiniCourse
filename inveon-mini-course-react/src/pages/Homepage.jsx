import {useState, useEffect} from "react";
import {Button, Col, Container, Row, Dropdown, DropdownButton, Alert, Spinner} from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {courses} from "../helpers/variables.js";
import CourseCard from "../components/card/CourseCard.jsx";
import Pagination from "../components/Pagination.jsx";
import {FaSortAlphaDown, FaSortAmountDown, FaSortAmountUp} from "react-icons/fa";

const ROWS_PER_PAGE = 3;
const COLUMNS_PER_ROW = 3;

const ITEMS_PER_PAGE = ROWS_PER_PAGE * COLUMNS_PER_ROW;

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("alphabetic");
    const [isLoading, setIsLoading] = useState(false); // Initial loading state

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

    const getSortedCourses = () => {
        const parsePrice = (price) => parseFloat(price.replace("$", ""));
        const sortStrategies = {
            alphabetic: (a, b) => a.name.localeCompare(b.name),
            lowToHigh: (a, b) => parsePrice(a.price) - parsePrice(b.price),
            highToLow: (a, b) => parsePrice(b.price) - parsePrice(a.price),
        };
        return [...courses].sort(sortStrategies[sortOption] || (() => 0));
    };

    const sortedCourses = getSortedCourses();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCourses = sortedCourses.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setIsLoading(true); // Trigger loading state
            setCurrentPage(pageNumber);
        }
    };

    const handleSortChange = (option) => {
        setIsLoading(true);
        setSortOption(option);
        setCurrentPage(1);
    };

    const getFilterText = () => {
        switch (sortOption) {
            case "alphabetic":
                return "Alphabetically";
            case "lowToHigh":
                return "Price: Low to High";
            case "highToLow":
                return "Price: High to Low";
            default:
                return "Unknown";
        }
    };

    return (
        <>
            <TopHeader isLoggedIn={true}/>

            <section className="hero bg-primary text-white text-center py-5">
                <Container>
                    <h1>Welcome, User</h1>
                    <p className="mt-3">Learn and grow with the best courses available online.</p>
                    <Button variant="light" href="#courses">
                        Explore Courses
                    </Button>
                </Container>
            </section>

            <section id="courses" className="py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Explore Courses</h2>
                        <DropdownButton
                            id="dropdown-filter"
                            title={`Sort By: ${getFilterText()}`}
                            variant="outline-secondary"
                            onSelect={handleSortChange}
                            align="end"
                        >
                            <Dropdown.Item eventKey="alphabetic">
                                <FaSortAlphaDown className="me-2"/>
                                Alphabetically
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="lowToHigh">
                                <FaSortAmountDown className="me-2"/>
                                Price: Low to High
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="highToLow">
                                <FaSortAmountUp className="me-2"/>
                                Price: High to Low
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>

                    {isLoading ? ( // Show spinner during loading
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="primary"/>
                            <p className="mt-3">Loading courses, please wait...</p>
                        </div>
                    ) : (
                        sortedCourses.length === 0 ? (
                            <Alert variant="warning" className="text-center">
                                No courses available at the moment.
                            </Alert>
                        ) : (
                            <>
                                {Array.from({length: ROWS_PER_PAGE}).map((_, rowIndex) => (
                                    <Row key={rowIndex} className="mb-4">
                                        {paginatedCourses
                                            .slice(rowIndex * COLUMNS_PER_ROW, (rowIndex + 1) * COLUMNS_PER_ROW)
                                            .map((course) => (
                                                <Col key={course.id} xs={12} md={4} className="mb-4">
                                                    <CourseCard course={course}/>
                                                </Col>
                                            ))}
                                    </Row>
                                ))}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )
                    )}
                </Container>
            </section>
        </>
    );
};

export default HomePage;