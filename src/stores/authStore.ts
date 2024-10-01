import { defineStore } from 'pinia'
import authService from '../services/authService'
import { parseJwtUser } from '../helpers/JwtHelper'
import api from '../api/api'
import type { ICredential, IUser } from '../interfaces/IUser'
import { useRouter } from 'vue-router'
import router from '@/router'
import { usePopupAlertStore } from './popupAlertStore'
import { jwtDecode } from "jwt-decode";
import getApiDocker from '@/api/apiDocker'
import {helperClearStoreLogout, helperClearStores} from '@/helpers/logoutHelper'
import { onMounted } from 'vue'
interface IAuthState {
  user: null | IUser
  role: string | null
  token: null | string
  errors: string | null
}
interface IResultToken{
  acr: string,
  'allowed-origins':[]
  aud: string,
  azp: string,
  email: string,
  email_verified: boolean,
  exp: number,
  family_name: string,
  given_name: string,
  iat: number,
  iss: string,
  jti: string,
  name: string,
  preferred_username: string,
  realm_access: {
    roles: string[]
  },
  resource_access:any
  scope: string,
  session_state: string,
  sub: string,
  typ: string

}
async function setJwt(token: string | null) {
  if (token) {
    const apiDocker = await getApiDocker();
    apiDocker.defaults.headers.Authorization = `Bearer ${token}`
    localStorage.setItem('sessionActive', 'true'); 
  }
}

window.addEventListener("load", (event) => {
  if (performance.navigation.type != 1) {
    setTimeout(() => {
      const authStore = useAuthStore();
      authStore.logout();
    }, 100);
  }
  return false;
})


export const useAuthStore = defineStore({
  id: 'authStore',
  state: (): IAuthState => ({
    user: null,
    role: null,
    token: null,
    errors: null
  }),
  getters: {
   
    isAuthenticated: (state) => !!state.token,
    
    hasRole(state) {
      
      return (role:string) => {
        return role && state.role
          ? Array.isArray(state.role)
            ? state.role.includes(role)
            : state.role === role
          : false;
      };
    }
  },
  actions: {
    async login(credentials: ICredential) {
      const popupStore = usePopupAlertStore()
       const response :any = await authService.login(credentials)
       if (response === undefined) return null
       if(response.status === 200){
        const valuesToken :IResultToken = jwtDecode(response.data.access_token);
        this.token = response.data.access_token
        //this.token = response.response.token
        this.role = valuesToken.realm_access.roles[3]
        const userByToken ={
          email: valuesToken.email,
          exp: valuesToken.exp,
          expired: valuesToken.exp,
          ispersistent: valuesToken.exp,
          iat: valuesToken.iat,
          iss: valuesToken.iss,
          nameid: valuesToken.sub,
          unique_name: valuesToken.preferred_username,
          lastName: valuesToken.family_name,
          name: valuesToken.name,
          preferred_username: valuesToken.preferred_username
        }
        this.user = userByToken
      }
      setJwt(this.token)
    },

    async logout() {
      localStorage.clear()
      helperClearStoreLogout()
       this.user = null
       this.token = null
       this.role = null
       const response :any = await authService.logout()
       if (response === undefined) return null
       if(response.status === 200){
        
        response.data
      }
       router.push('/login')
    }
  },
  persist: {
    afterRestore: (ctx) => {
      setJwt(ctx.store.$state.token)
      
    }
  }
})
