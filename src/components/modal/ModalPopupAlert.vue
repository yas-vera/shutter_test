<template>
  <div class="popup-alert" v-if="popupStore.isShowPopupAlert">
    <div class="popup-alert-inner modal-border-shadow"
      :style="{ width: popupStore.alertConfirm ? '480px' : '400px',
                border: ['error', 'warning', 'access denied', 'err_network','err_bad_response'].includes(String(popupStore.title).toLowerCase()) ? '1.5px solid red' : ['success'].includes(String(popupStore.title).toLowerCase()) ?'1.5px solid #20B65F':'1.5px solid transparent'} ">
      <div class="popup-header" >
        <div style="display: flex; align-items: center; gap: 4px;">
            <qtm-icon icon="info" size="large" variant="outlined" classes="text-bluegrey-900" />
            <qtm-typography  classes="text-bluegrey-900 text-scale-4 font-medium ">{{ popupStore.title }}</qtm-typography>
        </div>
          <div @click="popupStore.closePopupAlert()" style="cursor: pointer;">
            <qtm-icon icon="close" size="xlarge" variant="filled" />
          </div>
        </div>
        <div class="popup-body" :style="{ marginLeft: popupStore.alertConfirm ? '100px' : '40px',marginRight:popupStore.alertConfirm ? '100px' : '40px'}">
          <qtm-typography style="white-space: pre-line;"> {{ popupStore.message }}</qtm-typography>
        </div>
        <qtm-divider v-if="popupStore.alertConfirm"></qtm-divider>
        <div class="popup-footer" :style="{ justifyContent: popupStore.alertConfirm ? 'end' : 'center',gap: popupStore.alertConfirm ? '10px' : '0px'}">
          <qtm-button 
            v-if="popupStore.alertConfirm"
            @clickEvent="popupStore.closePopupAlert()"
            color="primary"
            variant="outline"
            size="large"
          >
            Cancel
          </qtm-button>  
          <qtm-button 
            @clickEvent="onButtonClick()"
            color="primary"
            size="large"
          >
            {{ popupStore.textButton }}
          </qtm-button>    
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePopupAlertStore } from '@/stores/popupAlertStore';
import { QtmTypography,QtmButton,QtmIcon,QtmDivider } from "@qtm/vue";
const popupStore = usePopupAlertStore()
const onButtonClick = () => {
  popupStore.confirmPopup();
};
</script>
<style scoped>
.popup-alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 190;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.popup-body {

  flex-grow: 1;
  margin-top: 17px;
  margin-bottom: 17px;
  display: flex;
  justify-content: center;
  text-align: center;
  overflow-y: auto;
  max-height: 400px;
  scrollbar-color: gray white !important;
  scrollbar-width: thin;
}

.popup-footer {
  display: flex;
  width: 100%;
  margin-top: 10px;
  
}
.popup-alert-inner{
  border: 1.7px solid red; 
  background-color: #FFF; 
  padding: 25px 25px 7px 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>