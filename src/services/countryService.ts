
import getApiDocker from '@/api/apiDocker';
import { responseError } from '@/helpers/responseError';

export default {
    async getCountryData () {
        try {
            const apiDocker = await getApiDocker();
            const response = await apiDocker.get(`country`)
            return  response.data 
        } catch (error:any) {
            responseError(error)
        }    
    }
}