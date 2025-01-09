import React, { useEffect, useState } from "react";

interface MainDepartmentModalProps {
  onClose: () => void;
  onCreateMainDepartment: (action: number, departmentValue: string) => void;
  editModal: boolean;
  selectedDepartmentName: string;
}

const MainDepartmentModal: React.FC<MainDepartmentModalProps> = ({
  onClose,
  onCreateMainDepartment,
  editModal,
  selectedDepartmentName,
}) => {
  const [departmentName, setDepartmentName] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false); // Track if the user clicked submit

  useEffect(() => {
    if (editModal) {
      setDepartmentName(selectedDepartmentName);
    }
  }, [editModal, selectedDepartmentName]);

  const handleSubmit = () => {
    setSubmitted(true);

    if (departmentName.trim().length === 0) {
      // Validation failed
      return;
    }

    // Trigger the callback function
    onCreateMainDepartment(editModal ? 2 : 1, departmentName);
  };

  const isValid = departmentName.trim().length > 0;

  return (
    <div
      className="advance-btn-modal modal"
      id="CreateMainDepartment_Modal"
      aria-modal="true"
      role="dialog"
      style={{ display: "block" }}
    >
      <div className="modal-dialog cstm_modal_dialog">
        <div className="modal-content plus_modal_cont">
          {/* Modal Header */}
          <div
            className="modal-header plus_modal_head"
            style={{
              display: "block",
              paddingBottom: "0px",
              textAlign: "center",
            }}
          >
            <h4
              id="heading_Title_MainDepartmentModal"
              className="modal-title plus_head_popup"
              style={{ left: "0px" }}
            >
              {editModal ? "Edit Main Department" : "Add Main Department"}
            </h4>
          </div>

          {/* Modal Body */}
          <div className="modal-body new_modal_work">
            <div className="form-group plus_from_group">
              <input
                type="text"
                className="form-control plus_imput_feild"
                id="txtMainDepartmentName_ManageMainDepartment"
                placeholder="Enter Main Department"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              {submitted && !isValid && (
                <div
                  id="mainDepartmentName_error_ManageMainDepartment"
                  className="errorsClass2 text-danger"
                >
                  Please enter a valid department name.
                </div>
              )}
            </div>
            <div className="modal-bottom plus_modal_bottom">
              <button type="button" className="pro-cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                id="btnSubmit_MainDepartment"
                type="button"
                className="pro-submit"
                onClick={handleSubmit}
              >
                {editModal ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDepartmentModal;
