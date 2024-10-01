
import { formatDate } from '@/helpers/convertDateTime';
import getApiDocker from '@/api/apiDocker';
import { responseError } from '@/helpers/responseError';

export default {
  async getLayers (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const config = {
        params: paramsValue,
      };
      const response = await apiDocker.get(`custom_layer/`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async getByIdLayer (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const config = {
        params: paramsValue,
      };
      const response = await apiDocker.get(`custom_layer/`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
   
  },
  async postLayer (body:any) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`custom_layer`,body)
      return  response.data 
    } catch (error:any) {
      const errorObject = { message: error.response.data.detail, status: error.response.status };
      throw { error: errorObject };     
    }
  },
  async deleteLayer (id:number) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.delete(`custom_layer/${id}`)
      return  response.data 
    } catch (error:any) {
      const errorObject = { message: error.response.data.detail, status: error.response.status };
      throw { error: errorObject };        
    }
   
  }
}
