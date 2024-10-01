
import getApiDocker from '@/api/apiDocker';
import { formatDate } from '@/helpers/convertDateTime';
import { defaultObjectError, responseError } from '@/helpers/responseError';

export default {
  async getShcGroups (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const formatedParamsValueDates = formatDate(paramsValue)
      
      const config = {
        params:{type:'shc',sort_by:'group_id',format:'json',...formatedParamsValueDates}
      };
      const response = await apiDocker.get(`group/`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async postShcGroups (values:any) {
    try {
      const apiDocker = await getApiDocker();
      const config = {
        "group_type": "shc",
        "country": null,
        ...values
      };
      const response = await apiDocker.post(`group`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
      const errorObject = { 
        message: error?.response?.data?.detail || defaultObjectError.message , 
        status: error?.response?.status || defaultObjectError.status
      };
      throw { error: errorObject };    
    }
   
  },
  async putShcGroups (values:any) {
    try {
      const apiDocker = await getApiDocker();
      const config = {
        "group_type": "shc",
        "country": null,
        ...values
      };
      const response = await apiDocker.put(`group/${values.group_id}`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
      const errorObject = { 
        message: error?.response?.data?.detail || defaultObjectError.message , 
        status: error?.response?.status || defaultObjectError.status
      };
      throw { error: errorObject };    
    }
   
  },
  async postUserShcGroups (idgroup:string,values:any) {
    
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`group/${idgroup}/addUser`,values)
      return  response 
    } catch (error:any) {
      responseError(error)
      return error.response
    }
  },
  async removeUserShcGroups (idgroup:string,values:any) {
    
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`group/${idgroup}/removeUser`,values)
      return  response 
    } catch (error:any) {
      responseError(error)
      return error.response
    }
  }
}
