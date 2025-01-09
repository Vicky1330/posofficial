import React, { useEffect, useRef, useState } from "react";
import "../../../assets/CSS/peripheral.css";
import axios from "axios";
import DeliveryZoneModal from "./ManageOrderModals/DeliveryZoneModal";
import OrderNumberModal from "./StoreQrModal/OrderNumberModal";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";

interface DeliveryZone {
    Id: number;
    ZoneName: string;
    DistanceValue: string;
    DeliveryFee: string;
}

// Store QR components ..
const StoreQR: React.FC = () => {
    const [workflowSetting, setWorkflowSetting] = useState<any>(null);
    const [newColor, setNewColor] = useState(workflowSetting?.BannerColor);

    const qrCodeRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [qrCodeImage, setQrCodeImage] = useState<string | null>(
        "/Content/Images/noimg_ORCode.png"
    );
    const UserToken_Global = localStorage.getItem("authToken");
    const RestaurantLoginId_Global = 0;

//     const [formData, setFormData] = useState({
//         minOrderNumber: 0,
//         maxOrderNumber: 0,
//       bannerColor: "",
//       tipAmount1: 0,
//       tipAmount2: 0,
//       tipAmount3: 0,
//       enableDeliveryFee: false,
//       standardDeliveryFee: 0,
//       suggestedTip: false,
//       allowScheduleOrder: false,
//       requirePaymentWhenPlacingOrder: false,
//       allowUserAppToPlaceThePickupOrder: false,
//       allowCashOnPickup: false,
//       autoAcceptPaidOrderPickup: false,
//       estimatedTimePickup: 0,
//       allowUserAppToPlaceTheDeliveryOrder: false,
//       minimumChargeDelivery: 0,
//       allowCashOnDelivery: false,
//       autoAcceptPaidOrderDelivery: false,
//       estimatedTimeDelivery: 0,
//       serviceBoundary: "",
//   });

    // Function to generate QR Code via API
    const generateQRCode = async () => {
        setLoading(true);

      const apiUrl = `${import.meta.env.VITE_API_URL
          }api/restaurant/generate/qrcode`;

      const data = new FormData();
      data.append("id", "0");
      data.append("restaurantLoginId", RestaurantLoginId_Global.toString());
      data.append("mode", "1");

      try {
          const response = await axios.post(apiUrl, data, {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
              "Content-Type": "multipart/form-data",
          },
      });

        if (response.data.status === 1 || response.data.status === 2) {
            // Call getQRCodeData
            getQRCodeData();
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
        toast.error(
            "There was an error generating the QR Code. Please try again.",
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
          }
      );
      } finally {
          setLoading(false);
      }
  };

    // Function to get QR Code data
    const getQRCodeData = async () => {
        setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL
          }api/restaurant/qrcode?restaurantLoginId=${RestaurantLoginId_Global}`;
      try {
          const response = await axios.get(apiUrl, {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
              "Content-Type": "application/json",
          },
      });

        if (response.data.status === 1 || response.data.status === 2) {
            const qrCodeData = response.data.data.qrCodeData;
            if (qrCodeData?.QRCodeImage) {
                const qrCodeUrl = `http://posofficialnew.protoshopp.in/Content/ImageUploads/RestaurantQRCode/${qrCodeData.QRCodeImage}`;
                setQrCodeImage(qrCodeUrl);
            } else {
          }
        } else {
          Swal.fire({
            title: "",
            imageUrl: "/Content/svg/error.svg",
            text: response.data.message,
            icon: "error",
        });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Unknown error occurred",
          icon: "error",
      });
      } finally {
          setLoading(false);
      }
  };

    const printQRCode = () => {
      if (qrCodeRef.current) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                    <html>
                        <head>
                            <title>QR Code</title>
                            <style>
                                body {

                                    justify-content: center;
                                    align-items: center;
                                    height: 94vh;
                                    margin: 0;
                                    font-family: Arial, sans-serif;
                                }
                                img {
                                    margin-left: 25px;
                                    max-width: 100%;
                                    height: 80%;
                                }
                                h1{
                                   text-align:center;   
                                   margin-top: 30px;

                                    }
                            </style>
                        </head>
                        <body>
                            <img src="${qrCodeImage}" alt="QR-CODE" />
                        </body>
                    </html>
                `);

          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
              printWindow.print();
        }, 1000);
      } else {
            console.error("Failed to open print window");
        }
    } else {
          console.error("qrCodeRef.current is null or undefined");
      }
  };

    // Function to delete QR Code via API
    const deleteQRCode = async () => {
        setLoading(true);

      const apiUrl = `${import.meta.env.VITE_API_URL
          }api/restaurant/delete/qrcode?restaurantLoginId=${RestaurantLoginId_Global}`;

      try {
          const response = await axios.get(apiUrl, {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
              "Content-Type": "application/json",
          },
      });

        if (response.data.status === 1) {
        // Reset the QR Code image
          setQrCodeImage("/Content/Images/noimg_ORCode.png");

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
        toast.success(
            "There was an error deleting the QR Code. Please try again.",
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
          }
      );
      } finally {
          setLoading(false);
      }
  };



    useEffect(() => {
        getQRCodeData();
    }, []);

    const fetchWorkflowSettings = async () => {
        try {
            const response = await axios.get(
          `${import.meta.env.VITE_API_URL
          }api/get/all/wokflow/setting/data/lists?restaurantLoginId=${0}`,
          {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
                  "Content-Type": "application/json",
              },
          }
      );
        const { data } = response.data;
        if (data && data._list) {
            setWorkflowSetting(data._list);
            setNewColor(data._list.BannerColor);
        } else {
            console.error("Invalid data received");
        }
    } catch (error) {
        console.error("Error fetching workflow settings:", error);
    }
  };

    const handleSave = async () => {
        try {
            const updatedWorkflowSetting = {
                ...workflowSetting,
                BannerColor: newColor,
            };

        updatedWorkflowSetting.LogoImage = " ";

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL
          }api/restaurant/update/workflow/setting/status`,
          updatedWorkflowSetting,
          {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
                  "Content-Type": "application/json",
              },
          }
      );

        const data = response.data;

        if (data.status === 1) {
            toast.success(data.message, {
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
          toast.error(data.message, {
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
        toast.success("Error saving workflow settings!", {
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

    const handleInputChangeColor = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = event.target;
        setNewColor(value);
    };

    const handleInputChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { id, value, type, checked, files } = event.target;

      const updatedWorkflowSetting = {
          ...workflowSetting,
          [id]:
              type === "checkbox"
                  ? checked
                      ? 1
                      : 0
                  : type === "number"
                      ? value
                          ? parseFloat(value)
                          : 0
                      : id === "file_LogoImage_WorkflowSetting"
                          ? files?.[0]?.name || ""
                          : value,
      };
      setWorkflowSetting(updatedWorkflowSetting);
      await saveSettings(updatedWorkflowSetting);
  };

    const saveSettings = async (flowsettings: any) => {
        try {
            flowsettings.BannerColor = newColor;

        flowsettings.LogoImage = " ";

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL
          }api/restaurant/update/workflow/setting/status`,
          flowsettings,
          {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
                  "Content-Type": "application/json",
              },
          }
      );

        const data = response.data;

        if (data.status === 1) {
            toast.success(data.message, {
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
            toast.error(data.message, {
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
        toast.error("Error saving workflow settings!", {
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
        fetchWorkflowSettings();
    }, []);

    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

    const fetchDeliveryZones = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL
          }api/get/list/deliveryzones?restaurantLoginId=${0}`;
      try {
          const response = await axios.get<{
              status: number;
              message: string;
              data: { DeliveryZones: DeliveryZone[] };
          }>(apiUrl, {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
                  "Content-Type": "application/json",
              },
      });

        if (response.data.status === 1) {
            console.log(response.data.data.DeliveryZones);
            setDeliveryZones(response.data.data.DeliveryZones);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log(error.response);
            }
        }
    }
  };
    useEffect(() => {
        fetchDeliveryZones();
    }, [UserToken_Global]);

    const [isCreateDeliveryZonePopup, setIsCreateDeliveryZonePopup] =
        useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [zoneToUpdate, setZoneToUpdate] = useState<DeliveryZone[]>([]);

    const toggleVisibility = () => {
        setIsDetailsVisible((prev) => !prev);
    };

    const openCreateDeliveryZonePopup = () => {
        setIsCreateDeliveryZonePopup(true);
        setIsUpdate(false);
        setZoneToUpdate([]);
    };

    const openUpdateDeliveryZonePopup = async (zone: DeliveryZone) => {
        try {
        const apiUrl = `${import.meta.env.VITE_API_URL
            }/api/get/deliveryzones/single?Id=${zone.Id}&RestaurantLoginId=0`;
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${UserToken_Global}`,
                "Content-Type": "application/json",
            },
        });

        if (response.data.status === 1) {
            const fetchedZone = response.data.data;
            setIsCreateDeliveryZonePopup(true);
            setIsUpdate(true);
            setZoneToUpdate(fetchedZone);
        } else {
            console.error(
                "Failed to fetch delivery zone details:",
                response.data.message
            );
        }
    } catch (error) {
        console.error("Error fetching delivery zone:", error);
    }
  };

    const onSave = async () => {
        setIsCreateDeliveryZonePopup(false);
        await fetchDeliveryZones();
    };

    const confirmDeleteDeliveryZone = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this delivery zone?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

      if (result.isConfirmed) {
          try {
          const apiUrl = `${import.meta.env.VITE_API_URL
              }api/delete/restaurantdeliveryzones?Id=${id}&restaurantLoginId=0`;
          const response = await axios.get(apiUrl, {
              headers: {
                  Authorization: `Bearer ${UserToken_Global}`,
              },
        });

          if (response.data.status === 1) {
              console.log("Delivery zone deleted successfully");
              setDeliveryZones((zones) => zones.filter((zone) => zone.Id !== id));

            await Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
            });
        } else {
            console.error(
                "Failed to delete delivery zone:",
                response.data.message
            );
        }
      } catch (error) {
            console.error("Error deleting delivery zone:", error);
        }
    }
  };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSaveOrderNumbers = (

  ) => { };

    return (
        <>
          <div className="storeqr-box !max-h-fit overflow-hidden">
              {loading && (
                  <div
                      style={{
                          backgroundColor: "#f0f5f0",
                          position: "fixed",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          zIndex: 999999999999999,
                          MozOpacity: 0.2,
                          opacity: 0.2,
                      }}
                  >
                      <img
                          src="/Content/Images/Loader.gif"
                          style={{
                              backgroundColor: "#9af58c",
                              alignItems: "center",
                              position: "fixed",
                              top: "40%",
                              width: "10%",
                              left: "50%",
                          }}
                      />
                  </div>
              )}
              <div
                  id="contentWrapper_RestaurantLayout"
                  className="content-wrapper timing_stores "
              >
                  <div className="col-12 text-center ">
                      <ul className="nav nav-tabs software_settings space-y-1" role="tablist">
                          <li className="nav-item">
                              <a
                                  className="nav-link  active"
                                  data-toggle="tab"
                                  href="#online_order"
                              >
                                  Online Ordering
                              </a>
                          </li>
                          <li className="nav-item">
                              <a className="nav-link " data-toggle="tab" href="#restaurant">
                                  Workflow
                              </a>
                          </li>
                      </ul>
                  </div>
                  <div className="wrapper-navs_wraps wrapper-box">
                      <div className="col-md-12 col-lg-12 col-sm-12 px-0">
                          <div className="tab-content tab-set">
                              <div
                                  id="online_order"
                                  className="container-fluid tab-pane active"
                              >
                                  <div className="timing-cgt-desc store mx-auto !w-full">
                                      <div className="cgt-desc store_timimgs-wraps">
                                          <div className="cgt-content">
                                              <div
                                                  id="store_qr_code"
                                                  className="tab "
                                                  style={{ padding: "14px 15px !importent" }}
                                              >
                                                  <div className="timing-cgt-desc wrap_delay-setting p-0">
                                                      <div className="scan_qr-code">
                                                          <h4 className="qr_code-heading">
                                                              QR Code for Store
                                                          </h4>
                                                          <div className="scanner_image">
                                                              <div className="scanner_image" ref={qrCodeRef}>
                                                                  {/* Conditionally render QR code */}
                                                                  {qrCodeImage ? (
                                                                      <img
                                                                          id="imgRestaurantQRCode_SoftwareSetting"
                                                                          src={qrCodeImage}
                                                                          alt="QR_Code"
                                                                          className="qr_codes-img mx-auto"
                                                                          style={{
                                                                              maxWidth: "130px",
                                                                              height: "auto",
                                                                          }}
                                                                      />
                                                                  ) : (
                                                                          <img
                                                                              id="imgRestaurantQRCode_SoftwareSetting"
                                                                              src="./Content/Images/noimg_ORCode.png"
                                                                              alt="QR_Code"
                                                                              className="qr_codes-img mx-auto"
                                                                          style={{
                                                                              maxWidth: "130px",
                                                                              height: "auto",
                                                                          }}
                                                                      />
                                                                  )}
                                                              </div>
                                                              {/* <img id="imgRestaurantQRCode_SoftwareSetting" src="./Content/ImageUploads/RestaurantQRCode/e63b5c2e90274c822885ae9b.png" alt="QR_Code" className="qr_codes-img mx-auto" style={{ maxWidth: "130px", height: "auto" }} /> */}
                                                          </div>
                                                          <div className="wrap_scanner_buttons mx-1">
                                                              <button
                                                                  type="button"
                                                                  className="btn btn-primary scanner_codebutton"
                                                                  onClick={generateQRCode}
                                                              >
                                                                  Generate QR code
                                                              </button>
                                                              <button
                                                                  id="btnPrint_RestaurantQRCode_SoftwareSetting"
                                                                  type="button"
                                                                  className="btn btn-primary scanner_codebutton whitespace-normal"
                                                                  onClick={printQRCode}
                                                              >
                                                                  Print QR code
                                                              </button>
                                                              <button
                                                                  id="btnDelete_RestaurantQRCode_SoftwareSetting"
                                                                  type="button"
                                                                  className="btn btn-primary scanner_codebutton delete_scanner"
                                                                  onClick={deleteQRCode}
                                                              >
                                                                  Delete QR code
                                                              </button>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div
                                                      id="dv_RestaurantQRCode_PrintableSection_SoftwareSetting"
                                                      style={{ display: "none" }}
                                                  >
                                                      <img
                                                          id="imgRestaurantQRCode_Printable_SoftwareSetting"
                                                          src="./Content/ImageUploads/RestaurantQRCode/e63b5c2e90274c822885ae9b.png"
                                                          alt="QR_Code"
                                                          style={{ width: "100%" }}
                                                      />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div
                                  id="restaurant"
                                  className="container-fluid tab-pane fade active px-0"
                              >
                                  <div className="workflow-tab p-2 sm:!p-4">
                                      <ul
                                            className="nav nav-pills mb-3  mx-auto !inline-block "
                                            style={{display:"unset !importent"}}
                                          id="pills-tab"
                                          role="tablist"
                                      >
                                          <li className="nav-item" role="presentation">
                                              <button
                                                  className="nav-link active backcolor"
                                                  id="pills-General-tab"
                                                  data-toggle="pill"
                                                  data-target="#pills-General"
                                                  type="button"
                                                  role="tab"
                                                  aria-controls="pills-General"
                                                  aria-selected="true"
                                              >
                                                  General
                                              </button>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <button
                                                  className="nav-link  "
                                                  id="pills-Workflow-tab"
                                                  data-toggle="pill"
                                                  data-target="#pills-Workflow"
                                                  type="button"
                                                  role="tab"
                                                  aria-controls="pills-Workflow"
                                                  aria-selected="false"
                                              >
                                                  Workflow Settings
                                              </button>
                                          </li>
                                          <li className="nav-item d-none" role="presentation">
                                              <button
                                                  className="nav-link "
                                                  id="pills-Users-tab"
                                                  data-toggle="pill"
                                                  data-target="#pills-Users"
                                                  type="button"
                                                  role="tab"
                                                  aria-controls="pills-Users"
                                                  aria-selected="false"
                                              >
                                                  Users Apps Settings
                                              </button>
                                          </li>
                                      </ul>

                                      <div className="tab-content" id="pills-tabContent">
                                          <div
                                              className="tab-pane fade show active"
                                              id="pills-General"
                                              role="tabpanel"
                                              aria-labelledby="pills-General-tab"
                                          >
                                              <div className="container-fluid px-0">
                                                  <div className="table-input text-left mb-3">
                                                      <h6 className="font-weight-bold">
                                                          USER APP DELIVERY ORDER
                                                          <span>
                                                              <i
                                                                  className="fa fa-question-circle"
                                                                  aria-hidden="true"
                                                              ></i>
                                                          </span>
                                                      </h6>

                                                      <div className="input-bx">
                                                          <h6>Allow User to Place the Delivery Order</h6>
                                                          <span className="mt-1">
                                                              <div className="toggle-bx text-center">
                                                                  <label className="switch mb-0">
                                                                      <input
                                                                          type="checkbox"
                                                                          id="AllowUserAppToPlaceTheDeliveryOrder"
                                                                          checked={
                                                                              Number(
                                                                                  workflowSetting?.AllowUserAppToPlaceTheDeliveryOrder
                                                                              ) === 1
                                                                          }
                                                                          onChange={(e) => {
                                                                              handleInputChange(e);
                                                                          }}
                                                                      />
                                                                      <span className="slider round"></span>
                                                                  </label>
                                                              </div>
                                                          </span>
                                                      </div>

                                                      <div
                                                          id="deliveryordercollapse"
                                                          style={{
                                                              display:
                                                                  workflowSetting?.AllowUserAppToPlaceTheDeliveryOrder
                                                                      ? "block"
                                                                      : "none",
                                                          }}
                                                      >
                                                          <div className="input-bx">
                                                              <h6>Minimum Charge</h6>
                                                              <span className="mt-1">
                                                                  <input
                                                                      type="number"
                                                                      min="1"
                                                                      id="MinimumCharge_Delivery"
                                                                      name="MinimumCharge_Delivery"
                                                                      placeholder="0.0"
                                                                      className="time-input"
                                                                      defaultValue={
                                                                          workflowSetting?.MinimumCharge_Delivery ||
                                                                          ""
                                                                      }
                                                                      onChange={handleInputChange}
                                                                  />
                                                              </span>
                                                          </div>
                                                          <div className="input-bx">
                                                              <h6>Allow Cash on Delivery</h6>
                                                              <span className="mt-1">
                                                                  <div className="toggle-bx text-center">
                                                                      <label className="switch mb-0">
                                                                          <input
                                                                              type="checkbox"
                                                                              id="AllowCashOnDelivery"
                                                                              checked={
                                                                                  Number(
                                                                                      workflowSetting?.AllowCashOnDelivery
                                                                                  ) === 1
                                                                              }
                                                                              onChange={handleInputChange}
                                                                          />
                                                                          <span className="slider round"></span>
                                                                      </label>
                                                                  </div>
                                                              </span>
                                                          </div>
                                                          <div className="input-bx">
                                                              <h6>Auto Accept Paid Order</h6>
                                                              <span className="mt-1">
                                                                  <div className="toggle-bx text-center">
                                                                      <label className="switch mb-0">
                                                                          <input
                                                                              type="checkbox"
                                                                              id="AutoAcceptPaidOrder_Delivery"
                                                                              checked={
                                                                                  Number(
                                                                                      workflowSetting?.AutoAcceptPaidOrder_Delivery
                                                                                  ) === 1
                                                                              }
                                                                              onChange={handleInputChange}
                                                                          />
                                                                          <span className="slider round"></span>
                                                                      </label>
                                                                  </div>
                                                              </span>
                                                          </div>
                                                          <div className="input-bx">
                                                              <h6>Estimated Time Of The Delivery (mins)</h6>
                                                              <span className="mt-1">
                                                                  <input
                                                                      type="number"
                                                                      min="1"
                                                                      id="EstimatedTime_Delivery"
                                                                      name="EstimatedTime_Delivery"
                                                                      placeholder="0"
                                                                      className="time-input"
                                                                      defaultValue={
                                                                          workflowSetting?.EstimatedTime_Delivery ||
                                                                          ""
                                                                      }
                                                                      onChange={handleInputChange}
                                                                  />
                                                              </span>
                                                          </div>

                                                          <div className="table-input text-left">
                                                              <div
                                                                  className="input-bx"
                                                                  onClick={toggleVisibility}
                                                              >
                                                                  <h6>Create Delivery Zone</h6>
                                                                  <span>
                                                                      <i
                                                                          className="fa fa-angle-right"
                                                                          aria-hidden="true"
                                                                      ></i>
                                                                  </span>
                                                              </div>

                                                              {isDetailsVisible && (
                                                                  <div id="deliveryZoneDetails">
                                                                      <div
                                                                          id="delivery_zone_data"
                                                                          className="mt-4 flex flex-col sm:flex-row"
                                                                      >
                                                                          <div className="delivery_zone_remark">
                                                                              <b>Note:</b> If no delivery zone is
                                                                              created, the delivery zone will be
                                                                              disabled.
                                                                          </div>
                                                                          <button
                                                                              type="button"
                                                                              className="btn add-pay"
                                                                              onClick={openCreateDeliveryZonePopup}
                                                                          >
                                                                              + Create Delivery Zone
                                                                          </button>
                                                                      </div>

                                                                      {isCreateDeliveryZonePopup && (
                                                                          <DeliveryZoneModal
                                                                              onClose={() =>
                                                                                  setIsCreateDeliveryZonePopup(false)
                                                                              }
                                                                              onSave={onSave}
                                                                              isUpdate={isUpdate}
                                                                              existingZone={zoneToUpdate}
                                                                          />
                                                                      )}
                                                                      <div className="overflow-x-auto">
                                                                          <table
                                                                              id="tbl_DeliveryZoneList_Section_WorkflowSetting"
                                                                              className="overflow-auto"
                                                                          >
                                                                              <thead>
                                                                                  <tr>
                                                                                      <th>Zone Name</th>
                                                                                      <th>Distance Value</th>
                                                                                      <th>Delivery Fee</th>
                                                                                      <th>Actions</th>
                                                                                  </tr>
                                                                              </thead>
                                                                              <tbody>
                                                                                  {deliveryZones.length > 0 ? (
                                                                                      deliveryZones.map((zone) => (
                                                                                          <tr key={zone.Id}>
                                                                                              <td>{zone.ZoneName}</td>
                                                                                              <td>{`${zone.DistanceValue} KM`}</td>
                                                                                              <td>{`$ ${zone.DeliveryFee}`}</td>
                                                                                              <td>
                                                                                                  <i
                                                                                                      className="fa fa-edit"
                                                                                                      title="Edit Zone"
                                                                                                      aria-hidden="true"
                                                                                                      onClick={() =>
                                                                                                          openUpdateDeliveryZonePopup(
                                                                                                              zone
                                                                                                          )
                                                                                                      }
                                                                                                  ></i>
                                                                                                  <i
                                                                                                      className="fa fa-trash"
                                                                                                      title="Delete Zone"
                                                                                                      aria-hidden="true"
                                                                                                      onClick={() =>
                                                                                                          confirmDeleteDeliveryZone(
                                                                                                              zone.Id
                                                                                                          )
                                                                                                      }
                                                                                                  ></i>
                                                                                              </td>
                                                                                          </tr>
                                                                                      ))
                                                                                  ) : (
                                                                                      <tr>
                                                                                          <td
                                                                                              colSpan={4}
                                                                                              className="text-center"
                                                                                          >
                                                                                              No data found
                                                                                          </td>
                                                                                      </tr>
                                                                                  )}
                                                                              </tbody>
                                                                          </table>
                                                                      </div>
                                                                  </div>
                                                              )}
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <hr />
                                                  <div className="table-input">
                                                      <div
                                                          className="suggest-bx text-left"
                                                          id="SuggestedTipContainer"
                                                      >
                                                          <h6
                                                              style={{
                                                                  fontSize: "15px",
                                                                  fontWeight: "bolder",
                                                              }}
                                                          >
                                                              SUGGESTED TIP
                                                              <i
                                                                  className="fa fa-question-circle"
                                                                  aria-hidden="true"
                                                              ></i>
                                                              <div className="toggle-bx text-right">
                                                                  <label className="switch mb-0">
                                                                      <input
                                                                          type="checkbox"
                                                                          id="SuggestedTip"
                                                                          placeholder="00.0"
                                                                          name="SuggestedTip"
                                                                          data-id="0"
                                                                          checked={
                                                                              Number(
                                                                                  workflowSetting?.SuggestedTip
                                                                              ) === 1
                                                                          }
                                                                          onChange={(e) => {
                                                                              handleInputChange(e);
                                                                              //   updateSuggestedTipStatus(e);
                                                                          }}
                                                                      />
                                                                      <span className="slider round"></span>
                                                                  </label>
                                                              </div>
                                                          </h6>

                                                          <div
                                                              className="row align-items-center"
                                                              id="SuggestedTipDetails"
                                                              style={{
                                                                  display: workflowSetting?.SuggestedTip
                                                                      ? "block"
                                                                      : "none",
                                                              }}
                                                          >
                                                              <div className="col-12">
                                                                  <div className="row align-items-center mb-2">
                                                                      <div className="col-4">
                                                                          <label htmlFor="TipAmount_1">
                                                                              1st Amount
                                                                          </label>
                                                                          <input
                                                                              type="number"
                                                                              className="form-control IsNumeric"
                                                                              id="TipAmount_1"
                                                                              name="TipAmount_1"
                                                                              placeholder="00"
                                                                              value={
                                                                                  workflowSetting?.TipAmount_1 || ""
                                                                              }
                                                                              onChange={(e) =>
                                                                                  setWorkflowSetting((prev: any) => {
                                                                                      if (!prev) return null;
                                                                                      return {
                                                                                          ...prev,
                                                                                          TipAmount_1: e.target.value,
                                                                                      };
                                                                                  })
                                                                              }
                                                                          />
                                                                      </div>
                                                                      <div className="col-4">
                                                                          <label htmlFor="TipAmount_2">
                                                                              2nd Amount
                                                                          </label>
                                                                          <input
                                                                              type="number"
                                                                              className="form-control IsNumeric"
                                                                              id="TipAmount_2"
                                                                              name="TipAmount_2"
                                                                              placeholder="00"
                                                                              value={
                                                                                  workflowSetting?.TipAmount_2 || ""
                                                                              }
                                                                              onChange={(e) =>
                                                                                  setWorkflowSetting((prev: any) => {
                                                                                      if (!prev) return null;
                                                                                      return {
                                                                                          ...prev,
                                                                                          TipAmount_2: e.target.value,
                                                                                      };
                                                                                  })
                                                                              }
                                                                          />
                                                                      </div>
                                                                      <div className="col-4">
                                                                          <label htmlFor="TipAmount_3">
                                                                              3rd Amount
                                                                          </label>
                                                                          <input
                                                                              type="number"
                                                                              className="form-control IsNumeric"
                                                                              id="TipAmount_3"
                                                                              name="TipAmount_3"
                                                                              placeholder="00"
                                                                              value={
                                                                                  workflowSetting?.TipAmount_3 || ""
                                                                              }
                                                                              onChange={(e) =>
                                                                                  setWorkflowSetting((prev: any) => {
                                                                                      if (!prev) return null;
                                                                                      return {
                                                                                          ...prev,
                                                                                          TipAmount_3: e.target.value,
                                                                                      };
                                                                                  })
                                                                              }
                                                                          />
                                                                      </div>
                                                                      <div className="col-2">
                                                                          <button
                                                                              type="button"
                                                                              id="tip_Save_button"
                                                                              className="btn-tip"
                                                                              onClick={() => handleSave()}
                                                                          >
                                                                              Save
                                                                          </button>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <hr />
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div
                                              className="tab-pane fade"
                                              id="pills-Workflow"
                                              role="tabpanel"
                                              aria-labelledby="pills-Workflow-tab"
                                          >
                                              <div className="container-fluid text-center">
                                                  <div className="schedule-tab">
                                                      <div className="deilay-input text-left mb-3">
                                                          <h6 className="font-weight-bold">
                                                              SCHEDULED ORDER PROCESSING{" "}
                                                              <i
                                                                  className="fa fa-question-circle"
                                                                  aria-hidden="true"
                                                              ></i>
                                                          </h6>
                                                          <div className="delay-bx">
                                                              <h6 className="mb-0">Allow Schedule Order</h6>
                                                              <span className="mt-1">
                                                                  <div className="toggle-bx text-center">
                                                                      <label className="switch mb-0">
                                                                          <input
                                                                              type="checkbox"
                                                                              className="toggleBtn_WorkflowSetting"
                                                                              id="AllowScheduleOrder"
                                                                              data-id="0"
                                                                              checked={
                                                                                  Number(
                                                                                      workflowSetting?.AllowScheduleOrder
                                                                                  ) === 1
                                                                              }
                                                                              onChange={handleInputChange}
                                                                          />
                                                                          <span className="slider round"></span>
                                                                      </label>
                                                                  </div>
                                                              </span>
                                                          </div>
                                                      </div>
                                                  </div>

                                                  <div className="table-input text-left mb-3">
                                                      <h6 className="font-weight-bold">
                                                          ORDER PAYMENT{" "}
                                                          <i
                                                              className="fa fa-question-circle"
                                                              aria-hidden="true"
                                                          ></i>
                                                      </h6>
                                                      <div className="input-bx">
                                                          <h6>Require Payment When Placing Order</h6>
                                                          <span className="mt-1">
                                                              <div className="toggle-bx text-center">
                                                                  <label className="switch mb-0">
                                                                      <input
                                                                          type="checkbox"
                                                                          className="toggleBtn_WorkflowSetting"
                                                                          id="RequirePaymentWhenPlacingOrder"
                                                                          data-id="0"
                                                                          checked={
                                                                              Number(
                                                                                  workflowSetting?.RequirePaymentWhenPlacingOrder
                                                                              ) === 1
                                                                          }
                                                                          onChange={handleInputChange}
                                                                      />
                                                                      <span className="slider round"></span>
                                                                  </label>
                                                              </div>
                                                          </span>
                                                      </div>
                                                  </div>

                                                  <div className="table-input text-left mb-3 mt-3">
                                                      <h6 className="font-weight-bold">
                                                          BANNER COLOR{" "}
                                                          <i
                                                              className="fa fa-question-circle"
                                                              aria-hidden="true"
                                                          ></i>
                                                      </h6>
                                                      <div className="input-bx">
                                                          <input
                                                              type="color"
                                                              id="BannerColor"
                                                              name="BannerColor"
                                                              value={newColor}
                                                              onChange={handleInputChangeColor}
                                                          />
                                                          <button
                                                              type="button"
                                                              className="btn upload-pay custom-mb"
                                                              style={{ marginBottom: "3px" }}
                                                              onClick={handleSave}
                                                          >
                                                              Save
                                                          </button>
                                                      </div>
                                                  </div>

                                                  <hr />

                                                  <div className="table-input text-left mb-3">
                                                      <h6 className="font-weight-bold">
                                                          SET ORDER START NUMBER FOR WEB ORDERS{" "}
                                                          <i
                                                              className="fa fa-question-circle"
                                                              aria-hidden="true"
                                                          ></i>
                                                      </h6>
                                                      <div className="input-bx" onClick={handleModalOpen}>
                                                          <h6>Order Start Number</h6>
                                                          <span className="mt-1">
                                                              <i
                                                                  className="fa fa-angle-right"
                                                                  aria-hidden="true"
                                                              ></i>
                                                          </span>
                                                      </div>
                                                      {isModalOpen && (
                                                          <OrderNumberModal
                                                              onClose={handleModalClose}
                                                              onSave={handleSaveOrderNumbers}
                                                          />
                                                      )}
                                                  </div>

                                                  <hr />

                                                  <div className="table-input text-left mb-3">
                                                      <h6 className="font-weight-bold">
                                                          USER APP PICKUP ORDER{" "}
                                                          <i
                                                              className="fa fa-question-circle"
                                                              aria-hidden="true"
                                                          ></i>
                                                      </h6>
                                                      <div className="input-bx">
                                                          <h6>Allow User to place the Pickup Order</h6>
                                                          <span className="mt-1">
                                                              <div className="toggle-bx text-center">
                                                                  <label className="switch mb-0">
                                                                      <input
                                                                          type="checkbox"
                                                                          id="AllowUserAppToPlaceThePickupOrder"
                                                                          data-id="0"
                                                                          checked={
                                                                              Number(
                                                                                  workflowSetting?.AllowUserAppToPlaceThePickupOrder
                                                                              ) === 1
                                                                          }
                                                                          onChange={handleInputChange}
                                                                      />
                                                                      <span className="slider round"></span>
                                                                  </label>
                                                              </div>
                                                          </span>
                                                      </div>

                                                      <div className="input-bx">
                                                          <h6>Allow Cash on Pickup</h6>
                                                          <span className="mt-1">
                                                              <div className="toggle-bx text-center">
                                                                  <label className="switch mb-0">
                                                                      <input
                                                                          type="checkbox"
                                                                          id="AllowCashOnPickup"
                                                                          data-id="0"
                                                                          checked={
                                                                              Number(
                                                                                  workflowSetting?.AllowCashOnPickup
                                                                              ) === 1
                                                                          }
                                                                          onChange={handleInputChange}
                                                                      />
                                                                      <span className="slider round"></span>
                                                                  </label>
                                                              </div>
                                                          </span>
                                                      </div>

                                                      <div className="input-bx">
                                                          <h6>Auto Accept Paid Order</h6>
                                                          <span className="mt-1">
                                                              <div className="toggle-bx text-center">
                                                                  <label className="switch mb-0">
                                                                      <input
                                                                          type="checkbox"
                                                                          id="AutoAcceptPaidOrder_Pickup"
                                                                          data-id="0"
                                                                          checked={
                                                                              Number(
                                                                                  workflowSetting?.AutoAcceptPaidOrder_Pickup
                                                                              ) === 1
                                                                          }
                                                                          onChange={handleInputChange}
                                                                      />
                                                                      <span className="slider round"></span>
                                                                  </label>
                                                              </div>
                                                          </span>
                                                      </div>

                                                      <div className="input-bx">
                                                          <h6>Estimated Time (mins)</h6>
                                                          <span className="mt-1">
                                                              <input
                                                                  type="number"
                                                                  min="1"
                                                                  id="EstimatedTime_Pickup"
                                                                  name="EstimatedTime_Pickup"
                                                                  placeholder="0"
                                                                  className="time-input"
                                                                  defaultValue={
                                                                      workflowSetting?.EstimatedTime_Pickup || ""
                                                                  }
                                                                  onChange={handleInputChange}
                                                              />
                                                          </span>
                                                      </div>
                                                  </div>

                                                  <hr />

                                                  <div className="table-input text-left mb-3">
                                                      <h6 className="font-weight-bold">
                                                          Upload Logo{" "}
                                                          <i
                                                              className="fa fa-question-circle"
                                                              aria-hidden="true"
                                                          ></i>
                                                      </h6>
                                                      <div className="input-bx-ws">
                                                          <div className="logo-detail-ws">
                                                              <div className="mylogo-ws">
                                                                  <div className="imageWrapper-ws">
                                                                      <img
                                                                          className="image"
                                                                          id="imgLogoImage_WorkflowSetting"
                                                                          src="../../Content/ImageUploads/ProductImages/d0c30767bbd6.jpg"
                                                                          alt="Logo"
                                                                      />
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="container">
                                                              <div className="file-upload-ws aline_input">
                                                                  <input
                                                                      type="file"
                                                                      accept="image/jpeg, image/png"
                                                                      name="file_LogoImage_WorkflowSetting"
                                                                      id="file_LogoImage_WorkflowSetting"
                                                                      className="me-2"
                                                                      style={{ fontSize: "15px" }}
                                                                  />
                                                                  <button
                                                                      id="btnSubmit_LogoImage_WorkflowSetting"
                                                                      type="button"
                                                                      className="btn upload-logo custom-mb"
                                                                  >
                                                                      Save
                                                                  </button>
                                                              </div>
                                                              <div className="file-upload-ws mt-4">
                                                                  <p>
                                                                      <b>Note : </b>Maximum Dimensions{" "}
                                                                      <span className="text-danger">800*800</span>
                                                                  </p>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>

                                                  <hr />

                                                  <div className="table-input text-left mb-3">
                                                      <h6 className="font-weight-bold">
                                                          SET PRODUCT VIEW TYPE (MOBILE SCREEN){" "}
                                                          <i
                                                              className="fa fa-question-circle"
                                                              aria-hidden="true"
                                                          ></i>
                                                      </h6>
                                                      <div className="input-bx">
                                                          <h6>PRODUCT VIEW</h6>
                                                          <span className="mt-1">
                                                              <span className="form-group">
                                                                  <select
                                                                      id="SetProductViewType"
                                                                      data-id="0"
                                                                      value={
                                                                          workflowSetting?.SetProductViewType || ""
                                                                      }
                                                                        onChange={() => handleInputChange}
                                                                  >
                                                                      <option value="1">Grid View</option>
                                                                      <option value="2">List View</option>
                                                                  </select>
                                                              </span>
                                                          </span>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      {/* <button
                      type="button"
                      id="tip_Save_button"
                      className="btn-tip "
                      onClick={() => handleSave()}
                    >
                      Save Settings
                    </button> */}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
};

export default StoreQR;
