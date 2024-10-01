  <template>
    <div v-if="props.showLogout" class="logout-container" @click="handleOutsideClick">
      <div class="circle">
        <qtm-typography class="initial">
          {{ store.user?.name && store.user?.name.slice(0,1).toLocaleUpperCase() }}
        </qtm-typography>
      </div>
      <div class="userContent">
            <div class="userText">
              <!-- <qtm-typography>
                {{ store.user?.name  }} {{ store.user?.lastName  }}
              </qtm-typography> -->
              <qtm-typography>
                {{ getFormattedUserName() }}
              </qtm-typography>
            </div>
      </div>
      <!-- <ButtonAndIcons 
        label="Theme"
        :icon-left="{size:'large',variant:'outlined',icon:'contrast'}"
        :icon-right="{size:'medium',variant:'filled',icon:'play_arrow'}"/>
      <ButtonAndIcons 
        label="Settings"
        :icon-left="{size:'large',variant:'outlined',icon:'tune'}"
        :icon-right="{size:'medium',variant:'filled',icon:''}"/>
      <ButtonAndIcons 
        label="Get desktop app"
        :icon-left="{size:'large',variant:'outlined',icon:'download'}"
        :icon-right="{size:'medium',variant:'filled',icon:''}"/> -->
      <qtm-divider classes="my-m" />
      <!-- <div class="buttomsLogout">
        <div class="circleOption">
            <qtm-typography class="initialOption" >
              {{ store.user?.name && store.user?.name.slice(0,1) }}
            </qtm-typography>
          </div>
        <div class="middleContent" style="white-space: nowrap;">
          <div>
            <qtm-typography>
              
              {{ (store.user?.name ) && store.user?.name.slice(0,28) + '...' }}
             
              </qtm-typography>
              
              <qtm-typography>
                {{ (store.user?.email && store.user?.email.length < 28) ? store.user?.email: store.user?.email.slice(0,28) + '...' }}
              </qtm-typography>
          </div>
          
        </div>
        <div class="buttomsRight">
          <qtm-icon size="medium" icon="done"/>
        </div>
      </div> -->
      <!-- <ButtonAndIcons 
        label="Add account"
        :icon-left="{size:'large',variant:'outlined',icon:'add'}"
        :icon-right="{size:'medium',variant:'filled',icon:''}"/>

      <qtm-divider classes="my-m" /> -->

      <ButtonAndIcons 
        @click="emits('clickEventLogout',false)"
        label="Log out"
        :icon-left="{size:'large',variant:'outlined',icon:'logout'}"
        :icon-right="{size:'medium',variant:'filled',icon:''}"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue';
  import {
   QtmDivider,
   QtmIcon,
   QtmTypography,
} from "@qtm/vue";
import ButtonAndIcons from './ButtonAndIcons.vue';
import { useAuthStore } from '@/stores/authStore';
const store = useAuthStore()
const props = defineProps<{
  showLogout:boolean,
  
}>() 
const emits = defineEmits<{
    (e: 'clickEventLogout', option: boolean): void
    (e: 'clickLogout'): void
}>(); 

const handleOutsideClick = (event: Event) => {
  const closeButton = document.getElementById('closeButton');
  const isCloseButtonClick = closeButton && closeButton.contains(event.target as Node);
  if (!(event.target as HTMLElement).closest('.logout-container') && !isCloseButtonClick && props.showLogout) {
    emits('clickLogout');
  }
};
const getFormattedUserName = (): string =>{
    const userName = store.user?.unique_name || '';
    return userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
  }
onMounted(() => {
  document.body.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.body.removeEventListener('click', handleOutsideClick);
});
  </script>
  
  <style scoped>
  .logout-button {
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
    z-index: 1000;
  }
  .buttonExtra{
    width: 100%;
    display: flex;
    
    justify-content: space-between;
  }
  .buttomsLogout{
    display: flex;
    width: 100%;
    padding: 10px;
    align-items: center;
  }
  .buttomsLogoutOption{
    
    justify-content: space-between;
    align-items: center;
  }
  .buttomsLogout:hover{
    background-color: rgb(212, 212, 212);
    color: #1e1e1e;
    cursor: pointer;
  }
  .buttomsLeft{
    justify-content: left;
    margin-right: 15px;
  }
  .buttomsRight{
    width: 100%;
    display: flex;
    justify-content: end;
  }
  .middleContent {
  flex: 1; 
  display: flex;
  align-items: center;
}
.no-wrap {
  white-space: nowrap; 
}
  .logout-container {
    position: fixed;
    top: 60px;
    right: 20px;
    background-color: #1e1e1e;
    border: 1px solid #1e1e1e;
    
    color: #ccc;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 377px;
    height: 270px;
  }
  .circle {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: #14ae5c; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px; 
}
.circleOption {
  width: 106px;
  height: 33px;
  border-radius: 50%;
  background-color: #14ae5c; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.initialOption {
  font-size: 15px; 
  color: white; 
  font-weight: bold; 
}
.userContent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; 
  margin-bottom: 25px;
}

.userText {
  text-align: center; 
}

.initial {
  font-size: 35px;
  color: white;
  font-weight: bold; 
}
  </style>
  