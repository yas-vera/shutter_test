import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TAB_RULES } from '@/constants/constants'
import router from '@/router'

export const useNavBarStore = defineStore('navBarStore', () => {
 const menuSelected = ref<string>(TAB_RULES)
 const menuChange = (option:string) =>{
  if(option === TAB_RULES){
    router.push('/operator/rules')
  }
    menuSelected.value = option
  }
const verifyMenu = (value:string) =>{
  return menuSelected.value === value
}
  return { 
    menuSelected,
    menuChange,
    verifyMenu
}
})
