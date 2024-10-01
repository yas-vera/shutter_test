<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useNavBarStore } from "@/stores/navBarStore";
import {
  QtmHeader,
  QtmTabs,
  QtmButton,
  QtmMenuItemList,
  QtmHeaderBrand,
  QtmHeaderDivider,
  QtmHeaderMenu,
  QtmHeaderMenuLeft,
  QtmTab,
  QtmTypography,
  QtmHeaderMenuRight,
  QtmIcon,
  QtmSubmenuItem,
  QtmSubmenuItemList,
  QtmDropdown,
  QtmDropdownTrigger,
  QtmDropdownOverlay,
  QtmMenuItem,
  QtmMenuItemLabel
} from "@qtm/vue";
import Logout from "../logout/Logout.vue";
import { ref,onMounted, computed } from 'vue'
import ModalConfirm from "../modal/ModalConfirm.vue";
import { TAB_ACTIVITY_LOGS, TAB_CONFIG_AND_SETTINGS, TAB_RULES, TAB_SHC_GROUPS, TAB_UDS_GROUPS, TAB_USER, TAB_USER_AND_GROUPS, VAR_MAINTAINER, VAR_OPERATOR } from "@/constants/constants";
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import { useRoute } from "vue-router";
import ClickOutSide from "../clickoutside/ClickOutSide.vue";
import router from '@/router'
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import { useScreenStore } from "@/stores/screenStore";
import { useRulesStore } from "@/stores/rulesStore";
import { useUserStore } from "@/stores/userStore";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import useRules from "@/modules/rules/hooks/useRules";
import systemService from "@/services/systemService";
import { useSystemStore } from "@/stores/systemStore";
const authStore = useAuthStore()
const navBarStore = useNavBarStore()
const userAndGroups = useUserAndGroupStore()
const ruleStore = useRulesStore()
const userStore = useUserStore()
const screenStore = useScreenStore()
const shcGroupsStore = useShcGroupsStore()
const udsGroupsStore = useUdsGroupsStore()
const route = useRoute();
const systemStore = useSystemStore()
const showLogout = ref<boolean>(false)
const showModalLogout = ref<boolean>(false)
const optionNavbar = ref<string>('user')
const showSubMenuUserAndGroups = ref<boolean>(false)
const {modalConfirmClose,showModalClose,closeFormNewRule} = useRules()

const tabKey = ref(0);

const forceRemount = () => {
  tabKey.value += 1;
};
const toggleLogout = () => {
    showLogout.value = !showLogout.value;
  };
const toggleModalConfirm = async (value:boolean) => {
  if(value){
    if(authStore.role === VAR_OPERATOR) await systemService.postBackup();
    authStore.logout()
  }{
    showModalLogout.value = false
  }
  
}
const eventLogout = (value:boolean) => {
  showModalLogout.value = true
}
const toggleSubMenuUserAndGroups = (valueMenu:string) => {
  if(valueMenu !== TAB_USER_AND_GROUPS){
    showSubMenuUserAndGroups.value = false
  }else{
    showSubMenuUserAndGroups.value = !showSubMenuUserAndGroups.value
  }
  navBarStore.menuChange(valueMenu)
};
const toggleSubMenu = (valueMenu:string) => {
  userAndGroups.menuChange(valueMenu)
  showSubMenuUserAndGroups.value = !showSubMenuUserAndGroups.value
};
onMounted( async () => {
  userAndGroups.menuChange('')
  await systemStore.getStatusPetition()
  if (route.path.endsWith('/rules')) {
    navBarStore.menuChange(TAB_RULES);
  }else if(route.path.endsWith('/activity-logs')){
    navBarStore.menuChange(TAB_ACTIVITY_LOGS);
  }else if(route.path.endsWith('/settings')){
    navBarStore.menuChange(TAB_CONFIG_AND_SETTINGS);
  }else{
    navBarStore.menuChange(TAB_USER_AND_GROUPS);
  
  }
})
const handleMenuUser = () =>{
  if(!userAndGroups.verifyMenu(TAB_USER)){
      userStore.restoreStates()
  }
}
const handleMenuUDS = () =>{
  if(!userAndGroups.verifyMenu(TAB_UDS_GROUPS)){
    udsGroupsStore.restoreStates()
  }
}
const handleMenuSHC = () =>{
  if(!userAndGroups.verifyMenu(TAB_SHC_GROUPS)){
    shcGroupsStore.restoreStates()
  }
}
const optionUserAndGroup = async (option:string) => {
  optionNavbar.value = option
  await modalConfirmClose(ruleStore.formData )
  if(!showModalClose.value){
    handleOptionChange()
  }
}
const hasClassRule = ref(false);
const hasClassLog = ref(false);

