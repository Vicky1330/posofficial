import React, {useState } from "react";
import ModifierOptionModal from "./ModifierOptionModal";
import AddModifierModal from "./AddModifierModal";
import axios from "axios";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";

type TimelineItemsProps = {
  modifireNo: number;
  name: string;
  min: number;
  max: number;
  Id: number;
  Optionlist: any[];
  productId: number;
  setLoading: (loading: boolean) => void;
}

const TimelineItem: React.FC<TimelineItemsProps> = ({
  modifireNo,
  name,
  min,
  max,
  Id,
  productId,
  Optionlist,
  setLoading,
}) => {

  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false);
  const isOpen=false;
  const [isOptionModal, setIsOptionModal] = useState<boolean>(false);
  const [editOption, setEditOption] = useState<boolean>(false);
  const [optionId, setOptionId] = useState<number>(0);



  const handleEditModifier = () => {
    setIsModifierModalOpen(true);
  };

  ;
  // Function to show the modal
  const openModifierOptionModal = (Id: number) => {
    if (Id !== 0) {
      setOptionId(Id);
      setEditOption(true);
    } else {
      setOptionId(0);
      setEditOption(false);
    }
    setIsOptionModal(true);
  };


  // Function to close the modal
  const closeModifierOptionModal = () => {
    setOptionId(0);
    setEditOption(false);
    setIsModifierModalOpen(false);
    setIsOptionModal(false);
  };

  //Delete Modifier
  const deleteModfier = async (Id: string) => {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${import.meta.env.VITE_API_URL}api/product/delete/modifier?modifierId=${Id}&restaurantLoginId=0`;

    // Confirm deletion with Swal
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true); // Show loading indicator while the request is in progress

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200 && response.data.status === 1) {

          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        } else {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 401) {
              toast.success("Unauthorized! Invalid Token!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });
            } else {
              toast.success("There is some technical error, please try again!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });

            }
          } else if (error.request) {
            toast.success("No response from server. Please check your network connection!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        }
      } finally {
        setLoading(false); // Stop the loading indicator once the request is complete
      }
    }
  };


  //DeleteModiferOption
  const DeleteModifierOption = async (Id: number) => {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${import.meta.env.VITE_API_URL}api/product/delete/modifieroption?modifierOptionId=${Id}&restaurantLoginId=0`;

    // Confirm deletion with Swal
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200 && response.data.status === 1) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        } else {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 401) {
              toast.success("Unauthorized! Invalid Token!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });
            } else {
              toast.success("There is some technical error, please try again!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });

            }
          } else if (error.request) {
            toast.success("No response from server. Please check your network connection!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };


  const setModifierDefault = async (id: number, isDefault: boolean) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/product/set/modifieroption/default`;

    // Construct the payload
    const formData = {
      id: id,
      restaurantLoginId: 0,
      isDefaultOption: isDefault ? 1 : 0,
      mode: 1,
    };

    try {
      setLoading(true);
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        console.log("Success:", response.data.message);
      } else {
        console.error("Error:", response.data.message || "Unexpected error");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <li className=" timeline-inverted">
      <div className="z-1 xl:translate-x-2 timeline-badge z-2">{(modifireNo + 1)}</div>
      <div className="timeline-panel">
        <div>
          <div className="timeline-heading pl-4 w-full ">
            <div className="faq" data-component="Faq">
              <div className="faq__grid__faqs">
                <details className="faq__grid__faqs__faq" open={isOpen}>
                  <summary
                    className="overflow-hidden justify-center sm:justify-around faq__grid__faqs__faq__button"
                    data-category="faq"
                    data-label="¿Cuánto tiempo dura la sesión?"
                  >
                    <div className="mx-auto sm:!mx-1 faq__grid__faqs__faq__button__content">
                      <div className=" justify-center sm:justify-between heading_text-wraps flex flex-col sm:flex-row">
                        <div
                          className="title_faq_wrap"
                          // style={{ minWidth: "330px", maxWidth: "330px" }}
                        >
                          <div className="head_title">{name}</div>
                        </div>

                        <div className="other_wrap-all first_other_wraps flex flex-col sm:flex-row ml-0 sm:ml-5 !pl-5 md:!pl-5 sm:!pl-14 sm:py-2">
                          <div className="flex ">
                            <label >Min</label>
                          <input
                            type="text"
                              className="!mr-1 form-control min_max-value"
                            value={min}
                            readOnly
                          />
                          </div>

                          <div className="flex">
                          <label>Max</label>
                          <input
                            type="text"
                              className="!mr-1 form-control min_max-value"
                            value={max}
                              readOnly
                            />
                          </div>

                        </div>

                        <div className="heading_edit_delete pt-2 sm:pt-0">
                          <a href="javascript:;" onClick={handleEditModifier}>
                            <i className="fa fa-edit translate-y-1 sm:translate-y-0" title="Edit Modifier" />
                          </a>
                          <a href="javascript:;" onClick={() => deleteModfier(String(Id))}>
                            <i
                              className="fa fa-trash"
                              title="Delete Modifier"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </summary>

                  <div className="type_wrapper-item d-flex flex-wrap ">
                    {Optionlist.length > 0 &&
                      Optionlist.map((option) => (
                        <div className="type_wrapper-item" key={option.Id}>
                          <p style={{ position: "relative" }}>
                            <div
                              className="item-edit-del"
                              style={{
                                position: "absolute",
                                top: "3px",
                                right: "3px",
                                display: "flex",
                                gap: "0px",
                              }}
                            >
                              <a title="Edit Option">
                                <i className="fa fa-edit" style={{ fontSize: "18px" }} onClick={() => openModifierOptionModal(option.Id)} />
                              </a>
                              <a title="Delete Option">
                                <i className="fa fa-trash" style={{ fontSize: "18px" }} onClick={() => DeleteModifierOption(option.Id)} />
                              </a>
                            </div>
                            <input
                              type="text"
                              className="form-control modifierOptionTitleStyle"
                              value={option.OptionName}
                              style={{
                                borderTopRightRadius: "0px",
                                borderBottomLeftRadius: "6px",
                                borderBottomRightRadius: "6px",
                              }}
                              readOnly
                            />
                          </p>

                          <div className="wrapper_type-value">
                            <label>Max Allow</label>
                            <input
                              type="text"
                              className="form-control min_max-value my-1"
                              value={option.MaxAllowed}
                              readOnly
                            />
                            <div className="clear" />
                            <label>Price</label>
                            <input
                              type="text"
                              className="form-control min_max-value my-1"
                              value={option.Price}
                              readOnly
                            />

                            <div className="clear" />
                            <label style={{ marginTop: "4px" }}>Is Default</label>
                            <input
                              id={`chkModifierOption_Default_${option.Id}`}
                              type="checkbox"
                              style={{
                                marginTop: "4px",
                                cursor: "pointer",
                                width: "25px",
                              }}
                              className={`DefaultMOCheckboxClass_${option.ProductModifierId}`}
                              checked={!!option.IsDefaultPreSelectedOption}
                              // readOnly
                              onChange={(e) => setModifierDefault(option.Id, e.target.checked)}
                            />
                            <div className="clear" />
                          </div>
                        </div>
                      ))}
                    <div className="type_wrapper-item">
                      <p >
                        <span className="add_item-css">
                          <i className="fa fa-plus pl-0" aria-hidden="true" onClick={() => openModifierOptionModal(0)}></i>
                        </span>
                      </p>

                      {/* Pass the isOpen state and close function to the modal */}
                      {isModifierModalOpen && (
                        <AddModifierModal
                          onClose={closeModifierOptionModal}

                          productId={productId}
                          modifiedProductId={Id}
                          setLoading={setLoading}
                          mode={2}
                        />
                      )}

                      {isOptionModal && (
                        <ModifierOptionModal
                          isOpen={isOptionModal}
                          onClose={closeModifierOptionModal}
                          productId={productId}
                          modifiedProductId={Id}
                          setLoading={setLoading}
                          // mode={1}
                          optionId={optionId}
                          editOption={editOption}
                          setEditOption={setEditOption}
                        />
                      )}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default TimelineItem;
