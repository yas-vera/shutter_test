<script setup lang="ts">
import { ref,watch,onMounted, computed, toRaw } from 'vue'
import {QtmMultiselect,QtmRadioButton,QtmRadioGroup, QtmFormLabel,QtmFormField, QtmDropdownSelect,QtmDropdownSelectOption, QtmTypography,QtmButton,QtmCheckbox,QtmIcon,QtmGrid,QtmHeaderMenuLeft,QtmTab,QtmTabs,QtmHeaderMenuRight,QtmHeaderMenu,QtmBreadcrumb,QtmBreadcrumbItem} from "@qtm/vue";
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import { TAB_RULES, TAB_FORM_ADD_RULE,TAB_USER,TAB_UDS_GROUPS,TAB_SHC_GROUPS,TAB_UDS_GROUPS_DETAILS_USERS, TAB_UDS_GROUPS_DETAILS_UDS, TAB_UDS_GROUPS_DETAILS_SHC,TAB_FORM_ADD_SHC_GROUP } from '@/constants/constants'


import MenuUserAndGroup from '../menu/MenuUserAndGroup.vue';
import { useUserStore } from '@/stores/userStore';
import AdvancedSearchPanel from '@/components/searchPanel/AdvancedSearchPanel.vue';
import { formContentUser } from '../users/config/dataSearch';


import { useUdsGroupsStore } from '@/stores/udsGroupsStore';
import { useShcGroupsStore } from '@/stores/shcGroupsStore';



import { useRulesStore } from '@/stores/rulesStore';

import { useMapViewStore } from '@/stores/mapViewStore';
import ModalExport from '@/components/modal/ModalExport.vue';
import  stanag_codes  from '@/modules/userAndGroup/users/config/stanag_codes';
import UdsGroupsTable from './udsGroupsTable.vue';
import UdsGroupsDetails from './UdsGroupsDetails.vue';
import MenuUdsGroup from './menu/MenuUdsGroup.vue';
import GroupsReport from '@/components/export/groups/GroupsReport.vue';
import { useExportStore } from '@/stores/exportStore';
const mapStore = useMapViewStore()
const userAndGroups = useUserAndGroupStore()
const userStore = useUserStore()
const rulesStore = useRulesStore()
const udsGroupsStore = useUdsGroupsStore()
const shcGroupsStore = useShcGroupsStore()
const exportStore = useExportStore()
const mappedDataStanag = ref<any>([])
const radio_option = ref<string>('radio_stanag')

onMounted(async ()=>{
   //await shcGroupsStore.dataShcGroups()
   await udsGroupsStore.dataUdsGroups()
   //await rulesStore.dataRules()
   mappedDataStanag.value = stanag_codes
      .filter(item => item.STANAG !== undefined && item.STANAG !== null && item.STANAG !== "")
      .map(item => ({
        value: item.STANAG,
        label: item.STANAG
      }));
})
const resetFormValues = () =>{
  userAndGroups.menuChange(TAB_SHC_GROUPS)
  shcGroupsStore.stanag_id_list = []
  udsGroupsStore.udsGroups_dynamic_list = []
  rulesStore.rulesSelectedAddGroup = []
  radio_option.value = 'radio_stanag'
  selectedDataStagna.value = []
  selectedSch.value = []
}



/* ///// */
const filterForName = ref<string>('')

const searchGroup = async () =>{
  if(filterForName.value.length > 0){
    await shcGroupsStore.dataShcGroupsForAddUser({limit:8,group_name:filterForName.value})
  }else{
    await shcGroupsStore.dataShcGroupsForAddUser({limit:8})
  }
}
watch(filterForName, async (newValue, oldValue) => {
  await searchGroup();
});

interface Option {
  label: string;
  value: string;
}

interface Option2 {
  value: number;
  label: string;
  
}

const disabledStatus = ref(false)

const value = ref([])
const value2 = ref(null)


const selectedDataStagna = ref<Option[]>([]);
const selectedSch = ref<Option2[]>([]);
    
const valueStagna = ref<string[]>([]);
const valueSch = ref<any[]>([]);

watch(selectedDataStagna, (newVal) => {
  valueStagna.value = newVal.map(item => item.value);
  shcGroupsStore.stanag_id_list = valueStagna.value
});

watch(selectedSch, (newVal) => {
  valueSch.value = newVal.map(item => item.value);
  udsGroupsStore.udsGroups_dynamic_list = valueSch.value
});

const handleExportUserAndGroups = (itemvalue:string[],titleDoc:string,clasification:string) =>{
  switch(userAndGroups.labelUserAndGroup()){
    case 'Users':
      userStore.handleExportUsers(itemvalue,titleDoc,clasification)
      break;
    case 'UDS Groups':
      udsGroupsStore.handleExportUdsGroups(itemvalue,titleDoc,clasification)
      break;
    case 'SHC Groups':
      shcGroupsStore.handleExportShcGroups(itemvalue,titleDoc,clasification)
      break;
  }
 
}
onMounted(() => {
  userAndGroups.menuChange(TAB_UDS_GROUPS)
})
</script>
<template>
  
  <MenuUdsGroup/>
  <ModalExport 
        :shp-hidden="true"
        :pdf-compressed-hidden="true"
        :csv-hidden="true"
        :label-pdf="'PDF'"
        :show="userAndGroups.showModalExportUserAndGroups"
        @close="userAndGroups.handleShowModalExportUserAndGroup"
        @export="handleExportUserAndGroups"
      />
  <AdvancedSearchPanel 
    nameComponent="searchAdvancedUser"
    :form="formContentUser"
    @apply-filters="userStore.handleSubmit"
  />
  

  <Teleport to="#app">
    <GroupsReport v-if="exportStore.visibleGroups" :group="'uds'" :data="udsGroupsStore.udsGroupsData?.response" />
  </Teleport>

  <div
    class="containerUser"
    :style="{ 'background-color': userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS) ? 'transparent' : '#1c1d26'}"
    >
    
    <div class="content">
      <div style="display: flex; justify-content: space-between;" v-if="userAndGroups.showFormAddShcGroup()">
        <div  style="margin-left: 23px; margin-top: 10px; margin-bottom: 15px; margin-top: 20px;">

              <qtm-typography :classes="'subtitle-custom-font'">{{userAndGroups.labelUserAndGroup()}}</qtm-typography>
      </div>
      <div class="button-export-user-and-groups">
        <qtm-button 
          v-if="true"
          size="medium"
          left-icon="download"
          :props="{
              id:'exportUdsGroupButton'
          }"
          classes="text-scale-7 bg-bluegrey-700"
          @click-event="userAndGroups.handleShowModalExportUserAndGroup()">
          Export {{userAndGroups.labelUserAndGroup()}} 
        </qtm-button>
      </div>
      </div>
      <div class="user-table-container">
          <UdsGroupsDetails v-if="userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_UDS)"/>
          <UdsGroupsTable  v-else/>
      </div>

    </div>
  </div>
  
</template>

<style scoped>

.containerUser {
  width: 100%;
  height: auto;
  display: flex;
  position: absolute;
  flex-direction: column; 
  z-index: 142;
}
.content {
  position: relative;
  flex: 1;
  height: auto;
}
.button-export-user-and-groups {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-right: 23px;
}
.user-table-container {
  overflow: auto; 
  max-height: 90% !important;
  scrollbar-width: thin;
  scrollbar-color: #3b3d50 #1c1d26;
}

.container-select-2 {
  display: block;
  width: 100%;
}

.min-table {
  min-width: 1400px !important;
}




</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