const optionContainerUser = async () => {
  if(route.path == '/operator/rules'){ 
    hasClassRule.value = !hasClassRule.value
  }
  if(route.path == '/operator/activity-logs'){
    hasClassLog.value = !hasClassLog.value
  }
}

const handleOptionRule = async (option:string) => {
  if(route.path !== '/operator/rules'){
    await optionUserAndGroup(option)
  }
  ruleStore.isInitDataRule = true
}
const handleOptionChange = () => {
  const routeRole = authStore.role
  switch (optionNavbar.value) {
    case 'rules':
      toggleSubMenuUserAndGroups(TAB_RULES)
      router.replace(`/${routeRole}/rules`)
      shcGroupsStore.closeAddUser()
      ruleStore.restoreStates()
      break;
    case 'user':
      const targetUrl = `/${routeRole}/usergroups/users`;
      if (route.path !== targetUrl) {
          toggleSubMenu(TAB_USER);
          router.replace(targetUrl);
          shcGroupsStore.closeAddUser();
          userStore.restoreStates();
          handleMenuUser();
      }
      break;
    case 'uds':
      toggleSubMenu(TAB_UDS_GROUPS)
      router.replace(`/${routeRole}/usergroups/uds`)
      shcGroupsStore.closeAddUser()
      handleMenuUDS()
      break;
    case 'shc':
      toggleSubMenu(TAB_SHC_GROUPS)
      router.replace(`/${routeRole}/usergroups/shc`)
      shcGroupsStore.closeAddUser()
      handleMenuSHC()
      break;
    case 'logs':
      toggleSubMenuUserAndGroups(TAB_ACTIVITY_LOGS)
      router.replace(`/${routeRole}/activity-logs`)
      break;
    case 'settings':
      toggleSubMenuUserAndGroups(TAB_CONFIG_AND_SETTINGS)
      if(routeRole === VAR_MAINTAINER){
        router.replace(`/${routeRole}/settings`)
      }
      break;
    default:
      break;
  }
}

const handleModalClose = (e: boolean) => {
  if (e) {
    handleOptionChange()
    closeFormNewRule()
    ruleStore.formData = {}
    showModalClose.value = false;
    
  } else {
    showModalClose.value = false;
    navBarStore.menuChange(TAB_USER_AND_GROUPS)
  }
  forceRemount()
}
const statusType = (): 'NOMINAL' | 'OUTAGE' | 'INCIDENT' | 'MAINTENANCE' | '' => {
  if (systemStore.status?.status !== undefined && systemStore.status?.status !== '') {
    return systemStore.status.status.toLocaleUpperCase() as 'NOMINAL' | 'OUTAGE' | 'INCIDENT' | 'MAINTENANCE';
  }
  return '';
};

