import React, { RefObject } from "react";

interface PickupModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  // pickupType: String;
  cancelRef: RefObject<HTMLButtonElement>;
}

const PickupModal: React.FC<PickupModalProps> = ({ onConfirm, onCancel, cancelRef }) => {
  return (
    <div
      className="modal modal-back fade"
      id="staticback_pickup"
      aria-labelledby="staticbackLabel"
      aria-hidden="true"
      tabIndex={-1}
    >
      <div className="fixed inset-0 bg-black opacity-75 z-0 min-h-screen"></div>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" id="staticbackLabel">
              Web POS
            </h5>
          </div>
          {/* <div className="modal-footer border-0 d-block"> */}
          <div className="modal-footer p-3 border-0 d-block">
            <p>
              Product prices might vary depending on delivery and pickup order
              types. Please confirm ordering method.
            </p>
          </div>
          <div className="flex flex-end p-4  border-0">
            <button
              className="btn btn-success"
              id="openPickupModalYesButton"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              className="btn btn-danger"
              data-dismiss="modal"
              id="openPickupModalNoButton"
              ref={cancelRef}
              onClick={onCancel}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupModal;
