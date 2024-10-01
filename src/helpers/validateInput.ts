let timeoutId:any = undefined;

export const validateInputDecimals = (input:any, decimals = 5, callback:any = null) => {
    let value = input.target.value.replace(/[^0-9.-]/g, '');

    let parts = value.split('.');
    if (parts.length > 2) {
      parts = [parts[0], parts[1]];
    }
  
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';
  
    if (integerPart.indexOf('-') > 0) {
      integerPart = integerPart.replace(/-/g, '');
    }
    
    if (integerPart !== '' && integerPart !== '-') {
      integerPart = integerPart.replace(/-/g, '');
      if (input.target.value[0] === '-') {
        integerPart = '-' + integerPart;
      }
    }
    
    decimalPart = decimalPart.substring(0, decimals);
    
    value = integerPart + (parts.length > 1 ? '.' + decimalPart : '')
    input.target.value = value;

    
    if(callback) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        callback();
      }, 200);
    }
}

export const limitDecimals = (value: any, decimals = 5) => {
  let valueFormatted = value.toString();
  let [integerPart, decimalPart = ""] = valueFormatted.split(".");
  decimalPart = decimalPart.padEnd(decimals, "0").substring(0, decimals);
  return `${integerPart}.${decimalPart}`;
}