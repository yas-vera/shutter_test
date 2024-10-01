import {
  convertFormatDate,
  convertFormatFilterDate,
} from "@/helpers/convertDateTime";
import {
  caseInsensitiveIncludes,
  caseInsensitiveIncludesArray,
  caseInsensitiveStateIncludes,
  dateComparisonFunction,
  caseInsensitiveIncludesObject,
} from "@/helpers/tableHelpers";
import useStanagCodes from "@/hooks/common/useStanagCodes";
import type { response } from "@/interfaces/IResponse";
import { useGroupStore } from "@/stores/groupStore";
import { useUserStore } from "@/stores/userStore";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import type { FilterOption, ServerOptions } from "vue3-easy-data-table";
import type { FilteredItem } from "../../interfaces/Iuser";
import useUsdGroups from "./useUsdGroups";
import useShcGroups from "./useShcGroups";
import useMissionsGroups from "./useMissionsGroups";
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import { TAB_FORM_ADD_SHC_GROUP, TAB_UDS_GROUPS_DETAILS_SHC } from "@/constants/constants";
import { useRoute } from "vue-router";
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import { useSatDataStore } from "@/stores/satDataStore";

export default function useUserTable() {
  const {
    selectedStanagIdsTemp,
    stanagSearchTerm,
    mappedDataStanag,
    handleStanagIdCheckboxChange,
    resetFilters,
    applyFilters,
    selectedStanagIds,
    filteredMappedDataStanag,
    mappedDataStanagCountrys,
  } = useStanagCodes();
  const {
    udsGroupSearchTerm,
    handleUdsGroupCheckboxChange,
    filteredMappedDataUdsGroup,
    selectedUdsGroupIdsTemp,
    selectedUdsGroupIds,
    resetUdsGroupFilters,
    applyUdsGroupFilters
  } = useUsdGroups();
  const {
    selectedShcGroupIdsTemp,
    selectedShcGroupIds,
    shcGroupSearchTerm,
    handleShcGroupCheckboxChange,
    filteredMappedDataShcGroup,
    applyShcGroupFilters,
    resetShcGroupFilters,
  } = useShcGroups();
  const {
    selectedMissionGroupIdsTemp,
    selectedMissionGroupIds,
    missionGroupSearchTerm,
    handleMissionGroupCheckboxChange,
    filteredMappedDataMissionGroup,
    applyMissionGroupFilters,
    resetMissionGroupFilters,
  } = useMissionsGroups();
  const userStore = useUserStore();
  const groupStore = useGroupStore();
  const shcGroupStore = useShcGroupsStore()
  const udsGroupStore = useUdsGroupsStore()
  const userAndGroups = useUserAndGroupStore()

  const satDataStore = useSatDataStore();

  const udsGroupsData = ref<response>();
  const missionsData = ref<any[]>();
  const shcGroupsData = ref<response>();
  const expandedRows = ref<number[]>([]);
  const stanag_idCriteria = ref<string>("");
  const status_criteria = ref("");
  const status_criteria_temp = ref("");
  const user_idCriteria = ref("");
  const user_idCriteria_temp = ref("");
  const udsGroup_Criteria = ref("");
  const group_shcs_Criteria = ref("");
  const missions_Criteria = ref("");
  const license_expiration_date_start_Criteria = ref<any>("");
  const license_expiration_date_end_Criteria = ref<any>("");
  const license_expiration_date_start_Criteria_temp = ref<any>("");
  const license_expiration_date_end_Criteria_temp = ref<any>("");
  const insertion_date_start_Criteria = ref<any>("");
  const insertion_date_end_Criteria = ref<any>("");
  const insertion_date_start_Criteria_temp = ref<any>("");
  const insertion_date_end_Criteria_temp = ref<any>("");
  const user_rules_Criteria = ref("");
  const user_rules_Criteria_temp = ref("");
  const ageCriteria = ref<[number, number]>([1, 15]);
  const route = useRoute();
  //pagination
  const serverItemsLength = ref(0);
  const offsetValue = ref(0)
  const elementPosition = ref<any>({
    x: 0,
    y: 0
  })
  const serverOptions = ref<ServerOptions>({
    page: 1,
    rowsPerPage: userStore.selectedRowForPageDefault,
    sortBy: 'user_id',
    sortType: 'desc',
  });
  let previousRowsPerPage = ref<number>(serverOptions.value.rowsPerPage);
  const rangePagesUser = ref<string>('')
  const pagProperty = ref({
    nextPage:false,
    lastPage:false
  })
  const filterOptions = computed((): FilterOption[] => {
    const filterOptionsArray: FilterOption[] = [];

    if (user_idCriteria.value !== "") {
      filterOptionsArray.push({
        field: "user_id",
        criteria: user_idCriteria.value,
        comparison: () => true,
      });
    }
    const stanagCriteria =
      stanag_idCriteria.value !== ""
        ? stanag_idCriteria.value
        : selectedStanagIds.value;
    if (typeof stanagCriteria === "string") {
      filterOptionsArray.push({
        field: "stanag",
        criteria: stanagCriteria,
        comparison: () => true,
      });
    } else if (Array.isArray(stanagCriteria)) {
      if (stanagCriteria.length > 0) {
        filterOptionsArray.push({
          field: "stanag",
          comparison: "in",
          criteria: stanagCriteria,
        });
      }
    }
    const udsGroup =
      udsGroup_Criteria.value !== ""
        ? udsGroup_Criteria.value
        : selectedUdsGroupIds.value;
    if (typeof udsGroup === "string") {
      filterOptionsArray.push({
        field: "group_uds_id",
        criteria: udsGroup,
        comparison: () => true,
      });
    } else if (Array.isArray(udsGroup)) {
      if (udsGroup.length > 0) {
        filterOptionsArray.push({
          field: "group_uds_id",
          comparison: "in",
          criteria: udsGroup,
        });
      }
    }

    const shcGroup =
      group_shcs_Criteria.value !== ""
        ? group_shcs_Criteria.value
        : selectedShcGroupIds.value;
    if (typeof shcGroup === "string") {
      filterOptionsArray.push({
        field: "group_shc_id",
        criteria: shcGroup,
        comparison: () => true,
      });
    } else if (Array.isArray(shcGroup)) {
      if (shcGroup.length > 0) {
        filterOptionsArray.push({
          field: "group_shc_id",
          comparison: "in",
          criteria: shcGroup,
        });
      }
    }

    const missions =
      missions_Criteria.value !== ""
        ? missions_Criteria.value
        : selectedMissionGroupIds.value;
    if (typeof missions === "string") {
      filterOptionsArray.push({
        field: "mission_id",
        criteria: missions,
        comparison: () => true,
      });
    } else if (Array.isArray(missions)) {
      if (missions.length > 0) {
        filterOptionsArray.push({
          field: "mission",
          comparison: "in",
          criteria: missions,
        });
      }
    }

    filterOptionsArray.push({
      field: "status",
      criteria: status_criteria.value,
      comparison: caseInsensitiveStateIncludes,
    });

    if (
      license_expiration_date_start_Criteria.value !== "" &&
      license_expiration_date_start_Criteria.value !== null
    ) {
      const creationDate = new Date(license_expiration_date_start_Criteria.value);
      const criteriaDateString = creationDate.toISOString().substring(0, 10);

      filterOptionsArray.push({
        field: "license_expiration_date_start",
        comparison: () => true,
        criteria: convertFormatFilterDate(criteriaDateString),
      });
    }
    if (
      license_expiration_date_end_Criteria.value !== "" &&
      license_expiration_date_end_Criteria.value !== null
    ) {
      const creationDate = new Date(license_expiration_date_end_Criteria.value);
      const criteriaDateString = creationDate.toISOString().substring(0, 10);

      filterOptionsArray.push({
        field: "license_expiration_date_end",
        comparison: () => true,
        criteria: convertFormatFilterDate(criteriaDateString),
      });
    }
    if (
      insertion_date_start_Criteria.value !== "" &&
      insertion_date_start_Criteria.value !== null
    ) {
      const creationDate = new Date(insertion_date_start_Criteria.value);
      const criteriaDateString = creationDate.toISOString();

      filterOptionsArray.push({
        field: "creation_date_start",
        comparison: () => true,
        criteria: convertFormatFilterDate(criteriaDateString),
      });
    }

    if (
      insertion_date_end_Criteria.value !== "" &&
      insertion_date_end_Criteria.value !== null
    ) {
      const creationDate = new Date(insertion_date_end_Criteria.value);
      const criteriaDateString = creationDate.toISOString();

      filterOptionsArray.push({
        field: "creation_date_end",
        comparison: () => true,
        criteria: convertFormatFilterDate(criteriaDateString),
      });
    }

    filterOptionsArray.push({
      field: "user_rules",
      criteria: user_rules_Criteria.value,
      comparison: () => true,
    });
    return filterOptionsArray;
  });
  const getDataSelect = (field: string) => {
    if (field == 'group_uds' || field == 'udsGroup') {
        let data = udsGroupStore.udsSelectGroupsData?.response
        return data?.map((item) => {
            return {
                label: item.name,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    if (field == 'group_shc' || field == 'shcGroup') {
        let data = shcGroupStore.shcSelectGroupsData?.response
        return data?.map((item) => {
            return {
                label: item.name,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    if (field == 'user') {
        let data = userStore.userSelectData
        return data?.map((item) => {
            return {
                label: item.name,
                value: item.name,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    if (field == 'mission_id') {
        let data = satDataStore.missionData
        return data?.map((item) => {
            return {
                label: item.id,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    if (field == 'acquisition_mode_id') {
        let data = satDataStore.acquisitionModeData
        return data?.map((item) => {
            return {
                label: item.id,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    return []
}
  watch(filterOptions, async (newFilterOptions, oldFilterOptions) => {
    const keyValueObject: any = {};

     newFilterOptions.forEach((item: any) => {
        let values = item.criteria;
        if (Array.isArray(values)) {
            if (!keyValueObject[item.field]) {
                keyValueObject[item.field] = [];
            }
            keyValueObject[item.field] = keyValueObject[item.field].concat(values);
        } else {
            keyValueObject[item.field] = values;
        }
    });
    
    offsetValue.value = 0
    if(offsetValue.value === 0){
     pagProperty.value.lastPage = true
    }else{
     pagProperty.value.lastPage = false
    }
    await userStore.dataUser({
      ...keyValueObject,
      limit: serverOptions.value.rowsPerPage,
      offset: offsetValue.value,
      sort_by: serverOptions.value.sortBy,
      sort: serverOptions.value.sortType === "asc" ? "ascending" : "descending",
    });
    pagProperty.value.nextPage = userStore.userDataCount < serverOptions.value.rowsPerPage
    serverItemsLength.value = userStore.userDataCount;
  });

  watch(() => insertion_date_start_Criteria.value, (newValue) => {
    if(newValue == ''){
      insertion_date_start_Criteria_temp.value = ''
    }else{
      insertion_date_start_Criteria_temp.value = newValue
    }
  });

  watch(() => insertion_date_end_Criteria.value, (newValue) => {
    if(newValue == ''){
      insertion_date_end_Criteria_temp.value = ''
    }else{
      insertion_date_end_Criteria_temp.value = newValue
    }
  });

  watch(() => license_expiration_date_start_Criteria.value, (newValue) => {
    if(newValue == ''){
      license_expiration_date_start_Criteria_temp.value = ''
    }else{
      license_expiration_date_start_Criteria_temp.value = newValue
    }
  });

  watch(() => license_expiration_date_end_Criteria.value, (newValue) => {
    if(newValue == ''){
      license_expiration_date_end_Criteria_temp.value = ''
    }else{
      license_expiration_date_end_Criteria_temp.value = newValue
    }
  });

  const showAgeFilter = ref(false);
  const showUser_idFilter = ref(false);
  const showStanag_idFilter = ref(false);
  const showStatus_header = ref(false);
  const udsGroup_header = ref(false);
  const group_shcs_header = ref(false);
  const missions_header = ref(false);
  const license_expiration_date_header = ref(false);
  const insertion_date_date_header = ref(false);
  const user_rules_header = ref(false);
  const filterState = ref<any>({
    showAgeFilter: false,
    showUser_idFilter: false,
    showStanag_idFilter: false,
    showStatus_header: false,
    udsGroup_header: false,
    group_shcs_header: false,
    missions_header: false,
    license_expiration_date_header: false,
    insertion_date_date_header: false,
    user_rules_header: false,
  });
  const handleFilterState = (valueFilter: string,event:any = null) => {
    if(event) {
      elementPosition.value.x = event.clientX;
      elementPosition.value.y = event.clientY;
    }
    if (filterState.value[valueFilter]) {
      filterState.value[valueFilter] = false;
    } else {
      for (const key in filterState.value) {
        if (Object.prototype.hasOwnProperty.call(filterState.value, key)) {
          filterState.value[key] = key === valueFilter;
        }
      }
    }
  };
  const tableMinHeight = ref(515);
  const toggleRowExpansion = (userId: number) => {
    const index = expandedRows.value.indexOf(userId);
    if (index !== -1) {
      expandedRows.value.splice(index, 1);
    } else {
      expandedRows.value.push(userId);
    }
  };
  const isRowExpanded = (userId: number) => {
    return expandedRows.value.includes(userId);
  };
  const adjustTableMinHeight = () => {
    const screenWidth = window.innerWidth;
    const scrennHeghit = window.innerHeight;
    const customHeight = scrennHeghit - 40 - 332;
    tableMinHeight.value = customHeight;
  };

  onMounted(async () => {
    serverOptions.value.rowsPerPage = userStore.selectedRowForPageDefault
    adjustTableMinHeight();
    if(route.path !== "/operator/usergroups/shc"){
      await userStore.dataUser({
        limit: userStore.selectedRowForPageDefault,
        offset: 0,
        sort_by: "user_id",
        sort: "descending",
      });
      serverItemsLength.value = userStore.userDataCount;
      // await groupStore.setGroupsData({limit: 10000});
      const dataSelectUds = await groupStore.getGroupsToSelect({group_type:'uds'})
      const dataSelectShc = await groupStore.getGroupsToSelect({group_type:'shc'})
      await shcGroupStore.assignSelectData({response:dataSelectShc})
      await udsGroupStore.assignSelectData({response:dataSelectUds})
      await userStore.fetchMissions();
      
    }
    pagProperty.value.lastPage = true
    missionsData.value = userStore.missionsData;
    udsGroupsData.value = groupStore.udsGroupsData;
    shcGroupsData.value = groupStore.shcGroupsData;
    window.addEventListener("resize", adjustTableMinHeight);
  });

  const loadFromServer = async (offsetValueProp?:number) => {
    if (serverOptions.value.rowsPerPage !== previousRowsPerPage.value) {
      offsetValue.value = 0; 
      previousRowsPerPage.value = serverOptions.value.rowsPerPage; 
    }
    userStore.selectedRowForPageDefault = serverOptions.value.rowsPerPage
    const keyValueObject: any = {};

    filterOptions.value.forEach((item: any) => {
      let values = item.criteria;
      if (Array.isArray(values)) {
        values = values.join(',');
        keyValueObject[item.field] = String(values).split(',');
      }else {
        keyValueObject[item.field] = values;
      }
    });
    if(offsetValueProp){
      offsetValue.value = offsetValue.value + offsetValueProp
      if(offsetValue.value === 0){
       pagProperty.value.lastPage = true
      }else{
       pagProperty.value.lastPage = false
      }
   }else{
    if(offsetValue.value === 0){
      pagProperty.value.lastPage = true
     }
  }
    await userStore.dataUser({
      ...keyValueObject,
      limit: serverOptions.value.rowsPerPage,
      offset: offsetValue.value,
      sort_by: serverOptions.value.sortBy,
      sort: serverOptions.value.sortType === "asc" ? "ascending" : "descending",
    });
    pagProperty.value.nextPage = userStore.userDataCount < serverOptions.value.rowsPerPage
    serverItemsLength.value = userStore.userDataCount;
  }

  watch(serverOptions, (value) => { loadFromServer(); }, { deep: true });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", adjustTableMinHeight);
  });
  const calculateValuesPagUser = () => {
    let localOffsetValue = offsetValue.value;
    let primerValor = (localOffsetValue === 0) ? 1 : localOffsetValue + 1;
    let segundoValor = (serverOptions.value.rowsPerPage !== 10 && localOffsetValue === 0) 
      ? serverOptions.value.rowsPerPage 
      : localOffsetValue !== 0
        ? localOffsetValue + serverOptions.value.rowsPerPage
        : localOffsetValue + 10;
    rangePagesUser.value = `${primerValor} - ${segundoValor}`;
}
  const resetPagination = () => {
    offsetValue.value = 0
    serverOptions.value.rowsPerPage = 10
    calculateValuesPagUser()
  }
  watchEffect(() => {
    adjustTableMinHeight();
    pagProperty.value.nextPage = userStore.userDataCount < serverOptions.value.rowsPerPage
    calculateValuesPagUser()
  });
  return {
    filterOptions,
    showAgeFilter,
    showUser_idFilter,
    showStanag_idFilter,
    showStatus_header,
    udsGroup_header,
    group_shcs_header,
    missions_header,
    license_expiration_date_header,
    insertion_date_date_header,
    user_rules_header,
    tableMinHeight,
    userStore,
    stanag_idCriteria,
    status_criteria,
    status_criteria_temp,
    user_idCriteria,
    user_idCriteria_temp,
    udsGroup_Criteria,
    group_shcs_Criteria,
    missions_Criteria,
    license_expiration_date_start_Criteria,
    license_expiration_date_end_Criteria,
    license_expiration_date_start_Criteria_temp,
    license_expiration_date_end_Criteria_temp,
    insertion_date_start_Criteria,
    insertion_date_end_Criteria,
    insertion_date_start_Criteria_temp,
    insertion_date_end_Criteria_temp,
    user_rules_Criteria,
    user_rules_Criteria_temp,
    ageCriteria,
    expandedRows,
    isRowExpanded,
    toggleRowExpansion,
    selectedStanagIdsTemp,
    stanagSearchTerm,
    serverOptions,
    mappedDataStanag,
    handleStanagIdCheckboxChange,
    resetFilters,
    applyFilters,
    selectedStanagIds,
    filteredMappedDataStanag,
    filteredMappedDataUdsGroup,
    filterState,
    handleFilterState,
    mappedDataStanagCountrys,
    serverItemsLength,

    udsGroupsData,
    shcGroupsData,
    udsGroupSearchTerm,
    handleUdsGroupCheckboxChange,
    selectedUdsGroupIdsTemp,
    selectedUdsGroupIds,
    resetUdsGroupFilters,
    applyUdsGroupFilters,

    applyShcGroupFilters,
    resetShcGroupFilters,
    selectedShcGroupIdsTemp,
    selectedShcGroupIds,
    shcGroupSearchTerm,
    handleShcGroupCheckboxChange,
    filteredMappedDataShcGroup,

    selectedMissionGroupIdsTemp,
    selectedMissionGroupIds,
    missionGroupSearchTerm,
    handleMissionGroupCheckboxChange,
    filteredMappedDataMissionGroup,
    applyMissionGroupFilters,
    resetMissionGroupFilters,
    offsetValue,
    pagProperty,
    loadFromServer,
    rangePagesUser,
    elementPosition,
    getDataSelect,
    resetPagination
  };
}
