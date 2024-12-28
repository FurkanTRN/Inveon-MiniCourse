import {Button, Card} from "react-bootstrap";
import {truncateText} from "../../helpers/truncate-text.js";
import {useNavigate} from "react-router-dom";

const CourseCard = ({course}) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/course/${course.id}`);
    };

    return (
        <Card className="h-100 shadow-sm">
            {/* Course Image */}
            <Card.Img
                variant="top"
                src={course.image}
                alt={course.name}
                style={{
                    height: "150px",
                    objectFit: "cover",
                }}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{truncateText(course.name, 30)}</Card.Title>

                <Card.Text className="text-muted">{truncateText(course.description, 60)}</Card.Text>

                <div className="text-muted small mb-2">
                    <strong>By {course.instructorName}</strong>
                </div>

                {/* Fixed Created Date Location */}
                <div className="text-muted small mb-3">
                    Created on: {new Date(course.createdDate).toLocaleDateString()}
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">{course.price}</span>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CourseCard;