<script setup lang="ts">

import {reactive,ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { QtmTypography,QtmDivider,QtmTextInput,QtmButton } from "@qtm/vue";
import { useAuthStore } from '@/stores/authStore';
import type { ICredential } from '@/interfaces/IUser';
import QtmModalDialog from '@/components/modal/QtmModalDialog.vue';
import { usePopupAlertStore } from '@/stores/popupAlertStore';
import { VAR_MAINTAINER, VAR_OPERATOR } from '@/constants/constants';
import systemService from '@/services/systemService';
import { useLoadStore } from '@/stores/loadStore';
import { loadConfig, config } from '../../configService';
const popupStore = usePopupAlertStore()
const store = useAuthStore()
const router = useRouter()
const formData = reactive<ICredential>({
  username: '',
  password: ''
})
const appVersion = ref<string>('')
const loadStore = useLoadStore();
const submitForm = () => {
    if(formData.username ==='' || formData.password ==='') return
    store.login(formData)
    
    .then(async () => {
      if (store.hasRole(VAR_OPERATOR)) {
        
        await systemService.postUdsSync()
        router.replace({ path: '/operator' });
      } else if (store.hasRole(VAR_MAINTAINER)) {
        router.replace({ path: '/maintainer' });
      } else {
        router.replace({ path: '/' });
      }
    })
    .catch((error) => {
      if(error.response.status === 401){
        popupStore.showPopupAlert('Access denied',error.response.data.detail)
        return
      }
      //popupStore.showPopupAlert('Access denied','The system is under maintenance. Sorry for the incovenience, try to login later.')
      router.replace({ path: '/login' });
    });
} 
onMounted(async() => {
  //store.logout()
  await loadConfig()
  appVersion.value = config!.appVersion
})
</script>

<template>
    <div class="containerLogin">
      <div class="leftPanel">
        <img src="../../assets/img/platino_2.jpeg" alt="platino" class="loginImage">
       
      </div>
      
      <div class="rightPanel">

        <div class="loginStyle">
          <qtm-typography component="subtitle-1" :fontSize=1 >Welcome to</qtm-typography>
          <qtm-typography component="title-1">PLATiNO Shutter Control</qtm-typography>
          <div class="subtitleLogin">
            <qtm-typography component="subtitle-1">Login to your operator or maintainer account</qtm-typography>
          </div>
          <form @submit.prevent="submitForm" class="formLogin">
            <qtm-typography component="body-1">Username</qtm-typography>
            <qtm-text-input
              size="medium"
              input-id="username"
              placeholder="Placeholder"
              @value-changed="(event: any) => formData.username = event.detail"
              :value="formData.username"></qtm-text-input>
            <qtm-typography
              classes="mt-xl"
              component="body-1">Password</qtm-typography>
            <qtm-text-input
              size="medium"
              type="password"
              input-id="password"
              placeholder="Placeholder"
              @value-changed="(event: any) => formData.password = event.detail"
              :value="formData.password"></qtm-text-input>
              <qtm-button
                color="primary"
                class="button-login"
                :props="{
                  id:'buttonLogin'
                }">
                <span class="flex gap-2">
                  <span>Login</span>
                  <svg v-if="loadStore.isLoading" class="qtm-progress-circle qtm-white">
                    <circle class="qtm-progress"></circle>
                  </svg>
                </span>
              </qtm-button>
          </form>
          <div class="footer-login">
            <qtm-typography component="body-2">Thales Alenia Space  |  Platino Shutter Control ©️ all rights reserved  |  v{{ appVersion }}  </qtm-typography>
      </div>
        </div>
       
      </div>
    </div>
<teleport to=".containerLogin">
  <div class="positionedDiv">
          <img src="../../assets/img/logo_asi.png" alt="platino" class="loginImage-logo">
          <div class="verticalLine"></div>
          <img src="../../assets/img/thales_alenia_space.png" alt="platino" class="loginImage-logo2">
        </div>
  </teleport>
  </template>
  
  <style scoped>
  .containerLogin {
    display: flex;
    height: 100vh; 
  }
  .positionedDiv {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    left: 56px;
  }
  .footer-login{
    bottom: 20px;
    position: absolute;
  }
  .verticalLine {
    border-right: 1px solid white; 
    height: 89px; 
    margin: 0 0 0 0;
    position: absolute;
    left: 130px;
  }
  .loginImage-logo{
    width: 107px;
    height: 107px;
  }
  .loginImage-logo2{
    width: 308px;
    height: 174px;
  }
  .leftPanel {
    display: flex;
    flex: 1;
  }
  
  .rightPanel {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-left: 25px;
  }
  .loginImage {
    max-inline-size: 100%;
    block-size: auto;
    aspect-ratio: 2/1;
    object-fit: cover;
    object-position: top center;
}
.loginStyle {
  color: white;
  text-align: left;
}
.loginStyle form {
  display: flex;
  flex-direction: column;
}
.loginStyle input {
  background-color: black;
  color: #ddd; 
  border: 1px solid #999;
  padding: 8px;
  margin-bottom: 10px;
  margin-bottom: 20px;

}
.loginStyle button {
  background-color: #4b5dff; 
  color: white; 
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 5px;
}
.formLogin{
  margin-top: 35px;
  margin-right: 35px;
}
.subtitleLogin{
  margin-top: 50px;
}
.buttonCenter {

  justify-content: center;
  align-items: center;
}
@media screen and (max-width: 768px) {
  .containerLogin {
    flex-direction: column;
    align-items: center;
  }
  .loginStyle {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.positionedDiv{
  top:0;
  bottom: unset;
}
.footer-login{
    bottom: 0;
    margin-top: 10px;
    position: relative;
  }
.verticalLine {
    height: 44.5px; 
    left: 65px;
  }
  .loginImage-logo{
    width: 53.5px;
    height: 53.5px;
  }
  .loginImage-logo2{
    width: 154px;
    height: 87px;
  }
  .leftPanel {
    order: 1;
  }

  .rightPanel {
    order: 2;
    display: block;
    margin-left: 0px;
  }
  .loginImage {
    max-inline-size: 100%;
    block-size: auto;
    aspect-ratio: 2/1;
    object-fit: cover;
    object-position: top center;
}
  .rightPanel {
    width: 100%;
    height:auto;
  }
  .formLogin{
  margin-top: 10px;
  margin-right: 1px;
}
.subtitleLogin{
  margin-top: 10px;
}

}

  </style>
  