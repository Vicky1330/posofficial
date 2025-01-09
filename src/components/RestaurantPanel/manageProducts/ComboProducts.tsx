import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ComboProductItemVisibilitySetup from "./ComboProductItemVisibilitySetup";
import ComboProductAddProductForm from "./ComboProductAddProductForm";
import ComboProductPrinterAllocationTab from "./ComboProductPrinterAllocationTab";
import ComboProductComboOption from "./ComboProductComboOption";
import { Bounce, toast } from "react-toastify";
import axios from "axios";

interface ProductData {
  RowID: number;
  ProductId: number;
  CreatedOn: string;
  ProductType: number;
  ProductStatus: string;
}

const ComboProducts: React.FC = () => {
  const [productId, setProductId] = useState('');
  const [searchParams] = useSearchParams();
  // const [loading, setLoading] = useState<boolean>(true);
  const [currentPrev, setCurrentPrev] = useState<ProductData[]>([]);
  const navigate = useNavigate();
  const UserToken_Global = localStorage.getItem("authToken");


  const getNextProduct = async (Id: number) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}api/get/product/previousandnextproductId?productId=${Id}&typeId=${2}&restaurantLoginId=0`;
    try {
      // setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json"
        }
      });
      if (response.data.status === 1 && response.status === 200) {
        setCurrentPrev(response.data.data.productIds);
        console.log(Id);
        console.log("revenes", response.data.data.productIds)
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
      // setLoading(false);
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
    console.log("next", currentPrev);
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

  const [activeTab, setActiveTab] = useState("AddUpdateProduct_tab");

  // Function to handle tab change
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };


  useEffect(() => {
    const productIdFromQuery = searchParams.get("Id");
    if (productIdFromQuery) {
      setProductId(productIdFromQuery);
      const productIdParsed = parseInt(productIdFromQuery, 10);
      getNextProduct(productIdParsed);
    }
    
  }, [searchParams]);

  return (
    <div className="product-body">
      <div className="container-scroller">
        <div className="page-body-wrapper">
          <div id="contentWrapper_RestaurantLayout" className="content-wrapper">
            <div className="top_area_row pb-0">
              <div className="row align-items-center gap-1">
                {/* Breadcrumb Section */}

                <div className="col-12 col-md-4 col-lg-4">
                  <section>
                    <div className="main_nav_bread">
                      <ol className="sm:translate-x-2 breadcrumb pl-4">
                        <li className="breadcrumb-item nav_bread_one">
                          <Link className="fs-6 fw-bold " to="/Restaurant/ManageProducts">
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
                          <Link
                            to=""
                            className="fs-6 fw-bold"
                            id="ProductFormName_ProductForm"
                          >
                            {productId ? "Edit" : "Add"} Combo-Product
                          </Link>
                        </li>
                      </ol>
                    </div>
                  </section>
                </div>
                {productId && (
                  <div className="col-12 col-md-4 col-lg-4 flex justify-center ">
                    <div id="dv_AddNewProductSection_AddUpdateProduct">
                      <button
                        className="btn-primary ProductPageBtnCommanClass"
                        style={{ backgroundColor: "#1b5703" }}
                        onClick={() => navigate('/Restaurant/ComboProduct')}
                      >
                        + Add New Combo-Product
                      </button>
                    </div>
                  </div>
                )}
                {productId && (
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
                </div>
                )}
              </div>
            </div>

            <div className="mt-0 p-0 wrap_tabs-products sidebar_ul-nav_tabs wrao_sidebrs">
              <ul className="text-center nav nav-pills footer_nav-tabs !flex flex-col sm:!flex-row !flex-wrap" role="tablist">
                <li className="nav-item sm:!w-[25%] !w-full">
                  <a
                    id="a_GeneralTab_AddUpdateProduct"
                    className={`nav-link anchorButtonProductCommonClass ${activeTab === "AddUpdateProduct_tab" ? "active" : ""
                      }`}
                    onClick={() => handleTabClick("AddUpdateProduct_tab")}
                    // href="#AddUpdateProduct_tab"
                  >
                    General
                  </a>
                </li>
                <li className="nav-item sm:!w-[25%] !w-full">
                  <a
                    id="a_tab_ComboOption_AddUpdateProduct"
                    className={`nav-link px-0 anchorButtonProductCommonClass ${activeTab === "ComboOption_tab" ? "active" : ""
                      }`}
                    onClick={() => handleTabClick("ComboOption_tab")}
                    // href="#ComboOption_tab"
                  >
                    Combo Option
                  </a>
                </li>
                <li className="nav-item sm:!w-[25%] !w-full">
                  <a
                    id="a_tab_PrintersAllocation_AddUpdateProduct"
                    className={`nav-link px-0 anchorButtonProductCommonClass ${activeTab === "PrinterSetup_tab" ? "active" : ""
                      }`}
                    onClick={() => handleTabClick("PrinterSetup_tab")}
                    // href="#PrinterSetup_tab"
                  >
                    Printers Allocation
                  </a>
                </li>
                <li className="nav-item sm:!w-[25%] !w-full">
                  <a
                    id="a_tab_ItemVisibility_AddUpdateProduct"
                    className={`nav-link px-0 anchorButtonProductCommonClass ${activeTab === "ItemVisibilitySetup_tab" ? "active" : ""}`}
                    onClick={() => handleTabClick("ItemVisibilitySetup_tab")}
                  >
                    Item Visibility
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div
                  id="AddUpdateProduct_tab"
                  className={`tab-pane ${activeTab === "AddUpdateProduct_tab" ? "active" : ""
                    }`}
                >
                  <ComboProductAddProductForm />
                </div>
                <div
                  id="AddUpdateProduct_tab"
                  className={`tab-pane ${activeTab === "ComboOption_tab" ? "active" : ""
                    }`}
                >
                  <ComboProductComboOption />
                </div>

                <div
                  id="PrinterSetup_tab"
                  className={`tab-pane ${activeTab === "PrinterSetup_tab" ? "active" : ""}`}
                >
                  <ComboProductPrinterAllocationTab />
                </div>

                <div
                  id="ItemVisibilitySetup_tab"
                  className={`tab-pane ${activeTab === "ItemVisibilitySetup_tab" ? "active" : ""}`}>
                  <ComboProductItemVisibilitySetup />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboProducts;
