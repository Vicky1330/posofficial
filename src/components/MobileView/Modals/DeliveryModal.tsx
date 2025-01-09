import React from "react";
import { Modal, Form } from "react-bootstrap";

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      top="true"
      size="sm"
      aria-labelledby="modal_delivery_Label_ForMobile"
      backdrop="static"
      className="fixed inset-0 bg-black bg-opacity-75 z-0 min-h-screen"
    >
      <Modal.Body className="mb-0 pb-1">
        <h6>Enter Your Delivery Address</h6>
        <Form>
          <Form.Group controlId="autocomplete_dl">
            <Form.Control
              type="text"
              placeholder="Enter your address"
              autoComplete="off"
              className="pac-target-input"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-nowrap p-1 px-4 gap-2">
          <button onClick={onClose}>
            Back
          </button>
          <button
            id="btn_insert_del_address_mobile"
            style={{
              backgroundColor: "#fe8e3c",
              color: "white",
              border: "none",
              padding: "6px 8px",
              borderRadius: "4px",
            }}
            onClick={() => (window.location.href = "3.DepartmentList.html")}
          >
            Add Address
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeliveryModal;
