<script setup lang="ts">
import { ref,watch,onMounted, computed, toRaw, onBeforeMount } from 'vue'
import {QtmMultiselect,QtmRadioButton,QtmRadioGroup, QtmFormLabel,QtmFormField, QtmDropdownSelect,QtmDropdownSelectOption, QtmTypography,QtmButton,QtmCheckbox,QtmIcon,QtmGrid,QtmHeaderMenuLeft,QtmTab,QtmTabs,QtmHeaderMenuRight,QtmHeaderMenu,QtmBreadcrumb,QtmBreadcrumbItem,QtmTag, QtmTooltip, QtmTextInput, QtmDivider} from "@qtm/vue";
import VueMultiselect from 'vue-multiselect'
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import { TAB_RULES, TAB_FORM_ADD_RULE,TAB_USER,TAB_UDS_GROUPS,TAB_SHC_GROUPS,TAB_UDS_GROUPS_DETAILS_USERS, TAB_UDS_GROUPS_DETAILS_UDS, TAB_UDS_GROUPS_DETAILS_SHC,TAB_FORM_ADD_SHC_GROUP, TAB_SHC_ADD_RULE } from '@/constants/constants'
import MenuUserAndGroup from '../menu/MenuUserAndGroup.vue';
import { useUserStore } from '@/stores/userStore';
import AdvancedSearchPanel from '@/components/searchPanel/AdvancedSearchPanel.vue';
import { formContentUser } from '../users/config/dataSearch';
import MultiStepForm from '@/components/stepperForm/MultiStepForm.vue';
import { formConfigSHC } from '../udsGroups/config/formConfig';
import { useUdsGroupsStore } from '@/stores/udsGroupsStore';
import { useShcGroupsStore } from '@/stores/shcGroupsStore';
import { bodyRowClassNameFunction, capitalizeFirstLetter, colorButton, colorButtonClass, colorTagClass, countItem, countItems, getValuesAndIds, getValuesAndIdsExpanded, isExpanded, sortBy, sortType, validateLargeText,groupRuleset, iconTagClass, handleLabelMultiselectFilter } from '@/helpers/tableHelpers';
import { headersUserForm } from '../config/headersTable';
import { headersRules } from '../../rules/config/headersTable';
import { useRulesStore } from '@/stores/rulesStore';
import { convertFormatDate, getFormattedDateTime } from '@/helpers/convertDateTime';
import { formConfigRules, validEditFormConfigRules } from '../../rules/config/formConfig';
import { useMapViewStore } from '@/stores/mapViewStore';
import ModalExport from '@/components/modal/ModalExport.vue';
import ShcGroupsTable from './ShcGroupsTable.vue';
import ShcGroupsDetails from './ShcGroupsDetails.vue';
import useUserTable from '../users/hooks/useUserTable';
import { headersUserStep } from './config/headersTable';
import ClickOutSide from '@/components/clickoutside/ClickOutSide.vue';
import useFilterRules from '@/modules/rules/hooks/useFilterRules';
import PaginationCustom from '@/components/tableCustom/PaginationCustom.vue';
import { usePopupAlertStore } from '@/stores/popupAlertStore';
import { useScreenStore } from '@/stores/screenStore';
import ModalConfirm from '@/components/modal/ModalConfirm.vue';
import { isEmptyExcludingDates } from '@/helpers/multisteepHelper';
import './css/shcGroup.css'
import 'vue-multiselect/dist/vue-multiselect.css'
import RulesCreate from '@/modules/rules/RulesCreate.vue';
import MenuShcGroup from './menu/MenuShcGroup.vue';
import type { Item } from 'vue3-easy-data-table';
import { acquisitionModeList, missionSensorList, ruleTypeList, states, statesUsers } from '@/data/selectOptions';
import type { IAoiDraw, ViewOptions } from '@/interfaces/IDraw';
import GroupsReport from '@/components/export/groups/GroupsReport.vue';
import { useExportStore } from '@/stores/exportStore';
import { onUnmounted } from 'vue';
import { filterOptions as filterOptionsList } from "@/data/filterOptions";
import { convertFormatDateAndValidDate, convertFormatFilterDate, convertFormatFilterShcDate } from '../../../helpers/convertDateTime';
import { useGroupStore } from '../../../stores/groupStore';
import { useSatDataStore } from '../../../stores/satDataStore';
import { useFilterStore } from '@/stores/filtersStore';
import { watchEffect } from 'vue';
const mapStore = useMapViewStore()
const userAndGroups = useUserAndGroupStore()
const userStore = useUserStore()
const rulesStore = useRulesStore()
const udsGroupsStore = useUdsGroupsStore()
const shcGroupsStore = useShcGroupsStore()
const popupStore = usePopupAlertStore()
const screenStore = useScreenStore()
const radio_option = ref<string>('radio_stanag')
  const {
    user_idCriteria,
    user_idCriteria_temp,
    stanag_idCriteria,
    status_criteria,
    status_criteria_temp,
    udsGroup_Criteria,
    group_shcs_Criteria,
    missions_Criteria,
    insertion_date_start_Criteria,
    insertion_date_end_Criteria,
    insertion_date_start_Criteria_temp,
    insertion_date_end_Criteria_temp,
    license_expiration_date_start_Criteria,
    license_expiration_date_end_Criteria,
    license_expiration_date_start_Criteria_temp,
    license_expiration_date_end_Criteria_temp,
    user_rules_Criteria,
    user_rules_Criteria_temp,
    showUser_idFilter,
    showStanag_idFilter,
    showStatus_header,
    udsGroup_header,
    group_shcs_header,
    missions_header,
    insertion_date_date_header,
    license_expiration_date_header,
    user_rules_header,
    toggleRowExpansion,
    isRowExpanded,
    expandedRows,
    filterOptions,
    selectedStanagIdsTemp,
    selectedStanagIds,
    stanagSearchTerm,
    mappedDataStanag,
    handleStanagIdCheckboxChange,
    resetFilters,
    applyFilters,
    filteredMappedDataStanag,
    serverItemsLength,
    serverOptions,

    resetUdsGroupFilters,
    applyUdsGroupFilters,
    udsGroupSearchTerm,
    handleUdsGroupCheckboxChange,
    selectedUdsGroupIds,
    selectedUdsGroupIdsTemp,
    filteredMappedDataUdsGroup,
    
    applyShcGroupFilters,
    resetShcGroupFilters,
    shcGroupSearchTerm,
    handleShcGroupCheckboxChange,
    selectedShcGroupIdsTemp,
    selectedShcGroupIds,
    filteredMappedDataShcGroup,

    missionGroupSearchTerm,
    filteredMappedDataMissionGroup,
    applyMissionGroupFilters,
    resetMissionGroupFilters,
    handleMissionGroupCheckboxChange,
    selectedMissionGroupIdsTemp,
    selectedMissionGroupIds,

    offsetValue,
    pagProperty,
    loadFromServer,
    rangePagesUser,
    getDataSelect,
    resetPagination
  } = useUserTable()
  const {
  id,
  idTemp,
  rule_name_criteria,
  rule_name_criteria_temp,
  creation_date_start_criteria,
  creation_date_end_criteria,
  creation_date_start_criteria_temp,
  creation_date_end_criteria_temp,
  mission_sensor,
  acquisition_mode,
  rules_type,
  rules_type_temp,
  users,
  status,
  status_temp,
  comments,
  comments_temp,
  showFilter_id,
  showFilter_rule_name,
  showFilter_creation_date,
  showFilter_mission_sensor,
  showFilter_acquisition_mode,
  showFilter_rules_type,
  showFilter_validity_time,
  showFilter_sensing_time,
  showFilter_users,
  showFilter_status,
  validity_start_time,
  validity_end_time,
  validity_start_time_temp,
  validity_end_time_temp,
  sensing_start_time,
  sensing_end_time,
  sensing_start_time_temp,
  sensing_end_time_temp,
  showFilter_comments,
  filterOptionsRules,

  missionSearchTerm,
  selectedMissionIds,
  selectedMissionIdsTemp ,
  filteredMappedDataMission,
  handleMissionCheckboxChange,
  applyMissionFilters,
  resetMissionFilters,

  filteredMappedDataAcquisitionMode,
  handleAcquisitionModeCheckboxChange,
  applyAcquisitionModeFilters,
  resetAcquisitionModeFilters,
  acquisitionModeSearchTerm,
  selectedAcquisitionModeIds ,
  selectedAcquisitionModeIdsTemp,

  loadFromServerRules,
  pagPropertyRules,
  offsetValueRules,
  handleFilterState,
  serverOptionsRule,
  filterState,
  getData,
  selectedGroupIds,
  selectedGroupIdsTemp,
  selectedGroupShcIds,
  selectedGroupShcIdsTemp
} = useFilterRules()
const popupAlertStore = usePopupAlertStore()
const selectedDataStagna = ref<Option[]>([]);
const groupStore = useGroupStore();
const showModalClose = ref(false)
const satDataStore = useSatDataStore();
const selectedSch = ref<Option2[]>([]);
const initialData = ref(null)
const titleFormGroup = ref('New SHC group')
const rangePages = ref<string>('')
const exportStore = useExportStore()
const formDataSubmit = async (values:any) =>{
  const udsGroups = udsGroupsStore.udsGroupsData?.response.filter(item => udsGroupsStore.udsGroups_dynamic_list.includes(item.group_id))
  const dataSend = {
    dynamic_user_assignment_stanag_id_list:shcGroupsStore.stanag_id_list,
    dynamic_user_assignment_uds : udsGroups ? udsGroups : [],
    group_rules:rulesStore.rulesSelectedAddGroup,
    ...values
  }
  const response = await shcGroupsStore.addShcGroup(dataSend)
  if(response){
        if(response.error) {
          popupAlertStore.showPopupAlert(response.error.status, response.error.message)
          return
        }
  }
  resetFormValues()
}
const formDataEditSubmit = async (values:any)=>{
  const udsGroups = udsGroupsStore.udsGroupsData?.response.filter(item => udsGroupsStore.udsGroups_dynamic_list.includes(item.group_id))
  //dynamic_user_assignment_stanag_id_list:shcGroupsStore.stanag_id_list,
  const dataSend = {
    ...values
  }
  dataSend.dynamic_user_assignment_uds = udsGroups ? udsGroups : [];
  dataSend.dynamic_user_assignment_stanag_id_list = shcGroupsStore.stanag_id_list;
  dataSend.group_rules = rulesStore.rulesSelectedAddGroup;
  const repsonse = await shcGroupsStore.updateShcGroup(dataSend)
  if(repsonse){
        if(repsonse.error) {
          const keywords = ["unique constraint", "groups_group_name_group_type_key", "already exists"];
          const nameExists = repsonse.error.status == '500' && containsKeywords(repsonse.error.message, keywords)
          const message = nameExists ? `Group with name '${dataSend.group_name}' already exists.` : repsonse.error.message
          popupAlertStore.showPopupAlert(repsonse.error.status, message)
          return
        }
  }
  resetFormValues()
}
const containsKeywords = (message:string, keywords: string[]) =>{
  return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
}
const updateGroupShc = async (data:any) => {  
  await rulesStore.dataRules() 
  await udsGroupsStore.dataUdsGroups()
  //dynamic_user_assignment_stanag_id_list ynamic_user_assignment_uds  dynamic_user_assignment_uds
  const udsGroups = udsGroupsStore.udsGroupsData?.response.filter(item => udsGroupsStore.udsGroups_dynamic_list.includes(item.group_id))
  const formattedData = data.dynamic_user_assignment_stanag_id_list.map((item :string[]) => ({
    label: item,
    value: item
  }));
  const formattedData2 = data.dynamic_user_assignment_uds.map((item :any) => ({
    label: item.group_name,
    value: item.group_id
  }));
  if(data.group_rules){
    rulesStore.rulesSelectedAddGroup = data.group_rules
  }
  
  selectedSch.value = formattedData2;
  selectedDataStagna.value = formattedData;
  if(selectedSch.value.length > 0){
    disabledStatus.value = true
    radio_option.value = 'radio_uds'
  }else{
    disabledStatus.value = false
    radio_option.value = 'radio_stanag'
  }
  shcGroupsStore.stanag_id_list = data.dynamic_user_assignment_stanag_id_list
  userStore.itemsSelectedForm = data.users

  userStore.itemsSelectedForm.forEach((user: any, index:any) => {
      const matchingUser = userStore.userData.find((u:any) => u.user_id === user.user_id);
      if (matchingUser) {
        userStore.itemsSelectedForm[index] = { ...matchingUser };
      }
  });

  initialData.value = data
  titleFormGroup.value = 'Edit'
  userAndGroups.menuChange(TAB_FORM_ADD_SHC_GROUP)
}
watch(() => userStore.userData, (newValue) => {
  userStore.itemsSelectedForm.forEach((user: any, index:any) => {
      const matchingUser = newValue.find((u:any) => u.user_id === user.user_id);
      if (matchingUser) {
        userStore.itemsSelectedForm[index] = { ...matchingUser };
      }
  });
}, {
  deep: true
})
const closeForm = () =>{
  userStore.itemsSelectedForm = []
  userAndGroups.menuChange(TAB_SHC_GROUPS)
  resetFormValues()
  resetPagination()
  resetPaginationRules()
}
onBeforeMount(async ()=>{
  await userStore.dataUser({
    sort_by: 'user_id',
    sort: 'descending',
    status: 'active',
  });
})
onMounted(async ()=>{
  userAndGroups.menuChange(TAB_SHC_GROUPS)
  formConfigSHC.value[0].fields[0].value = ''
  formConfigSHC.value[0].fields[1].value = ''
  await shcGroupsStore.dataShcGroups();
  resetPagination()
  resetPaginationRules()
 // await rulesStore.dataRules()
 
  // await groupStore.setGroupsData({limit: 10000});
  const dataSelectUds = await groupStore.getGroupsToSelect({group_type:'uds'})
  const dataSelectShc = await groupStore.getGroupsToSelect({group_type:'shc'})
  await shcGroupsStore.assignSelectData({response:dataSelectShc})
  await udsGroupsStore.assignSelectData({response:dataSelectUds})
  await userStore.fetchMissions();
  await satDataStore.getSatData('acquisition_mode')
  await getData()
})
const resetFormValues = () =>{
  userAndGroups.menuChange(TAB_SHC_GROUPS)
  shcGroupsStore.stanag_id_list = []
  udsGroupsStore.udsGroups_dynamic_list = []
  rulesStore.rulesSelectedAddGroup = []
  radio_option.value = 'radio_stanag'
  selectedDataStagna.value = []
  selectedSch.value = []
  userStore.itemsSelectedForm = []
  rulesStore.formData = {}
  initialData.value = null
  titleFormGroup.value = 'New SHC Group'
}
const resetRadioOption = (value:string) =>{
  if(value === 'radio_uds'){
    shcGroupsStore.stanag_id_list = []
    disabledStatus.value = true
    selectedDataStagna.value = []
  }else if(value === 'radio_stanag'){
    udsGroupsStore.udsGroups_dynamic_list = []
    disabledStatus.value = false
    selectedSch.value = []

  }
  if(value !== undefined){
  radio_option.value = value
}
}
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
  
const valueStagna = ref<string[]>([]);
const valueSch = ref<any[]>([]);

const widthMaximise = ref('75%');

const maximiseForm = () => {
  widthMaximise.value = widthMaximise.value === '75%' ? '100%' : '75%';
}

const closeMaximiseForm = () => {
  widthMaximise.value ='75%';
}

const handleHeightTable = ()=>{
  if(widthMaximise.value === '75%'){
    return screenStore.dimanicScreenHeight(590)
  }
  return screenStore.dimanicScreenHeight(462)
}

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
const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  const modalConfirmClose = (values:any) =>{
      const valuesCheck = isEmptyExcludingDates(values)
      if(!valuesCheck){
        showModalClose.value = true
      }else{
        closeForm()
      }
    }
  const handleModalClose = (e:boolean) => {
  if(e){
    closeForm()
    closeMaximiseForm()
    rulesStore.formData = {}
    showModalClose.value = false;
    
  }else{
    showModalClose.value = false;
  }
}

const handleCreateRule = () => {
  rulesStore.menuChange(TAB_SHC_ADD_RULE)
  validEditFormConfigRules(true)
  rulesStore.isEditRule = false
}
onUnmounted(() => {
    rulesStore.removeMinimizeItem('rules_create');
})

function handleLabelMultiselect(option: string,isButton: boolean = false) {
  let label: string = ''
    switch (option) {
        case 'group_uds':
            label = isButton ? `Group uds: ` : `<span class='filter-title'>Group uds: </span>`
            break;
        case 'group_shc':
            label = isButton ? `Group shc: ` : `<span class='filter-title'>Group shc: </span>`
            break;
        case 'user':
            label = isButton ? `User: ` : `<span class='filter-title'>User: </span>`
            break;
    }
    return label
}

const resetFiltersInTable = () => {
  for (const [key, value] of Object.entries(userStore.selectedFilters)) {
    handleFilter('reset', key);
  }

  userStore.resetFilters();
}
const resetFiltersInTableRule = () => {
  
  for (const [key, value] of Object.entries(rulesStore.selectedFilters)) {
    if(key === 'creation_date_start' || key === 'creation_date_end'){
      handleRuleFilter('reset', 'creation_date_criteria');
      continue;
    }
    if(key === 'validity_start_time' || key === 'validity_end_time'){
      handleRuleFilter('reset', 'validity_time');
      continue;
    }
    if(key === 'sensing_start_time' || key === 'sensing_end_time'){
      handleRuleFilter('reset', 'sensing_time');
      continue;
    }
    handleRuleFilter('reset', key);
  }

  rulesStore.resetFilters();
}

const handleFilter = (value:any, type: string) => {
  if(type === 'user_id' && value !== 'reset') {
    user_idCriteria.value = value;
    userStore.selectedFilters['user_id'] = value;
  }
  if(type === 'user_id' && value == 'reset') {
    user_idCriteria.value = '';
    user_idCriteria_temp.value = ''
    value = ''
    userStore.selectedFilters['user_id'] = value;
  }

  if(type === 'status' && value !== 'reset') {
    status_criteria.value = value;
    userStore.selectedFilters['status'] = value;
  }
  if(type === 'status' && value == 'reset') {
    status_criteria.value = '';
    value = ''
    userStore.selectedFilters['status'] = value;
  }

  if(type === 'creation_date_criteria' && value !== 'reset'){
    if(insertion_date_start_Criteria_temp.value != ''){
      insertion_date_start_Criteria.value = insertion_date_start_Criteria_temp.value ? insertion_date_start_Criteria_temp.value : '' ;
      value =  insertion_date_start_Criteria_temp.value ? insertion_date_start_Criteria_temp.value : '' 
      userStore.selectedFilters['creation_date_start'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['creation_date_start'] = '';
    }
    if(insertion_date_end_Criteria_temp.value != ''){
      insertion_date_end_Criteria.value = insertion_date_end_Criteria_temp.value ? insertion_date_end_Criteria_temp.value : '' ;
      value =  insertion_date_end_Criteria_temp.value ? insertion_date_end_Criteria_temp.value : '' 
      userStore.selectedFilters['creation_date_end'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['creation_date_end'] = '';
    }
  }
  if(type === 'creation_date_criteria' && value == 'reset'){
    insertion_date_start_Criteria.value = ''
    insertion_date_start_Criteria_temp.value = ''
    insertion_date_end_Criteria.value = ''
    insertion_date_end_Criteria_temp.value = ''

    userStore.selectedFilters['creation_date_start'] = '';
    userStore.selectedFilters['creation_date_end'] = '';
  }

  if(type === 'creation_date_end' && value == 'reset') {
    userStore.selectedFilters['creation_date_end'] = '';
    insertion_date_end_Criteria.value = ''
    insertion_date_end_Criteria_temp.value = ''
  }

  if(type === 'creation_date_start' && value == 'reset') {
    userStore.selectedFilters['creation_date_start'] = '';
    insertion_date_start_Criteria.value = ''
    insertion_date_start_Criteria_temp.value = ''
  }

  if(type === 'country' && value !== 'reset') {
    value = selectedStanagIdsTemp.value
    userStore.selectedFilters['country'] = value;
  }
  if(type === 'country' && value === 'reset') {
    selectedStanagIdsTemp.value = []
    value = []
    userStore.selectedFilters['country'] = '';
    resetFilters();
  }

  if(type === 'udsGroup' && value !== 'reset') {
    value = selectedUdsGroupIdsTemp.value
    userStore.selectedFilters['udsGroup'] = value;
  }
  if(type === 'udsGroup' && value === 'reset') {
    selectedUdsGroupIdsTemp.value = []
    value = []
    userStore.selectedFilters['udsGroup'] = '';
    resetUdsGroupFilters();
  }

  if(type === 'shcGroup' && value !== 'reset') {
    value = selectedShcGroupIdsTemp.value
    userStore.selectedFilters['shcGroup'] = value;
  }
  if(type === 'shcGroup' && value === 'reset') {
    selectedShcGroupIdsTemp.value = []
    value = []
    userStore.selectedFilters['shcGroup'] = '';
    resetShcGroupFilters();
  }

  if(type === 'missionGroup' && value !== 'reset') {
    value = selectedMissionGroupIdsTemp.value
    userStore.selectedFilters['missionGroup'] = value;
  }
  if(type === 'missionGroup' && value === 'reset') {
    selectedMissionGroupIdsTemp.value = []
    value = []
    userStore.selectedFilters['missionGroup'] = '';
    resetMissionGroupFilters();
  }

  if(type === 'license_expiration_date' && value !== 'reset'){
    if(license_expiration_date_start_Criteria_temp.value != ''){
      license_expiration_date_start_Criteria.value = license_expiration_date_start_Criteria_temp.value ? license_expiration_date_start_Criteria_temp.value : '' ;
      value =  license_expiration_date_start_Criteria_temp.value ? license_expiration_date_start_Criteria_temp.value : '' 
      userStore.selectedFilters['license_expiration_date_start'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['license_expiration_date_start'] = '';
    }
    if(license_expiration_date_end_Criteria_temp.value != ''){
      license_expiration_date_end_Criteria.value = license_expiration_date_end_Criteria_temp.value ? license_expiration_date_end_Criteria_temp.value : '' ;
      value =  license_expiration_date_end_Criteria_temp.value ? license_expiration_date_end_Criteria_temp.value : '' 
      userStore.selectedFilters['license_expiration_date_end'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['license_expiration_date_end'] = '';
    }
  }
  if(type === 'license_expiration_date' && value == 'reset'){
    license_expiration_date_start_Criteria.value = ''
    license_expiration_date_start_Criteria_temp.value = ''
    license_expiration_date_end_Criteria.value = ''
    license_expiration_date_end_Criteria_temp.value = ''

    userStore.selectedFilters['license_expiration_date_start'] = '';
    userStore.selectedFilters['license_expiration_date_end'] = '';
  }

  if(type === 'license_expiration_date_end' && value == 'reset') {
    userStore.selectedFilters['license_expiration_date_end'] = '';
    license_expiration_date_end_Criteria.value = ''
    license_expiration_date_end_Criteria_temp.value = ''
  }

  if(type === 'license_expiration_date_start' && value == 'reset') {
    userStore.selectedFilters['license_expiration_date_start'] = '';
    license_expiration_date_start_Criteria.value = ''
    license_expiration_date_start_Criteria_temp.value = ''
  }

  if(type === 'user_rules' && value !== 'reset') {
    user_rules_Criteria.value = value;
    userStore.selectedFilters['user_rules'] = value;
  }
  if(type === 'user_rules' && value == 'reset') {
    user_rules_Criteria.value = '';
    user_rules_Criteria_temp.value = ''
    value = ''
    userStore.selectedFilters['user_rules'] = value;
  }

}

const handleRuleFilter = (value:any, type: string) => {
  if(type === 'rule_id' && value !== 'reset') {
    id.value = value;
    rulesStore.selectedFilters['rule_id'] = value;
  }
  if(type === 'rule_id' && value == 'reset') {
    id.value = '';
    idTemp.value = ''
    value = ''
    rulesStore.selectedFilters['rule_id'] = value;
  }

  if(type === 'rule_name' && value !== 'reset') {
    rule_name_criteria.value = value;
    rulesStore.selectedFilters['rule_name'] = value;
  }
  if(type === 'rule_name' && value == 'reset') {
    rule_name_criteria.value = '';
    rule_name_criteria_temp.value = '';
    value = '';
    rulesStore.selectedFilters['rule_name'] = value;
  }

  if(type === 'creation_date_criteria' && value !== 'reset'){
    if(creation_date_start_criteria_temp.value != ''){
      creation_date_start_criteria.value = creation_date_start_criteria_temp.value ? creation_date_start_criteria_temp.value : '' ;
      value =  creation_date_start_criteria_temp.value ? creation_date_start_criteria_temp.value : '' 
      rulesStore.selectedFilters['creation_date_start'] = convertFormatFilterShcDate(value.toString());
    }else {
      rulesStore.selectedFilters['creation_date_start'] = '';
    }
    if(creation_date_end_criteria_temp.value != ''){
      creation_date_end_criteria.value = creation_date_end_criteria_temp.value ? creation_date_end_criteria_temp.value : '' ;
      value =  creation_date_end_criteria_temp.value ? creation_date_end_criteria_temp.value : '' 
      rulesStore.selectedFilters['creation_date_end'] = convertFormatFilterShcDate(value.toString());
    }else {
      rulesStore.selectedFilters['creation_date_end'] = '';
    }
  }
  if(type === 'creation_date_start' && value === 'reset'){
    creation_date_start_criteria_temp.value = ''
    creation_date_start_criteria.value = ''
    value =  creation_date_start_criteria_temp.value ? creation_date_start_criteria_temp.value : '' 
    rulesStore.selectedFilters['creation_date_start'] = convertFormatFilterShcDate(value.toString());
  }
  if(type === 'creation_date_end' && value === 'reset'){
    creation_date_end_criteria_temp.value = ''
    creation_date_end_criteria.value = ''
    value =  creation_date_end_criteria_temp.value ? creation_date_end_criteria_temp.value : '' 
    rulesStore.selectedFilters['creation_date_end'] = convertFormatFilterShcDate(value.toString());
  }
  if(type === 'creation_date_criteria' && value == 'reset'){
    creation_date_start_criteria.value = ''
    creation_date_start_criteria_temp.value = ''
    creation_date_end_criteria.value = ''
    creation_date_end_criteria_temp.value = ''
    rulesStore.selectedFilters['creation_date_start'] = '';
    rulesStore.selectedFilters['creation_date_end'] = '';
  }

  if(type === 'mission_id' && value !== 'reset') {
    value = selectedMissionIdsTemp.value
    rulesStore.selectedFilters['mission_id'] = value;
  }
  if(type === 'mission_id' && value === 'reset') {
    selectedMissionIdsTemp.value = []
    value = []
    rulesStore.selectedFilters['mission_id'] = '';
    resetMissionFilters()
  }
  
  if(type === 'acquisition_mode_id' && value !== 'reset') {
    value = selectedAcquisitionModeIdsTemp.value
    rulesStore.selectedFilters['acquisition_mode_id'] = value;
  }
  if(type === 'acquisition_mode_id' && value === 'reset') {
    selectedAcquisitionModeIdsTemp.value = []
    value = []
    rulesStore.selectedFilters['acquisition_mode_id'] = '';
    resetAcquisitionModeFilters()
  }
  
  if(type === 'rule_type' && value !== 'reset') {
    rules_type.value = value;
    rulesStore.selectedFilters['rule_type'] = value;
  }
  if(type === 'rule_type' && value == 'reset') {
    rules_type.value = '';
    value = ''
    rulesStore.selectedFilters['rule_type'] = '';
  }

  if(type === 'validity_time' && value !== 'reset'){
    if(validity_start_time_temp.value != ''){
      validity_start_time.value = validity_start_time_temp.value ? validity_start_time_temp.value : '' ;
      value =  validity_start_time_temp.value ? validity_start_time_temp.value : '' 
      rulesStore.selectedFilters['validity_start_time'] = convertFormatFilterShcDate(value.toString());
    }else {
      rulesStore.selectedFilters['validity_start_time'] = '';
    }
    if(validity_end_time_temp.value != ''){
      validity_end_time.value = validity_end_time_temp.value ? validity_end_time_temp.value : '' ;
      value =  validity_end_time_temp.value ? validity_end_time_temp.value : '' 
      rulesStore.selectedFilters['validity_end_time'] = convertFormatFilterShcDate(value.toString());
    }else {
      rulesStore.selectedFilters['validity_end_time'] = '';
    }
  }
  if(type === 'validity_start_time' && value === 'reset'){
    validity_start_time_temp.value = ''
    validity_start_time.value = ''
    value =  validity_start_time_temp.value ? validity_start_time_temp.value : '' 
    rulesStore.selectedFilters['validity_start_time'] = convertFormatFilterShcDate(value.toString());
  }
  if(type === 'validity_end_time' && value === 'reset'){
    validity_end_time_temp.value = ''
    validity_end_time.value = ''
    value =  validity_end_time_temp.value ? validity_end_time_temp.value : '' 
    rulesStore.selectedFilters['validity_end_time'] = convertFormatFilterShcDate(value.toString());
  }
  if(type === 'validity_time' && value == 'reset'){
    validity_start_time.value = ''
    validity_start_time_temp.value = ''
    validity_end_time.value = ''
    validity_end_time_temp.value = ''
    rulesStore.selectedFilters['validity_start_time'] = '';
    rulesStore.selectedFilters['validity_end_time'] = '';
  }

  if(type === 'sensing_time' && value !== 'reset'){
    if(sensing_start_time_temp.value != ''){
      sensing_start_time.value = sensing_start_time_temp.value ? sensing_start_time_temp.value : '' ;
      value =  sensing_start_time_temp.value ? sensing_start_time_temp.value : '' 
      rulesStore.selectedFilters['sensing_start_time'] = convertFormatFilterShcDate(value.toString());
    }else {
      rulesStore.selectedFilters['sensing_start_time'] = '';
    }
    if(sensing_end_time_temp.value != ''){
      sensing_end_time.value = sensing_end_time_temp.value ? sensing_end_time_temp.value : '' ;
      value =  sensing_end_time_temp.value ? sensing_end_time_temp.value : '' 
      rulesStore.selectedFilters['sensing_end_time'] = convertFormatFilterShcDate(value.toString());
    }else {
      rulesStore.selectedFilters['sensing_end_time'] = '';
    }
  }
  if(type === 'sensing_start_time' && value === 'reset'){
    sensing_start_time_temp.value = ''
    sensing_start_time.value = ''
    value =  sensing_start_time_temp.value ? sensing_start_time_temp.value : '' 
    rulesStore.selectedFilters['sensing_start_time'] = convertFormatFilterShcDate(value.toString());
  }
  if(type === 'sensing_end_time' && value === 'reset'){
    sensing_end_time_temp.value = ''
    sensing_end_time.value = ''
    value =  sensing_end_time_temp.value ? sensing_end_time_temp.value : '' 
    rulesStore.selectedFilters['sensing_end_time'] = convertFormatFilterShcDate(value.toString());
  }

  if(type === 'sensing_time' && value == 'reset'){
    sensing_start_time.value = ''
    sensing_start_time_temp.value = ''
    sensing_end_time.value = ''
    sensing_end_time_temp.value = ''
    rulesStore.selectedFilters['sensing_start_time'] = '';
    rulesStore.selectedFilters['sensing_end_time'] = '';
  }

  if(type === 'status' && value !== 'reset') {
    status.value = value;
    rulesStore.selectedFilters['status'] = value;
  }
  if(type === 'status' && value == 'reset') {
    status.value = '';
    status_temp.value = '';
    value = ''
    rulesStore.selectedFilters['status'] = '';
  }

  if(type === 'comments' && value !== 'reset') {
    comments.value = value;
    rulesStore.selectedFilters['comments'] = value;
  }
  if(type === 'comments' && value == 'reset') {
    comments.value = '';
    comments_temp.value = '';
    value = '';
    rulesStore.selectedFilters['comments'] = value;
  }
}
watch(() => rulesStore.rulesSelectedAddGroup.length, (length) => {
  mapStore.disabledClustersAndPolygons = true
  const options: ViewOptions = {
      centerPosition: 'right',
      zoomLevel: 5
    };
  if (rulesStore.rulesSelectedAddGroup.length > 0) {
    const selectedAreas: IAoiDraw[] = rulesStore.rulesSelectedAddGroup.map(item => ({
        wkt: item.geometry.area_wkt,
        colorType: item.rule_type
      }));
     mapStore.selectAOIdraw(selectedAreas,options);
  } else {
     mapStore.disabledClustersAndPolygons = false
    // mapStore.restoreZoom();
     mapStore.removeVectorLayer()
  }
});

const viewLabelFilter = (option: any,isButton: boolean = false) => {
  const optionKeys = [
        'group_uds',
        'group_shc',
        'udsGroup',
        'shcGroup',
        'user'
    ];
    if (option[0] && !optionKeys.includes(option[0])) {
        let result: any = convertFormatDateAndValidDate(option[1]?.toString())
        result = result?.replace(/,/g, ' , ');

        for (const [key, value] of Object.entries(filterOptionsList)) {
            if (key === option[0]) {
                if (option[0] == 'mission_id' || option[0] == 'acquisition_mode_id') {
                    result = isButton ? `${value}: ${result}` : `<span class='filter-title'>${value}:</span> ${result}`;
                } else {
                    result = isButton ? `${value}: ${option[1] === "prohibitive" ? "blocking" : option[1]}` : `<span class='filter-title'>${value}:</span> ${option[1] === "prohibitive" ? "blocking" : option[1]}`;
                }
                break;
            }
        }
        return result;
    }
    const optionLabel = getDataSelect(option[0])
    if (optionLabel) {
        let labels: any = [];
        option[1].forEach((element: any) => {
            const viewLabel = optionLabel.find(x => x.value == element)
            labels.push(viewLabel?.label)
        });
        const viewLabel = labels.join(' , ')
        let value = handleLabelMultiselectFilter(option[0], isButton) + viewLabel
        return value
    }
    return ''
}

const hasFormDataFilterValues = computed(() => {
    return Object.values(userStore.selectedFilters).some(value => value !== '' && value.length > 0);
});
const hasFormDataFilterRulesValues = computed(() => {
    return Object.values(rulesStore.selectedFilters).some(value => value !== '' && value.length > 0);
});
const calculateValues = () => {
  let primerValor = (offsetValueRules.value === 0) ? 1 : offsetValueRules.value + 1;
  let segundoValor = (serverOptionsRule.value.rowsPerPage !== 10 && offsetValueRules.value === 0)
    ? serverOptionsRule.value.rowsPerPage
    : offsetValueRules.value !== 0
      ? offsetValueRules.value + serverOptionsRule.value.rowsPerPage
      : offsetValueRules.value + 10
  rangePages.value = `${primerValor} - ${segundoValor}`; 
}
const resetPaginationRules = () => {
  offsetValueRules.value = 0
  serverOptionsRule.value.rowsPerPage = 10
  calculateValues()
}
watchEffect(() => {
  pagPropertyRules.value.nextPage = rulesStore.rulesDataCount < serverOptionsRule.value.rowsPerPage
  calculateValues()
});
</script>
<template>
    <ModalConfirm
    :is-modal-open="showModalClose"
    title="Warning"
    message="If you close the window, the rule details you've entered will be lost."
    @open-option="showModalClose = false"
    @click-event="handleModalClose"
    text-confirm="Ok"
  />
  <MenuShcGroup/>
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
    <GroupsReport v-if="exportStore.visibleGroups" :group="'shc'" :data="shcGroupsStore.shcGroupsData?.response" />
  </Teleport>
    <MultiStepForm 
        :index-position="1"
        v-if="userAndGroups.verifyMenu(TAB_FORM_ADD_SHC_GROUP)"
        :Title="titleFormGroup"
        :ObjectStepper="formConfigSHC"
        :content-width="widthMaximise"
        :initial-form-data="initialData ? initialData : null"
        @submit-action="formDataSubmit"
        @submit-edit-action="formDataEditSubmit"
        name-prop="New SHC Group"
        @close-form="modalConfirmClose"
        @maximise-form="maximiseForm"        
    >
    <template #step2>
      <div class="step-separator">
        <QtmTypography classes="font-title-custom-only-font">Select the users you want to add by STANAG code or by UDS group.</QtmTypography>
      </div>
      <div > 
        <qtm-radio-group
            v-bind="{classes:'',defaultValue:'radio_stanag',name:'radioGroupName',size:'medium',value:radio_option}"
            @value-changed="(value:any) => resetRadioOption(value.detail.value)"
          >
          <div style="display: flex;">
            <div style="width: 40%; margin-right: 50px;">
              <div style="display: flex;">
                <qtm-radio-button value="radio_stanag"></qtm-radio-button>
                <QtmTypography classes="text-white-100"> STANAG code</QtmTypography>
              </div>
              
              <div style="margin-top: 5px; margin-left: 30px;">
                  <VueMultiselect
                  class="my-multiselect"
                  v-model="selectedDataStagna"
                  :options="mappedDataStanag"
                  :multiple="true"
                  :close-on-select="false"
                  id="multiselect_stanag_code"
                  label="label" 
                  track-by="value" 
                  :disabled="disabledStatus" 
                  >   
                  </VueMultiselect>
              </div>
              
            </div>
            <div style="width:40%; margin-left: 10px;">
                <div style="display: flex;">
                  <qtm-radio-button value="radio_uds"></qtm-radio-button>
                  <QtmTypography classes="text-white-100"> UDS groups</QtmTypography>
                </div>
        
                <div style="margin-top: 5px; margin-left: 30px;">
                  <VueMultiselect
                  class="my-multiselect"
                  v-model="selectedSch"
                  :options="udsGroupsStore.udsGroupsOptions"
                  :multiple="true"
                  :close-on-select="false"
                  id="multiselect_uds_groups"
                  label="label" 
                  track-by="value"
                  :disabled="!disabledStatus" 
                  >   
                  </VueMultiselect>
                </div>
            </div>    
          </div>
          
            
          </qtm-radio-group>
      </div>
    </template>
   <template #step3>
      <div style="overflow: hidden;">

      <div class="filters-options">
          <template v-for="value in Object.entries(userStore.selectedFilters)" :key="value[0]">
              <qtm-tag size="medium" classes="color-button-status-active style-custom-tag custom-tag"
                  :dismissible="true" v-if="value[1] !== '' && value[1].length > 0"
                  @clicked-tag-button-event="handleFilter('reset', value[0]);">
                  <span v-html="viewLabelFilter(value)"></span>
              </qtm-tag>
          </template>

          <qtm-typography classes="text-bluegrey-100 custom-clear-all style-custom-tag" :font-size="7"
              font-weight="normal" font-family="roboto" v-show="hasFormDataFilterValues"
              @click="() => { resetFiltersInTable(); }">
              Clear All
          </qtm-typography>
      </div>
      
      <QtmTypography classes="font-title-custom-4">Select the users you want to add to the SHC group.</QtmTypography>
      <div style="margin-top:10px; margin-bottom: 15px;">
        <QtmButton
          
          color="inverted"
          variant="filled"
          size="small"
          :label="`${userStore.itemsSelectedForm.length} selected users`"
          classes="text-scale-7 rounded-full bg-bluegrey-600"
          ></QtmButton>
      </div>
    </div>
    
      <EasyDataTable
          :body-row-class-name="(item:Item, rowNumber:number) => bodyRowClassNameFunction(item, rowNumber, isRowExpanded(item.user_id))"
          v-model:items-selected="userStore.itemsSelectedForm"
          :headers="headersUserForm"
          :items="userStore.userData"
          class="table-rule-select-custom-th"
          theme-color="#4c5dff"
          table-class-name="customize-table"
          header-text-direction="left"
          body-text-direction="left"
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :sort-type="sortType"
          multi-sort
          :table-height="handleHeightTable()"
          style="z-index: 140;"
          :rows-items="[10,25, 50, 100]"
          :rows-per-page="10" 
          alternating
          :filter-options="filterOptions"
          font-family="Roboto, sans-serif"
          fixed-checkbox
          :checkbox-column-width="50"
          >
          <template #header-user_id="header">
            <ClickOutSide @clickoutside="filterState.showUser_idFilter = false">
              <div class="filter-column">
                
                <div>
                  {{ header.text }}
                  <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                    classes="text-primary-200 filter-icon"></qtm-icon>
                  <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                    classes="text-primary-200 filter-icon"></qtm-icon>
                  <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                    classes="text-primary-200 filter-icon"></qtm-icon>
                </div>

                <qtm-icon icon="filter_list" :class="`column-filter ${user_idCriteria.length > 0 ? 'column-filtered' : ''}`"
                  size="medium" @click.stop="handleFilterState('showUser_idFilter')"></qtm-icon>

                <div class="filter-menu" v-if="filterState.showUser_idFilter" @click.stop>
                  <QtmTextInput
                    :value="user_idCriteria"
                    @value-changed="(event:any) => user_idCriteria_temp = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop>
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                       @click.stop="handleFilter('reset', 'user_id')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                       @click.stop="handleFilter(user_idCriteria_temp, 'user_id'),filterState.showUser_idFilter = false"
                      >Apply</QtmButton
                    >
                  </div>
                </div>
              </div>

          </ClickoutSide>
          
          </template>
          <template #header-country="header" >
            <ClickOutSide @clickoutside="filterState.showStanag_idFilter = false">
            <div class="filter-column" >
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${selectedStanagIds.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterState('showStanag_idFilter')"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showStanag_idFilter" style="max-height: 300px !important;">                
                  <div @click.stop>
  
                    <QtmTextInput
                      :value="stanagSearchTerm"
                      @value-changed="(event:any) => stanagSearchTerm = event.detail "
                      placeholder="Search"
                      size="small"
                      left-icon="search"
                      @click.stop>
                    </QtmTextInput>
                    <QtmDivider classes="my-m" />
                     <div class="filter-menu-list-checkbox" style="max-height: 80px !important;">
                      <ul v-for="itemsCountry in filteredMappedDataStanag">
                        <li><qtm-checkbox
                                @change="handleStanagIdCheckboxChange(itemsCountry.value)"
                                :value="itemsCountry.value"
                                :checked="selectedStanagIdsTemp.includes(itemsCountry.value? itemsCountry.value : '')"
                                >
                                {{ itemsCountry.label }}
                            </qtm-checkbox></li>
                        
                      </ul>
                     </div>
                     <QtmDivider classes="my-m" />
                     <div class="buttom-div">
                      <QtmButton
                        variant="outline"
                        color="primary"
                        size="small"
                        @click.stop="resetFilters(),handleFilter('reset','country')"
                        >Reset</QtmButton
                      >
                      <QtmButton
                        variant="filled"
                        color="primary"
                        size="small"
                        @click.stop="applyFilters(), handleFilter('','country'),filterState.showStanag_idFilter = false"
                        >Apply</QtmButton
                      >
                     </div>
                    
                  </div>             
              </div>
            </div>
          </ClickOutSide>
          </template>
          <template #header-status="header">
            <ClickOutSide @clickoutside="filterState.showStatus_header = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${status_criteria.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterState('showStatus_header')"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showStatus_header" @click.stop>
                <qtm-dropdown-select
                  size="small"
                  @value-changed="(event:any) => status_criteria_temp = event.detail.valueChanged"
                  @click.stop
                  :value="status_criteria">
                  <template v-for="(optionsSelect, index) in statesUsers" :key="index">
                    <qtm-dropdown-select-option :value="optionsSelect.value">
                      {{ optionsSelect.label }}
                    </qtm-dropdown-select-option>
                  </template>
                </qtm-dropdown-select>
                <QtmDivider classes="my-m" />
                <div class="buttom-div">
                  <QtmButton variant="outline" color="primary" size="small" @click="handleFilter('reset','status')" >Reset</QtmButton>
                  <QtmButton
                    variant="filled"
                    color="primary"
                    size="small"
                    @click.stop="handleFilter(status_criteria_temp, 'status'),filterState.showStatus_header = false"
                    >Apply</QtmButton
                </div>
              </div>
              </div>
            </div>
          </ClickOutSide>
          </template> 
          <template #header-group_uds.group_name="header">
            <ClickOutSide @clickoutside="filterState.udsGroup_header = false">
            <div class="filter-column">
              
              <div @click.stop class="filter-column-no-sort-by-header">
                {{ header.text }}
              </div>

                <qtm-icon icon="filter_list" :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedUdsGroupIds.length > 0 ? 'column-filtered' : ''}`"
                  size="medium" @click.stop="handleFilterState('udsGroup_header')"></qtm-icon>

              <div class="filter-menu" v-if="filterState.udsGroup_header" style="max-height: 300px !important;">
                  
                <div @click.stop>
                    <QtmTextInput
                      :value="udsGroupSearchTerm"
                      @value-changed="(event:any) => udsGroupSearchTerm = event.detail "
                      placeholder="Search"
                      size="small"
                      left-icon="search"
                      @click.stop
                    >
                    </QtmTextInput>
                    <QtmDivider classes="my-m" />
                    <div class="filter-menu-list-checkbox" style="max-height: 80px !important;">
                      <ul v-for="group in filteredMappedDataUdsGroup">
                        <li>
                          <qtm-checkbox
                            @change="
                              handleUdsGroupCheckboxChange(group.id)
                            "
                            :value="group.id"
                            :checked="
                              selectedUdsGroupIdsTemp.includes(
                                group.id ? group.id : ''
                              )
                            "
                          >
                            {{ group.name }}
                          </qtm-checkbox>
                        </li>
                      </ul>
                    </div>
                    <QtmDivider classes="my-m" />
                    <div class="buttom-div">
                      <QtmButton
                        variant="outline"
                        color="primary"
                        size="small"
                        @click.stop="resetUdsGroupFilters(),handleFilter('reset','udsGroup')"
                        >Reset</QtmButton
                      >
                      <QtmButton
                        variant="filled"
                        color="primary"
                        size="small"
                        @click.stop="applyUdsGroupFilters(), handleFilter('','udsGroup'),filterState.udsGroup_header = false"
                        >Apply</QtmButton
                      >
                    </div>
                  </div>

              </div>
            </div>
          </ClickOutSide>
          </template>     
          <template #header-group_shcs="header">
            <ClickOutSide @clickoutside="filterState.group_shcs_header = false">
            <div class="filter-column">
              
              <div @click.stop class="filter-column-no-sort-by-header">
                  {{ header.text }}
                </div>

              <qtm-icon icon="filter_list" :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedShcGroupIds.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterState('group_shcs_header')"></qtm-icon>

              <div class="filter-menu" v-if="filterState.group_shcs_header" style="max-height: 300px !important;">
                
                <div @click.stop>
                  <QtmTextInput
                    :value="shcGroupSearchTerm"
                    @value-changed="(event:any) => shcGroupSearchTerm = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop
                  >
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="filter-menu-list-checkbox" style="max-height: 80px !important;">
                    <ul v-for="group in filteredMappedDataShcGroup">
                      <li>
                        <qtm-checkbox
                          @change="
                            handleShcGroupCheckboxChange(group.id)
                          "
                          :value="group.id"
                          :checked="
                            selectedShcGroupIdsTemp.includes(
                              group.id ? group.id : ''
                            )
                          "
                        >
                          {{ group.name }}
                        </qtm-checkbox>
                      </li>
                    </ul>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="resetShcGroupFilters(),handleFilter('reset','shcGroup'),filterState.group_shcs_header = false"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="applyShcGroupFilters(), handleFilter('','shcGroup'),filterState.group_shcs_header = false"
                      >Apply</QtmButton
                    >
                  </div>
                </div>

              </div>
            </div>
          </ClickOutSide>
          </template>     
          <template #header-missions="header">
            <ClickOutSide @clickoutside="filterState.missions_header = false">
            <div class="filter-column">
              
              <div @click.stop class="filter-column-no-sort-by-header">
                {{ header.text }}
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedMissionGroupIds.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterState('missions_header')"></qtm-icon>

              <div class="filter-menu" v-if="filterState.missions_header" style="max-height: 300px !important;">
                  
                <div @click.stop>
                  <QtmTextInput
                    :value="missionGroupSearchTerm"
                    @value-changed="(event:any) => missionGroupSearchTerm = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop
                  >
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="filter-menu-list-checkbox" style="max-height: 80px !important;">
                    <ul v-for="mission in filteredMappedDataMissionGroup">
                      <li>
                        <qtm-checkbox
                          @change="
                            handleMissionGroupCheckboxChange(mission.id)
                          "
                          :value="mission.id"
                          :checked="
                            selectedMissionGroupIdsTemp.includes(
                              mission.id ? mission.id : ''
                            )
                          "
                        >
                          {{ mission.id }}
                        </qtm-checkbox>
                      </li>
                    </ul>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                       @click.stop="resetMissionGroupFilters(),handleFilter('reset','missionGroup'),filterState.missions_header = false"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="applyMissionGroupFilters(), handleFilter('','missionGroup'),filterState.missions_header = false"
                      >Apply</QtmButton
                    >
                  </div>
                </div>

              </div>
            </div>
          </ClickOutSide>
          </template>              
          <template #header-creation_date="header">
            <ClickOutSide @clickoutside="filterState.insertion_date_date_header = false">
            <div class="filter-column">

              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${((insertion_date_start_Criteria && insertion_date_start_Criteria.toString().length > 0) || (insertion_date_end_Criteria && insertion_date_end_Criteria.toString().length > 0)) ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterState('insertion_date_date_header')"></qtm-icon>

              <div class="filter-menu" style="width: 488px !important" v-if="filterState.insertion_date_date_header">
                
                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">Creation date start</p>
                    <VueDatePicker                    
                      v-model="insertion_date_start_Criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Creation date end</p>
                    <VueDatePicker                   
                      v-model="insertion_date_end_Criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime"
                      >
                    </VueDatePicker>
                  </div>
                </div>

                <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter('reset', 'creation_date_criteria')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter(insertion_date_start_Criteria_temp, 'creation_date_criteria'),filterState.insertion_date_date_header = false"
                      >Apply</QtmButton
                    >
                  </div>

              </div>
            </div>
          </ClickOutSide>
          </template>    
          <template #header-license_expiration_date="header">
            <ClickOutSide @clickoutside="filterState.license_expiration_date_header = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${((license_expiration_date_start_Criteria && license_expiration_date_start_Criteria.toString().length > 0) || (license_expiration_date_end_Criteria && license_expiration_date_end_Criteria.toString().length > 0)) ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterState('license_expiration_date_header')"></qtm-icon>

              <div class="filter-menu" style="width: 438px !important" v-if="filterState.license_expiration_date_header">
                
                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">License expiration date start</p>
                    <VueDatePicker 
                      v-model="license_expiration_date_start_Criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">License expiration date end</p>
                    <VueDatePicker 
                      v-model="license_expiration_date_end_Criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>
                </div>

                
                <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter('reset', 'license_expiration_date')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter(license_expiration_date_start_Criteria_temp, 'license_expiration_date'),filterState.license_expiration_date_header = false"
                      >Apply</QtmButton
                    >
                  </div>
              
              </div>
            </div>
          </ClickOutSide>
          </template>     
          <template #header-user_rules="header">
            <ClickOutSide @clickoutside="filterState.user_rules_header = false">
            <div class="filter-column">

              <div @click.stop class="filter-column-no-sort-by-header">
              {{ header.text }}
            </div>

              <qtm-icon icon="filter_list" :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${user_rules_Criteria.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterState('user_rules_header')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterState.user_rules_header">
                  <QtmTextInput
                    :value="user_rules_Criteria"
                    @value-changed="(event:any) => user_rules_Criteria_temp = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop>
                  </QtmTextInput> 
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter('reset', 'user_rules')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter(user_rules_Criteria_temp, 'user_rules'),filterState.user_rules_header = false"
                      >Apply</QtmButton
                    >
                  </div>
              </div>
            </div>
          </ClickOutSide>
          </template> 
          <template #item-user_id="item">
               <div style="display: flex; align-items: center;">
               
                  <qtm-tooltip size="small" orientation="right" tip-position="end" :content="`Added on ${convertFormatDate( item.creation_date)}.`">
                  <div  style="display: absolute; width: 10px; height: 10px; border-radius: 50%; background-color: #57FC53; margin-right: 10px;  margin-left: -5px;"></div>
                </qtm-tooltip>
                <QtmIcon 
                :icon="isRowExpanded(item.user_id) ? 'expand_less' : 'expand_more'"
                  size="medium"
                  style="cursor: pointer;"
                  variant="outlined"
                  @click="toggleRowExpansion(item.user_id)">
                </QtmIcon>
               <span style="margin-left: 3px;">{{item.user_id}} </span>
               </div>
          </template>
          <template #item-status="item">
            <div>
              <qtm-tag
                              :label="capitalizeFirstLetter(item?.status)"
                              size="small"
                              :classes="colorButtonClass(item?.status)"
                              :dismissible="false">
                            </qtm-tag>
            </div>
          </template>
          <template #item-creation_date="items">
               <div >
                    <p>{{ convertFormatDate( items.creation_date) }}</p>
               </div>
          </template>
          <template #item-user_rules="items">
            <div>
                <ul v-if="expandedRows.includes(items.user_id)">
                  <li v-for="(rule, index) in items.rule_set" :key="rule.rule_id">
                    <div style="display: flex; gap: 10px; margin-bottom: 7px;">
                      <qtm-tooltip :content="items.rule_set[0].rule_name">
                      <qtm-tag
                        class="width-custom-tag"
                        :label="validateLargeText(rule.rule_name,11)"
                        size="small"
                        :classes="`${colorTagClass(rule?.rule_type)}`"
                        :dismissible="false">
                      </qtm-tag>
                    </qtm-tooltip>
                      <qtm-tag
                        size="small"
                        classes="color-tag-custom-status"
                        :dismissible="false">
                        <qtm-icon :icon="iconTagClass(rule?.status)" variant="outlined" size="small"></qtm-icon>
                        <qtm-typography classes="text-scale-8">{{ capitalizeFirstLetter(rule?.status) }}</qtm-typography>
                      </qtm-tag>
                    </div>
                  </li>
                </ul>
                <div v-else>
                  <div v-if="items.rule_set.length > 0">
                    <div style="display: flex; gap: 10px;">
                      <qtm-tooltip :content="items.rule_set[0].rule_name">

                        <qtm-tag
                          class="width-custom-tag"
                          :label="validateLargeText(items.rule_set[0].rule_name,11)"
                          size="small"
                          :classes="`${colorTagClass(items.rule_set[0]?.rule_type)}`"
                          :dismissible="false"
                          
                          >
                        </qtm-tag>
                      </qtm-tooltip>
                      <qtm-tag
                        size="small"
                        classes="color-tag-custom-status"
                        :dismissible="false">
                        <qtm-icon :icon="iconTagClass(items.rule_set[0]?.status)" variant="outlined" size="small"></qtm-icon>
                        <qtm-typography classes="text-scale-8">{{ capitalizeFirstLetter(items.rule_set[0]?.status) }}</qtm-typography>
                      </qtm-tag>
                    
                    </div>
                  </div>
                </div>
            </div>
          </template>
          <template #item-user_rules_custom="items">
                <ul>
                  <li v-for="(rule, index) in items.user_rules" :key="rule.id">
                    <div style="margin-bottom: 3px;"  v-if="index === 0">
                      <qtm-button classes="rounded-full" variant="filled" size="small" color="success">{{capitalizeFirstLetter(rule?.status)}} </qtm-button>
                    </div>
                  </li>
                  <li v-for="(rule, index) in items.user_rules" :key="rule.id" >
                          <div style="display: flex; gap: 5px; margin-top: 10px;" v-if="isExpanded(items.user_rules, index)">
                            <qtm-button classes="rounded-full" variant="filled" size="small" :color="colorButton(rule?.status)">{{capitalizeFirstLetter(rule?.status)}} </qtm-button>
                  </div>
                  </li>
                </ul>
          </template>
          <template #item-missions="items">
            <div v-html="getValuesAndIdsExpanded(items.missions, 'id', isRowExpanded(items.user_id))"></div>
               <!-- <div >
                    <p>{{ getValuesAndIds(items.missions,'mission_id') }}</p>
               </div> -->
               
          </template>
          <template #item-schedule_acquisition="items">
            <div style="display: flex;">
              <qtm-checkbox checked></qtm-checkbox>
               <p>Allowed</p>
            </div>
               
          </template>
          <template #item-accessCatalogue="items">
               <div style="display:flex; justify-content: space-between;">
                <div style="display: flex;">
                  <qtm-checkbox > </qtm-checkbox>
                    <p>Allowed</p>
                </div>
                    <qtm-icon size="medium" icon="more_vert"></qtm-icon>
               </div>
               
          </template>
          <template #item-group_shcs="items">
            <div v-html="getValuesAndIdsExpanded(items.group_shcs, 'group_name', isRowExpanded(items.user_id))"></div>
               <!-- <div >
                    {{ getValuesAndIdsExpanded(items.group_shcs,'group_name',) }}
               </div> -->
          </template>
          <template #item-license_expiration_date="items">
               <div >
                    <p>{{ convertFormatDate( items.license_expiration_date) }}</p>
               </div>
          </template>
          <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
            <div style="margin-right: 10px;">
              {{ rangePagesUser }}
            </div>
          <QtmIcon icon="chevron_left" size="medium"
          :classes="'icon-left-right ' + ( pagProperty.lastPage ? 'cursor-disabled' : 'cursor-pointer')"

              @click=" !pagProperty.lastPage  ? loadFromServer(-serverOptions.rowsPerPage) : ''"></QtmIcon>
            <QtmIcon icon="chevron_right" size="medium"
            :classes="'icon-left-right ' + ((pagProperty.nextPage ) ? 'cursor-disabled' : 'cursor-pointer')"

              @click=" !pagProperty.nextPage ? loadFromServer(serverOptions.rowsPerPage) : ''"></QtmIcon>
          </template>
    </EasyDataTable>
    
    
   </template>
   <template #step4>
    <div style="overflow: hidden;">
      <div class="filters-options">
       
          <template v-for="value in Object.entries(rulesStore.selectedFilters)" :key="value[0]">
              <qtm-tag size="medium" classes="color-button-status-active style-custom-tag custom-tag"
                  :dismissible="true" v-if="value[1] !== '' && value[1].length > 0"
                  @clicked-tag-button-event="handleRuleFilter('reset', value[0]);">
                  <span v-html="viewLabelFilter(value)"></span>
              </qtm-tag>
          </template>

          <qtm-typography classes="text-bluegrey-100 custom-clear-all style-custom-tag" :font-size="7"
              font-weight="normal" font-family="roboto" v-show="hasFormDataFilterRulesValues"
              @click="() => { resetFiltersInTableRule(); }">
              Clear All
          </qtm-typography>
      </div>
      <QtmTypography classes="font-title-custom-4">Select the rules you want to apply to the SHC group.</QtmTypography>
      <div style="margin-top:1px; display: flex; justify-content: space-between; margin-bottom: 7px">
        <QtmButton
          color="inverted"
          variant="filled"
          size="small"
          :label="`${rulesStore.rulesSelectedAddGroup.length} selected rules`"
          classes="text-scale-7 rounded-full bg-bluegrey-600"
          ></QtmButton>
          <qtm-button 
            label="Create new rule" 
            left-icon="add"           
            :disabled="rulesStore.disableFormRule" 
            size="medium" 
            style="position: relative; top: -8px"
            @click-event="handleCreateRule">
          </qtm-button>
      </div>
    </div>
    <EasyDataTable
          :body-row-class-name="bodyRowClassNameFunction"
          v-model:items-selected="rulesStore.rulesSelectedAddGroup"
          :headers="headersRules"
          :items="rulesStore.rulesData"
          class="table-rule-select-custom-th"
          theme-color="#4c5dff"
          table-class-name="customize-table"
          header-text-direction="left"
          body-text-direction="left"
          :filter-options="filterOptionsRules"
          :sort-type="sortType"
          multi-sort
          :table-height="handleHeightTable()"
          style="z-index: 140;"
          :rows-items="[10,25, 50, 100, 250, 500]"
          :rows-per-page="10"
          :server-items-length="serverItemsLength"
          alternating
          v-model:server-options="serverOptionsRule"
          font-family="Roboto, sans-serif"
          >
          <template #header-rule_id="header">
          <ClickOutSide @clickoutside="filterState.showFilter_id = false">
            <div class="filter-column">

              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${id.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_id', event)"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showFilter_id" @click.stop>
               
                <QtmTextInput
                    :value="id"
                    @value-changed="(event:any) => idTemp = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop>
                  </QtmTextInput>

                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter('reset', 'rule_id')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter(idTemp, 'rule_id'),filterState.showFilter_id = false"
                      >Apply</QtmButton
                    >
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-rule_name="header">
          <ClickOutSide @clickoutside="filterState.showFilter_rule_name = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${rule_name_criteria.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_rule_name', event)"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showFilter_rule_name" @click.stop>
                <QtmTextInput
                    :value="rule_name_criteria"
                    @value-changed="(event:any) => rule_name_criteria_temp = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop>
                </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter('reset', 'rule_name')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter(rule_name_criteria_temp, 'rule_name'),filterState.showFilter_rule_name = false"
                      >Apply</QtmButton
                    >
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-creation_date="header">
          <ClickOutSide @clickoutside="filterState.showFilter_creation_date = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${((creation_date_start_criteria_temp && creation_date_start_criteria_temp.toString().length > 0) || (creation_date_end_criteria_temp && creation_date_end_criteria_temp.toString().length > 0)) ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_creation_date', event)"></qtm-icon>

              <div class="filter-menu" style="width: 530px !important" v-if="filterState.showFilter_creation_date">
                
                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">Creation date start</p>
                    <VueDatePicker 
                      v-model="creation_date_start_criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Creation date end</p>
                    <VueDatePicker 
                      v-model="creation_date_end_criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>
                </div>

                <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter('reset', 'creation_date_criteria')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter(creation_date_start_criteria_temp, 'creation_date_criteria'),filterState.showFilter_creation_date = false"
                      >Apply</QtmButton
                    >
                  </div>

              </div>
            </div>
          </ClickOutSide>
        
        </template>
        <template #header-mission_id="header">
          <ClickOutSide @clickoutside="filterState.showFilter_mission_sensor = false">
            <div class="filter-column">
              
              <div @click.stop class="filter-column-no-sort-by-header">
                {{ header.text }}
                <!-- <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon> -->
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedMissionIds.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_mission_sensor', event)"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showFilter_mission_sensor" style="max-height: 300px !important;">
                
                <div @click.stop>
                  <QtmTextInput
                    :value="missionSearchTerm"
                    @value-changed="(event:any) => missionSearchTerm = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop
                  >
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="filter-menu-list-checkbox" style="max-height: 80px !important;">
                    <ul v-for="mission in filteredMappedDataMissionGroup">
                      <li>
                        <qtm-checkbox
                          @change="
                            handleMissionCheckboxChange(mission.id)
                          "
                          :value="mission.id"
                          :checked="
                            selectedMissionIdsTemp.includes(
                              mission.id ? mission.id : ''
                            )
                          "
                        >
                          {{ mission.id }}
                        </qtm-checkbox>
                      </li>
                    </ul>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="resetMissionFilters(), handleRuleFilter('reset','mission_id')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="applyMissionFilters(), handleRuleFilter('','mission_id'), filterState.showFilter_mission_sensor = false"
                      >Apply</QtmButton
                    >
                  </div>
                </div>

              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-acquisition_mode_id="header">
          <ClickOutSide @clickoutside="filterState.showFilter_acquisition_mode = false">
            <div class="filter-column">
              
              <div @click.stop class="filter-column-no-sort-by-header">
                {{ header.text }}
                <!-- <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon> -->
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedAcquisitionModeIds.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_acquisition_mode', event)"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showFilter_acquisition_mode" @click.stop style="max-height: 300px !important;">
                
                <div @click.stop>
                  <QtmTextInput
                    :value="acquisitionModeSearchTerm"
                    @value-changed="(event:any) => acquisitionModeSearchTerm = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop
                  >
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />

                  <div class="filter-menu-list-checkbox" style="max-height: 80px !important;">
                    <ul v-for="mode in filteredMappedDataAcquisitionMode">
                      <li>
                        <qtm-checkbox
                          @change="
                            handleAcquisitionModeCheckboxChange(mode.value)
                          "
                          :value="mode.value"
                          :checked="
                            selectedAcquisitionModeIdsTemp.includes(
                              mode.value ? mode.value : ''
                            )
                          "
                        >
                          {{ mode.label }}
                        </qtm-checkbox>
                      </li>
                    </ul>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="resetAcquisitionModeFilters(),handleRuleFilter('reset','acquisition_mode_id')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="applyAcquisitionModeFilters(), handleRuleFilter('','acquisition_mode_id'),filterState.showFilter_acquisition_mode = false"
                      >Apply</QtmButton
                    >
                  </div>
                </div>

              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-rule_type="header">
          <ClickOutSide @clickoutside="filterState.showFilter_rules_type = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${rules_type.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_rules_type', event)"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showFilter_rules_type" @click.stop>
                
                <qtm-dropdown-select
                    size="small"
                    @value-changed="(event:any) => rules_type_temp = event.detail.valueChanged "
                    :value="rules_type">
                    <template v-for="(optionsSelect, index) in ruleTypeList" :key="index">
                      <qtm-dropdown-select-option :value="optionsSelect.value">
                        {{ optionsSelect.label }}
                      </qtm-dropdown-select-option>
                    </template>
                  </qtm-dropdown-select>

                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton variant="outline" color="primary" size="small" @click="handleRuleFilter('reset','rule_type')" >Reset</QtmButton>
                    <QtmButton
                    variant="filled"
                    color="primary"
                    size="small"
                    @click.stop="handleRuleFilter(rules_type_temp, 'rule_type'),filterState.showFilter_rules_type = false"
                    >Apply</QtmButton
                  >
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-users="header">
          <ClickOutSide @clickoutside="filterState.showFilter_users = false">
            <div class="filter-column">
              <qtm-icon icon="filter_list" size="medium" @click.stop="(event:any) => handleFilterState('showFilter_users', event)"></qtm-icon>
              {{ header.text }}
              <div class="filter-menu" v-if="filterState.showFilter_users" @click.stop>
                <input v-model="users" />
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-status="header">
          <ClickOutSide @clickoutside="filterState.showFilter_status = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${status.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_status', event)"></qtm-icon>

              <div class="filter-menu" v-if="filterState.showFilter_status" @click.stop>
                
                <qtm-dropdown-select
                  size="small"
                  @value-changed="(event:any) => status_temp = event.detail.valueChanged"
                  :value="status">
                  <template v-for="(optionsSelect, index) in states" :key="index">
                    <qtm-dropdown-select-option :value="optionsSelect.value">
                      {{ optionsSelect.label }}
                    </qtm-dropdown-select-option>
                  </template>
                </qtm-dropdown-select>
                <QtmDivider classes="my-m" />
                <div class="buttom-div">
                    <QtmButton variant="outline" color="primary" size="small" @click="handleRuleFilter('reset','status')" >Reset</QtmButton>
                    <QtmButton
                    variant="filled"
                    color="primary"
                    size="small"
                    @click.stop="handleRuleFilter(status_temp, 'status'),filterState.showFilter_status = false"
                    >Apply</QtmButton
                  >
                  </div>

              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-validity_time = "header">
          <ClickOutSide @clickoutside="filterState.showFilter_validity_time = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${((validity_start_time_temp && validity_start_time_temp.toString().length > 0) || (validity_end_time_temp && validity_end_time_temp.toString().length > 0)) ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_validity_time', event)"></qtm-icon>

              <div class="filter-menu" style="width: 440px !important" v-if="filterState.showFilter_validity_time">

                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">Validity start time</p>
                    <VueDatePicker 
                      class="date-picker-input-custom" 
                      v-model="validity_start_time_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Validity end time</p>
                    <VueDatePicker 
                      class="date-picker-input-custom" 
                      v-model="validity_end_time_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>
                </div>

                <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter('reset', 'validity_time')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter(validity_start_time_temp, 'validity_time'),filterState.showFilter_validity_time = false"
                      >Apply</QtmButton
                    >
                  </div>

              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-sensing_time ="header">
          <ClickOutSide @clickoutside="filterState.showFilter_sensing_time = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${((sensing_start_time_temp && sensing_start_time_temp.toString().length > 0) || (sensing_end_time_temp && sensing_end_time_temp.toString().length > 0)) ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_sensing_time', event)"></qtm-icon>

              <div class="filter-menu" style="width: 450px !important" v-if="filterState.showFilter_sensing_time">

                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">Sensing start time</p>
                    <VueDatePicker 
                      v-model="sensing_start_time_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Sensing end time</p>
                    <VueDatePicker 
                      v-model="sensing_end_time_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>
                </div>

                <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter('reset', 'sensing_time')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter(sensing_start_time_temp, 'sensing_time'),filterState.showFilter_sensing_time = false"
                      >Apply</QtmButton
                    >
                  </div>

              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-comments="header">
          <ClickOutSide @clickoutside="filterState.showFilter_comments = false">
            <div class="filter-column">
              
              <div>
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
              </div>

              <qtm-icon icon="filter_list" :class="`column-filter ${comments.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="(event:any) => handleFilterState('showFilter_comments', event)"></qtm-icon>

              <div class="filter-menu" style="width: 224px !important; position: absolute; right: 0" v-if="filterState.showFilter_comments" @click.stop>
                
                <QtmTextInput
                    :value="comments"
                    @value-changed="(event:any) => comments_temp = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop>
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter('reset', 'comments')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleRuleFilter(comments_temp, 'comments'),filterState.showFilter_comments = false"
                      >Apply</QtmButton
                    >
                </div>
              </div>
            </div>
          </ClickOutSide>
        </template>

          <template #item-rule_name="item">
            <div>
              <QtmTooltip
              :content="item.rule_name"
              orientation="right"
              :position="'top'"
              :trigger="'hover'"
              :classes="'tooltip-custom'">
              <QtmTypography classes="style-text-row-table" style="white-space: nowrap;"> {{ validateLargeText(item.rule_name,10) }}</QtmTypography>
            </QtmTooltip>
              
            </div>
        </template>
        <template #item-creation_date="item">
          <div >
            <QtmTypography classes="style-text-row-table">{{  convertFormatDate( item.creation_date) }}</QtmTypography>
          </div>
        </template>
        <template #item-mission_id="item">
          <div>
          <QtmTypography classes="style-text-row-table">{{ getValuesAndIds(item.missions, 'id') }}</QtmTypography>
        </div>

        </template>
        <template #item-acquisition_mode="item">
          <div >
            <QtmTypography classes="style-text-row-table">{{ item.acquisition_mode }}</QtmTypography>
          </div>
        </template>
        <template #item-rule_type="item">
          <div>
            <qtm-tag
                        :label=" capitalizeFirstLetter(item.rule_type === 'prohibitive'?'blocking':item.rule_type)"
                        size="small"
                        :classes="`${colorTagClass(item?.rule_type)}`"
                        :dismissible="false">
                      </qtm-tag>
          </div>
        </template>
        <template #item-acquisition_mode_id="item">
          <div>
            <QtmTypography classes="style-text-row-table">{{ getValuesAndIds(item.acq_modes, 'id') }}</QtmTypography>
          </div>
        </template>
        <template #item-sensing_time="item">
        <div style=" gap: 2px;">
          <QtmTypography classes="style-text-row-table">Start: {{ convertFormatDate( item.sensing_start_time) }}</QtmTypography>
          <QtmTypography classes="style-text-row-table">End: {{ convertFormatDate( item.sensing_end_time) }}</QtmTypography>
          </div>
        </template>
        <template #item-validity_time="item">
          <div style="gap: 2px;">
            <QtmTypography classes="style-text-row-table">Start: {{ convertFormatDate( item.validity_start_time) }}</QtmTypography>
           
            <QtmTypography classes="style-text-row-table">End: {{ convertFormatDate( item.validity_end_time) }}</QtmTypography>
          </div>
        </template>
        <template #item-status="item">
            <div>
              <qtm-tag
                              :label="capitalizeFirstLetter(item?.status)"
                              size="small"
                              :classes="colorButtonClass(item?.status)"
                              :dismissible="false">
                            </qtm-tag>
              
            </div>
        </template>
        <template #item-users="item">
          <div >
            <p>{{ getValuesAndIds(item.users,'username') }}</p>
          </div>
        </template>
        <template #item-comments="item">
          <div style="display: flex; justify-content: space-between;">
           
            
            <QtmTooltip
              :content="item.comments"
              orientation="left"
              :position="'top'"
              :trigger="'hover'"
              
              :classes="'tooltip-custom'">
              <QtmTypography classes="style-text-row-table" style="white-space: nowrap;"> {{ validateLargeText(item.comments,10) }}</QtmTypography>
            </QtmTooltip>
          </div>

        </template>
        <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
        <div style="margin-right: 10px;">
          {{ rangePages }}
        </div>
        <QtmIcon icon="chevron_left" size="medium"
          :classes="'icon-left-right ' + (pagPropertyRules.lastPage ? 'cursor-disabled' : 'cursor-pointer')"
          @click=" !pagPropertyRules.lastPage ? loadFromServerRules(-serverOptionsRule.rowsPerPage) : ''">
        </QtmIcon>
        
        <QtmIcon icon="chevron_right" size="medium"
          :classes="'icon-left-right ' + ((pagPropertyRules.nextPage) ? 'cursor-disabled' : 'cursor-pointer')"
          @click=" !pagPropertyRules.nextPage ? loadFromServerRules(serverOptionsRule.rowsPerPage) : ''">
        </QtmIcon>
      </template>
    </EasyDataTable>
   </template>
    </MultiStepForm>
    
      <template v-if="rulesStore.verifyMenu(TAB_SHC_ADD_RULE)">
          <RulesCreate :show="rulesStore.verifyMenu(TAB_SHC_ADD_RULE)" :index-position="2" />
      </template>
  <div
    class="containerUser"
    :style="{ 'background-color': userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS) ? 'transparent' : '#1c1d26'}"
    >
    <div class="content">
      <div style="display: flex; justify-content: space-between;" v-if="userAndGroups.showFormAddShcGroup()">
        <div  style="margin-left: 23px; margin-top: 10px; margin-bottom: 15px; margin-top: 20px">
              <qtm-typography :classes="'subtitle-custom-font'">{{userAndGroups.labelUserAndGroup()}}</qtm-typography>
      </div>
      <div class="button-export-user-and-groups">
        <qtm-button 
          v-if="true"
          size="medium"
          left-icon="download"
          classes="text-scale-7 bg-bluegrey-700"
          :props="{
            id:'exportShcGroupButton'
          }"
          @click-event="userAndGroups.handleShowModalExportUserAndGroup()">
          Export {{userAndGroups.labelUserAndGroup()}}
        </qtm-button>
      </div>
      </div>
      <div class="user-table-container">
        <ShcGroupsDetails v-if="userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_SHC)"/>
        <ShcGroupsTable v-if="!userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_SHC) && !userAndGroups.verifyMenu(TAB_FORM_ADD_SHC_GROUP)" @update-group="(e) => updateGroupShc(e)"/>
      </div>

    </div>
  </div>
</template>

<style scoped>
.column-filtered {
  background: #4c5dff !important;
}

.filters-options {
    width: 100%;
    min-width: 100%;
    min-height: 42px;
    margin-top: 10px;
    overflow-x: scroll;
    display: flex;
    gap: 10px;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #3b3d50 #1c1d26;
}

.column-filter {
  text-align: center !important;
  display: flex !important;
  margin-right: -8px !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 2px;
  margin-top: -4px;
  width: 26px !important;
  height: 26px !important;
}

.filter-icon {
  position: absolute !important;
  right: 33px !important;
  font-size: 18px !important;
}
</style>
