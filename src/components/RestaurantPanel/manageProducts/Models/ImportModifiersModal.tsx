import axios from 'axios';
import React, { useState } from 'react';
import Swal from "sweetalert2";

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
interface product {
  Id: number;
  Name: string;
}

interface ImportModifersProps {
  isModalOpen: boolean;
  closeModal: () => void;
  importList: product[];
  productId: number;
  setLoading: (loading: boolean) => void;
}

const ImportModifiersModal: React.FC<ImportModifersProps> = ({ isModalOpen, closeModal, importList, productId, setLoading }) => {

  const [importFromProductId, setIMportFfromProductId] = useState<string>("0");

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${import.meta.env.VITE_API_URL}api/product/addupdate/importmodifiers`;

    try {
      setLoading(true);
      const response = await axios.post(
        apiUrl,
        {
          productId: productId,
          restaurantLoginId: "0",
          importFromProductId: importFromProductId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.status === 1) {
        Toast.fire({
          icon: "success",
          title: "Modifier Added successfully",
        });
      } else {
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            Toast.fire({
              icon: "error",
              title: "Unauthorized! Invalid Token!",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "There is some technical error, please try again!",
            });
          }
        } else if (error.request) {
          Toast.fire({
            icon: "error",
            title: "No response from server. Please check your network connection!",
          });
        }
      }
    } finally {
      setLoading(false);
      closeModal();
    }
  };


  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <div
          className="advance-btn-modal modal fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity  show"
          id="ImportModifiers_Modal"
          data-backdrop="static"
          data-keyboard="false"
          style={{ display: 'block' }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog cstm_modal_dialog">
            <div className="modal-content plus_modal_cont">
              {/* Modal Header */}
              <div className="modal-header plus_modal_head">
                <h4 id="heading_Title_ImportModifiers_Modall" className="mx-auto !p-0 modal-title plus_head_popup" style={{ left: "0px" }}>
                  Import Modifiers
                </h4>
              </div>
              {/* Modal Body */}
              <div className="modal-body new_modal_work">
                <div className="form-group pop-up_drop">
                  <div className="select_box">
                    <select className="form-control" id="ddlProduct_ImportModifiers_Modal"
                      value={importFromProductId}
                      onChange={(e) => setIMportFfromProductId(e.target.value)}>

                      <option value="0">Select Product</option>
                      {importList?.map((product:any) => (
                        <option key={product.Id} value={product.Id}>
                          {product.Name}
                        </option>
                      ))}
                      {/* Options can be populated dynamically based on your API response */}
                    </select>
                  </div>
                  <div id="product_error_ImportModifiers_Modal" className="errorsClass2 errorsClass2_ImportModifiers"></div>
                </div>

                {/* Modal Bottom (Buttons) */}
                <div className="modal-bottom plus_modal_bottom">
                  <button
                    id="btnCancel_ImportModifiers_Modal"
                    type="button"
                    // className="cstm_model_plusbtn_1 btn btn-danger"
                    className=" !bg-[#1b964b] text-white px-4 py-1 rounded-2xl"
                    onClick={closeModal} // Close modal when cancel is clicked
                  >
                    Cancel
                  </button>
                  <button
                    id="btnSubmit_ImportModifiers_Modal"
                    type="button"
                    // className="cstm_model_plusbtn_2 btn btn-danger"
                    className=" !bg-[#1b964b] text-white px-4 py-1 rounded-2xl"
                    onClick={handleSubmit} // Submit logic
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportModifiersModal;
