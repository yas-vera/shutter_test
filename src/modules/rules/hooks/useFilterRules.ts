import { convertFormatFilterDate, isValidDate, parseFormattedDateTime } from "@/helpers/convertDateTime";
import {
  caseInsensitiveIncludes,
  caseInsensitiveStateIncludes,
  dateComparisonFunction,
} from "@/helpers/tableHelpers";
import { useFilterStore } from "@/stores/filtersStore";
import { useRulesStore } from "@/stores/rulesStore";
import { useSatDataStore } from "@/stores/satDataStore";
import { computed, onMounted, ref, watch } from "vue";
import type { FilterOption, ServerOptions } from "vue3-easy-data-table";

export default function useFilterRules() {
  const id = ref("");
  const idTemp = ref("");
  const mission_sensor = ref("");
  const acquisition_mode = ref("");
  const rules_type = ref("");
  const rules_type_temp = ref("");
  const users = ref("");
  const status = ref("");
  const status_temp = ref("");
  const comments = ref("");
  const comments_temp = ref("");
  const rule_name_criteria = ref("");
  const rule_name_criteria_temp = ref("");
  const creation_date_start_criteria = ref<any>("");
  const creation_date_end_criteria = ref<any>("");
  const creation_date_start_criteria_temp = ref<any>("");
  const creation_date_end_criteria_temp = ref<any>("");
  const validity_start_time = ref<any>("");
  const validity_end_time = ref<any>("");
  const validity_start_time_temp = ref<any>("");
  const validity_end_time_temp = ref<any>("");
  const sensing_start_time = ref<any>("");
  const sensing_end_time = ref<any>("");
  const sensing_start_time_temp = ref<any>("");
  const sensing_end_time_temp = ref<any>("");

  const showFilter_id = ref(false);
  const showFilter_mission_sensor = ref(false);
  const showFilter_acquisition_mode = ref(false);
  const showFilter_rules_type = ref(false);
  const showFilter_users = ref(false);
  const showFilter_status = ref(false);
  const showFilter_comments = ref(false);
  const showFilter_rule_name = ref(false);
  const showFilter_creation_date = ref(false);
  const showFilter_validity_time = ref(false);
  const showFilter_sensing_time = ref(false);
  const rulesStore = useRulesStore()
  const satDataStore = useSatDataStore();


  //pagination
  const serverItemsLength = ref(0);
  const offsetValue = ref(0)
  const serverOptions = ref<ServerOptions>({
    page: 1,
    rowsPerPage: rulesStore.limitData,
    sortBy: 'rule_id',
    sortType: 'desc',
  });
  let previousRowsPerPage = ref<number>(serverOptions.value.rowsPerPage);
  const pagProperty = ref({
    nextPage: false,
    lastPage: true
  })

  const mission_id = ref<any>("");
  const itemsMission = ref<any>([]);
  const missionSearchTerm = ref<string>('');
  const selectedMissionIds = ref<string[]>([]);
  const selectedMissionIdsTemp = ref<string[]>([]);

  const acquisition_mode_id = ref<any>("");
  const itemsAcquisitionMode = ref<any>([]);
  const acquisitionModeSearchTerm = ref<string>('');
  const selectedAcquisitionModeIds = ref<string[]>([]);
  const selectedAcquisitionModeIdsTemp = ref<string[]>([]);
  const filterStore = useFilterStore();

  const group_uds = ref<any>("");
  const selectedGroupIds = ref<string[]>([]);
  const selectedGroupIdsTemp = ref<string[]>([]);

  const elementPosition = ref<any>({
    x: 0,
    y: 0
  })

  const group_shc = ref<any>("");
  const selectedGroupShcIds = ref<string[]>([]);
  const selectedGroupShcIdsTemp = ref<string[]>([]);

  const filterState = ref<any>({
    showFilter_id: false,
    showFilter_mission_sensor: false,
    showFilter_acquisition_mode: false,
    showFilter_rules_type: false,
    showFilter_users: false,
    showFilter_status: false,
    showFilter_validity_time: false,
    showFilter_sensing_time: false,
    showFilter_comments: false,
    showFilter_rule_name: false,
    showFilter_creation_date: false,
  });

  const handleFilterState = (valueFilter: string, event:any = null) => {
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

  const filterOptionsRules = computed((): FilterOption[] => {
    const filterOptionsArray: FilterOption[] = [];
    if (id.value !== "") {
      filterOptionsArray.push({
        field: "rule_id",
        criteria: id.value,
        comparison: () => true,
      });
    }
    if (
      creation_date_start_criteria.value !== "" &&
      creation_date_start_criteria.value !== null
    ) {
      const creationDate = new Date(creation_date_start_criteria.value);
      const criteriaDateString = creationDate.toISOString();

      filterOptionsArray.push({
        field: "creation_date_start",
        comparison: () => true,
        criteria: convertFormatFilterDate(criteriaDateString),
      });
    }
    if (
      creation_date_end_criteria.value !== "" &&
      creation_date_end_criteria.value !== null
    ) {
      const creationDate = new Date(creation_date_end_criteria.value);
      const criteriaDateString = creationDate.toISOString();

      filterOptionsArray.push({
        field: "creation_date_end",
        comparison: () => true,
        criteria: convertFormatFilterDate(criteriaDateString),
      });
    }
    if (!!validity_start_time.value) {
      let valid = isValidDate(validity_start_time.value)
      let creationDate: any = new Date(validity_start_time.value);
      if (valid) {
        creationDate = new Date(validity_start_time.value)
      } else {
        if (validity_start_time.value.length > 14) {
          valid = isValidDate(parseFormattedDateTime(validity_start_time.value))
          creationDate = parseFormattedDateTime(validity_start_time.value)
        } else {
          creationDate = new Date(validity_start_time.value)
        }
      }
      if (valid) {
        const criteriaDateString = creationDate.toISOString();
        filterOptionsArray.push({
          field: "validity_start_time",
          comparison: () => true,
          criteria: convertFormatFilterDate(criteriaDateString),
        });
      }
    }
    if (!!validity_end_time.value) {
      let valid = isValidDate(validity_end_time.value)
      let creationDate: any = new Date(validity_end_time.value);
      if (valid) {
        creationDate = new Date(validity_end_time.value)
      } else {
        if (validity_end_time.value.length > 14) {
          valid = isValidDate(parseFormattedDateTime(validity_end_time.value))
          creationDate = parseFormattedDateTime(validity_end_time.value)
        } else {
          creationDate = new Date(validity_end_time.value)
        }
      }
      if (valid) {
        const criteriaDateString = creationDate.toISOString();
        filterOptionsArray.push({
          field: "validity_end_time",
          comparison: () => true,
          criteria: convertFormatFilterDate(criteriaDateString),
        });
      }
    }
    if (!!sensing_start_time.value) {

      let valid = isValidDate(sensing_start_time.value)
      let creationDate: any = new Date(sensing_start_time.value);
      if (valid) {
        creationDate = new Date(sensing_start_time.value)
      } else {
        if (sensing_start_time.value.length > 14) {
          valid = isValidDate(parseFormattedDateTime(sensing_start_time.value))
          creationDate = parseFormattedDateTime(sensing_start_time.value)
        } else {
          creationDate = new Date(sensing_start_time.value)
        }
      }
      if (valid) {
        const criteriaDateString = creationDate.toISOString();
        filterOptionsArray.push({
          field: "sensing_start_time",
          comparison: () => true,
          criteria: convertFormatFilterDate(criteriaDateString),
        });
      }
    }
    if (!!sensing_end_time.value) {
      let valid = isValidDate(sensing_end_time.value)
      let creationDate: any = new Date(sensing_end_time.value);
      if (valid) {
        creationDate = new Date(sensing_end_time.value)
      } else {
        if (sensing_end_time.value.length > 14) {
          valid = isValidDate(parseFormattedDateTime(sensing_end_time.value))
          creationDate = parseFormattedDateTime(sensing_end_time.value)
        } else {
          creationDate = new Date(sensing_end_time.value)
        }
      }
      if (valid) {
        const criteriaDateString = creationDate.toISOString();
        filterOptionsArray.push({
          field: "sensing_end_time",
          comparison: () => true,
          criteria: convertFormatFilterDate(criteriaDateString),
        });
      }
    }
    filterOptionsArray.push({
      field: "rule_name",
      criteria: rule_name_criteria.value,
      comparison: () => true,
    });
    const missionGroup = mission_id.value !== "" ? mission_id.value : selectedMissionIds.value;
    if (typeof missionGroup === "string") {
      filterOptionsArray.push({
        field: "mission_id",
        criteria: missionGroup,
        comparison: () => true,
      });
    } else if (Array.isArray(missionGroup)) {
      if (missionGroup.length > 0) {
        filterOptionsArray.push({
          field: "mission_id",
          comparison: "in",
          criteria: missionGroup,
        });
      }
    }

    const modeGroup = acquisition_mode_id.value !== "" ? acquisition_mode_id.value : selectedAcquisitionModeIds.value;
    if (typeof modeGroup === "string") {
      filterOptionsArray.push({
        field: "acquisition_mode_id",
        criteria: modeGroup,
        comparison: () => true,
      });
    } else if (Array.isArray(modeGroup)) {
      if (modeGroup.length > 0) {
        filterOptionsArray.push({
          field: "acquisition_mode_id",
          comparison: "in",
          criteria: modeGroup,
        });
      }
    }


    const groupGroups = group_uds.value !== "" ? group_uds.value : selectedGroupIds.value;
    if (typeof groupGroups === "string") {
      filterOptionsArray.push({
        field: "group_uds",
        criteria: groupGroups,
        comparison: () => true,
      });
    } else if (Array.isArray(groupGroups)) {
      if (groupGroups.length > 0) {
        filterOptionsArray.push({
          field: "group_uds",
          comparison: "in",
          criteria: groupGroups,
        });
      }
    }

    const groupGroupsShc = group_shc.value !== "" ? group_shc.value : selectedGroupShcIds.value;
    if (typeof groupGroupsShc === "string") {
      filterOptionsArray.push({
        field: "group_shc",
        criteria: groupGroupsShc,
        comparison: () => true,
      });
    } else if (Array.isArray(groupGroupsShc)) {
      if (groupGroupsShc.length > 0) {
        filterOptionsArray.push({
          field: "group_shc",
          comparison: "in",
          criteria: groupGroupsShc,
        });
      }
    }

    filterOptionsArray.push({
      field: "rule_type",
      criteria: rules_type.value,
      comparison: caseInsensitiveIncludes,
    });

    filterOptionsArray.push({
      field: "status",
      criteria: status.value,
      comparison: caseInsensitiveStateIncludes,
    });
    filterOptionsArray.push({
      field: "comments",
      criteria: comments.value,
      comparison: caseInsensitiveIncludes,
    });
    return filterOptionsArray;
  });

  watch(filterOptionsRules, async (newFilterOptions, oldFilterOptions) => {
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

    if (offsetValue.value === 0) {
      pagProperty.value.lastPage = true
    } else {
      pagProperty.value.lastPage = false
    }

    if (filterStore.rulesFilters.area && filterStore.rulesFilters.area.length > 0) {
      keyValueObject.area = filterStore.rulesFilters.area
    }
    await rulesStore.dataRules({
      ...keyValueObject,
      limit: serverOptions.value.rowsPerPage,
      offset: offsetValue.value,
      sort_by: serverOptions.value.sortBy,
      sort: serverOptions.value.sortType === "asc" ? "ascending" : "descending",
    });
    pagProperty.value.nextPage = rulesStore.rulesDataCount < serverOptions.value.rowsPerPage
  });

  const loadFromServer = async (offsetValueProp?: number) => {
    if (serverOptions.value.rowsPerPage !== previousRowsPerPage.value) {
      offsetValue.value = 0;
      previousRowsPerPage.value = serverOptions.value.rowsPerPage;
    }
    const keyValueObject: any = {};

    // filterOptionsRules.value.forEach((item: any) => {
    //   let values = item.criteria;
    //   if (Array.isArray(values)) {
    //     values = values.join(',');
    //   }
    //   keyValueObject[item.field] = values;
    // });
    filterOptionsRules.value.forEach((item: any) => {
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
    if (offsetValueProp) {
      offsetValue.value = offsetValue.value + offsetValueProp
      if (offsetValue.value === 0) {
        pagProperty.value.lastPage = true
      } else {
        pagProperty.value.lastPage = false
      }
    } else {
      if (offsetValue.value === 0) {
        pagProperty.value.lastPage = true
      }
    }
    await rulesStore.dataRules({
      ...keyValueObject,
      limit: serverOptions.value.rowsPerPage,
      offset: offsetValue.value,
      sort_by: serverOptions.value.sortBy,
      sort: serverOptions.value.sortType === "asc" ? "ascending" : "descending",
    });
    pagProperty.value.nextPage = rulesStore.rulesDataCount < serverOptions.value.rowsPerPage
    serverItemsLength.value = rulesStore.rulesDataCount;
  }

  

  watch(serverOptions, (value) => { loadFromServer(); }, { deep: true });
  const filteredMappedDataAcquisitionMode = computed<any[]>(() => {
    if (itemsAcquisitionMode.value) {
      const dataFilter: any = itemsAcquisitionMode.value
      const searchTerm = acquisitionModeSearchTerm.value.toLowerCase();
      return dataFilter.filter((item: any) => item.label?.toLowerCase().includes(searchTerm));
    }
  });

  const handleAcquisitionModeCheckboxChange = (value: string | undefined) => {
    if (value === undefined) {
      return
    }
    if (selectedAcquisitionModeIdsTemp.value.includes(value)) {
      selectedAcquisitionModeIdsTemp.value = selectedAcquisitionModeIdsTemp.value.filter(item => item !== value);
    } else {
      if (selectedAcquisitionModeIdsTemp.value) {
        selectedAcquisitionModeIdsTemp.value.push(value);
      } else {
        selectedAcquisitionModeIdsTemp.value = [value];
      }
    }
  };

  const handleGroupCheckboxChange = (value: string | undefined) => {
    if (value === undefined) {
      return
    }
    if (selectedGroupIdsTemp.value.includes(value)) {
      selectedGroupIdsTemp.value = selectedGroupIdsTemp.value.filter(item => item !== value);
    } else {
      if (selectedGroupIdsTemp.value) {
        selectedGroupIdsTemp.value.push(value);
      } else {
        selectedGroupIdsTemp.value = [value];
      }
    }
  };

  const applyAcquisitionModeFilters = () => {
    selectedAcquisitionModeIds.value = [...selectedAcquisitionModeIdsTemp.value];
  };

  const resetGroupFilters = () => {
    selectedGroupIdsTemp.value = [];
    selectedGroupIds.value = [];
  }


  const applyGroupFilters = () => {
    selectedGroupIds.value = [...selectedGroupIdsTemp.value];
  };

  const resetAcquisitionModeFilters = () => {
    selectedAcquisitionModeIdsTemp.value = [];
    selectedAcquisitionModeIds.value = [];
  }

  //
  const filteredMappedDataMission = computed<any[]>(() => {
    if (itemsMission.value) {
      const dataFilter: any = itemsMission.value
      const searchTerm = missionSearchTerm.value.toLowerCase();
      return dataFilter.filter((item: any) => item.label?.toLowerCase().includes(searchTerm));
    }
  });

  // asineg data in datepickert

  watch(() => creation_date_start_criteria.value, (newValue) => {
    if (newValue == '') {
      creation_date_start_criteria_temp.value = ''
    }
  });

  watch(() => creation_date_end_criteria.value, (newValue) => {
    if (newValue == '') {
      creation_date_end_criteria_temp.value = ''
    }
  });

  watch(() => validity_start_time.value, (newValue) => {
    if (newValue == '') {
      validity_start_time_temp.value = ''
    } else {
      validity_start_time_temp.value = newValue
    }
  });

  watch(() => validity_end_time.value, (newValue) => {
    if (newValue == '') {
      validity_end_time_temp.value = ''
    } else {
      validity_end_time_temp.value = newValue
    }
  });

  watch(() => sensing_start_time.value, (newValue) => {
    if (newValue == '') {
      sensing_start_time_temp.value = ''
    } else {
      sensing_start_time_temp.value = newValue
    }
  });

  watch(() => sensing_end_time.value, (newValue) => {
    if (newValue == '') {
      sensing_end_time_temp.value = ''
    } else {
      sensing_end_time_temp.value = newValue
    }
  });
  //

  const handleMissionCheckboxChange = (value: string | undefined) => {
    if (value === undefined) {
      return
    }
    if (selectedMissionIdsTemp.value.includes(value)) {
      selectedMissionIdsTemp.value = selectedMissionIdsTemp.value.filter(item => item !== value);
    } else {
      if (selectedMissionIdsTemp.value) {
        selectedMissionIdsTemp.value.push(value);
      } else {
        selectedMissionIdsTemp.value = [value];
      }
    }
  };

  const applyMissionFilters = () => {
    selectedMissionIds.value = [...selectedMissionIdsTemp.value];
  };

  const resetMissionFilters = () => {
    selectedMissionIdsTemp.value = [];
    selectedMissionIds.value = [];
  }

  onMounted(async () => {
    await satDataStore.getSatData('mission')
    await satDataStore.getSatData('acquisition_mode')
    await getData()
  });

  const getData = async () => {
    let datamIssion = satDataStore.missionData
    itemsMission.value = datamIssion?.map((item) => {
      return {
        label: item.id,
        value: item.id,
      }
    }).sort((a, b) => a.label.localeCompare(b.label));

    let dataMode = satDataStore.acquisitionModeData
    itemsAcquisitionMode.value = dataMode?.map((item) => {
      return {
        label: item.id,
        value: item.id,
      }
    }).sort((a, b) => a.label.localeCompare(b.label));
  }

  const getFilterRuleValues = () => {
    const keyValueObject: any = {};
    filterOptionsRules.value.forEach((item: any) => {
      let values = item.criteria;
      if (Array.isArray(values)) {
        values = values.join(',');
      }
      keyValueObject[item.field] = values;
    });

    return keyValueObject;
  }

  return {
    id,
    idTemp,
    mission_sensor,
    acquisition_mode,
    rules_type,
    rules_type_temp,
    users,
    status,
    status_temp,
    comments,
    comments_temp,
    rule_name_criteria,
    rule_name_criteria_temp,
    creation_date_start_criteria,
    creation_date_end_criteria,
    creation_date_start_criteria_temp,
    creation_date_end_criteria_temp,
    validity_start_time,
    validity_end_time,
    validity_start_time_temp,
    validity_end_time_temp,
    sensing_start_time,
    sensing_end_time,
    sensing_start_time_temp,
    sensing_end_time_temp,
    showFilter_id,
    showFilter_mission_sensor,
    showFilter_acquisition_mode,
    showFilter_rules_type,
    showFilter_users,
    showFilter_status,
    showFilter_comments,
    showFilter_rule_name,
    showFilter_validity_time,
    showFilter_sensing_time,
    showFilter_creation_date,
    filterOptionsRules,
    getFilterRuleValues,
    filterState,
    handleFilterState,
    elementPosition,
    serverItemsLength,
    serverOptionsRule:serverOptions,
    loadFromServerRules: loadFromServer,
    pagPropertyRules: pagProperty,
    offsetValueRules: offsetValue,

    filteredMappedDataMission,
    handleMissionCheckboxChange,
    applyMissionFilters,
    resetMissionFilters,
    missionSearchTerm,
    selectedMissionIds,
    selectedMissionIdsTemp,

    filteredMappedDataAcquisitionMode,
    handleAcquisitionModeCheckboxChange,
    applyAcquisitionModeFilters,
    resetAcquisitionModeFilters,
    acquisitionModeSearchTerm,
    selectedAcquisitionModeIds,
    selectedAcquisitionModeIdsTemp,

    applyGroupFilters,
    resetGroupFilters,
    selectedGroupIds,
    selectedGroupIdsTemp,

    selectedGroupShcIds,
    selectedGroupShcIdsTemp,
    getData,
  };
}