const iconSettings = () => {
  const status = statusType();
  const iconMap: Record<'NOMINAL' | 'OUTAGE' | 'INCIDENT' | 'MAINTENANCE', { color: string; icon: string }> = {
    'NOMINAL': { color: '#20B65F', icon: 'check_circle'},
    'INCIDENT': { color: '#FF951A', icon: 'report'},
    'OUTAGE': { color: '#FF1A29', icon: 'warning'},
    'MAINTENANCE': { color: '#00BBDD', icon: 'settings'},
  };
  if (status && status in iconMap) {
    return iconMap[status as 'NOMINAL' | 'OUTAGE' | 'INCIDENT' | 'MAINTENANCE'];
  }
  return { color: '#000', icon: 'help_outline' };
};





</script>
<template>
  <logout
    :showLogout="showLogout"
    @click-event-logout="eventLogout"
    @click-logout="toggleLogout"
  />
  <ModalConfirm
    :is-modal-open="showModalLogout"
    title="Log out"
    message="Are you sure you want to log out?"
    textConfirm="Yes"
    @open-option="showModalLogout = false"
    @click-event="toggleModalConfirm"
  />
  <ModalConfirm 
    :is-modal-open="showModalClose" 
    title="Warning"
    message="If you close the window, the rule details you've entered will be lost." 
    @open-option="showModalClose = false"
    @click-event="handleModalClose" 
    text-confirm="Ok" 
  />
  <ClickOutSide @clickoutside="showSubMenuUserAndGroups = false">
  <qtm-header :classes="''" :size="'medium'" >
    <qtm-header-brand >
      <img
        src="../../assets/img/Thales_Alenia_Space_Logo.png"
        alt="thales logo"
        width="100px"
        style="margin-left: 15px;"
      />
        <qtm-typography
          :font-size="7"
          font-weight="normal"
          font-family="roboto"
          classes="hidden-custom custom-medium:show-custom text-bluegrey-500  pl-l">
        PLATINO Shutter Control
        </qtm-typography>

    </qtm-header-brand>
    
    <qtm-header-divider classes="hidden medium:block" />
    
    <qtm-header-menu >
      <qtm-header-menu-left >
        <qtm-tabs full-height scroll-horizontally :divider="false" :key="tabKey" >
          <qtm-tab  
            v-if="authStore.role === VAR_OPERATOR"
            id="menuRuleOption"
            @mouseout="showSubMenuUserAndGroups = false"
            :active="navBarStore.verifyMenu(TAB_RULES)"
            @clicked-tab-event="() => { handleOptionRule('rules')}"
            :classes="hasClassRule ? 'qtm-active' : ''"
            >
            <qtm-icon icon="rule" />
            <qtm-typography :font-size="6" font-weight="normal" font-family="roboto">Rules</qtm-typography>
          </qtm-tab>
         
          <qtm-tab 
            v-if="authStore.role === VAR_OPERATOR"
            id="menuUserAndGroupsOption"
            @mouseover="showSubMenuUserAndGroups = true"
            :classes="(navBarStore.verifyMenu(TAB_RULES) || navBarStore.verifyMenu(TAB_ACTIVITY_LOGS)) ? 'qtm-custom-tag' : ''"
            @clicked-tab-event="() => { optionContainerUser()}"
            :active="navBarStore.verifyMenu(TAB_USER_AND_GROUPS)"
           >
            <qtm-icon icon="groups" variant="outlined" />
            <qtm-typography :font-size="6" font-weight="normal" font-family="roboto">{{screenStore.widthResponsive(768) ? 'Users and groups':'Users & Groups'}}</qtm-typography>
            
          </qtm-tab>
          
          <div class="sub-menu-custom" v-if="(showSubMenuUserAndGroups)" >
                <qtm-menu-item-list classes="container-items">
                  <qtm-menu-item
                    id="subMenuUsers"
                    :active="userAndGroups.verifyMenu(TAB_USER)"
                    @clicked-menu-item="() => { toggleSubMenuUserAndGroups(TAB_USER_AND_GROUPS); optionUserAndGroup('user') }" >
                    <qtm-menu-item-label :font-size="7" font-weight="normal" font-family="roboto">Users</qtm-menu-item-label>
                  </qtm-menu-item >
                  <qtm-menu-item
                  id="subMenuUdsGroups"
                  :active="userAndGroups.verifyMenu(TAB_UDS_GROUPS)"
                  @clicked-menu-item="() => { toggleSubMenuUserAndGroups(TAB_USER_AND_GROUPS); optionUserAndGroup('uds') }">
                    <qtm-menu-item-label :font-size="7" font-weight="normal" font-family="roboto">UDS groups</qtm-menu-item-label>
                  </qtm-menu-item>
                  <qtm-menu-item
                  id="subMenuShcGroups"
                  :active="userAndGroups.verifyMenu(TAB_SHC_GROUPS)"
                  @clicked-menu-item="() => { toggleSubMenuUserAndGroups(TAB_USER_AND_GROUPS); optionUserAndGroup('shc') }">
                    <qtm-menu-item-label :font-size="7" font-weight="normal" font-family="roboto">SHC groups</qtm-menu-item-label>
                  </qtm-menu-item>
                </qtm-menu-item-list>
          </div>
          <qtm-tab
            v-if="authStore.role === VAR_OPERATOR || authStore.role === VAR_MAINTAINER" 
            id="menuSettingsOption"
            :disabled="authStore.role === VAR_OPERATOR"
             @mouseout="showSubMenuUserAndGroups = false"
            :active="navBarStore.verifyMenu(TAB_CONFIG_AND_SETTINGS)"
            @clicked-tab-event="() => { optionUserAndGroup('settings'), userAndGroups.menuChange('') }">
            <qtm-icon icon="settings" variant="outlined" />
            <qtm-typography :font-size="6" font-weight="normal" font-family="roboto" >{{screenStore.widthResponsive(768) ? 'Configuration and settings':'Config. & Settings'}}</qtm-typography>
          </qtm-tab>
          <qtm-tab 
            v-if="authStore.role === VAR_OPERATOR || authStore.role === VAR_MAINTAINER"
            id="menuActivityLogsOption"
             @mouseout="showSubMenuUserAndGroups = false"
            :active="navBarStore.verifyMenu(TAB_ACTIVITY_LOGS)"
            :classes="hasClassLog ? 'qtm-active' : ''"
            @clicked-tab-event="() => { optionUserAndGroup('logs'), userAndGroups.menuChange('') }">
            <qtm-icon icon="history" variant="outlined" />
            <qtm-typography :font-size="6" font-weight="normal" font-family="roboto">Activity logs</qtm-typography>
          </qtm-tab>
          
        </qtm-tabs>
        
      </qtm-header-menu-left>
      <qtm-header-menu-right>
        <qtm-icon
          :style="{ marginRight: '5px', color: iconSettings().color }"
          :icon="iconSettings().icon"
          variant="filled"
          size="large"
          classes="rounded-full"
        />
        <qtm-typography style="margin-right: 10px;" component="body-1" :classes="'mr-3x text-primary-50'">
          Status: {{ statusType() }}
        </qtm-typography>
        <!-- <qtm-typography :classes="'ml-5xl text-primary-50'" v-if="authStore.role === VAR_MAINTAINER">Maintainer profile logged</qtm-typography> -->
        <qtm-button
          variant="ghost"
          color="primary"
          tabindex="0"
          id="closeButton"
          :size="'medium'"
          :props="{
            id:'profileButton'
          }"
          @click="toggleLogout()"
        >
          <qtm-icon  icon="person" variant="outlined" classes="text-primary-50" />
        </qtm-button>
      </qtm-header-menu-right>
      
    </qtm-header-menu>
  </qtm-header>
</ClickOutSide>
</template>
<style scoped>
.sub-menu-custom{
  position: absolute;
  width: 180px;
  height: 140px;
  background-color: black;
  margin-top: 66px;
  margin-left: 95px;
  z-index: 200 !important;
}

.qtm-custom-tag.qtm-active:after{
  display: none !important;
}



</style>