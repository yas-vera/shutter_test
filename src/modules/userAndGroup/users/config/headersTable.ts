import type { Header } from "vue3-easy-data-table";

export const headersUser: Header[] = [
    { text: "User ID", value: "user_id",sortable: true ,   width: 215 },
    { text: "Status", value: "status",sortable: true ,   width: 125},
    { text: "Subscription date", value: "creation_date",sortable: true ,  width: 200},
    { text: "Country", value: "country" ,sortable: true,  width: 135},
    { text: "UDS group", value: "group_uds.group_name", sortable: false,  width: 160},
    { text: "SHC group", value: "group_shcs", sortable: false,  width: 160 },
    { text: "Mission ID", value: "missions", sortable: false ,  width: 155},
    { text: "License expiration date", value: "license_expiration_date", sortable: true,  width: 245 },
    { text: "Applicable rules", value: "user_rules", sortable: false,  width: 280 },
  ];