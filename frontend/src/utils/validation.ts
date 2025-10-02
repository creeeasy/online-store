import type { IProduct, IOffer, IProductColor, IDynamicField, IHiddenField } from '../types/product';

export interface ValidationError {
  field: string;
  message: string;
  tab: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  errorsByTab: Record<string, ValidationError[]>;
}

// Define which fields belong to which tabs
export const FIELD_TO_TAB_MAPPING: Record<string, string> = {
  // Basic Info tab
  'name': 'basic',
  'price': 'basic',
  'discountPrice': 'basic',
  'description': 'basic',
  'images': 'basic',
  'reference': 'basic',
  
  // Quantity tab
  'allowQuantity': 'quantity',
  'allowMultipleQuantities': 'quantity',
  'maxQuantityPerInquiry': 'quantity',
  
  // Offers tab
  'offers': 'offers',
  
  // Colors tab
  'colors': 'colors',
  
  // Predefined tab
  'predefinedFields': 'predefined',
  
  // Dynamic Fields tab
  'dynamicFields': 'dynamic',
  
  // Hidden Fields tab
  'hiddenFields': 'hidden',
};

// Validation rules
export const validateProductForm = (formData: Partial<IProduct>): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Basic Info Validation
  validateBasicInfo(formData, errors);
  
  // Quantity Configuration Validation
  validateQuantityConfig(formData, errors);
  
  // Offers Validation
  validateOffers(formData, errors);
  
  // Colors Validation
  validateColors(formData, errors);
  
  // Predefined Fields Validation
  validatePredefinedFields(formData, errors);
  
  // Dynamic Fields Validation
  validateDynamicFields(formData, errors);
  
  // Hidden Fields Validation
  validateHiddenFields(formData, errors);
  
  // Group errors by tab
  const errorsByTab = groupErrorsByTab(errors);
  
  return {
    isValid: errors.length === 0,
    errors,
    errorsByTab,
  };
};

const validateBasicInfo = (formData: Partial<IProduct>, errors: ValidationError[]): void => {
  // Name validation
  if (!formData.name || formData.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Product name is required',
      tab: 'basic'
    });
  } else if (formData.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Product name must be at least 2 characters long',
      tab: 'basic'
    });
  } else if (formData.name.trim().length > 100) {
    errors.push({
      field: 'name',
      message: 'Product name cannot exceed 100 characters',
      tab: 'basic'
    });
  }
  
  // Price validation
  if (formData.price === undefined || formData.price === null) {
    errors.push({
      field: 'price',
      message: 'Price is required',
      tab: 'basic'
    });
  } else if (formData.price <= 0) {
    errors.push({
      field: 'price',
      message: 'Price must be greater than 0',
      tab: 'basic'
    });
  } else if (formData.price > 1000000) {
    errors.push({
      field: 'price',
      message: 'Price cannot exceed 1,000,000',
      tab: 'basic'
    });
  }
  
  // Discount price validation
  if (formData.discountPrice !== undefined && formData.discountPrice !== null) {
    if (formData.discountPrice <= 0) {
      errors.push({
        field: 'discountPrice',
        message: 'Discount price must be greater than 0',
        tab: 'basic'
      });
    } else if (formData.price && formData.discountPrice >= formData.price) {
      errors.push({
        field: 'discountPrice',
        message: 'Discount price must be less than regular price',
        tab: 'basic'
      });
    }
  }
  
  
  // Images validation
  if (!formData.images || formData.images.length === 0 || formData.images.every(img => !img || img.trim().length === 0)) {
    errors.push({
      field: 'images',
      message: 'At least one image is required',
      tab: 'basic'
    });
  } else {
    formData.images.forEach((image, index) => {
      if (!image || image.trim().length === 0) {
        errors.push({
          field: `images.${index}`,
          message: `Image ${index + 1} cannot be empty`,
          tab: 'basic'
        });
      }
    });
  }

  
  // Reference validation (optional but if provided, must be valid)
  if (formData.reference && formData.reference.trim().length > 50) {
    errors.push({
      field: 'reference',
      message: 'Reference cannot exceed 50 characters',
      tab: 'basic'
    });
  }
};

