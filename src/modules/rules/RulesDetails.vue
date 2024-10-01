<script setup lang="ts">
import ClickOutSide from "@/components/clickoutside/ClickOutSide.vue";
import DetailsCustom from "@/components/tableCustom/DetailsCustom.vue";
import { convertFormatDateHour, convertFormatDate, getFormattedDateTime, convertFormatFilterDate, convertTextTruncate, convertFormatDateAndValidDate } from "@/helpers/convertDateTime";
import { bodyRowClassNameFunction, caseInsensitiveIncludes, colorButtonEventType, capitalizeFirstLetter, validateLargeText, colorTagClass, sortType, capitalizeRowsLetter, handleLabelMultiselectFilter } from "@/helpers/tableHelpers";
import { useMapViewStore } from "@/stores/mapViewStore";
import { useRulesStore } from "@/stores/rulesStore";
import { useUserStore } from "@/stores/userStore";
import { QtmTypography, QtmButton, QtmTextInput, QtmCheckbox, QtmIcon, QtmDivider } from "@qtm/vue";
import { onMounted, ref, watch, computed, watchEffect, isRef } from "vue";
import type { FilterOption, Header, Item, ServerOptions } from "vue3-easy-data-table";
import VueDatePicker from '@vuepic/vue-datepicker';
import { useScreenStore } from "@/stores/screenStore";
import type { IAoiDraw } from "@/interfaces/IDraw";
import ModalExport from "@/components/modal/ModalExport.vue";
import { useMissionStore } from "@/stores/missionStore";
import RuleHistoryReport from "@/components/export/ruleHistory/RuleHistoryReport.vue";
import { useExportStore } from "@/stores/exportStore";
import { sourcetypeModeList } from "@/data/selectOptions";
import { useSatDataStore } from "@/stores/satDataStore";
import aoiService from "@/services/aoiService";
import * as ol from "ol";
import { filterOptions } from "@/data/filterOptions";
import { resetField, resetFields } from "@/helpers/filterSearchHelper";
import RuleHistoryCompressedReport from "@/components/export/ruleHistory/RuleHistoryCompressedReport.vue";
// import RuleHistoryExport from "./htmlExport/RuleHistoryExport.vue";
const rulesStore = useRulesStore()
const mapStore = useMapViewStore()
const screenStore = useScreenStore();
const exportStore = useExportStore()
const userStore = useUserStore()
const idsExport = ref()
const rangePages = ref<string>('')
const offsetValue = ref(0)
const serverItemsLength = ref(0);
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'id',
  sortType: 'desc',
});
let previousRowsPerPage = ref<number>(serverOptions.value.rowsPerPage);
const pagProperty = ref({
  nextPage:false,
  lastPage:false
})
const {
  offsetValueDetailRules,
  pagPropertyDetailRules,
  loadFromServerDetailRules,
  serverItemsDetailRulesLength,
  serverOptionsDetailRules,
  resetOffsetValueDetailRules,
  rulesDataDetailRulesCount,
  getConflict,
  conflictData,
  getConflictRules
} = useMissionStore();
const satDataStore = useSatDataStore();
const userSelected = ref<any[]>([])
const emits = defineEmits<{
  (e: 'showExport'): void
}>();

const headers: Header[] = [
  { text: "SR ID", value: "sr_id", width: 180, sortable: true },
  { text: "User ID", value: "user_id", width: 134 , sortable: true},
  { text: "Source Type", value: "source", width: 177, sortable: true  },
  { text: "AoI ID", value: "aois", width: 180, sortable: false },
  { text: "Mission & sensor", value: "aois_mission_sensor", sortable: true , width: 200 },
  { text: "Acquisition mode", value: "aois_acquisition_mode", sortable: true, width: 200 },
  { text: "Rules", value: "aois_rules",  sortable: false, width: 364 },
  { text: "Sensing time", value: "aois_sensing_time", sortable: true ,width: 221 },
  { text: "Event date", value: "enforcement_time", sortable: true, width: 221 },
];

const historyRules = ref<any>(null);
const selectedCheckboxes: any = ref({});
let srSelected: any = []
let paddingCustom = [125, 125, 125, 125]

// filter by column
const sr_id = ref("");
const sr_id_temp = ref("");
const source_type = ref("");
const source_type_temp = ref("");
const mission = ref("");
const missionSearchTerm = ref<string>('');
const selectedMissionIdsTemp = ref<string[]>([]);

const acquisitionModeSearchTerm = ref<string>('');
const selectedAcquisitionModeIds = ref<string[]>([]);
const selectedAcquisitionModeIdsTemp = ref<string[]>([]);

const acquisition_mode = ref("");
const rule_name = ref<string[]>([]);
const rule_name_search = ref("");
const rule_name_temp = ref<string[]>([]);

const sensing_start_time = ref<any>("");
const sensing_end_time = ref<any>("");
const sensing_start_time_temp = ref<any>("");
const sensing_end_time_temp = ref<any>("");


const enforcement_start_time = ref<any>("");
const enforcement_end_time = ref<any>("");
const enforcement_start_time_temp = ref<any>("");
const enforcement_end_time_temp = ref<any>("");
const users_id = ref<any>("");
const aois_id = ref<any>("");
const userSearchTerm = ref<string>('');
const aoiSearchTerm = ref<string>('');
const selectedUserIdsTemp = ref<string[]>([]);
const selectedUserIds = ref<string[]>([]);
const selectedAoisIdsTemp = ref<string[]>([]);
const selectedAoisIds = ref<string[]>([]);
const itemsMission = ref<any>([]);
const itemsRules  = ref<any>([]);
const itemsAcquisitionMode = ref<any>([]);
const itemsAois = ref<any>([]);
const itemsUsers = ref<any>([]);
const labelArea = ref('')
const formDataFilter = ref({
    sr_id,
    source_type,
    mission,
    acquisition_mode,
    rule_name,
    sensing_start_time,
    sensing_end_time,
    enforcement_start_time,
    enforcement_end_time,
    users_id,
    aois_id,
    selectedAcquisitionModeIds,
    selectedUserIds,
    selectedAoisIds
});
const formDataFilterTemp = ref({
    sr_id_temp,
    source_type_temp,
    missionSearchTerm,
    selectedMissionIdsTemp,
    acquisitionModeSearchTerm,
    selectedAcquisitionModeIdsTemp,
    rule_name_search,
    rule_name_temp,
    sensing_start_time_temp,
    sensing_end_time_temp,
    enforcement_start_time_temp,
    enforcement_end_time_temp,
    selectedUserIdsTemp,
    userSearchTerm,
    selectedAoisIdsTemp,
    selectedAcquisitionModeIds
});
const hasFormDataFilterValues = computed(() => {
    return Object.values(formDataFilter.value).some(value => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== '';
    });
});

const resetFormDataFilter = () => {
    resetFields(formDataFilter.value);
    resetFields(formDataFilterTemp.value);
};

const handleTagClick = (key: string) => {
    resetField(formDataFilter.value, key as keyof typeof formDataFilter.value);
    resetField(formDataFilterTemp.value, key as keyof typeof formDataFilterTemp.value);
};

