
import React, { useState, useEffect } from "react";


interface ComboOptionProductProps {
  productListing: any[];
  onTransformedData: (data: any[]) => void; 
  transformedFormData: any[];
  DeleteProduct: (data: number) => void;
}
const ComboOptionProduct: React.FC<ComboOptionProductProps> = ({
  productListing,
  onTransformedData,
  transformedFormData,
  DeleteProduct
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [modifiersStatus, setModifiersStatus] = useState<Record<number, boolean>>({});
  const [optionsStatus, setOptionsStatus] = useState<Record<number, boolean>>({});
  // const [productStatus, setProductStatus] = useState<Record<number, boolean>>({});
  const [maxAllowed, setMaxAllowed] = useState<Record<number, string>>({});
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  const isSectionExpanded = (sectionId: string) =>
    expandedSections.includes(sectionId);

  const handleMaxAllowedChange = (productId: number, value: string) => {
    setMaxAllowed((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // const [toggledProducts, setToggledProducts] = useState<Set<number>>(new Set());

  // const handleProductToggle = (id: number) => {
  //   const newToggledProducts = new Set(toggledProducts);
  //   const newStatus = !productStatus[id];

  //   setProductStatus(prevStatus => ({
  //     ...prevStatus,
  //     [id]: newStatus,
  //   }));

  //   if (newToggledProducts.has(id)) {
  //     newToggledProducts.delete(id);
  //   } else {
  //     newToggledProducts.add(id);
  //   }

  //   const newModifiersStatus: Record<number, boolean> = { ...modifiersStatus };
  //   const newOptionsStatus: Record<number, boolean> = { ...optionsStatus };

  //   productListing.forEach(product => {
  //     if (newToggledProducts.has(product.Id)) {
  //       newModifiersStatus[product.Id] = newStatus;
  //     }

  //     product.ModifiersList.forEach((modifier:any) => {
  //       newModifiersStatus[modifier.Id] = newStatus;

  //       modifier.OptionsList.forEach((option:any) => {
  //         newOptionsStatus[option.Id] = newStatus;
  //       });
  //     });
  //   });

  //   setModifiersStatus(newModifiersStatus);
  //   setOptionsStatus(newOptionsStatus);
  //   setToggledProducts(newToggledProducts);

  //   const updatedTransformedData = productListing.map(product => {
  //     const updatedModifiersData = product.ModifiersList.map((modifier:any)=> {
  //       const updatedModifierOptions = modifier.OptionsList.map((option:any) => {
  //         return {
  //           id: option.Id,
  //           modifierOptionStatus: newOptionsStatus[option.Id] ? 1 : 0,
  //         };
  //       });

  //       return {
  //         id: modifier.Id,
  //         modifierStatus: newModifiersStatus[modifier.Id] ? 1 : 0,
  //         modifierOptions: updatedModifierOptions,
  //       };
  //     });

  //     return {
  //       id: product.Id,
  //       type: "product",
  //       maxAllowed: 1,
  //       modifiersData: updatedModifiersData,
  //     };
  //   });

  //   onTransformedData(updatedTransformedData);
  // };

  const handleModifierToggle = (modifierId: number, productId: number) => {
    const currentStatus = modifiersStatus[modifierId];
    const newStatus = !currentStatus;

    // Update the modifiersStatus for this modifierId
    setModifiersStatus(prev => ({
      ...prev,
      [modifierId]: newStatus,
    }));

    // Update the transformedFormData to reflect the changes
    const updatedTransformedData = transformedFormData.map(product => {
      if (product.id === productId) {
        let updatedModifiersData = [...product.modifiersData];

        // Find the modifier to add based on productId and modifierId
        const modifierToAdd = productListing
          .find(p => (p.ProductId || p.Id) === productId)
          ?.ProductModifiersList?.find((modifier: any) => modifier.Id === modifierId)
          ||
          productListing
            .find(p => (p.ProductId || p.Id) === productId)
            ?.ModifiersList?.find((modifier: any) => modifier.Id === modifierId);

        if (modifierToAdd) {
          if (newStatus) {
            const modifierWithOptions = {
              id: modifierToAdd.Id,
              modifierOptions: modifierToAdd.OptionsList.map((option: any) => ({
                id: option.Id,
              })),
            };
            modifierToAdd.OptionsList.forEach((option: any) => {
              setOptionsStatus(prev => ({
                ...prev,
                [option.Id]: true,
              }));
            });
            if (!updatedModifiersData.some(modifier => modifier.id === modifierToAdd.Id)) {
              updatedModifiersData = [...updatedModifiersData, modifierWithOptions];
            }
          } else {
            updatedModifiersData = updatedModifiersData.filter((modifier: any) => modifier.id !== modifierId);
            modifierToAdd.OptionsList.forEach((option: any) => {
              setOptionsStatus(prev => ({
                ...prev,
                [option.Id]: false,
              }));
            });
          }
        }

        return {
          ...product,
          modifiersData: updatedModifiersData,
        };
      }
      return product;
    });
    onTransformedData(updatedTransformedData);
  };


  const handleOptionToggle = (optionId: number, modifierId: number, productId: number) => {
    setOptionsStatus(prev => ({ ...prev, [optionId]: !prev[optionId] }));

    const newStatus = !optionsStatus[optionId];

    const updatedTransformedData = transformedFormData.map(product => {
      if (product.id === productId) {
        const updatedModifiersData = product.modifiersData.map((modifier: any) => {
          if (modifier.id === modifierId) {
            const updatedModifierOptions = newStatus
              ?
              [...modifier.modifierOptions, { id: optionId }]
              :
              modifier.modifierOptions.filter((option: any) => option.id !== optionId);

            return {
              ...modifier,
              modifierOptions: updatedModifierOptions, 
            };
          }
          return modifier;
        });

        return {
          ...product,
          modifiersData: updatedModifiersData,
        };
      }
      return product;
    });
    onTransformedData(updatedTransformedData);
  };

  // Extract all the data dynamically
  useEffect(() => {
    // const initialToggledProducts = new Set(productListing.map(product => product.Id));
    // setToggledProducts(initialToggledProducts);

    const allProductStatuses: Record<number, boolean> = {};
    const allOptionStatus: Record<number, boolean> = {};
    const allModifierStatus: Record<number, boolean> = {};

    productListing.forEach(product => {
      if (product.Id || product.ProductId) allProductStatuses[product.Id] = true;
      (product.ProductModifiersList || product.ModifiersList).forEach((modifier:any) => {
        if (modifier.Id) allModifierStatus[modifier.Id] = modifier.IsIncluded_Into_ComboOptionIncludedItem === 1;
        (modifier.OptionsList || []).forEach((option:any) => {
          if (option.Id) allOptionStatus[option.Id] = option.IsIncluded_Into_ComboOptionIncludedItem === 1;
        });
      });
    });

    setModifiersStatus(allModifierStatus);
    setOptionsStatus(allOptionStatus);
    const transformedData = productListing.map((product) => ({
      id: product.ProductId || product.Id, 
      type: "product", 
      maxAllowed: maxAllowed[product.ProductId || product.Id] ? parseInt(maxAllowed[product.ProductId || product.Id], 10) : 1,
      modifiersData: (product.ProductModifiersList || product.ModifiersList || [])  
        .filter((modifier:any) => modifier.IsIncluded_Into_ComboOptionIncludedItem === 1)  
        .map((modifier:any) => ({
          id: modifier.Id, 
          modifierOptions: (modifier.OptionsList || []).filter((option:any) => option.IsIncluded_Into_ComboOptionIncludedItem === 1) 
            .map((option:any) => ({
              id: option.Id, 
            }))
        }))
    }));

    onTransformedData(transformedData); 
  }, [maxAllowed, productListing]);

  return (
    <div
      className="accordion Included_Item_DragDrop"
      style={{
        marginBottom: "19px",
        background: "rgb(255, 255, 255)",
      }}
    >
      {productListing.map((product) => (
        <div
          key={product.Id}
          id={`IncludedItemProduct_${product.Id}`}
          // className="accordion-item mb-3"
          className="accordion Included_Item_DragDrop"
          style={{ marginBottom: "19px", background: "rgb(255, 255, 255)" }}
        >
          <div >
            <div
              className="bg-gray-200 !py-[10px] px-2 flex justify-between"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                background: "rgba(153, 146, 146, 0.21)"
              }}
            >
              <span
                onClick={() =>
                  toggleSection(`IncludedItemProductArea_${product.Id}`)
                }
                style={{
                  fontSize: "initial",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <span className="lblIncludedItemStyle">Product</span>: {product.ProductName || product.Name}
              </span>

              <img
                src="../../Content/Images/delete_icon.png"
                // width="27px"
                // height="27px"
                className="w-5 h-6 my-auto mx-auto"
                onClick={() => DeleteProduct(product.ProductId || product.Id)}
                style={{ cursor: "pointer" }}
              />

            </div>
          </div>
          <div
            id={`IncludedItemProductArea_${product.Id}`}
            className={`accordion-collapse ${
              isSectionExpanded(`IncludedItemProductArea_${product.Id}`)
                ? "show"
                : ""
            }`}
            style={{
              border: "1px solid rgb(206, 212, 218)",
              padding: "10px",
              display: isSectionExpanded(`IncludedItemProductArea_${product.Id}`)
                ? "block"
                : "none",
            }}
          >
            <div style={{ display: "flex" }}>
              <div style={{ width: "100%" }} className="mt-4">
                <label
                  className="lblComboOptionStyle "
                  style={{ marginLeft: "14.5px" }}
                >
                  Max Allowed
                </label>
                <input
                  type="text"
                  className="form-control custom-input-field w-full"
                  id={`txtMaxAllowed_IncludedItemProduct_${product.Id}`}
                  style={{
                    borderRadius: "25px",
                    border: "1px solid #ced4da",
                    fontSize: "initial",
                    // width: "95%",
                    float: "right",
                  }}
                  value={maxAllowed[product.Id] || 1}
                  onChange={(e) =>
                    handleMaxAllowedChange(product.Id, e.target.value)
                  }
                />
              </div>
            </div>
            <div className="dv_ModifiersArea_IncludedItemProductClass">
              <label className="lblComboOptionStyle">Modifiers</label>
              {(product.ProductModifiersList || product.ModifiersList)?.map((modifier:any) => (
                <div className="accordion-item" key={modifier.Id}>
                  <div
                    className="accordion-header flex flex-wrap"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      className="text-xs  pl-3 font-semibold  text-black "
                      onClick={() =>
                        toggleSection(`ModifierArea_${modifier.Id}`)
                      }
                      style={{ textDecoration: "none" }}
                    >
                      {modifier.ModifierName}
                    </button>
                    <label
                      className="switch round_wraps"
                      style={{
                        paddingRight: "49px",
                        marginRight: "1rem",
                        marginTop: "7px",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <input
                        id={`chkStatus_IncludedItemProductModifier_${modifier.Id}`}
                        type="checkbox"
                        checked={modifiersStatus[modifier.Id] || false}
                        onChange={() => handleModifierToggle(modifier.Id, (product.ProductId || product.Id))}
                      />
                      <span className="slider round ModifierActivationToggleClass" />
                    </label>
                  </div>
                  <div
                    id={`ModifierArea_${modifier.Id}`}
                    className={`accordion-collapse ${
                      isSectionExpanded(`ModifierArea_${modifier.Id}`)
                        ? "show"
                        : ""
                    }`}
                    style={{
                      padding: "10px",
                      display: isSectionExpanded(`ModifierArea_${modifier.Id}`)
                        ? "block"
                        : "none",
                    }}
                  >
                    <div className="accordion-body p-0">
                      <label
                        className="lblComboOptionStyle"
                        style={{
                          borderTop: "1px solid #ced4da",
                          width: "100%",
                        }}
                      >
                        Modifier Options
                      </label>
                      {modifier.OptionsList && modifier.OptionsList.length > 0 ? (
                        modifier.OptionsList.map((option:any) => (
                          <ul
                            className="list-group"
                            id={`btn_Accordion_IncludedItemProductModifier_${option.Id}`}
                            key={option.Id}
                            style={{ padding: "4px" }}
                          >
                            <li
                              className="list-group-item"
                              aria-current="true"
                              style={{
                                padding: "0.4375rem 0.75rem",
                                margin: "0px",
                              }}
                            >
                              {option.OptionName}
                              <label
                                className="switch round_wraps"
                                style={{
                                  float: "right",
                                  marginBottom: "0px",
                                }}
                              >
                                <input
                                  id={`chkStatus_IncludedItemProductModifierOption_${modifier.Id}_${option.Id}`}
                                  type="checkbox"
                                  checked={optionsStatus[option.Id] || false} 
                                  onChange={() => handleOptionToggle(option.Id, modifier.Id, product.ProductId)}
                                />
                                <span className="slider round ModifierActivationToggleClass"></span>
                              </label>
                            </li>
                          </ul>
                        ))
                      ) : (
                        <ul className="list-group" style={{ padding: "12px" }}>
                          <li
                            className="list-group-item"
                            style={{ padding: "0.4375rem 0.75rem" }}
                          >
                            No Options Available
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComboOptionProduct;
