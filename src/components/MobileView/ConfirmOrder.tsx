import React, { useState, useEffect } from "react";
import { Form} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

interface RestaurantSettings {
  Id: number;
  RestaurantLoginId: number;
  AllowUserAppToPlaceTheDeliveryOrder: number;
  MinimumCharge_Delivery: number;
  AllowCashOnDelivery: number;
  AutoAcceptPaidOrder_Delivery: number;
  EstimatedTime_Delivery: number;
  EstimatedTimeTypeId_Delivery: number;
  SuggestedTip: number;
  TipAmount_1: number;
  TipAmount_2: number;
  TipAmount_3: number;
  AllowScheduleOrder: number;
  RequirePaymentWhenPlacingOrder: number;
  BannerColor: string;
  MinOrderNumber: number;
  MaxOrderNumber: number;
  AllowUserAppToPlaceThePickupOrder: number;
  AllowCashOnPickup: number;
  AutoAcceptPaidOrder_Pickup: number;
  EstimatedTime_Pickup: number;
  EstimatedTimeTypeId_Pickup: number;
  LogoImage: string;
  SetProductViewType: number;
  CreatedOn: string;  // Date in ISO string format
  CreatedByLoginId: number;
  UpdatedOn: string;  // Date in ISO string format
  UpdatedByLoginId: number;
}


