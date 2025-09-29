import React from "react";
import { ValidatedSelect } from "./ValidationErrorDisplay"; 
import { WILAYAS } from "../constants/wilayas";

interface WilayaSelectProps {
  fieldName: string;
  errors: Record<string, string[]>;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const WilayaSelect: React.FC<WilayaSelectProps> = ({
  fieldName,
  errors,
  required = false,
  value,
  customStyle,
  onChange
}) => {
  const options = WILAYAS.map(wilaya => ({
    value: wilaya,
    label: wilaya,
  }));

  return (
    <ValidatedSelect
      label="Wilaya"
      fieldName={'fieldName'}
      errors={errors}
      required={required}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={fieldName}
      customStyle={customStyle}
    />
  );
};
