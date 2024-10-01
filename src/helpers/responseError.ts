import { useAuthStore } from "@/stores/authStore";
import { usePopupAlertStore } from "@/stores/popupAlertStore";

export const responseError = (error:any) =>{
    const popupAlertStore = usePopupAlertStore();
      const authStore = useAuthStore()
    if (error.response) {
        const status = error.response.status;
        const msg = error.response.data.detail? error.response.data.detail : undefined
        switch (status) {
          case 440:
              popupAlertStore.showPopupAlert(error.response.data.detail, 'Your session has expired. Please log in again to continue.', 'Confirm',false).then(async () => {
                authStore.logout()
            });
            break;
          case 503:  
            popupAlertStore.showPopupAlert(error.response.data.detail, 'Attention: The system is currently undergoing maintenance. Please try again later.', 'Confirm',false).then(async () => {
              authStore.logout()
          });
            break;
          case 500:  
              if(error.message && error.code){
                const msgError = msg !== undefined ?msg : error.message
                popupAlertStore.showPopupAlert(error.code, msgError)
              }
            break;
          default:
            
            break;
        }
    }else{
      if(error.message && error.code){
        popupAlertStore.showPopupAlert(error.code, error.message)
      }
      
    }
} 

export const defaultObjectError =  {
  status: 400,
  message: 'Bad request. Please check the data submitted.'
}