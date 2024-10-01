
import getApiDocker from '@/api/apiDocker';
import { responseError } from '@/helpers/responseError';

export default {
    async getSatData (paramsValue?:any) {
        try {
            const apiDocker = await getApiDocker();
            const config = paramsValue;
            const response = await apiDocker.get(`satdata/${config}`)
            return  response.data 
        } catch (error:any) {
            responseError(error)
            return true
        }    
    }
}