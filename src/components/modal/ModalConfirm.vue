<template>
    <div class="popup-alert" v-if="props.isModalOpen">
      <div class="popup-alert-inner modal-border-shadow" style="border-color: 1.5px solid #20B65F !important;">
        <div class="popup-header" >
          <div style="display: flex;">
              <qtm-icon icon="info" size="large" variant="outlined" classes="text-bluegrey-100 "  style="margin-top: 5px; margin-right: 7px;" />
              <qtm-typography  classes="text-bluegrey-100 text-scale-5 font-medium ">{{ props.title }}</qtm-typography>
          </div>
            <div @click="emits('openOption',false)" style="cursor: pointer;">
              <qtm-icon icon="close" size="large" variant="filled" classes="text-bluegrey-400" />
            </div>
          </div>
          <div class="popup-body">
            <qtm-typography> {{ props.message }}</qtm-typography>
          </div>
            <QtmDivider class="dividerCustom" />
          <div class="popup-footer">
            <qtm-button @clickEvent="emits('clickEvent',false)" color="primary" variant="outline" size="medium" >Cancel</qtm-button>
            <qtm-button @clickEvent="emits('clickEvent',true)" color="primary" size="medium" >{{ props.textConfirm }}</qtm-button>
      </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { QtmTypography,QtmButton,QtmIcon,QtmDivider } from "@qtm/vue";
  const props = defineProps<{
  isModalOpen: boolean
  title:string
  icon?:string
  message:string
  textConfirm:string
}>();
const emits = defineEmits<{
    (e: 'openOption', option: boolean): void
    (e: 'clickEvent', option: boolean): void
}>();
//Save custom layers
  </script>
  <style scoped>
  .popup-alert {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
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
    padding: 15px;
  }
  
  .popup-body {
  
    flex-grow: 1;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 30px;
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
    gap:10px;
    justify-content: end;
    align-items: end;
    width: 100%;
    padding: 15px 25px 15px 25px; 
    
  }
  .popup-alert-inner{
    background-color: #000000; 
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 480px;   
  }
  .dividerCustom{
    padding: auto;
  }
  </style>