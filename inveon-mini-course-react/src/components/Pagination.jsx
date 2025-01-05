// noinspection t

import {Button} from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageButton = (pageNumber) => (
        <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "primary" : "outline-primary"}
            className="mx-1"
            onClick={() => onPageChange(pageNumber)}
        >
            {pageNumber}
        </Button>
    );

    const getPageButtons = () => {
        const buttons = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(renderPageButton(i));
            }
        } else {
            buttons.push(renderPageButton(1));

            if (currentPage > 3) {
                buttons.push(<span key="start-ellipsis" className="mx-1">...</span>);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                buttons.push(renderPageButton(i));
            }

            if (currentPage < totalPages - 2) {
                buttons.push(<span key="end-ellipsis" className="mx-1">...</span>);
            }

            buttons.push(renderPageButton(totalPages));
        }

        return buttons;
    };

    const renderNavigationButtons = () => (
        <>
            <Button
                variant="outline-primary"
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
                className="mx-1"
            >
                First
            </Button>

            <Button
                variant="outline-primary"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="mx-1"
            >
                Previous
            </Button>

            {getPageButtons()}

            <Button
                variant="outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="mx-1"
            >
                Next
            </Button>

            <Button
                variant="outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                className="mx-1"
            >
                Last
            </Button>
        </>
    );

    return (
        <div className="d-flex justify-content-center align-items-center mt-4 flex-wrap">
            {renderNavigationButtons()}
        </div>
    );
};

export default Pagination;