import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";

interface Department {
  Id: number;
  Name: string;
  SubDepartmentImage_URL: string;
  SequenceOrder: number; 
}

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const wpToken = localStorage.getItem('guest_wptoken');

  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/customer/subdepartment/list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${wpToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await response.json();        
        const subDepartmentList = data?.data?.subDepartmentList || [];
        setDepartments(subDepartmentList);
        setLoading(false);

      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [wpToken]);

  const filteredDepartments = departments.filter(department =>
    department.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="flex flex-wrap mx-3 mt-4">
        <Skeleton width={330} height={50} className="shadow-md" />
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="cat_list_main_col p-2">
              <div className="cat_list_main img-burger">
                <Skeleton
                  width={150}
                  height={150}
                  containerClassName="w-full h-full mb-3"
                />
                <div style={{ display: "inline-block" }}>
                  <Skeleton width={120} height={20} />
                  <Skeleton width={100} height={16} className="mt-2" />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }


  return (
    <div id="divmainSectionMobileView">
      <div id="Categories_Mobile_PartialView">

        {/* Search Bar */}
        <div className="categories-page pt-4">
          <div className="container mx-auto px-2">
            <form>
              <div className="flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-2 flex items-center text-gray-500">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </div>
                  <input
                    type="text"
                    id="txtSearchCategories_RestaurantMenu_MobileView"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder=" Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>


        <div className="categoreies-burger">
          <div className="container-fluid">
            <div
              className="col-sm-12 pb-3 d-none"
              id="div_TableOrStoreMobileView"
              style={{ paddingLeft: 0 }}
            >
              <div className="store_button">
                <a href="#">
                  <button></button>
                </a>
              </div>
            </div>

            <div
              id="div_NoRecordsFound_CustomerPanelMobileView"
              className={`d-${filteredDepartments.length ? "none" : "block"}`}
            >
              <p className="text-center danger color-text alert-warning p-3 font-weight-bold">
                Records not found
              </p>
            </div>

            <div
              className="categoreies-row"
              id="BindRestaurantCategoriesListForMobileView"
            >
              {filteredDepartments.map((department) => (
                <Link
                  key={department.Id}
                  to={`/${restaurantName}/products/${department.Id}`}  
                  className="cat_list_main_col"
                  data-id={department.Id}
                >
                  <div className="cat_list_main img-burger">
                    <img
                      src={department.SubDepartmentImage_URL || "https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48-300x300.jpg"} 
                      alt={department.Name}
                      loading="lazy"
                    />
                    <div style={{ display: "inline-block" }}>
                      <h3 className="category_name">{department.Name}</h3>
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default DepartmentList;
