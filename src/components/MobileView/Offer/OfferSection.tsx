import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface PromoCode {
  Id: number;
  Name: string;
  PromoCode: string;
  DiscountValue: number;
  DiscountValueTypeId: number;
  PriorityNumber: number;
  IsApplied: number;
}

// offer section ..
const OfferSection: React.FC = () => {

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const wpToken = localStorage.getItem('guest_wptoken');

  const fetchPromoCodes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/customer/restaurant/promocode/list`,
        {
          headers: {
            Authorization: `Bearer ${wpToken}`,
          },
        }
      );

      // Handle the successful response
      if (response.data.status === 1 && response.data.data.promocodeList) {
        setPromoCodes(response.data.data.promocodeList);
      } else {
        setError(response.data.message || "Failed to fetch promo codes.");
      }
    } catch (err) {
      setError("There was an error fetching the promo codes.");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoApply = async (promoCode: PromoCode) => {
    const wpToken = localStorage.getItem('guest_wptoken');

    if (!wpToken) {
      console.error("Token is missing");
      return;
    }

    const payload = {
      promocodeId: promoCode.Id,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/customer/cart/apply/promocode`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${wpToken}`,
          },
        }
      );

      if (response.data.status === 1) {
        Swal.fire({
          title: 'Success!',
          text: 'Promo code applied successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        });

        setPromoCodes((prevPromoCodes) =>
          prevPromoCodes.map((promo) =>
            promo.Id === promoCode.Id
              ? { ...promo, IsApplied: 1 } 
              : promo
          )
        );

      } else if (response.data.status === -1) {
        Swal.fire({
          title: 'Error!',
          text: response.data.message || 'Sorry, promocode already applied!',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message || 'Failed to apply promo code.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error applying the promo code.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handlePromoRemove = (id: number) => {
    console.log(`Promo removed for ID: ${id}`);
  };


  if (loading) {
    return <div>
      <img src="/Content/MobileView/Images/mobileView_loader.gif" alt="Loader" className="w-2" style={{
        alignItems: "center",
        position: "fixed",
        top: "50%",
        width: "15%",
        left: "40%",
      }} />
    </div>;
  }

  return (
    <div id="OfferMobileView">
      <div className="offer-section phone-offer">
        <div className="container-fluid">
          <div className="side-row">
            <div className="row PromocodeMainareaMobileView">
              {error && <div className="error-message">{error}</div>}
              {!loading && !error && promoCodes.map((promo) => (
                <div key={promo.Id} className="col-md-4 col-sm-6 col-xs-12 mb-3">
                  <div className="img-box">
                    <img
                      src="../../Content/Customer_New/img/burger.png"
                      alt={promo.Name}
                    />
                    <div className="center-box">
                      <div id={`Promocodearea_${promo.Id}`}>
                        <h5>{promo.Name}</h5>
                        <h6>
                          Enjoy your meal with a {promo.DiscountValue}% discount on us!
                        </h6>

                        {promo.IsApplied === 0 ? (
                          <a
                            id={`Acceptedoffer_${promo.Id}`}
                            className="Acceptedoffer"
                            onClick={() => handlePromoApply(promo)}
                          >
                            Apply
                          </a>
                        ) : (
                          <>
                            <a
                              id={`RemoveAcceptedoffer_${promo.Id}`}
                              className="RemoveAcceptedoffer mr-3"
                              onClick={() => handlePromoRemove(promo.Id)}
                            >
                              Remove
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
