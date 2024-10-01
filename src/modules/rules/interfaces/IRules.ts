export enum AcquisitionMode {
    Spotlight = "spotlight",
    Spotligth = "spotligth",
    Stripmap = "stripmap",
}
export interface Geometry {
    area_wkt:      string;
    center:        null;
    geometry_type: GeometryType;
    radius_km:     null;
   }
   
export enum GeometryType {
    Polygon = "Polygon",
    Circle = 'Circle'
}
   
export enum RuleType {
    Permissive = "permissive",
    Prohibitive = "prohibitive",
    Tracking = "tracking",
}
export interface Mission {
    mission_id:   string | number;
    mission_name: string;
   }
export interface User {
    creation_date: Date;
    missions:      Mission[];
    stanag_id:     string;
    status:        string;
    update_date:   Date;
    user_id:       string;
    username:      null;
}
export interface Group {
    color_code:    null;
    creation_date: Date;
    description?:  string;
    group_id:      number;
    group_name:    string;
    group_type:    string;
    stanag_id:     string;
    update_date:   Date;
   }
export interface IRule {
    acquisition_mode:    AcquisitionMode;
    comments:            string;
    creation_date:       Date;
    geometry:            Geometry;
    groups:              Group[];
    mission:             Mission;
    mission_id:          string;
    rule_id:             number;
    rule_name:           string;
    rule_type:           RuleType;
    sensing_end_time:    Date;
    sensing_start_time:  Date;
    status:              string;
    update_date:         Date;
    users:               User[];
    validity_end_time:   Date;
    validity_start_time: Date;
   }