watch(() => userSelected.value.length, () => {
  if (userSelected.value.length == 0) {
    srSelected.forEach((item: any) => {
      item.aois.forEach((aoi: any) => {
        handleCheckboxChange(aoi, { target: { checked: false } }, true)
      });
    });
  } else {
    const removedItems = srSelected.filter((item: any) => !userSelected.value.includes(item));
    removedItems.forEach((item: any) => {
      item.aois.forEach((aoi: any) => {
        handleCheckboxChange(aoi, { target: { checked: false } }, true)
      });
    });
  }
  drawAoi()
});

watch(() => rulesStore.aoiSelected.length, () => {
  drawAoi()
});
const handleFilter = (value: any, type: string) => {
  if (type === 'sr_id' && value !== 'reset') {
    sr_id.value = value;
  }
  if (type === 'sr_id' && value === 'reset') {
    sr_id.value = '';
    sr_id_temp.value = '';
  }
  if (type === 'sensing_time' && value !== 'reset') {
    sensing_start_time.value = sensing_start_time_temp.value;
    sensing_end_time.value = sensing_end_time_temp.value;
  }
  if (type === 'sensing_time' && value === 'reset') {
    sensing_start_time.value = ''
    sensing_start_time_temp.value = '';
    sensing_end_time.value = ''
    sensing_end_time_temp.value = '';
  }
  if (type === 'enforcement_time' && value !== 'reset') {
    enforcement_start_time.value = enforcement_start_time_temp.value;
    enforcement_end_time.value = enforcement_end_time_temp.value;
  }
  if (type === 'enforcement_time' && value === 'reset') {
    enforcement_start_time.value = ''
    enforcement_start_time_temp.value = '';
    enforcement_end_time.value = ''
    enforcement_end_time_temp.value = '';
  }
  if (type === 'rule_id' && value !== 'reset') {
    rule_name.value = value;
  }
  if (type === 'rule_id' && value === 'reset') {
    rule_name.value = [];
    rule_name_search.value = '';
    rule_name_temp.value = [];
  }
  if( type === 'acquisition_mode_id' && value !=='reset'){
    selectedAcquisitionModeIds.value = value
  }
  if( type === 'acquisition_mode_id' && value ==='reset'){
    selectedAcquisitionModeIds.value = []
    selectedAcquisitionModeIdsTemp.value = []
    acquisitionModeSearchTerm.value = ''
  }
  if( type === 'source_type' && value !== 'reset'){
    source_type.value = value
  }
  if( type === 'source_type' && value === 'reset'){
    source_type.value = ''
    source_type_temp.value = ''
  }
  if( type === 'mission' && value !== 'reset'){
    mission.value = value
  }
  if( type === 'mission' && value === 'reset'){
    mission.value = ''
    source_type_temp.value = ''
    selectedMissionIdsTemp.value = []
  }

}
const handleCheckboxChange = (item: any, event: any, reset = false, sr_id?: string | number) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    rulesStore.aoiSelected.push({ ...item, sr_id });
  } else {
    rulesStore.aoiSelected = rulesStore.aoiSelected.filter( (x:any) => x.id != item.id )
  }
  selectedCheckboxes.value[item.id] = reset ? undefined : isChecked;
};

const handleCheckboxChangeOptionTeleport = (event: any, option: string) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    let dataRule = [...userSelected.value]
    if (option == 'rule' || option == 'aoi') {
      dataRule.forEach((item: any) => {
        item.aois.forEach((aoi: any) => {
          aoi.rules.forEach((rule: any) => {
            let exist = rulesStore.itemsSelected.find((itemSelected: any) => itemSelected.rule_id === rule.rule_id);
            if (exist) {
              item.geometryArea = {
                area_wkt: exist.geometry.area_wkt,
                colorType: rule.rule_type,
                idAoi: item.sr_id ? item.sr_id : item.id
              }
            }
          })
        });
      });
    }
    if (option == 'aoi') {
      let dataAoi = [...userSelected.value]
      dataAoi.forEach((item: any) => {
        item.aois.forEach((aoi: any) => {
          if (!selectedCheckboxes.value[aoi.id]) {
            selectedCheckboxes.value[aoi.id] = true;
            if (!rulesStore.aoiSelected.some((existingAoi: any) => existingAoi.id === aoi.id)) {
              rulesStore.aoiSelected.push({ ...aoi, sr_id: item.sr_id });
            }
          }
        });
      });
    }

    const ruleSelections = dataRule.map(item => mapAoiDraw('Rule', item, 'area'));
    const userSelections = userSelected.value.map(item => mapAoiDraw('SR', item, 'aoi', undefined, item?.sr_id ? item?.sr_id : 'N/A'));
    const aoiSelections = rulesStore.aoiSelected.map((item: any) => mapAoiDraw('AoI', item, 'aoi', item.geometry?.rule_type, item?.sr_id ? item?.sr_id : item.id, true));
    const selectedAreasDraw = [...ruleSelections, ...aoiSelections, ...userSelections ];
    mapStore.selectAOIdrawCustom(selectedAreasDraw, {}, paddingCustom);
    dataRule.forEach((item: any) => {
      delete item.geometryArea;
    });
  } else {
    if (option == 'aoi') {
      let dataAoi = [...userSelected.value]
      dataAoi.forEach((item: any) => {
        item.aois.forEach((aoi: any) => {
          handleCheckboxChange(aoi, { target: { checked: false } })
        });
      });
    }
    drawAoi()

  }
};

const mapAoiDraw = (nameValue: string, item: any, option: string, defaultColor = 'white', id?: string, isAoi?: boolean) => ({
  wkt: option == 'area' ? item.geometryArea.area_wkt : item.geometry.area_wkt,
  colorType: option == 'area' ? item.geometryArea.colorType : isAoi ? 'aoi' : item.colorType || defaultColor,
  idAoi: option == 'area' ? (item.sr_id ? item.sr_id : item.geometryArea.idAoi) : id,
  name: nameValue
});

const drawAoi = () => {
  const hasSelections = userSelected.value.length > 0 || rulesStore.aoiSelected.length > 0;
  let dataRule: any = []
  if (hasSelections) {
    if (historyRules.value.$el.checked && userSelected.value.length > 0) {
      dataRule = [...userSelected.value]
      dataRule.forEach((item: any) => {
        item.aois.forEach((aoi: any) => {
          aoi.rules.forEach((rule: any) => {
            let exist = rulesStore.itemsSelected.find((itemSelected: any) => itemSelected.rule_id === rule.rule_id);
            if (exist) {
              item.geometryArea = {
                area_wkt: exist.geometry.area_wkt,
                colorType: rule.rule_type,
                idAoi: item.id
              }
            }
          })
        });
      });
    }

    
    if (userSelected.value.length > 0) {
      let dataAoiOriginal: any[] = [...rulesStore.aoiSelected];
      let dataAoi: any[] = [];
      let addedAoiIds: Set<number> = new Set(dataAoiOriginal.map(aoi => aoi.id));

      userSelected.value.forEach((item: any) => {
        item.aois.forEach((aoi: any) => {
          if ((selectedCheckboxes.value[aoi.id] === undefined || selectedCheckboxes.value[aoi.id] == true) && !addedAoiIds.has(aoi.id)) {
            dataAoi.push({ ...aoi, sr_id: item.sr_id });
            selectedCheckboxes.value[aoi.id] = true;
            addedAoiIds.add(aoi.id);
          }
        });
      });
      
      rulesStore.aoiSelected = [...dataAoiOriginal, ...dataAoi];
    }
    
    const ruleSelections = dataRule.map((item: any) => mapAoiDraw('Rule', item, 'area'));
    const userSelections = userSelected.value.map(item => mapAoiDraw('SR', item, 'aoi', undefined, item?.sr_id ? item?.sr_id : 'N/A'));
    const aoiSelections = rulesStore.aoiSelected.map((item: any) => mapAoiDraw('AoI', item, 'aoi', item.geometry?.rule_type, item?.aoi_id ? item?.aoi_id : item.aoi_id, true));

    const selectedAreasDraw = [...ruleSelections, ...aoiSelections, ...userSelections];

    if(selectedAreasDraw.length > 0){
      addTooltip()
    } 
    mapStore.selectAOIdrawCustom(selectedAreasDraw, {}, paddingCustom);
    rulesStore.selectedAoisViewIds = selectedAreasDraw.map((x) => x.idAoi)
    dataRule.forEach((item: any) => {
      delete item.geometryArea;
    });
  } else {
    mapStore.restoreZoom();
    mapStore.removeVectorLayer();
  }
  srSelected = userSelected.value
};

