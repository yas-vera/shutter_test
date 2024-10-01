export function formatearDMSWithDirection(value: string): string {
    value = value.replace(/[^0-9°'"\sNSEW]/g, '');

    value = value.replace(/°\s*/g, '° ');
    value = value.replace(/'\s*/g, '\' ');
    value = value.replace(/"\s*/g, '" ');

    value = value.replace(/\s*(\d+)\s*(?=\d)/g, '$1');

    let direction = '';
    const directionMatch = value.match(/[NSEW]/);
    if (directionMatch) {
        direction = directionMatch[0];
        value = value.replace(/[NSEW]/, '');
    }

    if (!value.includes('°')) {
        value = value.replace(/(\d+)/, '$1° ');
    }
    if (!value.includes("'")) {
        value = value.replace(/°\s?(\d+)/, '° $1\' ');
    }
    if (!value.includes('"')) {
        value = value.replace(/'\s?(\d+)/, '\' $1"');
    }

    let partes = value.split(/°|'|"/).map(part => part.trim());
    if (partes.length > 0 && !partes[0]) partes[0] = '0'; 
    if (partes.length > 1 && !partes[1]) partes[1] = '0'; 
    if (partes.length > 2 && !partes[2]) partes[2] = '0'; 

    return `${partes[0]}° ${partes[1]}' ${partes[2]}" ${direction}`;
}
export const sexagesimalToDecimalCircle = (sexagesimal: any) => {
    const regex = /(\d+)° (\d+)' (\d+)" ([NSEW])/;
    const match = sexagesimal.match(regex);
    if (!match) {
      console.error('Invalid sexagesimal format');
      return
    }
  
    const degrees = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const direction = match[4];
  
    let decimal = degrees + (minutes / 60) + (seconds / 3600);
  
    if (direction === 'S' || direction === 'W') {
      decimal = -decimal;
    }
  
    return decimal;
  };
export const radiusSexagesimalToDecimalCircle = (sexagesimal: any) => {
    const regex = /(\d+)° (\d+)' (\d+)"/;
    
    const match = sexagesimal.match(regex);
  
    if (!match) {
      throw new Error('Invalid sexagesimal format');
    }
  
    const degrees = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
  
    const decimal = degrees + (minutes / 60) + (seconds / 3600);
    return decimal * 111.32;
  };