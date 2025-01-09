import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderPlaced: React.FC = () => {

  const { restaurantName } = useParams<{ restaurantName: string }>();

  return (
    <div className="container body-content ">
      <div className="container main-sectionOrderPlaced">
        <div className="cart-container">
          <div className="ust-div">
            <span>
              <i className="fa fa-check"></i>
            </span>
            <h4>Order placed successfully</h4>
            <p>Thanks for placing the order.</p>
            {/* <h6 style={{ fontWeight: "bold" }}>Order Id : W-2</h6> */}
            <Link
              to={`/${restaurantName}/departments`}
            >
              <button
                className="btn btn-outline-secondary continue_wrap-button"
                type="button"
              >
                EXPLORE MENU
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
