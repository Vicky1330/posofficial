import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoMdArrowDropright } from "react-icons/io";

interface ComboProduct {
  Id: number;
  Name: string;
  Description: string;
  SubDepartmentId: number;
  SellingPrice: number;
  ProductNumber: number;
  ProductImage_URL: string;
  ShortDescription: string;
  SubDepartmentName: string;
  MainDepartmentId: number;
  MainDepartmentName: string;
  ProductTypeId: number;
  OptionList: ComboOption[];
}

interface ComboOption {
  Id: number;
  ComboProductId: number;
  ComboOptionName: string;
  MinSelection: number;
  MaxSelection: number;
  IsMandatory: number;
  DefaultProductId: number;
  Status: number;
  SequenceOrder: number;
  ComboOption_IncludedProductList: ComboOptionIncludedProduct[];
  ComboOption_IncludedSubDepartmentList: any[];
}

interface ComboOptionIncludedProduct {
  ComboOptionIncludedProductRowId: number;
  ComboOptionId: number;
  ProductId: number;
  AddOnPrice: number;
  MaxAllowed: number;
  SequenceOrder: number;
  Name: string;
  Description: string;
  ShortDescription: string;
  SubDepartmentId: number;
  SubDepartmentName: string;
  MainDepartmentId: number;
  MainDepartmentName: string;
  SellingPrice: number;
  Status: number;
  ProductNumber: number;
  ProductImage_URL: string;
  Last_UpdatedOn_IncludingRelatedData: string;
  Last_UpdatedOn_IncludingRelatedData_FormatedDateTime: string;
  ProductTypeId: number;
  ModifiersList: ComboOptionModifier[];
}
interface ComboOptionModifier {
  ComboOptionIncludedProductModifierRowId: number;
  ComboOptionIncludedProductId: number;
  ModifierId: number;
  ProductId: number;
  ModifierName: string;
  MinSelection: number;
  MaxSelection: number;
  IsMandatory: number;
  Status: number;
  ModifierOptionsList: ModifierOption[];
}

interface ModifierOption {
  ComboOptionIncludedProductModifierOptionRowId: number;
  ComboOptionIncludedProductModifierId: number;
  ModifierOptionId: number;
  ProductModifierId: number;
  OptionName: string;
  Price: number;
  MaxAllowed: number;
  IsDefaultPreSelectedOption: number;
  ModifierOptionImage_URL: string;
  Status: number;
}

interface ModifierCheckBox {
  departmentId: number;
  productId: number;
  OptionId: number;
  ModifierId: number;
  ModifierOptionId: number;
  checked: boolean;
}

interface ParamModifer {
  comboOptionIncludedProductModifierOptionRowId: number;
  comboOptionIncludedDepartmentProductModifierOptionRowId: number;
  modifierOptionId: number;
  quantity: number;
}

