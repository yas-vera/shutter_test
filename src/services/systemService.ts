import type { Status } from "@/types/Settings";
import getApiDocker from "../api/apiDocker";
import { responseError } from "../helpers/responseError";

export default {
    async getUdsSync () {
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.get(`system/uds/sync`)
        return  response.data 
      } catch (error:any) {
        if(error.response.status === 500){
          return error.response
        }else{
          responseError(error)
        }
      }
     
      },
    async postUdsSync () {
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.post(`system/uds/sync`)
        return  response.data 
      } catch (error:any) {
        responseError(error)
      }
      
    },
    async postBackup () {
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.post(`system/backup`)
        return  response.data 
      } catch (error:any) {
        responseError(error)
      }
      
      },
    async getLogs (){
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.get(`system/logs`)
        return response.data
      } catch (error:any) {
        responseError(error)
      }
        
    },
    async getStatus (){
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.get(`system/status`)
        return response.data
      } catch (error:any) {
        responseError(error)
      }
    },
    async postStatus (status: Status){
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.post(`system/status?system_status=${status.toLowerCase()}`)
        return response.data
      } catch (error:any) {
        responseError(error)
      }
    },
    async getLogsById (id:string){
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.get(`system/logs/preview/${id}`)
        return response.data
      } catch (error:any) {
        responseError(error)
      }  
    },
    async getDonwloadLogById (id:string){
      try {
        const apiDocker = await getApiDocker();
        const response = await apiDocker.get(`system/logs/download/${id}`)
        return response.data
      } catch (error:any) {
        responseError(error)
      }  
    }
}
