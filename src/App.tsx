import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RestaurantLogin from './pages/RestaurantLogin'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/RestaurantPanel/Dashboard';
import Layout from './components/Layout/Layout';
import ManageProfile from './pages/RestaurantPanel/ManageProfile';
import ManageReports from './pages/RestaurantPanel/ManageReports';
import ManageProducts from './pages/RestaurantPanel/ManageProducts';
import MainDepartment from './components/RestaurantPanel/manageProducts/MainDepartment';
import AddDepartment from './components/RestaurantPanel/manageProducts/AddDepartment';
import AddPrintGroup from './components/RestaurantPanel/manageProducts/AddPrintGroup';
import AddProduct from './components/RestaurantPanel/manageProducts/AddProduct';
import UpSellProduct from './components/RestaurantPanel/manageProducts/UpSellProduct';
import ImportProducts from './components/RestaurantPanel/manageProducts/ImportProducts';
import SpeedTool from './components/RestaurantPanel/manageProducts/SpeedTool';
import ComboProducts from './components/RestaurantPanel/manageProducts/ComboProducts';
import SoftwareSetting from './pages/RestaurantPanel/SoftwareSetting';
import MenuSetup from './pages/RestaurantPanel/MenuSetup';
import StoreQR from './components/RestaurantPanel/peripherals/StoreQR';
import Stripesetup from './components/RestaurantPanel/peripherals/Stripesetup';
import ManageOrders from './components/RestaurantPanel/peripherals/ManageOrders';
import POSmenu from './components/RestaurantPanel/menusetup/POSmenu';
import KIOSMenu from './components/RestaurantPanel/menusetup/KIOSMenu';
import TableQR from './components/RestaurantPanel/peripherals/TableQR';
import ManageReasons from './pages/RestaurantPanel/ManageReasons';
import HomePage from './pages/MobileView/HomePage';
import MobileLayout from './components/MobileView/MobileLayout/MobileLayout';
import DepartmentList from './pages/MobileView/DepartmentList';
import ProductsMobileView from './components/MobileView/ProductsMobileView';
import AddToCartMobileView from './components/MobileView/AddToCartMobileView';
import DeliveryPreference from './components/MobileView/DeliveryPreference';
import OrderPreference from "./components/MobileView/ChoosePickupOrderOptions";
import LocationDetails from './pages/MobileView/LocationDetails';
import ServiceHours from './components/MobileView/LocationInfo/ServiceHours';
import DeliveryZone from './components/MobileView/LocationInfo/DeliveryZone';
import PaymentMethod from './components/MobileView/LocationInfo/PaymentMethod';
import ContactUs from './components/MobileView/LocationInfo/ContactUs';
import OfferSection from './components/MobileView/Offer/OfferSection';
import ProductDetails from './components/MobileView/ProductDetails';
import OrderDetails from './components/MobileView/OrderDetails';
import ConfirmOrder from './components/MobileView/ConfirmOrder';
import OrderPlaced from './components/MobileView/OrderPlaced';
// import "../src/assets/CSS/all_css.css";

function App() {

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.replace('/restaurant/login');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Restaurant/Login" element={<RestaurantLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Layout />}>

          <Route path="/Restaurant/Dashboard" element={<Dashboard />} />
          <Route path="/Restaurant/ManageProfile" element={<ManageProfile />} />
          <Route path="/Restaurant/ManageReports" element={<ManageReports />} />
          <Route path="/Restaurant/ManageProducts" element={<ManageProducts />} />
          <Route
            path="/Restaurant/MainDepartment"
            element={<MainDepartment />}
          />
          <Route
            path="/Restaurant/AddDepartment"
            element={<AddDepartment />}
          />
          <Route
            path="/Restaurant/PrintGroup"
            element={<AddPrintGroup />}
          />
          <Route path="/Restaurant/Product" element={<AddProduct />} />
          <Route
            path="/Restaurant/UpsellByProduct"
            element={<UpSellProduct />}
          />
          <Route
            path="/Restaurant/ImportProducts"
            element={<ImportProducts />}
          />
          <Route path="/Restaurant/MultiItemProgramming" element={<SpeedTool />} />
          <Route
            path="/Restaurant/ComboProduct"
            element={<ComboProducts />}
          />

          <Route path="/Restaurant/ManageSoftwareSettings" element={<SoftwareSetting />} />
          <Route path="/Restaurant/MenuSetup" element={<MenuSetup />} />
          <Route path="/Restaurant/POSMenuSetup" element={<POSmenu />} />
          <Route path="/Restaurant/KIOSKMenuSetup" element={<KIOSMenu />} />
          <Route path="/Restaurant/StoreQRCode" element={<StoreQR />} />
          <Route path="/Restaurant/TableQr" element={<TableQR />} />
          <Route path="/Restaurant/StripeSetup" element={<Stripesetup />} />
          <Route path="/Restaurant/ManageOrders" element={<ManageOrders />} />
          <Route path="/Restaurant/ManageReasons" element={<ManageReasons />} />

        </Route>

        {/* ============== Mobile View ========================== */}
        {/* Route without MobileLayout */}
        <Route path="/:restaurantName/Customer/Index" element={<HomePage />} />

        {/* Routes with MobileLayout */}
        <Route path="/" element={<MobileLayout />}>
          <Route path="/:restaurantName/departments" element={<DepartmentList />} />
          <Route path="/:restaurantName/products/:departmentId" element={<ProductsMobileView />} />
          <Route path="/:restaurantName/addToCart/:productId" element={<AddToCartMobileView />} />
          <Route path="/:restaurantName/add-address" element={<DeliveryPreference />} />
          <Route path="/:restaurantName/order/preference" element={<OrderPreference />} />
          <Route path="/:restaurantName/location-info" element={<LocationDetails />} />
          <Route path="/:restaurantName/location-info/service-hours" element={<ServiceHours />} />
          <Route path="/:restaurantName/location-info/delivery-zones" element={<DeliveryZone />} />
          <Route path="/:restaurantName/location-info/payment-method" element={<PaymentMethod />} />
          <Route path="/:restaurantName/location-info/contact-us" element={<ContactUs />} />
          <Route path="/:restaurantName/offer" element={<OfferSection />} />
          <Route path="/:restaurantName/add/comboItems/:productId" element={<ProductDetails />} />
          <Route path="/:restaurantName/order-details" element={<OrderDetails />} />
          <Route path="/:restaurantName/confirm-order" element={<ConfirmOrder />} />
          <Route path="/:restaurantName/order-placed" element={<OrderPlaced />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
