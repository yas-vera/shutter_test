<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import {
  QtmTypography,
  QtmButton,
  QtmCheckbox,
  QtmIcon,
  QtmGrid,
  QtmHeaderMenuLeft,
  QtmTab,
  QtmTabs,
  QtmHeaderMenuRight,
  QtmHeaderMenu,
  QtmDivider,
  QtmTooltip,
  QtmTag,
  QtmTextInput,
  QtmDropdownSelect,
  QtmDropdownSelectOption,
} from "@qtm/vue";
import { convertFormatDate, convertFormatDateAndValidDate, convertFormatFilterShcDate, getFormattedDateTime } from "@/helpers/convertDateTime";
import {
  toggleExpand,
  isExpanded,
  colorButton,
  getValuesAndIds,
  capitalizeFirstLetter,
  countItem,
  countItems,
  bodyRowClassNameFunction,
  headerItemClassNameFunction,
  sortBy,
  sortType,
  caseInsensitiveIncludes,
  colorButtonClass,
  colorTagClass,
  getValuesAndIdsExpanded,
  getValuesSeparatedComma,
  groupRuleset,
  validateLargeText,
  iconTagClass,
  capitalizeRowsLetter,
  handleLabelMultiselectFilter
} from "@/helpers/tableHelpers";
import { headersUser } from "./config/headersTable";
import ClickOutSide from "@/components/clickoutside/ClickOutSide.vue";
import useUserTable from "./hooks/useUserTable";
import stanag_codes from "@/modules/userAndGroup/users/config/stanag_codes";
import type { FilteredItem } from "../interfaces/Iuser";
import DatePickerInput from "@/components/datePicker/DatePickerInput.vue";
import { convertFormatDateSimpleFormatDDmmyy } from "../../../helpers/convertDateTime";
import VueDatePicker from "@vuepic/vue-datepicker";
import type { Item } from "vue3-easy-data-table";
import useStanagCodes from "@/hooks/common/useStanagCodes";
import { states, statesUsers } from "@/data/selectOptions";
import { useGroupStore } from "../../../stores/groupStore";
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import type { IUserFilter, IUserFilterView } from "@/interfaces/IUser";
import { filterOptions as filterOptionsList } from "@/data/filterOptions";
import { useRulesStore } from "@/stores/rulesStore";
const {
  user_idCriteria,
  user_idCriteria_temp,
  stanag_idCriteria,
  status_criteria,
  status_criteria_temp,
  udsGroup_Criteria,
  group_shcs_Criteria,
  missions_Criteria,
  license_expiration_date_start_Criteria,
  license_expiration_date_end_Criteria,
  insertion_date_start_Criteria,
  insertion_date_start_Criteria_temp,
  insertion_date_end_Criteria,
  insertion_date_end_Criteria_temp,
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
  license_expiration_date_start_Criteria_temp,
  license_expiration_date_end_Criteria_temp,
  user_rules_header,
  tableMinHeight,
  filterOptions,
  userStore,
  toggleRowExpansion,
  isRowExpanded,
  expandedRows,
  selectedStanagIdsTemp,
  stanagSearchTerm,
  mappedDataStanag,
  handleStanagIdCheckboxChange,
  resetFilters,
  applyFilters,
  selectedStanagIds,
  filteredMappedDataStanag,
  handleFilterState,
  serverOptions,
  filterState,
  serverItemsLength,
  shcGroupsData,

  resetUdsGroupFilters,
  applyUdsGroupFilters,
  udsGroupSearchTerm,
  handleUdsGroupCheckboxChange,
  selectedUdsGroupIdsTemp,
  filteredMappedDataUdsGroup,
  
  applyShcGroupFilters,
  resetShcGroupFilters,
  shcGroupSearchTerm,
  handleShcGroupCheckboxChange,
  selectedShcGroupIdsTemp,
  filteredMappedDataShcGroup,

  missionGroupSearchTerm,
  filteredMappedDataMissionGroup,
  applyMissionGroupFilters,
  resetMissionGroupFilters,
  handleMissionGroupCheckboxChange,
  selectedMissionGroupIdsTemp,

  offsetValue,
  pagProperty,
  loadFromServer,
  rangePagesUser,
  getDataSelect
} = useUserTable();
const userAndGroups = useUserAndGroupStore()
const rulesStore = useRulesStore()
const handleSortChange = (sortDetails: any) => {
  const sortedColumn = sortDetails.column;
  const sortOrder = sortDetails.order;
  
};
const isTooltipTargetReady = ref(false);