const validateQuantityConfig = (formData: Partial<IProduct>, errors: ValidationError[]): void => {
  const { allowQuantity, allowMultipleQuantities, maxQuantityPerInquiry } = formData;

  // allowQuantity is required
  if (allowQuantity === undefined || allowQuantity === null) {
    errors.push({
      field: 'allowQuantity',
      message: 'Allow quantity setting is required',
      tab: 'quantity'
    });
    return;
  }

  // allowMultipleQuantities is required
  if (allowMultipleQuantities === undefined || allowMultipleQuantities === null) {
    errors.push({
      field: 'allowMultipleQuantities',
      message: 'Multiple quantities setting is required',
      tab: 'quantity'
    });
    return;
  }

  // 🚫 Case 1: Quantity disabled
  if (!allowQuantity) {
    if (allowMultipleQuantities) {
      errors.push({
        field: 'allowMultipleQuantities',
        message: 'Cannot allow multiple quantities when quantity is disabled',
        tab: 'quantity'
      });
    }
    return;
  }

  // ✅ Case 2: Single mode
  if (allowQuantity && !allowMultipleQuantities) {
    // allow skipping (backend defaults to 1 if not provided)
    if (maxQuantityPerInquiry !== undefined && maxQuantityPerInquiry !== null && maxQuantityPerInquiry !== 1) {
      errors.push({
        field: 'maxQuantityPerInquiry',
        message: 'Max quantity must be 1 in single mode',
        tab: 'quantity'
      });
    }
    return;
  }

  // ✅ Case 3: Multiple mode
  if (allowQuantity && allowMultipleQuantities) {
    if (maxQuantityPerInquiry === undefined || maxQuantityPerInquiry === null) {
      errors.push({
        field: 'maxQuantityPerInquiry',
        message: 'Max quantity is required in multiple mode',
        tab: 'quantity'
      });
    } else if (maxQuantityPerInquiry < 2) {
      errors.push({
        field: 'maxQuantityPerInquiry',
        message: 'Max quantity must be at least 2 in multiple mode',
        tab: 'quantity'
      });
    } else if (maxQuantityPerInquiry > 1000) {
      errors.push({
        field: 'maxQuantityPerInquiry',
        message: 'Max quantity cannot exceed 1000',
        tab: 'quantity'
      });
    }
  }
};



const validateOffers = (formData: Partial<IProduct>, errors: ValidationError[]): void => {
  if (!formData.offers) return;
  
  formData.offers.forEach((offer, index) => {
    validateSingleOffer(offer, index, errors);
  });
};

