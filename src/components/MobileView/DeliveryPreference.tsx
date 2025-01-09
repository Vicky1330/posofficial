import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DeliveryModal from './Modals/DeliveryModal';
import axios from 'axios';

interface StoreSettings {
  orderTypeId: number;
  isScheduleOrder: number;
  scheduleDate: string;
  scheduleTime_24HoursFormat: string;
  AllowCashOnDelivery: number;
  AllowCashOnPickup: number;
  AllowScheduleOrder: number;
  AllowUserAppToPlaceTheDeliveryOrder: number;
  AllowUserAppToPlaceThePickupOrder: number;
}

interface ParsedResponse {
  data: {
    storeQR_SettingsData: StoreSettings;
  };
}

const DeliveryPreference: React.FC = () => {

  const [isDeliveryModalOpen, setDeliveryModal] = useState<boolean>(false);
  // const [orderType, setOrderType] = useState<string | null>(null);
  // const [scheduleDate, setScheduleDate] = useState<string>('');
  // const [scheduleTime, setScheduleTime] = useState<string>('');
  const { restaurantName } = useParams<{ restaurantName: string }>();

  let wpResponse = localStorage.getItem('guest_wpresponse');
  let parsedResponse: ParsedResponse | null = wpResponse ? JSON.parse(wpResponse) : null;

  let settings: StoreSettings | null = parsedResponse ? parsedResponse.data.storeQR_SettingsData : null;

  const handleDelivery = () => {
    try {
      // setOrderType('delivery');
      const orderData = {
        orderTypeId: 1, 
        isScheduleOrder: 0,
        scheduleDate: '',
        scheduleTime_24HoursFormat: '',
      };
      console.log('Sending order data for Delivery Now:', orderData);
      sendOrderData(orderData);
      handleDeliveryModal();
    } catch (error) {
      console.error('Error during delivery handling:', error);
    }
  };

  const handlePickup = () => {
    try {
      // setOrderType('pickup');
      const orderData = {
        orderTypeId: 2,
        isScheduleOrder: 0,
        scheduleDate: '',
        scheduleTime_24HoursFormat: '',
      };

      sendOrderData(orderData);
    } catch (error) {
      console.error('Error during pickup handling:', error);
    }
  };

  const sendOrderData = async (data: any) => {
    try {
      const token = localStorage.getItem('guest_wptoken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      localStorage.setItem('wp_orderType', JSON.stringify(data));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/customer/set/ordertype`,
        data,
        { headers }
      );
      if (response.status === 200) console.log("");
      
    } catch (error) {
      console.error('Error while sending order data:', error);
    }
  };

  const handleDeliveryModal = () => {
    setDeliveryModal((prevState) => !prevState);
  };

  const handleDeliveryModalClose = (): void => {
    setDeliveryModal(false);
  };

  const cashOnPickupDisable = settings?.AllowUserAppToPlaceThePickupOrder === 0;
  const cashOnDeliveryDisable = settings?.AllowUserAppToPlaceTheDeliveryOrder === 0;

  return (
    <>
      <div id="Categories_Model_MobilePartialView" className="">
        {/* Modal */}
        <div className=" main-modal" id="main_Deliverymodal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body ">
                <div className="container px-0">
                  <h6>
                    How would you like to <br /> Order?
                  </h6>
                  <div className="row flex-column">
                    <div
                      id="ChooseDilveryOrderforMobileView"
                      className={`col-12 ${cashOnDeliveryDisable ? 'disabledDiv' : ''}`}
                    >
                      <button
                        className="boxone flex justify-center items-center flex-column"
                        // onClick={handleDeliveryModal}
                        onClick={handleDelivery}
                      >
                        <svg
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          x="0px"
                          y="0px"
                          viewBox="0 0 512 512"
                          //   style={{ enableBackground: "new 0 0 512 512" }}
                          xmlSpace="preserve"
                        >
                          <path
                            style={{ fill: "#885951" }}
                            d="M424.002,335.998c-39.7,0-71.998,32.298-71.998,71.998s32.298,71.998,71.998,71.998
                      S496,447.696,496,407.996S463.703,335.998,424.002,335.998z"
                          />
                          <path
                            style={{ fill: "#7A463D" }}
                            d="M424.002,351.998c-30.878,0-55.999,25.12-55.999,55.999s25.12,55.999,55.999,55.999
                      s55.999-25.12,55.999-55.999S454.88,351.998,424.002,351.998z"
                          />
                          <path
                            style={{ fill: "#E4DAD8" }}
                            d="M424.002,367.997c-22.055,0-39.999,17.944-39.999,39.999s17.944,39.999,39.999,39.999
                      s39.999-17.944,39.999-39.999S446.057,367.997,424.002,367.997z"
                          />
                          <path
                            style={{ fill: "#885951" }}
                            d="M96.01,335.998c-39.7,0-71.998,32.298-71.998,71.998s32.298,71.998,71.998,71.998
                      s71.998-32.298,71.998-71.998S135.711,335.998,96.01,335.998z"
                          />
                          <path
                            style={{ fill: "#7A463D" }}
                            d="M96.01,351.998c-30.878,0-55.999,25.12-55.999,55.999s25.12,55.999,55.999,55.999
                      s55.999-25.12,55.999-55.999S126.888,351.998,96.01,351.998z"
                          />
                          <g>
                            <path
                              style={{ fill: "#E4DAD8" }}
                              d="M96.01,367.997c-22.055,0-39.999,17.944-39.999,39.999s17.944,39.999,39.999,39.999
                        s39.999-17.944,39.999-39.999S118.065,367.997,96.01,367.997z"
                            />
                            <path
                              style={{ fill: "#E4DAD8" }}
                              d="M399.412,152.692c-1.022-0.454-2.13-0.689-3.249-0.689h-23.999c-2.908,0-5.587,1.578-6.997,4.121
                        c-1.409,2.544-1.328,5.651,0.212,8.118c37.102,59.385,21.455,139.631,1.886,179.757h-103.26c-4.418,0-8,3.582-8,8v31.999
                        c0,4.418,3.582,8,8,8h79.998c1.196,0,2.378-0.269,3.457-0.786l100.158-47.999c2.352-1.126,4.006-3.327,4.435-5.898
                        C453.075,331.184,476.188,186.815,399.412,152.692z"
                            />
                          </g>
                          <path
                            style={{ fill: "#D7C8C5" }}
                            d="M367.264,343.998h15.906c19.57-40.126,35.216-120.372-1.886-179.757
                      c-1.54-2.467-1.621-5.574-0.212-8.118c1.41-2.543,4.089-4.121,6.997-4.121h-15.906c-2.908,0-5.587,1.578-6.997,4.121
                      c-1.409,2.544-1.328,5.651,0.212,8.118C402.48,223.626,386.834,303.872,367.264,343.998z"
                          />
                          <path
                            style={{ fill: "#F56C6C" }}
                            d="M303.097,278.847c-4.527-25.273-19.258-43.74-43.78-54.888
                      c-20.104-9.137-116.672-19.341-183.692,24.592c-77.207,50.611-75.96,126.479-75.551,151.41c0.03,1.818,0.086,3.64,0.035,5.458
                      c-0.043,1.535-0.17,2.958,0.348,4.446c1.106,3.182,4.189,5.373,7.556,5.373h247.994c2.11,0,4.135-0.834,5.633-2.319
                      c3.698-3.667,16.448-23.878,26.623-47.845C297.977,342.193,308.437,308.657,303.097,278.847z"
                          />
                          <path
                            style={{ fill: "#DB4D4D" }}
                            d="M23.917,409.866c-0.517-1.488-0.391-2.911-0.348-4.446c0.051-1.818-0.005-3.64-0.035-5.458
                      c-0.408-24.931-1.655-100.8,75.552-151.41c34.531-22.635,76.907-30.899,112.627-32.343c-39.229-1.601-93.595,4.488-136.089,32.343
                      c-77.207,50.611-75.96,126.479-75.551,151.41c0.03,1.818,0.086,3.64,0.035,5.458c-0.043,1.535-0.17,2.958,0.348,4.446
                      c1.106,3.182,4.188,5.373,7.556,5.373h23.461C28.106,415.238,25.023,413.047,23.917,409.866z"
                          />
                          <path
                            style={{ fill: "#F56C6C" }}
                            d="M424.002,319.998c-48.522,0-87.998,39.476-87.998,87.998c0,4.418,3.582,8,8,8h16
                      c2.922,0,5.611-1.593,7.016-4.155c13.586-24.789,31.159-35.844,56.983-35.844c29.28,0,47.364,19.66,57.38,36.151
                      c1.45,2.389,4.043,3.848,6.838,3.848H504c4.418,0,8-3.582,8-8C512,359.474,472.525,319.998,424.002,319.998z"
                          />
                          <path
                            style={{ fill: "#DB4D4D" }}
                            d="M352.004,407.996c0-45.825,35.211-83.575,79.998-87.631c-2.636-0.239-5.303-0.367-8-0.367
                      c-48.522,0-87.998,39.476-87.998,87.998c0,4.418,3.582,8,8,8h16C355.585,415.996,352.004,412.414,352.004,407.996z"
                          />
                          <path
                            style={{ fill: "#885951" }}
                            d="M280.005,176.002H168.008c-26.467,0-47.999,21.531-47.999,47.999v8c0,4.418,3.582,8,8,8h151.996
                      c4.418,0,8-3.582,8-8v-47.999C288.005,179.584,284.423,176.002,280.005,176.002z"
                          />
                          <g>
                            <path
                              style={{ fill: "#7A463D" }}
                              d="M144.008,232v-8c0-26.467,21.531-47.999,47.999-47.999h-23.999
                        c-26.467,0-47.999,21.531-47.999,47.999v8c0,4.418,3.582,8,8,8h23.999C147.59,240,144.008,236.418,144.008,232z"
                            />
                            <path
                              style={{ fill: "#7A463D" }}
                              d="M392.003,136.003c-4.418,0-8-3.582-8-8V85.42l-34.97-13.988c-4.103-1.641-6.098-6.297-4.457-10.398
                        c1.641-4.101,6.298-6.098,10.398-4.457l39.999,16c3.038,1.215,5.029,4.156,5.029,7.428v47.999
                        C400.002,132.421,396.421,136.003,392.003,136.003z"
                            />
                          </g>
                          <path
                            style={{ fill: "#F56C6C" }}
                            d="M328.004,32.005c-17.645,0-31.999,14.355-31.999,31.999s14.355,31.999,31.999,31.999
                      c17.645,0,31.999-14.355,31.999-31.999S345.649,32.005,328.004,32.005z"
                          />
                          <path
                            style={{ fill: "#DB4D4D" }}
                            d="M344.004,88.004c-17.645,0-31.999-14.355-31.999-31.999c0-9.271,3.967-17.63,10.288-23.478
                      c-14.927,2.702-26.287,15.785-26.287,31.478c0,17.645,14.355,31.999,31.999,31.999c8.374,0,16.003-3.237,21.711-8.521
                      C347.862,87.819,345.955,88.004,344.004,88.004z"
                          />
                          <path
                            style={{ fill: "#7A463D" }}
                            d="M376.003,136.003h-63.999c-4.418,0-8-3.582-8-8c0-4.418,3.582-8,8-8h63.999c4.418,0,8,3.582,8,8
                      C384.003,132.421,380.421,136.003,376.003,136.003z"
                          />
                          <path
                            style={{ fill: "#956B64" }}
                            d="M408.002,120.003h-47.999v39.999c0,4.418,3.582,8,8,8h39.999V120.003z"
                          />
                          <path
                            style={{ fill: "#F56C6C" }}
                            d="M454.682,115.591c-1.865-2.781-5.132-4.06-8.25-3.433l-38.43,7.845v47.999l38.43,7.845
                      c5.051,1.012,9.569-3.015,9.569-8.064v-47.588C456.001,118.567,455.589,116.943,454.682,115.591z"
                          />
                          <path
                            style={{ fill: "#FBDC40" }}
                            d="M112.009,144.003H24.011c-4.418,0-8,3.582-8,8V232c0,4.418,3.582,8,8,8h87.998c4.418,0,8-3.582,8-8
                      v-79.998C120.009,147.584,116.427,144.003,112.009,144.003z"
                          />
                          <path
                            style={{ fill: "#FAD000" }}
                            d="M120.009,152.002c0-4.418-3.582-8-8-8H24.011c-4.418,0-8,3.582-8,8v16h103.998V152.002z"
                          />
                          <path
                            style={{ fill: "#FBDC40" }}
                            d="M120.951,112.003H15.07c-3.898,0-7.059,2.985-7.059,6.667v26.666c0,3.682,3.161,6.667,7.059,6.667
                      h105.88c3.898,0,7.059-2.985,7.059-6.667V118.67C128.009,114.988,124.849,112.003,120.951,112.003z"
                          />
                          <g>
                            <path
                              style={{ fill: "#DB4D4D" }}
                              d="M248.006,287.999h-71.998c-4.418,0-8-3.582-8-8c0-4.418,3.582-8,8-8h71.998c4.418,0,8,3.582,8,8
                        C256.006,284.417,252.424,287.999,248.006,287.999z"
                            />
                            <path
                              style={{ fill: "#DB4D4D" }}
                              d="M232.006,335.998H128.009c-4.418,0-8-3.582-8-8c0-4.418,3.582-8,8-8h103.998c4.418,0,8,3.582,8,8
                        C240.006,332.416,236.424,335.998,232.006,335.998z"
                            />
                            <path
                              style={{ fill: "#DB4D4D" }}
                              d="M208.007,383.997H80.01c-4.418,0-8-3.582-8-8s3.582-8,8-8h127.997c4.418,0,8,3.582,8,8
                        S212.425,383.997,208.007,383.997z"
                            />
                          </g>
                          <path
                            style={{ fill: "#7A463D" }}
                            d="M128.009,240H8.012c-4.418,0-8-3.582-8-8c0-4.418,3.582-8,8-8h119.997c4.418,0,8,3.582,8,8
                      C136.009,236.418,132.427,240,128.009,240z"
                          />
                        </svg>

                        <h4>Delivery</h4>
                       
                        <h6
                          id="delivery_mobile_text"
                          style={{ visibility: "hidden" }}
                        >
                          Your order will be delivered in -{" "}
                          <span id="estimatedTime_delivery_ForMobile" />{" "}
                          minutes.
                        </h6>
                      </button>

                    </div>

                    <div className="spacebox" />

                    <div className={`col-12 ${cashOnPickupDisable ? 'disabledDiv' : ''}`} >

                      <Link
                        to={`/${restaurantName}/order/preference`}
                        className="boxone flex justify-center items-center flex-column"
                        id="ChoosePickupOrderforMobileView"
                        style={{
                          opacity: 1,
                          pointerEvents: "auto",
                          cursor: "pointer",
                        }}
                        onClick={handlePickup}
                      >
                        <svg
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          x="0px"
                          y="0px"
                          viewBox="0 0 512 512"
                          //   style={{ enableBackground: "new 0 0 512 512" }}
                          xmlSpace="preserve"
                        >
                          
                          <g>
                            <g>
                              <rect
                                x={32}
                                y={132}
                                style={{ fill: "#FFE1B2" }}
                                width={448}
                                height={312}
                              />
                            </g>
                            <g>
                              <rect
                                x={32}
                                y={396}
                                style={{ fill: "#FFB980" }}
                                width={448}
                                height={48}
                              />
                            </g>
                            <g>
                              <rect
                                x={32}
                                y={116}
                                style={{ fill: "#FFB980" }}
                                width={448}
                                height={56}
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#7E5C62" }}
                                d="M192,188H80c-4.418,0-8,3.582-8,8v240h128V196C200,191.582,196.418,188,192,188z"
                              />
                            </g>
                            <g>
                              <g>
                                <path
                                  style={{ fill: "#5C546A" }}
                                  d="M504,452H8c-4.422,0-8-3.578-8-8s3.578-8,8-8h496c4.422,0,8,3.578,8,8S508.422,452,504,452z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  style={{ fill: "#5C546A" }}
                                  d="M176,340c-4.422,0-8-3.578-8-8v-16c0-4.422,3.578-8,8-8s8,3.578,8,8v16
         C184,336.422,180.422,340,176,340z"
                                />
                              </g>
                            </g>
                            <g>
                              <path
                                style={{ fill: "#FF4F19" }}
                                d="M40,156L40,156c-13.255,0-24-10.745-24-24V76c0-8.837,7.163-16,16-16h32v72
       C64,145.255,53.255,156,40,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#E9001E" }}
                                d="M88,156L88,156c-13.255,0-24-10.745-24-24V60h48v72C112,145.255,101.255,156,88,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#FF4F19" }}
                                d="M136,156L136,156c-13.255,0-24-10.745-24-24V60h48v72C160,145.255,149.255,156,136,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#E9001E" }}
                                d="M184,156L184,156c-13.255,0-24-10.745-24-24V60h48v72C208,145.255,197.255,156,184,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#FF4F19" }}
                                d="M232,156L232,156c-13.255,0-24-10.745-24-24V60h48v72C256,145.255,245.255,156,232,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#E9001E" }}
                                d="M280,156L280,156c-13.255,0-24-10.745-24-24V60h48v72C304,145.255,293.255,156,280,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#FF4F19" }}
                                d="M328,156L328,156c-13.255,0-24-10.745-24-24V60h48v72C352,145.255,341.255,156,328,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#E9001E" }}
                                d="M376,156L376,156c-13.255,0-24-10.745-24-24V60h48v72C400,145.255,389.255,156,376,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#FF4F19" }}
                                d="M424,156L424,156c-13.255,0-24-10.745-24-24V60h48v72C448,145.255,437.255,156,424,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#E9001E" }}
                                d="M472,156L472,156c-13.255,0-24-10.745-24-24V60h32c8.837,0,16,7.163,16,16v56
       C496,145.255,485.255,156,472,156z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#53DCFF" }}
                                d="M440,196H240c-4.418,0-8,3.582-8,8v160c0,4.418,3.582,8,8,8h200c4.418,0,8-3.582,8-8V204
       C448,199.582,444.418,196,440,196z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#B3F4FF" }}
                                d="M397.588,372H440c4.418,0,8-3.582,8-8v-9.47L289.47,196H232c-2.835,0-5.207,1.56-6.628,3.784
       L397.588,372z"
                              />
                            </g>
                            <g>
                              <polygon
                                style={{ fill: "#FFFFFF" }}
                                points="334.059,196 448,309.941 448,276 368,196 		"
                              />
                            </g>
                            <g>
                              <g>
                                <path
                                  style={{ fill: "#7E5C62" }}
                                  d="M440,380H240c-8.82,0-16-7.18-16-16V204c0-8.82,7.18-16,16-16h200c8.82,0,16,7.18,16,16v160
         C456,372.82,448.82,380,440,380z M240,204v160h200.016L440,204H240z"
                                />
                              </g>
                            </g>
                            <g>
                              <path
                                style={{ fill: "#53DCFF" }}
                                d="M176,292H96c-4.418,0-8-3.582-8-8v-72c0-4.418,3.582-8,8-8h80c4.418,0,8,3.582,8,8v72
       C184,288.418,180.418,292,176,292z"
                              />
                            </g>
                            <g>
                              <path
                                style={{ fill: "#B3F4FF" }}
                                d="M136.099,204H96c-4.418,0-8,3.582-8,8v11.784L156.216,292H176c4.418,0,8-3.582,8-8v-32.099
       L136.099,204z"
                              />
                            </g>
                          </g>
                        </svg>
                        <h4>Pickup</h4>
                        <h6>Place your order and pickup when its ready.</h6>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button trigger modal for delivery */}
        {isDeliveryModalOpen && (
          <div>
            <div className="fixed inset-0 bg-black opacity-75 z-10 min-h-screen"></div>
            <DeliveryModal
              isOpen={isDeliveryModalOpen}
              onClose={handleDeliveryModalClose}
            />
          </div>
        )}

      </div>
    </>
  );
};

export default DeliveryPreference;
