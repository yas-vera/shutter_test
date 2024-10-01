import "./assets/main.css";
import piniaPersistedState from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { ComponentLibrary } from "@qtm/vue";
import "@qtm/web-components/dist/web-components/web-components.css";
import "@qtm/css/dist/utilities.css";
import "material-icons/iconfont/material-icons.css";
import "@qtm/css";

import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

import "@fontsource/roboto/100-italic.css";
import "@fontsource/roboto/300-italic.css";
import "@fontsource/roboto/400-italic.css";
import "@fontsource/roboto/500-italic.css";
import "@fontsource/roboto/700-italic.css";
import "@fontsource/roboto/900-italic.css";
import "@qtm/tokens/dist/tokens-dark.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import router from "./router";

import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { useScreenStore } from "./stores/screenStore";
import { loadConfig , config} from './configService';
import 'primevue/resources/themes/lara-dark-teal/theme.css'
import PrimeVue from 'primevue/config';
//"mapserverUrl": "http://localhost:7091/data/v3/{z}/{x}/{y}.pbf"

const pinia = createPinia();
pinia.use(piniaPersistedState);

(async () => {
  await loadConfig();
  if (config) {

    const app = createApp(App);
    app.config.globalProperties.$config = config;
    app.use(pinia);
    app.component('VueDatePicker', VueDatePicker);
    app.component('EasyDataTable', Vue3EasyDataTable);
    app.use(ComponentLibrary);
    app.use(router);
    app.use(PrimeVue);
    const screenStore = useScreenStore();
    
    
    
    window.addEventListener("resize", () => {
      screenStore.updateScreenWidth();
      screenStore.updateScreenHeight();
    });
    screenStore.updateScreenWidth();
    screenStore.updateScreenHeight();
    app.mount('#app');

  } else {
    console.error('Failed to initialize the app due to missing configuration.');
  }
})();
