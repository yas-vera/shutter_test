
import type { InternalAxiosRequestConfig } from 'axios';
import api from '../api/api'
import { usersFake } from '../dataFake/data';
import type { ICredential } from '../interfaces/IUser';
import { formatDate } from '@/helpers/convertDateTime';
import getApiDocker from '@/api/apiDocker';
import { usePopupAlertStore } from '@/stores/popupAlertStore';
import { useAuthStore } from '@/stores/authStore';
import { defaultObjectError, responseError } from '@/helpers/responseError';

export default {
  async get (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const formatedParamsValueDates = formatDate(paramsValue)
      const queryParams = new URLSearchParams();
      for (let key in formatedParamsValueDates) {
        if (Array.isArray(formatedParamsValueDates[key])) {
          formatedParamsValueDates[key].forEach((item:any) => {
            queryParams.append(key, item);
          });
        } else {
          queryParams.append(key, formatedParamsValueDates[key]);
        }
      }
      const config = {
        params: queryParams,
      };  
      const response = await apiDocker.get(`rule/`,config)      
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async getById (id:number) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.get(`rule/${id}`)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
   
  },
  async getByIdRule (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const formatedParamsValueDates = formatDate(paramsValue)
      const config = {
        params: formatedParamsValueDates,
      };
      const response = await apiDocker.get(`rule/`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
   
  },
  async getRuleNameAll () {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.get(`rule/name`)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
  },
  async post (body:any) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`rule`,body)
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
  async put (body:any, id:number) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.put(`rule/${id}`,body)
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
  async postClone (rule_id:string) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`rule/${rule_id}/clone`)
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
  async postSuspend (rule_id:string) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`rule/${rule_id}/suspend`)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async postActive (rule_id:string) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`rule/${rule_id}/activate`)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async postImport(file: File, fileFormat = 'json') {
    const apiDocker = await getApiDocker();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiDocker.post(`rule/import?file_format=${fileFormat}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      responseError(error)
      console.error('Error POST:', error);
      throw error;
    }
  },
  async postImportShp(file: File) {
    const apiDocker = await getApiDocker();
    const formData = new FormData();
    
    const allowedExtensions = [".rar", ".zip"];
    
    const filenameParts = file.name.split('.');
    const fileExtension = '.' + filenameParts[filenameParts.length - 1];
    const isAllowedExtension = allowedExtensions.includes(fileExtension);
    
    if (!isAllowedExtension) {
      throw new Error('The file must have the ".rar" or ".zip" extension.');
    }
    
    formData.append('shapefile', file, 'shapefile' + fileExtension);  
    try {
      const response = await apiDocker.post(`rule/load_shp`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      responseError(error);
      console.error('Error POST:', error);
      throw error;
    }
  },  
  async delete (id:number) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.delete(`rule/${id}`)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
   
  },
  async getExport (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const formatedParamsValueDates = formatDate(paramsValue)
      const queryParams = new URLSearchParams();

      for (let key in formatedParamsValueDates) {
        if (Array.isArray(formatedParamsValueDates[key])) {
          formatedParamsValueDates[key].forEach((item:any) => {
            queryParams.append(key, item);
          });
        } else {
          queryParams.append(key, formatedParamsValueDates[key]);
        }
      }
      const config:any = {
        params: queryParams,
        responseType: 'blob'
      };
      const response = await apiDocker.get(`rule/export`,config)
      return  response 
    } catch (error:any) {
      responseError(error)
    }
   
  },
  async postLoadShp (data:FormData) {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.post(`rule/load_shp`,data)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  }
}
