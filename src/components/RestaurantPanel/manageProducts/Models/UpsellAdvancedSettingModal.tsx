import { useLayoutEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Bounce, toast } from "react-toastify";
import axios from "axios";

interface UpsellAdvancedSettingModalProps {
  show: boolean;
  onClose: () => void;
  productId: number;
}

const UpsellAdvancedSettingModal: React.FC<UpsellAdvancedSettingModalProps> = ({
  show,
  onClose,
  productId,
}) => {
  const [selectedSetting, setSelectedSetting] = useState<string>("0"); 
  const [visibilityCount, setVisibilityCount] = useState<number>(1); 
  const UserToken_Global = localStorage.getItem("authToken");

  const handleRadioChange = (value: number) => {
    setVisibilityCount(value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSetting(e.target.value);
  };

  const fetchData = async () => {
    if (!productId) {
      console.warn("Product ID is not provided.");
      return;
    }

    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }api/get/upsell/by/product/visibility/data?upsellByProductRowId=${productId}&restaurantLoginId=0`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const { VisibilityCount_ForDecline, VisibilityStatus } =
          response.data.data.upsell_visibility;

        setSelectedSetting(VisibilityCount_ForDecline || "0");
        setVisibilityCount(VisibilityStatus || 1);
      } else {
        toast.error(response.data.message || "Failed to fetch data.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching visibility settings.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  useLayoutEffect(() => {
    if (show && productId) {
      fetchData();
    }
  }, [show, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSetting === "0") {
      toast.error("Please select a visibility count.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    const payload = {
      VisibilityCount_ForDecline: selectedSetting,
      VisibilityStatus: visibilityCount,
      Id: productId,
      RestaurantLoginId: 0,
    };

    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }api/restaurant/add/update/upsell/visibility/data`;

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
          theme: "colored",
          transition: Bounce,
        });
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update settings.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error updating visibility settings.", {
        position: "top-right",
        autoClose: 3000,
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
      <Modal.Body className="pb-0">
        <form onSubmit={handleSubmit}>
          {/* Display Before/After */}
          <div className="row mb-3">
            <label htmlFor="visibilityStatus" className="ps-0">
              Display Before/After
            </label>
            <div className="form-check form-check-inline col">
              <input
                className="form-check-input"
                type="radio"
                name="visibilityStatus"
                id="visibilityStatus1"
                value={1}
                checked={visibilityCount === 1}
                onChange={() => handleRadioChange(1)}
              />
              <label className="form-check-label" htmlFor="visibilityStatus1">
                Before
              </label>
            </div>
            <div className="form-check form-check-inline col">
              <input
                className="form-check-input"
                type="radio"
                name="visibilityStatus"
                id="visibilityStatus2"
                value={2}
                checked={visibilityCount === 2}
                onChange={() => handleRadioChange(2)}
              />
              <label className="form-check-label" htmlFor="visibilityStatus2">
                After
              </label>
            </div>
          </div>

          {/* Don't show if customer declines the offer */}
          <div className="form-group mb-3">
            <label htmlFor="selectedSetting">
              Don't show if the customer declines the offer
            </label>
            <select
              id="selectedSetting"
              className="form-control"
              value={selectedSetting}
              onChange={handleSelectChange}
            >
              <option value="0">Select</option>
              <option value="1">One Time</option>
              <option value="2">Two Times</option>
              <option value="3">Three Times</option>
            </select>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button className="pro-submit bg-[#1b5703]" onClick={handleSubmit}>
          Submit
        </Button>
        <Button className="pro-cancel" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpsellAdvancedSettingModal;
