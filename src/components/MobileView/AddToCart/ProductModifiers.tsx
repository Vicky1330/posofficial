import React, { useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { IoMdArrowDropright } from "react-icons/io";

interface ModifierOption {
  Id: number;
  OptionName: string;
  Price: number;
  IsDefaultPreSelectedOption: boolean;
  MaxAllowed:number
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

interface ProductModifiersProps {
  modifier: ProductModifier;
  updateModifierTotalPrice: (price: number) => void;
  quantities: { [key: number]: number };
  setQuantities: React.Dispatch<
    React.SetStateAction<{ [key: number]: number }>
  >;
}

const ProductModifiers: React.FC<ProductModifiersProps> = ({
  modifier,
  updateModifierTotalPrice,
  quantities,
  setQuantities,
}) => {
  const [expandedKey, setExpandedKey] = useState<string | null>("0");
  // const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [toggleState, setToggleState] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Calculate total price
  const handleToggle = (key: string, modifierId: number) => {
    setExpandedKey(expandedKey === key ? null : key);
    setToggleState((prevState) => ({
      ...prevState,
      [modifierId]: !prevState[modifierId],
    }));
  };

  const calculateTotalPrice = (newQuantities:any) => {
    let total = 0;
    modifier.ModifierOptionList.forEach((option) => {
      const quantity = newQuantities[option.Id] || 0;
      total += option.Price * quantity;
    });
    updateModifierTotalPrice(total);
  };

  const handleCheckboxChange = (option: ModifierOption, checked: boolean) => {
    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [option.Id]: checked ? 1 : 0,
      };
      calculateTotalPrice(newQuantities);
      return newQuantities;
    });
  };

  const handleQuantityChange = (increment: boolean, option: ModifierOption) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[option.Id] || 0;
      const newQuantity = increment
        ? Math.min(option.MaxAllowed, currentQuantity + 1)
        : Math.max(0, currentQuantity - 1);
      const newQuantities = {
        ...prevQuantities,
        [option.Id]: newQuantity,
      };
      calculateTotalPrice(newQuantities);
      return newQuantities;
    });
  };

  return (
    <Accordion activeKey={expandedKey} className="productModifiers">
      <Card className="!shadow-md">
        <Card.Header id={`acc_head_Mobile_View_${modifier.Id}`}>
          <Button
            variant="link"
            className="btn btn-block text-left !flex pl-2 pr-2"
            onClick={() => handleToggle(modifier.Id.toString(), modifier.Id)}
            aria-controls=""
          >
            <div className="flex">
              <IoMdArrowDropright
                size={25}
                className={`text-black transition-transform duration-300 ${toggleState[modifier.Id] ? "rotate-90" : ""
                  }`}
              />
              <div className="w-full">
                <h5>
                  {modifier.ModifierName}
                  {modifier.IsMandatory === 1 && (
                    <span className="opt_min">Required</span>
                  )}
                </h5>
                <h6>
                  (Min: {modifier.MinSelection} Max: {modifier.MaxSelection})
                </h6>
              </div>
            </div>
          </Button>
        </Card.Header>
        <Accordion.Collapse eventKey={modifier.Id.toString()} >
          <Card.Body className="px-0">
            {modifier.ModifierOptionList.map((option) => (
              <div
                key={option.Id}
                className="checkbx wraps_flexs modifierOptionDiv px-2  bg-gray-100"
                id={`modifierOptionDiv_mobile_view_${option.Id}`}
                data-modifieroptionid={option.Id}
              >
                <label
                  className="container"
                  htmlFor={`input_modifierOption_mobile_view_${option.Id}`}
                  style={{ width: "67%" }}
                >
                  {option.OptionName}
                  <input
                    type="checkbox"
                    className="form-check-input checbox_checked"
                    value={option.OptionName}
                    id={`input_modifierOption_mobile_view_${option.Id}`}
                    defaultChecked={option.IsDefaultPreSelectedOption}
                    onChange={(e) =>
                      handleCheckboxChange(option, e.target.checked)
                    }
                  />
                  <span
                    className="checkmark qtyValue"
                    id={`modifierOptionQuantity_mobile_view_${option.Id}`}
                    data-minvalue={modifier.MinSelection}
                    data-maxvalue={modifier.MaxSelection}
                    data-modifieroptionvalue={quantities[option.Id]}
                  >
                    {quantities[option.Id]}
                  </span>
                </label>
                <div className="price-box" style={{ width: "40%" }}>
                  <span
                    className="counter-btns wrsp_prics"
                    style={{ display: "block" }}
                  >
                    <span className="plus">
                      <i
                        className="fa fa-plus increaseQty"
                        onClick={() => handleQuantityChange(true, option)}
                      />
                    </span>
                    <span className="minus">
                      <i
                        className="fa fa-minus decreaseQty"
                        onClick={() => handleQuantityChange(false, option)}
                      />
                    </span>
                  </span>
                  <span className="price-span price_accordings">
                    +${option.Price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default ProductModifiers;
