import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ContactUs: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [map, setMap] = useState<any>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const wpToken = localStorage.getItem("guest_wptoken");

    if (!wpToken) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}api/customer/submit/contactus/message`;
    const payload = {
      customerName,
      customerEmail,
      customerPhoneNumber,
      subject,
      message,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${wpToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact message.");
      }

      const data = await response.json();
      if (data.status === 1) {
        toast.success("Your message has been sent successfully!");
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhoneNumber("");
        setSubject("");
        setMessage("");
      } else {
        toast.error("Error occurred while submitting your message.");
        setError(data.message || "Error occurred while submitting your message.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const initMap = () => {
    const mapElement = document.getElementById("map")!;
    const mapInstance = new window.google.maps.Map(mapElement, {
      center: { lat: -36.85088270000001, lng: 174.7644881 },
      zoom: 18,
    });

    setMap(mapInstance);
    
  };

  // fetch the restaurant info
  const fetchRestaurantInfo = async () => {
    const wpToken = localStorage.getItem("guest_wptoken");

    if (!wpToken) {
      setError("Authentication token is missing.");
      return;
    }

    try {
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
      console.log(map);
    }
  };

  useEffect(() => {

    if (window.google && window.google.maps) {
      initMap();

    } else {
      const script = document.createElement("script");
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${apiKey}&callback=initMap`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        initMap();
      };
    }
    fetchRestaurantInfo();
  }, []);

  return (
    <div id="LocationDetailsLayoutMobileView">
      <div className="bg-body">
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
                  <h5 className="name-div">{restaurantInfo?.TradingName || <Skeleton height={34} />}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="ContactMobileView">
          <div className="contact-page contact-form">
            <div className="container-fluid px-0">
              <div className="contact-info">
                <div className="row flex-column-reverse">
                  <div className="col-12 col-md-12 col-sm-12">
                    <div className="w-full p-1 m-1">
                      <div id="map" style={{ height: "400px", width: "100%" }}></div>
                      <div className="contact-link">
                        <span id="OpenLocationLinkNewTab_MobileCustomer">
                          <i className="fa fa-location-arrow"></i> GET DIRECTIONS
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-sm-12">
                    <div className="col-12 col-md-12 col-sm-12">
                      <div className="contact-h6 mb-4">
                        <h6 className="text-2xl font-bold">CONTACT DETAILS</h6>
                      </div>
                      <div className="contact-detail">
                        <div className="border-none">
                          <div className="mb-2 pl-2 flex flex-col border-b-gray-400 rounded-t-md  text-black font-light border-b-2 ">
                            <span className="text-xs">Address Details</span>
                            <span className="">
                              <a
                                className="text-black font-bold hover:text-blue-800 text-lg"
                                id="Mobile_View_Address_contact_CustomerP"
                              >
                                Auckland, New Zealand
                              </a>
                            </span>
                          </div>
                          <div className="mb-2 pl-2 flex flex-col border-b-gray-400 rounded-t-md  text-black font-light border-b-2 ">
                            <span className="text-xs">Email:</span>
                            <span className="">
                              <a
                                className="text-black font-bold hover:text-blue-800 text-lg"
                                id="Mobile_View_Address_contact_CustomerP"
                              >
                                protolabz123@gmail.com
                              </a>
                            </span>
                          </div>
                          <div className="mb-2 pl-2 flex flex-col border-b-gray-400 rounded-t-md  text-black font-light border-b-2 ">
                            <span className="text-xs">Contact</span>
                            <span className="">
                              <a
                                className="text-black font-bold hover:text-blue-800 text-lg"
                                id="Mobile_View_Address_contact_CustomerP"
                              >
                                +917355235473
                              </a>
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>


                    {/* Contact Form */}
                    <div className="contact-form mt-3">
                      <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            id="Contact_TextNameMobileView"
                            placeholder="Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                          <input
                            type="tel"
                            className="form-control"
                            id="Contact_PhoneNumberMobileView"
                            placeholder="Phone Number"
                            value={customerPhoneNumber}
                            onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                            required
                          />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            id="Contact_EmailMobileView"
                            placeholder="E-Mail Address"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                          />
                        </div>

                        {/* Subject */}
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            id="Contact_SubjectMobileView"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                          />
                        </div>

                        {/* Message */}
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            id="Contact_MessageMobileView"
                            placeholder="Please enter your message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                          ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="form-group">
                          <button
                            type="submit"
                            className="mt-0 btn btn-success btn-lg btn-block font-weight-bold"
                            disabled={loading}
                          >
                            {loading ? "Sending..." : "SEND"}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Error or Success Message */}
                    {error && <div className="text-danger mt-3">{error}</div>}
                    {success && <div className="text-success mt-3">{success}</div>}
                    
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

export default ContactUs;
