import React, { useEffect, useState } from "react";
import ComboOptionDepartment from "./ComboOptionDepartment";
import ComboOptionProduct from "./ComboOptionProduct";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

interface SubDepartment {
  Id: number;
  Name: string;
}

interface SubDepartment2 {
  SubDepartmentName: string;
  comboProductId: number;
  SubDepartmentId: number;
  SubDepartment_ProductListWithModifiers: Products[];
  productsList: Products[];
}

interface Products {
  Id: number;
  Name: string;
  Status: number;
  ModifiersList: Modifier[];
  SubDepartmentName: string
}
interface ModifierOption {
  Id: number;
  OptionName: string;
  Status: number;
  modifierOptionStatus?: number;
}

interface Modifier {
  Id: number;
  ModifierName: string;
  OptionsList: ModifierOption[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    subDepartments: SubDepartment[];
  };
}
type IncludedItem = {
  Id: number;
  Name: string | undefined;
};

interface ComboOption {
  Id: number;
  optionName?: string; 
  IsMandatory: boolean;
  minSelection?: number;
  maxSelection?: number;
  defaultProductId?: string | number;
  subDepartments?: { Id: string | number; Name: string }[];
  products?: {
    Id: string | number;
    Name: string;
    SubDepartmentName?: string;
  }[];
  
}

interface SubDepartment {
  SubDepartmentName: string;
  comboProductId: number;
  SubDepartmentId: number;
  SubDepartment_ProductListWithModifiers: Products[];
  productsList: Products[];
}


interface AddedComboProductProps {
  addedCombo: ComboOption[];
  onDelete: (id: string | number) => void;
  loading: boolean;
}

