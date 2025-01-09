import React, { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ChooseDeliveryPickup from "../Modals/ChooseDeliveryPickup";
import PickupModal from "../Modals/DepartmentList/PickupModal";
import DeliveryModal from "../Modals/DeliveryModal";

const MobileFooter: React.FC = () => {
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const [PickupType, setPickupType] = useState<string>("");
  const [showPickupDeliverModal, setShowPickupDeliverModal] = useState<boolean>(false);
  const [showDeliveryModal, setShowDeilveryModal] = useState<boolean>(false);
  const location = useLocation();
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [showFooter, setShowFooter] = useState(true);

  useLayoutEffect(() => {
    const routesToHideFooter = [
      `^/${restaurantName}/add/comboItems/\\d+$`,
      `^/mobile/confirm-order$`,
      `^/${restaurantName}/addToCart/\\d+$`,
      `^/${restaurantName}/order-details`,
      `^/${restaurantName}/confirm-order`,
    ];

    const isMatchedRoute = routesToHideFooter.some((pattern) =>
      new RegExp(pattern).test(location.pathname)
    );

    setShowFooter(!isMatchedRoute);
  }, [location.pathname, restaurantName]);

  return (
    <div className={`footer-detail-fixed ${showFooter ? "" : "hidden"}`}>

      {showPickupDeliverModal &&
        <ChooseDeliveryPickup
        goBack={()=>{
          setShowPickupDeliverModal(false);
          // setShowPickupModal(true);
        }}
        />
      }
      <DeliveryModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeilveryModal(false)}
      />

      <div className="footer-icon-text pt-0 pb-1">
        <div className="container-fluid px-0 ">
          <div
            id="footerMenuBarSimpleOrderCustomerView"
            className="flex justify-around"
          >
            <Link id="footer_redirect" to={`/${restaurantName}/Customer/Index`}>
              <div className="col flex flex-col justify-center items-center">
                <svg
                  height="200px"
                  width="200px"
                  version="1.1"
                  id="_x32_"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                  fill="#000000"
                >
                  <g>
                    <polygon
                      fill="#000000"
                      points="434.162,293.382 434.162,493.862 308.321,493.862 308.321,368.583 203.682,368.583 203.682,493.862 77.841,493.862 77.841,293.382 256.002,153.862"
                    ></polygon>
                    <polygon
                      fill="#000000"
                      points="0,242.682 256,38.93 512,242.682 482.21,285.764 256,105.722 29.79,285.764"
                    ></polygon>
                    <polygon
                      fill="#000000"
                      points="439.853,18.138 439.853,148.538 376.573,98.138 376.573,18.138"
                    ></polygon>
                  </g>
                </svg>
                <h6 className="font-semibold" style={{}} >HOME</h6>
              </div>
            </Link>

            <Link
              to={`/${restaurantName}/departments`}
            >
              <div className="col flex flex-col justify-center items-center">
                <svg
                  fill="#000000"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="796 796 200 200"
                  enableBackground="new 796 796 200 200"
                  xmlSpace="preserve"
                >
                  <g>
                    <path d="M886.471,796.396c-4.926,0-8.917,3.993-8.917,8.919v7.085v39.987c0,3.571-2.896,6.465-6.464,6.465 c-3.57,0-6.465-2.894-6.465-6.465v-45.525v-1.547c0-4.926-3.993-8.919-8.917-8.919c-4.928,0-8.92,3.993-8.92,8.919v1.547v45.525 c0,3.57-2.895,6.464-6.463,6.464c-3.57,0-6.465-2.894-6.465-6.464v-39.987v-7.085c0-4.926-3.992-8.919-8.917-8.919 c-4.927,0-8.919,3.993-8.919,8.919v44.863v10.804c0,14.122,7.382,26.515,18.495,33.546c1.73,1.096,2.777,3.002,2.777,5.049v77.617 c0,10.168,8.242,18.411,18.413,18.411c10.167,0,18.409-8.243,18.409-18.411v-77.617c0-2.044,1.05-3.954,2.778-5.048 c11.112-7.031,18.494-19.424,18.494-33.547v-10.804v-44.863C895.389,800.389,891.397,796.396,886.471,796.396z"></path>
                    <path d="M957.564,796.638v-0.002c-31.153,0-45.631,29.991-45.631,59.313c0,6.531,0,50.561,0,69.684 c0,4.879,3.954,8.834,8.835,8.834h18.383v42.727c0,10.168,8.241,18.411,18.413,18.411c10.167,0,18.411-8.243,18.411-18.411V815.049 C975.976,804.881,967.731,796.638,957.564,796.638z"></path>
                  </g>
                </svg>
                <h6>MENU</h6>
              </div>
            </Link>

            <a
              id="pickupBtn_Mobile"
              onClick={() => { setPickupType("Delivery") }}
              data-toggle="modal"
              data-target="#staticback_pickup"
            >
              <div className="col flex flex-col justify-center items-center">
                <svg
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                >
                  <g>
                    <path d="M0 0h48v48H0z" fill="none"></path>
                    <g>
                      <path d="M4,40c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4l0-26h-8.18C34.863,8.334,29.934,4,24,4S13.137,8.334,12.181,14H4L4,40z M24,8 c3.719,0,6.845,2.555,7.737,6H16.263C17.155,10.555,20.281,8,24,8z"></path>
                    </g>
                  </g>
                </svg>
                <h6>DELIVERY</h6>
              </div>
            </a>

            <a
              id="pickupBtn_Mobile"
              onClick={(e) => {
                e.preventDefault();
                setPickupType("pickup")
                // setShowPickupModal(true);
              }}

              data-toggle="modal"
              data-target="#staticback_pickup"
              className=""
              style={{ opacity: 1, pointerEvents: "auto", cursor: "pointer" }}
            >
              <div className="col flex flex-col justify-center items-center">
                <svg
                  fill="#000000"
                  viewBox="0 0 56 56"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 15.7187 30.5312 C 14.8046 30.5312 14.1014 29.8281 14.1014 28.8906 C 14.1014 27.9766 14.8046 27.2734 15.7187 27.2734 L 26.3593 27.2734 L 26.3593 13.0937 C 26.3593 12.1797 27.0624 11.4766 27.9765 11.4766 C 28.8905 11.4766 29.6171 12.1797 29.6171 13.0937 L 29.6171 28.8906 C 29.6171 29.8281 28.8905 30.5312 27.9765 30.5312 Z" />
                  </g>
                </svg>
                <h6>PICKUP</h6>
              </div>
            </a>

            <Link
              to="/mobile/order-details">
              <div className="col flex flex-col justify-center items-center">
                <div className="order position-relative">
                  <svg
                    className="translate-x-4"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>cart-shopping-solid</title>
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="invisible_box" data-name="invisible box">
                          <rect width="48" height="48" fill="none"></rect>
                        </g>
                        <g id="icons_Q2" data-name="icons Q2">
                          <path d="M44.3,10A3.3,3.3,0,0,0,42,9H11.5l-.4-3.4A3,3,0,0,0,8.1,3H5A2,2,0,0,0,5,7H7.2l3.2,26.9A5.9,5.9,0,0,0,7.5,39a6,6,0,0,0,6,6,6.2,6.2,0,0,0,5.7-4H29.8a6.2,6.2,0,0,0,5.7,4,6,6,0,0,0,0-12,6.2,6.2,0,0,0-5.7,4H19.2a6,6,0,0,0-4.9-3.9L14.1,31H39.4a3,3,0,0,0,2.9-2.6L45,12.6A3.6,3.6,0,0,0,44.3,10ZM37.5,39a2,2,0,1,1-2-2A2,2,0,0,1,37.5,39Zm-22,0a2,2,0,1,1-2-2A2,2,0,0,1,15.5,39Z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                  <div className="flex justify-center items-center -translate-x-0 -translate-y-1 h-[13px]  box-btn " id="TotalItemsInCart">
                    <span>0</span>
                  </div>
                  <h6 className="whitespace-nowrap">My Order</h6>
                </div>
              </div>
            </Link>

            { !showPickupDeliverModal &&
              <PickupModal
                onConfirm={() => {
                PickupType === "pickup" ? setShowPickupDeliverModal(true) : setShowDeilveryModal(true);
                cancelRef.current?.click();
                }}
              onCancel={() => cancelRef}
              cancelRef={cancelRef}
              />
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;
