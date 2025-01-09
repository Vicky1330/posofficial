import React, { useEffect, useState } from "react";
import "../../../assets/CSS/manageProducts/addProduct.css";
import AddProductForm from "./AddProductForm";
import PrinterAllocationTab from "./PrinterAllocationTab";
import ItemVisibilitySetup from "./ItemVisibilitySetup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ModifierSetup from "./ModifierSetup";
import { Bounce, toast } from "react-toastify";


interface ProductVisibilityDetail {
  Id: number;
  ProductId: number;
  POS: number;
  Kiosk: number;
  WebMenu: number;
  Customer: number;
  CreatedOn: string;
  CreatedByLoginId: number;
  UpdatedOn: string;
  UpdatedByLoginId: number;
  TableQR: number;
  StoreQR: number;
}

interface ProductData {
  RowID: number;
  ProductId: number;
  CreatedOn: string;
  ProductType: number;
  ProductStatus: string;
}

const AddProduct: React.FC = () => {
  const [activeTab, setActiveTab] = useState("AddUpdateProduct_tab");
  const [editProductPage, setEditProductPage] = useState<boolean>(false)

  const UserToken_Global = localStorage.getItem("authToken")
  const [loading, setLoading] = useState<boolean>(true);
  const [productId, setProductId] = useState<number>(0);
  const [ProductVisibilityDetail, setProductVisibilityDetail] = useState<ProductVisibilityDetail>();
  const [currentPrev, setCurrentPrev] = useState<ProductData[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
  };

  const getProductById = async (productId: number) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/single/product?Id=${productId}&restaurantLoginId=0`; 

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data.status === 1) {
        const itemVisibility = response.data.data.products[0]?.ProductVisibilityDetail || [];
        setProductVisibilityDetail(itemVisibility);
        getNextProduct(response.data.data.products[0].Id, response.data.data.products[0].ProductTypeId)
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const getNextProduct = async (Id: number, typeId: number) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}api/get/product/previousandnextproductId?productId=${Id}&typeId=${typeId}&restaurantLoginId=0`;
    try {
      setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json"
        }
      });
      if (response.data.status === 1 && response.status === 200) {
        setCurrentPrev(response.data.data.productIds);
      }
      else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error("Unauthorized! Invalid Token!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          } else {
            toast.error("There is some technical error, please try again!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        }
      } else {
        toast.error("An unexpected Del error occurred!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
    finally {
      setLoading(false);
    }
  }

  const previousProduct = () => {
    const previousProduct = currentPrev.find((product) => product.ProductStatus === "Previous");
    if (previousProduct) {
      const productId = previousProduct.ProductId;
      const productTypeId = previousProduct.ProductType;
      if (productTypeId === 1) {
        navigate(`/Restaurant/Product?productId=${productId}`);
      } else {
        navigate(`/Restaurant/ComboProduct?Id=${productId}`);
      }
    } else {
      toast.warning("No previous product available!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const nextProduct = () => {
    const nextProduct = currentPrev.find((product) => product.ProductStatus === "Next");
    if (nextProduct) {
      const productId = nextProduct.ProductId;
      const productTypeId = nextProduct.ProductType;
      if (productTypeId === 1) {
        navigate(`/Restaurant/Product?productId=${productId}`);
      } else {
        navigate(`/Restaurant/ComboProduct?Id=${productId}`);
      }
    } else {
      toast.warning("No next product available!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    const productIdFromQuery = searchParams.get("productId");

    if (productIdFromQuery) {
      const productIdParsed = parseInt(productIdFromQuery, 10);
      setEditProductPage(true);
      setProductId(productIdParsed);
      getProductById(productIdParsed);
    } else {
      setEditProductPage(false);
    }
  }, [searchParams]); 
  return (
    <div className="product-body">
      {loading && (<div style={{
        backgroundColor: "#f0f5f0",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "300%",
        zIndex: 999999999999999,
        MozOpacity: 0.2,
        opacity: 0.2,
      }}>
        <img src="/Content/Images/Loader.gif" style={{
          backgroundColor: "#9af58c",
          alignItems: "center",
          position: "fixed",
          top: "40%",
          width: "10%",
          left: "50%",
        }} />
      </div>)}
      <div className="container-scroller">
        <div className="page-body-wrapper">
          <div id="contentWrapper_RestaurantLayout" className="content-wrapper">
            <div className="top_area_row pb-0">
              <div className="row align-items-center">
                {/* Breadcrumb Section */}
                <div className="col-12 col-md-4 col-lg-4">
                  <section>
                    <div className="main_nav_bread">
                      <ol className="sm:translate-x-2 breadcrumb pl-4 mb-0">
                        <li className="breadcrumb-item nav_bread_one">
                          <Link
                            className="fs-6 fw-bold "
                            to="/Restaurant/ManageProducts"
                            // onClick={backToProducts}
                          >
                            Products
                          </Link>
                        </li>
                        <li className="breadcrumb-icon">
                          <i
                            className="fa fa-angle-right"
                            aria-hidden="true"
                          ></i>
                        </li>
                        <li className="breadcrumb-item nav_bread_two">
                          <Link to=""
                            className="fs-6 fw-bold"
                            id="ProductFormName_ProductForm"
                          >
                            {editProductPage ? 'Edit' : 'Add'} Product
                          </Link>
                        </li>
                      </ol>
                    </div>
                  </section>
                </div>

                {/* Add New Product Button */}
                {editProductPage && (<div className="col-12 col-md-4 col-lg-4 flex justify-center ">
                  <div id="dv_AddNewProductSection_AddUpdateProduct">
                    <button
                      className="btn-primary ProductPageBtnCommanClass"
                      style={{ backgroundColor: "#1b5703" }}
                      onClick={() => navigate('/Restaurant/Product')}
                    >
                      + Add New Product
                    </button>
                  </div>
                </div>
                )}

                {editProductPage && (
                  <div className="pl-0 sm:pl-2 flex justify-between items-center">
                    <a
                      href="javascript:;"
                      id="dv_PreviousProductSection_AddUpdateProduct"
                      className="btn-primary productbx anchorButtonProductCommonClass bg-indigo-600 text-white d-flex align-items-center mb-2 me-2"
                      onClick={previousProduct}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <i className="fa fa-angle-left text-center" aria-hidden="true"></i>
                      <span className="ms-2">Previous</span>
                    </a>
                    <a
                      href="javascript:;"
                      id="dv_NextProductSection_AddUpdateProduct"
                      className="btn-primary productbx anchorButtonProductCommonClass bg-indigo-600 text-white d-flex align-items-center mb-2"
                      onClick={nextProduct}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <span className="me-2 pl-3"> Next</span>
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                  </div>)}

              </div>
            </div>

            <div className="wrap_tabs-products sidebar_ul-nav_tabs wrao_sidebrs mt-0">
              <ul className="nav nav-pills footer_nav-tabs !flex flex-col sm:!flex-row !flex-wrap" role="tablist">
                <li className="nav-item  sm:!w-[25%] !w-full ">
                  <a
                    id="a_GeneralTab_AddUpdateProduct"
                    className={`nav-link anchorButtonProductCommonClass ${
                      activeTab === "AddUpdateProduct_tab" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("AddUpdateProduct_tab")}
                    href="#AddUpdateProduct_tab"
                  >
                    General
                  </a>
                </li>
                <li className="nav-item  sm:!w-[25%] !w-full">
                  <a
                    id="a_tab_ModifierSetup_AddUpdateProduct"
                    className={`nav-link px-0 anchorButtonProductCommonClass ${
                      activeTab === "ModifierSetup_tab" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("ModifierSetup_tab")}
                    href="#ModifierSetup_tab"
                  >
                    Modifier Setup
                  </a>
                </li>
                <li className="nav-item  sm:!w-[25%] !w-full">
                  <a
                    id="a_tab_PrintersAllocation_AddUpdateProduct"
                    className={`nav-link px-0 anchorButtonProductCommonClass ${
                      activeTab === "PrinterSetup_tab" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("PrinterSetup_tab")}
                    href="#PrinterSetup_tab"
                  >
                    Printers Allocation
                  </a>
                </li>
                <li className="nav-item  sm:!w-[25%] !w-full">
                  <a
                    id="a_tab_ItemVisibility_AddUpdateProduct"
                    className={`nav-link px-0 anchorButtonProductCommonClass ${
                      activeTab === "ItemVisibilitySetup_tab" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("ItemVisibilitySetup_tab")}
                    href="#ItemVisibilitySetup_tab"
                  >
                    Item Visibility
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  id="AddUpdateProduct_tab"
                  className={`tab-pane ${
                    activeTab === "AddUpdateProduct_tab" ? "active" : ""
                  }`}
                >
                  {/* Form will be placed here */}
                  <AddProductForm
                    setLoading={setLoading}
                    loading={loading}
                  />
                </div>
                {/* You can add other tab contents here as per your requirement */}
                <div
                  id="ModifierSetup_tab"
                  className={`tab-pane ${
                    activeTab === "ModifierSetup_tab" ? "active" : ""
                  }`}
                >
                  <ModifierSetup
                    selectedProductId={productId}
                  />
                </div>
                <div
                  id="PrinterSetup_tab"
                  className={`tab-pane ${
                    activeTab === "PrinterSetup_tab" ? "active" : ""
                  }`}
                >
                  <PrinterAllocationTab />
                </div>
                <div
                  id="ItemVisibilitySetup_tab"
                  className={`tab-pane ${
                    activeTab === "ItemVisibilitySetup_tab" ? "active" : ""
                  }`}
                >
                  <ItemVisibilitySetup
                    itemVisibility={ProductVisibilityDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default AddProduct;
