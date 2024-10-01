import axios from 'axios';
import api from '../api/api'
import { usersFake } from '../dataFake/data';
import type { ICredential } from '../interfaces/IUser';
import { formatDate } from '@/helpers/convertDateTime';
import getApiDocker from '@/api/apiDocker';
import { responseError } from '@/helpers/responseError';

export default {
  async getUser (paramsValue?:any) {
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

      const response = await apiDocker.get(`user/`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  },
  async getSelectUser () {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.get(`user/name`)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
  },
  async getExampleOperator () {
    try {
      const apiDocker = await getApiDocker();
      const response = await apiDocker.get(`operator`)
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
      const response = await apiDocker.get(`user/export`,config)
      return  response 
    } catch (error:any) {
      responseError(error)
    }
    
  }
}
