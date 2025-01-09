import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../assets/CSS/manage-reasons.css";
import Swal from "sweetalert2";

interface Reason {
  id: number;
  label: string;
  checked?: boolean;
  editing?: boolean;
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

const ManageReasons: React.FC = () => {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [newReason, setNewReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const UserToken_Global = localStorage.getItem("authToken");
  const RestaurantLoginId_Global = 0;

  // Function to fetch reasons
  const getAllReasons = async (): Promise<void> => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}api/restaurant/order/cancellation/reasons/list?restaurantLoginId=${RestaurantLoginId_Global}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.data.status === 1 || response.data.status === 2) {
        const formattedReasons = response.data.data.reasons.map((reason: any) => ({
          id: reason.Id,
          label: reason.Reason,
          checked: false,
          editing: false,
        }));
        setReasons(formattedReasons);
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to fetch reasons.",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "There was an error fetching reasons.",
      });
    }
    finally {
      setLoading(false);
    }
  };

  // Fetch reasons
  useEffect(() => {
    getAllReasons();
  }, []);

  const handleCheckboxChange = (id: number): void => {
    setReasons(prevReasons =>
      prevReasons.map(reason =>
        reason.id === id ? { ...reason, checked: !reason.checked } : reason
      )
    );
  };

  const handleEdit = (id: number): void => {
    setReasons(prevReasons =>
      prevReasons.map(reason =>
        reason.id === id
          ? { ...reason, editing: !reason.editing }
          : { ...reason, editing: false }
      )
    );
  };

  const handleDelete = async (id: number): Promise<void> => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReason(id);
      }
    });

  }

  const deleteReason = async (id: number) => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}api/restaurant/order/cancellation/reason/delete?restaurantLoginId=${RestaurantLoginId_Global}&reasonId=${id}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.data.status === 1) {
        Toast.fire({
          icon: "success",
          title: response.data.message || "Reason deleted successfully.",
        });
        getAllReasons();
      } else {
        Toast.fire({
          icon: "error",
          title: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "There was an error while deleting the reason. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // reason add function
  const handleAddReason = async (): Promise<void> => {
    if (newReason.trim() !== '') {
      const reasonObj = {
        reasonName: newReason.trim(),
        mode: 1,
      };

      setLoading(true);

      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}api/restaurant/addupdate/order/cancellation/reason`;
        const response = await axios.post(apiUrl, reasonObj, {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200 || response.data.status === 1 || response.data.status === 2) {
          setNewReason('');
          getAllReasons();
        } else {
          Toast.fire({
            icon: "error",
            title: response.data.message || "Something went wrong.",
          });

        }
      } catch (error) {
        console.error("Error adding reason!");
        Toast.fire({
          icon: "error",
          title: "Error adding reason!",
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Please enter a reason!');
    }
  };

  const handleUpdateReason = async (id: number, newLabel: string): Promise<void> => {
    if (newLabel.trim() !== '') {
      setLoading(true);

      try {
        const reasonObj = {
          id,
          reasonName: newLabel.trim(),
          mode: 2,
        };

        const apiUrl = `${import.meta.env.VITE_API_URL}api/restaurant/addupdate/order/cancellation/reason`;
        const response = await axios.post(apiUrl, reasonObj, {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200 || response.data.status === 1 || response.data.status === 2) {
          Toast.fire({
            icon: "success",
            title: "Reason updated successfully.",
          });
          getAllReasons();
        } else {
          Toast.fire({
            icon: "error",
            title: response.data.message || "Something went wrong while updating.",
          });
        }
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Error updating reason.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Please enter a valid reason!",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number): void => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      const inputElement = e.target as HTMLInputElement; 
      const newLabel = inputElement.value.trim();
      if (newLabel !== '') {
        handleUpdateReason(id, newLabel);
        handleEdit(id);
      }
    }
  };

  return (
    <div className="container-scroller">

      {loading && (<div style={{
        backgroundColor: "#f0f5f0",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "300%",
        zIndex: 999999999999999,
        MozOpacity: 0.2,
        opacity: 0.2,
      }}>
        <img src="/Content/Images/Loader.gif" style={{
          backgroundColor: "#9af58c",
          alignItems: "center",
          position: "fixed",
          top: "40%",
          width: "10%",
          left: "50%",
        }} />
      </div>)}

      <div className="page-body-wrapper">
        <div id="contentWrapper_RestaurantLayout" className="content-wrapper">
          <div className="mange_regions_section">
            <main className="content">
              <div className="card" style={{ borderRadius: '6px' }}>
                <div className="row g-0">
                  <div className="col-12 col-lg-12 col-xl-12">
                    <div className="position-relative">
                      <div
                        id="ReasonsList_Section_ManageReasons"
                        className="chat-messages p-4 ui-sortable"
                        style={{ paddingRight: '20px', minHeight: 'calc(100vh - 308px)' }}
                      >
                        {reasons.map(reason => (
                          <div
                            key={reason.id}
                            className="chat-message-left pb-3 ReasonSectionCommonClass ui-sortable-handle"
                            style={{ width: '100%', alignItems: 'center' }}
                          >
                            <div style={{ textAlign: 'left', marginRight: '10px' }}>
                              <input
                                id={`chkReason_${reason.id}_ManageReasons`}
                                type="checkbox"
                                className="edit_checkbox"
                                style={{ cursor: 'pointer' }}
                                checked={reason.checked}
                                onChange={() => handleCheckboxChange(reason.id)}
                              />
                            </div>
                            {!reason.editing && (
                            <div
                              id={`lblReason_${reason.id}_Section_ManageReasons`}
                              className="flex-shrink-1 rounded py-2 px-3 ml-3 lblReasonSectionClass"
                              style={{ width: 'inherit', minHeight: '50px', cursor: 'pointer' }}
                              onClick={() => handleEdit(reason.id)} 
                            >
                              {reason.label}
                            </div>
                            )}
                            {reason.editing && (
                              <div
                                id={`TextFieldReason_${reason.id}_Section_ManageReasons`}
                                className="flex-shrink-1 rounded py-2 px-3 ml-3 TextFieldReasonSectionClass"
                                style={{ width: 'inherit' }}
                              >
                                <input
                                  id={`txtReasonForEdit_${reason.id}_ManageReasons`}
                                  type="text"
                                  className="form-control TextFieldReasonClass"
                                  defaultValue={reason.label}
                                  onBlur={(e) => {
                                    handleUpdateReason(reason.id, e.target.value);
                                    handleEdit(reason.id);
                                  }}
                                  onChange={(e) => {
                                    const updatedLabel = e.target.value;
                                    setReasons(prevReasons =>
                                      prevReasons.map(r =>
                                        r.id === reason.id ? { ...r, label: updatedLabel } : r
                                      )
                                    );
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e, reason.id)} 
                                />
                              </div>
                            )}
                            <div style={{ textAlign: 'right' }}>
                              <span
                                className="material-icons"
                                style={{ fontSize: '40px', cursor: 'pointer' }}
                                title="Delete Reason"
                                onClick={() => handleDelete(reason.id)}
                              >
                                delete
                              </span>
                            </div>
                          </div>
                        ))}

                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-0 py-3 px-4 border-top">
                  <div className="input-group">
                    <input
                      id="txtReason_ManageReasons"
                      type="text"
                      className="form-control"
                      placeholder="Add New Reason..."
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                    />
                    <input
                      type="button"
                      className="btn"
                      style={{ background: '#1b964b', color: '#fff' }}
                      value="ADD"
                      onClick={handleAddReason}
                    />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div >
    </div >
  );
};

export default ManageReasons;
