import type { Header } from "vue3-easy-data-table";

export const headersActivityLogs: Header[] = [
  // { text: "ID", value: "id",sortable: false,width: 30},
  { text: "Log ID", value: "log_id",sortable: true,width: 325},
  ];
export const headersContentLogs: Header[] = [
    { text: "Severity", value: "level",sortable: true,width:150},
    { text: "Service", value: "where",sortable: true,width:200},
    { text: "Time stamp", value: "time",sortable: true,width:250},
    { text: "Message", value: "message",sortable: true},
  ];

 


  