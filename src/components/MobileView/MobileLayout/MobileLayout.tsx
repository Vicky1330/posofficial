import React, { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import MobileNavbar from "./MobileNavbar";
import { Outlet } from "react-router-dom";
import "../../../assets/CSS/MobileView/mobile_view_css.css";
// import DepartmentList from "../../../pages/MobileView/DepartmentList";
import MobileFooter from "./MobileFooter";

const MobileLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [navbarTitle, setNavbarTitle] = useState<string>("PRODUCT");
  // const navigate = useNavigate();

  const toggleSidebarOption = () => setSidebarOpen(!sidebarOpen);

  const handleTitleChange = (title: string) => {
    setNavbarTitle(title);
    console.log("title changed", navbarTitle);
  };

  // const backBtnFromOfferToHome = () => {
  //   // const navigate = useNavigate();
  //   navigate('/'); 
  // };
  
  // const toggleMenuFullServiceEMenu1 = (element: HTMLDivElement) => {
  //   console.log("Toggle full service menu", element);
  // };

  // const toggleInteractiveEMenu1 = (element: HTMLDivElement) => {
  //   console.log("Toggle interactive menu", element);
  // };

  return (
    <div className="MobilePartialViewLayout z-10">
      <div className="bg-body relative">
        {/* {/ sidebar section /} */}
        <div
          className={`z-11 absolute top-0 left-0 w-full transition-transform duration-300 `}
        >
          <MobileSidebar
            isOpen={sidebarOpen}
            onTitleChange={handleTitleChange}
          />
        </div>

        {/* {/ navbar section /} */}
        <div className={`relative !z-10`}>
          <MobileNavbar
            title={navbarTitle}
            // backBtnFromOfferToHome={backBtnFromOfferToHome}
            toggleMenu={toggleSidebarOption}
            // toggleMenuFullServiceEMenu1={toggleMenuFullServiceEMenu1}
            // toggleInteractiveEMenu1={toggleInteractiveEMenu1}
          />
        </div>

        {/* {/ Main content Section /} */}
        <div className="relative z-9">
          <Outlet />
        </div>

        <div className="relative !z-3">
          <MobileFooter />
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;

