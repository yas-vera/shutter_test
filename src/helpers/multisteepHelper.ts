export const isEmptyExcludingDates = (obj: any): boolean => {
    if (!obj || Object.keys(obj).length === 0) {
        return true;
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
            const dateValue = new Date(obj[key]);
            if (obj[key].trim() !== '' && isNaN(dateValue.getTime())) {
                return false; 
            }
        }else if (Array.isArray(obj[key])) {
            if (obj[key].length > 0) {
                return false;
            }
        }
    }
    return true; 
}
