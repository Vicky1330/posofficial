import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "../../../assets/CSS/all_css.css";
import ProductDescriptionModal from "./Models/ProductDescriptionModal";
import SetUpsellCrossSellModal from "./Models/SetUpsellCrossSellModal";
import UpsellAdvancedSettingModal from "./Models/UpsellAdvancedSettingModal";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";

interface UpSellProductLists {
  Id: number;
  Name: string;
  SellingPrice: number;
  ProductImage_LiveURL: string;
  Status: number;
  ProductTypeId: number;
}

interface UpSellProductListResponse {
  status: number;
  message: string;
  data: {
    products: UpSellProductLists[];
  };
}
interface FormData {
  [key: string]: number | string;
}
const UpSellProduct: React.FC = () => {
  const UserToken_Global = localStorage.getItem("authToken");
  const [upsellProducts, setUpsellProducts] = useState<UpSellProductLists[]>(
    []
  );
  const [crossSellProducts, setCrossSellProducts] = useState<
    UpSellProductLists[]
  >([]);
  const [addedCrossSellProducts, setAddedCrossSellProducts] = useState<
    UpSellProductLists[]
  >([]);
  const [addedCrossSellRemoveList, setAddedCrossSellRemoveList] = useState<
    UpSellProductLists[]
  >([]);
  const [upsellByProductRowId, setUpsellByProductRowId] = useState<number>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({});

  const handleRemoveProducts = async () => {
    const rowIds = addedCrossSellRemoveList
      .map((product) => product.Id)
      .join(",");
    const payload = {
      RowIds: rowIds,
      RestaurantLoginId: 0,
    };
    console.log("product to remove: ", addedCrossSellRemoveList);
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }api/restaurant/unlink/upsell/by/product`;
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data.status === 1) {
        fetchAllAddedProducts();
        fetchAllProductLists();
      } else {
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
      }
    }
  };

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchAllProductLists = async () => {
    try {
      const response = await axios.get<UpSellProductListResponse>(
        `${
          import.meta.env.VITE_API_URL
        }api/active/product/list/for/upsell/by/product?restaurantLoginId=0`,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.data.status === 1 &&
        response.data.data.products.length > 0
      ) {
        setUpsellProducts(response.data.data.products);
      }
    } catch (error) {
      console.error("Error fetching combo options:", error);
    }
  };

  const [checkedState, setCheckedState] = useState<{
    [key: string | number]: boolean;
  }>({});

  const handleCheckboxChange = (e: boolean, product: any) => {
    const isChecked = e;
    setCheckedState((prev) => ({
      ...prev,
      [product.Id]: isChecked,
    }));

    if (isChecked) {
      handleSelectProduct(product);
    } else {
      setCrossSellProducts((prev) => prev.filter((p) => p.Id !== product.Id));
      console.log("product removed ", crossSellProducts);
    }

    console.log("Checkbox status:", isChecked ? "on" : "off");
  };

  const handleCrossSellCheckboxChange = (e: boolean, product: any) => {
    console.log(" checked in cross sell");
    const isChecked = e;

    if (isChecked) {
      handleCrossSelectProduct(product);
    } else {
      setAddedCrossSellRemoveList((prev) =>
        prev.filter((p) => p.Id !== product.Id)
      );
      console.log("product removed ", crossSellProducts);
    }

    console.log("Checkbox status:", isChecked ? "on" : "off");
  };

  const handleCrossSelectProduct = (product: any) => {
    if (product) {
      setAddedCrossSellRemoveList((prev) => {
        const updatedProducts = [...(Array.isArray(prev) ? prev : []), product];
        console.log("Updated cross-sell products:", updatedProducts);
        return updatedProducts;
      });
    }
    console.log("appended", crossSellProducts);
  };

  const handleSelectProduct = (product: any) => {
    console.log("Selected product:", product);
    if (product) {
      setCrossSellProducts((prev) => {
        const updatedProducts = [...(Array.isArray(prev) ? prev : []), product];
        console.log("Updated cross-sell products:", updatedProducts);
        return updatedProducts;
      });
    }
    console.log("appended", crossSellProducts);
  };

  const fetchAllAddedProducts = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }api/get/upsell/by/product/list?restaurantLoginId=0`,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data.status === 1 &&
        response.data.data.upsell_by_products.length > 0
      ) {
        setAddedCrossSellProducts(response.data.data.upsell_by_products);
      } else {
        setAddedCrossSellProducts([]);
      }
    } catch (error) {
      console.error("Error fetching combo options:", error);
    }
  };

  const handleAddProducts = () => {
    setAddedCrossSellProducts((prev) => {
      const updatedProducts = [
        ...(Array.isArray(prev) ? prev : []),
        ...crossSellProducts,
      ];

      const uniqueProducts = updatedProducts.reduce((acc, product) => {
        if (!acc.some((p: UpSellProductLists) => p.Id === product.Id)) {
          acc.push(product);
        }
        return acc;
      }, [] as UpSellProductLists[]);

      return uniqueProducts;
    });
  };

  useEffect(() => {
    fetchAllAddedProducts();
  }, []);

  useEffect(() => {
    fetchAllProductLists();
  }, [crossSellProducts]);

  const handleToggle = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
    setUpsellByProductRowId(id);
  };

  const handleSetDescription = () => {
    // setSelectedProductId(productId);
    setDescriptionModalOpen(true);
  };

  const handleModalClose = () => setDescriptionModalOpen(false);

  const handleSetUpsellCrossSell = () => {
    setIsModalOpen(true);
  };

  const handleSetUpsellModalClose = () => setIsModalOpen(false);

  const openSettingsModal = () => {
    setIsModalVisible(true);
  };

  const closeSettingsModal = () => setIsModalVisible(false);

  const handleFormSubmit = handleSubmit(async (data) => {
    if (addedCrossSellProducts.length === 0) {
      toast.error("No products selected for upsell linking!", {
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
      const payload = addedCrossSellProducts.map((product) => {
        const dataValue = data[`upSellProduct_${product.Id}`];
        const selectedOption = JSON.parse(
          typeof dataValue === "string" ? dataValue : "{}"
        );
        return {
          ProductId: product.Id,
          ProductTypeId: product.ProductTypeId,
          UpsellByProductId: selectedOption.id || null,
          UpsellByProductTypeId: selectedOption.typeId || null,
          RestaurantLoginId: "0",
        };
      });
      try {
        const url = `${
          import.meta.env.VITE_API_URL
        }api/restaurant/link/upsell/by/product?RestaurantLoginId=0`;
        const response = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        });
        if (response) {
          console.log("Response: ", response);
          toast.success("Upsell products saved successfully!", {
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
          handleAddProducts();
          fetchAllProductLists();
          fetchAllAddedProducts();
        }
      } catch (error) {
        console.error("Error saving upsell products: ", error);
      }
    }
  });

  return (
    <div className="">
      <div className="modal-open">
        <div
          id="contentWrapper_RestaurantLayout"
          className="w-full p-4 !pb-20  content-wrapper  min-h-screen"
        >
          <div className="top_area_row -translate-y-1">
            <div className="row align-items-center">
              <div className="col-12 col-md-4 col-lg-4">
                <nav>
                  <div className="main_nav_bread sm:mb-3 bg-slate-100">
                    <ol className=" sm:translate-x-5 breadcrumb sm:pl-3 mb-0 sm:mt-3 ">
                      <li className="breadcrumb-item nav_bread_one">
                        <Link
                          className="fs-6 fw-bold"
                          to="/Restaurant/ManageProducts"
                        >
                          Products
                        </Link>
                      </li>
                      <li className="breadcrumb-icon">
                        <i className="fa fa-angle-right" aria-hidden="true"></i>
                      </li>
                      <li className="breadcrumb-item nav_bread_two">
                        <a href="javascript:;" id="ProductFormName_ProductForm">
                          <span className="fs-6 fw-bold">
                            Upsell By Product
                          </span>
                        </a>
                      </li>
                    </ol>
                  </div>
                </nav>
              </div>
            </div>

            <div className="pb-5 wrap_tabs-products sidebar_ul-nav_tabs">
              <div className="tab-content !pt-8 sm:!pt-0 !px-0">
                <form onSubmit={handleFormSubmit}>
                  <div className="upsell-cross-main">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mt-0 upsell-cross-inner upsell-cross-inner-2">
                          <div className="upsell-cross-overflow">
                            <h3>Product List</h3>
                            <div
                              className="cross-scroll"
                              id="cross-scroll-upsell"
                            >
                              <Table
                                striped
                                bordered
                                hover
                                id="product_list_table"
                              >
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th className="text-center">Photo</th>
                                    <th className="text-center">Name</th>
                                    <th className="text-center">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {upsellProducts.map((product: any, index) => (
                                    <tr key={product.Id}>
                                      <td className="relative p-4">
                                        <input
                                          type="checkbox"
                                          className="translate-x-2 -translate-y-2 form-check-input upsellProductCheck"
                                          id={`upsellProductCheck${index}`}
                                          data-id={product.Id}
                                          checked={
                                            checkedState[product.Id] ??
                                            product.Is_UpsellItem === 1
                                          }
                                          disabled={product.Is_UpsellItem === 1}
                                          onChange={(e) => {
                                            handleCheckboxChange(
                                              e.target.checked,
                                              product
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <img
                                          src={product.ProductImage_LiveURL}
                                          alt={product.Name}
                                          width="50"
                                          height="50"
                                        />
                                      </td>
                                      <td className="text-center">
                                        {product.Name}
                                      </td>
                                      <td className="text-center">
                                        ${product.SellingPrice}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="upsell-cross-inner upsell-cross-inner-2">
                          <div className="upsell-cross-overflow">
                            <h3>Item Upsell / Cross Sell</h3>
                            <div
                              className="cross-scroll"
                              id="cross-scroll-upsell"
                            >
                              <Table
                                striped
                                bordered
                                hover
                                id="upsell_by_product_list"
                              >
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th className="text-center">Name</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-center">
                                      Upsell Product
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {addedCrossSellProducts.map(
                                    (product: any, index) => {
                                      const defaultValue =
                                        product.UpsellByProductId
                                          ? JSON.stringify({
                                              id: product.UpsellByProductId,
                                              typeId: upsellProducts.find(
                                                (option) =>
                                                  option.Id ===
                                                  product.UpsellByProductId
                                              )?.ProductTypeId,
                                            })
                                          : "";

                                      const selectedValue = watch(
                                        `upSellProduct_${product.Id}`
                                      );

                                      return (
                                        <tr key={`upsell-${product.Id}`}>
                                          <td className="relative p-4">
                                            <input
                                              type="checkbox"
                                              className="translate-x-2 -translate-y-2 form-check-input upsellProductCheck"
                                              id={`upsellProductCheck${index}`}
                                              data-id={product.Id}
                                              onChange={(e) =>
                                                handleCrossSellCheckboxChange(
                                                  e.target.checked,
                                                  product
                                                )
                                              }
                                            />
                                          </td>
                                          <td className="text-center">
                                            {product?.Name ??
                                              product.ProductName}
                                          </td>
                                          <td className="text-center">
                                            ${product.SellingPrice}
                                          </td>
                                          <td
                                            className="d-flex align-items-center"
                                            style={{ width: "300px" }}
                                          >
                                            <div className="flex flex-col">
                                              <select
                                                className={`px-2 form-control upsellByProductListDropdown mr-2`}
                                                {...register(
                                                  `upSellProduct_${product.Id}`,
                                                  {
                                                    required:
                                                      "This field is required",
                                                    validate: (value: any) => {
                                                      if (defaultValue) {
                                                        return true;
                                                      }
                                                      if (!value) {
                                                        return "This field is required";
                                                      }
                                                      return true;
                                                    },
                                                  }
                                                )}
                                                value={
                                                  selectedValue || defaultValue
                                                }
                                                onChange={(e) => {
                                                  const selectedValue =
                                                    e.target.value;
                                                  setValue(
                                                    `upSellProduct_${product.Id}`,
                                                    selectedValue,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
                                              >
                                                <option value="">Select</option>
                                                {upsellProducts.map(
                                                  (option) => (
                                                    <option
                                                      key={option.Id}
                                                      value={JSON.stringify({
                                                        id: option.Id,
                                                        typeId:
                                                          option.ProductTypeId,
                                                      })}
                                                    >
                                                      {option.Name}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                              <div>
                                                {errors[
                                                  `upSellProduct_${product.Id}`
                                                ] && (
                                                  <span className="text-danger">
                                                    {
                                                      errors[
                                                        `upSellProduct_${product.Id}`
                                                      ]?.message
                                                    }
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="dropdown">
                                              <button
                                                className="btn text-dark dropdown-toggle"
                                                type="button"
                                                id={`dropdownMenuButton-${product.Id}`}
                                                data-bs-toggle="dropdown"
                                                aria-expanded={
                                                  openDropdown === product.Id
                                                    ? "true"
                                                    : "false"
                                                }
                                                onClick={() =>
                                                  handleToggle(product.Id)
                                                }
                                                style={{
                                                  textDecoration: "none",
                                                  border: "none",
                                                }}
                                              >
                                                <i
                                                  className="fa fa-ellipsis-h"
                                                  aria-hidden="true"
                                                ></i>
                                              </button>
                                              <ul
                                                className={`dropdown-menu ${
                                                  openDropdown === product.Id
                                                    ? "show"
                                                    : ""
                                                }`}
                                                aria-labelledby={`dropdownMenuButton-${product.Id}`}
                                              >
                                                <li>
                                                  <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={() =>
                                                      handleSetDescription()
                                                    }
                                                  >
                                                    Set Description
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={() =>
                                                      handleSetUpsellCrossSell()
                                                    }
                                                  >
                                                    Set Upsell/Cross-Sell
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={() =>
                                                      openSettingsModal()
                                                    }
                                                  >
                                                    Settings
                                                  </button>
                                                </li>
                                              </ul>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" justify-end  absolute mt-3 right-0 inline-flex">
                      <div className="grid grid-rows-2 sm:grid-cols-2">
                        <button
                          className="row-span-1 sm:col-span-1 bg-[#1b5703] text-center min-w-24  max-w-24 m-1 text-white border-none rounded-md px-3 py-0.3 text-base font-[16px]"
                          type="submit"
                        >
                          Submit
                        </button>
                        <button
                          className="m-1 min-w-24 max-w-24 bg-[#1b5703] text-white border-none rounded-md px-3 py-0.4 text-base font-[16px]"
                          onClick={handleRemoveProducts}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="flex mt-3 absolute flex-col sm:flex-row">
                  <button
                    className=" m-1 min-w-24 max-w-24 bg-[#1b5703] text-white border-none rounded-md px-9 py-0.4 text-base font-[16px]"
                    onClick={handleAddProducts}
                  >
                    Add
                  </button>
                  <button className=" m-1 min-w-24 max-w-24 bg-[#1b5703] text-white border-none rounded-md px-9 py-0.4 text-base font-[16px]">
                    <Link
                      className="text-light"
                      to="/Restaurant/ManageProducts"
                    >
                      Exit
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for each action */}
      <ProductDescriptionModal
        show={isDescriptionModalOpen}
        onClose={handleModalClose}
        productId={upsellByProductRowId || 0}
      />

      <SetUpsellCrossSellModal
        show={isModalOpen}
        onClose={handleSetUpsellModalClose}
        productId={upsellByProductRowId || 0}
      />

      <UpsellAdvancedSettingModal
        show={isModalVisible}
        onClose={closeSettingsModal}
        productId={upsellByProductRowId || 0}
      />

      {/* Modals */}
    </div>
  );
};

export default UpSellProduct;
