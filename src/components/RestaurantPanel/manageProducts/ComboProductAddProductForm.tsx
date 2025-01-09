import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import MainDepartmentModal from './Models/MainDepartmentModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import CropImageModal from './Models/CropImageModal';

interface DepartmentResponse {
  Id: number;
  Name: string;
}
interface ProductError {
  productName: string;
  mainDepartment: string;
  subDepartment: string;
  MainDepartmentId: string;
}

const ComboProductAddProductForm: React.FC = () => {
  const [newproductnumber, setNewProductNumber] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [barcode, setBarcode] = useState('');
  // const [productImage, setProductImage] = useState<File | null>(null);
  const [barcodeImage, setBarcodeImage] = useState<File | null>(null);
  const [mainDepartmentList, setMainDepartmentList] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subDepartment, setSubDepartment] = useState<DepartmentResponse[]>([]);
  const [isMainDepartmentModal, setIsMainDepartmentModal] = useState<boolean>(false);
  const [isSubDepartmentModal, setIsSubDepartmentModal] = useState<boolean>(false);
  const [barcodeImageUrl, setBarcodeImageUrl] = useState<string | null>(null);
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBarcodeChange, setIsBarcodeChange] = useState<string>('0');
  const productButtonRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLInputElement>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const id = params.get("Id");
  const [productFromError, setProductFormError] = useState<ProductError | null>(null)


  const [productData, setProductData] = useState({
    ProductNumber: '',
    sellingPrice: '',
    productName: '',
    cost: '',
    description: '',
    mainDepartment: '',
    mainDepartmentId:'',
    subDepartmentId: '',
    barcode: '',
    productImage: null,
    barcodeImage: null,
    forceSelling: false,
  });

  const fetchFormData = async (id: number) => {
    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}api/single/combo/product?Id=${id}&restaurantLoginId=${0}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.data.status === 1 || response.status === 200) {
        const data = response.data.data.product;

        handleMainDepartmentChange(data.MainDepartmentId);
        setProductData({
          ProductNumber: data.ProductNumber,
          sellingPrice: data.SellingPrice || '',
          productName: data.Name || '',
          cost: data.Cost || '',
          description: data.Description || '',
          mainDepartment: data.MainDepartmentName || '',
          mainDepartmentId: data.MainDepartmentId || '',
          subDepartmentId: data.SubDepartmentId || '',
          barcode: data.ProductBarcode || '',
          productImage: data.ProductImage || null,
          barcodeImage: data.ProductBarcodeImage || null,
          forceSelling:  false,
        });
        setCroppedImageUrl(data.ProductImage_LiveURL);
        data.ProductBarcodeImage === "" ? setBarcodeImageUrl(null) : setBarcodeImageUrl(`http://posofficialnew.protoshopp.in/${data.ProductBarcodeImage}`)
        if(productId)setNewProductNumber(productId);
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
      toast.error('Failed To fech Form Data', {
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
    } finally {
      setLoading(false);
    }
  };

  const UserToken_Global = localStorage.getItem("authToken");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setBarcodeImageUrl(URL.createObjectURL(file));
    }
    setIsBarcodeChange('1');
  };

  const handleProductImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // setProductImage(file);
      setProductImageUrl(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  }
  const InputBarcodeimage = () => {
    if (barcode === "" && buttonRef.current) {
      buttonRef.current.click();
    }
    else {
      Swal.fire({
        title: "Are you sure?",
        text: "Barcode will be removed on adding image.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          setBarcode("");
          buttonRef.current ? buttonRef.current.click() : '';
        }
      });
    }
  };

  const InputProductimage = () => {
    if (barcode === "" && productButtonRef.current) {
      productButtonRef.current.click();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  //Get The new Product Number
  const getNewProductNumber = async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/get/product/newproductnumber?restaurantLoginId=0`
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${UserToken_Global}`,
        "Content-Type": "application/json",
      }
    });
    if (response.status === 200) {

        setNewProductNumber(response.data.data.productNumber);
      // navigate(`/Restaurant/ComboProduct?Id=${newproductnumber}`)
    }

  }
  const handleMainDepartmentChange = async (mainDepartmentId: string) => {
    setProductData((prevData) => ({
      ...prevData,
      mainDepartmentId: mainDepartmentId, 
    }))
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/active/subdepartment/listByMainDepartment?restaurantLoginId=${0}&mainDepartmentId=${mainDepartmentId}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${UserToken_Global}`,
        "Content-Type": "application/json"
      }
    });
    if (response.data.status === 1 && response.status === 200) {
      const data = response.data.data.subDepartments;
      setSubDepartment(data.map((item: any) => ({ Id: item.Id, Name: item.Name })));

    }
  }


  //get main department List
  const fetchMainDepartmentList = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/active/maindepartment/list?restaurantLoginId=${0}`
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "application/json"
        }
      })
      if (response.data.status === 1 || response.status === 200) {
        const data = response.data.data.mainDepartments;
        const depData = data.map((dept: any) => ({
          Id: dept.Id,
          Name: dept.Name,
        }));
        setMainDepartmentList(depData);
      }
    } catch (error) {

    }
    finally {
      setLoading(false);
    }
  }


  const updateMaindepartmentData = async (action: number, department: string) => {
    const token = localStorage.getItem("authToken")
    const apiUrl = `${import.meta.env.VITE_API_URL}api/addupdate/maindepartment`

    try {
      // setIsLoading(true);
      const formData = new FormData();
      formData.append("id", String(0));
      formData.append("restaurantLoginId", "0");
      formData.append("name", department);
      formData.append("mode", String(action));

      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          mimeType: 'multipart/form-data',

        }
      })
      if (response.status === 200 && response.data.status === 1) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
      else if (response.data.status === 2) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
      else if (response.data.status === -2) {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
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
      setIsMainDepartmentModal(false);

    }
  }

  const { register, handleSubmit, formState: { errors: err } } = useForm();

  // Handle Add/Update Department
  const handleAddUpdateDepartment = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("mode", "1");
      formData.append("mainDepartmentId", data.mainDepartment);
      formData.append("name", data.subDepartmentName);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/addupdate/subdepartment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      
      if (response?.data?.status === 1 && response?.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        setIsSubDepartmentModal(false);  // Close the modal after success
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
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
    } finally {
      setLoading(false);
    }
  };

  // Modal Submit Handler
  const onSubmit = (data: any) => {
    handleAddUpdateDepartment(data);
  };

  const closeCreateMainDepartmentPopup = () => {
    setIsMainDepartmentModal(false);
  };

  const validateProductFrom = () => {
    let isValid = true;
    const productFromErrors = {
      productName: '',
      mainDepartment: '',
      subDepartment: '',
      MainDepartmentId: ''
    }

    if (productData.productName === '') {
      productFromErrors.productName = "Please enter product name";
      isValid = false;
    }
    if (productData.mainDepartmentId === '') {
      productFromErrors.mainDepartment = "Please select a main department.";
      isValid = false;
    }
    if (productData.subDepartmentId === '') {
      productFromErrors.subDepartment = "Please select a sub department.";
      isValid = false
    }
    setProductFormError(productFromErrors);
    return isValid;

  }
  //Add and Update Product
  const handleInsertUpdateProduct = async () => {
    if (!validateProductFrom()) return;
  
    const apiUrl = `${import.meta.env.VITE_API_URL}api/addupdate/combo/product`;
    const formData = new FormData();
    const mode = productId ? "2" : "1";
    // Ensure values are properly set or defaulted
    formData.append("Id", id || '0');
    formData.append("Name", productData.productName?.trim() || "");
    formData.append("Description", description?.trim() || "");
    formData.append("MainDepartmentId", productData.mainDepartmentId?.toString() || "0");
    formData.append("SubDepartmentId", productData.subDepartmentId?.toString() || "0");
    formData.append("Cost", productData.cost?.toString() || "0");
    formData.append("Barcode", barcode?.trim() || "");
    formData.append("SellingPrice", productData.sellingPrice?.toString() || "0");
    formData.append("IsModifierItem", "0");
    formData.append("Mode", mode);
    formData.append("IsProductImageUpdate", "0");
    formData.append("IsBarcodeImageUpdate", isBarcodeChange);
    formData.append("restaurantLoginId", "0");
    if (barcodeImage) formData.append('BarcodeImage', barcodeImage)
    formData.append("restaurantLoginId", "0");

    try {
      setLoading(true);
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${UserToken_Global}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Handle API response
      if (response.status === 200 && response.data.status === 1) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        navigate(`/Restaurant/ComboProduct?Id=${response.data.productId}`)
      } else if (response.data.status === 2) {

        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        fetchFormData(response.data.productId);
      }
      else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
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
  };

  useEffect(() => {
    if (id) {
      const proId = parseInt(id)
      setProductId(proId);
      fetchFormData(proId);

    }
    else {
      setLoading(false);
    }
    getNewProductNumber();
    fetchMainDepartmentList();

  }, [location.search]);


  return (
    <div className="tab-pane active" id="AddUpdateProduct_tab">
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
      <div
        className="main_deapt p-0"
        style={{ margin: "20px 5px 0px", borderRadius: "10px" }}
      >
        <form
          onSubmit={handleInsertUpdateProduct}
          className="new_customer-wrap"
        >
          <input type="hidden" id="hdn_PId" value="332" />
          <input
            type="hidden"
            id="hdn_DefaultOpenSection_AddUpdateProduct"
            value="0"
          />

          {/* Product Number */}
          <div className="row custom_add_pro_rpw">
            <div className="col-12 col-md-6 col-lg-6">
              <div className="form-group aline_input mb-0">
                <label htmlFor="txtProductNumber_ProductForm">
                  PRODUCT NO.
                </label>
                <input
                  type="text"
                  className="form-control IsNumeric"
                  id="txtProductNumber_ProductForm"
                  name="productNumber"
                  value={productId ? productData.ProductNumber : newproductnumber}
                  readOnly
                />
              </div>
            </div>

            {/* Selling Price */}
            <div className="col-12 col-md-6 col-lg-6">
              <div className="form-group aline_input mb-0">
                <label htmlFor="txtSellingPrice_ProductForm">
                  SELLING PRICE
                </label>
                <input
                  type="text"
                  className="form-control IsDecimal"
                  id="txtSellingPrice_ProductForm"
                  name="sellingPrice"
                  value={productData.sellingPrice}
                  onChange={handleChange}
                />
                <div
                  id="sellingPrice_error_ProductForm"
                  className="errorsClass2"
                ></div>
              </div>
            </div>
          </div>

          {/* Product Name and Cost */}
          <div className="row custom_add_pro_rpw">
            <div className="col-12 col-md-6 col-lg-6">
              <div className="form-group aline_input mb-0 flex flex-col">
                <label htmlFor="txtProductName_ProductForm">
                  NAME <span className="requiredFieldClass">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    id="txtProductName_ProductForm"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                  />
                  {productFromError && (
                    <div
                      id="txtProductName_error_ProductForm"
                      className="errorsClass2"
                    >
                      {productFromError.productName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className="col-12 col-md-6 col-lg-6">
              <div className="form-group aline_input mb-0">
                <label htmlFor="txtCost_ProductForm">COST</label>
                <input
                  type="text"
                  className="form-control IsDecimal"
                  id="txtCost_ProductForm"
                  name="cost"
                  value={productData.cost}
                  onChange={handleChange}
                />
                <div
                  id="txtCost_error_ProductForm"
                  className="errorsClass2"
                ></div>
              </div>
            </div>
          </div>

          {/* Description and Departments */}
          <div className="row custom_add_pro_rpw">
            <div className="col-12 col-md-6 col-lg-6">
              <div className="row row-gap">
                <div className="col-12">
                  <div className="form-group aline_input mb-0">
                    <label htmlFor="txtDescription_ProductForm">
                      DESCRIPTION
                    </label>
                    <div className="d-flex flex-column">
                      <textarea
                        className="form-control textareaFieldStyle"
                        id="txtDescription_ProductForm"
                        name="txtDescription_ProductForm"
                        style={{ height: "85px" }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                      <div
                        id="txtDescription_error_ProductForm"
                        className="errorsClass2"
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group aline_input mb-0">
                    <label htmlFor="ddlMainDepartment_ProductForm">
                      MAIN DEPARTMENT{" "}
                      <span className="requiredFieldClass">*</span>
                    </label>
                    <div className="d-flex flex-column">
                      <div className="select_box add_pro_sel">
                        <select
                          className="form-control"
                          id="ddlMainDepartment_ProductForm"
                          name="ddlMainDepartment_ProductForm"
                          value={productData.mainDepartmentId}
                          onChange={(e) =>
                            handleMainDepartmentChange(e.target.value)
                          }
                        >
                          <option value="0">Select Main Department</option>
                          {mainDepartmentList.length > 0 &&
                            mainDepartmentList.map((depdata, index) => (
                              <option key={index} value={depdata.Id}>
                                {depdata.Name}
                              </option>
                            ))}
                        </select>
                      </div>
                      {productFromError && (
                        <div
                          id="ddlMainDepartment__error_ProductForm"
                          className="errorsClass2"
                        >
                          {productFromError.MainDepartmentId}
                        </div>
                      )}
                    </div>
                    <a
                      onClick={() => setIsMainDepartmentModal(true)}
                      className="cursor-pointer"
                    >
                      ADD NEW
                    </a>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group aline_input mb-0">
                    <label htmlFor="ddlSubDepartment_ProductForm">
                      SUB DEPARTMENT{" "}
                      <span className="requiredFieldClass">*</span>
                    </label>
                    <div className="d-flex flex-column">
                      <div className="select_box add_pro_sel">
                        <select
                          className="form-control"
                          id="ddlSubDepartment_ProductForm"
                          name="ddlSubDepartment_ProductForm"
                          value={productData.subDepartmentId}
                          onChange={(e) =>
                            setProductData((prevData) => ({
                              ...prevData,
                              subDepartmentId: e.target.value, 
                            }))
                          }
                        >
                          <option value="0">Select</option>
                          {subDepartment?.length > 0 &&
                            subDepartment.map((subDep) => (
                              <option key={subDep.Id} value={subDep.Id}>
                                {subDep.Name}
                              </option>
                          ))}
                        </select>
                      </div>
                      {productFromError && (
                        <div
                          id="ddlSubDepartment_error_ProductForm"
                          className="errorsClass2"
                        >
                          {productFromError.subDepartment}
                        </div>
                      )}
                    </div>
                    <a
                      onClick={() => setIsSubDepartmentModal(true)}
                      className="cursor-pointer"
                    >
                      ADD NEW
                    </a>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group aline_input wrap_costs mb-0" style={{ width: '101%' }}>
                    <label htmlFor="txtBarcode_ProductForm">BARCODE</label>
                    <div className="d-flex flex-column">
                      <input
                        type="text"
                        className="form-control mb-1"
                        id="txtBarcode_ProductForm"
                        name="txtBarcode_ProductForm"
                        value={barcode}
                        disabled={barcodeImage ? true : false}
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                      <div id="txtBarcode_error_ProductForm" className="errorsClass2"></div>
                      <div>
                        {barcodeImageUrl && <img src={barcodeImageUrl} style={{ width: '100%' }} alt="Barcode Preview" />}
                        <input
                          className="d-none"
                          ref={buttonRef}
                          type="file"
                          accept="image/*"
                          id="fileBarcodeImage_ProductForm"
                          onChange={(e) => handleImageChange(e, setBarcodeImage)}
                        />
                      </div>
                    </div>
                    {barcodeImageUrl ? (<a onClick={() => { setBarcodeImageUrl(null); setBarcodeImage(null); setIsBarcodeChange('1'); }} className='cursor-pointer'> REMOVE </a>) : (<a onClick={() => InputBarcodeimage()} className='cursor-pointer'> ADD-IMAGE </a>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <div className="row row-gap">
                <div className="col-12">
                  <div className="upload_files-warps f">
                    <div className="upload-btn-wrapper">
                      <button className="btn p-1">
                        {croppedImageUrl && <img src={croppedImageUrl} style={{ width: '100%' }} alt="Product Preview" />}
                      </button>
                      <input
                        ref={productButtonRef}
                        type="file"
                        accept="image/*"
                        id="fileProductImage_ProductForm"
                        onChange={(e) => handleProductImageChange(e)}
                      />
                    </div>
                    <div className="add_delete-warsp pl-2 sm:!pl-[26px]  translate-y-2">
                      <p className="buttons_wraps_add">
                        <button type="button" className="add_button_pro ProductPageBtnCommanClass" onClick={InputProductimage}>
                          ADD
                        </button>
                      </p>
                      <p className="buttons_wraps_delete">
                        <button type="button" className="add_button_pro ProductPageBtnCommanClass" onClick={() => setCroppedImageUrl(null)}>
                          DELETE
                        </button>
                      </p>
                    </div>
                  </div>
                  <div id="fileProductImage_error_ProductForm" className="errorsClass2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <div className="text-end flex">
              <a href="/Restaurant/ManageProducts/">
                <button
                  type="button"
                  className="ml-2 btm_button_pro btm_button_pro_sm ProductPageBtnCommanClass"
                >
                  BACK
                </button>
              </a>
              <button
                type="button"
                className="btm_button_pro btm_button_pro_sm ProductPageBtnCommanClass"
                onClick={handleInsertUpdateProduct}
                style={{ marginRight: "20px" }}
              >
                SAVE
              </button>
            </div>
          </div>
        </form>
      </div>
      {isMainDepartmentModal && (
        <MainDepartmentModal
          onClose={closeCreateMainDepartmentPopup}
          editModal={false}
          onCreateMainDepartment={(action, departmentValue) => {
            updateMaindepartmentData(action, departmentValue);
          }}
          selectedDepartmentName=''
        />
      )}

      {isSubDepartmentModal && (
        <div
          className="modal show fixed inset-0 z-1000 bg-black bg-opacity-50 flex items-center justify-center"
          id="CreateSubDepartment_Modal"
          aria-modal="true"
          role="dialog"
          style={{ display: "block", paddingLeft: "0px" }}
        >
          <div className="modal-dialog cstm_modal_dialog">
            <div className="modal-content plus_modal_cont">
              {/* Modal Header */}
              <div className="modal-header plus_modal_head">
                <h4
                  id="heading_Title_SubDepartmentModal"
                  className="modal-title plus_head_popup"
                >
                  Add Department
                </h4>
              </div>

              {/* Modal Body */}
              <div className="modal-body new_modal_work">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Main Department Dropdown */}
                  <div className="form-group pop-up_drop">
                    <div className="select_box">
                      <select
                        className="form-control"
                        {...register("mainDepartment", {
                          required: "Please select main-department!",
                        })}
                      >
                        <option value="0">Select Main Department</option>
                        {mainDepartmentList &&
                          mainDepartmentList.length > 0 &&
                          mainDepartmentList.map((depdata, index) => (
                            <option key={index} value={depdata.Id}>
                              {depdata.Name}
                            </option>
                        ))}
                      </select>
                         {err?.mainDepartment && (
                      <span className="errorsClass2">
                        {typeof err.mainDepartment.message === 'string'
                          ? err.mainDepartment.message
                          : 'An error occurred'}
                      </span>
                    )}

                    </div>
                  </div>

                  {/* Sub Department Name */}
                  <div className="form-group plus_from_group">
                    <input
                      type="text"
                      className="form-control plus_imput_feild"
                      placeholder="Enter Department Name"
                      {...register("subDepartmentName", {
                        required: "Please enter sub-department!",
                      })}
                    />
                    {err?.subDepartmentName && (
                      <span className="errorsClass2">
                        {typeof err.subDepartmentName.message === 'string'
                          ? err.subDepartmentName.message
                          : 'An error occurred'}
                      </span>
                    )}

                  </div>

                  {/* Modal Bottom Buttons */}
                  <div className="modal-bottom plus_modal_bottom">
                    <button
                      type="button"
                      className="cstm_model_plusbtn_1 btn btn-danger"
                      onClick={() => setIsSubDepartmentModal(false)} // Close modal
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cstm_model_plusbtn_2 btn btn-danger"
                      disabled={loading} // Disable button while loading
                    >
                      {loading ? "Processing..." : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <CropImageModal
        isOpen={isModalOpen}
        onCancel={handleCancel}
        setCroppedImageUrl={setCroppedImageUrl}
        productImageUrl={productImageUrl}
      />
    </div>
  );
};

export default ComboProductAddProductForm;
