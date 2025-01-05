import { Modal, Button } from 'react-bootstrap';

const DeleteAccountModal = ({ show, onClose, onDelete }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete Account
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteAccountModal;
