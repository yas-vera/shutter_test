import getApiDocker from "@/api/apiDocker";
import { formatDate } from "@/helpers/convertDateTime";
import { responseError } from "@/helpers/responseError";
interface paramsValues {
    status : string
}
interface putParams{
  conflict_id:number,
  resolution:string
}
export default {
    async getConflict (paramsValue?:paramsValues) {
        try {
          const apiDocker = await getApiDocker();
          const formatedParamsValue = formatDate(paramsValue)
          const config = {
            params: formatedParamsValue,
          };
          const response = await apiDocker.get(`conflict/`,config)
          return  response.data 
        } catch (error:any) {
          responseError(error)
        }
        
      },
    async putConflict (values:putParams) {
        try {
          const apiDocker = await getApiDocker();
          const response = await apiDocker.put(`conflict/${values.conflict_id}?resolution=${values.resolution}`)
          return  response.data 
        } catch (error:any) {
          responseError(error)
        }
      }
}