const addTooltip = () => {
  const tooltipElement = document.getElementById("tooltipHistory");
  let tooltipOverlay: any;

  if (tooltipElement) {
    tooltipOverlay = new ol.Overlay({
      element: tooltipElement,
      offset: [0, -10],
      positioning: "bottom-center",
    });
    
    mapStore.map.addOverlay(tooltipOverlay);
    
    mapStore.map.on("pointermove", function (event: any) {
        if (event.dragging || mapStore.isDrawActive) {
          tooltipOverlay.setPosition(undefined);
          return;
        }
       const hoveredFeature = mapStore.map.forEachFeatureAtPixel(
        event.pixel,
        function (feature: any) {
          return feature;
        }
      );
      if (hoveredFeature == undefined) {
        if (tooltipOverlay) {
          tooltipOverlay.setPosition(undefined);
        }
        return;
      }
      const features = hoveredFeature.values_;
      if (features) {
        const featureProperties = features;
        if (featureProperties.idFigure ) {
          const coordinate = event.coordinate;
          const figure = featureProperties.figureType + ' ID : '
          const featureInfo = `<div class="tooltip-custom-map">
                                  <p><strong>${figure}</strong>${convertTextTruncate(100, featureProperties.idFigure)} </p>
                                </div>`;
          tooltipElement.innerHTML = featureInfo;
          tooltipOverlay.setPosition(coordinate);
          return;
        }
      }

      tooltipOverlay.setPosition(undefined);
      
    });
  }
};

const expandAndMinus = () => {
  rulesStore.risizeRuleDetail()
}

const computedClass: any = computed(() => {
  if (!rulesStore.expandDetailRule) {
    rulesStore.modalContentChangeRuleHistory = rulesStore.modalContentDefaulftRuleHistory
  }
  return {
    'text-dark-neutral-default': true,
    'qtm-rotate-apply-action': true,
    'cursor-pointer': true,
    'qtm-rotate-expand-more': !rulesStore.expandDetailRule,
    'qtm-rotate-expand-minus': rulesStore.expandDetailRule,
  };
});

const expandedRows = ref<number[]>([]);

const toggleRowExpansion = (idx: number) => {
  const index = expandedRows.value.indexOf(idx);
  if (index !== -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(idx);
  }
};
const isRowExpanded = (idx: number) => {
  return expandedRows.value.includes(idx);
};

const valueSelect = ref<any>('');

watch( () => valueSelect.value, async (newValue) => {
  
  rulesStore.activeRulesDetailId(newValue)
  // const keyValueObject = processFilterOptions();
  // await fetchRulesData(keyValueObject);
  resetValueFilter()
});

const marginRightModal = computed(() => {
  if (rulesStore.modalContentChangeRuleHistory <= rulesStore.modalContentDefaulftRuleHistory) {
    return '10px'
  } else {
    const extraPixels = rulesStore.modalContentChangeRuleHistory - rulesStore.modalContentDefaulftRuleHistory;

    const extraMargin = Math.floor(extraPixels / 10) * 10;
    return `${10 + extraMargin}px`;
  }
})

// filter by column
const filteredMappedDataUser  = computed<any[] >(() => {
  if(itemsUsers.value) {
    const dataFilter:any = itemsUsers.value
    const searchTerm = userSearchTerm.value.toLowerCase();
    return dataFilter.filter((item:any) => item.label?.toLowerCase().includes(searchTerm));
  }
});

const filteredMappedDataAoi  = computed<any[] >(() => {
  if(itemsAois.value) {
    const dataFilter:any = itemsAois.value
    const searchTerm = aoiSearchTerm.value.toLowerCase();
    return dataFilter.filter((item:any) => item.label?.toLowerCase().includes(searchTerm));
  }
});
const filteredMappedDataMission  = computed<any[] >(() => {
  if(itemsMission.value) {
    const dataFilter:any = itemsMission.value
    const searchTerm = missionSearchTerm.value.toLowerCase();
    return dataFilter.filter((item:any) => item.label?.toLowerCase().includes(searchTerm));
  }
});
const filteredMappedDataAcquisitionMode  = computed<any[] >(() => {
  if(itemsAcquisitionMode.value) {
    const dataFilter:any = itemsAcquisitionMode.value
    const searchTerm = acquisitionModeSearchTerm.value.toLowerCase();
    return dataFilter.filter((item:any) => item.label?.toLowerCase().includes(searchTerm));
  }
});
const filteredMappedDataRules  = computed<any[] >(() => {
  if(itemsRules.value) {
    const dataFilter:any = itemsRules.value
    const searchTerm = rule_name_search.value.toLowerCase();
    return dataFilter.filter((item:any) => item.label?.toLowerCase().includes(searchTerm));
  }
});

const handleUserCheckboxChange = (value:string | undefined) => {
    if(value === undefined){
        return
    }
    if (selectedUserIdsTemp.value.includes(value)) {
        selectedUserIdsTemp.value = selectedUserIdsTemp.value.filter(item => item !== value);
    } else {
        selectedUserIdsTemp.value.push(value);
    }
};

const handleAoiCheckboxChange = (value:string | undefined) => {
    if(value === undefined){
        return
    }
    if (selectedAoisIdsTemp.value.includes(value)) {
        selectedAoisIdsTemp.value = selectedAoisIdsTemp.value.filter(item => item !== value);
    } else {
        selectedAoisIdsTemp.value.push(value);
    }
};
const handleMissionCheckboxChange = (value:string | undefined) => {
    if(value === undefined){
        return
    }
    if (selectedMissionIdsTemp.value.includes(value)) {
        selectedMissionIdsTemp.value = selectedMissionIdsTemp.value.filter(item => item !== value);
    } else {
        selectedMissionIdsTemp.value.push(value);
    }
};
const handleRuleCheckboxChange = (value:string | undefined) => {
    if(value === undefined){
        return
    }
    if (rule_name_temp.value.includes(value)) {
        rule_name_temp.value = rule_name_temp.value.filter(item => item !== value);
    } else {
        rule_name_temp.value.push(value);
    }
};
const handleAcquisitionModeCheckboxChange = (value:string | undefined) => {
    if(value === undefined){
        return
    }
    if (selectedAcquisitionModeIdsTemp.value.includes(value)) {
        selectedAcquisitionModeIdsTemp.value = selectedAcquisitionModeIdsTemp.value.filter(item => item !== value);
    } else {
        selectedAcquisitionModeIdsTemp.value.push(value);
    }
};

