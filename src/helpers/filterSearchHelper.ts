import { isRef } from "vue";

export const filterEmptyValues = (values: Record<string, any>) => {
    const filteredValues: Record<string, any> = {};
  
    for (const key in values) {
      if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
        filteredValues[key] = values[key];
      }
    }
  
    return filteredValues;
  };

export const findKeyWithSuffix = <T extends Record<string, any>>(fields: T, baseKey: string): keyof T | undefined => {
    return Object.keys(fields).find(key => key.includes(baseKey)) as keyof T | undefined;
};
export const resetField = <T extends Record<string, any>>(fields: T, key: keyof T) => {
  let fieldKey: keyof T = key;
    const tempKey = findKeyWithSuffix(fields, key as string);
    if (tempKey) {
        fieldKey = tempKey;
    }
    const field = fields[fieldKey];
    if (isRef(field)) {
        field.value = Array.isArray(field.value) ? ([] as any) : "";
    } else {
        fields[fieldKey] = Array.isArray(field) ? ([] as any) : "";
    }
};

export const resetFields = <T extends Record<string, any>>(fields: T) => {
  Object.entries(fields).forEach(([key, field]) => {
      if (isRef(field)) {
          field.value = Array.isArray(field.value) ? ([] as any) : "";
      } else {
          fields[key as keyof T] = Array.isArray(field) ? ([] as any) : "" as any;
      }
  });
};