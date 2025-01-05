import {useState, useEffect} from "react";
import {Button, Col, Container, Row, Dropdown, DropdownButton, Alert, Spinner} from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import CourseCard from "../components/card/CourseCard.jsx";
import Pagination from "../components/Pagination.jsx";
import {FaSortAlphaDown, FaSortAmountDown, FaSortAmountUp} from "react-icons/fa";
import CourseService from "../Service/CourseService.js";
import {useSearchParams} from "react-router-dom";
import {MdOutlineWatchLater} from "react-icons/md";

const ITEMS_PER_PAGE = 6;

const initialCourseData = {
    courses: [],
    totalPage: 0,
    totalRecord: 0,
    pageSize: ITEMS_PER_PAGE
};

const SearchResultsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("Newest");
    const [courseData, setCourseData] = useState(initialCourseData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("query") || "";

    const fetchCourses = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await CourseService.searchCourse(currentPage, ITEMS_PER_PAGE, searchQuery, sortBy);
            if (response && Array.isArray(response.courses)) {
                setCourseData(response);
            } else {
                console.error("Invalid response structure:", response);
                setCourseData(initialCourseData);
                setError("Received invalid data format from server");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setCourseData(initialCourseData);
            setError(error.message || "Failed to fetch courses");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [currentPage, sortBy, searchQuery]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= courseData.totalPage) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSortChange = (option) => {
        setSortBy(option);
        setCurrentPage(1);
    };

    const getFilterText = () => {
        switch (sortBy) {
            case "Alphabetical":
                return "Alphabetically";
            case "PriceLowToHigh":
                return "Price: Low to High";
            case "PriceHighToLow":
                return "Price: High to Low";
            case "Newest":
                return "Newest";
            default:
                return "Newest";
        }
    };

    const renderCourseCards = () => {
        if (!Array.isArray(courseData?.courses)) return null;

        return courseData.courses.map((course) => (
            <Col key={course.id} xs={12} sm={6} md={4}>
                <CourseCard
                    course={{
                        ...course,
                        category: {name: course.categoryName},
                        instructor: {
                            fullName: course.instructorName
                        }
                    }}
                />
            </Col>
        ));
    };

    return (
        <>
            <TopHeader/>

            <section id="search-results" className="py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2>Search Results for "{searchQuery}"</h2>
                            {!isLoading && !error && (
                                <p className="text-muted">
                                    Showing {courseData.courses.length} of {courseData.totalRecord} courses
                                </p>
                            )}
                        </div>
                        <DropdownButton
                            id="dropdown-filter"
                            title={`Sort By: ${getFilterText()}`}
                            variant="outline-secondary"
                            onSelect={handleSortChange}
                            align="end"
                        >
                            <Dropdown.Item eventKey="Alphabetical">
                                <FaSortAlphaDown className="me-2"/>
                                Alphabetically
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="PriceLowToHigh">
                                <FaSortAmountDown className="me-2"/>
                                Price: Low to High
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="PriceHighToLow">
                                <FaSortAmountUp className="me-2"/>
                                Price: High to Low
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Newest">
                                <MdOutlineWatchLater className="me-2"/>
                                Newest
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>

                    {isLoading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="primary"/>
                            <p className="mt-3">Loading courses, please wait...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    ) : courseData.courses.length === 0 ? (
                        <Alert variant="warning" className="text-center">
                            No courses found for your search query.
                        </Alert>
                    ) : (
                        <>
                            <Row className="g-4">
                                {renderCourseCards()}
                            </Row>
                            {courseData.totalPage > 1 && (
                                <div className="mt-4 d-flex justify-content-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={courseData.totalPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Container>
            </section>
        </>
    );
};

export default SearchResultsPage;
