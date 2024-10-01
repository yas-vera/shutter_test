import type { Header } from "vue3-easy-data-table";

export const headersUserStep: Header[] = [
    // { text: "User ID", value: "user_id",sortable: true  },
    // { text: "Status", value: "status",sortable: true },
    // { text: "Subscription date", value: "creation_date",sortable: true },
    // { text: "Country", value: "stanag_id" ,sortable: true},
    // { text: "UDS group", value: "group_uds.group_name", sortable: true},
    // { text: "SHC group", value: "group_shcs", sortable: true },
    // { text: "Mission ID", value: "missions", sortable: true },
    // { text: "License expiration date", value: "license_expiration_date", sortable: true },
    // { text: "Applicable rules", value: "user_rules", sortable: true },
    { text: "User ID", value: "user_id",sortable: true ,   width: 110 },
    { text: "Status", value: "status",sortable: true ,   width: 110},
    { text: "Subscription date", value: "creation_date",sortable: true ,  width: 180},
    { text: "Country", value: "country" ,sortable: true,  width: 110},
    { text: "UDS group", value: "group_uds.group_name", sortable: true,  width: 110},
    { text: "SHC group", value: "group_shcs", sortable: true,  width: 110 },
    { text: "Mission ID", value: "missions", sortable: true ,  width: 110},
    { text: "License expiration date", value: "license_expiration_date", sortable: true,  width: 180 },
    { text: "Applicable rules", value: "user_rules", sortable: true,  width: 180 },
  ];