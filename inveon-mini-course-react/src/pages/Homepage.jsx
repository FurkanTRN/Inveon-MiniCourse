import {useState} from "react";
import {Button,  Col, Container, Row} from "react-bootstrap";
import TopHeader from "../components/top-header/TopHeader.jsx";
import {courses} from "../helpers/variables.js";
import CourseCard from "../components/card/CourseCard.jsx";




const ITEMS_PER_PAGE = 3;

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    // Paginate the list of courses
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCourses = courses.slice(startIndex, endIndex);

    const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());

    const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            <TopHeader isLoggedIn={true}/>

            <section className="hero bg-primary text-white text-center py-5">
                <Container>
                    <h1>Welcome to MiniUdemy</h1>
                    <p className="mt-3">Learn and grow with the best courses available online.</p>
                    <Button variant="light" href="#courses">
                        Explore Courses
                    </Button>
                </Container>
            </section>

            <section id="courses" className="py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-4">Explore Our Courses</h2>
                    <Row>
                        {paginatedCourses.map((course) => (
                            <Col key={course.id} xs={12} md={4} className="mb-4">
                                <CourseCard course={course}/>
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination Section */}
                    <div className="d-flex justify-content-center mt-4">
                        <Button
                            variant="outline-primary"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <span className="mx-3 mt-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline-primary"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default HomePage;