// Product details component
const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ComboProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [toggleState, setToggleState] = useState<{ [key: number]: boolean }>({});
  const [selectedDepartment, setSelectedDepartment] = useState<{ optionId: number; departmentId: number; visibility: boolean }[]>([]);
  const [toggleModifierState, setToggleModifierState] = useState<
    {
      OptionId: number;
      ModifierId: number;
      checked: boolean;
    }[]
    >([]);
  const [additionalNote, setAdditionalNote] = useState<String>("");
  const [total, setTotal] = useState<number>(0);
  const wpToken = localStorage.getItem("guest_wptoken");
  const [modiferCheckBox, setModiferCheckBox] = useState<ModifierCheckBox[]>([]);
  const [mandatoryOptions, setMandatoryOptions] = useState<number[]>([]);
  const { restaurantName } = useParams<{ restaurantName: string }>();
  const [selectedProducts, setSelectedProducts] = useState<
    {
      departmentId: number;
      productId: number;
      productName: string;
      optionId: number;
      quantity: number;
      checked: boolean;
    }[]
  >([]);
  const [selectedModifiers, setSelectedModifiers] = useState<
    {
      departmentId: number;
      productId: number;
      optionId: number;
      modifierId: number;
      ModifiersoptionId: number;
      quantity: number;
      price: number;
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleModifierCheckbox = (
    departmentId: number,
    modifierOptionId: number,
    modifierId: number,
    optionId: number,
    productId: number,
    price: number,
    checked: boolean
  ) => {

    const existingModifier = selectedModifiers.find(
      (modifier) =>
        modifier.modifierId === modifierId &&
        modifier.optionId === optionId &&
        modifier.productId === productId &&
        modifier.ModifiersoptionId === modifierOptionId &&
        modifier.departmentId === departmentId
    );

    const existingProduct = selectedProducts.find(
      (modifier) =>
        modifier.optionId === optionId && modifier.productId === productId && modifier.departmentId === departmentId
    );

    const productQuantites = existingProduct?.quantity;

    if (existingModifier) {
      setSelectedModifiers((prevModifiers) => {
        const updatedModifiers = prevModifiers.map((modifier) =>
          modifier.modifierId === modifierId &&
          modifier.optionId === optionId &&
          modifier.productId === productId &&
            modifier.ModifiersoptionId === modifierOptionId &&
            modifier.departmentId === departmentId
            ? {
                ...modifier,
                quantity: checked ? 1 : 0,
              }
            : modifier
        );

        // Update the price
        const priceChange = checked
          ? price
          : -1 * existingModifier.quantity * price;

        productQuantites ? calculatePrice(priceChange * productQuantites) : "";
        return updatedModifiers;
      });

      setModiferCheckBox((prevCheck) => {
        const updatedCheck = prevCheck.map((item) =>
          item.ModifierId === modifierId &&
          item.ModifierOptionId === modifierOptionId &&
          item.OptionId === optionId &&
            item.productId === productId &&
            item.departmentId === departmentId
            ? { ...item, checked }
            : item
        );
        return updatedCheck;
      });
    } else {
      setSelectedModifiers((prevModifiers) => [
        ...prevModifiers,
        {
          departmentId: departmentId,
          productId: productId,
          optionId: optionId,
          modifierId: modifierId,
          ModifiersoptionId: modifierOptionId,
          quantity: 1,
          price: price,
        },
      ]);

      setModiferCheckBox((prevCheck) => [
        ...prevCheck,
        {
          departmentId: departmentId,
          productId: productId,
          OptionId: optionId,
          ModifierId: modifierId,
          ModifierOptionId: modifierOptionId,
          checked: checked,
        },
      ]);
      if (productQuantites) calculatePrice(price * productQuantites);
    }
  };

  const handleCheckboxChange = (
    departmentId: number,
    productId: number,
    productName: string,
    optionId: number,
    max: number,
    checked: boolean
  ) => {
    const selectedProductsWithOption = selectedProducts.filter(
      (selected) => selected.optionId === optionId
    );
    const totalQuantity = selectedProductsWithOption.reduce(
      (sum, selected) => sum + selected.quantity,
      0
    );

    if (totalQuantity >= max && checked) {
      return;
    }

    if (!checked) {
      const totalPrice = selectedModifiers
        .filter((mod) => mod.productId === productId && mod.optionId === optionId)
        .reduce((acc, mod) => acc + mod.price * mod.quantity, 0);

      const selectedProduct = selectedProducts.find(
        (selected) =>
          selected.productId === productId &&
          selected.optionId === optionId &&
          selected.departmentId === departmentId
      );

      if (selectedProduct) {
        const productQuantity = selectedProduct.quantity;
        const adjustedPrice = productQuantity * totalPrice;
        calculatePrice(-1 * adjustedPrice); 
      }

      setModiferCheckBox((prevModifiers) =>
        prevModifiers.map((modifier) =>
          modifier.productId === productId && modifier.OptionId === optionId && modifier.departmentId === departmentId
            ? { ...modifier, checked }
            : modifier
        )
      );

      setSelectedModifiers((prevModifiers) =>
        prevModifiers.map((modifier) =>
          modifier.productId === productId && modifier.optionId === optionId && modifier.departmentId === departmentId
            ? { ...modifier, quantity: 0 } 
            : modifier
        )
      );
    }

    // Update the selectedProducts state
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) =>
          selected.productId === productId &&
          selected.optionId === optionId &&
          selected.departmentId === departmentId
      );

      if (isSelected) {
        return prevSelected.filter(
          (selected) =>
            selected.productId !== productId ||
            selected.optionId !== optionId ||
            selected.departmentId !== departmentId
        );
      } else {
        return [
          ...prevSelected,
          { departmentId, productId, productName, optionId, quantity: 1, checked }
        ];
      }
    });

  };

  // fetch product details
  const fetchProductDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/customer/comboproduct/detail`,
        {
          params: { ComboProductId: productId },
          headers: {
            Authorization: `Bearer ${wpToken}`,
          },
        }
      );

      if (response.data.status === 1 && response.data.data.comboProductDetail) {
        const productData = response.data.data.comboProductDetail;
        setProduct(productData);

        if (productData?.OptionList) {
          const mandatoryOptionIds = productData.OptionList.filter(
            (option: any) => option.IsMandatory === 1
          ).map((option: any) => option.Id);

          setMandatoryOptions((prevState) => {
            return [...new Set([...prevState, ...mandatoryOptionIds])];
          });
        }
        setTotal(productData.SellingPrice);
      } else {
        setError(response.data.message || "Failed to fetch product details.");
      }
    } catch (err) {
      setError("There was an error fetching the product details.");
    } finally {
      setLoading(false);
    }
  };

  // quantity change function
  const handleQuantityChange = (action: "increase" | "decrease") => {
    let newQuantity = quantity;

    if (action === "increase") {
      newQuantity += 1;
    } else if (action === "decrease" && newQuantity > 1) {
      newQuantity -= 1;
    }

    setQuantity(newQuantity);
  };

  const handleToggle = (optionId: number) => {
    setToggleState((prevState) => ({
      ...prevState,
      [optionId]: !prevState[optionId],
    }));
  };

  const togglemodifiers = (optionId: number, modifierId: number) => {
    setToggleModifierState((prevState) => {
      const existingModifier = prevState.find(
        (modifier) =>
          modifier.OptionId === optionId && modifier.ModifierId === modifierId
      );

      if (existingModifier) {
        return prevState.map((modifier) =>
          modifier.OptionId === optionId && modifier.ModifierId === modifierId
            ? { ...modifier, checked: !modifier.checked }
            : modifier
        );
      } else {
        return [
          ...prevState,
          { OptionId: optionId, ModifierId: modifierId, checked: true },
        ];
      }
    });
  };

  // adjust product quantity
  const adjustProductQuantity = (
    departmentId:number,
    productId: number,
    optionId: number,
    delta: number,
    max: number
  ) => {
    const selectedProductsWithOption = selectedProducts.filter(
      (selected) => selected.optionId === optionId
    );
    const totalQuantity = selectedProductsWithOption.reduce(
      (sum, selected) => sum + selected.quantity,
      0
    );

    if (totalQuantity >= max && true && delta === 1) {
      return;
    }

    setSelectedProducts((prevSelected) => {
      const updatedSelectedProducts = prevSelected.map((selected) =>
        selected.productId === productId && selected.optionId === optionId &&selected.departmentId===departmentId
          ? {
              ...selected,
              quantity:
                delta > 0
                  ? selected.quantity < max
                    ? Math.max(1, selected.quantity + delta)
                    : selected.quantity
                  : selected.quantity > 1
                  ? Math.max(1, selected.quantity + delta)
                  : selected.quantity,
            }
          : selected
      );

      const totalPrice = selectedModifiers
        .filter(
          (mod) => mod.productId === productId && mod.optionId === optionId
        )
        .reduce((acc, mod) => acc + mod.price * mod.quantity, 0);

      calculatePrice(delta * totalPrice);

      return updatedSelectedProducts;
    });

    // calculatePrice(delta * price);
  };

  const getQuantity = (
    departmentId: number,
    modifierOptionId: number,
    modifierId: number,
    optionId: number
  ) => {
    const modifier = selectedModifiers.find(
      (modifier) =>
        modifier.ModifiersoptionId === modifierOptionId &&
        modifier.modifierId === modifierId &&
        modifier.optionId === optionId &&
        modifier.departmentId === departmentId
    );

    return modifier ? modifier.quantity : 0;
  };

  const adjustModifierQuantity = (
    departmentId: number,
    productId: number,
    optionId: number,
    modifierId: number,
    modifierOptionId: number,
    action: number,
    maxSelection: number,
    price: number
  ) => {
    const existingModifier = selectedModifiers.find(
      (modifier) =>
        modifier.modifierId === modifierId &&
        modifier.optionId === optionId &&
        modifier.productId === productId &&
        modifier.ModifiersoptionId === modifierOptionId &&
        modifier.departmentId === departmentId
    );

    const existingProduct = selectedProducts.find(
      (modifier) =>
        modifier.optionId === optionId && modifier.productId === productId && modifier.departmentId === departmentId
    );
    const productQuantity = existingProduct?.quantity;

    if (existingModifier) {
      setSelectedModifiers((prevModifiers) =>
        prevModifiers.map((modifier) =>
          modifier.modifierId === modifierId &&
          modifier.optionId === optionId &&
          modifier.productId === productId &&
            modifier.ModifiersoptionId === modifierOptionId &&
            modifier.departmentId === departmentId
            ? {
                ...modifier,
                quantity: Math.max(
                  1,
                  Math.min(modifier.quantity + action, maxSelection)
                ),
              }
            : modifier
        )
      );
      const updatedModifier = selectedModifiers.find(
        (modifier) =>
          modifier.modifierId === modifierId &&
          modifier.optionId === optionId &&
          modifier.productId === productId &&
          modifier.departmentId == departmentId &&
          modifier.ModifiersoptionId === modifierOptionId
      );
      if (
        updatedModifier &&
        updatedModifier.quantity <= maxSelection &&
        productQuantity
      ) {
        calculatePrice(action * price * productQuantity);
      }
    } else {
      setSelectedModifiers((prevModifiers) => [
        ...prevModifiers,
        {
          departmentId: departmentId,
          productId: productId,
          optionId: optionId,
          ModifiersoptionId: modifierOptionId,
          modifierId: modifierId,
          quantity: 1,
          price: price,
        },
      ]);
    }
  };

  const handleGetProductByDepartment = (
    optionId: number,
    departmentId: number,
    visibility: boolean
  ) => {
    if (!visibility) {
      setSelectedDepartment((prevState) => {
        const updatedDepartments = prevState.map((item) => {
          if (item.optionId === optionId) {
            return { ...item, visibility: false };
          }
          return item;
        });

        return updatedDepartments;
      });
      return;
    }

    setSelectedDepartment((prevState) => {
      const updatedDepartments = prevState.map((item) => {
        if (item.optionId === optionId) {
          return { ...item, visibility: false };
        }
        return item;
      });

      const departmentIndex = updatedDepartments.findIndex(
        (item) =>
          item.optionId === optionId && item.departmentId === departmentId
      );

      if (departmentIndex !== -1) {
        updatedDepartments[departmentIndex].visibility = visibility;
      } else {
        updatedDepartments.push({ optionId, departmentId, visibility });
      }

      return updatedDepartments;
    });
  };

  // calculate total price
  const calculatePrice = (price: number) => {
    setTotal((prev) => {
      const updatedTotal = prev + price;
      return updatedTotal;
    });
  };



  const generateComboOptionData = () => {
    const comboOptionData = selectedProducts.reduce((acc, product) => {
      let comboOption = acc.find((item) => item.comboOptionId === product.optionId);

      if (!comboOption) {
        comboOption = {
          comboOptionId: product.optionId,
          selectedProductData: []
        };
        acc.push(comboOption);
      }
  
      const selectedProductData = {
        comboOptionIncludedProductRowId: product.productId,
        comboOptionIncludedDepartmentProductRowId: product.productId,
        quantity: product.quantity,
        modifierOptionData: [] as ParamModifer[],
      };

      if (product.departmentId === 0) {
        selectedProductData.comboOptionIncludedDepartmentProductRowId = 0;
      } else {
        selectedProductData.comboOptionIncludedProductRowId = 0;
      }
  
      const relatedModifiers = selectedModifiers.filter(
        (modifier) =>
          modifier.optionId === product.optionId && modifier.quantity > 0
      );

      relatedModifiers.forEach((modifier) => {
        const modifierData = {
          comboOptionIncludedProductModifierOptionRowId: modifier.modifierId,
          comboOptionIncludedDepartmentProductModifierOptionRowId: modifier.modifierId,
          // comboOptionIncludedProductModifierOptionRowId: 0,
          // comboOptionIncludedDepartmentProductModifierOptionRowId: 0,
          modifierOptionId: 0,
          quantity: modifier.quantity
          // quantity: 0,
        };

        if (modifier.departmentId === 0) {
          modifierData.comboOptionIncludedDepartmentProductModifierOptionRowId = 0;
        } else {
          modifierData.comboOptionIncludedProductModifierOptionRowId = 0;
        }

        selectedProductData.modifierOptionData.push(modifierData);
      });

      // const emptyModiferData = {
      //   comboOptionIncludedProductModifierOptionRowId: 0,
      //   comboOptionIncludedDepartmentProductModifierOptionRowId: 0,
      //   modifierOptionId: 0,
      //   quantity: 0,
      // }

      // selectedProductData.modifierOptionData.push(emptyModiferData);

      comboOption.selectedProductData.push(selectedProductData);
  
      return acc;
    }, [] as { comboOptionId: number; selectedProductData: any[] }[]);
  
    return comboOptionData;
  };

  // add to cart function 
  const addToCart = async () => {
 
    const selectedOptionIds = selectedProducts
      .filter((product) => product.checked)
      .map((product) => product.optionId);
  
    const missingMandatoryOptions = mandatoryOptions.filter(
      (mandatoryId) => !selectedOptionIds.includes(mandatoryId)
    );
  
    if (missingMandatoryOptions.length > 0) {
      return Swal.fire("Please select all mandatory options!");
    }
  
    if (productId) {
      const comboOptionData = generateComboOptionData();
      const params = {
        comboProductId: parseInt(productId),
        productTypeId: 2,
        additionalNote,
        quantity,
        comboOptionData
      };
  
      try {
        const endpoint = `${import.meta.env.VITE_API_URL}api/customer/cart/save/combo/item`;
  
        const response = await axios.post(endpoint, params, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${wpToken}`,
          },
        });

        if (response.data.status === 1) {
          const result = await Swal.fire({
            title: "Item successfully added to the cart!",
            icon: "success",
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            showCancelButton: true
          });
          if (result.isConfirmed) {
            navigate(`/${restaurantName}/order-details`);
          }
        } else {
          Swal.fire("An error occurred while adding the item to the cart. Please try again.");
        }
      } catch (error) {
          console.error('Error adding item to cart:', error);
          Swal.fire("An error occurred while adding the item to the cart. Please try again.");
          throw error;
        }
      }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
  }, [productId, wpToken]);

  if (loading) {
    return (
      <div>
        <img
          src="/Content/MobileView/Images/mobileView_loader.gif"
          alt="Loader"
          className="w-2"
          style={{
            alignItems: "center",
            position: "fixed",
            top: "50%",
            width: "15%",
            left: "40%",
          }}
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div>
      <div id="ProductsDetails_MobileView">
        <div className=" modal-plus phone-modal-plus">
          <div className="modal-dialog flex flex-col ">
            <div className="modal-image">
              <img
                id="ProductImageMobileView"
                src={product?.ProductImage_URL ?? ""}
                alt={product?.Name}
              />
            </div>
            <div className="modal-content flex-auto !bg-white !w-full">
              <div className="modal-body">
                <h5 className="modal-title" id="ProductNameMobileView">
                  {product?.Name}
                </h5>
                <h6 id="ProductDescriptionMobileView">
                  {product?.Description}
                </h6>

                <div className="add-plus pr-1">
                  <span id="ProductPriceMobileView">
                    ${product?.SellingPrice}
                  </span>
                  <div className="plus-bx qtySelector">
                    <a
                      className="h5-bx"
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        textDecoration: "none",
                      }}
                      onClick={() => handleQuantityChange("decrease")}
                    >
                      <i
                        className="fa fa-minus decreaseQty_product"
                        id="decreaseProductQtyMobileView"
                        aria-hidden="true"
                      />
                    </a>
                    <h5>
                      <input
                        type="number"
                        id="txtProductQuantityMobileView"
                        className="qtyValue quantity_text"
                        name="quantity"
                        value={quantity}
                        readOnly
                        style={{ width: "2em", textAlign: "center" }}
                      />
                    </h5>
                    <a
                      className="h5-bx"
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        textDecoration: "none",
                      }}
                      onClick={() => handleQuantityChange("increase")}
                    >
                      <i
                        className="fa fa-plus increaseQty_product"
                        id="increaseProductQtyMobileView"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col content-between">
                  <div className="accordion" id="modifiersSectionMobileView">
                    <div
                      className="card ComboproductModifiers gap-2"
                      data-pmid={27}
                    >
                      {product &&
                        product.OptionList.map((option) => (
                          <div
                            className="card-header !shadow-md !rounded-md"
                            id={`option_${option.Id}`}
                            key={option.Id}
                          >
                            <button
                              className={`btn btn-link btn-block text-left !flex pl-2 pr-2 ${!toggleState[option.Id] ? "" : "collapsed "
                              }`}
                              onClick={() => handleToggle(option.Id)}
                              type="button"
                              aria-expanded={toggleState[option.Id]}
                              aria-controls={`acc_body_ComboProduct_Mobile_View_${option.Id}`}
                            >
                              <IoMdArrowDropright
                                size={25}
                                className={`text-black transition-transform duration-300 ${toggleState[option.Id] ? "rotate-90" : ""
                                }`}
                              />

                              <div className="w-full">
                                <h5>
                                  {option.ComboOptionName}
                                  {option.IsMandatory === 1 && (
                                    <span className="opt_min">Required</span>
                                  )}
                                </h5>
                                <h6>
                                  (Min: {option.MinSelection} Max:{" "}
                                  {option.MaxSelection})
                                </h6>
                              </div>
                            </button>
                            <div
                              className={`collapse ${toggleState[option.Id] ? "show" : ""
                              }`}
                              id={`acc_body_ComboProduct_Mobile_View_${option.Id}`}
                              aria-labelledby={`option_${option.Id}`}
                              data-parent="#modifiersSectionMobileView"
                            >
                              <div
                                className="department-scroll overflow-x-auto"
                                id={`DepartmentList_${option.Id}`}
                              >
                                {option.ComboOption_IncludedSubDepartmentList
                                  .length > 0 && (
                                  <div>
                                    {/* Department Button */}
                                    <div className="department-buttons py-2">
                                      <button
                                        id={`department-btn`}
                                        onClick={() =>
                                          handleGetProductByDepartment(
                                            option.Id,
                                            0,
                                            false
                                          )
                                        }
                                        className={`department-btn px-3 NewDepartmentActive_ ${selectedDepartment.every(
                                          (dep) =>
                                            dep.optionId !== option.Id ||
                                            dep.visibility === false
                                        )
                                            ? "active"
                                            : ""
                                          }`}
                                      >
                                        All
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {option.ComboOption_IncludedSubDepartmentList.map(
                                  (dept) => (
                                    <div
                                      key={dept.ComboOptionIncludedDepartmentId}
                                    >
                                      {/* Department Button */}
                                      <div className="department-buttons py-2">
                                        <button
                                          id={`department-btn_${dept.SubDepartmentId}_${option.Id}`}
                                          onClick={() =>
                                            handleGetProductByDepartment(
                                              option.Id,
                                              dept.SubDepartmentId,
                                              true
                                            )
                                          }
                                          className={`department-btn NewDepartmentActive_${dept.SubDepartmentId
                                            }_${option.Id} ${selectedDepartment.some(
                                              (selected) =>
                                                selected.optionId ===
                                                option.Id &&
                                                selected.departmentId ===
                                                dept.SubDepartmentId &&
                                                selected.visibility === true
                                            )
                                            ? "active"
                                            : ""
                                          }`}
                                        >
                                          {dept.SubDepartmentName}
                                        </button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              <div
                                className="product-scroll p-0 overflow-x-auto"
                                id={`SelectedProductList_${option.Id}`}
                              >
                                {selectedProducts
                                  ?.filter(
                                    (item) => item.optionId === option.Id
                                  )
                                  .map((item) => (
                                    <button
                                      key={item.productId}
                                      className="product-btn mt-2 px-3"
                                      id={`sdSelectedProduct_btn_${option.Id}_90_53`}
                                      onClick={() =>
                                        handleCheckboxChange(
                                          item.departmentId,
                                          item.productId,
                                          item.productName,
                                          item.optionId,
                                          option.MaxSelection,
                                          false
                                        )
                                      }
                                    >
                                      {item.productName}
                                      <i className="fa fa-times remove-icon pl-2" />
                                    </button>
                                  ))}
                              </div>
                              <div className="card-body !bg-gray-100">
                                {selectedDepartment.every(
                                  (dep) =>
                                    dep.optionId !== option.Id ||
                                    dep.visibility === false
                                ) &&
                                  option.ComboOption_IncludedProductList.map(
                                    (optionproduct) => (
                                      <div
                                        key={
                                          optionproduct.ComboOptionIncludedProductRowId
                                        }
                                      >
                                        <div
                                          className="wraps_flexs flex ComboOptionDiv"
                                          id={`product_${optionproduct.ComboOptionIncludedProductRowId}_${option.Id}`}
                                        >
                                          <label
                                            className="container"
                                            htmlFor={`Chk_${optionproduct.ComboOptionIncludedProductRowId}_${option.Id}`}
                                            style={{ width: "67%" }}
                                          >
                                            <div className="!text-md !font-semibold text-black">
                                            {optionproduct.Name}
                                            </div>
                                            <input
                                              type="checkbox"
                                              id={`Chk_${optionproduct.ComboOptionIncludedProductRowId}_${option.Id}`}
                                              checked={selectedProducts.some(
                                                (selected) =>
                                                  selected.productId ===
                                                  optionproduct.ComboOptionIncludedProductRowId &&
                                                  selected.optionId ===
                                                  option.Id &&
                                                  selected.departmentId === 0
                                              )}
                                              onChange={(e) =>
                                                handleCheckboxChange(
                                                  0,
                                                  optionproduct.ComboOptionIncludedProductRowId,
                                                  optionproduct.Name,
                                                  option.Id,
                                                  option.MaxSelection,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                            <span
                                              className="checkmark qtyValue"
                                              data-minvalue={0}
                                              data-maxvalue={option.MaxSelection}
                                            >
                                              {selectedProducts.find(
                                                (selected) =>
                                                  selected.productId ===
                                                  optionproduct.ComboOptionIncludedProductRowId &&
                                                  selected.optionId ===
                                                  option.Id &&
                                                  selected.departmentId === 0
                                              )
                                                ? selectedProducts.find(
                                                  (selected) =>
                                                    selected.productId ===
                                                    optionproduct.ComboOptionIncludedProductRowId &&
                                                    selected.optionId ===
                                                    option.Id &&
                                                    selected.departmentId ===
                                                    0
                                                )?.quantity
                                                : 0}
                                            </span>
                                          </label>

                                          <div
                                            className="price-box mt-3"
                                            style={{ width: "40%" }}
                                          >
                                            <span className="counter-btns">
                                              <span
                                                className="plus"
                                                onClick={() =>
                                                  adjustProductQuantity(
                                                    0,
                                                    optionproduct.ComboOptionIncludedProductRowId,
                                                    option.Id,
                                                    1,
                                                    option.MaxSelection
                                                  )
                                                }
                                                style={{
                                                  pointerEvents:
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        optionproduct.ComboOptionIncludedProductRowId &&
                                                        product.optionId ===
                                                        option.Id &&
                                                        product.departmentId ===
                                                        0 &&
                                                        product.quantity <
                                                        option.MaxSelection
                                                    ) &&
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        optionproduct.ComboOptionIncludedProductRowId &&
                                                        product.optionId ===
                                                        option.Id &&
                                                        product.departmentId ===
                                                        0
                                                    )
                                                      ? "auto"
                                                      : "none",
                                                }}
                                              >
                                                <i className="fa fa-plus increaseQty" />
                                              </span>
                                              <span
                                                className="minus"
                                                onClick={() =>
                                                  adjustProductQuantity(
                                                    0,
                                                    optionproduct.ComboOptionIncludedProductRowId,
                                                    option.Id,
                                                    -1,
                                                    option.MaxSelection
                                                  )
                                                }
                                                style={{
                                                  pointerEvents:
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        optionproduct.ComboOptionIncludedProductRowId &&
                                                        product.optionId ===
                                                        option.Id &&
                                                        product.departmentId ===
                                                        0 &&
                                                        product.quantity > 1
                                                    ) &&
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        optionproduct.ComboOptionIncludedProductRowId &&
                                                        product.optionId ===
                                                        option.Id &&
                                                        product.departmentId ===
                                                        0
                                                    )
                                                      ? "auto"
                                                      : "none",
                                                }}
                                              >
                                                <i className="fa fa-minus decreaseQty" />
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                        {optionproduct.ModifiersList.map(
                                          (modifiers) => {
                                            const isProductAndOptionSelected =
                                              selectedProducts.some(
                                                (selectedProduct) =>
                                                  selectedProduct.productId ===
                                                  optionproduct.ComboOptionIncludedProductRowId &&
                                                  selectedProduct.optionId ===
                                                  option.Id
                                              );

                                            if (isProductAndOptionSelected) {
                                              return (
                                                <div
                                                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isProductAndOptionSelected ? 'max-h-screen p-4' : 'max-h-0 p-0'}`}
                                                  id={`ComboOptionIncludedItemModifiers_Section_mobile_view_${modifiers.ComboOptionIncludedProductModifierRowId}`}
                                                  key={
                                                    modifiers.ComboOptionIncludedProductModifierRowId
                                                  }
                                                >
                                                  <div
                                                    className="card productModifiers "
                                                    data-pmid="10081"
                                                  >
                                                    <div
                                                      className="card-header"
                                                      id={`acc_head_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedProductModifierRowId}`}
                                                    >
                                                      <button
                                                        className="btn btn-link btn-block text-left !flex pl-2 pr-2 !shadow-md"
                                                        type="button"
                                                        onClick={() =>
                                                          togglemodifiers(
                                                            option.Id,
                                                            modifiers.ComboOptionIncludedProductModifierRowId
                                                          )
                                                        }
                                                        aria-expanded={
                                                          toggleModifierState.some(
                                                            (modifier) =>
                                                              modifier.OptionId ===
                                                              option.Id &&
                                                              modifier.ModifierId ===
                                                              modifiers.ComboOptionIncludedProductModifierRowId &&
                                                              modifier.checked
                                                          )
                                                            ? "true"
                                                            : "false"
                                                        }
                                                        aria-controls={`acc_body_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedProductModifierRowId}`}
                                                      >
                                                        <IoMdArrowDropright
                                                          size={25}
                                                          className={`text-black transition-transform duration-300 ${toggleModifierState.some(
                                                            (modifier) =>
                                                              modifier.OptionId ===
                                                              option.Id &&
                                                              modifier.ModifierId ===
                                                                modifiers.ComboOptionIncludedProductModifierRowId &&
                                                              modifier.checked
                                                          )
                                                            ? "rotate-90"
                                                            : ""
                                                          }`}
                                                        />
                                                        <div className="!w-full">
                                                          <h5>
                                                            <div className="!font-semibold">
                                                            {
                                                              modifiers.ModifierName
                                                            }
                                                            </div>
                                                            {modifiers.IsMandatory ===
                                                              1 && (
                                                            <span className="opt_min">
                                                              Required
                                                            </span>
                                                              )}
                                                          </h5>
                                                          <h6>
                                                            ( Min:{" "}
                                                            {
                                                              modifiers.MinSelection
                                                            }{" "}
                                                            Max:{" "}
                                                            {
                                                              modifiers.MaxSelection
                                                            }
                                                            )
                                                          </h6>
                                                        </div>
                                                      </button>
                                                    </div>

                                                    {modifiers.ModifierOptionsList.map(
                                                      (ModifierOptions) => (
                                                        <div
                                                          id={`acc_body_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedProductModifierRowId}`}
                                                          className={`collapse ${toggleModifierState.some(
                                                            (modifier) =>
                                                              modifier.OptionId ===
                                                              option.Id &&
                                                              modifier.ModifierId ===
                                                                modifiers.ComboOptionIncludedProductModifierRowId &&
                                                              modifier.checked
                                                          )
                                                            ? "show"
                                                            : ""
                                                          }`}
                                                          aria-labelledby={`acc_head_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedProductModifierRowId}`}
                                                          data-parent={`#ComboOptionIncludedItemModifiers_Section_mobile_view_${modifiers.ComboOptionIncludedProductModifierRowId}`}
                                                          key={
                                                            ModifierOptions.ModifierOptionId
                                                          }
                                                        >
                                                          <div className="card-body">
                                                            <div className="checkbx wraps_flexs modifierOptionDiv">
                                                              <label
                                                                className="container"
                                                                style={{
                                                                  width: "67%",
                                                                }}
                                                              >
                                                                {
                                                                  ModifierOptions.OptionName
                                                                }
                                                                <input
                                                                  type="checkbox"
                                                                  id={`input_modifierOption_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedProductModifierRowId}_${ModifierOptions.ModifierOptionId}`}
                                                                  className="form-check-input"
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    handleModifierCheckbox(
                                                                      0,
                                                                      ModifierOptions.ModifierOptionId,
                                                                      modifiers.ComboOptionIncludedProductModifierRowId,
                                                                      option.Id,
                                                                      optionproduct.ComboOptionIncludedProductRowId,
                                                                      ModifierOptions.Price,
                                                                      e.target
                                                                        .checked
                                                                    )
                                                                  }
                                                                  checked={
                                                                    (modiferCheckBox.find(
                                                                      (modifier) =>
                                                                        modifier.departmentId === 0 &&
                                                                        modifier.OptionId === option.Id &&
                                                                        modifier.ModifierId === modifiers.ComboOptionIncludedProductModifierRowId &&
                                                                        modifier.ModifierOptionId === ModifierOptions.ModifierOptionId
                                                                    ) || { checked: false }).checked
                                                                  }
                                                                />
                                                                <span
                                                                  className="checkmark qtyValue"
                                                                  data-minvalue="0"
                                                                  data-maxvalue="10"
                                                                >
                                                                  {getQuantity(
                                                                    0,
                                                                    ModifierOptions.ModifierOptionId,
                                                                    modifiers.ComboOptionIncludedProductModifierRowId,
                                                                    option.Id
                                                                  )}
                                                                </span>
                                                              </label>
                                                              <div
                                                                className="price-box"
                                                                style={{
                                                                  width: "40%",
                                                                }}
                                                              >
                                                                {modiferCheckBox &&
                                                                  modiferCheckBox.some(
                                                                    (chck) =>
                                                                      chck.OptionId ===
                                                                      option.Id &&
                                                                      chck.ModifierId ===
                                                                      modifiers.ComboOptionIncludedProductModifierRowId &&
                                                                      chck.ModifierOptionId ===
                                                                      ModifierOptions.ModifierOptionId &&
                                                                      chck.checked ===
                                                                      true
                                                                  ) && (
                                                                    <span className="counter-btns">
                                                                      <span
                                                                        className="plus"
                                                                        onClick={() =>
                                                                          adjustModifierQuantity(
                                                                            0,
                                                                            optionproduct.ComboOptionIncludedProductRowId,
                                                                            option.Id,
                                                                            modifiers.ComboOptionIncludedProductModifierRowId,
                                                                            ModifierOptions.ModifierOptionId,
                                                                            1,
                                                                            modifiers.MaxSelection,
                                                                            ModifierOptions.Price
                                                                          )
                                                                        }
                                                                        style={{
                                                                          pointerEvents:
                                                                            selectedModifiers.some(
                                                                              (
                                                                                modifier
                                                                              ) =>
                                                                                modifier.modifierId ===
                                                                                modifiers.ComboOptionIncludedProductModifierRowId &&
                                                                                modifier.optionId ===
                                                                                option.Id &&
                                                                                modifier.ModifiersoptionId ===
                                                                                ModifierOptions.ModifierOptionId &&
                                                                                modifier.productId ===
                                                                                optionproduct.ComboOptionIncludedProductRowId &&
                                                                                modifier.quantity ===
                                                                                modifiers.MaxSelection
                                                                            )
                                                                            ? "none"
                                                                            : "auto",
                                                                      }}
                                                                    >
                                                                      <i className="fa fa-plus increaseQty" />
                                                                    </span>
                                                                    <span
                                                                      className="minus"
                                                                      onClick={() =>
                                                                        adjustModifierQuantity(
                                                                          0,
                                                                          optionproduct.ComboOptionIncludedProductRowId,
                                                                          option.Id,
                                                                          modifiers.ComboOptionIncludedProductModifierRowId,
                                                                          ModifierOptions.ModifierOptionId,
                                                                          -1,
                                                                          modifiers.MaxSelection,
                                                                          ModifierOptions.Price
                                                                        )
                                                                      }
                                                                      style={{
                                                                        pointerEvents:
                                                                          selectedModifiers.some(
                                                                            (
                                                                              modifier
                                                                            ) =>
                                                                              modifier.modifierId ===
                                                                                modifiers.ComboOptionIncludedProductModifierRowId &&
                                                                              modifier.optionId ===
                                                                              option.Id &&
                                                                              modifier.ModifiersoptionId ===
                                                                              ModifierOptions.ModifierOptionId &&
                                                                              modifier.productId ===
                                                                                optionproduct.ComboOptionIncludedProductRowId &&
                                                                              modifier.quantity ===
                                                                              1
                                                                          )
                                                                              ? "none"
                                                                              : "auto",
                                                                        }}
                                                                      >
                                                                        <i className="fa fa-minus decreaseQty" />
                                                                      </span>
                                                                    </span>
                                                                  )}
                                                                <span className="price-span">
                                                                  +$
                                                                  {
                                                                    ModifierOptions.Price
                                                                  }
                                                                </span>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            }
                                            return null;
                                          }
                                        )}
                                      </div>
                                    )
                                  )}
                                {option.ComboOption_IncludedSubDepartmentList.filter(
                                  (department) => {
                                    const isDepartmentVisible =
                                      selectedDepartment.some(
                                        (selected) =>
                                          selected.optionId === option.Id &&
                                          selected.visibility === true
                                        // selected.departmentId === department.SubDepartmentId
                                      );

                                    if (isDepartmentVisible) {
                                      return selectedDepartment.some(
                                        (selected) =>
                                          selected.optionId === option.Id &&
                                          selected.departmentId ===
                                          department.SubDepartmentId &&
                                          selected.visibility === true
                                      );
                                    }
                                    return true;
                                  }
                                ).map((department) =>
                                  department.SubDepartment_IncludedProductList.map(
                                    (subProduct: any) => (
                                      <div
                                        key={
                                          subProduct.ComboOptionIncludedDepartmentProductRowId
                                        }
                                      >
                                        <div
                                          className="wraps_flexs flex ComboOptionDiv"
                                          id={`product_${subProduct.ComboOptionIncludedDepartmentProductRowId}_${option.Id}`}
                                        >
                                          <label
                                            className="container "
                                            htmlFor={`Chk_${subProduct.ComboOptionIncludedDepartmentProductRowId}_${option.Id}`}
                                            style={{ width: "67%" }}
                                          >
                                            <div className="!text-md !font-semibold text-black">
                                              {subProduct.Name}
                                            </div>{" "}
                                            <input
                                              type="checkbox"
                                              id={`Chk_${subProduct.ComboOptionIncludedDepartmentProductRowId}_${option.Id}`}
                                              checked={selectedProducts.some(
                                                (selected) =>
                                                  selected.productId ===
                                                  subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                  selected.optionId ===
                                                  option.Id &&
                                                  selected.departmentId ===
                                                  subProduct.SubDepartmentId
                                              )}
                                              onChange={(e) =>
                                                handleCheckboxChange(
                                                  subProduct.SubDepartmentId,
                                                  subProduct.ComboOptionIncludedDepartmentProductRowId,
                                                  subProduct.Name,
                                                  option.Id,
                                                  option.MaxSelection,
                                                  e.target.checked
                                                )
                                              }

                                            />
                                            <span
                                              className="checkmark qtyValue"
                                              data-minvalue={0}
                                              data-maxvalue={
                                                option.MaxSelection
                                              }
                                            >
                                              {selectedProducts.find(
                                                (selected) =>
                                                  selected.productId ===
                                                  subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                  selected.optionId ===
                                                  option.Id &&
                                                  selected.departmentId ===
                                                  subProduct.SubDepartmentId
                                              )
                                                ? selectedProducts.find(
                                                  (selected) =>
                                                    selected.productId ===
                                                    subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                    selected.optionId ===
                                                    option.Id &&
                                                    selected.departmentId ===
                                                    subProduct.SubDepartmentId
                                                )?.quantity
                                                : 0}
                                            </span>
                                          </label>

                                          <div
                                            className="price-box mt-3"
                                            style={{ width: "40%" }}
                                          >
                                            <span className="counter-btns">
                                              <span
                                                className="plus"
                                                onClick={() =>
                                                  adjustProductQuantity(
                                                    subProduct.SubDepartmentId,
                                                    subProduct.ComboOptionIncludedDepartmentProductRowId,
                                                    option.Id,
                                                    1,
                                                    option.MaxSelection
                                                  )
                                                }
                                                style={{
                                                  pointerEvents:
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                        product.optionId ===
                                                        option.Id &&
                                                        product.quantity <
                                                        option.MaxSelection
                                                    ) &&
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                        product.optionId ===
                                                        option.Id
                                                    )
                                                      ? "auto"
                                                      : "none",
                                                }}
                                              >
                                                <i className="fa fa-plus increaseQty" />
                                              </span>
                                              <span
                                                className="minus"
                                                onClick={() =>
                                                  adjustProductQuantity(
                                                    subProduct.SubDepartmentId,
                                                    subProduct.ComboOptionIncludedDepartmentProductRowId,
                                                    option.Id,
                                                    -1,
                                                    option.MaxSelection
                                                  )
                                                }
                                                style={{
                                                  pointerEvents:
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                        product.optionId ===
                                                        option.Id &&
                                                        product.quantity > 1
                                                    ) &&
                                                    selectedProducts.some(
                                                      (product) =>
                                                        product.productId ===
                                                        subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                        product.optionId ===
                                                        option.Id
                                                    )
                                                      ? "auto"
                                                      : "none",
                                                }}
                                              >
                                                <i className="fa fa-minus decreaseQty" />
                                              </span>
                                            </span>
                                          </div>
                                        </div>

                                        {subProduct.ModifierList.map(
                                          (modifiers: any) => {
                                            const isProductAndOptionSelected =
                                              selectedProducts.some(
                                                (selectedProduct) =>
                                                  selectedProduct.productId ===
                                                  subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                  selectedProduct.optionId ===
                                                  option.Id
                                              );

                                            if (isProductAndOptionSelected) {
                                              return (
                                                <div
                                                  className="accordion"
                                                  id={`ComboOptionIncludedItemModifiers_Section_mobile_view_${modifiers.ComboOptionIncludedDepartmentProductModifierRowId}`}
                                                  key={
                                                    modifiers.ComboOptionIncludedDepartmentProductModifierRowId
                                                  }
                                                >
                                                  <div
                                                    className="card productModifiers"
                                                    data-pmid="10081"
                                                  >
                                                    <div
                                                      className="card-header"
                                                      id={`acc_head_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedDepartmentProductModifierRowId}`}
                                                    >
                                                      <button
                                                        className="btn btn-link btn-block text-left !flex"
                                                        type="button"
                                                        onClick={() =>
                                                          togglemodifiers(
                                                            option.Id,
                                                            modifiers.ComboOptionIncludedDepartmentProductModifierRowId
                                                          )
                                                        }
                                                        aria-expanded={
                                                          toggleModifierState.some(
                                                            (modifier) =>
                                                              modifier.OptionId ===
                                                              option.Id &&
                                                              modifier.ModifierId ===
                                                              modifiers.ComboOptionIncludedDepartmentProductModifierRowId &&
                                                              modifier.checked
                                                          )
                                                            ? "true"
                                                            : "false"
                                                        }
                                                        aria-controls={`acc_body_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedDepartmentProductModifierRowId}`}
                                                      >
                                                        <IoMdArrowDropright
                                                          size={25}
                                                          className={`text-black transition-transform duration-300 ${toggleModifierState.some(
                                                            (modifier) =>
                                                              modifier.OptionId ===
                                                              option.Id &&
                                                              modifier.ModifierId ===
                                                              modifiers.ComboOptionIncludedDepartmentProductModifierRowId &&
                                                              modifier.checked
                                                          )
                                                            ? "rotate-90"
                                                            : ""
                                                            }`}
                                                        />
                                                        <div>
                                                        <h5>
                                                            {
                                                              modifiers.ModifierName
                                                            }
                                                            {modifiers.IsMandatory ===
                                                              1 && (
                                                            <span className="opt_min">
                                                              Required
                                                            </span>
                                                              )}
                                                        </h5>
                                                        <h6>
                                                          ( Min:{" "}
                                                            {
                                                              modifiers.MinSelection
                                                            }{" "}
                                                          Max:{" "}
                                                            {
                                                              modifiers.MaxSelection
                                                            }
                                                          )
                                                          </h6>
                                                        </div>
                                                      </button>
                                                    </div>

                                                    {modifiers.ModifierOptionsList.map(
                                                      (
                                                        ModifierOptions: any
                                                      ) => (
                                                        <div
                                                          id={`acc_body_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedDepartmentProductModifierRowId}`}
                                                          className={`collapse ${toggleModifierState.some(
                                                            (modifier) =>
                                                              modifier.OptionId ===
                                                              option.Id &&
                                                              modifier.ModifierId ===
                                                                modifiers.ComboOptionIncludedDepartmentProductModifierRowId &&
                                                              modifier.checked
                                                          )
                                                            ? "show"
                                                            : ""
                                                          }`}
                                                          aria-labelledby={`acc_head_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedDepartmentProductModifierRowId}`}
                                                          data-parent={`#ComboOptionIncludedItemModifiers_Section_mobile_view_${modifiers.ComboOptionIncludedDepartmentProductModifierRowId}`}
                                                          key={
                                                            ModifierOptions.ModifierOptionId
                                                          }
                                                        >
                                                          <div className="card-body">
                                                            <div className="checkbx wraps_flexs modifierOptionDiv">
                                                              <label
                                                                className="container"
                                                                style={{
                                                                  width: "67%",
                                                                }}
                                                              >
                                                                {
                                                                  ModifierOptions.OptionName
                                                                }
                                                                <input
                                                                  type="checkbox"
                                                                  id={`input_modifierOption_ComboProduct_mobile_view_${modifiers.ComboOptionIncludedDepartmentProductModifierRowId}_${ModifierOptions.ModifierOptionId}`}
                                                                  className="form-check-input"
                                                                  onChange={(e) =>
                                                                    handleModifierCheckbox(
                                                                      subProduct.SubDepartmentId,
                                                                      ModifierOptions.ModifierOptionId,
                                                                      modifiers.ComboOptionIncludedDepartmentProductModifierRowId,
                                                                      option.Id,
                                                                      subProduct.ComboOptionIncludedDepartmentProductRowId,
                                                                      ModifierOptions.Price,
                                                                      e.target.checked
                                                                    )
                                                                  }
                                                                  checked={
                                                                    (modiferCheckBox.find(
                                                                      (modifier) =>
                                                                        modifier.departmentId === subProduct.SubDepartmentId &&
                                                                        modifier.OptionId === option.Id &&
                                                                        modifier.productId === subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                                        modifier.ModifierId === modifiers.ComboOptionIncludedDepartmentProductModifierRowId &&
                                                                        modifier.ModifierOptionId === ModifierOptions.ModifierOptionId
                                                                    ) || { checked: false }).checked
                                                                  }
                                                                />
                                                                <span
                                                                  className="checkmark qtyValue"
                                                                  data-minvalue="0"
                                                                  data-maxvalue="10"
                                                                >
                                                                  {getQuantity(
                                                                    subProduct.SubDepartmentId,
                                                                    ModifierOptions.ModifierOptionId,
                                                                    modifiers.ComboOptionIncludedDepartmentProductModifierRowId,
                                                                    option.Id
                                                                  )}
                                                                </span>
                                                              </label>
                                                              <div
                                                                className="price-box"
                                                                style={{
                                                                  width: "40%",
                                                                }}
                                                              >
                                                                {modiferCheckBox &&
                                                                  modiferCheckBox.some(
                                                                    (chck) =>
                                                                      chck.OptionId ===
                                                                      option.Id &&
                                                                      chck.ModifierId ===
                                                                      modifiers.ComboOptionIncludedDepartmentProductModifierRowId &&
                                                                      chck.ModifierOptionId ===
                                                                      ModifierOptions.ModifierOptionId &&
                                                                      chck.departmentId ===
                                                                      subProduct.SubDepartmentId &&
                                                                      chck.checked ===
                                                                      true
                                                                  ) && (
                                                                    <span className="counter-btns">
                                                                      <span
                                                                        className="plus"
                                                                        onClick={() =>
                                                                          adjustModifierQuantity(
                                                                            subProduct.SubDepartmentId,
                                                                            subProduct.ComboOptionIncludedDepartmentProductRowId,
                                                                            option.Id,
                                                                            modifiers.ComboOptionIncludedDepartmentProductModifierRowId,
                                                                            ModifierOptions.ModifierOptionId,
                                                                            1,
                                                                            modifiers.MaxSelection,
                                                                            ModifierOptions.Price
                                                                          )
                                                                        }
                                                                        style={{
                                                                          pointerEvents:
                                                                            selectedModifiers.some(
                                                                              (
                                                                                modifier
                                                                              ) =>
                                                                                modifier.modifierId ===
                                                                                modifiers.ComboOptionIncludedDepartmentProductModifierRowId &&
                                                                                modifier.optionId ===
                                                                                option.Id &&
                                                                                modifier.ModifiersoptionId ===
                                                                                ModifierOptions.ModifierOptionId &&
                                                                                modifier.productId ===
                                                                                subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                                                modifier.quantity ===
                                                                                modifiers.MaxSelection
                                                                            )
                                                                            ? "none"
                                                                            : "auto",
                                                                      }}
                                                                    >
                                                                      <i className="fa fa-plus increaseQty" />
                                                                    </span>
                                                                    <span
                                                                      className="minus"
                                                                      onClick={() =>
                                                                        adjustModifierQuantity(
                                                                          subProduct.SubDepartmentId,
                                                                          subProduct.ComboOptionIncludedDepartmentProductRowId,
                                                                          option.Id,
                                                                          modifiers.ComboOptionIncludedDepartmentProductModifierRowId,
                                                                          ModifierOptions.ModifierOptionId,
                                                                          -1,
                                                                          modifiers.MaxSelection,
                                                                          ModifierOptions.Price
                                                                        )
                                                                      }
                                                                      style={{
                                                                        pointerEvents:
                                                                          selectedModifiers.some(
                                                                            (
                                                                              modifier
                                                                            ) =>
                                                                              modifier.modifierId ===
                                                                                modifiers.ComboOptionIncludedDepartmentProductModifierRowId &&
                                                                              modifier.optionId ===
                                                                              option.Id &&
                                                                              modifier.ModifiersoptionId ===
                                                                              ModifierOptions.ModifierOptionId &&
                                                                              modifier.productId ===
                                                                                subProduct.ComboOptionIncludedDepartmentProductRowId &&
                                                                              modifier.quantity ===
                                                                              1
                                                                          )
                                                                              ? "none"
                                                                              : "auto",
                                                                        }}
                                                                      >
                                                                        <i className="fa fa-minus decreaseQty" />
                                                                      </span>
                                                                    </span>
                                                                  )}

                                                                <span className="price-span">
                                                                  +$
                                                                  {
                                                                    ModifierOptions.Price
                                                                  }
                                                                </span>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            }
                                            return null;
                                          }
                                        )}
                                      </div>
                                    )
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                <form className="addition-bx pb-5">
                  <div className="form-group">
                    <label htmlFor="txtAdditionalNotesMobileView">
                      Additional notes if any ?
                    </label>
                    <textarea
                      className="form-control"
                      id="txtAdditionalNotesMobileView"
                      placeholder="Extra comments (optional)"
                      rows={3}
                        defaultValue={""}
                        onChange={(e) => setAdditionalNote(e.target.value)}
                    />
                  </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="modal-footer z-1">
              <div className="footer-row ">
                <div className=" ">
                  <div className="row align-items-center">
                    <Link
                      to="/mobile/confirm-order"
                      className=" col-6 col-sm-4 col-md-4 col-lg-4 text-center btn btn-success rounded-0"
                    >
                      <h4
                        id="totalPriceForCartMobileView"
                        className="totalPriceForCartMobileView"
                      >
                        $ {(total * quantity).toFixed(2)}
                      </h4>
                    </Link>
                    <button
                      type="button"
                      onClick={addToCart}
                      className="col-6 col-sm-8  col-md-8 col-lg-8 text-center btn btn-success rounded-0 btnAddToCartMobileView"
                    >
                      <h4 id="chngTxtAddOrderMobileView">Add to Order</h4>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
