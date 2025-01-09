import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// interface ChoosePickupOrderOptionsProps {
//   insertUpdatePickupStatus: (status: number) => void;
// }

const ChoosePickupOrderOptions: React.FC = ({
  // insertUpdatePickupStatus,
}) => {

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [scheduleLater, setScheduleLater] = useState<boolean>(false);
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const navigate = useNavigate();

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleStartOrder = async (scheduleLater: number) => {
    const params = {
      orderTypeId: 2,
      isScheduleOrder: scheduleLater,
      scheduleDate: scheduleLater == 1 ? selectedDate : "",
      scheduleTime_24HoursFormat: scheduleLater === 1 ? selectedTime : ""
    }

    const token = localStorage.getItem('guest_wptoken');

    try {
      const apiEndpoint = `${import.meta.env.VITE_API_URL}api/customer/set/ordertype`
      const response = await axios.post(apiEndpoint, params, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status === 1 && response.status === 200) {
        navigate(`/${restaurantName}/departments`)
      }
    } catch (error) {

    }

  };

  const goBack = (): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
    // navigate(-1);
  };

  return (
    <>
      <div id="Categories_Model_MobilePartialView" className="">
        {/* Modal */}
        <div className="main-modal min-h-screen" id="main_Deliverymodal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body ">
                <div className="container px-0">
                  <h6>
                    How would you like to <br /> Order?
                  </h6>
                  {/* <div className="row flex-column"> */}
                  <div
                    className=" row flex-column"
                    id="ChoosePickupOrderOptionsforMobileView"
                  >
                    {/* Go Back Button */}
                    <button
                      className="boxone"
                      // onClick={backDeliveryShowModal}
                      onClick={goBack}
                      style={{ bottom: "11px" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ float: "left" }}
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-arrow-return-left"
                        viewBox="0 0 32 32"
                      >
                        <path
                          d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z"
                          data-name="4-Arrow Left"
                        />
                      </svg>
                      <span
                        style={{
                          textAlign: "center",
                          marginLeft: "-70px",
                          fontWeight: 500,
                        }}
                      >
                        Go To Back
                      </span>
                    </button>

                    {/* Now Button */}
                    <div
                      className="col-12"
                      id="orderStatusOption_now_ModalMobileView"
                    >
                      <a
                      // to={`/${restaurantName}/departments`}
                        className="boxone flex justify-center items-center flex-column"
                        onClick={() => handleStartOrder(0)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={512}
                          height={448}
                          viewBox="0 0 512 448"
                          style={{ width: "100px", height: "100px" }}
                        >
                          <g
                            id="Group_19301"
                            data-name="Group 19301"
                            transform="translate(-1903 -3932)"
                          >
                            <rect
                              id="Rectangle_19567"
                              data-name="Rectangle 19567"
                              width={512}
                              height={448}
                              transform="translate(1903 3932)"
                              fill="none"
                            />
                            <g
                              id="Now_-_Free_time_and_date_icons-2"
                              data-name="Now - Free time and date icons-2"
                              transform="translate(1908 3902)"
                            >
                              <path
                                id="Path_12975"
                                data-name="Path 12975"
                                d="M221,136h29.448v58.9H221Z"
                                transform="translate(-4.065 -0.276)"
                                fill="#7a7a93"
                              />
                              <path
                                id="Path_12976"
                                data-name="Path 12976"
                                d="M236,136h14.724v58.9H236Z"
                                transform="translate(-4.341 -0.276)"
                                fill="#616173"
                              />
                              <path
                                id="Path_12977"
                                data-name="Path 12977"
                                d="M274.253,150.448H195.724a14.724,14.724,0,0,1,0-29.448h78.528a14.724,14.724,0,1,1,0,29.448Z"
                                transform="translate(-3.329)"
                                fill="#fe8e3c"
                              />
                              <path
                                id="Path_12978"
                                data-name="Path 12978"
                                d="M275.264,121H236v29.448h39.264a14.724,14.724,0,0,0,0-29.448Z"
                                transform="translate(-4.341)"
                                fill="#fe8e3c"
                              />
                              <path
                                id="Path_12979"
                                data-name="Path 12979"
                                d="M161.283,232.106,140.46,211.283a14.724,14.724,0,0,1,20.823-20.823l20.823,20.823Z"
                                transform="translate(-2.504 -1.198)"
                                fill="#7a7a93"
                              />
                              <path
                                id="Path_12980"
                                data-name="Path 12980"
                                d="M289.033,211.283l20.823-20.823a14.724,14.724,0,1,1,20.823,20.823l-20.823,20.823Z"
                                transform="translate(-5.316 -1.198)"
                                fill="#616173"
                              />
                              <path
                                id="Path_12981"
                                data-name="Path 12981"
                                d="M111.989,349.4l-1.1-113.823a14.724,14.724,0,1,0-29.446.285l.694,71.784-55.3-80.074A14.725,14.725,0,0,0,0,235.944V353.517a14.724,14.724,0,0,0,29.448,0v-70.34l52.66,76.256c4.328,6.25,11.544,8.907,18.386,6.77,6.982-2.182,11.5-8.72,11.5-16.656V349.4Z"
                                transform="translate(0 -1.839)"
                                fill="#7a7a93"
                              />
                              <path
                                id="Path_12982"
                                data-name="Path 12982"
                                d="M497.2,221.5a14.723,14.723,0,0,0-17.316,11.566L466.239,301.65l-21.645-70.26a14.72,14.72,0,0,0-28.465,1.257l-21.363,69.016-13.607-68.795a14.724,14.724,0,0,0-28.889,5.714l22.95,116.024a14.775,14.775,0,0,0,.571,2.076,17.4,17.4,0,0,0,16.378,11.56h.12a17.4,17.4,0,0,0,16.465-12.172l21.769-70.332L452.2,356.085q.091.3.2.593a17.4,17.4,0,0,0,16.38,11.564h.12a17.4,17.4,0,0,0,16.339-11.789,14.911,14.911,0,0,0,.5-1.863l23.042-115.774A14.728,14.728,0,0,0,497.2,221.5Z"
                                transform="translate(-6.474 -1.839)"
                                fill="#616173"
                              />
                              <ellipse
                                id="Ellipse_15"
                                data-name="Ellipse 15"
                                cx="88.5"
                                cy={88}
                                rx="88.5"
                                ry={88}
                                transform="translate(143 195)"
                                fill="#fff5f5"
                              />
                              <path
                                id="Path_12983"
                                data-name="Path 12983"
                                d="M236,196V372.689A88.345,88.345,0,1,0,236,196Z"
                                transform="translate(-4.341 -1.38)"
                                fill="#e2dff4"
                              />
                              <path
                                id="Path_12984"
                                data-name="Path 12984"
                                d="M234.069,387.137A103.069,103.069,0,1,1,337.137,284.069,103.069,103.069,0,0,1,234.069,387.137Zm0-176.689a73.62,73.62,0,1,0,73.62,73.62,73.62,73.62,0,0,0-73.62-73.62Z"
                                transform="translate(-2.41 -1.104)"
                                fill="#fe8e3c"
                              />
                              <path
                                id="Path_12985"
                                data-name="Path 12985"
                                d="M236,181v29.448a73.62,73.62,0,0,1,0,147.241v29.448A103.069,103.069,0,1,0,236,181Z"
                                transform="translate(-4.341 -1.104)"
                                fill="#fe8e3c"
                              />
                              <path
                                id="Path_12986"
                                data-name="Path 12986"
                                d="M225.312,295.746a14.724,14.724,0,0,1,0-20.823L246.135,254.1a14.724,14.724,0,0,1,20.823,20.823l-20.823,20.823a14.725,14.725,0,0,1-20.823,0Z"
                                transform="translate(-4.065 -2.369)"
                                fill="#7a7a93"
                              />
                              <path
                                id="Path_12987"
                                data-name="Path 12987"
                                d="M267.235,254.1a14.724,14.724,0,0,0-20.823,0L236,264.511v35.547a14.677,14.677,0,0,0,10.411-4.313l20.823-20.823a14.724,14.724,0,0,0,0-20.823Z"
                                transform="translate(-4.341 -2.369)"
                                fill="#616173"
                              />
                            </g>
                          </g>
                        </svg>
                        <h4 onClick={() => console.log("clicked")}>Now</h4>
                        <h6
                          id="pickup_mobile_text"
                          style={{ visibility: "hidden" }}
                        >
                          Your order will be ready in -{" "}
                          <span id="estimatedTime_Pickup_MobileView_Second">
                            30
                          </span>{" "}
                          minutes.
                        </h6>
                      </a>
                    </div>

                    {/* Spacebox */}
                    <div className="spacebox"></div>

                    {/* Schedule Later Button */}
                    <div
                      className="col-12"
                      id="orderStatusOption_schedule_ModalMobileView"
                      style={{
                        opacity: 1,
                        pointerEvents: "auto",
                        cursor: "pointer",
                      }}
                    >
                      <button className="boxone flex justify-center items-center flex-column" onClick={() => setScheduleLater(true)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={512}
                          height={448}
                          viewBox="0 0 512 448"
                          style={{ width: "100px", height: "100px" }}
                        >
                          <g
                            id="Group_19303"
                            data-name="Group 19303"
                            transform="translate(-2315 -4435)"
                          >
                            <rect
                              id="Rectangle_19567"
                              data-name="Rectangle 19567"
                              width={512}
                              height={448}
                              transform="translate(2315 4435)"
                              fill="none"
                            />
                            <g
                              id="Search_results_for_Clock_calender_-_Flaticon-12"
                              data-name="Search results for Clock calender - Flaticon-12"
                              transform="translate(2357.942 4449)"
                            >
                              <path
                                id="Path_12988"
                                data-name="Path 12988"
                                d="M204.883,414.349H45.033a27.974,27.974,0,0,1-27.974-27.974V358.4H231.753Z"
                                transform="translate(0 -64.663)"
                                fill="#4d4d61"
                              />
                              <path
                                id="Path_12989"
                                data-name="Path 12989"
                                d="M380.76,138.2V334.027H45.033a27.974,27.974,0,0,1-27.974-27.975V138.2L212.9,68.266Z"
                                transform="translate(0 -12.317)"
                                fill="#616173"
                              />
                              <g
                                id="Group_19302"
                                data-name="Group 19302"
                                transform="translate(45.042 153.863)"
                              >
                                <path
                                  id="Path_12990"
                                  data-name="Path 12990"
                                  d="M72.621,215.709H57.76a6.557,6.557,0,0,1-6.557-6.557V194.291a6.557,6.557,0,0,1,6.557-6.557H72.621a6.557,6.557,0,0,1,6.557,6.557v14.861a6.557,6.557,0,0,1-6.557,6.557Zm55.95,0H113.71a6.557,6.557,0,0,1-6.557-6.557V194.291a6.557,6.557,0,0,1,6.557-6.557h14.861a6.557,6.557,0,0,1,6.557,6.557v14.861a6.557,6.557,0,0,1-6.557,6.557Zm55.949,0H169.659a6.557,6.557,0,0,1-6.557-6.557V194.291a6.557,6.557,0,0,1,6.557-6.557H184.52a6.557,6.557,0,0,1,6.557,6.557v14.861a6.557,6.557,0,0,1-6.556,6.557Zm55.95,0H225.609a6.557,6.557,0,0,1-6.557-6.557V194.291a6.557,6.557,0,0,1,6.557-6.557H240.47a6.557,6.557,0,0,1,6.557,6.557v14.861a6.557,6.557,0,0,1-6.556,6.557Zm55.94,0H281.55a6.557,6.557,0,0,1-6.557-6.557V194.291a6.557,6.557,0,0,1,6.557-6.557h14.861a6.557,6.557,0,0,1,6.557,6.557v14.861a6.557,6.557,0,0,1-6.557,6.557Zm55.95,0H337.5a6.557,6.557,0,0,1-6.557-6.557V194.291a6.557,6.557,0,0,1,6.557-6.557h14.861a6.557,6.557,0,0,1,6.557,6.557v14.861a6.557,6.557,0,0,1-6.557,6.557ZM72.621,271.658H57.76A6.557,6.557,0,0,1,51.2,265.1V250.24a6.557,6.557,0,0,1,6.557-6.557H72.621a6.557,6.557,0,0,1,6.557,6.557V265.1a6.557,6.557,0,0,1-6.558,6.558Zm55.95,0H113.71a6.557,6.557,0,0,1-6.557-6.557V250.24a6.557,6.557,0,0,1,6.557-6.557h14.861a6.557,6.557,0,0,1,6.557,6.557V265.1a6.557,6.557,0,0,1-6.558,6.558Zm55.949,0H169.659A6.557,6.557,0,0,1,163.1,265.1V250.24a6.557,6.557,0,0,1,6.557-6.557h14.861a6.557,6.557,0,0,1,6.557,6.557V265.1a6.557,6.557,0,0,1-6.555,6.558Zm62.507,0V250.677a6.993,6.993,0,0,0-6.993-6.993H226.046a6.993,6.993,0,0,0-6.993,6.993v13.988a6.993,6.993,0,0,0,6.993,6.993ZM72.621,327.608H57.76a6.557,6.557,0,0,1-6.557-6.557V306.19a6.557,6.557,0,0,1,6.557-6.557H72.621a6.557,6.557,0,0,1,6.557,6.557v14.861A6.557,6.557,0,0,1,72.621,327.608Zm55.95,0H113.71a6.557,6.557,0,0,1-6.557-6.557V306.19a6.557,6.557,0,0,1,6.557-6.557h14.861a6.557,6.557,0,0,1,6.557,6.557v14.861A6.557,6.557,0,0,1,128.571,327.608Zm55.949,0H169.659a6.557,6.557,0,0,1-6.557-6.557V306.19a6.557,6.557,0,0,1,6.557-6.557H184.52a6.557,6.557,0,0,1,6.557,6.557v14.861a6.557,6.557,0,0,1-6.556,6.557Z"
                                  transform="translate(-51.203 -187.734)"
                                  fill="#fff"
                                />
                              </g>
                              <path
                                id="Path_12991"
                                data-name="Path 12991"
                                d="M353.105,187.733H338.64a6.74,6.74,0,0,0-2.477.475,6.751,6.751,0,0,1,4.277,6.28v14.466a6.752,6.752,0,0,1-4.277,6.28,6.725,6.725,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V194.488a6.756,6.756,0,0,0-6.753-6.755Zm-55.95,0H282.69a6.74,6.74,0,0,0-2.477.475,6.751,6.751,0,0,1,4.277,6.28v14.466a6.752,6.752,0,0,1-4.277,6.28,6.725,6.725,0,0,0,2.477.475h14.466a6.753,6.753,0,0,0,6.754-6.756V194.488a6.754,6.754,0,0,0-6.756-6.755Zm-55.94,0H226.749a6.74,6.74,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28v14.466a6.752,6.752,0,0,1-4.278,6.28,6.725,6.725,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V194.488a6.756,6.756,0,0,0-6.753-6.755Zm-55.95,0H170.8a6.74,6.74,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28v14.466a6.752,6.752,0,0,1-4.278,6.28,6.724,6.724,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V194.488a6.756,6.756,0,0,0-6.753-6.755Zm-55.95,0H114.849a6.741,6.741,0,0,0-2.477.475,6.751,6.751,0,0,1,4.277,6.28v14.466a6.752,6.752,0,0,1-4.277,6.28,6.724,6.724,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V194.488a6.755,6.755,0,0,0-6.755-6.755Zm-55.949,0H58.9a6.741,6.741,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28v14.466a6.752,6.752,0,0,1-4.278,6.28,6.724,6.724,0,0,0,2.477.475H73.365a6.755,6.755,0,0,0,6.755-6.754V194.488a6.756,6.756,0,0,0-6.753-6.755Zm0,55.95H58.9a6.74,6.74,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28V264.9a6.752,6.752,0,0,1-4.278,6.28,6.724,6.724,0,0,0,2.477.475H73.365A6.755,6.755,0,0,0,80.12,264.9V250.438a6.756,6.756,0,0,0-6.753-6.755Zm0,55.95H58.9a6.741,6.741,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28v14.466a6.752,6.752,0,0,1-4.278,6.28,6.724,6.724,0,0,0,2.477.475H73.365a6.755,6.755,0,0,0,6.755-6.754V306.388a6.756,6.756,0,0,0-6.753-6.755Zm55.949-55.95H114.849a6.74,6.74,0,0,0-2.477.475,6.751,6.751,0,0,1,4.277,6.28V264.9a6.752,6.752,0,0,1-4.277,6.28,6.724,6.724,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V250.438a6.755,6.755,0,0,0-6.755-6.755Zm0,55.95H114.849a6.741,6.741,0,0,0-2.477.475,6.751,6.751,0,0,1,4.277,6.28v14.466a6.752,6.752,0,0,1-4.277,6.28,6.724,6.724,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V306.388a6.754,6.754,0,0,0-6.757-6.755Zm55.95-55.95H170.8a6.74,6.74,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28V264.9a6.752,6.752,0,0,1-4.278,6.28,6.724,6.724,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V250.438a6.756,6.756,0,0,0-6.753-6.755Zm62.7,27.975V250.437a6.754,6.754,0,0,0-6.755-6.754H226.749a6.74,6.74,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28V264.9a6.752,6.752,0,0,1-4.278,6.28,6.725,6.725,0,0,0,2.477.475H247.97Zm-62.7,27.975H170.8a6.741,6.741,0,0,0-2.477.475,6.752,6.752,0,0,1,4.278,6.28v14.466a6.752,6.752,0,0,1-4.278,6.28,6.724,6.724,0,0,0,2.477.475h14.466a6.755,6.755,0,0,0,6.755-6.754V306.388a6.755,6.755,0,0,0-6.755-6.755Z"
                                transform="translate(-7.102 -33.871)"
                                fill="#e3e3e3"
                              />
                              <path
                                id="Path_12992"
                                data-name="Path 12992"
                                d="M437.114,143.721V347.642h19.433V151.818Z"
                                transform="translate(-75.787 -25.93)"
                                fill="#4d4d61"
                              />
                              <path
                                id="Path_12993"
                                data-name="Path 12993"
                                d="M380.76,132.046V62.108a27.974,27.974,0,0,0-27.974-27.974H45.033A27.973,27.973,0,0,0,17.059,62.109v69.937Z"
                                transform="translate(0 -6.159)"
                                fill="#fe8e3c"
                              />
                              <path
                                id="Path_12994"
                                data-name="Path 12994"
                                d="M119.207,73.205H101a6.332,6.332,0,1,1,0-12.664h18.209a6.332,6.332,0,1,1,0,12.664Zm44.734,0H145.732a6.332,6.332,0,1,1,0-12.664h18.209a6.332,6.332,0,1,1,0,12.664Zm116.131,0h-18.21a6.332,6.332,0,0,1,0-12.664h18.209a6.332,6.332,0,1,1,0,12.664Zm44.735,0H306.6a6.332,6.332,0,0,1,0-12.664h18.209a6.332,6.332,0,0,1,0,12.664Z"
                                transform="translate(-14.002 -10.923)"
                                fill="#ef741a"
                              />
                              <path
                                id="Path_12995"
                                data-name="Path 12995"
                                d="M154.427,52.453a17.484,17.484,0,0,1-34.968,0V17.484a17.484,17.484,0,1,1,34.967,0V52.453Zm160.865,0a17.484,17.484,0,1,1-34.969,0V17.484a17.484,17.484,0,1,1,34.968,0V52.453Z"
                                transform="translate(-18.475)"
                                fill="#616173"
                              />
                              <path
                                id="Path_12996"
                                data-name="Path 12996"
                                d="M299.521,0a17.4,17.4,0,0,0-9.7,2.941A17.463,17.463,0,0,1,297.6,17.485V52.453A17.464,17.464,0,0,1,289.82,67,17.481,17.481,0,0,0,317,52.454V17.484A17.483,17.483,0,0,0,299.52,0ZM138.656,0a17.4,17.4,0,0,0-9.7,2.941,17.463,17.463,0,0,1,7.784,14.544V52.453A17.464,17.464,0,0,1,128.955,67,17.481,17.481,0,0,0,156.14,52.454V17.484A17.483,17.483,0,0,0,138.655,0Z"
                                transform="translate(-20.189)"
                                fill="#4d4d61"
                              />
                              <path
                                id="Path_12997"
                                data-name="Path 12997"
                                d="M422.416,34.133H402.99a27.973,27.973,0,0,1,27.974,27.975v69.938H450.39V62.108a27.973,27.973,0,0,0-27.976-27.975Z"
                                transform="translate(-69.631 -6.158)"
                                fill="#ef741a"
                              />
                              <path
                                id="Path_12998"
                                data-name="Path 12998"
                                d="M17.058,111.74h363.7V124.4H17.058Z"
                                transform="translate(0 -20.16)"
                                fill="#ef741a"
                              />
                              <path
                                id="Ellipse_16"
                                data-name="Ellipse 16"
                                d="M104.906,0A104.906,104.906,0,1,1,0,104.906,104.906,104.906,0,0,1,104.906,0Z"
                                transform="translate(198.909 209.812)"
                                fill="#fe8e3c"
                              />
                              <circle
                                id="Ellipse_17"
                                data-name="Ellipse 17"
                                cx="76.931"
                                cy="76.931"
                                r="76.931"
                                transform="translate(226.884 237.787)"
                                fill="#ebf5fc"
                              />
                              <path
                                id="Path_12999"
                                data-name="Path 12999"
                                d="M365.548,364.173a6.331,6.331,0,0,1-6.332-6.334V322.872a6.332,6.332,0,1,1,12.664,0v34.969A6.332,6.332,0,0,1,365.548,364.173Zm34.969,13.988H379.535a6.332,6.332,0,0,1,0-12.664h20.982a6.332,6.332,0,1,1,0,12.664Z"
                                transform="translate(-61.733 -57.111)"
                                fill="#616173"
                              />
                              <path
                                id="Path_13000"
                                data-name="Path 13000"
                                d="M364.8,256c-3.274,0-6.512.158-9.71.452a104.9,104.9,0,0,1,0,208.909c3.2.293,6.435.452,9.71.452A104.906,104.906,0,0,0,364.8,256Z"
                                transform="translate(-60.989 -46.188)"
                                fill="#ef741a"
                              />
                              <path
                                id="Path_13001"
                                data-name="Path 13001"
                                d="M364.806,290.133a77.717,77.717,0,0,0-9.708.608,76.939,76.939,0,0,1,0,152.647,76.935,76.935,0,1,0,9.7-153.255Z"
                                transform="translate(-60.991 -52.346)"
                                fill="#d3dcfb"
                              />
                              <path
                                id="Ellipse_18"
                                data-name="Ellipse 18"
                                d="M13.988,0A13.988,13.988,0,1,1,0,13.988,13.988,13.988,0,0,1,13.988,0Z"
                                transform="translate(289.828 300.73)"
                                fill="#fe8e3c"
                              />
                              <g
                                id="Ellipse_19"
                                data-name="Ellipse 19"
                                transform="translate(144.058 197)"
                                fill="none"
                                stroke="#fff"
                                strokeWidth={4}
                              >
                                <circle
                                  cx="27.5"
                                  cy="27.5"
                                  r="27.5"
                                  stroke="none"
                                />
                                <circle
                                  cx="27.5"
                                  cy="27.5"
                                  r="25.5"
                                  fill="none"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        <h4>Later</h4>
                        <h6>Place your order for later when its ready.</h6>
                      </button>
                    </div>

                    {scheduleLater ? (
                      <div className="row justify-content-center p-2 translate-x-2.5" id="scheduleOrderOptions_Modal_MobileView">
                        <table>
                          <tbody>
                            <tr>
                              <td className="pl-2">
                                <select
                                  id="ddlScheduleDate_ModalMobileView"
                                  className="ddlScheduleDate p-1 w-[130px]"
                                  value={selectedDate}
                                  onChange={handleDateChange}

                                >
                                  <option value="-1">Select Date</option>
                                  <option value="10/30/2024" selected={selectedDate === "10/30/2024"}>
                                    10/30/2024 (Wed)
                                  </option>
                                  <option value="10/31/2024">10/31/2024 (Thu)</option>
                                  <option value="11/01/2024">11/01/2024 (Fri)</option>
                                  <option value="11/02/2024">11/02/2024 (Sat)</option>
                                  <option value="11/03/2024">11/03/2024 (Sun)</option>
                                  <option value="11/04/2024">11/04/2024 (Mon)</option>
                                  <option value="11/05/2024">11/05/2024 (Tue)</option>
                                </select>
                              </td>
                              <td className="time pl-1 pr-2">
                                <select
                                  id="ddlScheduleTime_ModalMobileView"
                                  className="ddlScheduleTime p-1 w-[130px]"
                                  value={selectedTime}
                                  onChange={handleTimeChange}
                                >
                                  <option value="-1">Select Time</option>
                                  <option value="14:50">02:50 PM</option>
                                  <option value="14:55">02:55 PM</option>
                                  <option value="15:00">03:00 PM</option>
                                  <option value="15:05">03:05 PM</option>
                                  <option value="15:10">03:10 PM</option>
                                  <option value="15:15">03:15 PM</option>
                                  <option value="15:20">03:20 PM</option>
                                  <option value="15:25">03:25 PM</option>
                                  <option value="15:30">03:30 PM</option>
                                  <option value="15:35">03:35 PM</option>
                                  <option value="15:40">03:40 PM</option>
                                  <option value="15:45">03:45 PM</option>
                                </select>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="col-12">
                          <button
                            id="btnSubmit_PickUpOrderStatus_ModalMbileView"
                            type="button"
                            className="btn font-weight-bold mt-3"
                            onClick={() => handleStartOrder(1)}
                            style={{ background: 'black', color: '#fff' }}
                          >
                            Start Order
                          </button>
                        </div>
                      </div>
                    ) : <div></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChoosePickupOrderOptions;
