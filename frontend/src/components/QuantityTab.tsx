import React from "react";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";
import { ValidatedNumberInput } from "./ValidationErrorDisplay";
import type { IProduct } from "../types/product";

const PRODUCT_LIMITS = {
  MAX_QUANTITY_PER_INQUIRY_MIN: 1,
  MAX_QUANTITY_PER_INQUIRY_MAX: 100,
};

// Main QuantityTab component
interface QuantityTabProps {
  formData: IProduct; // Use IProduct interface instead of any
  setFormData: React.Dispatch<React.SetStateAction<IProduct>>;
  validationErrors: Record<string, string[]>;
}

const QuantityTab: React.FC<QuantityTabProps> = ({
  formData,
  setFormData,
  validationErrors,
}) => {
  // Determine current mode
  const mode: "disable" | "single" | "multiple" = formData.allowQuantity === false
    ? "disable"
    : formData.allowMultipleQuantities
    ? "multiple"
    : "single";

  const maxQuantity = formData.maxQuantityPerInquiry ?? 1;

  // Handle radio button mode changes
  const handleModeChange = (newMode: "disable" | "single" | "multiple") => {
    if (newMode === "disable") {
      setFormData((prev: IProduct) => ({
        ...prev,
        allowQuantity: false,
        allowMultipleQuantities: false,
      }));
    } else if (newMode === "single") {
      setFormData((prev: IProduct) => ({
        ...prev,
        allowQuantity: true,
        allowMultipleQuantities: false,
        maxQuantityPerInquiry: 1,
      }));
    } else if (newMode === "multiple") {
      setFormData((prev: IProduct) => ({
        ...prev,
        allowQuantity: true,
        allowMultipleQuantities: true,
        maxQuantityPerInquiry: Math.max(2, prev.maxQuantityPerInquiry || 2),
      }));
    }
  };

  // Handle number input changes
  const handleMaxQuantityChange = (value: number) => {
    setFormData((prev: IProduct) => ({
      ...prev,
      maxQuantityPerInquiry: value,
    }));
  };

  // Handle blur → enforce min/max constraints
  const handleMaxQuantityBlur = () => {
    setFormData((prev: IProduct) => {
      let safeValue = prev.maxQuantityPerInquiry;

      if (mode === "multiple") {
        if (!safeValue || safeValue < 2) safeValue = 2;
        if (safeValue > PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX) {
          safeValue = PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX;
        }
      } else {
        // For disable and single modes, ensure it's at least 1
        safeValue = Math.max(1, safeValue || 1);
      }

      return {
        ...prev,
        maxQuantityPerInquiry: safeValue,
      };
    });
  };

  // Validation rules
  const getConfigValidation = () => {
    const errors: string[] = [];
    
    if (mode === "single" && maxQuantity > 1) {
      errors.push("Single item restriction is enabled but max quantity per inquiry is greater than 1.");
    }
    if (mode === "multiple" && maxQuantity < 2) {
      errors.push("Maximum quantity for multiple mode must be at least 2.");
    }
    if (mode === "disable" && maxQuantity !== 1) {
      errors.push("When quantity is disabled, max quantity should be 1.");
    }
    
    return { errors };
  };

  const configValidation = getConfigValidation();
  const hasConfigurationErrors = configValidation.errors.length > 0;

  return (
    <div className="space-y-6">
      {/* Mode selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Quantity Settings</h3>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="quantityMode"
              value="disable"
              checked={mode === "disable"}
              onChange={() => handleModeChange("disable")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">Disable quantity selection</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="quantityMode"
              value="single"
              checked={mode === "single"}
              onChange={() => handleModeChange("single")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">Restrict to single item per inquiry</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="quantityMode"
              value="multiple"
              checked={mode === "multiple"}
              onChange={() => handleModeChange("multiple")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">Allow multiple items per inquiry</span>
          </label>
        </div>
      </div>

      {/* Max Quantity Per Inquiry */}
      {mode === "multiple" && (
        <div className="pl-6">
          <ValidatedNumberInput
            label="Maximum quantity per inquiry"
            fieldName="maxQuantityPerInquiry"
            description="Set the maximum number of items a customer can request in a single inquiry"
            value={maxQuantity}
            onChange={handleMaxQuantityChange}
            onBlur={handleMaxQuantityBlur}
            min={2}
            max={PRODUCT_LIMITS.MAX_QUANTITY_PER_INQUIRY_MAX}
            validationErrors={validationErrors}
          />
        </div>
      )}

      {/* Current Configuration Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Current Configuration</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Mode:</strong> {mode === "disable" ? "Quantity Disabled" : mode === "single" ? "Single Item Only" : "Multiple Items Allowed"}</p>
          <p><strong>Allow Quantity:</strong> {formData.allowQuantity ? "Yes" : "No"}</p>
          <p><strong>Allow Multiple Quantities:</strong> {formData.allowMultipleQuantities ? "Yes" : "No"}</p>
          <p><strong>Max Quantity:</strong> {maxQuantity}</p>
        </div>
      </div>

      {/* Auto-Correction Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiInfo className="h-4 w-4 text-blue-600" />
          <h4 className="text-sm font-medium text-blue-900">Auto-Correction Notice</h4>
        </div>
        <p className="text-sm text-blue-800 mb-2">
          The system will automatically enforce valid combinations during save:
        </p>
        <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
          <li>If quantity is disabled, customer won't see quantity input</li>
          <li>If restricted to single item, max quantity will be set to 1</li>
          <li>If max quantity is above 1, multiple items mode will be enabled</li>
          <li>Max quantity is always kept at least 1 for data consistency</li>
        </ul>
      </div>

      {/* Configuration Errors */}
      {hasConfigurationErrors && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertTriangle className="h-4 w-4 text-red-600" />
            <h4 className="text-sm font-medium text-red-900">Configuration Errors</h4>
          </div>
          <ul className="text-sm text-red-800 list-disc pl-5 space-y-1">
            {configValidation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuantityTab;