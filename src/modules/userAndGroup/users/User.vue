<script setup lang="ts">
import { ref,watch,onMounted, computed, toRaw } from 'vue'
import {QtmMultiselect,QtmRadioButton,QtmRadioGroup, QtmFormLabel,QtmFormField, QtmDropdownSelect,QtmDropdownSelectOption, QtmTypography,QtmButton,QtmCheckbox,QtmIcon,QtmGrid,QtmHeaderMenuLeft,QtmTab,QtmTabs,QtmHeaderMenuRight,QtmHeaderMenu,QtmBreadcrumb,QtmBreadcrumbItem} from "@qtm/vue";
import type { Header, Item, SortType } from "vue3-easy-data-table";
import VueMultiselect from 'vue-multiselect'
import UserTable from '../users/userTable.vue';
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import { TAB_RULES, TAB_FORM_ADD_RULE,TAB_USER,TAB_UDS_GROUPS,TAB_SHC_GROUPS,TAB_UDS_GROUPS_DETAILS_USERS, TAB_UDS_GROUPS_DETAILS_UDS, TAB_UDS_GROUPS_DETAILS_SHC,TAB_FORM_ADD_SHC_GROUP } from '@/constants/constants'
import UserDetails from '../users/UserDetails.vue';

import MenuUserAndGroup from '../menu/MenuUserAndGroup.vue';
import { useUserStore } from '@/stores/userStore';
import AdvancedSearchPanel from '@/components/searchPanel/AdvancedSearchPanel.vue';
import { formContentUser } from '../users/config/dataSearch';

import MultiStepForm from '@/components/stepperForm/MultiStepForm.vue';
import { exampleStep2 } from '@/dataFake/data';
import { formConfigSHC } from '../udsGroups/config/formConfig';
import { useUdsGroupsStore } from '@/stores/udsGroupsStore';
import { useShcGroupsStore } from '@/stores/shcGroupsStore';
import { bodyRowClassNameFunction, capitalizeFirstLetter, colorButtonClass, countItems, getValuesAndIds, sortBy, sortType } from '@/helpers/tableHelpers';
import { headersUserForm } from '../config/headersTable';


import { headersRules } from '../../rules/config/headersTable';
import { useRulesStore } from '@/stores/rulesStore';
import { convertFormatDate } from '@/helpers/convertDateTime';
import { formConfigRules } from '../../rules/config/formConfig';
import{ headersUserFormRules }  from '../../rules/config/headersTable'
import { useMapViewStore } from '@/stores/mapViewStore';
import ModalExport from '@/components/modal/ModalExport.vue';
import  stanag_codes  from '@/modules/userAndGroup/users/config/stanag_codes';
import MenuUser from './menu/MenuUser.vue';
import interact from 'interactjs';
import UsersReport from '@/components/export/users/UsersReport.vue';
import { useExportStore } from '@/stores/exportStore';
import UserCompressedReport from '@/components/export/users/UserCompressedReport.vue';


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
  //  await shcGroupsStore.dataShcGroups()
  //  await udsGroupsStore.dataUdsGroups()
  //  await rulesStore.dataRules()
   mappedDataStanag.value = stanag_codes
      .filter(item => item.STANAG !== undefined && item.STANAG !== null && item.STANAG !== "")
      .map(item => ({
        value: item.STANAG,
        label: item.STANAG
      }));

  interact('#draggableElement')
  .resizable({
    // resize from all edges and corners
    //edges: { left: true, right: true, bottom: true, top: true },
    edges: { right: true },

    listeners: {
      move (event:any) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),

    ],

    inertia: true
  })
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

const optionCloseSearchUserDetail = computed(() => {
  if(userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS)){
    if(!userStore.expandDetailUser){
      return '45%'
    }else{
      return '100%'
    }
  }else{
    return '100%'
  }
})


onMounted(() => {
  userAndGroups.menuChange(TAB_USER)
})
</script>
<template>
  
  <MenuUser/>
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
    <UserCompressedReport v-if="exportStore.visibleUsers" :data="userStore.itemsSelected" /> 
    <!-- <UsersReport v-if="exportStore.visibleUsers" :data="userStore.itemsSelected" /> -->
  </Teleport>   


  <div
    id="draggableElement"
    :class="'containerUser' + (userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS) ? ' modal-border' : '')"
    :style="{
      'background-color': '#1c1d26',
      'width': optionCloseSearchUserDetail}"
    >
    
    <div class="content">

      <div>
          <UserDetails v-if="userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS)"/>
          <UserTable  v-else/>
      </div>

    </div>
  </div>
</template>

<style scoped>

.containerUser {
  display: flex;
  position: absolute;
  flex-direction: column; 
  z-index: 139;
  min-width: 45% !important;
}
.content {
  position: relative;
  flex: 1;
  height: auto;
  margin-left: 22px; margin-right: 20px;
}
.button-export-user-and-groups2 {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.user-table-container {
  /* overflow: auto;  */
  /* max-height: 90% !important; */
  /* scrollbar-width: thin;
  scrollbar-color: #3b3d50 #1c1d26; */
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
