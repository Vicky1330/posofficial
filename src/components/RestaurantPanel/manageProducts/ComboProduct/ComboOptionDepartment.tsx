import React, { useEffect, useState } from "react";

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

interface Product {
  Id: number;
  Name: string;
  Status: number;
  ModifiersList: Modifier[];
}

interface SubDepartment {
  SubDepartmentName: string;
  comboProductId: number;
  SubDepartmentId: number;
  SubDepartment_ProductListWithModifiers: Product[];
  productsList: Product[];
}

interface ModifierToggle {
  departmeentId: number;
  productId: number;
  modifierId: number;
}

interface ComboOptionDepartmentProps {
  departmentProduct: SubDepartment[];
  mode: number;
  onFormData: (data: any) => void;
  updatedDepartmentData: any[];
  deleteDepartment: (Id: number) => void;
}

const ComboOptionDepartment: React.FC<ComboOptionDepartmentProps> = ({
  departmentProduct = [],
  mode,
  onFormData,
  updatedDepartmentData,
  deleteDepartment
}) => {
  // const [subDepartmentId, setSubDepartmentId] = useState();
  // const [comboProductId, setComboProductId] = useState(departmentProduct.length > 0 ? departmentProduct[0].comboProductId : null);
  // const UserToken_Global = localStorage.getItem("authToken");
  const [isDepartmentOpen, setIsDepartmentOpen] = useState<Record<string, boolean>>({});
  const [isProductOpen, setProductOpen] = useState<Record<number, boolean>>({});
  const [modifierStatus, setModifierStatus] = useState<Record<number, boolean>>({});
  const [modifierOptionStatus, setModifierOptionStatus] = useState<Record<number, boolean>>({});
  // const [productStatus, setProductOptionStatus] = useState<{departmentId:number,productId:number}[]>([]);
  const [maxAllowed, setMaxAllowed] = useState<number>(1);
  const [modiifierToggle, setModiferToggle] = useState<ModifierToggle[]>([]);
  // const [modifierStatus, setModiferStatus] = useState<ModifierToggleStatus[]>([]);

  const toggleDepartment = (deptId: string) => {
    setIsDepartmentOpen((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  const toggleProduct = (productId: number) => {
    setProductOpen((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const toggleModifier = (departmentId: number, productId: number, modifierId: number) => {
    setModiferToggle((prev) => {
      const exists = prev.some(
        (item) =>
          item.departmeentId === departmentId &&
          item.productId === productId &&
          item.modifierId === modifierId
      );
      if (exists) {
        return prev.filter(
          (item) =>
            !(
              item.departmeentId === departmentId &&
              item.productId === productId &&
              item.modifierId === modifierId
            )
        );
      } else {
        return [
          ...prev,
          { departmeentId: departmentId, productId: productId, modifierId: modifierId },
        ];
      }
    });
  };


  const handleMaxAllowedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      parseInt(e.target.value, 10);
    setMaxAllowed(value);
    onFormData((prev:any) => ({ ...prev, maxAllowed: value }));
  };

  const toggleModifierCheckbox = (
    modifierId: number,
    productId: number,
    departmentId: number,
    checked: boolean,
  ) => {

    const updatedData = JSON.parse(JSON.stringify(updatedDepartmentData));
    const department = updatedData.find((dep:any) => dep.id === departmentId);
    if (!department) return;
    const product = department.productsData.find((prod:any) => prod.id === productId);
    if (!product) return;
    const modifier = product.modifiersData.find((mod:any) => mod.id === modifierId);
    if (!modifier) return;

    if (checked) {
      modifier.modifierStatus = 1;
      const departmentProductData = departmentProduct.find(dp =>
        dp.SubDepartment_ProductListWithModifiers?.some(p => p.Id === productId)
      );

      if (departmentProductData) {
        const productInDepartment = departmentProductData.SubDepartment_ProductListWithModifiers.find(
          p => p.Id === productId
        );

        const modifierInDepartment = productInDepartment?.ModifiersList?.find(
          m => m.Id === modifierId
        );

        if (modifierInDepartment) {
          modifier.modifierOptions = modifierInDepartment.OptionsList.map(opt => ({
            id: opt.Id,
            modifierOptionStatus: 1,
          }));
        }
      }
    } else {
      modifier.modifierStatus = 0;
      modifier.modifierOptions = [];
    }
    onFormData(updatedData);
  };

  const handleModifierOptionChange = (
    departmentId: number,
    productId: number,
    modifierId: number,
    optionId: number,
    status: boolean
  ) => {

    const updatedData = JSON.parse(JSON.stringify(updatedDepartmentData));

    const department = updatedData.find((dept:any) => dept.id === departmentId);
    if (!department) return;

    const product = department.productsData.find((prod:any) => prod.id === productId);
    if (!product) return;

    const modifier = product.modifiersData.find((mod:any) => mod.id === modifierId);
    if (!modifier) return;

    const option = modifier.modifierOptions.find((opt:any) => opt.id === optionId);
    if (!option) return;

    option.modifierOptionStatus = status ? 1 : 0;
    onFormData(updatedData);
  };
  


  const toggleProductWithAll = (departmentId: number, productId: number) => {
    // setProductOpen((prev) => ({ ...prev, [productId]: !prev[productId] }));
  
    const departmentExists = updatedDepartmentData.some((department) =>
      department.id === departmentId &&
      department.productsData.some((product:any) => product.id === productId)
    );

    if (departmentExists) {
      // Remove the product and update status
      const newDepartmentData = updatedDepartmentData.map((department) => {
        if (department.id === departmentId) {
          return {
            ...department,
            productsData: department.productsData.filter((product:any) => product.id !== productId)
          };
        }
        return department;
      });

      // Reset modifier and modifier option statuses
      const productToRemove = departmentProduct
        .flatMap((department) => department?.SubDepartment_ProductListWithModifiers || department?.productsList || [])
        .find((product) => product.Id === productId);

      if (productToRemove) {
        productToRemove.ModifiersList.forEach((modifier) => {
          setModifierStatus((prev) => ({ ...prev, [modifier.Id]: false }));
          modifier.OptionsList.forEach((option) => {
            setModifierOptionStatus((prev) => ({ ...prev, [option.Id]: false }));
          });
        });
      }

      onFormData(newDepartmentData);
    } else {
      // Add the product and update status
      const productToAdd = departmentProduct
        .flatMap((department) => department?.SubDepartment_ProductListWithModifiers || department?.productsList || [])
        .find((product) => product.Id === productId);
      if (productToAdd) {
        const modifiersData = productToAdd.ModifiersList
          // .filter((modifier) => modifier.IsIncluded_Into_ComboOptionIncludedItem === 1)
          .map((modifier) => ({
            id: modifier.Id,
            modifierStatus: 1,
            modifierOptions: modifier.OptionsList
              // .filter((option) => option.IsIncluded_Into_ComboOptionIncludedItem === 1)
              .map((option) => ({ id: option.Id, modifierOptionStatus: 1 }))
          }));

        const newProductData = {
          id: productToAdd.Id,
          modifiersData,
        };

        const newDepartmentData = updatedDepartmentData.map((department) => {
          if (department.id === departmentId) {
            return {
              ...department,
              productsData: [
                ...department.productsData.filter((product:any) => product.id !== productId),
                newProductData
              ]
            };
          }
          return department;
        });

        productToAdd.ModifiersList.forEach((modifier) => {
          setModifierStatus((prev) => ({ ...prev, [modifier.Id]: true }));
          modifier.OptionsList.forEach((option) => {
            setModifierOptionStatus((prev) => ({ ...prev, [option.Id]: true }));
          });
        });

        onFormData(newDepartmentData);
      }
    }
  };
  

  useEffect(() => {
    if (mode === 2 || mode === 1) {
      const transformedFormData = departmentProduct.map((department:any) => ({
        id: department.SubDepartmentId,
        type: "department",
        maxAllowed: department.maxAllowed || maxAllowed,
        productsData: (
          department?.SubDepartment_ProductListWithModifiers || department?.productsList || []
        )
          .filter((product:any) => product.IsIncluded_Into_ComboOptionIncludedItem === 1)
          .map((product:any) => ({
            id: product.Id,
            modifiersData: (product?.ModifiersList || [])
              .map((modifier:any) => ({
                id: modifier.Id,
                modifierStatus: modifier.IsIncluded_Into_ComboOptionIncludedItem,
                modifierOptions: (modifier?.OptionsList || [])
                  .filter((option:any) => option.IsIncluded_Into_ComboOptionIncludedItem === 1)
                  .map((option:any) => ({
                    id: option.Id,
                    modifierOptionStatus: 1,
                  })),
              })),
          })),
      }));

      onFormData(transformedFormData);
    }

  }, [departmentProduct, mode, maxAllowed]);


  const renderModifiers = (departmentId: number, productId: number, modifiers: Modifier[] = []) => (
    <div
      className="accordion-collapse"
      style={{
        border: "1px solid rgb(206, 212, 218)",
        padding: "10px",
        background: "rgb(255, 255, 255)",
      }}
    >
      <div className="dv_ModifiersArea_IncludedItemProductClass p-2">
        <label className="lblComboOptionStyle" style={{ marginTop: "20px" }}>
          Modifiers
        </label>
        <div className="accordion" id={`dv_ModifiersArea_IncludedItemProduct_${productId}`}>
          {(modifiers || []).map((modifier:any) => (
            <div key={modifier.Id} className="accordion-item">
              <div className="accordion-header flex justify-between items-center mx-3 my-2">
                <button
                  className="font-semibold"
                  onClick={() => toggleModifier(departmentId, productId, modifier.Id)}
                >
                  {modifier.ModifierName}
                </button>
                <label className="switch round_wraps">
                  <input
                   id={`chkStatus_IncludedItemProductModifier_${modifier.Id}`}
                    type="checkbox"
                    defaultChecked={
                      modifier.IsIncluded_Into_ComboOptionIncludedItem !== undefined
                        ? modifier.IsIncluded_Into_ComboOptionIncludedItem
                        : modifierStatus[modifier.Id] 
                    }
                    // checked={!!modifierStatus[modifier.Id]} 
                    onChange={(e) => toggleModifierCheckbox(modifier.Id, productId, departmentId, e.target.checked)}
                  />
                  <span className="slider round ModifierActivationToggleClass"></span>
                </label>
              </div>
              {modiifierToggle.find((mod) => mod.productId === productId && mod.departmeentId === departmentId && mod.modifierId === modifier.Id) && (
                <div
                  className="accordion-collapse modifier-options"
                  style={{ border: "1px solid rgb(206, 212, 218)" }}
                >
                  <div className="accordion-body">
                    <label className="lblComboOptionStyle">
                      Modifier Options
                    </label>
                    <ul className="list-group">
                      {(modifier?.OptionsList || []).map((option:any) => (
                        <li
                          key={option.Id}
                          className="list-group-item"
                          style={{ padding: "0.4375rem 0.75rem" }}
                        >
                          {option.OptionName}
                          <label
                            className="switch round_wraps"
                            style={{ float: "right" }}
                          >
                            <input
                              id={`chkStatus_IncludedItemProductModifierOption_${modifier.Id}_${option.Id}`}
                              type="checkbox"
                              defaultChecked={
                                option.IsIncluded_Into_ComboOptionIncludedItem !== undefined
                                  ? option.IsIncluded_Into_ComboOptionIncludedItem
                                  : modifierOptionStatus[option.Id] 
                              }
                              
                              onChange={(e) =>
                                handleModifierOptionChange(
                                  departmentId,
                                  productId,
                                  modifier.Id,
                                  option.Id,
                                  e.target.checked
                                )
                                // handleOptionToggle(option.Id,modifier.Id,productId)
                              }
                            />
                            <span className="slider round ModifierActivationToggleClass"></span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  

  return (
    <div className="accordion" >
      {departmentProduct.map((dept:any) => (
        <div
          key={dept.SubDepartmentName}
          id={dept.SubDepartmentName}
          className="accordion Included_Item_DragDrop"
          style={{ marginBottom: "19px", background: "rgb(255, 255, 255)" }}
        >
          <div style={{ height: "auto", background: "#99929236" }}>
            <div className="accordion-header" id={`Dep_${dept.SubDepartmentName}`} onClick={() => toggleDepartment(dept.SubDepartmentName)}>
              <div>
                <div
                  className="!py-[10px] px-2 flex justify-between"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "initial",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <span className="lblIncludedItemStyle">Department:</span> {" "}
                    {dept.SubDepartmentName}
                  </span>
                  <img
                    src="/Content/Images/delete_icon.png"
            className="w-5 h-6 my-auto mx-auto"
                    style={{ cursor: "pointer" }}
                    alt="delete"
                    onClick={() => deleteDepartment(dept.SubDepartmentId)}
                  />
                </div>
              </div>
            </div>
          </div>
          {isDepartmentOpen[dept.SubDepartmentName] && (
            <div
              className="accordion-collapse p-2 "
              style={{ border: "1px solid rgb(206, 212, 218)" }}
            >
              <div
                style={{
                  display: "flex",
                  marginTop: "15px",
                  marginBottom: "15px",
                  alignItems: "flex-end",
                }}
              >
                <label
                  className="col-6 lblComboOptionStyle"
                  style={{ marginBottom: "0.5rem", paddingLeft: "8px" }}
                >
                  Default Max Allowed
                </label>
                <input
                  type="number"
                  id={`${dept.Id}`}
                  value={maxAllowed}
                  onChange={handleMaxAllowedChange}
                  placeholder="Max Allowed"
                  className="form-control plus_imput_feild "
                  style={{
                    borderRadius: "25px !important",
                    border: "1px solid #ced4da",
                    fontSize: "initial",
                  }}
                />
              </div>
              <div className="" >
                {(mode === 1 ? dept?.productsList || [] : dept?.SubDepartment_ProductListWithModifiers || dept?.productsList || []
                ).map((product:any) => (
                  <div
                    key={product.Id}
                    className="accordion Included_Item_DragDrop"
                    style={{
                      marginBottom: "19px",
                      // background: "rgb(255, 255, 255)",
                      background:" rgba(153, 146, 146, 0.21)"
                      
                    }}
                  >
                    <div>
                      <div
                        className="accordion-header gap-1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px",
                          
                        }}
                      >
                        <span
                          onClick={() => toggleProduct(product.Id)}
                          style={{
                            fontSize: "initial",
                            cursor: "pointer",
                            width: "100%",
                          }}
                        >
                          <span className="lblIncludedItemStyle">Product</span>{" "}
                          : {product.Name}
                        </span>
                        <label
                          className="switch round_wraps"
                          style={{
                            paddingRight: "39px",
                            marginTop: "7px",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <input
                           id={`chkStatus_IncludedItemProductModifier_${product.Id}`}
                            type="checkbox"
                            defaultChecked={
                              product.IsIncluded_Into_ComboOptionIncludedItem !== undefined
                              ? product.IsIncluded_Into_ComboOptionIncludedItem
                              : modifierStatus[product.Id] 
                            }
                            // checked={!!isProductOpen[product.Id]} 
                            onChange={() => toggleProductWithAll(dept.SubDepartmentId, product.Id)}
                          />
                          <span
                            className="slider round ModifierActivationToggleClass"
                            style={{ top: "-5px" }}
                          ></span>
                        </label>
                      </div>
                    </div>

                    {isProductOpen[product.Id] &&
                      renderModifiers(dept.SubDepartmentId, product.Id, product.ModifiersList)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComboOptionDepartment;
