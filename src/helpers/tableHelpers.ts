import type { IRule } from "@/modules/rules/interfaces/IRules";
import type { BodyRowClassNameFunction, Header, HeaderItemClassNameFunction, Item, SortType } from "vue3-easy-data-table";
export const sortBy: string[] = ["number", "weight"];
export const sortType: SortType[] = ["desc", "asc"];

export const toggleExpand = (items:any) => {
    if (typeof items.expanded === 'undefined') {
      items.expanded = {};
    }
      for (let x = 0; x < items.length; x++) {
        if(x !==0){
          items.expanded[x] = !items.expanded[x];
        }
      };
    }
export const countItem = (items:any) => {
    if(items === undefined) false
    return  items.length > 0
}
  export const isExpanded = (items:any, index:number) => {
    return items.expanded && items.expanded[index];
  };
  export const colorButton = (value: string | undefined)  => {
      if(value === undefined) return 'success'
    const colorMap: Record<string, 'success' | 'warning' | 'primary'> = {
      active: 'success',
      suspended: 'warning',
      expired: 'primary',
    };
   
    return colorMap[value] ;
  };
  export const colorButtonClass = (value: string | undefined)  => {
    if(value === undefined) return 'color-button-status-active'
  const colorMap: Record<string, 'color-button-status-active' | 'color-button-status-suspended' | 'color-button-status-expired'> = {
    active: 'color-button-status-active',
    suspended: 'color-button-status-suspended',
    expired: 'color-button-status-expired',
    inactive: 'color-button-status-active',
    cancelled: 'color-button-status-active',
  };
 
  return colorMap[value] ;
};
export const iconTagClass = (value: string | undefined)  => {
  if(value === undefined) return 'check_circle'
const colorMap: Record<string, string> = {
  active: 'check_circle',
  suspended: 'pause_circle',
  expired: 'check_circle',
  inactive: 'check_circle',
  cancelled: 'close',
  saved:'check_circle'
};

return colorMap[value] ;
};
  export const colorTagClass = (value: string | undefined)  => {
    if(value === undefined) return 'color-tag-status-bloccanti'
  const colorMap: Record<string, 'color-tag-status-bloccanti' | 'color-tag-status-permissive' | 'color-tag-status-traccianti'> = {
    tracking: 'color-tag-status-traccianti',
    permissive: 'color-tag-status-permissive',
    prohibitive: 'color-tag-status-bloccanti',
  };
 
  return colorMap[value] ;
};
  export const colorButtonEventType = (value: string | undefined)  => {
    if(value === undefined) return 'color-button-status-tracking'
  const colorMap: Record<string, 'color-button-status-tracking' | 'color-button-status-blocking' > = {
    tracking: 'color-button-status-tracking',
    prohibitive: 'color-button-status-blocking',
    
  };
 
  return colorMap[value] ;
};

export const colorButtonRulesType = (value: string | undefined)  => {
  if(value === undefined) return 'color-button-status-tracking'
  const colorMap: Record<string, 'color-button-status-tracking' | 'color-button-status-blocking' | 'color-button-status-prohibitive' > = {
  tracking: 'color-button-status-tracking',
  permissive: 'color-button-status-prohibitive',
  prohibitive: 'color-button-status-blocking'
};

return colorMap[value] ;
};





export const getValuesAndIds = (data:any[],row:string) => {
    if(data.length === 0) return '-'
    return data.map((value:any) => value[row]).join(',  ');
}
export const getValues = (data:any[]) => {
  if(data === undefined || data === null) return '-'
    if(data.length === 0) return '-'
    return data.map((value:any) => value).join(',  ');
}
export const getValuesAndIdsInCol = (data:any[],row:string) => {
    if(data?.length === 0) return '-'
    const values = data.map((value: any) => value[row]);
    return `<div class="column-container">${values.map(val => `<div class="column-item">${val}</div>`).join('')}</div>`;
    
}
export const getAllValuesAndIdsInCol = (data: any[], row: string) => {
  if (data.length === 0) return '-';
  const values = data.flatMap((item: any) => item[row] || []);
  return `<div class="column-container">${values.map(val => `<div class="column-item">${val}</div>`).join('')}</div>`;
}
export const getValuesAndIdsExpanded = (data:any[],row:string,expanded: boolean) => {
  if (data.length === 0) return '-';
  if (expanded) {
      if(data.length === 1) return `<p>${data[0][row]}</p>`
      return data.map((value: any,index:number) =>{
        if (index === data.length - 1) {
          return `<p>${value[row]}</p>`;
      } else {
          return `<p>${value[row]},</p>`;
      }
      } ).join('');
  } else {
    if(data.length === 1) return `<p>${data[0][row]}</p>`
    const firstItem = data.length > 0 ? `<p>${data[0][row]} [...]</p>` : '-';
    return firstItem;
  }
}
export const getValuesSeparatedComma = (data:any[],row:string,expanded: boolean) => {
  if (data.length === 0) return '-';
  if (expanded) {
    return `<p>${data.map((value: any, index: number) => {
        if (index === data.length - 1) {
            return `${value[row]}`;
        } else {
            return `${value[row]}, `;
        }
    }).join('')}</p>`;
} else {
  if (data.length === 1) {
      return `<p>${data[0][row]}</p>`;
  } else if (data.length >= 2) {
      return `<p>${data[0][row]}, ${data[1][row]} [...]</p>`;
  } else {
      const firstItems = data.slice(0, 2).map((value: any) => `<p>${value[row]} ,`).join('');
      const remainingItems = data.length > 2 ? ` [...]</p>` : '';
      return firstItems + remainingItems;
  }
}
}
export const capitalizeFirstLetter = (str:string | undefined) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

