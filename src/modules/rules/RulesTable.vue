<script setup lang="ts">
import { onMounted, ref, computed, onBeforeUnmount, watchEffect, watch } from 'vue';
import { bodyRowClassNameFunction, colorButtonRulesType, capitalizeFirstLetter, iconTagClass, caseInsensitiveIncludes, colorButton, colorButtonClass, getValuesAndIds, sortBy, sortType, colorTagClass, validateLargeText, capitalizeRowsLetter } from '@/helpers/tableHelpers';
import { useRulesStore } from '@/stores/rulesStore';
import { headersRules } from './config/headersTable';
import { QtmButton, QtmDropdown, QtmDropdownTrigger, QtmIcon, QtmDropdownOverlay, QtmMenuItemList, QtmMenuItem, QtmMenuItemLabel, QtmTypography, QtmTag, QtmTextInput, QtmCheckbox, QtmTooltip, QtmDivider, QtmDropdownSelectOption, QtmDropdownSelect } from "@qtm/vue";
import type { FilterOption, ServerOptions } from 'vue3-easy-data-table';
import { convertFormatDate, datePickerFormatHours, getFormattedDateTime } from '@/helpers/convertDateTime';
import { useMapViewStore } from '@/stores/mapViewStore';
import ClickOutSide from '@/components/clickoutside/ClickOutSide.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import useFilterRules from './hooks/useFilterRules';
import RulesDetailsComment from "@/modules/rules/RulesDetailsComment.vue";
import type { IAoiDraw } from '@/interfaces/IDraw';
import { acquisitionModeList, missionSensorList, ruleTypeList, states } from '@/data/selectOptions';
import useRules from './hooks/useRules';
import { _CANCELLED, _EXPIRED, TAB_DETAILS_RULE } from '@/constants/constants';
import { useExportStore } from '@/stores/exportStore';
import RuleReport from '@/components/export/rule/RuleReport.vue';
import RuleCompressedReport from '@/components/export/rule/RuleCompressedReport.vue';
import { useFilterStore } from '@/stores/filtersStore';

const rulesStore = useRulesStore()
const mapViewStore = useMapViewStore()
const exportStore = useExportStore()
const {
  id,
  idTemp,
  rule_name_criteria,
  rule_name_criteria_temp,
  creation_date_start_criteria,
  creation_date_start_criteria_temp,
  creation_date_end_criteria,
  creation_date_end_criteria_temp,
  validity_start_time,
  validity_end_time,
  validity_start_time_temp,
  validity_end_time_temp,
  sensing_start_time,
  sensing_end_time,
  sensing_start_time_temp,
  sensing_end_time_temp,
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
  showFilter_users,
  showFilter_status,
  showFilter_comments,
  filterOptionsRules,
  elementPosition,
  handleFilterState,
  filterState,
  serverItemsLength,
  serverOptionsRule,

  loadFromServerRules,
  pagPropertyRules,
  offsetValueRules,

  missionSearchTerm,
  selectedMissionIdsTemp,
  filteredMappedDataMission,
  handleMissionCheckboxChange,
  applyMissionFilters,
  resetMissionFilters,

  filteredMappedDataAcquisitionMode,
  handleAcquisitionModeCheckboxChange,
  applyAcquisitionModeFilters,
  resetAcquisitionModeFilters,
  acquisitionModeSearchTerm,
  selectedAcquisitionModeIds,
  selectedAcquisitionModeIdsTemp,
  selectedMissionIds,
  selectedGroupIds,
  selectedGroupIdsTemp,
  selectedGroupShcIds,
  selectedGroupShcIdsTemp
} = useFilterRules()
const {
  handleCurrentRuleId,
  handleCloneRule
} = useRules();
const detailsActive = ref<any[]>([]);
const rangePages = ref<string>('')
const handleViewDetails = (id: string | number) => {
  detailsActive.value.push({ id: id, minimize: false });
};
const minimizeDetails = (id: string | number, value: boolean) => {
  const itemIndex = detailsActive.value.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    detailsActive.value[itemIndex].minimize = value;
  }
};
const handleRemoveViewDetails = (id: string | number) => {
  detailsActive.value = detailsActive.value.filter((item) => item.id !== id);
};

const verifyActiveDetails = (id: string | number) => {
  return detailsActive.value.some((item) => item.id === id && !item.minimize);
};
const verifyActiveMinimizeDetails = (id: string | number) => {
  return detailsActive.value.some((item) => item.id === id && item.minimize);
};
const handleOptionRemove = async (option: any) => {
  await rulesStore.removeData(option)
};
const handleOptionActiveOrSuspend = async (option: any) => {
  if (option.status === 'suspended') {
    await rulesStore.activeData(option)
    return
  }
  await rulesStore.suspendData(option)
};
const handleOptionSuspend = async (option: any) => {
  await rulesStore.suspendData(option)
};
const handleOptionActive = async (option: any) => {
  await rulesStore.activeData(option)
};
const handleOptionClone = async (option: any) => {
  option.acquisition_mode_id = String(option.acquisition_mode_id).toLowerCase()
  handleCloneRule(option)
  // let data: any = await rulesStore.postCloneRules(option)
  // data && handleCurrentRuleId(data.rule_id, true, true)
};
const tableMinHeight = ref(515);
const adjustTableMinHeight = () => {
  const screenWidth = window.innerWidth;
  const scrennHeghit = window.innerHeight;
  const customHeight = scrennHeghit - 40 - 372;
  tableMinHeight.value = customHeight;
};

