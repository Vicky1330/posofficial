import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const LocationDetails: React.FC = () => {

  const { restaurantName } = useParams<{ restaurantName: string }>();
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // fetch restraurant info
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
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
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
                <h5 className="name-div">{restaurantInfo?.TradingName || <Skeleton height={34} width={200} />}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ld-list">
        <div className="list-detail">
          {loading ? (
            <div>
              <div className="list-box">
                <div className="box-col1">
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className="box-col2">
                  <Skeleton width={150} height={20} />
                </div>
                <div className="box-col3">
                  <Skeleton width={18} height={18} />
                </div>
              </div>

              <div className="list-box">
                <div className="box-col1">
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className="box-col2">
                  <Skeleton width={150} height={20} />
                </div>
                <div className="box-col3">
                  <Skeleton width={18} height={18} />
                </div>
              </div>

              <div className="list-box">
                <div className="box-col1">
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className="box-col2">
                  <Skeleton width={150} height={20} />
                </div>
                <div className="box-col3">
                  <Skeleton width={18} height={18} />
                </div>
              </div>

              <div className="list-box">
                <div className="box-col1">
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className="box-col2">
                  <Skeleton width={150} height={20} />
                </div>
                <div className="box-col3">
                  <Skeleton width={18} height={18} />
                </div>
              </div>
            </div>
          ) :
            (<div className="container-fluid px-0">
              <Link
                to={`/${restaurantName}/location-info/service-hours`}
                id="servicehourslinkformobile"
              >
                <div className="list-box">
                  <div className="box-col1">
                    <svg
                      fill="#859dc4"
                      viewBox="0 0 56 56"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 15.7187 30.5312 C 14.8046 30.5312 14.1014 29.8281 14.1014 28.8906 C 14.1014 27.9766 14.8046 27.2734 15.7187 27.2734 L 26.3593 27.2734 L 26.3593 13.0937 C 26.3593 12.1797 27.0624 11.4766 27.9765 11.4766 C 28.8905 11.4766 29.6171 12.1797 29.6171 13.0937 L 29.6171 28.8906 C 29.6171 29.8281 28.8905 30.5312 27.9765 30.5312 Z"></path>
                    </svg>
                  </div>
                  <div className="box-col2">
                    <div className="item-title">Service Hours</div>
                  </div>
                  <div className="box-col3">
                    <div className="item-icon  flex flex-end">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#c7c7cc"
                        height="18px"
                        width="18px"
                        viewBox="0 0 330 330"
                        stroke="#c7c7cc"
                      >
                        <path d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                to={`/${restaurantName}/location-info/delivery-zones`}
              >
                <div className="list-box">
                  <div className="box-col1"><svg fill="#859dc4" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <g> <path d="M2,55.434C2,57.951,4.048,60,6.566,60h46.867C55.952,60,58,57.951,58,55.434V28H2V55.434z" /> <path d="M52.401,19L46.573,5.159C46.021,3.848,44.745,3,43.321,3h-1.463c-0.447-1.72-2-3-3.858-3H22c-1.858,0-3.411,1.28-3.858,3 h-1.463c-1.423,0-2.7,0.848-3.252,2.159L7.599,19H0v8h60v-8H52.401z M9.769,19l5.501-13.065C15.509,5.367,16.062,5,16.679,5h1.463 c0.447,1.72,2,3,3.858,3h16c1.858,0,3.411-1.28,3.858-3h1.463c0.617,0,1.169,0.367,1.408,0.935L50.231,19H9.769z" /> </g> </g></svg></div>
                  <div className="box-col2 "> <div className="item-title">Delivery Zones</div></div>
                  <div className="box-col3">
                    <div className="item-icon  flex flex-end">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#c7c7cc" height="64px" width="64px" version="1.1" id="Layer_1" viewBox="0 0 330 330" xmlSpace="preserve" stroke="#c7c7cc" style={{ width: '18px', height: '18px' }}>
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z" /> </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                to={`/${restaurantName}/location-info/payment-method`}
                id="paymentMethodsLink_formobile"
              >
                <div className="list-box">
                  <div className="box-col1"><svg viewBox="1 3 21 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#859dc4"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> {/* Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools */} <title>ic_fluent_payment_24_filled</title> <desc>Created with Sketch.</desc> <g id="🔍-Product-Icons" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd"> <g id="ic_fluent_payment_24_filled" fill="#859dc4" fillRule="nonzero"> <path d="M21.9883291,10.9947074 L21.9888849,16.275793 C21.9888849,17.7383249 20.8471803,18.9341973 19.4064072,19.0207742 L19.2388849,19.025793 L4.76104885,19.025793 C3.29851702,19.025793 2.10264457,17.8840884 2.01606765,16.4433154 L2.01104885,16.275793 L2.01032912,10.9947074 L21.9883291,10.9947074 Z M18.2529045,14.5 L15.7529045,14.5 L15.6511339,14.5068466 C15.2850584,14.556509 15.0029045,14.8703042 15.0029045,15.25 C15.0029045,15.6296958 15.2850584,15.943491 15.6511339,15.9931534 L15.7529045,16 L18.2529045,16 L18.3546751,15.9931534 C18.7207506,15.943491 19.0029045,15.6296958 19.0029045,15.25 C19.0029045,14.8703042 18.7207506,14.556509 18.3546751,14.5068466 L18.2529045,14.5 Z M19.2388849,5.0207074 C20.7014167,5.0207074 21.8972891,6.162412 21.9838661,7.60318507 L21.9888849,7.7707074 L21.9883291,9.4947074 L2.01032912,9.4947074 L2.01104885,7.7707074 C2.01104885,6.30817556 3.15275345,5.11230312 4.59352652,5.02572619 L4.76104885,5.0207074 L19.2388849,5.0207074 Z" id="🎨-Color"> </path> </g> </g> </g></svg></div>
                  <div className="box-col2 "> <div className="item-title">Payment Methods</div></div>
                  <div className="box-col3">
                    <div className="item-icon  flex flex-end">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#c7c7cc" height="64px" width="64px" version="1.1" id="Layer_1" viewBox="0 0 330 330" xmlSpace="preserve" stroke="#c7c7cc" style={{ width: '18px', height: '18px' }}>
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z" /> </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                to={`/${restaurantName}/location-info/contact-us`}
              >
                <div className="list-box">
                  <div className="box-col1"><svg fill="#859dc4" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z" fillRule="evenodd" /> </g></svg></div>
                  <div className="box-col2 "> <div className="item-title">Contact Us</div></div>
                  <div className="box-col3">
                    <div className="item-icon  flex flex-end">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#c7c7cc" height="64px" width="64px" version="1.1" id="Layer_1" viewBox="0 0 330 330" xmlSpace="preserve" stroke="#c7c7cc" style={{ width: '18px', height: '18px' }}>
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z" /> </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

            </div>)}
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
