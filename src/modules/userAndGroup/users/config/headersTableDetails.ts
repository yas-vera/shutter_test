import type { Header } from "vue3-easy-data-table";
export const headersDetail: Header[] = [
    { text: "SR ID", value: "sr_id", width: 134, sortable: true },
    { text: "User ID", value: "user_id", width: 134 , sortable: true},
    { text: "Source Type", value: "source", width: 177, sortable: true  },
    { text: "AoI ID", value: "aois", width: 134, sortable: false },
    { text: "Mission & sensor", value: "aois_mission_sensor", sortable: true , width: 200 },
    { text: "Acquisition mode", value: "aois_acquisition_mode", sortable: true, width: 200 },
    { text: "Rules", value: "aois_rules",  sortable: false, width: 364 },
    { text: "Sensing time", value: "aois_sensing_time", sortable: true ,width: 221 },
    { text: "Event date", value: "enforcement_time", sortable: true, width: 221 },
];