const filterStore = useFilterStore();
onMounted(async () => {
  adjustTableMinHeight();
  //await rulesStore.dataRules(rulesStore.valuesFilterCustom,true) 
  serverItemsLength.value = rulesStore.rulesDataCount;
  pagPropertyRules.value.lastPage = true
  pagPropertyRules.value.nextPage = rulesStore.rulesDataCount < serverOptionsRule.value.rowsPerPage

  window.addEventListener('resize', adjustTableMinHeight);
  setDefaultFilterValues();
  capitalizeRowsLetter()
  await rulesStore.dataRulesNameAll()
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustTableMinHeight);
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
watchEffect(() => {
  adjustTableMinHeight();
  pagPropertyRules.value.nextPage = rulesStore.rulesDataCount < serverOptionsRule.value.rowsPerPage
  calculateValues()
});

watch(
  () => filterStore.rulesFilters,
  (newValue) => {
    let exits = Object.values(newValue).some(value => value !== '')
    if (exits) {
      if (newValue) {
        id.value = newValue.rule_id || '';
        idTemp.value = id.value
        rules_type.value = newValue.rule_type || '';
        rule_name_criteria.value = newValue.rule_name || '';
        creation_date_start_criteria.value = newValue.creation_date_start_criteria || '';
        creation_date_end_criteria.value = newValue.creation_date_end_criteria || '';
        status.value = newValue.status || '';
        validity_start_time.value = newValue.validity_start_time;
        validity_end_time.value = newValue.validity_end_time;
        sensing_start_time.value = newValue.sensing_start_time;
        sensing_end_time.value = newValue.sensing_end_time;
        selectedMissionIds.value = newValue.mission_id;
        selectedAcquisitionModeIds.value = newValue.acquisition_mode_id;
        selectedMissionIdsTemp.value = newValue.mission_id;
        selectedAcquisitionModeIdsTemp.value = newValue.acquisition_mode_id;
        selectedGroupIds.value = newValue.group_uds;
        selectedGroupIdsTemp.value = newValue.group_uds;
        selectedGroupShcIds.value = newValue.group_shc;
        selectedGroupShcIdsTemp.value = newValue.group_shc;
        comments.value = newValue.comments || '';
      }
    } else {
      setDefaultFilterValues()
    }
  },
  { deep: true }
);

const setDefaultFilterValues = () => {
  //default filters
  id.value = filterStore.rulesFilters.rule_id ? filterStore.rulesFilters.rule_id : '';
  idTemp.value = id.value
  rule_name_criteria.value = filterStore.rulesFilters.rule_name ? filterStore.rulesFilters.rule_name : '';
  creation_date_start_criteria.value = filterStore.rulesFilters.creation_date_start_criteria ? filterStore.rulesFilters.creation_date_start_criteria : '';
  creation_date_end_criteria.value = filterStore.rulesFilters.creation_date_end_criteria ? filterStore.rulesFilters.creation_date_end_criteria : '';
  status.value = filterStore.rulesFilters.status ? filterStore.rulesFilters.status : '';
  rules_type.value = filterStore.rulesFilters.rule_type ? filterStore.rulesFilters.rule_type : '';
  validity_start_time.value = filterStore.rulesFilters.validity_start_time ? new Date(filterStore.rulesFilters.validity_start_time) : '';
  validity_end_time.value = filterStore.rulesFilters.validity_end_time ? filterStore.rulesFilters.validity_end_time : '';
  sensing_start_time.value = filterStore.rulesFilters.sensing_start_time ? filterStore.rulesFilters.sensing_start_time : '';
  sensing_end_time.value = filterStore.rulesFilters.sensing_end_time ? filterStore.rulesFilters.sensing_end_time : '';
  selectedMissionIdsTemp.value = filterStore.rulesFilters.mission_id ? filterStore.rulesFilters.mission_id : '';
  selectedAcquisitionModeIdsTemp.value = filterStore.rulesFilters.acquisition_mode_id ? filterStore.rulesFilters.acquisition_mode_id : '';
  selectedGroupIdsTemp.value = filterStore.rulesFilters.group_uds ? filterStore.rulesFilters.group_uds : '';
  selectedGroupShcIdsTemp.value = filterStore.rulesFilters.group_shc ? filterStore.rulesFilters.group_shc : '';
  comments.value = filterStore.rulesFilters.comments ? filterStore.rulesFilters.comments : '';
  if (selectedMissionIdsTemp.value.length == 0) {
    selectedMissionIds.value = []
  } else {
    selectedMissionIds.value = selectedMissionIdsTemp.value
  }
  if (selectedAcquisitionModeIdsTemp.value.length == 0) {
    selectedAcquisitionModeIds.value = []
  } else {
    selectedAcquisitionModeIds.value = selectedAcquisitionModeIdsTemp.value
  }
  if (selectedGroupIdsTemp.value.length == 0) {
    selectedGroupIds.value = []
  } else {
    selectedGroupIds.value = selectedGroupShcIdsTemp.value
  }
  if (selectedGroupShcIdsTemp.value.length == 0) {
    selectedGroupShcIds.value = []
  } else {
    selectedGroupShcIds.value = selectedGroupShcIdsTemp.value
  }
}

watch(() => rulesStore.itemsSelected.length, (length) => {
  if (rulesStore.itemsSelected.length > 0) {
    const selectedAreas: IAoiDraw[] = rulesStore.itemsSelected
      .filter(item => item.status !== _CANCELLED)
      .map(item => ({
        wkt: item.geometry.area_wkt,
        colorType: item.rule_type,
        idAoi: item.rule_id,
        statusRule: item.status
      }));

    if (selectedAreas.length > 0) {
      mapViewStore.selectAOIdraw(selectedAreas);
    } else {
      mapViewStore.restoreZoom();
      mapViewStore.removeVectorLayer();
    }
  } else {
    mapViewStore.restoreZoom();
    mapViewStore.removeVectorLayer();
  }
});


//! Manage filters
const handleFilter = (value: any, type: string) => {
  if (type === 'rule_id' && value !== 'reset') {
    id.value = value;
  }
  if (type === 'rule_id' && value == 'reset') {
    id.value = '';
    idTemp.value = ''
    value = ''
  }

  if (type === 'comments' && value !== 'reset') {
    comments.value = value;
  }
  if (type === 'comments' && value == 'reset') {
    comments.value = '';
    comments_temp.value = '';
    value = '';
  }

  if (type === 'rule_name' && value !== 'reset') {
    rule_name_criteria.value = value;
  }
  if (type === 'rule_name' && value == 'reset') {
    rule_name_criteria.value = '';
    rule_name_criteria_temp.value = '';
    value = '';
  }

  if (type === 'status' && value !== 'reset') {
    status.value = value;
  }
  if (type === 'status' && value == 'reset') {
    status.value = '';
    status_temp.value = '';
    value = ''
  }

  if (type === 'rule_type' && value !== 'reset') {
    rules_type.value = value;
  }
  if (type === 'rule_type' && value == 'reset') {
    rules_type.value = '';
    value = ''
  }

  if (type === 'validity_time' && value !== 'reset') {
    if (validity_start_time_temp.value != '') {
      validity_start_time.value = validity_start_time_temp.value ? validity_start_time_temp.value : '';
      value = validity_start_time_temp.value ? validity_start_time_temp.value : ''
    }
    if (validity_end_time_temp.value != '') {
      validity_end_time.value = validity_end_time_temp.value ? validity_end_time_temp.value : '';
      value = validity_end_time_temp.value ? validity_end_time_temp.value : ''
    }
  }

  if (type === 'validity_time' && value == 'reset') {
    validity_start_time.value = ''
    validity_start_time_temp.value = ''
    validity_end_time.value = ''
    validity_end_time_temp.value = ''
  }

  if (type === 'sensing_time' && value !== 'reset') {
    if (sensing_start_time_temp.value != '') {
      sensing_start_time.value = sensing_start_time_temp.value ? sensing_start_time_temp.value : '';
      value = sensing_start_time_temp.value ? sensing_start_time_temp.value : ''
    }
    if (sensing_end_time_temp.value != '') {
      sensing_end_time.value = sensing_end_time_temp.value ? sensing_end_time_temp.value : '';
      value = sensing_end_time_temp.value ? sensing_end_time_temp.value : ''
    }
  }

  if (type === 'sensing_time' && value == 'reset') {
    sensing_start_time.value = ''
    sensing_start_time_temp.value = ''
    sensing_end_time.value = ''
    sensing_end_time_temp.value = ''
  }

  if (type === 'creation_date_criteria' && value !== 'reset') {
    if (creation_date_start_criteria_temp.value != '') {
      creation_date_start_criteria.value = creation_date_start_criteria_temp.value ? creation_date_start_criteria_temp.value : '';
      value = creation_date_start_criteria_temp.value ? creation_date_start_criteria_temp.value : ''
    }
    if (creation_date_end_criteria_temp.value != '') {
      creation_date_end_criteria.value = creation_date_end_criteria_temp.value ? creation_date_end_criteria_temp.value : '';
      value = creation_date_end_criteria_temp.value ? creation_date_end_criteria_temp.value : ''
    }
  }
  if (type === 'creation_date_criteria' && value == 'reset') {
    creation_date_start_criteria.value = ''
    creation_date_start_criteria_temp.value = ''
    creation_date_end_criteria.value = ''
    creation_date_end_criteria_temp.value = ''
  }

  if (type === 'mission_id' && value !== 'reset') {
    value = selectedMissionIdsTemp.value
  }
  if (type === 'mission_id' && value === 'reset') {
    selectedMissionIdsTemp.value = []
    value = []
  }

  if (type === 'acquisition_mode_id' && value !== 'reset') {
    value = selectedAcquisitionModeIdsTemp.value
  }
  if (type === 'acquisition_mode_id' && value === 'reset') {
    selectedAcquisitionModeIdsTemp.value = []
    value = []
  }
  
  if (type === 'group_uds' && value !== 'reset') {
    value = selectedGroupIdsTemp.value
  }
  if (type === 'group_uds' && value === 'reset') {
    selectedGroupIdsTemp.value = []
    value = []
  }
  
  if (type === 'group_shc' && value !== 'reset') {
    value = selectedGroupShcIdsTemp.value
  }
  if (type === 'group_shc' && value === 'reset') {
    selectedGroupShcIdsTemp.value = []
    value = []
  }

  // filterStore.handleFilters({
  //   ...filterStore.rulesFilters,
  //   [type]: value
  // });

  

  if (type === 'validity_time' || type === 'creation_date_criteria' || type === 'sensing_time') {
    rulesStore.handleResetDate(true)
    if (type === 'creation_date_criteria' && value !== 'reset') {
      if (creation_date_start_criteria.value != '' && creation_date_end_criteria.value != '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          creation_date_start_criteria: creation_date_start_criteria.value,
          creation_date_end_criteria: creation_date_end_criteria.value,
        });
      } else if (creation_date_start_criteria.value != '' && creation_date_end_criteria.value == '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          creation_date_start_criteria: creation_date_start_criteria.value,
          creation_date_end_criteria: '',
        });
      } else if (creation_date_start_criteria.value == '' && creation_date_end_criteria.value != '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          creation_date_start_criteria: '',
          creation_date_end_criteria: creation_date_end_criteria.value,
        });
      } else if(creation_date_start_criteria.value == '' && creation_date_end_criteria.value == '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          creation_date_start_criteria: '',
          creation_date_end_criteria: '',
        });
      } else {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          [type]: value
        });
      }

    } else if (type === 'creation_date_criteria' && value == 'reset') {
      filterStore.handleFilters({
        ...filterStore.rulesFilters,
        creation_date_start_criteria: '',
        creation_date_end_criteria: '',
      });

    } else if (type === 'validity_time' && value !== 'reset') {
      if (validity_start_time.value != '' && validity_end_time.value != '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          validity_start_time: validity_start_time.value,
          validity_end_time: validity_end_time.value,
        });
      } else if (validity_start_time.value != '' && validity_end_time.value == '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          validity_start_time: validity_start_time.value,
          validity_end_time: ''
        });
      } else if (validity_start_time.value == '' && validity_end_time.value != '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          validity_start_time: '',
          validity_end_time: validity_end_time.value,
        });
      } else if(validity_start_time.value == '' && validity_end_time.value == ''){
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          validity_start_time: '',
          validity_end_time: '',
        });
      }else {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          [type]: value
        });
      }

    } else if (type === 'validity_time' && value == 'reset') {
      filterStore.handleFilters({
        ...filterStore.rulesFilters,
        validity_start_time: '',
        validity_end_time: '',
      });

    } else if (type === 'sensing_time' && value !== 'reset') {
      if (sensing_start_time.value != '' && sensing_end_time.value != '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          sensing_start_time: sensing_start_time.value,
          sensing_end_time: sensing_end_time.value,
        });
      } else if (sensing_start_time.value != '' && sensing_end_time.value == '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          sensing_start_time: sensing_start_time.value,
          sensing_end_time: '',
        });
      } else if (sensing_start_time.value == '' && sensing_end_time.value != '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          sensing_start_time: '',
          sensing_end_time: sensing_end_time.value,
        });
      } else if(sensing_start_time.value == '' && sensing_end_time.value == '') {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          sensing_start_time: '',
          sensing_end_time: '',
        });
      } else {
        filterStore.handleFilters({
          ...filterStore.rulesFilters,
          [type]: value
        });
      }

    } else if (type === 'sensing_time' && value == 'reset') {
      filterStore.handleFilters({
        ...filterStore.rulesFilters,
        sensing_start_time: '',
        sensing_end_time: '',
      });
    }
  } else {
    filterStore.handleFilters({
      ...filterStore.rulesFilters,
      [type]: value
    });
  }

}
</script>
<template>

  <Teleport to="#app">
    <RuleCompressedReport v-if="exportStore.visibleRuleCompressed" :data="rulesStore.itemsSelected" />
  </Teleport>

  <div>

    <EasyDataTable class="table-rule-select-custom-th table-rule-date-top"
     :body-row-class-name="bodyRowClassNameFunction"
      v-model:items-selected="rulesStore.itemsSelected" 
      :headers="headersRules" 
      :items="rulesStore.rulesData"
      :filter-options="filterOptionsRules" 
      theme-color="#4c5dff"
      table-class-name="customize-table"
      header-text-direction="left" body-text-direction="left"
      :sort-type="sortType" multi-sort
      :table-height="rulesStore.viewRules === 'divide' ? 240 : tableMinHeight" 
      style="z-index: 140;"
      :rows-items="[10, 25, 50, 100, 250, 500]" 
      :rows-per-page="10" 
      alternating v-model:server-options="serverOptionsRule"
      :server-items-length="serverItemsLength">
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

              <QtmTextInput :value="id" @value-changed="(event: any) => idTemp = event.detail" placeholder="Search"
                size="small" left-icon="search" @click.stop>
              </QtmTextInput>

              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small"
                  @click.stop="handleFilter('reset', 'rule_id')">Reset</QtmButton>
                <QtmButton variant="filled" color="primary" size="small"
                  @click.stop="handleFilter(idTemp, 'rule_id'), filterState.showFilter_id = false">Apply</QtmButton>
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

            <qtm-icon icon="filter_list"
              :class="`column-filter ${rule_name_criteria.length > 0 ? 'column-filtered' : ''}`" size="medium"
              @click.stop="(event:any) => handleFilterState('showFilter_rule_name', event)"></qtm-icon>
            <div class="filter-menu" v-show="filterState.showFilter_rule_name" @click.stop>
              <QtmTextInput :value="rule_name_criteria"
                @value-changed="(event: any) => rule_name_criteria_temp = event.detail" placeholder="Search" size="small"
                left-icon="search" @click.stop>
              </QtmTextInput>
              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small"
                  @click.stop="handleFilter('reset', 'rule_name')">Reset</QtmButton>
                <QtmButton variant="filled" color="primary" size="small"
                  @click.stop="handleFilter(rule_name_criteria_temp, 'rule_name'), filterState.showFilter_rule_name = false">
                  Apply</QtmButton>
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

            <qtm-icon icon="filter_list"
              :class="`column-filter ${((creation_date_start_criteria && creation_date_start_criteria.toString().length > 0) || (creation_date_end_criteria && creation_date_end_criteria.toString().length > 0)) ? 'column-filtered' : ''}`"
              size="medium" @click.stop="(event:any) => handleFilterState('showFilter_creation_date', event)"></qtm-icon>
            
            <Teleport to="#app">
              <div class="filter-menu" :style="'left: '+(elementPosition.x-174)+'px; top: '+(elementPosition.y)+'px;'+'width: 440px !important;'" v-if="filterState.showFilter_creation_date">

                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">Creation date start</p>
                    <VueDatePicker class="date-picker-input-custom" :teleport="rulesStore.viewRules === 'divide'" v-model="creation_date_start_criteria_temp"
                      @update:model-value="(event: any) => creation_date_start_criteria_temp = event" :dark="true"
                      time-picker-inline :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Creation date end</p>
                    <VueDatePicker class="date-picker-input-custom" :teleport="rulesStore.viewRules === 'divide'" v-model="creation_date_end_criteria_temp" :dark="true"
                      time-picker-inline :format="getFormattedDateTime" >
                    </VueDatePicker>
                  </div>
                </div>

                <QtmDivider classes="my-m" />
                <div class="buttom-div">
                  <QtmButton variant="outline" color="primary" size="small"
                    @click.stop="handleFilter('reset', 'creation_date_criteria')">Reset</QtmButton>
                  <QtmButton variant="filled" color="primary" size="small"
                    @click.stop="handleFilter(creation_date_start_criteria_temp, 'creation_date_criteria'), filterState.showFilter_creation_date = false">
                    Apply</QtmButton>
                </div>

              </div>
            </Teleport>

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

            <qtm-icon icon="filter_list" size="medium"
              :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedMissionIdsTemp && selectedMissionIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              @click.stop="(event:any) => handleFilterState('showFilter_mission_sensor', event)"></qtm-icon>
              <Teleport to="#app">
                <div class="filter-menu" :style="'left: '+(elementPosition.x-174)+'px; top: '+(elementPosition.y)+'px;'" v-if="filterState.showFilter_mission_sensor">

                  <div @click.stop>
                    <QtmTextInput :value="missionSearchTerm"
                      @value-changed="(event: any) => missionSearchTerm = event.detail" placeholder="Search" size="small"
                      left-icon="search" @click.stop>
                    </QtmTextInput>
                    <QtmDivider classes="my-m" />
                    <div class="filter-menu-list-checkbox">
                      <ul v-for="mission in filteredMappedDataMission">
                        <li>
                          <qtm-checkbox @change="
                            handleMissionCheckboxChange(mission.value)
                            " :value="mission.value" :checked="selectedMissionIdsTemp.includes(
                                mission.value ? mission.value : ''
                              )
                                ">
                            {{ mission.label }}
                          </qtm-checkbox>
                        </li>
                      </ul>
                    </div>
                    <QtmDivider classes="my-m" />
                    <div class="buttom-div">
                      <QtmButton variant="outline" color="primary" size="small"
                        @click.stop="resetMissionFilters(), handleFilter('reset', 'mission_id')">Reset</QtmButton>
                      <QtmButton variant="filled" color="primary" size="small"
                        @click.stop="applyMissionFilters(), handleFilter('', 'mission_id'), filterState.showFilter_mission_sensor = false">
                        Apply</QtmButton>
                    </div>
                  </div>

                </div>
              </Teleport>
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

            <qtm-icon icon="filter_list"
              :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedAcquisitionModeIdsTemp && selectedAcquisitionModeIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              size="medium" @click.stop="(event:any) => handleFilterState('showFilter_acquisition_mode', event)"></qtm-icon>

              <Teleport to="#app">
                <div class="filter-menu" :style="'left: '+(elementPosition.x-174)+'px; top: '+(elementPosition.y)+'px;'" v-if="filterState.showFilter_acquisition_mode">
    
                  <div @click.stop>
                    <QtmTextInput :value="acquisitionModeSearchTerm"
                      @value-changed="(event: any) => acquisitionModeSearchTerm = event.detail" placeholder="Search"
                      size="small" left-icon="search" @click.stop>
                    </QtmTextInput>
                    <QtmDivider classes="my-m" />
                    <div class="filter-menu-list-checkbox">
                      <ul v-for="mode in filteredMappedDataAcquisitionMode">
                        <li>
                          <qtm-checkbox @change="
                            handleAcquisitionModeCheckboxChange(mode.value)
                            " :value="mode.value" :checked="selectedAcquisitionModeIdsTemp.includes(
                                mode.value ? mode.value : ''
                              )
                                ">
                            {{ mode.label }}
                          </qtm-checkbox>
                        </li>
                      </ul>
                    </div>
                    <QtmDivider classes="my-m" />
                    <div class="buttom-div">
                      <QtmButton variant="outline" color="primary" size="small"
                        @click.stop="resetAcquisitionModeFilters(), handleFilter('reset', 'acquisition_mode_id')">Reset
                      </QtmButton>
                      <QtmButton variant="filled" color="primary" size="small"
                        @click.stop="applyAcquisitionModeFilters(), handleFilter('', 'acquisition_mode_id'), filterState.showFilter_acquisition_mode = false">
                        Apply</QtmButton>
                    </div>
                  </div>
    
                </div>
              </Teleport>
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
              <qtm-dropdown-select size="small"
                @value-changed="(event: any) => rules_type_temp = event.detail.valueChanged" :value="rules_type">
                <template v-for="(optionsSelect, index) in ruleTypeList" :key="index">
                  <qtm-dropdown-select-option :value="optionsSelect.value">
                    {{ optionsSelect.label }}
                  </qtm-dropdown-select-option>
                </template>
              </qtm-dropdown-select>

              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small" @click="handleFilter('reset', 'rule_type')">
                  Reset</QtmButton>
                <QtmButton variant="filled" color="primary" size="small"
                  @click.stop="handleFilter(rules_type_temp, 'rule_type'), filterState.showFilter_rules_type = false">
                  Apply</QtmButton>
              </div>
            </div>
          </div>
        </ClickOutSide>
      </template>
      <template #header-users="header">
        <ClickOutSide @clickoutside="filterState.showFilter_users = false">
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

            <qtm-icon icon="filter_list" :class="`column-filter ${users.length > 0 ? 'column-filtered' : ''}`"
              size="medium" @click.stop="(event:any) => handleFilterState('showFilter_users', event)"></qtm-icon>
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

              <qtm-dropdown-select :scrollable="rulesStore.viewRules === 'divide' ? true:undefined" :nb-visible-options="rulesStore.viewRules === 'divide' ?3:undefined" size="small" @value-changed="(event: any) => status_temp = event.detail.valueChanged"
                :value="status">
                <template v-for="(optionsSelect, index) in states" :key="index">
                  <qtm-dropdown-select-option :value="optionsSelect.value">
                    {{ optionsSelect.label }}
                  </qtm-dropdown-select-option>
                </template>
              </qtm-dropdown-select>
              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small" @click="handleFilter('reset', 'status')">Reset
                </QtmButton>
                <QtmButton variant="filled" color="primary" size="small"
                  @click.stop="handleFilter(status_temp, 'status'), filterState.showFilter_status = false">Apply
                </QtmButton>
              </div>
            </div>
          </div>
        </ClickOutSide>
      </template>

      <template #header-validity_time="header">
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

            <qtm-icon icon="filter_list"
              :class="`column-filter ${((validity_start_time && validity_start_time.toString().length > 0) || (validity_end_time && validity_end_time.toString().length > 0)) ? 'column-filtered' : ''}`"
              size="medium" @click.stop="(event:any) => handleFilterState('showFilter_validity_time', event)"></qtm-icon>
            
            <Teleport to="#app">
              <div class="filter-menu" :style="'left: '+(elementPosition.x-174)+'px; top: '+(elementPosition.y)+'px;'+'width: 440px !important;'" v-if="filterState.showFilter_validity_time">

                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">Validity start time</p>
                    <VueDatePicker class="date-picker-input-custom" :teleport="rulesStore.viewRules === 'divide'" v-model="validity_start_time_temp" :dark="true"
                      time-picker-inline :format="getFormattedDateTime" >
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Validity end time</p>
                    <VueDatePicker class="date-picker-input-custom" :teleport="rulesStore.viewRules === 'divide'" v-model="validity_end_time_temp" :dark="true"
                      time-picker-inline :format="getFormattedDateTime" >
                    </VueDatePicker>
                  </div>
                </div>

                <QtmDivider classes="my-m" />
                <div class="buttom-div">
                  <QtmButton variant="outline" color="primary" size="small"
                    @click.stop="handleFilter('reset', 'validity_time')">Reset</QtmButton>
                  <QtmButton variant="filled" color="primary" size="small"
                    @click.stop="handleFilter(validity_start_time_temp, 'validity_time'), filterState.showFilter_validity_time = false">
                    Apply</QtmButton>
                </div>

              </div>
            </Teleport>

          </div>
        </ClickOutSide>
      </template>
      <template #header-sensing_time="header">
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

            <qtm-icon icon="filter_list"
              :class="`column-filter ${((sensing_start_time && sensing_start_time.toString().length > 0) || (sensing_end_time && sensing_end_time.toString().length > 0)) ? 'column-filtered' : ''}`"
              size="medium" @click.stop="(event:any) => handleFilterState('showFilter_sensing_time', event)"></qtm-icon>
            
            <Teleport to="#app">
              <div class="filter-menu" :style="'left: '+(elementPosition.x-174)+'px; top: '+(elementPosition.y)+'px;'+'width: 440px !important;'" v-if="filterState.showFilter_sensing_time">

                <div class="flex align-center gap-2">
                  <div>
                    <p class="text-left">Sensing start time</p>
                    <VueDatePicker class="date-picker-input-custom" :teleport="rulesStore.viewRules === 'divide'" v-model="sensing_start_time_temp" :dark="true"
                      time-picker-inline :format="getFormattedDateTime" >
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Sensing end time</p>
                    <VueDatePicker class="date-picker-input-custom" :teleport="rulesStore.viewRules === 'divide'" v-model="sensing_end_time_temp" :dark="true"
                      time-picker-inline :format="getFormattedDateTime" >
                    </VueDatePicker>
                  </div>
                </div>

                <QtmDivider classes="my-m" />
                <div class="buttom-div">
                  <QtmButton variant="outline" color="primary" size="small"
                    @click.stop="handleFilter('reset', 'sensing_time')">Reset</QtmButton>
                  <QtmButton variant="filled" color="primary" size="small"
                    @click.stop="handleFilter(sensing_start_time_temp, 'sensing_time'), filterState.showFilter_sensing_time = false">
                    Apply</QtmButton>
                </div>

              </div>
            </Teleport>


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
            <div class="filter-menu" v-if="filterState.showFilter_comments" @click.stop>

              <QtmTextInput :value="comments" @value-changed="(event: any) => comments_temp = event.detail"
                placeholder="Search" size="small" left-icon="search" @click.stop>
              </QtmTextInput>

              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small"
                  @click.stop="handleFilter('reset', 'comments')">Reset</QtmButton>
                <QtmButton variant="filled" color="primary" size="small"
                  @click.stop="handleFilter(comments_temp, 'comments'), filterState.showFilter_comments = false">Apply
                </QtmButton>
              </div>
            </div>
          </div>
        </ClickOutSide>
      </template>

      <template #item-rule_name="item">
        <div>
          <QtmTooltip :content="item.rule_name" orientation="right" :position="'top'" :trigger="'hover'"
            :classes="'tooltip-custom'">
            <QtmTypography classes="style-text-row-table" style="white-space: nowrap;"> {{
              validateLargeText(item.rule_name,34) }}</QtmTypography>
          </QtmTooltip>
        </div>
      </template>
      <template #item-status="item">
        <div>
          <qtm-tag :dismissible="false" classes="color-tag-custom-status">
            <qtm-icon :icon="iconTagClass(item?.status)" variant="outlined" size="small"></qtm-icon>
            <qtm-typography>{{ capitalizeFirstLetter(item?.status) }}</qtm-typography>
          </qtm-tag>

        </div>
      </template>
      <template #item-sensing_time="item">
        <div style=" gap: 2px;">
          <QtmTypography classes="style-text-row-table">Start: {{ convertFormatDate(item.sensing_start_time) }}
          </QtmTypography>
          <QtmTypography classes="style-text-row-table">End: {{ convertFormatDate(item.sensing_end_time) }}
          </QtmTypography>
        </div>
      </template>
      <template #item-validity_time="item">
        <div style="gap: 2px;">
          <QtmTypography classes="style-text-row-table">Start: {{ convertFormatDate(item.validity_start_time) }}
          </QtmTypography>

          <QtmTypography classes="style-text-row-table">End: {{ convertFormatDate(item.validity_end_time) }}
          </QtmTypography>
        </div>
      </template>

      <template #item-rule_type="item">
        <div>
          <qtm-tag :label="capitalizeFirstLetter(item.rule_type === 'prohibitive' ? 'blocking' : item.rule_type)"
            size="small" :classes="`${colorTagClass(item?.rule_type)}`" :dismissible="false">
          </qtm-tag>
        </div>
        <!-- <qtm-button
              :classes="`rounded-full ${colorButtonRulesType(item.rule_type)}`"
              variant="filled"
              size="small"
              >{{ item.rule_type }}
            </qtm-button> -->
      </template>
      <template #item-users="item">
        <div>
          <QtmTypography classes="style-text-row-table">{{ getValuesAndIds(item.users, 'username') }}</QtmTypography>
        </div>
      </template>
      <template #item-creation_date="item">
        <div>
          <QtmTypography classes="style-text-row-table">{{ convertFormatDate(item.creation_date) }}</QtmTypography>
        </div>
      </template>
      <template #item-comments="item">
        <Teleport to="body">
          <RulesDetailsComment :name="item.rule_name" :id="item.rule_id" :show="verifyActiveDetails(item.rule_id)"
            @close="handleRemoveViewDetails(item.rule_id)" @minimize="minimizeDetails(item.rule_id, true)"
            :uds-groups="getValuesAndIds(item.groups.filter((items: any) => items.group_type === 'uds'), 'group_name')"
            :users="getValuesAndIds(item.users, 'user_id')"
            :shc-groups="getValuesAndIds(item.groups.filter((items: any) => items.group_type === 'shc'), 'group_name')" />
        </Teleport>
        <div style="display: flex; justify-content: space-between;">
          <div v-if="verifyActiveMinimizeDetails(item.rule_id)" class="minimise-details">
            <div>
              <QtmTooltip :content="item.rule_name" orientation="left" :position="'top'" :trigger="'hover'"
                :classes="'tooltip-custom'">
                <QtmTypography classes="style-text-row-table"> {{ validateLargeText(item.rule_name, 15) }}
                </QtmTypography>
              </QtmTooltip>

            </div>
            <div style="display: flex;">

              <qtm-icon @click="minimizeDetails(item.rule_id, false)" :icon="'open_in_full'" size="medium"
                :classes="'text-bluegrey-100 margin-right cursor-pointer'"></qtm-icon>
              <qtm-icon icon="close" @click="handleRemoveViewDetails(item.rule_id)" size="medium"
                classes="text-bluegrey-100 cursor-pointer"></qtm-icon>
            </div>

          </div>
          <QtmTooltip :content="item.comments" orientation="left" :position="'top'" :trigger="'hover'"
            :classes="'tooltip-custom'">
            <QtmTypography classes="style-text-row-table"> {{ validateLargeText(item.comments, 20) }}</QtmTypography>
          </QtmTooltip>
          <qtm-dropdown placement="bottom-right" style="cursor: pointer;">
            <qtm-dropdown-trigger>
              <QtmIcon icon="more_vert" size="large"></QtmIcon>
            </qtm-dropdown-trigger>
            <qtm-dropdown-overlay classes="modal-border">
              <qtm-menu-item-list>
                <qtm-menu-item :id="'item_details_' + item.rule_id" @click="() => handleViewDetails(item.rule_id)">
                  <qtm-menu-item-label classes="style-text-row-table " style="white-space: nowrap;">
                    <qtm-icon variant="outlined" icon="article"></qtm-icon>
                    <qtm-typography>View details </qtm-typography>
                  </qtm-menu-item-label>
                </qtm-menu-item>

                <qtm-menu-item v-if="item?.status != 'suspended'" :id="'item_clone_' + item.rule_id" :disabled="item?.status === _EXPIRED || item?.status === _CANCELLED"
                  @click="handleOptionSuspend(item)">
                  <qtm-menu-item-label classes="style-text-row-table" style="white-space: nowrap;">
                    <qtm-icon variant="outlined" icon="pause_circle"></qtm-icon>
                    <qtm-typography> Suspend </qtm-typography>
                  </qtm-menu-item-label>
                </qtm-menu-item>

                <qtm-menu-item v-if="item?.status != 'active'" :id="'item_activate_' + item.rule_id" :disabled="item?.status === _EXPIRED || item?.status === _CANCELLED"
                  @click="() => handleOptionActive(item)">
                  <qtm-menu-item-label classes="style-text-row-table " style="white-space: nowrap;">
                    <qtm-icon variant="outlined" icon="play_circle"></qtm-icon>
                    <qtm-typography>Activate </qtm-typography>
                  </qtm-menu-item-label>
                </qtm-menu-item>

                <qtm-menu-item :id="'item_edit_' + item.rule_id" :disabled="item?.status === _EXPIRED || item?.status === _CANCELLED"
                  @click="handleCurrentRuleId(item.rule_id, true, item.status === 'saved')">
                  <qtm-menu-item-label classes="style-text-row-table" style="white-space: nowrap;">
                    <qtm-icon variant="outlined" icon="edit"></qtm-icon>
                    <qtm-typography>Edit</qtm-typography>
                  </qtm-menu-item-label>
                </qtm-menu-item>
                <qtm-menu-item :id="'item_suspend_' + item.rule_id" @click="handleOptionClone(item)">
                  <qtm-menu-item-label classes="style-text-row-table" style="white-space: nowrap;">
                    <qtm-icon icon="content_copy"></qtm-icon>
                    <qtm-typography>Clone</qtm-typography>
                  </qtm-menu-item-label>
                </qtm-menu-item>

                <qtm-menu-item :id="'item_remove_' + item.rule_id" @click="handleOptionRemove(item)">
                  <qtm-menu-item-label classes="style-text-row-table" style="white-space: nowrap;">
                    <qtm-icon variant="outlined" icon="delete"></qtm-icon>
                    <qtm-typography>Remove</qtm-typography>
                  </qtm-menu-item-label>
                </qtm-menu-item>

              </qtm-menu-item-list>
            </qtm-dropdown-overlay>
          </qtm-dropdown>
        </div>

      </template>
      <template #item-mission_id="item">
        <div>
          <QtmTypography classes="style-text-row-table">{{ getValuesAndIds(item.missions, 'id') }}</QtmTypography>
        </div>

      </template>
      <template #item-acquisition_mode_id="item">
        <div>
          <QtmTypography classes="style-text-row-table">{{ getValuesAndIds(item.acq_modes, 'id') }}</QtmTypography>
        </div>
      </template>
      <template #item-acquisition_mode="item">
        <div>
          <QtmTypography classes="style-text-row-table">{{ item.acquisition_mode }}</QtmTypography>
        </div>
      </template>
      <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
        <div style="margin-right: 10px;">
          {{ rangePages }}
        </div>
        <QtmIcon icon="chevron_left" size="medium"
          :classes="'icon-left-right ' + (pagPropertyRules.lastPage ? 'cursor-disabled' : 'cursor-pointer')"
          @click=" !pagPropertyRules.lastPage ? loadFromServerRules(-serverOptionsRule.rowsPerPage) : ''"></QtmIcon>
        <QtmIcon icon="chevron_right" size="medium"
          :classes="'icon-left-right ' + ((pagPropertyRules.nextPage) ? 'cursor-disabled' : 'cursor-pointer')"
          @click=" !pagPropertyRules.nextPage ? loadFromServerRules(serverOptionsRule.rowsPerPage) : ''"></QtmIcon>
      </template>
    </EasyDataTable>
  </div>

  <Teleport to="#app">
    <RuleReport v-if="exportStore.visibleRule" :data="rulesStore.itemsSelected" />
  </Teleport>
</template>
<style scoped>
.minimise-details {
  width: 200px;
  height: 30px;
  background-color: black;
  position: absolute;
  z-index: 99;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 5px;
}

.column-filtered {
  background: #4c5dff !important;
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