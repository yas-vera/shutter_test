<script setup lang="ts">
import MenuFloating from '@/components/menu/MenuFloating.vue';
import MainWrapperFrame from '@/components/mainWrapperFrame/MainWrapperFrame.vue';
import { useNavBarStore } from '@/stores/navBarStore';
import { TAB_FORM_ADD_SHC_GROUP, TAB_UDS_GROUPS_DETAILS_USERS, TAB_USER_AND_GROUPS } from '@/constants/constants';
import MapView from '@/modules/map/MapView.vue';
import AddUserTable from '@/modules/userAndGroup/udsGroups/AddUserTable.vue';
import { useShcGroupsStore } from '@/stores/shcGroupsStore';
import { useUserAndGroupStore } from '@/stores/userAndGroupStore';

const navBarStore = useNavBarStore()
const shcGroupsStore = useShcGroupsStore()
const userAndGroups = useUserAndGroupStore()

</script>
<template>
  
   <MainWrapperFrame>
    <MenuFloating/>
    <router-view></router-view>

    <div v-if="
      (userAndGroups.menuSelected === TAB_FORM_ADD_SHC_GROUP) || 
      (userAndGroups.menuSelected === TAB_UDS_GROUPS_DETAILS_USERS)">
      <MapView/>
    </div>
    
    <AddUserTable
      Title="Add users to SHC group"
      v-if="(shcGroupsStore.showAddUser && navBarStore.verifyMenu(TAB_USER_AND_GROUPS))"
      @closeForm="shcGroupsStore.handleShowAddUser"
      @submitAction="shcGroupsStore.submitActionAddUser"
    ></AddUserTable>
   </MainWrapperFrame>
</template>