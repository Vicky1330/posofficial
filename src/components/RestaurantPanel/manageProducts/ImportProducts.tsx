import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ImportProducts: React.FC = () => {
  const [fileError, setFileError] = useState<string>('');
  const navigate = useNavigate();

  // Set default values for the form fields
  const { register, handleSubmit, formState: { errors } } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      id: 0,
      restaurantLoginId: 0,
      mode: 1,
      productsExcelFile: null,
    }
  });

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${import.meta.env.VITE_API_URL}api/product/import`;

    // Create FormData
    const formData = new FormData();

    // Append the file from the data (use the first file from the array)
    if (data.productsExcelFile && data.productsExcelFile[0]) {
      formData.append("productsExcelFile", data.productsExcelFile[0]);
    } else {
      setFileError("Please select a valid file.");
      return;
    }

    // Append other fields (id, restaurantLoginId, mode) to formData if needed
    formData.append("id", data.id || 0);
    formData.append("restaurantLoginId", data.restaurantLoginId || 0);
    formData.append("mode", data.mode || 1);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        Swal.fire({
          title: "Import Result",
          text: response.data.message,
          icon: "success"
        });
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
      toast.error("failed to import file!"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      }
    }
  };


  return (
    <div className="content-wrapper min-h-[620px] pt-1">
      <div className="top_area_row ">
        <div className="row">
          <div className="col-sm-8">
            <div className="sm:translate-x-3 main_nav_bread ">
              <ol className="breadcrumb">
                <li className="breadcrumb-item nav_bread_one ">
                  <Link className="fs-6 fw-bold" to="/Restaurant/ManageProducts">
                    Products
                  </Link>
                </li>
                <li className="breadcrumb-item nav_right pl-1 px-2">
                  <a
                    href="javascript:;"
                    className="fs-6 fw-bold"
                    style={{ textDecoration: "none", cursor: "text" }}
                  >
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  </a>
                </li>
                <li className="breadcrumb-item nav_bread_two pl-0">
                  <Link
                    to=""
                    className="fs-6 fw-bold"
                    style={{ textDecoration: "none", cursor: "text" }}
                  >
                    Import Products
                  </Link>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="wrap_tabs-products sidebar_ul-nav_tabs">
          <div className="main_deapt  my-4 mt-0 p-8 rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="new_customer-wrap">
              <div className="row custom_add_pro_rpw mb-0">
                <div className="col-sm-6">
                  <div className="form-group aline_input">
                    <label className="w-full pl-0 pb-0">Select Excel File</label>
                    <div className="flex flex-col w-full">
                      <input
                        type="file"
                        accept=".xls,.xlsx,.csv"
                        id="txtExcelSheet_ProductsData_ImportProducts"
                        {...register("productsExcelFile", {
                          required: "Please insert a file!",
                        })}
                      />
                      {errors.productsExcelFile && (
                        <span className="text-red-500">{errors.productsExcelFile.message}</span>
                      )}
                    </div>
                  </div>
                  <div className="row dv_Note_Section mt-4">
                    <div className="col-sm-12">
                      <span className="font-semibold">Note:</span>
                      <span>Please select the valid excel-file containing the product data to import.</span>
                      <br />
                      <span>Only .xls, .xlsx, and .csv formats are allowed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row custom_add_pro_rpw button_botm mt-4">
                <div className="col-sm-6 text-left">
                  {fileError && <div id="excelFile_error_ImportProducts" className="errorsClass2">{fileError}</div>}
                </div>
                <div className="col-sm-6 flex flex-end">
                  <button
                    type="button"
                    className="ml-2 btm_button_pro btm_button_pro_sm"
                    onClick={() => navigate(-1)}
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    className="btm_button_pro btm_button_pro_sm"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProducts;
