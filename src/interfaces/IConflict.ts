export interface IConflict {
    geometry:   Geometry;
    id:         number;
    resolution: string;
    rule_ids:   number[];
    status:     string;
   }
   
   export interface Geometry {
    area_wkt:      string;
    center:        string | null;
    geometry_type: string;
    radius_km:     string | null;
   }
   