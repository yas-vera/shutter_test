
import getApiDocker from '@/api/apiDocker';
import { responseError } from '@/helpers/responseError';

export default {
    async getConflictByRuleOrUser (paramsValue?:any) {
        try {
            const apiDocker = await getApiDocker();
            const queryParams = new URLSearchParams();
            for (let key in paramsValue) {
                if (Array.isArray(paramsValue[key])) {
                  paramsValue[key].forEach((item:any) => {
                    queryParams.append(key, item);
                  }); 
                } else {
                  queryParams.append(key, paramsValue[key]);
                }
              }  
              const config = {
                params: queryParams,
              };
            const response = await apiDocker.get(`sr/`,config)
            return  response.data 
        } catch (error:any) {
            responseError(error)
        }    
    }
}