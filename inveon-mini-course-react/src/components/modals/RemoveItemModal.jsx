import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const RemoveItemModal = ({ item, onConfirm, onHide }) => {
    return (
        <Modal show={!!item} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Remove Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to remove the following item from your cart?</p>
                <div>
                    <strong>{item?.name}</strong>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={() => {
                        onConfirm(item);
                        onHide();
                    }}
                >
                    Remove
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RemoveItemModal;