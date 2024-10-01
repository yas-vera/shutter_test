import systemService from '../services/systemService';
import { defineStore } from 'pinia';
export interface LogItem {
  id: number;
  log_id: string; 
}
export interface Status {
    status: string,
    timestamp: Date
}
export const useSystemStore = defineStore('systemStore', {
  state: () => ({
    logs: [],
    status:{} as Status,
    formattedLogsData:[] as LogItem [],
    logById:[]
  }),
  actions: {
   async getPeticion () {
        const response = await systemService.getLogs()
       this.logs = response
        return  response 
    },
   async getStatusPetition () {
        const response = await systemService.getStatus()
        this.status = response
        return  response 
    },
    async getPeticionById (id:string) {
      const response = await systemService.getLogsById(id)
     this.logById = response
      return  response 
  },
    async formattedLogs () {
      if (this.logs.length > 0) {
        const formatted = this.logs.map((fileName, index) => ({
          id: index,
          log_id: fileName,
        }));
        this.formattedLogsData = formatted;
      }
     
    },
    async downlandLogById (id:string) {
      const response = await systemService.getDonwloadLogById(id)
      return response
    }
   }
  
});