export const countItems = (data:any[]) => {
  if(data === undefined) return 0
  return data.length
}

export const bodyRowClassNameFunction = (item: Item, rowNumber: number,isEXPAND:boolean): string => {
  if (item.checkbox && isEXPAND) return 'classColorCustom classRowCustom';
  if (item.checkbox) return 'classColorCustom';
  if (isEXPAND) return 'classRowCustom';
  return '';
};
export const headerItemClassNameFunction: HeaderItemClassNameFunction = (header: Header, columnNumber: number): string => {
  if (header.value === "checkbox") return 'checkbox-column-custom';
  return '';
};
export const caseInsensitiveIncludes = (value:string, criteria:string) => {
  if (value != null && criteria != null && typeof value === 'string') {
    const lowercaseValue = value.toLowerCase();
    const lowercaseCriteria = criteria.toLowerCase();
    return lowercaseValue.includes(lowercaseCriteria);
  }
  return false;
};
export const caseInsensitiveStateIncludes = (value:string, criteria:string) => {
  if (value != null && criteria != null && typeof value === 'string') {
    const lowercaseValue = value.toLowerCase();
    const lowercaseCriteria = criteria.toLowerCase();

    if(lowercaseCriteria == 'active' || lowercaseCriteria == 'inactive'){
      return lowercaseValue == lowercaseCriteria
    }

    return lowercaseValue.includes(lowercaseCriteria);
  }
  return false;
};
export const caseInsensitiveIncludesArray = (value:string, criteria:string | string[]) => {
  if (value == null || criteria == null || typeof value !== 'string' || (!Array.isArray(criteria) && criteria !== '')) {
    return false;
  }
  const lowercaseValue = value.toLowerCase();
  if (Array.isArray(criteria)) {
    for (const item of criteria) {
      if (typeof item === 'string') {
        const lowercaseCriteria = item.toLowerCase();
        if (lowercaseValue.includes(lowercaseCriteria)) {
          return true;
        }
      }
    }
    return false;
  }
  const lowercaseCriteria = criteria.toLowerCase();

  return lowercaseValue.includes(lowercaseCriteria);
};
export const caseInsensitiveIncludesObject = (value: Object, criteria: string,search:string): boolean => {
  const criteriaLowerCase = criteria.toLowerCase(); 
        if (criteriaLowerCase === '') {
            return true;
        }
        if (Array.isArray(value) && criteria != null) {
            for (const item of value) {
                if (item != null && typeof item === 'object' && item[search] != null) {
                    const groupNameLowerCase = item[search].toLowerCase(); 
                    if (groupNameLowerCase.includes(criteriaLowerCase)) {
                        return true; 
                    }
                }
            }
        }
        return false; 
};

export const dateComparisonFunction = (value: any, criteria: string) => {
  const valueDate = new Date(value);
  const valueYear = valueDate.getFullYear();
  const valueMonth = ('0' + (valueDate.getMonth() + 1)).slice(-2); 
  const valueDay = ('0' + valueDate.getDate()).slice(-2); 
  const valueDateString = `${valueYear}-${valueMonth}-${valueDay}`;
  return valueDateString === criteria;
};
export const validateLargeText = (value:string, quantity:number) => {
  const valueLength = value.length;
  if (valueLength < quantity) return value;
  return value.slice(0, quantity) + '[...]';
}

export const groupRuleset = (users:IRule[],shcRules:IRule[],udsRules:IRule[]) => {
  const allRules = [...users, ...shcRules, ...udsRules];
  const uniqueRulesMap: { [key: string]: IRule } = {};

  allRules.forEach(rule => {
    uniqueRulesMap[rule.rule_id] = rule;
  });

  const uniqueRules = Object.values(uniqueRulesMap);
  return uniqueRules;
}
export const groupRulesetExport = (users:IRule[],shcRules:IRule[],udsRules:IRule[], missions: []) => {
  const allRules = [...users, ...shcRules, ...udsRules];
  const uniqueRulesMap: { [key: string]: IRule } = {};

  allRules.forEach(rule => {
    uniqueRulesMap[rule.rule_id] = rule;
  });

  const uniqueRules = Object.values(uniqueRulesMap);

  const missionIds = missions.map((m:any) => m.id);
  const filteredRules = uniqueRules.filter(rule => missionIds.includes(rule.mission_id) && rule.status == "active");

  return filteredRules;
}
export const capitalizeRowsLetter = () => {
  const paginationTexts = document.querySelectorAll('.pagination__rows-per-page');
  paginationTexts.forEach(element => {
    const textNode = element.childNodes[0];
    if (textNode && textNode.nodeValue) {
      textNode.nodeValue = textNode.nodeValue.replace('rows', 'Rows');
    }
  });
}
export const handleLabelMultiselectFilter = (option: string, isButton: boolean = false) => {
  let label: string = ''
  switch (option) {
      case 'group_uds':
      case 'udsGroup':
          label = isButton ? `Group uds: ` : `<span class='filter-title'>Group uds: </span>`
          break;
      case 'group_shc':
      case 'shcGroup':
          label = isButton ? `Group shc: ` : `<span class='filter-title'>Group shc: </span>`
          break;
      case 'user':
          label = isButton ? `User: ` : `<span class='filter-title'>User: </span>`
          break;
  }
  return label
}