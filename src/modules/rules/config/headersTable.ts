import type { Header } from "vue3-easy-data-table";

export const headersRules: Header[] = [
    { text: "ID", value: "rule_id",sortable: true,width: 110},
    { text: "Rule name", value: "rule_name",sortable: true,width: 150},
    { text: "Creation date", value: "creation_date",sortable: true,width: 230},
    { text: "Mission & sensor", value: "mission_id",sortable: false, width: 200},
    
    { text: "Acquisition mode", value: "acquisition_mode_id",sortable: false, width: 200},
    { text: "Rule type", value: "rule_type" ,sortable: true,width: 150 },
    { text: "Validity time", value: "validity_time", sortable: true ,width: 250},
    { text: "Sensing time", value: "sensing_time", sortable: true,width: 250},
    { text: "Status", value: "status", sortable: true,width: 120},
    { text: "Comments", value: "comments", sortable: true,width: 150 },
  ];

 

export const headersUserFormRules: Header[] = [
    // { text: "User ID", value: "user_id",sortable: true},
    // { text: "UDS group", value: "group_uds.group_name", sortable: true},
    // { text: "SHC group", value: "group_shcs", sortable: true},
    { text: "User ID", value: "user_id",sortable: true , width: 225 },
    { text: "Status", value: "status",sortable: true , width: 140},
    { text: "Subscription date", value: "creation_date",sortable: true ,width: 220},
    { text: "Country", value: "country" ,sortable: true,width: 140},
    { text: "UDS group", value: "group_uds.group_name", sortable: false,width: 150},
    { text: "SHC group", value: "group_shcs", sortable: false,width: 150 },
    { text: "Mission ID", value: "missions", sortable: false ,width: 150},
    { text: "License expiration date", value: "license_expiration_date", sortable: true,width: 240 },
    { text: "Applicable rules", value: "user_rules", sortable: false,width: 280 },
  ];

  export const headersConflict: Header[] = [

    { text: "Conflict ID", value: "id",sortable: true , width: 110 },
    { text: "Rules", value: "rule_ids",sortable: true , width: 325},
    { text: "Manage conflict", value: "resolution",sortable: true ,width: 110}
  ];
  export const headersGeometry: Header[] = [

    { text: "ID", value: "id",sortable: true , width: 35},
    { text: "LAT", value: "lat",sortable: true ,width: 280 },
    { text: "LON", value: "lon",sortable: true , width: 280 },
    { text: "", value: "actions",sortable: false,width: 100 }
  ];
  export const headersGeometryCircle: Header[] = [

    { text: "ID", value: "id",sortable: true, width: 35},
    { text: "CENTER LAT", value: "center_lat",sortable: true ,width: 280  },
    { text: "CENTER LON", value: "center_lon",sortable: true  ,width: 280 },
    { text: "RADIUS", value: "radius",sortable: true , width: 140 },
    { text: "", value: "actions",sortable: false,width: 100 }
  ];
  