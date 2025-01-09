import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const PaymentMethod: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");
  // const wpToken = localStorage.getItem("guest_wptoken");

  // Fetch Restaurant data
  const fetchRestaurantInfo = async () => {
    const wpToken = localStorage.getItem("guest_wptoken");

    if (!wpToken) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/customer/restaurant/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${wpToken}`,
        },
      });

      const data = await response.json();

      if (data.status === 1) {
        setRestaurantInfo(data.data.restaurantData);
      } else {
        setError("Failed to fetch restaurant info");
      }
    } catch (err: any) {
      setError("Something went wrong while fetching restaurant info");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchRestaurantInfo();
  }, []);
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div id="LocationDetailsMobileView" className="">
      <div className="user-detail">
        <div className="container-fluid px-0">
          <div className="user-row">
            <div className="user-col1">
              <div className="inner-div">
                <div id="RestaurantImage" className="home-icon">
                  {loading ? (
                    <Skeleton circle width={68} height={67} />
                  ) : (
                    <img
                      src={restaurantInfo?.RestaurantIconImage_URL}
                      alt="Restaurant"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="user-col2">
              <div className="user-div">
                <h5 className="name-div">{restaurantInfo?.TradingName}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="PaymentMethodsMobileView" className="">
        {/* payment-detail */}
        <div className="payment-detail">
          <div className="container-fluid">
            <div className="payment-text">
              <h6>
                <span>
                  Cash
                </span>
              </h6>
              <h6>
                <span>
                  Online Payment
                </span>
              </h6>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PaymentMethod;
