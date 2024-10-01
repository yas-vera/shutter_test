import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePopupAlertStore = defineStore('popupAlertStore', () => {
   const isShowPopupAlert = ref(false);
    const message = ref<string>('')
    const title = ref<string>('')
    const textButton = ref<string>('')
    const alertConfirm = ref<boolean>(false)
    let resolveFunction: (() => void) | null = null;
    const showPopupAlert = (
      titleString: string,
      messageString: string,
      buttonLabel?: string,
      alertConf?:boolean
    ): Promise<void> => {
      title.value = titleString;
      message.value = messageString;
      textButton.value = buttonLabel ? buttonLabel : 'Close';
      isShowPopupAlert.value = true;
      alertConfirm.value = alertConf?alertConf:false
  
      return new Promise((resolve) => {
        resolveFunction = resolve;
      });
    };

  const resetLabels = () =>{
    message.value = ''
    title.value = ''
    textButton.value = ''
  }
  const closePopupAlert = () =>{
    isShowPopupAlert.value = false;
    resetLabels()
  }
  const confirmPopup = () => {
    closePopupAlert()
    if (resolveFunction) {
      resolveFunction(); 
    }
  }
  return { 
    isShowPopupAlert,
    showPopupAlert,
    message,
    closePopupAlert,
    title,
    textButton,
    confirmPopup,
    alertConfirm
  }
})
