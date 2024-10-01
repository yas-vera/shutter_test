import axios from 'axios';
import api from '../api/api'
import { usersFake } from '../dataFake/data';
import type { ICredential } from '../interfaces/IUser';
import getApiDocker from '@/api/apiDocker';
import { formatDate } from '@/helpers/convertDateTime';
import { responseError } from '@/helpers/responseError';

export default {
  async getAsync (paramsValue?:any) {
    try {
      const apiDocker = await getApiDocker();
      const config = {
        params: paramsValue,
      };
      const response = await apiDocker.get(`aoi`,config)
      return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  }
}
