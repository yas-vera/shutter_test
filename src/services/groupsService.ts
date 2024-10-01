import getApiDocker from '@/api/apiDocker';
import { formatDate } from '@/helpers/convertDateTime';
import { responseError } from '@/helpers/responseError';

export default {
  async deleteGroups (id:number) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.delete(`group/${id}`)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async getAllGroups (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const formatedParamsValueDates = formatDate(paramsValue)
      
      const config = {
        params:{...formatedParamsValueDates}
      };
      const response = await apiDocker.get(`group/`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async getAllGroupsToSelect (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const formatedParamsValueDates = formatDate(paramsValue)
      
      const config = {
        params:{...formatedParamsValueDates}
      };
      const response = await apiDocker.get(`group/name`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
  },
  async deleteUsers (idGroup:string,usersid:any) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`group/${idGroup}/removeUser`,usersid)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async updateGroups (idGroup:string,element:any) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.put(`group/${idGroup}`,element)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
  
  },
  async getExport (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const formatedParamsValueDates = formatDate(paramsValue)
      const config:any = {
        params: formatedParamsValueDates,
        responseType: 'blob'
      };
      const response = await apiDocker.get(`group/export`,config)
      return  response 
    } catch (error:any) {
      responseError(error)
    }
    
  },
}