const applyUserFilters = () => {
    selectedUserIds.value = [...selectedUserIdsTemp.value];
};

const resetUserFilters = () => {
  selectedUserIdsTemp.value = [];
  selectedUserIds.value = [];
}

const applyAoiFilters = () => {
    selectedAoisIds.value = [...selectedAoisIdsTemp.value];
};

const resetAoiFilters = () => {
  selectedAoisIdsTemp.value = [];
  selectedAoisIds.value = [];
}

const filterOptionsRulesDetail = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = [];
  if (sr_id.value !== "") {
    filterOptionsArray.push({
      field: "sr_id",
      criteria: sr_id.value,
      comparison: () => true,
    });
  }
  if (source_type.value !== "") {
    filterOptionsArray.push({
      field: "source",
      criteria: source_type.value,
      comparison: caseInsensitiveIncludes,
    });
  }
  if (mission.value !== "") {
    filterOptionsArray.push({
      field: "mission_id",
      criteria: mission.value,
      comparison: caseInsensitiveIncludes,
    });
  }
  if (Array.isArray(selectedAcquisitionModeIds.value)) {
    if (selectedAcquisitionModeIds.value.length > 0) {
      filterOptionsArray.push({
        field: "acquisition_mode_id",
        comparison: "in",
        criteria: selectedAcquisitionModeIds.value,
      });
    }
  }
  if (Array.isArray(rule_name.value)) {
    if (rule_name.value.length > 0) {
      filterOptionsArray.push({
        field: "rule_id",
        comparison: "in",
        criteria: rule_name.value,
      });
    }
  }
  if (sensing_start_time.value !== "" && sensing_start_time.value !== null
    ) {
      const creationDate = new Date(sensing_start_time.value);
      const criteriaDateString = creationDate.toISOString();

      filterOptionsArray.push({
        field: "sensing_start_time",
        comparison: () => true,
        criteria: convertFormatFilterDate(criteriaDateString),
      });
    }
  if (sensing_end_time.value !== "" && sensing_end_time.value !== null) {
    const creationDate = new Date(sensing_end_time.value);
    const criteriaDateString = creationDate.toISOString();
    filterOptionsArray.push({
      field: "sensing_end_time",
      comparison: () => true,
      criteria: convertFormatFilterDate(criteriaDateString),
    });
  }
  if (enforcement_start_time.value !== "" && enforcement_start_time.value !== null) {
    const creationDate = new Date(enforcement_start_time.value);
    const criteriaDateString = creationDate.toISOString();

    filterOptionsArray.push({
      field: "enforcement_start_time",
      comparison: () => true,
      criteria: convertFormatFilterDate(criteriaDateString),
    });
  }
  if (enforcement_end_time.value !== "" && enforcement_end_time.value !== null) {
    const creationDate = new Date(enforcement_end_time.value);
    const criteriaDateString = creationDate.toISOString();
    filterOptionsArray.push({
      field: "enforcement_end_time",
      comparison: () => true,
      criteria: convertFormatFilterDate(criteriaDateString),
    });
  }
  const aoiGroup = aois_id.value !== "" ? aois_id.value : selectedAoisIds.value;
  if (typeof aoiGroup === "string") {
    filterOptionsArray.push({
      field: "id",
      criteria: aoiGroup,
      comparison: () => true,
    });
  } else if (Array.isArray(aoiGroup)) {
    if (aoiGroup.length > 0) {
      filterOptionsArray.push({
        field: "id",
        comparison: "in",
        criteria: aoiGroup,
      });
    }
  }
  const userGroup = users_id.value !== "" ? users_id.value : selectedUserIds.value;
  if (typeof userGroup === "string") {
    filterOptionsArray.push({
      field: "user_id",
      criteria: userGroup,
      comparison: () => true,
    });
  } else if (Array.isArray(userGroup)) {
    if (userGroup.length > 0) {
      filterOptionsArray.push({
        field: "user_id",
        comparison: "in",
        criteria: userGroup,
      });
    }
  }
  return filterOptionsArray;
})

const resetValueFilter = () => {
  sr_id.value = ''
  source_type.value = ''
  mission.value = ''
  acquisition_mode.value = ''
  sensing_start_time.value = ''
  sensing_end_time.value = ''
  enforcement_start_time.value = ''
  enforcement_end_time.value = ''
  users_id.value = ''
  rule_name.value = []
  aois_id.value = ''
  resetUserFilters()
  resetAoiFilters()
  rulesStore.aoiSelected = []
}

const filterStateRuleDetail = ref<any>({
  showFilter_sr_id: false,
  showFilter_source: false,
  showFilter_mission: false,
  showFilter_acquisition_mode: false,
  showFilter_sensing_time:false,
  showFilter_enforcement_time:false,
  showFilter_user_id:false,
  showFilter_aois_rules:false,
  showFilter_aois:false
});

const handleFilterStateRuleDetail = (valueFilter: string) => {
  if (filterStateRuleDetail.value[valueFilter]) {
    filterStateRuleDetail.value[valueFilter] = false;
  } else {
    for (const key in filterStateRuleDetail.value) {
      if (Object.prototype.hasOwnProperty.call(filterStateRuleDetail.value, key)) {
        filterStateRuleDetail.value[key] = key === valueFilter;
      }
    }
  }
};
const processFilterOptions = () => {
  const keyValueObject: { [key: string]: string[] } = {};

  filterOptionsRulesDetail.value.forEach((item: any) => {
    let values = item.criteria;

    if (Array.isArray(values)) {
      if (keyValueObject[item.field]) {
        keyValueObject[item.field] = keyValueObject[item.field].concat(values);
      } else {
        keyValueObject[item.field] = values;
      }
    } else {
      keyValueObject[item.field] = [values];
    }
  });

  return keyValueObject;
};
const updateOffsetAndPagination = (offsetValueProp?: number) => {
  if (serverOptions.value.rowsPerPage !== previousRowsPerPage.value) {
    offsetValue.value = 0; 
    previousRowsPerPage.value = serverOptions.value.rowsPerPage; 
  }

  if (offsetValueProp) {
    offsetValue.value = offsetValue.value + offsetValueProp;
  }

  pagProperty.value.lastPage = offsetValue.value === 0;
};

const fetchRulesData = async (keyValueObject: any) => {

  let result = [...rulesStore.itemsSelected];
  const ruleIds = result.map(item => item.rule_id.toString());
  let ruleIdObject = { rule_id: ruleIds };
  if(valueSelect.value !== ''){
     ruleIdObject = { rule_id: valueSelect.value }
  }
  await getConflictRules({
    ...ruleIdObject,
    ...keyValueObject,
    limit: serverOptions.value.rowsPerPage,
    offset: offsetValue.value,
    sort_by: serverOptions.value.sortBy,
    sort: serverOptions.value.sortType === "asc" ? "ascending" : "descending",
  });

  pagProperty.value.nextPage = rulesStore.rulesDataDetail
    ? rulesStore.rulesDataDetail.length < serverOptions.value.rowsPerPage
    : true;

  serverItemsLength.value = rulesStore.rulesDataDetail
    ? rulesStore.rulesDataDetail.length
    : 0;
};
watch(filterOptionsRulesDetail, async (newFilterOptions, oldFilterOptions) => {
  const keyValueObject = processFilterOptions();
  resetOffsetValueDetailRules();
  updateOffsetAndPagination();
  await fetchRulesData(keyValueObject);
});
const loadFromServer = async (offsetValueProp?: number) => {
  const keyValueObject = processFilterOptions();
  updateOffsetAndPagination(offsetValueProp);
  await fetchRulesData(keyValueObject);
};
onMounted(async () => {
  await getData()
  resetValueFilter()
  capitalizeRowsLetter()

});

