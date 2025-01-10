import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

interface ProductDescriptionModalProps {
  show: boolean;
  onClose: () => void;
  productId: number;
}

const ProductDescriptionModal: React.FC<ProductDescriptionModalProps> = ({
  show,
  onClose,
  productId,
}) => {
  const [description, setDescription] = useState<string>("");
  const UserToken_Global = localStorage.getItem("authToken");

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };
  const fetchData = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }api/get/upsell/by/product/description?upsellByProductRowId=${productId}&restaurantLoginId=${0}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        setDescription(response.data.data.product_description.Description);
      } else {
        toast.error(response.data.message, {
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
    } catch (error) {
      console.log("Error", error);
      toast.error("Error fetching description", {
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
  };

  useEffect(() => {
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description) {
      toast.error("Please enter a product description!", {
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
      return;
    }

    const payload = { description, Id: productId, RestaurantLoginId: 0 };

    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }api/restaurant/update/upsell/by/product/description`;
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        toast.success(response.data.message, {
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
        // setDescription("");
        onClose();
      } else {
        toast.error(response.data.message, {
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
    } catch (error) {
      console.log("Error", error);
      toast.error("Error updating description", {
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
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      centered
      dialogClassName="modal-dialog modal-lg"
      contentClassName=" p-0"
      className=" advance-btn-modal p-0"
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body className="pb-0">
          <div className="form-group">
            <label htmlFor="productDescription">
              Description of Upsell Product
            </label>
            <textarea
              className="form-control"
              id="productDescription"
              rows={3}
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="pro-submit" type="submit">
            Submit
          </Button>
          <Button className="pro-cancel" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ProductDescriptionModal;
