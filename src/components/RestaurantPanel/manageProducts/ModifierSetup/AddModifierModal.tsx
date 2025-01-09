import axios from "axios";
import React, { useEffect} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { Modal, InputGroup, FormControl } from "react-bootstrap";

type Props = {
  onClose: () => void;
  productId: number;
  setLoading: (loading: boolean) => void;
  mode: number;
  modifiedProductId: number;
};

interface FormData {
  id: number;
  productId: number;
  modifierName: string;
  isMandatory: boolean;
  minSelectionValue: number;
  maxSelectionValue: number;
  restaurantLoginId: number;
  mode: number;
}

const AddModifierModal: React.FC<Props> = ({
  onClose,
  productId,
  setLoading,
  mode,
  modifiedProductId,
}) => {
  const global_token = localStorage.getItem("authToken");
  const { register, handleSubmit, setValue} = useForm<FormData>({
    defaultValues: {
      id: 0,
      productId: productId,
      restaurantLoginId: 0,
      mode: mode,
      modifierName: "",
      isMandatory: false,
      minSelectionValue: 0,
      maxSelectionValue: 1,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const finalData = {
      ...data,
      isMandatory: data.isMandatory ? 1 : 0,
    };

    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}api/product/addupdate/modifier`;

      const response = await axios.post(apiUrl, finalData, {
        headers: {
          Authorization: `Bearer ${global_token}`,
          "Content-Type": "multipart/form-data",
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
      }
      else if (response.data.status === 2) {
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
      }
      else {
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
            toast.error("Unauthorized! Invalid Token!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          } else {
            toast.error("There is some technical error, please try again!", {
              position: "top-right",
              autoClose: 3000,
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
      } else {
        toast.error("An unexpected Del error occurred!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }finally {
      setLoading(false);
      onClose();
    }
  };

  const getModifiersData = async (id: number) => {
    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}api/product/single/modifier?modifierId=${id}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const data = response.data.data.modifierData;

        // Dynamically set the form values
        setValue("id", data.Id);
        setValue("productId", data.ProductId);
        setValue("modifierName", data.ModifierName);
        setValue("isMandatory", data.IsMandatory === 1);
        setValue("minSelectionValue", data.MinSelection);
        setValue("maxSelectionValue", data.MaxSelection);
      }
    } catch (error) {
      console.error("Error fetching modifier data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modifiedProductId && modifiedProductId !== 0) {
      getModifiersData(modifiedProductId);
    }
  }, [modifiedProductId]);

  return (
    <Modal
    show={true}
    onHide={onClose}
    keyboard={false}
    backdrop="static"
    centered
    dialogClassName="cstm_modal_dialog mt-5"
    className="advance-btn-modal"
  >
    {/* Modal Header */}
    <Modal.Header className="!m-0 p-0 mx-auto">
      <Modal.Title
        id="heading_Title_AddUpdateModifier_AddProduct_Modal"
        className="mx-auto p-2 pt-3 m-0 modal-title plus_head_popup"
      >
         {mode === 1 ? "Add" : "Update"} Modifier
      </Modal.Title>
    </Modal.Header>

    {/* Modal Body */}
    <form onSubmit={handleSubmit(onSubmit)}>
    <Modal.Body className="new_modal_work">
      <div className="flex flex-col form plus_from_group">
        <label className="lblModifiersSettingClass">Name</label>
        <input

          className="plus_imput_feild w-full p-2 pl-2"
        id="modifierName"
        type="text"
        {...register("modifierName", {
          required: "Please enter modifier name!",
        })}
        placeholder="Enter Modifier Name"
        />
      </div>

      {/* Mandatory Checkbox */}
      <div
        className="form-group plus_from_group"
        style={{ marginTop: "0px", marginBottom: "0px" }}
      >
        <label className="lblModifiersSettingClass">Mandatory</label>
        <p className="mb-0" style={{ textAlign: "left", padding: "0px" }}>
          <label className="switch round_wraps">
            <input
              type="checkbox"
              {...register("isMandatory")}
            />
            <span className="slider round"></span>
          </label>
        </p>
      </div>

      {/* Min and Max Selection Inputs */}
      <div className="flex justify-between mb-2 w-full">
        <div className="plus_from_group  my-1 !mr-1 flex  flex-col justify-start">
          <label className="lblModifiersSettingClass">Min</label>
          <InputGroup className="mb-3 ">
            <FormControl
              type="text"
              disabled
              placeholder="0"
              className="plus_imput_feild IsDecimal w-full p-2 pl-2"
              {...register("minSelectionValue", {
                required: "Minimum selection is required",
                valueAsNumber: true,
              })}
            />
          </InputGroup>
        </div>

        <div className="plus_from_group  my-1 !mr-1 flex  flex-col justify-start">
          <label className="lblModifiersSettingClass">Max</label>
            <input
              type="text"
              placeholder="1"
              className="plus_imput_feild IsDecimal w-full p-2 pl-2"
              {...register("maxSelectionValue", {
                required: "Maximum selection is required",
                valueAsNumber: true,
              })}
            />
        </div>
      </div>
    </Modal.Body>
   
    {/* Modal Footer */}
    <Modal.Footer
      className="pt-0 plus_modal_bottom mx-auto"
      style={{ paddingTop: "15px" }}
    >
      <button
        // variant="danger"
        className=" !bg-[#1b964b] text-white px-4 py-1 rounded-2xl"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        // variant="danger"
        className=" !bg-[#1b964b] text-white px-4 py-1 rounded-2xl"
      type="submit"
      >
        {mode === 1 ? "Add" : "Update"}
      </button>
      </Modal.Footer>
      </form>
  </Modal>
  );
};

export default AddModifierModal;
