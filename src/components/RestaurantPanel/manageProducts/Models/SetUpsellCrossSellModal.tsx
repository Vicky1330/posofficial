import { useLayoutEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

interface SetUpsellCrossSellModalProps {
  show: boolean;
  onClose: () => void;
  productId: number;
}

const SetUpsellCrossSellModal: React.FC<SetUpsellCrossSellModalProps> = ({
  show,
  onClose,
  productId,
}) => {
  const [selectedLinkingType, setSelectedLinkingType] = useState<string>("0");
  const UserToken_Global = localStorage.getItem("authToken");

  const handleRadioChange = (value: string) => {
    setSelectedLinkingType(value);
    console.log("Selected Linking Type:", value);
  };

  const fetchDescription = async () => {
    if (!productId) {
      console.warn("Product ID is not available.");
      return;
    }

    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }api/get/upsell/by/product/linking/type?upsellByProductRowId=${productId}&restaurantLoginId=${0}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);

      if (response.status === 200 && response.data.status === 1) {
        const linkingType =
          response.data.data.product_LinkingType.ProductLinkingTypeId || "0";
        setSelectedLinkingType(linkingType);
      } 
    } catch (error) {
      console.error("Error fetching linking type:", error);
    }
  };

  useLayoutEffect(() => {
    if (show && productId) {
      fetchDescription();
    }
  }, [show, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ProductLinkingTypeId: selectedLinkingType,
      Id: productId,
      RestaurantLoginId: 0,
    };

    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }api/restaurant/update/upsell/product/linking/type`;

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
          theme: "colored",
          transition: Bounce,
        });

        onClose();
      } else {
        toast.error("Failed to update linking type.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error updating linking type:", error);
      toast.error("Error updating linking type.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
      dialogClassName="z-50 relative"
      contentClassName="p-0 bg-white rounded-md"
      className="advance-btn-modal"
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body className="pb-0">
          <div className="row mb-3">
            <label htmlFor="upsellLinkingType" className="ps-0">
              Set Upsell/Cross-Sell
            </label>
            <div className="form-check form-check-inline col">
              <input
                className="form-check-input"
                type="radio"
                name="upsellLinkingType"
                id="upsellLinkingType0"
                value="0"
                checked={selectedLinkingType === "0"}
                onChange={(e) => handleRadioChange(e.target.value)}
              />
              <label className="form-check-label" htmlFor="upsellLinkingType0">
                Upsell (Replace)
              </label>
            </div>
            <div className="form-check form-check-inline col">
              <input
                className="form-check-input"
                type="radio"
                name="upsellLinkingType"
                id="upsellLinkingType1"
                value="1"
                checked={selectedLinkingType === "1"}
                onChange={(e) => handleRadioChange(e.target.value)}
              />
              <label className="form-check-label" htmlFor="upsellLinkingType1">
                Cross-Sell (Combine)
              </label>
            </div>
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

export default SetUpsellCrossSellModal;