watch(() => rulesStore.rulesDataDetail, (newValue) => {
  console.log('newValuexxx',newValue)
}, { deep: true });

watchEffect(() => {
  if(rulesStore.itemsIdRulesDetails.length === 1){
    const id = rulesStore.itemsIdRulesDetails[0]?.rule_id
    const ruleId = id ? id : '' 
    valueSelect.value = String(ruleId)
  }
});
const getData = async () => {

  let datamIssion = satDataStore.missionData
  itemsMission.value = datamIssion?.map((item) => {
      return {
          label: item.id,
          value: item.id,
      }
  }).sort((a, b) => a.label.localeCompare(b.label));

  let dataRulesName = rulesStore.rulesAll
  itemsRules.value = dataRulesName?.map((item) => {
      return {
          label: item.name,
          value: item.name,
      }
  }).sort((a, b) => a.label.localeCompare(b.label));

  let dataMode = satDataStore.acquisitionModeData
  itemsAcquisitionMode.value = dataMode?.map((item) => {
      return {
          label: item.id,
          value: item.id,
      }
  }).sort((a, b) => a.label.localeCompare(b.label));
  let dataUser = userStore.userSelectData
  itemsUsers.value = dataUser?.map((item) => {
      return {
          label: item.name,
          value: item.name,
      }
  }).sort((a, b) => a.label.localeCompare(b.label));
  let dataAoi = await aoiService.getAsync({
    limit: 10000,
    offset: 0,
  })
  itemsAois.value = dataAoi?.map((item:any) => {
      return {
          label: item.aoi_id,
          value: item.id,
      }
  }).sort((a, b) => a.label.localeCompare(b.label));
}
watch(serverOptions, (value) => { loadFromServer(); }, { deep: true });
const  calculateValues = () => {
  let primerValor = (offsetValue.value === 0) ? 1 : offsetValue.value + 1;
  let segundoValor = (serverOptions.value.rowsPerPage !== 10 && offsetValue.value === 0) 
    ? serverOptions.value.rowsPerPage 
    :  offsetValue.value !== 0 
        ? offsetValue.value + serverOptions.value.rowsPerPage 
        : offsetValue.value + 10
  rangePages.value = `${primerValor} - ${segundoValor}`;
}
watchEffect(() => {
  pagProperty.value.nextPage = rulesStore.rulesDataDetail ? (rulesStore.rulesDataDetail.length < serverOptions.value.rowsPerPage || rulesStore.rulesDataCount === 0) : true
  calculateValues()
});
const viewLabelFilter = (option: any, isButton: boolean = false) => {
    const optionKeys = [
        'group_uds',
        'group_shc',
        'user'
    ];
    if (option[0] && !optionKeys.includes(option[0])) {
        let result: any = convertFormatDateAndValidDate(option[1]?.toString())
        result = result?.replace(/,/g, ' , ');

        for (const [key, value] of Object.entries(filterOptions)) {
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
const getDataSelect = (field: string) => {
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
</script>
<template>
  <DetailsCustom widthContent="100%" width="100%" widthDetails="100%">
    <template #iconDiv>
      
       
        <div class="container-icon" style="width: 100%;">
            <div class="container-filters-opt">
                  <div class="filters-opt" >
                      <template v-for="([key, value]) in Object.entries(formDataFilter)" :key="key">
                          <qtm-tag size="medium" classes="color-button-status-active style-custom-tag custom-tag"
                              :dismissible="true"  v-if="value !== '' && (Array.isArray(value) ? value.length > 0 : true)"
                              @clicked-tag-button-event="() => handleTagClick(key)">
                              <span v-html="key != 'area' ? viewLabelFilter([key, value]) : labelArea"></span>
                          </qtm-tag>
                      </template>
                      <qtm-typography classes="text-bluegrey-100 custom-clear-all style-custom-tag" :font-size="7"
                          font-weight="normal" font-family="roboto" v-show="hasFormDataFilterValues"
                          @click="() => { resetFormDataFilter() }">
                          Clear All
                      </qtm-typography>
                  </div>
          </div>
        <qtm-icon icon="expand_more" variant="outlined" rotation :classes="computedClass" @click="expandAndMinus">
        </qtm-icon>
      </div>
      
      
    </template>
    <template #titleDiv>
      <div style="font-size: 14px; font-family: 'Roboto'; color: white; margin-left: 10px"> Rule </div>
    </template>
    <template #firstDivLeft>
      <div style="z-index: 200; width: 424px;">
        <qtm-dropdown-select size="medium" scrollable
          @value-changed="(event: any) => valueSelect = event.detail.valueChanged" :value="valueSelect"
          style=" scrollbar-width: var(--scrollbar-width, auto); scrollbar-color: #3b3d50 #1c1d26;">
          <qtm-dropdown-select-option v-if="rulesStore.itemsIdRulesDetails.length !== 1" :value="''">All</qtm-dropdown-select-option>
          <template v-for="(optionsSelect, index) in rulesStore.itemsIdRulesDetails" :key="index"
            style="height: 150px !important;">
            <qtm-dropdown-select-option :value="optionsSelect.rule_id">
              {{ optionsSelect.rule_name }}
            </qtm-dropdown-select-option>
          </template>
        </qtm-dropdown-select>
      </div>
    </template>
    <template #firstDivRight>
      <qtm-button size="medium" left-icon="download" classes="text-scale-7 bg-bluegrey-700"
        @click-event="emits('showExport')" :disabled="!userSelected?.length">
        Export filtering history
      </qtm-button>

      
      <Teleport to="#app">
        <RuleHistoryReport v-if="exportStore.visibleRuleHistory" :data="userSelected" />
      </Teleport>
      <Teleport to="#app">
        <RuleHistoryCompressedReport v-if="exportStore.visibleRuleHistoryCompressed" :data="userSelected" />
      </Teleport>
    </template>
    <template #secondDiv>
      <EasyDataTable
      class="table-rule-select-custom-th table-rule-date-top"
        :body-row-class-name="(item: Item, rowNumber: number) => bodyRowClassNameFunction(item, rowNumber, isRowExpanded(item.idx))"
        v-model:items-selected="userSelected" 
        :headers="headers" 
        :items="rulesStore.rulesDataDetail"
        :filter-options="filterOptionsRulesDetail" 
        theme-color="#4c5dff" 
        table-class-name="customize-table"
        header-text-direction="left" 
        body-text-direction="left" 
        :table-height="screenStore.screenHeight - 390"
        :sort-type="sortType" 
        multi-sort 
        style="z-index: 140; width: 100%;" 
        :rows-items="[10, 25, 50, 100, 250, 500]"
        :rows-per-page="10" 
        alternating fixed-checkbox 
        :checkbox-column-width="45"
        v-model:server-options="serverOptions" 
        :server-items-length="serverItemsLength">
        <template #header-sr_id="header">
          <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_sr_id = false">
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
              <qtm-icon icon="filter_list" :class="`column-filter ${sr_id.length > 0 ? 'column-filtered' : ''}`" size="medium"
                @click.stop="handleFilterStateRuleDetail('showFilter_sr_id')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateRuleDetail.showFilter_sr_id" @click.stop>
                <QtmTextInput :value="sr_id_temp" @value-changed="(event: any) => sr_id_temp = event.detail" placeholder="Search"
                  size="small" left-icon="search" @click.stop>
                </QtmTextInput>
                <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton variant="outline" color="primary" size="small"
                      @click.stop="handleFilter('reset','sr_id')">Reset</QtmButton>
                    <QtmButton variant="filled" color="primary" size="small"
                      @click.stop="handleFilter(sr_id_temp,'sr_id'), filterStateRuleDetail.showFilter_sr_id = false">Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-user_id="header">
        <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_user_id = false">
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
              :class="`column-filter ${selectedUserIdsTemp.length > 0  ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterStateRuleDetail('showFilter_user_id')"
            ></qtm-icon>
            <div class="filter-menu" v-if="filterStateRuleDetail.showFilter_user_id">
              
              <div @click.stop>
                <QtmTextInput
                  :value="userSearchTerm"
                  @value-changed="(event:any) => userSearchTerm = event.detail "
                  placeholder="Search"
                  size="small"
                  left-icon="search"
                  @click.stop
                >
                </QtmTextInput>
                <QtmDivider classes="my-m" />
                <div class="filter-menu-list-checkbox">
                  <ul v-for="user in filteredMappedDataUser">
                    <li>
                      <qtm-checkbox
                        @change="
                          handleUserCheckboxChange(user.value)
                        "
                        :value="user.value"
                        :checked="
                          selectedUserIdsTemp.includes(
                            user.value ? user.value : ''
                          )
                        "
                      >
                        {{ user.label }}
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
                    @click="() => resetUserFilters()"
                    >Reset</QtmButton
                  >
                  <QtmButton
                    variant="filled"
                    color="primary"
                    size="small"
                    @click="() => {applyUserFilters(),filterStateRuleDetail.showFilter_user_id = false}"
                    >Apply</QtmButton
                  >
                </div>
              </div>

            </div>
          </div>
        </ClickOutSide>
        </template>
        <template #header-source="header">
          <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_source = false">
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
                :class="`column-filter ${source_type.length > 0 ? 'column-filtered' : ''}`"
                @click.stop="handleFilterStateRuleDetail('showFilter_source')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateRuleDetail.showFilter_source" @click.stop>
                  <qtm-dropdown-select
                    size="small"
                    @value-changed="(event:any) => source_type_temp = event.detail.valueChanged "
                    :value="source_type_temp">
                    <template v-for="(optionsSelect, index) in sourcetypeModeList" :key="index">
                      <qtm-dropdown-select-option :value="optionsSelect.value">
                        {{ optionsSelect.label }}
                      </qtm-dropdown-select-option>
                    </template>
                  </qtm-dropdown-select>

                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click="() =>handleFilter('reset', 'source_type')"
                      >Reset</QtmButton
                    >
                    <QtmButton variant="filled" color="primary" size="small"
                        @click.stop="handleFilter(source_type_temp, 'source_type'), filterStateRuleDetail.showFilter_source = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois="header">
        <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_aois = false">
          <div class="filter-column">
            <div class="filter-column-no-sort-by-header">
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
            </div>
            <qtm-icon
            :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedAoisIds.length > 0 ? 'column-filtered' : ''}`"
              icon="filter_list"
              size="medium"
              @click.stop="handleFilterStateRuleDetail('showFilter_aois')"
            ></qtm-icon>
            <div class="filter-menu" v-if="filterStateRuleDetail.showFilter_aois">
              
              <div @click.stop>
                <QtmTextInput
                  :value="aoiSearchTerm"
                  @value-changed="(event:any) => aoiSearchTerm = event.detail "
                  placeholder="Search"
                  size="small"
                  left-icon="search"
                  @click.stop
                >
                </QtmTextInput>
                <QtmDivider classes="my-m" />
                <div class="filter-menu-list-checkbox">
                  <ul v-for="aoi in filteredMappedDataAoi">
                    <li>
                      <qtm-checkbox
                        @change="
                          handleAoiCheckboxChange(aoi.value)
                        "
                        :value="aoi.value"
                        :checked="
                          selectedAoisIdsTemp.includes(
                            aoi.value ? aoi.value : ''
                          )
                        "
                      >
                        {{ aoi.label }}
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
                    @click="() => resetAoiFilters()"
                    >Reset</QtmButton
                  >
                  <QtmButton
                    variant="filled"
                    color="primary"
                    size="small"
                    @click="() => {applyAoiFilters(),filterStateRuleDetail.showFilter_aois = false}"
                    >Apply</QtmButton
                  >
                </div>
              </div>

            </div>
          </div>
        </ClickOutSide>
        </template>
        <template #header-aois_mission_sensor="header">
          <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_mission = false">
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
                :class="`column-filter ${mission.length > 0 ? 'column-filtered' : ''}`"
                size="medium" @click.stop="handleFilterStateRuleDetail('showFilter_mission')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateRuleDetail.showFilter_mission" @click.stop>
                  <!-- <qtm-dropdown-select
                    size="small"
                    @value-changed="(event:any) => mission = event.detail.valueChanged "
                    :value="mission">
                    <template v-for="(optionsSelect, index) in itemsMission" :key="index">
                      <qtm-dropdown-select-option :value="optionsSelect.value">
                        {{ optionsSelect.label }}
                      </qtm-dropdown-select-option>
                    </template>
                  </qtm-dropdown-select> -->
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
                        @click.stop="handleFilter('reset', 'mission')">Reset</QtmButton>
                      <QtmButton variant="filled" color="primary" size="small"
                        @click.stop="handleFilter(selectedMissionIdsTemp, 'mission'), filterStateRuleDetail.showFilter_mission = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois_acquisition_mode="header">
          <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_acquisition_mode = false">
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
              <qtm-icon icon="filter_list" :class="`column-filter ${selectedAcquisitionModeIdsTemp.length > 0 ? 'column-filtered' : ''}`" size="medium" @click.stop="handleFilterStateRuleDetail('showFilter_acquisition_mode')"></qtm-icon>
              <div class="filter-menu" v-if="filterStateRuleDetail.showFilter_acquisition_mode" @click.stop>
                  <!-- <qtm-dropdown-select
                    size="small"
                    @value-changed="(event:any) => acquisition_mode = event.detail.valueChanged "
                    :value="acquisition_mode">
                    <template v-for="(optionsSelect, index) in itemsAcquisitionMode" :key="index">
                      <qtm-dropdown-select-option :value="optionsSelect.value">
                        {{ optionsSelect.label }}
                      </qtm-dropdown-select-option>
                    </template>
                  </qtm-dropdown-select>

                  <QtmDivider classes="my-m" /> -->
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
                    <!-- <QtmButton variant="outline" color="primary" size="small" @click="() => acquisition_mode = ''" >Reset</QtmButton> -->
                    <QtmButton variant="outline" color="primary" size="small"
                        @click.stop="handleFilter('reset', 'acquisition_mode_id')">Reset
                      </QtmButton>
                      <QtmButton variant="filled" color="primary" size="small"
                        @click.stop="handleFilter(selectedAcquisitionModeIdsTemp, 'acquisition_mode_id'), filterStateRuleDetail.showFilter_acquisition_mode = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois_rules="header">
          <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_aois_rules = false">
            <div class="filter-column">
              <div class="filter-column-no-sort-by-header">
                {{ header.text }}
                <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
                <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                  classes="text-primary-200 filter-icon"></qtm-icon>
            </div>
              <qtm-icon icon="filter_list" :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${rule_name.length > 0 ? 'column-filtered' : ''}`" size="medium"
                @click.stop="handleFilterStateRuleDetail('showFilter_aois_rules')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateRuleDetail.showFilter_aois_rules" @click.stop>
                <!-- <QtmTextInput :value="rule_name" @value-changed="(event: any) => rule_name = event.detail" placeholder="Search"
                  size="small" left-icon="search" @click.stop>
                </QtmTextInput> -->
                <QtmTextInput :value="rule_name_search"
                      @value-changed="(event: any) => rule_name_search = event.detail" placeholder="Search" size="small"
                      left-icon="search" @click.stop>
                    </QtmTextInput>
                    <QtmDivider classes="my-m" />
                    <div class="filter-menu-list-checkbox">
                      <ul v-for="rule in filteredMappedDataRules">
                        <li>
                          <qtm-checkbox @change="
                            handleRuleCheckboxChange(rule.value)
                            " :value="rule.value" :checked="rule_name_temp.includes(
                                rule.value ? rule.value : ''
                              )
                                ">
                            {{ rule.label }}
                          </qtm-checkbox>
                        </li>
                      </ul>
                    </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton variant="outline" color="primary" size="small"
                        @click.stop="handleFilter('reset', 'rule_id')">Reset</QtmButton>
                      <QtmButton variant="filled" color="primary" size="small"
                        @click.stop="handleFilter(rule_name_temp, 'rule_id'), filterStateRuleDetail.showFilter_aois_rules = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois_sensing_time ="header">
          <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_sensing_time = false">
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
              <qtm-icon icon="filter_list" :class="`column-filter ${((sensing_start_time && sensing_start_time.toString().length > 0) || (sensing_end_time && sensing_end_time.toString().length > 0)) ? 'column-filtered' : ''}`" size="medium" @click.stop="handleFilterStateRuleDetail('showFilter_sensing_time')"></qtm-icon>
             
              <div class="filter-menu" style="width: 450px !important; position: absolute; right: 0" v-if="filterStateRuleDetail.showFilter_sensing_time">

                  <div class="flex align-center gap-2">
                    <div>
                      <p class="text-left">Sensing start time</p>
                      <VueDatePicker 
                        class="date-picker-input-custom" 
                        v-model="sensing_start_time_temp"
                        :dark="true" 
                        time-picker-inline
                        :format="getFormattedDateTime"
                        :alt-position="() => ({ top: 50, left: -4 })">
                      </VueDatePicker>
                    </div>

                    <div>
                      <p class="text-left">Sensing end time</p>
                      <VueDatePicker 
                        class="date-picker-input-custom" 
                        v-model="sensing_end_time_temp"
                        :dark="true" 
                        time-picker-inline
                        :format="getFormattedDateTime"
                        :alt-position="() => ({ top: 50, left: -4 })">
                      </VueDatePicker>
                    </div>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton variant="outline" color="primary" size="small"
                      @click.stop="handleFilter('reset', 'sensing_time')">Reset</QtmButton>
                    <QtmButton variant="filled" color="primary" size="small"
                      @click.stop="handleFilter(sensing_start_time_temp, 'sensing_time'), filterStateRuleDetail.showFilter_sensing_time = false">
                      Apply</QtmButton>
                  </div>
              </div>


            </div>
          </ClickOutSide>
        </template>
        <template #header-enforcement_time ="header">
          <ClickOutSide @clickoutside="filterStateRuleDetail.showFilter_enforcement_time = false">
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
              <qtm-icon icon="filter_list" :class="`column-filter ${((enforcement_start_time && enforcement_start_time.toString().length > 0) || (enforcement_end_time && enforcement_end_time.toString().length > 0)) ? 'column-filtered' : ''}`" size="medium" @click.stop="handleFilterStateRuleDetail('showFilter_enforcement_time')"></qtm-icon>
              
              <div class="filter-menu" style="width: 450px !important; position: absolute; right: 0" v-if="filterStateRuleDetail.showFilter_enforcement_time">

                  <div class="flex align-center gap-2">
                    <div>
                      <p class="text-left">Event date start</p>
                      <VueDatePicker 
                        class="date-picker-input-custom" 
                        v-model="enforcement_start_time_temp"
                        :dark="true" 
                        time-picker-inline
                        :format="getFormattedDateTime"
                        :alt-position="() => ({ top: 50, left: -4 })">
                      </VueDatePicker>
                    </div>

                    <div>
                      <p class="text-left">Event date end</p>
                      <VueDatePicker 
                        class="date-picker-input-custom" 
                        v-model="enforcement_end_time_temp"
                        :dark="true" 
                        time-picker-inline
                        :format="getFormattedDateTime"
                        :alt-position="() => ({ top: 50, left: -4 })">
                      </VueDatePicker>
                    </div>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton variant="outline" color="primary" size="small"
                      @click.stop="handleFilter('reset', 'enforcement_time')">Reset</QtmButton>
                    <QtmButton variant="filled" color="primary" size="small"
                      @click.stop="handleFilter(enforcement_start_time_temp, 'enforcement_time'), filterStateRuleDetail.showFilter_enforcement_time = false">
                      Apply</QtmButton>
                  </div>
              </div>


            </div>
          </ClickOutSide>
        </template>
       
        <template #item-sr_id="item">
          <div style="display: flex; align-items: center">
            <QtmIcon :icon="isRowExpanded(item.idx) ? 'expand_less' : 'expand_more'" size="medium" variant="outlined"
              style="cursor: pointer" @click="() => {
                toggleRowExpansion(item.idx);
              }
                ">
            </QtmIcon>
            <span style="margin-left: 3px">{{ item.sr_id? item.sr_id: '-' }} </span>
          </div>

        </template>
        <template #item-sensing_time="item">
          <div style=" gap: 2px;">
            <QtmTypography classes="style-text-row-table">Start: {{ convertFormatDate(item.sensing_start_time) }}
            </QtmTypography>
            <QtmTypography classes="style-text-row-table">End: {{ convertFormatDate(item.sensing_stop_time) }}
            </QtmTypography>
          </div>
        </template>
        <template #item-aois="items">
          <ul v-if="expandedRows.includes(items.idx)" style="margin-top: 50px;">
            <li v-for="item in items.aois" style="margin-bottom: 30px;">
              <div class="checkbox-rule-history">
                <qtm-checkbox size="small" :input-id="`layerAirports-${item.id}`"
                  :checked="selectedCheckboxes[item.id]"
                  @change="handleCheckboxChange(item, $event, false, items.sr_id)">
                  {{ item.aoi_id }}
                </qtm-checkbox>
              </div>
            </li>
          </ul>
          <div v-else>
            <div v-for="(item, index) in items.aois" >
              <div v-if="index === 0" >
                <qtm-checkbox size="small" :input-id="`layerAirports-${item.id}`"
                  :checked="selectedCheckboxes[item.id]"
                  @change="handleCheckboxChange(item, $event, false, items.sr_id)">
                  {{ item.aoi_id }}
                </qtm-checkbox>
              </div>
            </div>
          </div>
        </template>
        <template #item-aois_mission_sensor="items">
          <div >
            {{items.mission?.id?items.mission?.id:'-' }}
            <!-- <ul v-if="expandedRows.includes(items.sr_id)" style="margin-top: 50px;">
              <div v-for="item in items.aois">
                <li v-for="item2 in item.rules">
                  <div class="style-text-row-table" style="margin-bottom: 30px">{{ item2.mission?.id }} -
                    {{ item2.sensor_type_id }} </div>
                </li>
              </div>
            </ul>
            <div v-else>
              <div v-for="(item, idx) in items.aois">
                <div v-for="(item2, index) in item.rules" v-if="idx === 0">
                  <div v-if="index === 0">{{ item2.mission?.id
                    }} - {{ item2.sensor_type_id }} </div>
                </div>
              </div>
            </div> -->
          </div>
        </template>
        <template #item-aois_acquisition_mode="items">
          <div>
            <ul v-if="expandedRows.includes(items.idx)" style="margin-top: 50px;">
              <div v-for="item in items.aois">
                <li >
                  <div class="style-text-row-table" style="margin-bottom: 30px">{{ item.acquisition_mode_id }}</div>
                </li>
              </div>
            </ul>
            <div v-else>
              <div v-for="(item, idx) in items.aois">
                <div v-if="idx === 0">
                  <div >{{
                    item.acquisition_mode_id }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-for="item in items.aois" style="margin-top: 10px;">
            <div v-for="item2 in item.rules">
              <div class="style-text-row-table" style="margin-bottom: 10px">{{ item2.acquisition_mode_id }}</div>
            </div>
          </div> -->
        </template>
        <template #item-aois_rules="items">
          <!-- <div v-for="item in items.aois">
            <div v-for="item2 in item.rules">
              <qtm-tag class="width-custom-tag" :label="validateLargeText(item2.rule_name, 14)" size="small"
                :classes="`${colorTagClass(item2?.rule_type)}`" style="margin-right: 10px; margin-bottom: 10px"
                :dismissible="false">
              </qtm-tag>
            </div>
          </div> -->
          <div>
            <ul v-if="expandedRows.includes(items.idx)" style="margin-top: 50px;">
              <div v-for="item in items.aois">
                <li v-for="item2 in item.rules" :key="item2.rule_id">
                  <div style="display: flex; gap: 10px; margin-bottom: 22px;">
                    <qtm-tooltip :content="item2.rule_name">
                      <qtm-tag class="width-custom-tag" :label="validateLargeText(item2.rule_name, 14)" size="small"
                        :classes="`${colorTagClass(item2?.rule_type)}`" :dismissible="false">
                      </qtm-tag>
                    </qtm-tooltip>

                  </div>
                </li>
              </div>
            </ul>
            <div v-else>
              <div v-for="(item, idx) in items.aois">
                <div v-for="(item2, index) in item.rules" v-if="idx === 0">
                  <template v-if="item2 && index === 0">
                    <div style="display: flex; gap: 10px;">
                      <qtm-tooltip :content="item2.rule_name">
                        <qtm-tag class="width-custom-tag" :label="validateLargeText(item2.rule_name, 14)" size="small"
                          :classes="`${colorTagClass(item2?.rule_type)}`" :dismissible="false">
                        </qtm-tag>
                      </qtm-tooltip>

                    </div>
                  </template>

                </div>
              </div>
            </div>
          </div>
        </template>
        <template #item-aois_sensing_time="items">
          <div>
            <ul v-if="expandedRows.includes(items.idx)" style="margin-top: 50px;">
              <div v-for="item in items.aois">
                <li v-for="item2 in item.rules" style="margin-bottom: 14px">
                  <div style="gap: 2px;">
                    <QtmTypography classes="style-text-row-table">Start: {{ convertFormatDate(item2.sensing_start_time)
                      }}
                    </QtmTypography>
                    <QtmTypography classes="style-text-row-table">End: {{ convertFormatDate(item2.sensing_end_time) }}
                    </QtmTypography>
                  </div>
                </li>
              </div>
            </ul>
            <div v-else>
              <div v-for="(item, idx) in items.aois">
                <div v-for="(item2, index) in item.rules" v-if="idx === 0">
                  <div style="gap: 2px;" v-if="index === 0">
                    <QtmTypography >Start: {{ convertFormatDate(item2.sensing_start_time)
                      }}
                    </QtmTypography>
                    <QtmTypography >End: {{ convertFormatDate(item2.sensing_end_time) }}
                    </QtmTypography>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>
        <template #item-enforcement_time="items">
          <div>
            <ul v-if="expandedRows.includes(items.idx)" style="margin-top: 50px;">
              <li v-for="item in items.aois">
                <div class="style-text-row-table" style="margin-bottom: 30px">{{
                  convertFormatDate(item.enforcement_time) }}
                </div>
              </li>
            </ul>
            <div v-else>
              <div v-for="(item, index ) in items.aois">
                <div v-if="index === 0">{{
                  convertFormatDate(item.enforcement_time) }}
                </div>
              </div>
            </div>
          </div>


        </template>
        <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
          <div style="margin-right: 10px;">
            {{ rangePages }}
          </div>
          <QtmIcon icon="chevron_left" size="medium"
            :classes="'icon-left-right ' + (pagProperty.lastPage ? 'cursor-disabled' : 'cursor-pointer')"
            @click=" !pagProperty.lastPage ? loadFromServer(-serverOptions.rowsPerPage) : ''"></QtmIcon>
          <QtmIcon icon="chevron_right" size="medium"
            :classes="'icon-left-right ' + ((pagProperty.nextPage) ? 'cursor-disabled' : 'cursor-pointer')"
            @click=" !pagProperty.nextPage ? loadFromServer(serverOptions.rowsPerPage) : ''"></QtmIcon>
        </template>
      </EasyDataTable>
    </template>
  </DetailsCustom>
  <teleport to=".map">
    <div class="container-modall" v-show="userSelected?.length && exportStore.visibleOptionMap"
      :style="{ 'z-index': 99, 'margin-left': marginRightModal }">
      <qtm-checkbox size="small" @change="handleCheckboxChangeOptionTeleport($event, 'rule')" ref="historyRules" checked
        class="items-modal">Rules</qtm-checkbox>
      <qtm-checkbox size="small" @change="handleCheckboxChangeOptionTeleport($event, 'aoi')" checked
        class="items-modal">Aoi</qtm-checkbox>
      <!-- <qtm-checkbox size="small" checked class="items-modal">Service requests</qtm-checkbox>  -->
    </div>
  </teleport>
</template>
<style scoped>
.custom-scrollbar {
  display: flex;
  max-width: 500px;
  overflow-y: auto;
  scrollbar-width: var(--scrollbar-width, auto);
  scrollbar-color: #3b3d50 #1c1d26;
  padding-top: 12px;
}

.checkbox-rule-history {
  margin-bottom: 10px;
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
.container-icon {
  display: flex;
  justify-content: space-between;
  margin-right: -15px;
  margin-top: 10px;
}
.filter-icon {
  position: absolute !important;
  right: 33px !important;
  font-size: 18px !important;
}

</style>