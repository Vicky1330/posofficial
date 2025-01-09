import React from "react";

type Option = {
  id: number;
  label: string;
  value: string;
  price: string;
  min: number;
  max: number;
  checked?: boolean;
};

type ModifierProps = {
  title: string;
  subtitle: string;
  modifierId: number;
  options: Option[];
  onOptionChange: (optionId: number, checked: boolean) => void;
};

const ModifierComponent: React.FC<ModifierProps> = ({
  title,
  subtitle,
  modifierId,
  options,
  onOptionChange,
}) => {
  return (
    <div className="card productModifiers" data-pmid={modifierId}>
      <div className="card-header" id={`acc_head_${modifierId}`}>
        <button
          className="btn btn-link btn-block text-left"
          type="button"
          data-toggle="collapse"
          data-target={`#acc_body_${modifierId}`}
          aria-expanded="false"
          aria-controls={`acc_body_${modifierId}`}
        >
          <h5>
            {title}
            <span className="opt_min d-none">Required</span>
          </h5>
          <h6>{subtitle}</h6>
        </button>
      </div>
      <div
        id={`acc_body_${modifierId}`}
        className=" show"
        aria-labelledby={`acc_head_${modifierId}`}
      >
        <div className="card-body">
          {options.map((option) => (
            <div
              className="checkbx wraps_flexs modifierOptionDiv"
              id={`modifierOptionDiv_${modifierId}_${option.id}`}
              data-modifieroptionid={option.id}
              key={option.id}
            >
              <label
                className="container"
                htmlFor={`input_modifierOption_${modifierId}_${option.id}`}
                style={{ width: "67%" }}
              >
                {option.label}
                <input
                  type="checkbox"
                  className="form-check-input checbox_checked"
                  value={option.value}
                  id={`input_modifierOption_${modifierId}_${option.id}`}
                  checked={option.checked || false}
                  onChange={(e) =>
                    onOptionChange(option.id, e.target.checked)
                  }
                />
                <span
                  className="checkmark qtyValue"
                  id={`modifierOptionQuantity_${modifierId}_${option.id}`}
                  data-minvalue={option.min}
                  data-maxvalue={option.max}
                  data-modifieroptionvalue="1"
                >
                  1
                </span>
              </label>
              <div className="price-box" style={{ width: "40%" }}>
                <span className="counter-btns wrsp_prics">
                  <span className="plus">
                    <i className="fa fa-plus increaseQty"></i>
                  </span>
                  <span className="minus disabled">
                    <i className="fa fa-minus decreaseQty btn_quantity_disabled"></i>
                  </span>
                </span>
                <span className="price-span price_accordings">{option.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModifierComponent;
