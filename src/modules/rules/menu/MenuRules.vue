<script setup lang="ts">
import {computed, onBeforeMount,onBeforeUnmount, ref} from 'vue'
import MenuOperator from '@/components/menu/MenuOperator.vue';
import { useAdvanceSearchPanelStore } from '@/stores/advancedSearchPanelStore';
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
  QtmTextInput,
  QtmDropdown,
  QtmDropdownTrigger,
  QtmDropdownOverlay,
  QtmBreadcrumb,
  QtmBreadcrumbItem
} from "@qtm/vue";
import { useRulesStore } from '@/stores/rulesStore';
import { TAB_DETAILS_RULE, TAB_FORM_ADD_RULE, TAB_RULES } from '@/constants/constants';
import { useScreenStore } from '@/stores/screenStore';
import { useMapViewStore } from '@/stores/mapViewStore';
import { validEditFormConfigRules } from '../config/formConfig';
import SearchPicker from '@/components/searchPicker/SearchPicker.vue';
import { useLoadStore } from '@/stores/loadStore';
import { useFilterStore } from '@/stores/filtersStore';
const rulesStore = useRulesStore()
const screenStore = useScreenStore()
const mapStore = useMapViewStore()
const loaderStore = useLoadStore()
const filterStore = useFilterStore()
const advanceSearchPanelStore = useAdvanceSearchPanelStore()
onBeforeMount(() => {
  advanceSearchPanelStore.addSearchPanel({
    id: 'searchAdvancedRules',
    instance: false,
  });
});

onBeforeUnmount(() => {
  advanceSearchPanelStore.removeSearchPanel('searchAdvancedRules');
});
const openCloseAdvancedSearch = (advance:string) => {
 const verifymenu= advanceSearchPanelStore.verifyOpenClose(advance)
 if(verifymenu){
  advanceSearchPanelStore.closeSearchPanel(advance)
}else{
  advanceSearchPanelStore.openSearchPanel(advance)
  if(rulesStore.resetLabelDate){
    setTimeout(() => { rulesStore.handleResetDate(false) }, 1000);
  }
}
}
const createRuleHandle = () =>{
  rulesStore.menuChange(TAB_FORM_ADD_RULE)
  mapStore.resetPolygonFigure()
  if(rulesStore.showConflictManagement && rulesStore.showConflictMinimize){
    rulesStore.handleShowConflictManagement()
  }
} 

const handleCreateRule = () => {
  rulesStore.initialData = null;
  createRuleHandle()
  validEditFormConfigRules(true) 
  rulesStore.isEditRule = false
}
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};
const searchRules = debounce(async (value) => {
  rulesStore.searchValueRulesDinamic = value;
  loaderStore.setLoadingSearch(true);
  const dataSend = filterStore.rulesFilters;
  dataSend.q = value;
  await rulesStore.handleValuesFilter(dataSend);
  await rulesStore.dataRules(undefined, false);
  loaderStore.setLoadingSearch(false);
}, 300);
</script>
<template>
    <MenuOperator>
        <template #leftMenu>
          <template v-if="!rulesStore.verifyMenu(TAB_DETAILS_RULE)">
            <SearchPicker
                  placeholder="Search"
                  classes-input-custom="inputSearchRules"
                  margin-right-loader-icon="10px"
                  input-search-id="searchLocationRules"
                  :value="rulesStore.searchValueRulesDinamic"
                  icon-left="search" 
                  @update="(event) => searchRules(event)"
                  size="large"
                  :show-loader="(rulesStore.searchValueRulesDinamic?.length > 0 && loaderStore.loadSearch)"
              />

                    <qtm-button 
                    size="large"
                    variant="ghost"
                    color="neutral"
                    :props="{
                      id:'buttonSearchRules'
                    }"
                    :label="screenStore.screenWidth > 900 ? 'Advanced search':'Advanced search'"
                    classes="border-medium buttonAdvanceSearchRules optionCloseSearchRules"
                    left-icon="manage_search"
                    @click="()=>openCloseAdvancedSearch('searchAdvancedRules')"
                    >
                    </qtm-button>
                    <qtm-button 
                        size="large"
                        classes="bg-bluegrey-700 d-none"
                        class="custom-button-search-location"
                        :props="{
                          id:'search_location_on',
                        }"
                        v-if="(rulesStore.showConflictManagement && rulesStore.viewRules === 'map')"
                    >
                    <qtm-icon
                        icon="location_on"
                        size="medium"
                        variant="outlined"
                        @click-event="console.log('action')
                    "></qtm-icon>
                    </qtm-button>
          </template>
          <div v-else> 
                    <qtm-breadcrumb size="medium" separator=">">
                    <qtm-breadcrumb-item>
                        <qtm-icon icon="home"></qtm-icon>
                        <qtm-typography>Home</qtm-typography>
                    </qtm-breadcrumb-item>
                    <qtm-breadcrumb-item>
                        <qtm-typography  @click="rulesStore.menuChange(TAB_RULES),rulesStore.handleviewRules('table'),rulesStore.defaultRuleDetail()">Rules</qtm-typography>
                    </qtm-breadcrumb-item>
                    <qtm-breadcrumb-item>
                        <qtm-typography>View rule enforcement history</qtm-typography>
                    </qtm-breadcrumb-item>
                  </qtm-breadcrumb>
             
              <div>
                <qtm-button
                  variant="ghost"
                  left-icon="arrow_back"
                  color="neutral"
                  :props="{
                    id:'buttonBackRules'
                  }"
                  @click-event="rulesStore.menuChange(TAB_RULES),rulesStore.handleviewRules('table'),rulesStore.defaultRuleDetail()"
                >
                  Back
                </qtm-button>
              </div>
            </div>
        </template>
        <template #rightMenu v-if="!rulesStore.verifyMenu(TAB_DETAILS_RULE)">
              <qtm-button
              :disabled="( rulesStore.verifyMenu(TAB_FORM_ADD_RULE))"
              :label="screenStore.screenWidth > 900 ? 'Conflict management':'Conflict management'"
              left-icon="priority_high"
              size="large"
              :classes="'bg-bluegrey-700 buttonAdvanceConflictRules'"
              :props="{
                id:'buttonConflictManagement'
              }"
              @click-event="rulesStore.handleShowConflictManagement()"></qtm-button>
            <qtm-button
              :label="screenStore.screenWidth > 900 ? 'Create new rule':'Create new rule'"
              left-icon="add"
              size="large"
              classes="buttonAdvanceCreateRules"
              :disabled="rulesStore.disableFormRule"
              :props="{
                id:'buttonAddRule'
              }"
              @click-event="handleCreateRule"></qtm-button>
        </template>
    </MenuOperator>
</template>