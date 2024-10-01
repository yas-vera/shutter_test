export const exportToXmlAndShp = async (dataBlob: any,item:string,name:string) => {
    let fileName = `${name}_${getCurrentDateTimeFormatted()}`;
    if(item === 'xml'){
      fileName += '.xml'
    }
    if(item === 'shp'){
      fileName += '.zip'
    }
    const blob = new Blob([dataBlob.data], { type: dataBlob.headers['content-type'] })
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}
export const getCurrentDateTimeFormatted = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`; 
};