// export const  convertFormatDate = (date:string) => {
//     const dateFormat = new Date(date);
//     if (isNaN(dateFormat.getTime())) {
//       return 'Invalid Date';
//     }
    
//     return dateFormat.toLocaleDateString('es-ES');
//   }
export const convertFormatDate = (date: string) => {
  const dateFormat = new Date(date);
  if (isNaN(dateFormat.getTime())) {
      return 'Invalid Date';
  }

  const year = dateFormat.getFullYear();
  const month = ('0' + (dateFormat.getMonth() + 1)).slice(-2);
  const day = ('0' + dateFormat.getDate()).slice(-2);
  const hours = ('0' + dateFormat.getHours()).slice(-2);
  const minutes = ('0' + dateFormat.getMinutes()).slice(-2);
  const seconds = ('0' + dateFormat.getSeconds()).slice(-2);

  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}
export const convertFormatDateAndValidDate = (date: string) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

  if (!isoDateRegex.test(date)) {
    
    return date;
  }
  const dateFormat = new Date(date);
  if (isNaN(dateFormat.getTime())) {
      return date;
  }

  const year = dateFormat.getFullYear();
  const month = ('0' + (dateFormat.getMonth() + 1)).slice(-2);
  const day = ('0' + dateFormat.getDate()).slice(-2);
  const hours = ('0' + dateFormat.getHours()).slice(-2);
  const minutes = ('0' + dateFormat.getMinutes()).slice(-2);
  const seconds = ('0' + dateFormat.getSeconds()).slice(-2);

  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}
export const convertFormatDateOnly = (date: string) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

  if (!isoDateRegex.test(date)) {
    
    return date;
  }
  const dateFormat = new Date(date);
  if (isNaN(dateFormat.getTime())) {
      return date;
  }

  const year = dateFormat.getFullYear();
  const month = ('0' + (dateFormat.getMonth() + 1)).slice(-2);
  const day = ('0' + dateFormat.getDate()).slice(-2);

  return `${year}/${month}/${day}`;
}
export const convertFormatFilterDate = (dateString: string) => {
  const date = new Date(dateString);
  const padZero = (num:any, size = 2) => num.toString().padStart(size, '0');

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); 
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const milliseconds = padZero(date.getMilliseconds(), 3); 

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export const convertFormatFilterShcDate = (dateString: string) => {
  if(!dateString) return ''
  const date = new Date(dateString);
  const padZero = (num:any, size = 2) => num.toString().padStart(size, '0');

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); 
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const milliseconds = padZero(date.getMilliseconds(), 3); 

  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}

export const  convertFormatDateHour = (date:string) => {
    const dateFormat = new Date(date);
    if (isNaN(dateFormat.getTime())) {
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false, 
    };
    const formattedDate = dateFormat.toLocaleDateString('es-ES',options);
    return formattedDate.replace(',', ' -');
  }
export const convertFormatDateSliceZ = (date:Date) =>{

  const formattedStartDate = date.toISOString().slice(0, -1);

  return formattedStartDate
}

export const formatDate = (paramsValue :any) => {
  if (!paramsValue) {
    return paramsValue;
  }
  const formattedParams = { ...paramsValue };
  if(formattedParams.insertion_date_end){
    formattedParams.insertion_date_end = convertFormatDateSliceZ(formattedParams.insertion_date_end)
  }
  if(formattedParams.insertion_date_start){
    formattedParams.insertion_date_start = convertFormatDateSliceZ(formattedParams.insertion_date_start)
  }
  return formattedParams;
}


export const datePickerFormat = (valueDate:any ) :string =>{
  const day = valueDate.value.getDate().toString().padStart(2, '0');
  const month = (valueDate.value.getMonth() + 1).toString().padStart(2, '0');
  const year = valueDate.value.getFullYear();
  //return `${day}/${month}/${year}`;
  return `${year}/${month}/${day}`;
}

export const datePickerFormatHours = (valueDate: any): string => {
  const day = valueDate.value.getDate().toString().padStart(2, '0');
  const month = (valueDate.value.getMonth() + 1).toString().padStart(2, '0');
  const year = valueDate.value.getFullYear();
  const hours = valueDate.value.getHours().toString().padStart(2, '0');
  const minutes = valueDate.value.getMinutes().toString().padStart(2, '0');
  const seconds = valueDate.value.getSeconds().toString().padStart(2, '0');
  //return `${day}/${month}/${year} ${hours}:${minutes}`;
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export const getFormattedDateTime = (date: Date) => {
  const day = date.getDate();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  //return `${day}/${month}/${year} ${hours}:${minutes}`;
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export const parseFormattedDateTime = (dateTimeString:any) => {
  const dateTimeParts = dateTimeString.split(' ');
  if (dateTimeParts.length !== 2) return null;

  const dateParts = dateTimeParts[0].split('/');
  const timeParts = dateTimeParts[1].split(':');
  
  if (dateParts.length !== 3 || timeParts.length !== 2) return null;

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
  const year = parseInt(dateParts[2], 10);
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  const date = new Date(year, month, day, hours, minutes);

  // Comprueba si la fecha creada es válida
  if (isNaN(date.getTime())) return null;

  return date;
};

export const isValidDate = (dateString:any) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export const convertFormatDateSimple = (date: string) => {
  const dateFormat = new Date(date);
  if (isNaN(dateFormat.getTime())) {
      return 'Invalid Date';
  }
  const year = dateFormat.getFullYear();
  const month = ('0' + (dateFormat.getMonth() + 1)).slice(-2);
  const day = ('0' + dateFormat.getDate()).slice(-2);
  return `${year}/${month}/${day} `;
}
export const convertFormatDateSimpleFormatDDmmyy = (date: string) => {
  if(date === undefined) return ''
  const dateFormat = new Date(date);
  if (isNaN(dateFormat.getTime())) {
      return 'Invalid Date';
  }
  const year = dateFormat.getFullYear();
  const month = ('0' + (dateFormat.getMonth() + 1)).slice(-2);
  const day = ('0' + dateFormat.getDate()).slice(-2);
  return `${day}/${month}/${year} `;
}

export const convertFormatDateDDmmyyHHmm = (date: string) => {
  if (date === undefined || date === null) return '';

  const dateFormat = new Date(date);
  if (isNaN(dateFormat.getTime())) {
      return 'Invalid Date';
  }

  const year = dateFormat.getFullYear();
  const month = ('0' + (dateFormat.getMonth() + 1)).slice(-2);
  const day = ('0' + dateFormat.getDate()).slice(-2);
  const hours = ('0' + dateFormat.getHours()).slice(-2);
  const minutes = ('0' + dateFormat.getMinutes()).slice(-2);

  //return `${day}/${month}/${year} ${hours}:${minutes}`;
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};


export const convertTextTruncate = (value:number, text: string) => {
  if (text.length > value) {
    return text.slice(0, value) + ' ...';
  }
  return text;
}
