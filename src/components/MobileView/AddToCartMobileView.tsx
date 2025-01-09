import React, { useState, useEffect } from "react";
import {useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProductModifiers from "./AddToCart/ProductModifiers";
import Swal from "sweetalert2";
import toast, { Toaster } from 'react-hot-toast';

interface ModifierOption {
  Id: number;
  OptionName: string;
  Price: number;
  IsDefaultPreSelectedOption: boolean;
  MaxAllowed: number;
}

interface ProductModifier {
  Id: number;
  ModifierName: string;
  MinSelection: number;
  MaxSelection: number;
  ModifierOptionList: ModifierOption[];
  modifier: [];
  IsMandatory: number;
}

interface Product {
  Id: number;
  Name: string;
  Description: string;
  SellingPrice: number;
  ProductModifiers: ProductModifier[];
  ProductImage_URL: string;
}


const AddToCartMobileView: React.FC = () => {

  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [modifierTotalPrice, setModifierTotalPrice] = useState<number>(0);
  const wpToken = localStorage.getItem('guest_wptoken');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [additionNote, setAdditionalNote] = useState<string>("");
  const [mandatoryOptions, setMandatoryOptions] = useState<number[]>([]);
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const [totalPrice, setTotalPrice] = useState<number>(0); 

    //  fetch product details 
    const fetchProductDetail = async () => {
      // setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}api/customer/product/detail?ProductId=${productId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${wpToken}`,
          },
        });

        const data = response.data;

        if (data.status === 1 && data.data.productDetail) {
          const productData = data.data.productDetail;
          const product: Product = {
            Id: productData.Id,
            Name: productData.Name,
            Description: productData.Description,
            SellingPrice: productData.SellingPrice,
            ProductModifiers: productData.ModifierList,
            ProductImage_URL: productData.ProductImage_URL || "",
          };
          if (productData?.ModifierList) {
            const mandatoryOptionIds = productData.ModifierList
              .filter((option: any) => option.IsMandatory === 1)
              .map((option: any) => {
                return option.ModifierOptionList.map((modifierOption: any) => modifierOption.Id);
              })
              .flat();

            setMandatoryOptions((prevState) => {
              return [...new Set([...prevState, ...mandatoryOptionIds])];
            });

          }
          setProduct(product);
          setTotalPrice(productData?.SellingPrice || 0);
        } else {
          setError(data.message || "Failed to fetch product details.");
        }
      } catch (err) {
        setError("There was an error fetching the product details.");
      }
      // finally {
      //   // setLoading(false);
      // }
    };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
  }, [productId, wpToken]);

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prevQuantity => (increment ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)));
  };

  // calculate price
  const calculateTotalPrice = () => {
    const basePrice = (product?.SellingPrice || 0);
    const modifiersPrice = modifierTotalPrice;
    let calculatedPrice = (basePrice + modifiersPrice) * quantity;
    return calculatedPrice;
  };

  const updateModifierTotalPrice = (price: number) => {
    setModifierTotalPrice(price);
  };

  const navigate = useNavigate();
  const addItemToCart = async () => {

    if (mandatoryOptions.some(optionId => !(optionId in quantities && quantities[optionId] > 0))) {
      Swal.fire("Please check required options!");
      return;
    }

    const params = {
      productId: productId,
      quantity: quantity,
      productTypeId: 1,
      additionalNote: additionNote,
      modifierOptionData: Object.keys(quantities).map((modifierOptionId) => ({
        modifierOptionId: Number(modifierOptionId),
        quantity: quantities[Number(modifierOptionId)],
      }))
    };
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/cart/save/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('guest_wptoken')}`,
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        toast('Here is your toast.');
        const data = await response.json();

        navigate(`/${restaurantName}/order-details`);
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  useEffect(() => {
    const updatedTotalPrice = calculateTotalPrice();
    setTotalPrice(updatedTotalPrice);
  }, [product, modifierTotalPrice, quantity]);  

  if (!product) {
    return <div><img src="/Content/MobileView/Images/mobileView_loader.gif" alt="Loader" className="w-2" style={{
      alignItems: "center",
      position: "fixed",
      top: "50%",
      width: "15%",
      left: "40%",
    }} /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="ProductsDetails_MobileView" className="">
      <div className=" modal-plus phone-modal-plus">
        <div className="modal-dialog flex-column gap-3 ">
          <div className="modal-image">
            <img
              id="ProductImageMobileView"
              src={product?.ProductImage_URL || "../../Content/Images/no-image.jpg"}
              alt={product?.Name}
            />
          </div>
          <div className="modal-content bg-slate-50  w-fit absolute">
            <div className="modal-body pt-2 !h-fit flex flex-col content-between gap-4">
              <div>
                <h5 className="modal-title" id="ProductNameMobileView">
                  {product?.Name || "--"}

                </h5>
                <h6 id="ProductDescriptionMobileView">{product?.Description || "Description .."}</h6>
                <div className="add-plus pr-1">
                  <span id="ProductPriceMobileView">
                    ${product?.SellingPrice.toFixed(2) || "0"}

                  </span>
                  <div className="plus-bx qtySelector">
                    <button
                      className="h5-bx"
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        textDecoration: "none",
                      }}
                      onClick={() => handleQuantityChange(false)}
                    >
                      <i
                        className="fa fa-minus decreaseQty_product"
                        id="decreaseProductQtyMobileView"
                        aria-hidden="true"
                      />
                    </button>

                    <h5>
                      <input
                        type="number"
                        id="txtProductQuantityMobileView"
                        className="qtyValue quantity_text"
                        name="quantity"
                        value={quantity}
                        readOnly
                        style={{ width: "1em", textAlign: "center" }}
                      />
                    </h5>

                    <button
                      className="h5-bx"
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        textDecoration: "none",
                      }}
                      onClick={() => handleQuantityChange(true)}
                    >
                      <i
                        className="fa fa-plus increaseQty_product"
                        id="increaseProductQtyMobileView"
                        aria-hidden="true"
                      />
                    </button>

                  </div>
                </div>

                <div className="accordion" id="modifiersSectionMobileView">
                  {product?.ProductModifiers.length === 0 ? (
                    <div>No modifiers available</div>
                  ) : (
                    product?.ProductModifiers.map((modifier) => (
                      <ProductModifiers
                        key={modifier.Id}
                        modifier={modifier}
                        updateModifierTotalPrice={updateModifierTotalPrice}
                        quantities={quantities}
                        setQuantities={setQuantities}
                      />
                    ))
                  )}
                </div>

              </div>

              <form className="addition-bx">
                <div className="form-group pb-2 pt-1 px-0">
                  <label htmlFor="txtAdditionalNotesMobileView">
                    Additional notes if any ?
                  </label>
                  <textarea
                    className="form-control "
                    id="txtAdditionalNotesMobileView"
                    placeholder="Extra comments (optional)"
                    rows={3}
                    defaultValue={additionNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="modal-footer z-1">
            <div className="footer-row w-full">
              <div className="w-full flex justify-between pr-0.5 py-0">
                <a href="#" className="w-1/2 text-center btn btn-success rounded-0">
                  <h4 id="totalPriceForCartMobileView" className="totalPriceForCartMobileView">
                    ${totalPrice.toFixed(2)}
                  </h4>
                </a>
                <button
                  // to={`/:restaurantName/order-details`}
                  type="button"
                  onClick={addItemToCart}
                  className="w-1/2 text-center btn btn-success rounded-0 btnAddToCartMobileView"
                >
                <h4 id="chngTxtAddOrderMobileView">Add to Order</h4>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );

};

export default AddToCartMobileView;
