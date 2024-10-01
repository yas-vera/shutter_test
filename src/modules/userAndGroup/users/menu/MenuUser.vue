<script setup lang="ts">
import {onBeforeMount,onBeforeUnmount,watch} from 'vue'
import MenuOperator from '@/components/menu/MenuOperator.vue';
import { TAB_UDS_GROUPS_DETAILS_USERS } from '@/constants/constants';
import { useAdvanceSearchPanelStore } from '@/stores/advancedSearchPanelStore';
import { useUserAndGroupStore } from '@/stores/userAndGroupStore';
import { useUserStore } from '@/stores/userStore';
import {
  QtmButton,
  QtmIcon,
  QtmTextInput,
  QtmBreadcrumb,
  QtmBreadcrumbItem,
  QtmTypography
} from "@qtm/vue";
import { useShcGroupsStore } from '@/stores/shcGroupsStore';
import { useScreenStore } from '@/stores/screenStore';
import SearchPicker from '@/components/searchPicker/SearchPicker.vue';
import { useLoadStore } from '@/stores/loadStore';
const userStore = useUserStore()
const loaderStore = useLoadStore()
const advanceSearchPanelStore = useAdvanceSearchPanelStore()
const userAndGroups = useUserAndGroupStore()
const screenStore = useScreenStore()
const shcGroupsStore = useShcGroupsStore()
onBeforeMount(() => {
  advanceSearchPanelStore.addSearchPanel({
    id: 'searchAdvancedUser',
    instance: false,
  });
});

onBeforeUnmount(() => {
  advanceSearchPanelStore.removeSearchPanel('searchAdvancedUser');
});
watch(
  async () => userStore.searchValue,
  async (newQuestion, oldQuestion) => {
    loaderStore.setLoadingSearch(true);
    await userStore.dataUser();
    loaderStore.setLoadingSearch(false);
  }
);
</script>
<template>
    <MenuOperator>
      <template #leftMenu >
        <template v-if="userAndGroups.showTableDetails()">
              <SearchPicker
                  placeholder="Search"
                  margin-right-loader-icon="10px"
                  input-search-id="searchUserAndGroups"
                  :value="userStore.searchValue"
                  icon-left="search" 
                  @update="(event) => userStore.searchValue = event"
                  size="medium"
                  :show-loader="(userStore.searchValue.length > 0 && loaderStore.loadSearch)"
              />
        </template>
        <div v-else> 
              <qtm-breadcrumb size="medium" separator=">">
                
                <qtm-typography classes="breadcrumb-text">User and groups</qtm-typography>
                <qtm-breadcrumb-item classes="breadcrumb-no-style">
                </qtm-breadcrumb-item>

                <qtm-breadcrumb-item>
                    <qtm-typography @click="userAndGroups.handleBackButtonClick(), userStore.defaultUserDetail()">Users</qtm-typography>
                </qtm-breadcrumb-item>
                <qtm-breadcrumb-item>
                  <qtm-typography>{{ userAndGroups.getBreadcrumbItemContent() }}</qtm-typography>
                </qtm-breadcrumb-item>
              </qtm-breadcrumb>
            
              <div style="margin-left: -15px;">
                <qtm-button
                  variant="ghost"
                  left-icon="arrow_back"
                  color="neutral"
                  :props="{
                    id: 'backButtonUserAndGroups',
                  }"
                  @click-event="userAndGroups.handleBackButtonClick(), userStore.defaultUserDetail(), userStore.itemsSelected= []"
               
                >
                  Back
                </qtm-button>
              </div>
        </div>
      </template>
      <template #rightMenu v-if="userAndGroups.showTableDetails()">
   
                <qtm-button
                  color="primary"
                  size="medium"
                  left-icon="visibility"
                  :label="screenStore.widthResponsive(768) ? 'View user history':'History'"
                  classes="text-scale-7"
                  :disabled="!userStore.itemsSelected.length"
                  :props="{
                    id: 'viewUserHistoryButton',
                  }"
                  @click-event="userAndGroups.menuChange(TAB_UDS_GROUPS_DETAILS_USERS),userStore.handleUserDetails()"
                ></qtm-button>
                <qtm-button
                  :disabled="!userStore.itemsSelected.length"
                  color="primary"
                  size="medium"
                  left-icon="groups"
                  :props="{
                    id: 'addUserToGroupButton',
                  }"
                  :label="screenStore.widthResponsive(768) ? 'Add to SHC group':'Add'"
                  classes="text-scale-7"
                  @click-event="shcGroupsStore.handleShowAddUser"></qtm-button>
              <qtm-button
                :label="screenStore.widthResponsive(768) ? 'Sync users':'Sync'"
                variant="outline"
                left-icon="sync"
                size="medium"
                :props="{
                    id: 'syncUsersButton',
                  }"
                @click-event="userStore.syncUser()"
              ></qtm-button>
      </template>
    </MenuOperator>
</template>