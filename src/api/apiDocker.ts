import axios, { type AxiosInstance } from 'axios';
import { environmentDocker } from '../environments/environment';
import { useLoadStore } from '@/stores/loadStore';
import { usePopupAlertStore } from '@/stores/popupAlertStore';
import { useAuthStore } from '@/stores/authStore';

let apiDocker: AxiosInstance | null = null;
export default async function getApiDocker(){
  if(!apiDocker){
    const response = await axios.get('/config.json');
    const config = response.data;

    apiDocker = axios.create({
      baseURL: config.apiUrl
    });
    apiDocker.interceptors.request.use(config => {
      const response = localStorage.getItem('authStore')
      if(response){
        const authStore = JSON.parse(response);
        if (authStore && authStore.token) {
          config.headers.Authorization = `Bearer ${authStore.token}`;
        }
      }
      
      return config;
    });
    let activeRequests = 0;
    let activeLoad = 0
    let sessionExpiredAlertShown = false;
    let maintainanceAlertShown = false;
    apiDocker.interceptors.request.use(
      (config) => {
        const loadStore = useLoadStore();
        loadStore.setLoading(true);
        
        if (config.headers['Content-Type'] === undefined) {
          config.headers['Content-Type'] = 'application/json';
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    apiDocker.interceptors.response.use(
      (response) => {
        const loadStore = useLoadStore();  
        loadStore.setLoading(false);
        
        return response
      },
      (error) => {
        const loadStore = useLoadStore();
        const popupAlertStore = usePopupAlertStore();
        const authStore = useAuthStore()
        loadStore.setLoading(false);
        
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 440:
              if (!sessionExpiredAlertShown) {
                popupAlertStore.showPopupAlert(error.response.data.detail, 'Your session has expired. Please log in again to continue.', 'Confirm',false).then(async () => {
                  authStore.logout()
              });
                sessionExpiredAlertShown = true;
              }
              break;
            case 503:  
            if (!maintainanceAlertShown) {

              popupAlertStore.showPopupAlert(error.response.data.detail, 'Attention: The system is currently undergoing maintenance. Please try again later.', 'Confirm',false).then(async () => {
            });
                maintainanceAlertShown = true;
            }
              break;
            // Add more cases as needed
            default:
              // Handle other errors
              break;
          }
        }
        return Promise.reject(error)
      }
    )
  }


  return apiDocker
}