const ConfirmOrder: React.FC = () => {

  const [cartDetails, setCartDetails] = useState<any>(null);
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [countryPhoneCode, setCountryPhoneCode] = useState("");
  const countryPhoneCode = "";
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const wpToken = localStorage.getItem("guest_wptoken");
  // const [orderTime, setOrderTime] = useState('');
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [storeQR_SettingsData, setStoreQR_SettingData] = useState<RestaurantSettings | null>(null)
  // const [scheduleDate, setScheduleDate] = useState('');
  // const [scheduleTime, setScheduleTime] = useState('');
  const navigate = useNavigate();

  // fetch cart details
  const fetchCartDetails = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}api/customer/cart/checkout/detail`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${wpToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const cartDetails = response.data.data.cartDetail;
        setCartDetails(response.data.data);
        setSelectedOption(cartDetails.IsScheduledOrder);
        setStoreQR_SettingData(response.data.data.storeQR_SettingsData);

      } else {
        setError("Failed to fetch cart details");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error("Error fetching cart details:", err);
    } finally {
      setLoading(false);
    }
  };

  // validate input fields
  const validateName = () => {
    if (!customerName.trim()) {
      setNameError("Name is required.");
      return false;
    }
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(customerName)) {
      setNameError("Name should contain only alphabets.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhoneNumber = () => {
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required.");
      return false;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phoneNumber)) {
      setPhoneError("Please enter a valid phone number.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };



  // Submit Order Function
  const submitOrder = async () => {

    if (!validateName() || !validatePhoneNumber() || !validateEmail()) {
      return; 
    }
    
    const requestPayload = {
      paymentTypeId: 1,
      customerName,
      email,
      phoneNumber_Only: phoneNumber,
      countryPhoneCode_Only: countryPhoneCode,
    };

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}api/customer/submit/order`;

      const response = await axios.post(apiUrl, requestPayload, {
        headers: {
          Authorization: `Bearer ${wpToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("response", response);

      if (response.status === 200) {

        localStorage.removeItem("wp_orderType");

        Swal.fire({
          title: "Success!",
          text: "Your order has been submitted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        navigate(`/${restaurantName}/order-placed`);

      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an issue submitting your order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, [wpToken]);


  // const validateNameForMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  // };

  // const validatePhoneNumberForMobile = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   console.log(e.target.value);
  // };

  // const isNumberKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   const charCode = e.charCode || e.keyCode;
  //   return charCode >= 48 && charCode <= 57;
  // };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="MobilePartialViewLayout" className="">
      <div className="bg-body">
        <div id="divmainSectionMobileView">
          <div id="ConfirmOrderMobileView" className="">
            <div id="mainSectionConfirmOrderPage">
              <div className="confirm-order-all-box pb-5">

                <div className="product-order-list">
                  <h4>ORDER LIST</h4>
                  <div className="container-fluid px-0">
                    <div className="row">
                      <table
                        className="table mb-0"
                        id="tbodyCartListItemMobileView"
                      >
                        <thead>
                          <tr>
                            <th scope="col">Product Name</th>
                            <th scope="col" className="text-right">
                              Qty
                            </th>
                            <th scope="col" className="text-right">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            cartDetails?.cartDetail?.CartProductItem_List?.length > 0 &&
                            cartDetails.cartDetail.CartProductItem_List.map((item: any) => (
                              <tr key={item.CartItemRowId}>
                                <td className="product">{item.Name}</td>
                                <td className="text-right">{item.Quantity}</td>
                                <td className="text-right">${item.FinalProductAmount}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <table className="table border">
                        <tbody>
                          <tr>
                            <td colSpan={2}>Subtotal (Inclusive GST)</td>
                            <td
                              className="text-right"
                              id="divSubTotalPriceConfirmOrderPageMobileView"
                            >
                              ${cartDetails.cartDetail.SubTotal_Amount}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={2}
                              id="divDiscoutTotalPriceMobileViewHeader"
                              className="d-none"
                            >
                              Discount Total
                            </td>
                            <td
                              className="text-right d-none"
                              id="divDiscoutTotalPriceMobileView"
                            ></td>
                          </tr>
                          <tr id="mob_del_fee_hide" className="d-none">
                            <td colSpan={2} id="divDeliveryFeeMobileViewHeader">
                              Delivery Fee
                            </td>
                            <td
                              className="text-right d-none"
                              id="divDeliveryFeeMobileView"
                            ></td>
                          </tr>
                          <tr>
                            <td colSpan={2}>GST Tax</td>
                            <td
                              className="text-right"
                              id="divGstPriceMobileView"
                            >
                              ${cartDetails.cartDetail.TotalGST_Amount}
                            </td>
                          </tr>
                          <tr id="trTipAmount_Mobile" className="d-none">
                            <td colSpan={2} id="divTipMobileViewHeader">
                              Tip
                            </td>
                            <td
                              className="text-right"
                              id="divTipMobileView"
                            ></td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="totalprice">
                              Total (Inclusive GST)
                            </td>
                            <td
                              className="text-right totalprice"
                              id="divTotalPriceConfirmOrderPageMobileView"
                            >
                              ${cartDetails.cartDetail.GrandTotal_Amount}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="conf-service OrderTypeMobile">
                  <div className="card-box mt-space">
                    <div className="row mx-0">
                      <div className="col-12 px-0">
                        <div className="cart-service">
                          <h5>Order Type</h5>

                          <form>
                            {/* <div
                              className="radio-service"
                              id="delivery_mobile_block"
                            >
                              <label>
                                <input
                                  type="radio"
                                  id="mob_delivery"
                                  // service class is not working in Iphone
                                  //   className="service "  
                                  className=" custom-radio-size"
                                  name="fav_language"
                                />
                                <span>Delivery</span>
                              </label>
                              <br />
                            </div> */}
                            <div
                              className="radio-service"
                              id="pickup_block_mobile"
                              style={{ display: "block" }}
                            >
                              <label
                                data-toggle="modal"
                                data-target="#staticbackConfirmOrder"
                              >
                                <input
                                  type="radio"
                                  className=" custom-radio-size"
                                  id="mob_pickup"
                                  name="fav_language"
                                  value="2"
                                  checked
                                />
                                <span>Pickup</span>
                              </label>
                              <br />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="add-order-sign">
                  <h5>DETAILS</h5>
                  <div className="container-fluid">
                    <form>
                      <div className="row">
                        <div className="col-12 mb-3 px-0">
                          <input
                            type="text"
                            className="form-control"
                            id="txtNameMobileView"
                            placeholder="Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                          {nameError && (
                            <div
                              id="name_error_CustomerFormMobileView"
                              className="errors !pl-0"
                              style={{ color: "red" }}
                            >
                              {nameError}
                            </div>
                          )}
                        </div>

                        <div className="col-12  mb-3 px-0 ">
                          <div className="phone">
                            <input
                              type="tel"
                              id="txtPhoneNumberMobileView"
                              required
                              className="phone-box"
                              placeholder="Phone Number"
                              name="name"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </div>

                          {phoneError && (
                            <div
                              id="phoneNumber_error_CustomerFormMobileView"
                              className="errors"
                              style={{ color: "red" }}
                            >
                              {phoneError}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 px-0">
                          <input
                            type="email"
                            className="form-control"
                            id="txtEmailMobileView"
                            placeholder="E-Mail Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          {emailError && (
                            <div
                              id="email_error_CustomerFormMobileView"
                              className="errors"
                              style={{ color: "red" }}
                            >
                              {emailError}
                            </div>
                          )}
                        </div> 
                        <div className="col-12 my-3 px-0 d-none">
                          <a
                            href="#"
                            onClick={() => console.log("Show address view")}
                            className=" py-2 btn btn-success btn-block font-weight-bold"
                          >
                            ADD/CHANGE ADDRESS
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* <div className="cart-service px-3 mt-3">
                  <h5
                    className="Offercard font-weight-bold d-flex align-items-center justify-content-between"
                    style={{
                      background: "#dc3545",
                      borderColor: "#dc3545",
                    }}
                  >
                    <p className="select-card-offer p-1 text-white px-3 mb-0">
                      <i className="fa fa-star mr-2"></i>
                      <span>Select offer</span>
                    </p>
                  </h5>

                  <div className="card card-body PromoCodeapply">
                    <InputGroup className="mb-3">
                      <Form.Control
                        id="MobileViewApplyPromoCode"
                        placeholder="Enter PormoCode"
                        aria-label=""
                        aria-describedby="ExternalPromoCode"
                      />
                      <InputGroup.Text
                        id="ExternalPromoCode"
                        className="bg-primary text-light"
                        onClick={getPromoDetailsWithPromoCode}
                      >
                        Apply
                      </InputGroup.Text>
                    </InputGroup>
                  </div>

                </div> */}

                {/* Delivery Address */}
                {/* <div className="product-order-list"
                    id="divfor_deliveryaddressmobile"
                  >
                    <h4>Delivery Address</h4>
                    <div className="container-fluid px-0">
                      <div className="row">
                        <div className="mobile_Deliveryaddress">
                          <div
                            className="mobiledelivery-address"
                            style={{ marginLeft: "10px" }}
                          >
                            Silverdale, New Zealand
                            <span
                              className="order-type-id"
                              style={{ display: "none" }}
                            >
                              3
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                <div className="card-contactless-order  contactless-apply d-none">
                  <div className="card-header  bg-danger">
                    <i className="fa fa-star mr-2" /> Select Offer
                  </div>
                  <div className="card-apply">
                    <span>
                      <input type="text" placeholder="Enter offer code" />
                      <a className="btn btn-primary px-4 apply" href="#">
                        Apply
                      </a>
                    </span>
                  </div>
                </div>

                <div className="payment-cart"
                  id="order_time_mobile"
                  style={{ display: "block" }}
                >
                  <div className="row">
                    <div className="col-12 px-0 ">
                      <div className="cart-service">
                        <h5 className=" font-weight-bold">Order Time</h5>
                        <form>
                          <div key="reverse-radio " className="mb-3">
                            <div className="flex radio-service pl-3 gap-2 py-2">
                              <Form.Check
                                reverse
                                name="group1"
                                type="radio"
                                id="reverse-radio-1"
                                value={"1"}
                                className={`custom-radio-size  ${
                                  selectedOption === 0
                                    ? "active-option"
                                    : ""
                                }`}
                                onChange={() => setSelectedOption(0)}
                                checked={selectedOption === 0}
                              />
                              <span className="text-[14px]">Now</span>
                            </div>
                            <div className="flex radio-service pl-3 gap-2 py-2">
                              <Form.Check
                                reverse
                                name="group1"
                                type="radio"
                                id="reverse-radio-2"
                                value={"2"}
                                className={`custom-radio-size ${
                                  selectedOption === 1
                                    ? "active-option"
                                    : ""
                                }`}
                                onChange={() => setSelectedOption(1)}
                                checked={selectedOption === 1}
                              />
                              <span>Later</span>
                            </div>
                          </div>
                          <div
                            className="radio-time d-none"
                            id="PickupOptionScheduledOrderMobileView"
                            style={{ display: "flex", padding: "3px" }}
                          >
                            <label
                              className="label1"
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="currentColor"
                                className="bi bi-calendar"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h9V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                              </svg>
                              <input
                                type="text"
                                className="ml-1"
                                id="DateScheduleOrderMobileView"
                                style={{
                                  width: "100%",
                                  border: "none",
                                  wordSpacing: "2px",
                                }}
                                readOnly
                              />
                            </label>
                            <label
                              className="label1"
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="currentColor"
                                className="bi bi-clock"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 3.5a.5.5 0 0 1 .5.5v4.293l3.146 3.147a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1-.146-.354V4a.5.5 0 0 1 .5-.5z" />
                                <path d="M8 1a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 1a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
                              </svg>
                              <input
                                type="text"
                                className="ml-1"
                                id="TimeScheduleOrderMobileView"
                                name="appt"
                                min="09:00"
                                style={{
                                  width: "100%",
                                  border: "none",
                                  wordSpacing: "2px",
                                }}
                                max="18:00"
                                readOnly
                              />
                            </label>
                            <br />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payment-cart paymenthead" id="payment_block">
                  <div className="row">
                    <div className="col-12 px-0 ">
                      <div className="cart-service" id="cart_service_payment">
                        <h5
                          className=" font-weight-bold d-flex align-items-center justify-content-between"
                          id="card_payment"
                          style={{ display: "none" }}
                        >
                          Select Payment
                        </h5>
                        <form id="payment_Types_TableQR">
                          <div
                            className="radio-service"
                            id="MobileCash"
                            style={{}}
                          >
                            <label>
                              <input
                                type="radio"
                                className="custom-radio-size payment_optionMobile "
                                id="cashondelivery_mobile"
                                name="payment_option"
                                value={1}
                                checked
                              />
                              <span>Cash</span>
                            </label>
                            <br />
                          </div>
                          {/* <div
                            className="radio-service"
                            id="MobileOnline"
                            style={{}}
                          >
                            <label>
                              <input
                                type="radio"
                                className="custom-radio-size payment_optionMobile "
                                id="onlinepayment_mobile"
                                name="payment_option"
                                Value={2}
                              />
                              <span>Online Payment</span>
                            </label>
                            <br />
                          </div> */}
                          <div
                            className="radio-service d-none"
                            id="PayAtCounter"
                          >
                            <label>
                              <input
                                type="radio"
                                className="service payment_optionMobile "
                                id="PayAtCounter_TableQR"
                                name="payment_option"
                                defaultValue={5}
                              />
                              <span>PayAtCounter</span>
                            </label>
                          </div>
                          <div className="radio-service d-none">
                            <label>
                              <input
                                type="radio"
                                className="service"
                                name="payment_option"
                              />
                              <span> Credit/Debit Card at Delivery </span>
                            </label>
                            <br />
                          </div>
                        </form>
                      </div>
                      <div
                        id="PaymentModeMessage_ForMobile"
                        style={{
                          color: "red",
                          fontSize: "15px",
                          textAlign: "center",
                          display: "none",
                        }}
                      />
                      <div
                        id="PaymentTypeMessage_ForMobile"
                        style={{
                          color: "red",
                          display: "none",
                          textAlign: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="card-percentage co-percentage pb-4"
                  id="div_tip_mview"
                >
                  <div className="card-header">WOULD YOU LIKE TO ADD TIP?</div>
                  <div className="card-body p-0" id="tip_card_body">
                    <div
                      className="cart-body-box bg-white"
                      id="suggested_Tip_MobileView"
                    >
                      <div className="input-box" id="tipamount_div_1_mobile">
                        <label>
                          <input
                            type="checkbox"
                            name="tip-radio-input-mobile"
                            className="tip-checkbox-mobile"
                            id="tip_checkbox_1_mobile"
                            // data-tip={storeQR_SettingsData?.TipAmount_1}
                          />
                          <span id="TipAmount_1_Data_Mobile">{storeQR_SettingsData?.TipAmount_1}%</span>
                        </label>
                      </div>
                      <div className="input-box" id="tipamount_div_2_mobile">
                        <label>
                          <input
                            type="checkbox"
                            name="tip-radio-input-mobile"
                            className="tip-checkbox-mobile"
                            id="tip_checkbox_2_mobile"
                            // data-tip={storeQR_SettingsData?.TipAmount_2}
                          />
                          <span id="TipAmount_2_Data_Mobile">{storeQR_SettingsData?.TipAmount_2}%</span>
                        </label>
                      </div>
                      <div className="input-box" id="tipamount_div_3_mobile">
                        <label>
                          <input
                            type="checkbox"
                            name="tip-radio-input-mobile"
                            className="tip-checkbox-mobile"
                            id="tip_checkbox_3_mobile"
                            // data-tip={storeQR_SettingsData?.TipAmount_3}
                          />
                          <span id="TipAmount_3_Data_Mobile">{storeQR_SettingsData?.TipAmount_3}%</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer z-1 ">
                <div className="footer-row w-full">
                  <div className="w-full flex justify-between  py-0">
                    <a
                      href="#"
                      className="col-6 text-center btn btn-success rounded-0 "
                    >
                      <div className="price-bx">
                        <div className="text-ne">GST Included</div>
                        <div
                          className="text-price"
                          id="totalPriceConfirmOrderPageMobileView"
                        >
                          ${cartDetails.cartDetail.GrandTotal_Amount}
                        </div>
                      </div>
                    </a>
                    <Link
                      to={`/${restaurantName}/submit-order`}
                      className="col-6 text-center btn btn-success rounded-0"
                      id="BtnSubmitOrderMobileView"
                      onClick={(e) => {
                        e.preventDefault();
                        submitOrder();
                      }}
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
    </div>
  );
};

export default ConfirmOrder;