const handleFilter = (value: any, type: string) => {
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
const resetFiltersInTableUser = () => {
  for (const [key, value] of Object.entries(userStore.selectedFilters)) {
    handleFilter('reset', key);
  }

  userStore.resetFilters();
}

const hasFormDataFilterUsersValues = computed(() => {
  return Object.values(userStore.selectedFilters).some(value => value !== '' && value.length > 0);
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

function handleClick(event: any) {
  if (event.target.classList.contains('partSelected')) {
    console.log('Se hizo clic en un elemento con la clase "partSelected"');
  }
}

onMounted(async() => {
  document.addEventListener('click', handleClick);
  isTooltipTargetReady.value = true;
  resetFiltersInTableUser();
  capitalizeRowsLetter()
  await rulesStore.dataRulesNameAll()

});

//! fix selected items
watch(() => userStore.itemsSelected, (newValue, lastValue) => {
  if(newValue.length === 0) return
  if (Array.isArray(lastValue) && Array.isArray(newValue)) {
      lastValue.forEach(lastItem => {
        const existsInNew = newValue.some(newItem => newItem.user_id === lastItem.user_id);

        if (!existsInNew) {
          userStore.itemsSelected = [
            lastItem,
            ...userStore.itemsSelected,
          ]
        }
      });

      if(newValue.length < lastValue.length) {
        const itemsToRemove = userStore.itemsSelected.filter(selectedItem => 
          !newValue.some(newItem => newItem.user_id === selectedItem.user_id) ||
          !lastValue.some(lastItem => lastItem.user_id === selectedItem.user_id)
        );
  
        if(itemsToRemove.length !== userStore.itemsSelected.length) {
          if(itemsToRemove.length < userStore.userData.length) {
            userStore.itemsSelected = userStore.itemsSelected.filter(selectedItem =>  selectedItem.user_id !== itemsToRemove[0].user_id);
          }
        }
      }

    }
},{ deep: true });

onUnmounted(async () => {
  //userStore.itemsSelected = [];
  await userStore.dataSelectUser()
});
</script>
<template>
  <div class="define-tooltip-custom">
    <div class="filters-options-custom">
      <template v-for="value in Object.entries(userStore.selectedFilters)" :key="value[0]">
              <qtm-tag size="medium" classes="color-button-status-active style-custom-tag custom-tag"
                  :dismissible="true" v-if="value[1] !== '' && value[1].length > 0"
                  @clicked-tag-button-event="handleFilter('reset', value[0]);">
                  <span v-html="viewLabelFilter(value)"></span>
              </qtm-tag>
          </template>

          <qtm-typography classes="text-bluegrey-100 custom-clear-all style-custom-tag" :font-size="7"
              font-weight="normal" font-family="roboto" v-show="hasFormDataFilterUsersValues"
              @click="() => { resetFiltersInTableUser(); }">
              Clear All
          </qtm-typography>
   </div>
   <div style="display: flex; justify-content: space-between;" v-if="userAndGroups.showFormAddShcGroup()">
        <div  style="margin-bottom: 15px; margin-top: 10px;">
              <qtm-typography :classes="'subtitle-custom-font'">{{userAndGroups.labelUserAndGroup()}}</qtm-typography>
      </div>
      <div class="button-export-user-and-groups2">
        <qtm-button 
          size="medium"
          left-icon="download"
          :disabled="userStore.itemsSelected.length == 0"
          :props="{
              id:'exportUsersButton'
          }"
          classes="text-scale-7 bg-bluegrey-700"
          @click-event="userAndGroups.handleShowModalExportUserAndGroup()">
          Export {{userAndGroups.labelUserAndGroup()}}
        </qtm-button>
      </div>
    </div>
    <EasyDataTable
      :body-row-class-name="(item:Item, rowNumber:number) => bodyRowClassNameFunction(item, rowNumber, isRowExpanded(item.user_id))"
      :header-item-class-name="headerItemClassNameFunction"
      v-model:items-selected="userStore.itemsSelected"
      header-class-name="header-class-name"
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headersUser"
      :items="userStore.userData"
      theme-color="#4c5dff"
      table-class-name="customize-table"
      class="table-custom-sortType"
      header-text-direction="left"
      body-text-direction="left"
      font-family="Roboto, sans-serif"
      :sort-type="sortType"
      :sort-change="handleSortChange"
      multi-sort
      :table-height="tableMinHeight"
      style="z-index: 140"
      :rows-items="[10, 25, 50, 100, 250, 500]"
      :rows-per-page="10"
      alternating
      :filter-options="filterOptions"
      fixed-checkbox
      :checkbox-column-width="45"
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

            <qtm-icon
              icon="filter_list"
              :class="`column-filter ${user_idCriteria.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('showUser_idFilter')"
            ></qtm-icon>

            <div class="filter-menu" v-if="filterState.showUser_idFilter">
              <QtmTextInput
                :value="user_idCriteria"
                @value-changed="(event:any) =>  user_idCriteria_temp = event.detail "
                placeholder="Search"
                size="small"
                left-icon="search"
                @click.stop
              >
              </QtmTextInput>

              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small"
                     @click.stop="handleFilter('reset', 'user_id')"
                  >Reset</QtmButton>
                <QtmButton variant="filled" color="primary" size="small"
                  @click.stop="handleFilter(user_idCriteria_temp, 'user_id'), filterState.showFilter_id = false">Apply</QtmButton>
              </div>

            </div>
          </div>
        </ClickOutSide>
      </template>
      <template #header-country="header">
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

            <qtm-icon
              icon="filter_list"
               :class="`column-filter ${selectedStanagIdsTemp && selectedStanagIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('showStanag_idFilter')"
            ></qtm-icon>

            <div class="filter-menu" v-if="filterState.showStanag_idFilter">
              <div @click.stop>
                <QtmTextInput
                  :value="stanagSearchTerm"
                  @value-changed="(event:any) => stanagSearchTerm = event.detail "
                  placeholder="Search"
                  size="small"
                  left-icon="search"
                  @click.stop 
                >
                </QtmTextInput>
                <QtmDivider classes="my-m" />
                <div class="filter-menu-list-checkbox">
                  <ul v-for="itemsCountry in filteredMappedDataStanag">
                    <li>
                      <qtm-checkbox
                        @change="
                          handleStanagIdCheckboxChange(itemsCountry.value)
                        "
                        :value="itemsCountry.value"
                        :checked="
                          selectedStanagIdsTemp.includes(
                            itemsCountry.value ? itemsCountry.value : ''
                          )
                        "
                      >
                        {{ itemsCountry.label }}
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

            <qtm-icon
              icon="filter_list"
              :class="`column-filter ${status_criteria.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('showStatus_header')"
            ></qtm-icon>

            <div
              class="filter-menu"
              v-if="filterState.showStatus_header"
              @click.stop
            >
              <qtm-dropdown-select
                size="small"
                @value-changed="(event:any) => status_criteria_temp = event.detail.valueChanged"
                :value="status_criteria"
              >
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
                  >Apply</QtmButton>
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

            <qtm-icon
              icon="filter_list"
              :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedUdsGroupIdsTemp && selectedUdsGroupIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('udsGroup_header')"
            ></qtm-icon>
         
            <div class="filter-menu" v-if="filterState.udsGroup_header">
              
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
                <div class="filter-menu-list-checkbox">
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

            <qtm-icon
              icon="filter_list"
              size="medium"
              :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedShcGroupIdsTemp && selectedShcGroupIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('group_shcs_header')"
            ></qtm-icon>

            <div class="filter-menu" v-if="filterState.group_shcs_header">
              
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
                <div class="filter-menu-list-checkbox">
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
            <qtm-icon
              icon="filter_list"
              size="medium"
               :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedMissionGroupIdsTemp && selectedMissionGroupIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('missions_header')"
            ></qtm-icon>

            <div class="filter-menu" v-if="filterState.missions_header">
             
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
                <div class="filter-menu-list-checkbox">
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
        <ClickOutSide
          @clickoutside="filterState.insertion_date_date_header = false"
        >
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

            <qtm-icon
              icon="filter_list"
              size="medium"
              :class="`column-filter ${((insertion_date_start_Criteria && insertion_date_start_Criteria.toString().length > 0) || (insertion_date_end_Criteria && insertion_date_end_Criteria.toString().length > 0)) ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('insertion_date_date_header')"
            ></qtm-icon>

            <div
              class="filter-menu"
              style="width: 420px !important"
              v-if="filterState.insertion_date_date_header"
            >
             
              <div class="flex align-center gap-2">

                <div>
                    <p class="text-left">Subscription date start</p>
                    <VueDatePicker                    
                      v-model="insertion_date_start_Criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Subscription date end</p>
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
        <ClickOutSide
          @clickoutside="filterState.license_expiration_date_header = false"
        >
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

            <qtm-icon
              icon="filter_list"
              size="medium"
              :class="`column-filter ${((license_expiration_date_start_Criteria && license_expiration_date_start_Criteria.toString().length > 0) || (license_expiration_date_end_Criteria && license_expiration_date_end_Criteria.toString().length > 0)) ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('license_expiration_date_header')"
            ></qtm-icon>

            <div
              class="filter-menu"
              style="width: 438px !important"
              v-if="filterState.license_expiration_date_header"
            >
            
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

            <qtm-icon
              icon="filter_list"
              size="medium"
               :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${user_rules_Criteria.length > 0 ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('user_rules_header')"
            ></qtm-icon>

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
        <div style="display: flex; align-items: center">
          <div style="margin-right: 10px; margin-left: -5px">
            <qtm-tooltip
              orientation="top"
              tip-position="center"
              :content="`Added on ${convertFormatDateSimpleFormatDDmmyy(
                item.creation_date
              )}`"
            >
              <div
                style="
                  display: absolute;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background-color: #57fc53;
                "
              ></div>
            </qtm-tooltip>
          </div>

          <QtmIcon
            :icon="isRowExpanded(item.user_id) ? 'expand_less' : 'expand_more'"
            size="medium"
            variant="outlined"
            style="cursor: pointer"
            @click="
              () => {
                toggleRowExpansion(item.user_id);
              }
            "
          >
          </QtmIcon>
          <span style="margin-left: 3px">{{ item.user_id }} </span>
        </div>
      </template>
      <template #item-status="item">
        <div>
          <qtm-tag
            :label="capitalizeFirstLetter(item?.status)"
            size="small"
            :classes="colorButtonClass(item?.status)"
            :dismissible="false"
          >
          </qtm-tag>
        </div>
      </template>
      <template #item-creation_date="items">
        <div>
          <p>{{ convertFormatDate(items.creation_date) }}</p>
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
            <div style="margin-bottom: 3px" v-if="index === 0">
              <qtm-button
                classes="rounded-full"
                variant="filled"
                size="small"
                color="success"
                >{{ capitalizeFirstLetter(rule?.status) }}
              </qtm-button>
            </div>
          </li>
          <li v-for="(rule, index) in items.user_rules" :key="rule.id">
            <div
              style="display: flex; gap: 5px; margin-top: 10px"
              v-if="isExpanded(items.user_rules, index)"
            >
              <qtm-button
                classes="rounded-full"
                variant="filled"
                size="small"
                :color="colorButton(rule?.status)"
                >{{ capitalizeFirstLetter(rule?.status) }}
              </qtm-button>
            </div>
          </li>
        </ul>
      </template>
      <template #item-missions="items">
        <div
          v-html="
            getValuesAndIdsExpanded(
              items.missions,
              'id',
              isRowExpanded(items.user_id)
            )
          "
        ></div>
      </template>
      <template #item-schedule_acquisition="items">
        <div style="display: flex">
          <qtm-checkbox checked></qtm-checkbox>
          <p>Allowed</p>
        </div>
      </template>
      <template #item-accessCatalogue="items">
        <div style="display: flex; justify-content: space-between">
          <div style="display: flex">
            <qtm-checkbox> </qtm-checkbox>
            <p>Allowed</p>
          </div>
          <qtm-icon size="medium" icon="more_vert"></qtm-icon>
        </div>
      </template>
      <template #item-group_shcs="items">
        <div
          v-html="
            getValuesAndIdsExpanded(
              items.group_shcs,
              'group_name',
              isRowExpanded(items.user_id)
            )
          "
        ></div>
      </template>
      <template #item-license_expiration_date="items">
        <div>
          <p>{{ convertFormatDate(items.license_expiration_date) }}</p>
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
  </div>
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

.filter-icon {
  position: absolute !important;
  right: 33px !important;
  font-size: 18px !important;
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
.filters-options-custom{
  display: flex;
  align-items: center;
  gap:5px;
  margin-top:
  10px; height: 45px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #3b3d50 #1c1d26;
}
</style>
