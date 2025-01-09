import React, { useState,useLayoutEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";

const ProductsMobileView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("0");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const { departmentId } = useParams<{ departmentId: string }>();
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const wpToken = localStorage.getItem('guest_wptoken') || "";

  // fetch products
  const fetchProducts = async (departmentId: any, token: string) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }api/customer/subdepartment/product/list?SubDepartmentId=${departmentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.data.productList;
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/customer/subdepartment/list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${wpToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();

      setCategories(data.data.subDepartmentList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  useLayoutEffect(() => {
    fetchCategories();

    const fetchProductData = async () => {
      setLoading(true);
      setError("");
      try {
        const deptId =
          selectedCategory !== "0" ? selectedCategory : departmentId;
        const productList = await fetchProducts(deptId, wpToken);
        setProducts(productList);
      } catch (err: any) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  },[selectedCategory, wpToken]);

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="">
        <Skeleton width={375} height={60} className="shadow-md col-span-2" />
        <div className="grid grid-cols-2 gap-4 mx-4 mt-4">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="cat_list_main">
                <Skeleton width={160} height={100} />
                <Skeleton width={120} height={20} className="ml-2 mt-3" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div id="divmainSectionMobileView">
      <div id="Products_MobileView">
        <style>
          {`
              .categoreies-page2 {
                  position: sticky;
                  top: -2px;
                  z-index: 998;
              }
          `}
        </style>
        <div className="fixed z-10 !w-full ">
          <div className=" mx-0 px-0 ">
            <form>
              <div className="flex items-center">
                {/* Search Input */}
                <div className="flex-1 relative">
                  {/* Search Icon */}
                  <div className="absolute inset-y-0 left-2 flex items-center text-gray-400">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </div>
                  <input
                    type="text"
                    id="txtSearchProducts_RestaurantMobileView"
                    className="w-full pl-10 pr-4 py-[17px] border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Search.."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                {/* Category Select */}
                <div className="flex-1">
                  <select
                    id="ddl_RestaurantCategoriesListMobileView"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full py-[18px] px-4 border bg-gray-200 border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {categories.map((subDepartment) => (
                      <option
                        key={subDepartment.Id}
                        value={subDepartment.Id}
                        className="subDepartmentNameMobileView"
                        data-nav-id={subDepartment.Name}
                      >
                        {subDepartment.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="h-16"></div>
        <div className="categories-space">
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}
          <div
            className="categoreies-row-box"
            id="dv_CategoryProductsList_MobileView"
          >
            {filteredProducts.map((product) => (
              <Link
                to={product.ProductTypeId === 2 ? `/${restaurantName}/add/comboItems/${product.Id}` : `/${restaurantName}/addToCart/${product.Id}`}
                key={product.Id}
                className="PCommon pro_list_main_col_mobile_view"
              >
                <div
                  className="SCommon categories-box pro_list_main_Mobile_view"
                  data-pid={product.Id}
                  data-pstatus="1"
                  data-ptypeid={product.ProductTypeId}
                >
                  <span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7C13 6.44771 12.5523 6 12 6C11.4477 6 11 6.44771 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17Z"
                        fill="#000000"
                      ></path>
                    </svg>
                  </span>
                  <div className="categories-img" data-pstatus="1">
                    <img
                      src={
                        product.ProductImage_URL ||
                        "../../Content/Images/no-image.jpg"
                      }
                      alt={product.Name}
                      loading="lazy"
                    />
                    <div className="number">${product.SellingPrice}</div>
                  </div>
                  <div className="S1Common categories-text-bx">
                    <h4
                      title={product.Name}
                      className="S2Common pro_name_mobile_View"
                    >
                      {product.Name}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center danger color-text p-3 font-weight-bold ">
              <img src="/Content/Restaurant/images/product-not-found.png" alt="no-product found!" style={{ filter: "grayscale(1)" }} />
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductsMobileView;
