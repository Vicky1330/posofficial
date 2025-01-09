import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';

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

interface Props {
  itemVisibility: ProductVisibilityDetail | undefined;
}

const ItemVisibilitySetup: React.FC<Props> = ({ itemVisibility }) => {
  // State to manage visibility for each item
  const [kioskVisible, setKioskVisible] = useState(false);
  const [posVisible, setPosVisible] = useState(false);
  const [tableQrVisible, setTableQrVisible] = useState(false);
  const [storeQrVisible, setStoreQrVisible] = useState(false);
  const [searchParams] = useSearchParams();

  // Handler for toggling visibility
  const handleVisibilityChange = (id: number) => {
    switch (id) {
      case 1:
        SetProductItemVisibility_ProductForm("Kiosk")
        setKioskVisible((prev) => !prev);
        break;
      case 2:
        SetProductItemVisibility_ProductForm("POS")
        setPosVisible((prev) => !prev);
        break;
      case 5:
        SetProductItemVisibility_ProductForm("TableQR")
        setTableQrVisible((prev) => !prev);
        break;
      case 6:
        SetProductItemVisibility_ProductForm("StoreQR")
        setStoreQrVisible((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const UserToken_Global = localStorage.getItem('authToken');

  const SetProductItemVisibility_ProductForm = async (type: string) => {
    if (!UserToken_Global) {
      toast.error('Unauthorize', {
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
      return;
    }

    const data = {
      productId: productIdFromQuery,
      serviceType: type,
      restaurantLoginId: 0,
    }

    try {
      // Make API request using Axios
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL
        }api/set/product/visibility`, data,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            'Content-Type': 'application/json',
          },
        }
      );
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

  };
  const productIdFromQuery = searchParams.get("productId") || '0';
  useEffect(() => {
    if (productIdFromQuery !== '0' && itemVisibility) {
      setKioskVisible(itemVisibility.Kiosk === 1);
      setPosVisible(itemVisibility.POS === 1);
      setStoreQrVisible(itemVisibility.StoreQR === 1);
      setTableQrVisible(itemVisibility.TableQR === 1)
    } {

    }
  }, [itemVisibility]);

  return (
    <div id="ItemVisibilitySetup_tab" className="tab-pane fade active show">
      <div className="product_main-wrap" style={{ paddingTop: '30px', minHeight: '400px' }}>
        <div className="items_chckbox-wraps wrap_product-availability p-4" style={{ height: '410px', overflowY: 'auto' }}>
          <div className="col-md-12 col-lg-12 col-sm-12 product_availability-wrap">

            {/* Kiosk Visibility */}
            <div className="row mb_bottom_25 mrgn_top_20">
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <p className="product_item-name">
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>Kiosk</span>
                </p>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <label className="switch round_wraps product_option_style">
                  <input
                    id="chk_KioskVisibility_ProductForm"
                    type="checkbox"
                    checked={kioskVisible}
                    onChange={() => handleVisibilityChange(1)}
                  />
                  <span className="slider round" style={{ top: '-5px' }}></span>
                </label>
              </div>
            </div>

            {/* POS Visibility */}
            <div className="row mb_bottom_25">
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <p className="product_item-name">
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>POS</span>
                </p>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <label className="switch round_wraps product_option_style">
                  <input
                    id="chk_POSVisibility_ProductForm"
                    type="checkbox"
                    checked={posVisible}
                    onChange={() => handleVisibilityChange(2)}
                  />
                  <span className="slider round" style={{ top: '-5px' }}></span>
                </label>
              </div>
            </div>

            {/* Table-QR Visibility */}
            <div className="row mb_bottom_25">
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <p className="product_item-name">
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>Table-QR</span>
                </p>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <label className="switch round_wraps product_option_style">
                  <input
                    id="chk_WebMenuVisibility_ProductForm"
                    type="checkbox"
                    checked={tableQrVisible}
                    onChange={() => handleVisibilityChange(5)}
                  />
                  <span className="slider round" style={{ top: '-5px' }}></span>
                </label>
              </div>
            </div>

            {/* Store-QR Visibility */}
            <div className="row mb_bottom_25">
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <p className="product_item-name">
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>Store-QR</span>
                </p>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6 col-6" style={{ textAlign: 'center' }}>
                <label className="switch round_wraps product_option_style">
                  <input
                    id="chk_CustomerVisibility_ProductForm"
                    type="checkbox"
                    checked={storeQrVisible}
                    onChange={() => handleVisibilityChange(6)}
                  />
                  <span className="slider round" style={{ top: '-5px' }}></span>
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemVisibilitySetup;