interface FormData {
  id: string | number;
  productId: string;
  comboOptionName: string;
  isMandatory: number;
  minSelectionValue: number;
  maxSelectionValue: number;
  defaultProductId: string;
  includedItemsData: any[];
  restaurantLoginId: number;
  mode: number;
  [key: string]: any;
}
const AddedComboProduct: React.FC<AddedComboProductProps> = ({
  onDelete,
  loading,
}) => {
  const [addedComboData, setAddedComboData] = useState<ComboOption[]>([]);
  const [optionOpen, setOptionOpen] = useState<number>(0);
  const [importLoading, setImportLoading] = useState<boolean>(false);
  const [comboLoading, setComboLoading] = useState<boolean>(false);
  const [defaultProducts, setDefaultProducts] = useState<IncludedItem[]>([]);
  const UserToken_Global = localStorage.getItem("authToken");
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  // const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [comboProductId, setComboProductId] = useState<string | number>("");
  const [includedItems, setIncludedItems] = useState<SubDepartment2[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [includedProductItems, setIncludedProductItems] = useState<any[]>([]);
  const [isMandatoryChecked, setIsMandatoryChecked] = useState<number>(0);
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      includedItemsData: [],
      mode: 2,
      minSelectionValue: 0,
      isMandatory: 0,
    },
  });
  const location = useLocation();

  const fetchComboOptions = async (comboOptionId: any) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }api/combo/product/options/list?comboProductId=${comboOptionId}&restaurantLoginId=0`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 1) {
        setAddedComboData(response.data.data.comboProductOptions);
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching combo options: ", error);
    }
  };


  useEffect(() => {
    if (location && location.search) {
      const params = new URLSearchParams(location.search);
      const id = params.get("Id");
      if (id) {
        fetchComboOptions(id);
      }
    }
  }, [location, loading, comboLoading]);



  // const handleMandatoryToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsMandatoryChecked(!e.target.checked);
  // };

  const fetchSubDepartments = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        `${
          import.meta.env.VITE_API_URL
        }/api/active/subdepartment/list?restaurantLoginId=0`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 1) {
        setSubDepartments(response.data.data.subDepartments);
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching sub-departments:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch sub-departments",
        icon: "error",
      });
    }
  };


  // const [isDataBound, setIsDataBound] = useState(false);

  const GetAllActiveProductsListOfRestaurant = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/active/product/list?restaurantLoginId=${0}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const fetchedProducts: Products[] = response.data.data.products;
        setProducts(fetchedProducts);

        // setIsDataBound(true);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);

      if (error.response?.status === 401) {
        // alert("Unauthorized! Invalid Token!");
      } else {
        // alert("There is some technical error, please try again!");
      }
    }
  };


  const handleDepartmentChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const departmentId = event.target.value;
    if (departmentId === "0") {
      // setSelectedDepartment(null);
      setIncludedItems([]);
      return;
    }

    if (includedItems.some((department: any) => department.SubDepartmentId == departmentId)) {
      toast.error("Department already exist!");
      return;
    }
    // setSelectedDepartment(departmentId);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/product/active/bysubdepartment?restaurantLoginId=0&subDepartmentId=${departmentId}`,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === 1) {
        const productsList = response.data.data.productsList || [];

        const formattedProducts = productsList.map((product: any) => ({
          Id: product.Id,
          Name: product.Name,
        }));

        setDefaultProducts((prev) => {
          const newProducts = formattedProducts.filter((newProduct: any) =>
            !prev.some((existingProduct) => existingProduct.Id === newProduct.Id)
          );

          return [...prev, ...newProducts];
        });

        const subDepartmentName =
          productsList[0]?.SubDepartmentName || "Unknown Department";

        // const SubDepartmentId =
        //   productsList[0]?.SubDepartmentId || "";

        if (subDepartmentName != "Unknown Department") {
          const departmentData = {
            SubDepartmentName: subDepartmentName,
            SubDepartmentId: departmentId,
            comboProductId: comboProductId,
            productsList: productsList,
          };

          setIncludedItems((prevItems: any) => {
            const updatedItems = [...prevItems, departmentData];


            // Ensure unique `SubDepartmentName` entries
            const uniqueItems = updatedItems.filter(
              (value, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.SubDepartmentName === value.SubDepartmentName
                )
            );

            return uniqueItems;
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Sorry, department does not have any product!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        console.error("Error: Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await GetAllActiveProductsListOfRestaurant();
      await fetchSubDepartments();
    })();
  }, []);

  const handleProductChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = event.target.value;
    // setSelectedProduct(productId);
    if (defaultProducts.some((product: any) => product.Id == productId)) {
      toast.error("Product already included!");
      return;
    }

    try {
      const apiUrl = `${ import.meta.env.VITE_API_URL}/api/single/product?Id=${productId}&restaurantLoginId=${0}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const IncludedProducts = response.data.data.products;

        setDefaultProducts((prev) => [
          ...prev,
          {
            Id: IncludedProducts[0].Id,
            Name: IncludedProducts[0].Name
          }
        ])
        // Update state without resetting it
        setIncludedProductItems((prevItems) => {
          const updatedItems = [...prevItems, ...IncludedProducts];

          // Deduplicate based on `Id`
          const uniqueItems = updatedItems.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.Id === value.Id)
          );

          return uniqueItems;
        });

      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
    }
  };


  const [transformedData, setTransformedData] = useState<any[]>([]); // State to hold the transformed data

  // Callback function to handle the transformed data from the child
  const handleTransformedData = (data: any[]) => {
    setTransformedData(data);
  };

  const [departmentData, setDepartmentData] = useState<any>(null);

  // Callback function to receive formData from child
  const handleFormData = (data: any) => {
    setDepartmentData(data);
  };

  const fetchComboOptionDetails = async (comboOptionId: string | number) => {
    try {
      // Fetch combo option details
      setImportLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/combo/product/option/detail?comboOptionId=${comboOptionId}&restaurantLoginId=0`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data?.data?.comboOptionDetail) {
        const comboOptionDetail = response.data.data.comboOptionDetail;
        const departmentList = comboOptionDetail.IncludedItemsList.filter(
          (item: any) => item.ProductId === 0
        );
        setIsMandatoryChecked(comboOptionDetail.IsMandatory)
        const productList = comboOptionDetail.IncludedItemsList.filter(
          (item: any) => item.ProductId !== 0
        );
        setIncludedProductItems(productList);

        setAddedComboData((prevData) =>
          prevData.map((combo) =>
            combo.Id === comboOptionId
              ? {
                  ...combo,
                  IncludedItemsList: {
                    departmentList,
                    productList,
                  },
                }
              : combo
          )
        );

        const allDepartmentProducts: IncludedItem[] = [];
        departmentList.forEach((department: any) => {
          const departmentProducts = department.SubDepartment_ProductListWithModifiers.map((product: any) => ({
            Id: product.Id,
            Name: product.Name,
          }));
          allDepartmentProducts.push(...departmentProducts);
        });
        setDefaultProducts(allDepartmentProducts);

        const productListing = productList.map((product: any) => ({
          Id: product.ProductId,
          Name: product.ProductName
        }));

        setDefaultProducts((Prev) => [
          ...Prev,
          ...productListing
        ])

        setIncludedItems(departmentList);

        setValue("comboOptionName", comboOptionDetail.ComboOptionName);
        setValue("minSelectionValue", comboOptionDetail.MinSelection);
        setValue("maxSelectionValue", comboOptionDetail.MaxSelection);
        setValue("isMandatory", comboOptionDetail.IsMandatory);
        setValue("defaultProductId", comboOptionDetail.DefaultProductId);
      } else {
        console.error("No combo option details found.");
      }
    } catch (error) {
      console.error("Error fetching combo option details:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch combo option details.",
        icon: "error",
      });
    }
    finally {
      setImportLoading(false);
    }
  };

  const handleUpdate = async (payload: any) => {

    try {
      setComboLoading(true);
      payload.includedItemsData = [...departmentData, ...transformedData];
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/combo/product/addupdate/option`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === 2) {

        toast.success(response.data.message, {
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
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error('Unauthorized! Invalid Token!', {
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
            toast.error('There is some technical error, please try again!', {
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
    finally {
      setComboLoading(false);
    }
  };

  const removeData = (productId: number) => {
    setIncludedProductItems(includedProductItems.filter((product) => product.ProductId !== productId));
  }

  const removeDepartment = (departmentId: number) => {

    setIncludedItems(includedItems.filter((department: any) => department.SubDepartmentId !== departmentId));

  }

  const handleOptionToggle = (optionId: number) => {
    if (optionOpen === optionId) {
      setOptionOpen(0)
    }
    else {
      setOptionOpen(optionId)
    }
  }


  return (
    <div>
      {addedComboData.map((combo: any) => (
        <li
          key={combo.Id}

          className="timeline-inverted mt-3"
        >
          <div className="timeline-panel">
            <div className="timeline-heading">
              <div className="faq" data-component="Faq ">
                <div
                  className="faq__grid__faqs__faq"
                  id="dvDetailSection_AddComboOption"
                >
                  <summary className="faq__grid__faqs__faq__button !flex-none"
                    onClick={() => {
                      setComboProductId(combo.Id);
                      fetchComboOptionDetails(combo.Id);
                      setOptionOpen(combo.Id);
                      handleOptionToggle(combo.Id)
                    }}

                  >
                    <div className="p-2.5 faq__grid__faqs__faq__button__content !w-full" >
                      <div className="heading_text-wraps !flex !justify-between">
                        <div
                          className="title_faq_wrap"
                          style={{ minWidth: "330px", maxWidth: "330px" }}
                        >
                          <div className="head_title" >
                            {combo.ComboOptionName}
                          </div>
                        </div>
                        <div className="heading_edit_delete">
                          <a href="#!" onClick={() => onDelete(combo.Id)}>
                            <i
                              className="fa fa-trash"
                              title="Delete Combo-Option"
                            ></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </summary>
                  <div className={`faq__grid__faqs__faq__body transition-all duration-500 ease-in-out ${optionOpen === combo.Id ? "opacity-100 max-h-screen overflow-hidden" : "opacity-0 max-h-0 overflow-hidden"}`}
                    style={{ transition: 'opacity 0.5s, max-height 0.5s' }}>
                    {/* Add Combo Option Form */}

                    <div className="bg-[#fff]">
                      <div className="type_wrapper-item">
                        <div className="row">
                          <div className="col-md-12 col-lg-12 col-sm-12">
                            <div
                              className={`row pt-4 p-3 transition-all duration-500 ease-in-out ${optionOpen === combo.Id ? "opacity-100 max-h-screen flex" : "opacity-0 max-h-0 hidden"}`}
                              style={{ padding: "25px 25px 25px 25px" }}
                            >
                              <div className="pb-2 border-b-[1px] sm:border-b-[0px] border-gray-300 sm:border-r-[1px] sm:border-gray-300 col-md-6 col-lg-6 col-sm-6 !px-0 sm:!px-2">
                                <form
                                  onSubmit={handleSubmit((data) => {
                                    const payload = {
                                      defaultProductId: data[`defaultProductId-${combo.Id}`] || "0",
                                      id: combo.Id,
                                      includedItemsData: [null], 
                                      isMandatory: data[`isMandatory-${combo.Id}`] ? 1 : 0,
                                      maxSelectionValue: data[`maxSelectionValue-${combo.Id}`] || "0",
                                      minSelectionValue: data[`minSelectionValue-${combo.Id}`] || 0,
                                      mode: 2,
                                      optionName: data[`comboOptionName-${combo.Id}`],
                                      productId: combo.ComboProductId,
                                      restaurantLoginId: 0,
                                    };
                                    handleUpdate(payload);
                                  })}
                                >
                                  <div className="form-group plus_from_group mt-0">
                                    <label className="lblModifiersSettingClass lblComboOptionStyle">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      className="h-7 sm:h-auto form-control custom-input-field "
                                      placeholder="Combo Option Name"
                                      defaultValue={combo.ComboOptionName || ""}
                                      {...register(
                                        `comboOptionName-${combo.Id}`,
                                        {
                                          required: "Please enter combo-option name!",  // Validation rule
                                        }
                                      )}
                                      style={{
                                        borderRadius: "25px",
                                        border: "1px solid #ced4da",
                                        fontSize: "initial",
                                      }}
                                    />

                                  </div>

                                  <div className="form-group plus_from_group">
                                    <label className="lblModifiersSettingClass lblComboOptionStyle">
                                      Mandatory
                                    </label>
                                    <p
                                      style={{
                                        textAlign: "left",
                                        padding: "0px",
                                        display: "block",
                                        height: "initial",
                                      }}
                                    >
                                      <label className="switch round_wraps">
                                        <input
                                          type="checkbox"
                                          {...register(`isMandatory-${combo.Id}`)} // Register the checkbox with React Hook Form
                                          defaultChecked={combo.IsMandatory === 1}  // Set defaultChecked based on combo.IsMandatory
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            // Set the form value to 1 if checked, 0 if unchecked
                                            setValue(`isMandatory-${combo.Id}`, isChecked ? 1 : 0);
                                            setIsMandatoryChecked(isChecked ? 1 : 0)

                                          }}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </p>
                                  </div>

                                  <div className="flex">
                                    <div
                                      className="form-group plus_from_group"
                                      style={{
                                        display: "inline-block",
                                        width: "46%",
                                        marginRight: "0px",
                                        marginTop: "0px",
                                      }}
                                    >
                                      <label className="lblModifiersSettingClass lblComboOptionStyle">
                                        Min 
                                      </label>
                                      <input
                                        type="number"
                                        className="h-7 sm:h-auto form-control custom-input-field"
                                        placeholder="0"
                                        defaultValue={combo.MinSelection}
                                        {...register(`minSelectionValue-${combo.Id}`)}
                                        style={{
                                          borderRadius: "25px",
                                          border: "1px solid #ced4da",
                                          fontSize: "initial",
                                        }}
                                        disabled={isMandatoryChecked === 0}
                                      />
                                    </div>

                                    <div
                                      className="form-group plus_from_group"
                                      style={{
                                        display: "inline-block",
                                        width: "46%",
                                        marginTop: "0px",
                                        marginLeft: "6%",
                                        marginRight: "0px",
                                      }}
                                    >
                                      <label className="lblModifiersSettingClass lblComboOptionStyle">
                                        Max
                                      </label>
                                      <input
                                        type="number"
                                        className="h-7 sm:h-auto form-control custom-input-field"
                                        placeholder="0"
                                        defaultValue={combo.MaxSelection || 0}
                                        {...register(
                                          `maxSelectionValue-${combo.Id}`,
                                          {
                                            required: "Please enter max-value!",
                                          }
                                        )}
                                        style={{
                                          borderRadius: "25px",
                                          border: "1px solid #ced4da",
                                          fontSize: "initial",
                                        }}
                                      />

                                    </div>
                                  </div>

                                  <div
                                    className="form-group pop-up_drop pl-3"
                                    style={{
                                      padding: "0px",
                                      marginBottom: "20px",
                                    }}
                                  >
                                    <label className="Combo_defaultItem lblComboOptionStyle">
                                      Default Product
                                    </label>
                                    <select
                                      className="form-control"
                                      {...register(
                                        `defaultProductId-${combo.Id}`,
                                        { required: true }
                                      )}
                                    >
                                      <option value="0">Select Products</option>
                                      {defaultProducts?.map((item) => (
                                        <option key={item.Id} value={item.Id}>
                                          {item.Name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="pl-3 lg:flex">
                                    <div className="form-group pop-up_drop w-full lg:pr-2">
                                      <label className="Combo_defaultItem lblComboOptionStyle">
                                        Import Department
                                      </label>
                                      <select
                                        className="form-control"
                                        defaultValue="0"
                                        {...register(
                                          `ImportDepartment-${combo.Id}`,
                                          { required: true }
                                        )}
                                        onChange={(e) => {
                                          handleDepartmentChange(e);
                                        }}
                                      >
                                        <option value="0">Select</option>
                                        {subDepartments?.map(
                                          (subDepartment) => (
                                            <option
                                              key={subDepartment.Id}
                                              value={subDepartment.Id}
                                            >
                                              {subDepartment.Name}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>

                                    <div className="form-group pop-up_drop w-full">
                                      <label className="Combo_defaultItem lblComboOptionStyle">
                                        Import Product
                                      </label>
                                      <select
                                        className="form-control"
                                        {...register(
                                          `ImportProduct-${combo.Id}`,
                                          { required: true }
                                        )}
                                        onChange={handleProductChange}
                                      >
                                        <option value="0">Select</option>
                                        {products.map((product) => (
                                          <option
                                            key={product.Id}
                                            value={product.Id}
                                          >
                                            {product.SubDepartmentName} -{" "}
                                            {product.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="modal-bottom plus_modal_bottom">
                                    <button
                                      type="submit"
                                      className="cstm_model_plusbtn_2 btn btn-danger"
                                      style={{
                                        fontSize: "16px",
                                        width: "145px",
                                        height: "45px",
                                      }}
                                    >
                                      Update
                                    </button>
                                  </div>
                                </form>
                              </div>
                              <div className="col-md-6 col-lg-6 col-sm-6">
                                <div id="IncludedItems_Section_AddComboOption_ManageComboProduct">
                                  <label
                                    className="lblComboOptionStyle"
                                    style={{ marginBottom: "0.5rem" }}
                                  >
                                    Included Items
                                  </label>
                                  <div
                                    id="dvArea_IncludedItems_AddComboOption_ManageComboProduct"
                                    className="Included_Items_Sortable"
                                    style={{
                                      maxHeight: "500px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {importLoading && <Skeleton height={40} /> ||
                                      <ComboOptionDepartment
                                        departmentProduct={
                                          includedItems
                                        }
                                        mode={2}
                                    // departmentId={comboProductId}
                                        onFormData={handleFormData}
                                        updatedDepartmentData={departmentData}
                                        deleteDepartment={removeDepartment}
                                      /> 
                                    }

                                    {importLoading ? <Skeleton className="mt-4" height={40} /> :
                                      <ComboOptionProduct
                                        productListing={includedProductItems}
                                        onTransformedData={handleTransformedData}
                                        DeleteProduct={removeData}
                                        transformedFormData={transformedData}
                                      />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </div>
  );
};

export default AddedComboProduct;
