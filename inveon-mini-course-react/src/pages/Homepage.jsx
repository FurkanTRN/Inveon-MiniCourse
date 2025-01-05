import {useState, useEffect} from "react";
import {Button, Col, Container, Row, Dropdown, DropdownButton, Alert, Spinner, Carousel} from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import CourseCard from "../components/card/CourseCard.jsx";
import Pagination from "../components/Pagination.jsx";
import {FaSortAlphaDown, FaSortAmountDown, FaSortAmountUp} from "react-icons/fa";
import {useAuth} from "../context/AuthContext.jsx";
import CourseService from "../Service/CourseService.js";
import {MdOutlineFiberNew, MdOutlineWatchLater} from "react-icons/md";

const ITEMS_PER_PAGE = 6;

const initialCourseData = {
    courses: [],
    totalPage: 0,
    totalRecord: 0,
    pageSize: ITEMS_PER_PAGE
};

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("Newest");
    const [courseData, setCourseData] = useState(initialCourseData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();
    const [latestCourses, setLatestCourses] = useState([]);

    const fetchCourses = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await CourseService.getCourses(currentPage, ITEMS_PER_PAGE, sortBy);
            console.log('Fetched Response:', response);
            if (response && Array.isArray(response.courses)) {
                setCourseData(response);
            } else {
                console.error('Invalid response structure:', response);
                setCourseData(initialCourseData);
                setError('Received invalid data format from server');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setCourseData(initialCourseData);
            setError(error.message || 'Failed to fetch courses');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLatestCourses = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await CourseService.getCourses(1, 5, "Newest");
            if (response && Array.isArray(response.courses)) {
                setLatestCourses(response.courses);
            } else {
                console.error('Invalid response structure:', response);
                setError('Received invalid data format from server');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message || 'Failed to fetch latest courses');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchLatestCourses();
    }, [currentPage, sortBy]);
    const getCoursesLength = () => courseData?.courses?.length || 0;
    const getTotalRecord = () => courseData?.totalRecord || 0;
    const getTotalPages = () => courseData?.totalPage || 1;

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= getTotalPages()) {
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

    const renderLatestCourses = () => {
        if (latestCourses.length === 0) return null;

        return latestCourses.map((course) => (
            <Carousel.Item key={course.id}>
                <img
                    className="d-block w-100"
                    src={course.imagePath || "https://via.placeholder.com/410x200"}
                    alt={course.title}
                    style={{objectFit: 'contain', height: '250px'}}
                />
                <Carousel.Caption
                    style={{position: 'absolute', bottom: '10px', left: '20px', right: '20px', textAlign: 'left'}}>
                    <h3 style={{color: "black"}}>{course.title}</h3>
                    <p className="text-truncate"
                       style={{color: "black"}}>{course.description || "No description available."}</p>
                </Carousel.Caption>
            </Carousel.Item>
        ));
    };

    return (
        <>
            <TopHeader/>
            <Carousel>
                {isLoading ? (
                    <Spinner animation="border" variant="light" className="mx-auto"/>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : renderLatestCourses()}
            </Carousel>


            <section id="courses" className="py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2>Explore Courses</h2>
                            {!isLoading && !error && (
                                <p className="text-muted">
                                    Showing {getCoursesLength()} of {getTotalRecord()} courses
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
                    ) : getCoursesLength() === 0 ? (
                        <Alert variant="warning" className="text-center">
                            No courses available at the moment.
                        </Alert>
                    ) : (
                        <>
                            <Row className="g-4">
                                {renderCourseCards()}
                            </Row>
                            {getTotalPages() > 1 && (
                                <div className="mt-4 d-flex justify-content-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={getTotalPages()}
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

export default HomePage;
