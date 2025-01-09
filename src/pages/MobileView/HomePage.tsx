import React, { useState, useEffect, } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

const HomePage: React.FC = () => {

  // const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const existingToken = localStorage.getItem('guest_wptoken');
    const orderType = localStorage.getItem('wp_orderType');
    if (existingToken && !orderType) {
      navigate(`/${restaurantName}/add-address`);
    } else {
    const params = new URLSearchParams(window.location.search);
    const rlId = params.get('rlId');

    if (rlId) {
      generateToken(rlId);
    } else {
      setLoading(false);
    }
    }
  }, [navigate]);

  // generate token function
  const generateToken = async (rlId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/generate/guest/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rData: rlId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.data.token;
        if (newToken) {
          localStorage.setItem('guest_wptoken', newToken);
          localStorage.setItem('guest_wpresponse', JSON.stringify(data));
          // setToken(newToken);
          const orderType = localStorage.getItem('wp_orderType');
          if (!orderType) {
                navigate(`/${restaurantName}/add-address`);
          }
        } else {
          throw new Error('Token not found in response');
        }
      } else {
        throw new Error('Failed to generate token');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
    <div id="simpleOrderIndexCustomerView" className="phone-bg z-30 ">
      <div className="menubox"></div>
      <div
        className="header-section gradient-bg "
        style={{
          background: "linear-gradient(rgb(219, 10, 10) 0%, rgb(219, 10, 10) 100%)",
        }}
      >
        <div className="container ">
          <div className="header-logo flex justify-center">
            <img
              src="../../../../Content/LogoImage/darkcake2_d0a43ec52b8246c8b5d9d1dce8cdce91.png"
              alt="Logo"
              className="image-header header-widthG"
            />
          </div>
        </div>
        <a
          id="back-to-top"
          href="#"
          className="btn-lg back-to-top gradient-bg"
          role="button"
          style={{
            background: "linear-gradient(rgb(219, 10, 10) 0%, rgb(219, 10, 10) 100%)",
          }}
        >
          <i className="fa fa-chevron-up" aria-hidden="true"></i>
        </a>
      </div>

      <div className="btn-box">
        <div className="container-fluid ">
          <div className="row ">
            <div className="col-6 p-2">

              <Link
                to={`/${restaurantName}/departments`}
              >
                <div className="box-set">
                  <div className="box m-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                      <g id="Outline">
                        <path d="M47,2H11a1,1,0,0,0-1,1V49a1,1,0,0,0,1,1H40.437a2.411,2.411,0,0,1,.209.975,4.308,4.308,0,0,0,1.234,3.056l.642.766A2.035,2.035,0,0,1,43,56.107V62h2V56.107a4.038,4.038,0,0,0-.946-2.6l-.7-.829a2.389,2.389,0,0,1-.708-1.706,4.383,4.383,0,0,0-1.292-3.121l-2.536-2.536a1,1,0,1,1,1.426-1.4l5.994,5.8A1.169,1.169,0,0,0,47,50a1,1,0,0,0,1-1V38.414l4,4V62h2V42a1,1,0,0,0-.293-.707L48,35.586V3A1,1,0,0,0,47,2ZM19.026,4A4.948,4.948,0,0,0,18,7v3H15a4.948,4.948,0,0,0-3,1.026V4ZM37.4,42.489a3,3,0,0,0,0,4.243L38.672,48H12V15a3,3,0,0,1,3-3h4a1,1,0,0,0,1-1V7a3,3,0,0,1,3-3H46V46.7l-4.354-4.216A3,3,0,0,0,37.4,42.489Z" />
                        <path d="M31.262,13.325,30.7,15.243a6.032,6.032,0,0,1,3.222,2.32l1.639-1.146A8.037,8.037,0,0,0,31.262,13.325Z" />
                        <path d="M41,20H39.949A11.014,11.014,0,0,0,33,10.764V10a4,4,0,0,0-8,0v.764A11.014,11.014,0,0,0,18.051,20H17a1,1,0,0,0-1,1v2a3.1,3.1,0,0,0,3.182,3H38.818A3.1,3.1,0,0,0,42,23V21A1,1,0,0,0,41,20ZM27,10a2,2,0,0,1,4,0v.191a10.567,10.567,0,0,0-4,0Zm2,2a9.01,9.01,0,0,1,8.941,8H20.059A9.01,9.01,0,0,1,29,12ZM40,23a1.1,1.1,0,0,1-1.182,1H19.182A1.1,1.1,0,0,1,18,23V22H40Z" />
                        <rect x={16} y={28} width={5} height={2} />
                        <rect x={16} y={32} width={5} height={2} />
                        <rect x={16} y={36} width={5} height={2} />
                        <rect x={23} y={28} width={19} height={2} />
                        <rect x={23} y={32} width={19} height={2} />
                        <rect x={23} y={36} width={19} height={2} />
                        <rect x={16} y={40} width={5} height={2} />
                        <rect x={23} y={40} width={12} height={2} />
                        <rect x={16} y={44} width={5} height={2} />
                        <rect x={23} y={44} width={12} height={2} />
                      </g>
                    </svg>
                    <h6>ORDER</h6>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-6 p-2 ">
              <Link
                to={`/${restaurantName}/location-info`}
              >
                <div className="box-set">
                  <div className="box m-0">
                    <svg version="1.1" id="MESSAGE" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1800 1800" enableBackground="new 0 0 1800 1800" xmlSpace="preserve" fill="#000000">
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <g>
                            <path fill="#333333" d="M251.485,1662c-5.408,0-10.816-1.398-15.663-4.195c-9.693-5.598-15.663-15.938-15.663-27.13v-201.559 H86.872c-44.37,0-80.467-36.097-80.467-80.463V380.479c0-44.367,36.098-80.462,80.467-80.462h1467.337 c44.375,0,80.473,36.095,80.473,80.462v968.174c0,44.366-36.098,80.463-80.473,80.463H663.253l-396.105,228.688 C262.302,1660.602,256.894,1662,251.485,1662z M86.872,362.667c-9.824,0-17.817,7.991-17.817,17.813v968.174 c0,9.824,7.993,17.813,17.817,17.813h164.614c17.301,0,31.325,14.023,31.325,31.324v178.629l356.388-205.758 c4.761-2.749,10.163-4.195,15.662-4.195h899.349c9.829,0,17.822-7.989,17.822-17.813V380.479c0-9.822-7.993-17.813-17.822-17.813 H86.872z">
                            </path>
                          </g>
                          <g>
                            <path fill="#333333" d="M952.785,607.586H253.36c-17.302,0-31.325-14.023-31.325-31.325c0-17.301,14.023-31.325,31.325-31.325 h699.425c17.301,0,31.324,14.024,31.324,31.325C984.109,593.563,970.086,607.586,952.785,607.586z">
                            </path>
                          </g>
                          <g>
                            <path fill="#333333" d="M1387.721,794.601H253.36c-17.302,0-31.325-14.024-31.325-31.325c0-17.302,14.023-31.325,31.325-31.325 h1134.36c17.302,0,31.326,14.023,31.326,31.325C1419.047,780.577,1405.022,794.601,1387.721,794.601z">
                            </path>
                          </g>
                          <g>
                            <path fill="#333333" d="M1387.721,981.611H253.36c-17.302,0-31.325-14.023-31.325-31.324c0-17.302,14.023-31.325,31.325-31.325 h1134.36c17.302,0,31.326,14.023,31.326,31.325C1419.047,967.588,1405.022,981.611,1387.721,981.611z">
                            </path>
                          </g>
                          <g>
                            <path fill="#333333" d="M1387.721,1168.627H253.36c-17.302,0-31.325-14.024-31.325-31.325c0-17.302,14.023-31.325,31.325-31.325 h1134.36c17.302,0,31.326,14.023,31.326,31.325C1419.047,1154.603,1405.022,1168.627,1387.721,1168.627z">
                            </path>
                          </g>
                          <g>
                            <path fill="#333333" d="M1712.124,145H244.786c-44.37,0-80.467,36.097-80.467,80.467v85.476h62.65v-85.476 c0-9.824,7.993-17.816,17.817-17.816h1467.338c9.828,0,17.821,7.993,17.821,17.816v968.17c0,9.824-7.993,17.813-17.821,17.813 h-108.769v62.65h108.769c44.374,0,80.472-36.098,80.472-80.463v-968.17C1792.596,181.097,1756.498,145,1712.124,145z">
                            </path>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <h6>LOCATION INFO</h6>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-3 p-2" />

            <div className="col-6 p-2">
              <Link
                to={`/${restaurantName}/offer`}
              >
                <div className="box-set">
                  <div className="box m-0">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                      <g id="SVGRepo_iconCarrier">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6ZM4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8ZM17 15C15.8954 15 15 15.8954 15 17C15 18.1046 15.8954 19 17 19C18.1046 19 19 18.1046 19 17C19 15.8954 18.1046 15 17 15ZM13 17C13 14.7909 14.7909 13 17 13C19.2091 13 21 14.7909 21 17C21 19.2091 19.2091 21 17 21C14.7909 21 13 19.2091 13 17ZM19.7071 6.70711C20.0976 6.31658 20.0976 5.68342 19.7071 5.29289C19.3166 4.90237 18.6834 4.90237 18.2929 5.29289L5.29289 18.2929C4.90237 18.6834 4.90237 19.3166 5.29289 19.7071C5.68342 20.0976 6.31658 20.0976 6.70711 19.7071L19.7071 6.70711Z" fill="#000000" />
                      </g>
                    </svg>
                    <h6>OFFERS</h6>
                  </div>
                </div>
              </Link>

            </div>
            <div className="col-3 p-2" />
          </div>
        </div>
      </div>
    </div>

  );
};

export default HomePage;
