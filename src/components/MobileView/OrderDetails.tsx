import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import Swal from "sweetalert2";
// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from "../Checkout/CheckoutForm";

// // Load stripe key 
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface ModifierOption {
  ProductModifierOptionName: string;
  ProductModifierOptionPrice: number;
  Quantity: number
}

interface Modifier {
  ProductModifierName: string;
  ModifierOptionList: ModifierOption[];

}

interface CartItem {
  CartItemRowId: number;
  ProductId: number;
  Name: string;
  Quantity: number;
  FinalProductAmount: number;
  ModifierList: Modifier[];
  ProductTypeId: number;
}

const OrderDetails: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { restaurantName } = useParams<{ restaurantName: string }>();

  // fetch cart data function
  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('guest_wptoken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/customer/cart/item/list`,
        { headers }
      );
      setCartItems(response.data.data.cartItemList);
      console.log("Cart Items:", response.data.data.cartItemList)
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem('guest_wptoken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/customer/cart/remove/item/all`,
        {},
        { headers }
      );

      if (response.data.status === 1) {
        setCartItems([]);
        Swal.fire({
          icon: 'success',
          title: 'Cart Cleared',
          text: 'All items have been removed from your cart.',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to clear cart. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error while clearing cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while clearing the cart.',
        confirmButtonText: 'OK',
      });
    }
  };

  // handle quantity change
  const handleQuantityChange = async (quantity: number, cartItemId: number, productTypeId: number) => {
    try {
      const token = localStorage.getItem('guest_wptoken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/customer/cart/item/update/quantity`,
        { cartItemId, productTypeId, quantity },
        { headers }
      );

      if (response.data.status === 1) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.CartItemRowId === cartItemId
              ? { ...item, Quantity: quantity }
              : item
          )
        );
        console.log("Quantity updated successfully");
      } else {
        console.error("Error updating quantity:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // remove cart items
  const handleRemoveProduct = async (cartItemId: number, productTypeId: number) => {
    try {
      const token = localStorage.getItem('guest_wptoken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/customer/cart/remove/item`,
        { cartItemId, productTypeId },
        { headers }
      );

      if (response.data.status === 1) {
        setCartItems((prevCartItems) =>
          prevCartItems.filter(item => item.CartItemRowId !== cartItemId)
        );
        console.log("Product removed successfully");
      } else {
        console.error("Error removing product from cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleCompleteOrder = () => {
    console.log("Complete order clicked");
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <div id="MobilePartialViewLayout">
      <div id="divmainSectionMobileView">
        <div id="MyOrder_MobileView">
          <div id="mainSectionCartPageMobileView">
            <div className="clear-btn">
              {cartItems.length > 0 && (
                <a onClick={handleClearAll}>
                  <h6>
                    <i className="fa fa-close"></i> CLEAR ALL
                  </h6>
                </a>
              )}
            </div>

            {/* Order Table Price */}
            <div className="price-box-order" id="divCartItemsListMobileView">
              <div className="container-fluid scroll-color-cart px-0 mb-3" style={{ overflowY: "auto", border: "1px solid #e1dddd" }}>
                {loading ? (
                  <div>
                    <img
                      src="/Content/MobileView/Images/mobileView_loader.gif"
                      alt="Loader"
                      className="w-2"
                      style={{
                        alignItems: "center",
                        position: "fixed",
                        top: "50%",
                        width: "15%",
                        left: "40%",
                      }}
                    />
                  </div>
                ) : cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div className="div-flex" key={item.CartItemRowId}>
                      <div className="boxOne">
                        <div className="price-container">
                          <div className="price-row">
                            <div className="price-col">
                              <span className="number-add">
                                <select
                                  className="form-control input-value"
                                  value={item.Quantity}
                                  onChange={(e) => handleQuantityChange(Number(e.target.value), item.CartItemRowId, item.ProductTypeId)}
                                >
                                  {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                              </span>
                            </div>
                            <div
                              id={`CartItemId_${item.CartItemRowId}`}
                              data-id={`cartItemId_${item.CartItemRowId}`}
                              onClick={() => handleRemoveProduct(item.CartItemRowId, item.ProductTypeId)}
                              className="price-col1"
                            >
                            <h6>{item.Name}</h6>
                            <span>Quantity: {item.Quantity}</span>

                              {/* Display modifiers */}
                              {item.ModifierList && item.ModifierList.length > 0 && item.ModifierList.map((modifier, index) => (
                                modifier.ModifierOptionList && modifier.ModifierOptionList.length > 0 && (
                                  <div key={index}>
                                    <strong>{modifier.ProductModifierName}</strong>
                                    <ul>
                                      {modifier.ModifierOptionList.map((option, optionIndex) => (
                                        <li key={optionIndex}>
                                          {option.ProductModifierOptionName} - ${option.ProductModifierOptionPrice}X{option.Quantity}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )
                              ))}

                            </div>
                            <div className="price-col price-col-right ml-2">
                              <span className="price-add">
                                ${item.FinalProductAmount * item.Quantity}
                              </span>
                              <span
                                className="price-remove"
                                onClick={() => handleRemoveProduct(item.CartItemRowId, item.ProductTypeId)}
                                style={{ cursor: "pointer", color: "#4caf50", marginLeft: "7px" }}
                              >
                                <i className="fa fa-close"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="flex items-center justify-center font-bold text-xl">No items in cart</p>
                )}
              </div>
            </div>

            {/* <div className="checkout-form-container">
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div> */}

            {/* Product Footer Order */}
            <div className="modal-footer z-1 ">
              <div className="footer-row w-full">
                <div className="w-full flex justify-between py-0">
                  <Link
                    to={`/${restaurantName}/location-info/payment-method`}
                    className="col-6 text-center btn btn-success rounded-0"
                    onClick={handleCompleteOrder}
                  >
                    <div className="price-bx">
                      <div className="text-ne">GST Included</div>
                      <div className="text-price" id="divSubTotalPriceMobileView">
                        ${cartItems.reduce((total, item) => total + (item.FinalProductAmount * item.Quantity), 0).toFixed(2)}
                      </div>
                    </div>
                  </Link>
                  <Link
                    to={`/${restaurantName}/confirm-order`}
                    className="col-6 text-center btn btn-success rounded-0"
                    onClick={handleCompleteOrder}
                  >
                    <h4>Complete Order</h4>
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
