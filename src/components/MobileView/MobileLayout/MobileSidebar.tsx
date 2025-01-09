import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onTitleChange: (title: string) => void;
};

const MobileSidebar: React.FC<Props> = ({
  isOpen,
  onTitleChange
}) => {
  const [isActive, setIsActive] = useState("PRODUCT");
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(isOpen);

  const handleItemClick = (title: string) => {
    onTitleChange(title);
    setIsActive(title);
    setSidebarOpen(false);
  };

  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);

  return (
    <aside id="myAsideMenu" className={`${sidebarOpen ? 'active' : ''}`}>
      <h6>Quick Menu</h6>
      <ul id="QuickMenuMobileView">
        <li>
          <Link id="Store_Home" className={`textbtn ${isActive === "HOME" ? "active" : ""}`}
            onClick={() => handleItemClick("HOME")}
            to={`/${restaurantName}/Customer/Index`}
          >
            <i className="fa fa-home" aria-hidden="true"></i>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link
            onClick={() => handleItemClick("PRODUCTS")}
            to={`/${restaurantName}/departments`}
            className={`textbtn ${isActive === "PRODUCTS" ? "active" : ""}`}
            id="Store_Product"
          >
            <i className="fa fa-file-text-o" aria-hidden="true"></i>
            <span>Products</span>
          </Link>
        </li>

        <li>
          <Link
            className={`textbtn ${isActive === "OFFERS" ? "active" : ""}`}
            onClick={() => handleItemClick("OFFERS")}
            to={`/${restaurantName}/offer`}
          >
            <i className="fa fa-percent" aria-hidden="true"></i>
            <span>Offers</span>
          </Link>
        </li>

        <li>
          <Link
            className={`textbtn ${isActive === "LOCATION" ? "active" : ""}`}
            onClick={() => handleItemClick("LOCATION")}
            to={`/${restaurantName}/location-info`}
            id="Store_Location"
          >
            <i className="fa fa-location-arrow" aria-hidden="true"></i>
            <span>Location</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default MobileSidebar;
