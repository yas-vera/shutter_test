
import getApiDocker from '@/api/apiDocker';
import { formatDate } from '@/helpers/convertDateTime';
import { responseError } from '@/helpers/responseError';

export default {
  async getUdsGroups (paramsValue?:any) {
    try {
        const apiDocker = await getApiDocker();
        const formatedParamsValueDates = formatDate(paramsValue)
        
        const config = {
          params:{type:'uds',sort_by:'group_id',format:'json',...formatedParamsValueDates}
        };
        const response = await apiDocker.get(`group/`,config)
        return  response.data 
    } catch (error:any) {
      responseError(error)
    }
    
  }
}
