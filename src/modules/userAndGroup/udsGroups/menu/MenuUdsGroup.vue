<script setup lang="ts">
import {onBeforeMount,onBeforeUnmount,ref,watch} from 'vue'
import MenuOperator from '@/components/menu/MenuOperator.vue';
import { useAdvanceSearchPanelStore } from '@/stores/advancedSearchPanelStore';
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
import { useScreenStore } from '@/stores/screenStore';
import SearchPicker from '@/components/searchPicker/SearchPicker.vue';
import { useLoadStore } from '@/stores/loadStore';
const userStore = useUserStore()
const loaderStore = useLoadStore()
const advanceSearchPanelStore = useAdvanceSearchPanelStore()
const userAndGroups = useUserAndGroupStore()
const screenStore = useScreenStore()

const udsGroupsStore = useUdsGroupsStore()
onBeforeMount(() => {
  advanceSearchPanelStore.addSearchPanel({
    id: 'searchAdvancedUser',
    instance: false,
  });
});

onBeforeUnmount(() => {
  advanceSearchPanelStore.removeSearchPanel('searchAdvancedUser');
});

const searchGroupUds = async (value:string) =>{
  udsGroupsStore.searchValueUDS = value
  loaderStore.setLoadingSearch(true);
  value.length > 1 && udsGroupsStore.resetPagination()
  const params = {
    q:value
  }
  await udsGroupsStore.dataUdsGroups(params)
  loaderStore.setLoadingSearch(false);
}
</script>
<template>
    <MenuOperator>
      <template #leftMenu >
        <template v-if="userAndGroups.showTableDetails()">
              
              <SearchPicker
                  placeholder="Search group uds"
                  margin-right-loader-icon="10px"
                  input-search-id="searchGroupUds"
                  :value="udsGroupsStore.searchValueUDS"
                  icon-left="search" 
                  @update="(event) => searchGroupUds(event)"
                  size="medium"
                  :show-loader="(udsGroupsStore.searchValueUDS.length > 0 && loaderStore.loadSearch)"
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