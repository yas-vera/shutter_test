<script setup lang="ts">
import {onBeforeMount,onBeforeUnmount,ref,watch} from 'vue'
import MenuOperator from '@/components/menu/MenuOperator.vue';
import { TAB_RULES, TAB_SHC_GROUPS, TAB_UDS_GROUPS, TAB_UDS_GROUPS_DETAILS_SHC, TAB_UDS_GROUPS_DETAILS_UDS,TAB_FORM_ADD_SHC_GROUP, TAB_UDS_GROUPS_DETAILS_USERS, TAB_USER, TAB_USER_AND_GROUPS } from '@/constants/constants';
import { useAdvanceSearchPanelStore } from '@/stores/advancedSearchPanelStore';
import { useNavBarStore } from '@/stores/navBarStore';
import { useUserAndGroupStore } from '@/stores/userAndGroupStore';
import { useUserStore } from '@/stores/userStore';
import { useUdsGroupsStore } from '@/stores/udsGroupsStore';
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
import { useLoadStore } from '@/stores/loadStore';
import SearchPicker from '@/components/searchPicker/SearchPicker.vue';
import { useRulesStore } from '@/stores/rulesStore';
const userStore = useUserStore()
const loaderStore = useLoadStore()
const rulesStore = useRulesStore()
const advanceSearchPanelStore = useAdvanceSearchPanelStore()
const userAndGroups = useUserAndGroupStore()
const screenStore = useScreenStore()
const udsGroupsStore = useUdsGroupsStore()
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
    const params = {
      user_id: userStore.searchValue
    };
    await userStore.dataUser(params);
    loaderStore.setLoadingSearch(false);
  }
);
const createShcGroup = async () =>{
  await udsGroupsStore.dataUdsGroups()
  await rulesStore.dataRules()
  await userStore.dataUser();
  userAndGroups.menuChange(TAB_FORM_ADD_SHC_GROUP)
}
const searchGroupShc = async (value:string) =>{
  shcGroupsStore.searchValueSHC = value
  loaderStore.setLoadingSearch(true);
  value.length > 1 && shcGroupsStore.resetPagination()
  const params = {
    q:value
  }
  await shcGroupsStore.dataShcGroups(params)
  loaderStore.setLoadingSearch(false);
}
</script>
<template>
    <MenuOperator>
      <template #leftMenu >
        <template v-if="userAndGroups.showTableDetails()">   
              <SearchPicker
                  placeholder="Search group shc"
                  margin-right-loader-icon="10px"
                  input-search-id="searchGroupShc"
                  :value="shcGroupsStore.searchValueSHC"
                  icon-left="search" 
                  @update="(event) => searchGroupShc(event)"
                  size="medium"
                  :show-loader="(shcGroupsStore.searchValueSHC.length > 0 && loaderStore.loadSearch)"
              />
        </template>
        <div v-else> 
              <qtm-breadcrumb size="medium" separator=">">
                <qtm-breadcrumb-item>
                    <qtm-typography>User and groups</qtm-typography>
                </qtm-breadcrumb-item>
                <qtm-breadcrumb-item>
                    <qtm-typography>Users</qtm-typography>
                </qtm-breadcrumb-item>
                <qtm-breadcrumb-item>
                  <qtm-typography>{{ userAndGroups.getBreadcrumbItemContent() }}</qtm-typography>
                </qtm-breadcrumb-item>
              </qtm-breadcrumb>
            
              <div>
                <qtm-button
                  variant="ghost"
                  left-icon="arrow_back"
                  color="neutral"
                  :props="{
                    id: 'backButtonUserAndGroups',
                  }"
                  @click-event="userAndGroups.handleBackButtonClick()"
                >
                  Back
                </qtm-button>
              </div>
        </div>
      </template>
      <template #rightMenu v-if="userAndGroups.showTableDetails()">
              <qtm-button
                v-if="userAndGroups.verifyMenu(TAB_SHC_GROUPS)"
                color="primary"
                size="medium"
                left-icon="add"
                classes="text-scale-7"
                :props="{
                    id: 'createShcGroupButton',
                  }"
                :label="screenStore.widthResponsive(768) ? 'Create New SHC group':'Create'"
                @click="()=>createShcGroup()"
               
              >
              
            </qtm-button>
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