export const convertToWKT = (coords: any) => {
    const filteredCoords = coords.map((coord: any) => [coord[0], coord[1]]);
    const wktString = `POLYGON((${filteredCoords
      .map((coord: any) => coord.join(" "))
      .join(",")}))`;
    return wktString;
};
export const ensurePolygonClosed = (wkt:string) => {
  if (!wkt.startsWith("POLYGON((") || !wkt.endsWith("))")) {
    // if (wkt.startsWith("MULTIPOLYGON")) {
    //  return wkt = wkt.replace("MULTIPOLYGON", "POLYGON");
    // }
   return wkt
  }
  const coordinatesPart = wkt.slice(9, -2);
  const coordinates = coordinatesPart.split(",").map(coord => coord.trim());
  const firstCoord = coordinates[0];
  const lastCoord = coordinates[coordinates.length - 1];

  if (firstCoord !== lastCoord) {
    coordinates.push(firstCoord);
  }

  const newCoordinatesPart = coordinates.join(", ");
  const newWkt = `POLYGON((${newCoordinatesPart}))`;

  return newWkt;
};