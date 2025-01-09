import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title?: string;
  // backBtnFromOfferToHome: () => void;
  toggleMenu: () => void;
  // toggleMenuFullServiceEMenu1: (element: HTMLDivElement) => void;
  // toggleInteractiveEMenu1: (element: HTMLDivElement) => void;
};

const MobileNavbar: React.FC<Props> = ({
  title,
  // backBtnFromOfferToHome,
  toggleMenu,
  // toggleMenuFullServiceEMenu1,
  // toggleInteractiveEMenu1,
}) => {
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="location-detail !fixed w-full">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2 text-left">
              <a
                id="back_wrap-button"
                onClick={() => handleBackButton()}
                data-id="1"
                className=""
              >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
              </a>
            </div>
            <div className="col-8">
              <h6 id="ChangeTxtHeaderMobileView" className="">
                {title ? title : "CATEGORY"}
              </h6>
            </div>
            <div className="col-2">
              <div className="menubox feedback-box">
                <div
                  className="toggle-wrap"
                  id="ToggleMenuBar"
                  onClick={toggleMenu}
                >
                  <span>
                    <i className="fa fa-bars" aria-hidden="true"></i>
                  </span>
                </div>
                <div
                  className="toggle-wrap d-none"
                  id="toggleMenuFullServiceEMenu1"
                  // onClick={(e) => toggleMenuFullServiceEMenu1(e.currentTarget)}
                >
                  <span>
                    <i className="fa fa-bars" aria-hidden="true"></i>
                  </span>
                </div>
                <div
                  className="toggle-wrap d-none"
                  id="toggleInteractiveEMenu1"
                  // onClick={(e) => toggleInteractiveEMenu1(e.currentTarget)}
                >
                  <span>
                    <i className="fa fa-bars" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-14"></div>
    </div>
  );
};

export default MobileNavbar;