const validateSingleOffer = (offer: IOffer, index: number, errors: ValidationError[]): void => {
  const fieldPrefix = `offers.${index}`;
  
  // Title validation
  if (!offer.title || offer.title.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.title`,
      message: `Offer ${index + 1}: Title is required`,
      tab: 'offers'
    });
  } else if (offer.title.trim().length < 3) {
    errors.push({
      field: `${fieldPrefix}.title`,
      message: `Offer ${index + 1}: Title must be at least 3 characters long`,
      tab: 'offers'
    });
  } else if (offer.title.trim().length > 100) {
    errors.push({
      field: `${fieldPrefix}.title`,
      message: `Offer ${index + 1}: Title cannot exceed 100 characters`,
      tab: 'offers'
    });
  }
  
  // Description validation (optional)
  if (offer.description && offer.description.trim().length > 500) {
    errors.push({
      field: `${fieldPrefix}.description`,
      message: `Offer ${index + 1}: Description cannot exceed 500 characters`,
      tab: 'offers'
    });
  }
  
  // Price validation
  if (offer.originalPrice !== undefined && offer.originalPrice !== null) {
    if (offer.originalPrice <= 0) {
      errors.push({
        field: `${fieldPrefix}.originalPrice`,
        message: `Offer ${index + 1}: Original price must be greater than 0`,
        tab: 'offers'
      });
    }
  }
  
  if (offer.discountedPrice !== undefined && offer.discountedPrice !== null) {
    if (offer.discountedPrice <= 0) {
      errors.push({
        field: `${fieldPrefix}.discountedPrice`,
        message: `Offer ${index + 1}: Discounted price must be greater than 0`,
        tab: 'offers'
      });
    } else if (offer.originalPrice && offer.discountedPrice >= offer.originalPrice) {
      errors.push({
        field: `${fieldPrefix}.discountedPrice`,
        message: `Offer ${index + 1}: Discounted price must be less than original price`,
        tab: 'offers'
      });
    }
  }
  
  
};

const validateColors = (formData: Partial<IProduct>, errors: ValidationError[]): void => {
  if (!formData.colors) return;
  
  const colorNames = new Set<string>();
  const hexCodes = new Set<string>();
  
  formData.colors.forEach((color, index) => {
    validateSingleColor(color, index, errors, colorNames, hexCodes);
  });
};

const validateSingleColor = (
  color: IProductColor, 
  index: number, 
  errors: ValidationError[], 
  colorNames: Set<string>, 
  hexCodes: Set<string>
): void => {
  const fieldPrefix = `colors.${index}`;
  
  // Name validation
  if (!color.name || color.name.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.name`,
      message: `Color ${index + 1}: Name is required`,
      tab: 'colors'
    });
  } else if (color.name.trim().length < 2) {
    errors.push({
      field: `${fieldPrefix}.name`,
      message: `Color ${index + 1}: Name must be at least 2 characters long`,
      tab: 'colors'
    });
  } else if (color.name.trim().length > 30) {
    errors.push({
      field: `${fieldPrefix}.name`,
      message: `Color ${index + 1}: Name cannot exceed 30 characters`,
      tab: 'colors'
    });
  } else {
    // Check for duplicate names
    const normalizedName = color.name.trim().toLowerCase();
    if (colorNames.has(normalizedName)) {
      errors.push({
        field: `${fieldPrefix}.name`,
        message: `Color ${index + 1}: Duplicate color name "${color.name}"`,
        tab: 'colors'
      });
    } else {
      colorNames.add(normalizedName);
    }
  }
  
  // Hex code validation
  if (!color.hexCode || color.hexCode.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.hexCode`,
      message: `Color ${index + 1}: Hex code is required`,
      tab: 'colors'
    });
  } 
};

const validatePredefinedFields = (formData: Partial<IProduct>, errors: ValidationError[]): void => {
  if (!formData.predefinedFields) return;
  
  formData.predefinedFields.forEach((field, index) => {
    if (field.isActive && (!field.selectedOptions || field.selectedOptions.length === 0)) {
      errors.push({
        field: `predefinedFields.${index}.selectedOptions`,
        message: `${field.category}: At least one option must be selected when field is active`,
        tab: 'predefined'
      });
    }
  });
};

const validateDynamicFields = (formData: Partial<IProduct>, errors: ValidationError[]): void => {
  if (!formData.dynamicFields) return;
  
  const fieldKeys = new Set<string>();

  formData.dynamicFields.forEach((field, index) => {
    validateSingleDynamicField(field, index, errors, fieldKeys);
  });
};

const validateSingleDynamicField = (
  field: IDynamicField, 
  index: number, 
  errors: ValidationError[], 
  fieldKeys: Set<string>
): void => {
  const fieldPrefix = `dynamicFields.${index}`;
  
  // Key validation
  if (!field.key || field.key.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.key`,
      message: `Dynamic Field ${index + 1}: Key is required`,
      tab: 'dynamic'
    });
  } else if (field.key.trim().length < 2) {
    errors.push({
      field: `${fieldPrefix}.key`,
      message: `Dynamic Field ${index + 1}: Key must be at least 2 characters long`,
      tab: 'dynamic'
    });
  } else if (field.key.trim().length > 50) {
    errors.push({
      field: `${fieldPrefix}.key`,
      message: `Dynamic Field ${index + 1}: Key cannot exceed 50 characters`,
      tab: 'dynamic'
    });
  } else {
    // Check for duplicate keys
    const normalizedKey = field.key.trim().toLowerCase();
    if (fieldKeys.has(normalizedKey)) {
      errors.push({
        field: `${fieldPrefix}.key`,
        message: `Dynamic Field ${index + 1}: Duplicate field key "${field.key}"`,
        tab: 'dynamic'
      });
    } else {
      fieldKeys.add(normalizedKey);
    }
  }
  
  // Placeholder validation
  if (!field.placeholder || field.placeholder.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.placeholder`,
      message: `Dynamic Field ${index + 1}: Placeholder is required`,
      tab: 'dynamic'
    });
  } else if (field.placeholder.trim().length > 100) {
    errors.push({
      field: `${fieldPrefix}.placeholder`,
      message: `Dynamic Field ${index + 1}: Placeholder cannot exceed 100 characters`,
      tab: 'dynamic'
    });
  }
};

const validateHiddenFields = (formData: Partial<IProduct>, errors: ValidationError[]): void => {
  if (!formData.hiddenFields) return;
  
  const fieldKeys = new Set<string>();
  
  formData.hiddenFields.forEach((field, index) => {
    validateSingleHiddenField(field, index, errors, fieldKeys);
  });
};

const validateSingleHiddenField = (
  field: IHiddenField, 
  index: number, 
  errors: ValidationError[], 
  fieldKeys: Set<string>
): void => {
  const fieldPrefix = `hiddenFields.${index}`;
  
  // Key validation
  if (!field.key || field.key.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.key`,
      message: `Hidden Field ${index + 1}: Key is required`,
      tab: 'hidden'
    });
  } else if (field.key.trim().length < 2) {
    errors.push({
      field: `${fieldPrefix}.key`,
      message: `Hidden Field ${index + 1}: Key must be at least 2 characters long`,
      tab: 'hidden'
    });
  } else if (field.key.trim().length > 50) {
    errors.push({
      field: `${fieldPrefix}.key`,
      message: `Hidden Field ${index + 1}: Key cannot exceed 50 characters`,
      tab: 'hidden'
    });
  } else {
    // Check for duplicate keys
    const normalizedKey = field.key.trim().toLowerCase();
    if (fieldKeys.has(normalizedKey)) {
      errors.push({
        field: `${fieldPrefix}.key`,
        message: `Hidden Field ${index + 1}: Duplicate field key "${field.key}"`,
        tab: 'hidden'
      });
    } else {
      fieldKeys.add(normalizedKey);
    }
  }
  
  // Value validation
  if (!field.value || field.value.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.value`,
      message: `Hidden Field ${index + 1}: Value is required`,
      tab: 'hidden'
    });
  } else if (field.value.trim().length > 500) {
    errors.push({
      field: `${fieldPrefix}.value`,
      message: `Hidden Field ${index + 1}: Value cannot exceed 500 characters`,
      tab: 'hidden'
    });
  }
  
  // Description validation
  if (!field.description || field.description.trim().length === 0) {
    errors.push({
      field: `${fieldPrefix}.description`,
      message: `Hidden Field ${index + 1}: Description is required`,
      tab: 'hidden'
    });
  } else if (field.description.trim().length > 200) {
    errors.push({
      field: `${fieldPrefix}.description`,
      message: `Hidden Field ${index + 1}: Description cannot exceed 200 characters`,
      tab: 'hidden'
    });
  }
};

const groupErrorsByTab = (errors: ValidationError[]): Record<string, ValidationError[]> => {
  return errors.reduce((acc, error) => {
    const tab = error.tab || 'basic';
    if (!acc[tab]) {
      acc[tab] = [];
    }
    acc[tab].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
};

// Updated helper functions to handle nested validation error structures
export const hasFieldError = (fieldName: string, errors: any = []): boolean => {
  if (!errors) return false;

  // If errors is an array, use the original logic
  if (Array.isArray(errors)) {
    return errors.some(error => 
      error.field === fieldName || 
      error.field?.startsWith(`${fieldName}.`)
    );
  }

  // If errors is an object, check if it has an 'offers' array
  if (typeof errors === 'object' && errors.offers && Array.isArray(errors.offers)) {
    return errors.offers.some((error: ValidationError) => 
      error.field === fieldName || 
      error.field?.startsWith(`${fieldName}.`)
    );
  }

  return false;
};

export const getFieldErrors = (fieldName: string, errors: any = []): string[] => {
  if (!errors) return [];

  let errorArray: ValidationError[] = [];

  // Extract the appropriate error array based on the structure
  if (Array.isArray(errors)) {
    errorArray = errors;
  } else if (typeof errors === 'object' && errors.offers && Array.isArray(errors.offers)) {
    errorArray = errors.offers;
  }

  return errorArray
    .filter((error) =>
      error.field === fieldName ||
      error.field?.startsWith(`${fieldName}.`)
    )
    .map((error) => error.message);
};