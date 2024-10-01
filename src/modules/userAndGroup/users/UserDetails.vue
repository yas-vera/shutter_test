<script setup lang="ts">
import DetailsCustom from "@/components/tableCustom/DetailsCustom.vue";
import { convertFormatDate, convertFormatDateAndValidDate, convertFormatDateHour, convertFormatFilterDate, convertTextTruncate, getFormattedDateTime } from "@/helpers/convertDateTime";
import {
  bodyRowClassNameFunction,
  capitalizeFirstLetter,
  capitalizeRowsLetter,
  caseInsensitiveIncludes,
  colorButtonClass,
  colorButtonEventType,
  colorButtonRulesType,
  colorTagClass,
  handleLabelMultiselectFilter,
  validateLargeText,
} from "@/helpers/tableHelpers";
import { useUserStore } from "@/stores/userStore";
import { QtmTypography,
          QtmButton,
          QtmTag,
          QtmTextInput,
          QtmIcon,
          QtmDivider,
          QtmDropdownSelect,
          QtmDropdownSelectOption,
          QtmTooltip,
          QtmCheckbox
        } from "@qtm/vue";
import { headersDetail } from "./config/headersTableDetails";
import { useMapViewStore } from "@/stores/mapViewStore";
import { watch, ref, computed, onUnmounted } from "vue";
import ClickOutSide from "@/components/clickoutside/ClickOutSide.vue";
import type { FilterOption, Item, ServerOptions } from "vue3-easy-data-table";
import { useScreenStore } from "@/stores/screenStore";
import { useRulesStore } from "@/stores/rulesStore";
import MultiSelectCustom from "@/components/input/MultiSelectCustom.vue";
import { useMissionStore } from "@/stores/missionStore";
import { watchEffect } from "vue";
import { onMounted } from "vue";
import { sourcetypeModeList } from "@/data/selectOptions";
import { useSatDataStore } from "@/stores/satDataStore";
import aoiService from "@/services/aoiService";
import { nextTick } from "vue";
import * as ol from "ol";
import { resetField, resetFields } from "@/helpers/filterSearchHelper";
import { filterOptions } from "@/data/filterOptions";
const userStore = useUserStore();
const mapStore = useMapViewStore();
const screenStore = useScreenStore();
const rulesStore = useRulesStore()

const filter_aoi_id = ref('');
const filter_service_id = ref('');
const filter_rule_id = ref('');
const filter_event_type = ref('');
const filter_event_date = ref<any>('');

const showFilter_aoi_id = ref(false);
const showFilter_service_id = ref(false);
const showFilter_rule_id = ref(false);
const showFilter_event_type = ref(false);
const showFilter_event_date = ref(false);
const historyRules = ref<boolean>(true);
const historyAoi = ref<boolean>(true);
const labelArea = ref('')
//pagination
const serverItemsLength = ref(0);
const offsetValue = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'id',
  sortType: 'desc',
});
let previousRowsPerPage = ref<number>(serverOptions.value.rowsPerPage);

const {
  offsetValueDetailUsers,
  pagPropertyDetaiUsers,
  serverOptionsDetailUsers,
  resetOffsetValueDetailUsers,
  userDataDetailCount,
  getConflict,
} = useMissionStore();
let srSelected: any = []
const loadFromServer = async (offsetValueProp?:number) => {
    if (serverOptions.value.rowsPerPage !== previousRowsPerPage.value) {
      offsetValue.value = 0; 
      previousRowsPerPage.value = serverOptions.value.rowsPerPage; 
    }

    const keyValueObject: any = {};

    filterOptionsUserDetail.value.forEach((item: any) => {
      let values = item.criteria;
      if (Array.isArray(values)) {
        values = values.join(',');
      }
      keyValueObject[item.field] = values;
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

    let result = [...userStore.itemsSelected]
    const userIds = result.map(item => item.user_id.toString());
    const userIdObject = { user_id: userIds };

    await getConflict({
      ...userIdObject,
      ...keyValueObject,
      limit: serverOptions.value.rowsPerPage,
      offset: offsetValue.value,
      sort_by: serverOptions.value.sortBy,
      sort: serverOptions.value.sortType === "asc" ? "ascending" : "descending",
    });

    pagProperty.value.nextPage = userStore.userDataDetail ? (userStore.userDataDetail.length < serverOptions.value.rowsPerPage) : true
    serverItemsLength.value = userStore.userDataDetail ? userStore.userDataDetail.length : 0;
  }

watch(serverOptions, (value) => { loadFromServer(); }, { deep: true });

const mapAoiDraw = (nameValue: string, item: any, option: string, defaultColor = 'white', id?: string, isAoi?: boolean) => ({
  wkt: option == 'area' ? item.geometryArea?.area_wkt : item.geometry.area_wkt,
  colorType: option == 'area' ? item.geometryArea?.colorType : isAoi ? 'aoi' : item.colorType || defaultColor,
  idAoi: option == 'area' ? (item.sr_id ? item.sr_id : item.geometryArea?.idAoi !== undefined? item.geometryArea?.idAoi:id) : id,
  name: nameValue
});

let paddingCustom = [125, 125, 125, 125]

const drawAoiSelected = async() => {
  await drawAoi();
  const hasSelections = userStore.aoiSelected.length > 0;
  let userRule: any = []
  if (hasSelections) {
    userRule = [...userStore.userDetailsSeletect]
    const ruleSelections = userRule.map((item: any) => mapAoiDraw('Rule', item, 'area'));
    const aoiSelections = userStore.aoiSelected.map((item: any) => mapAoiDraw('AoI', item, 'aoi', item.geometry?.rule_type, item?.sr_id ? item?.sr_id : item.id, true));

    const selectedAreasDraw = [...ruleSelections, ...aoiSelections];
    mapStore.selectAOIdrawCustom(selectedAreasDraw, {}, paddingCustom);
    userStore.selectedAoisViewIds = selectedAreasDraw.map((x) => x.idAoi)
    userRule.forEach((item: any) => {
      delete item.geometryArea;
    });
  } else {
    mapStore.restoreZoom();
    mapStore.removeVectorLayer();
  }
}

const drawAoi = async() => {
  if (userStore.userDetailsSeletect.length > 0) {
      let selectRules:any = []
      let selectAoi:any = []
      if(historyRules.value || historyAoi.value){
        for (let i = 0; i < userStore.userDetailsSeletect.length; i++) {
          let items = userStore.userDetailsSeletect[i];       
          for (let j = 0; j < items.aois.length; j++) {
            let rules = items.aois[j];      
            if(historyAoi.value){
              selectAoi.push({
                  wkt: rules.geometry.area_wkt,
                  colorType: 'aoi',
                  name: 'Aoi'
              })
            } 
            if(historyRules.value){
              for (let k = 0; k < rules.rules.length; k++) {
                let rule = rules.rules[k];
                let exist = await rulesStore.findRuleById(rule.rule_id);
                selectRules.push({
                  wkt: exist.geometry.area_wkt,
                  colorType: exist.rule_type,
                  name: 'Rule',
                  idAoi: exist.rule_id
                })        
              }
            }
          }
        }
      }
      const selectedAreas = userStore.userDetailsSeletect.map(item => ({
        wkt: item.geometry.area_wkt,
        colorType: item.rule_type,
        name: 'SR',
        idAoi: item.sr_id ?  item.sr_id : 'N/A'
      }));
      if (userStore.userDetailsSeletect.length > 0) {
          let dataAoiOriginal: any[] = [...userStore.userDetailsSeletect];
          let dataAoi: any[] = [];
          let addedAoiIds: Set<number> = new Set(dataAoiOriginal.map(aoi => aoi.aoi_id));
          userStore.userDetailsSeletect.forEach((item: any) => {
            
            item.aois.forEach((aoi: any) => {
              if ((selectedCheckboxes.value[aoi.aoi_id] === undefined || selectedCheckboxes.value[aoi.aoi_id] == true) && !addedAoiIds.has(aoi.aoi_id)) {
                dataAoi.push({ ...aoi });
                selectedCheckboxes.value[aoi.aoi_id] = true;
                addedAoiIds.add(aoi.aoi_id);
              }
            });
          });
          
          userStore.aoiSelected = [...dataAoiOriginal, ...dataAoi];
        }
      const aoiSelections = userStore.aoiSelected.map((item: any) => mapAoiDraw('AoI', item, 'aoi', item.geometry?.rule_type, item?.sr_id ? item?.sr_id : item.aoi_id, true));
      const selectedDraw = [...selectRules,...aoiSelections,...selectedAreas]
      if(selectedDraw.length > 0) {
        addTooltip()
      }
      //mapStore.selectAOIdraw(selectedDraw);
      mapStore.selectAOIdrawCustom(selectedDraw)
    } else {
      mapStore.restoreZoom();
      mapStore.removeVectorLayer();
    }
    srSelected = userStore.userDetailsSeletect
}

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

//TODO: Check the sort of headers tables.
watch(
   () => userStore.userDetailsSeletect.length,
   (length) => {
    if (userStore.userDetailsSeletect.length == 0) {
          srSelected.forEach((item: any) => {
            item.aois.forEach((aoi: any) => {
              handleCheckboxChange(aoi, { target: { checked: false } }, true)
            });
          });
        } else {
          const removedItems = userStore.userDetailsSeletect.filter((item: any) => !userStore.userDetailsSeletect.includes(item));
          userStore.userDetailsSeletect.forEach((item: any) => {
            item.aois.forEach((aoi: any) => {
              handleCheckboxChange(aoi, { target: { checked: true } }, true)
            });
          });
        }
     drawAoi()
  }
);

const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const computedClass: any = computed(() => {
  return {
    'text-dark-neutral-default': true,
    'qtm-rotate-apply-action': true,
    'cursor-pointer': true,
    'qtm-rotate-expand-more':!userStore.expandDetailUser,
    'qtm-rotate-expand-minus': userStore.expandDetailUser,
  };
});

const expandAndMinus = () => {
  userStore.risizeUserDetail()
}

const valueSelect = ref<any>('');

watch(() => valueSelect.value, (newValue) => {
  userStore.activeUserDetailId(newValue,{})
});

const handleCheckboxChangeOptionTeleport = async(event: any, option: string) => {
  const isChecked = event.target.checked;
  if(option == 'rule'){
    historyRules.value = isChecked
  }
  if(option == 'aoi'){
    historyAoi.value = isChecked
    if(isChecked){
      let dataAoi = [...userStore.userDetailsSeletect]
      dataAoi.forEach((item: any) => {
        item.aois.forEach((aoi: any) => {
          if (!selectedCheckboxes.value[aoi.aoi_id]) {
            selectedCheckboxes.value[aoi.aoi_id] = true;
            if (!rulesStore.aoiSelected.some((existingAoi: any) => existingAoi.aoi_id === aoi.aoi_id)) {
              rulesStore.aoiSelected.push({ ...aoi, sr_id: item.sr_id });
            }
          }
        });
      }); 
    }else{
      let dataAoi = [...userStore.userDetailsSeletect]
      dataAoi.forEach((item: any) => {
        item.aois.forEach((aoi: any) => {
          handleCheckboxChange(aoi, { target: { checked: false } })
        });
      });
    }
   
  }
  await drawAoi()
}

watch(() => userStore.itemsIdUserDetails, (newValue) => {
  if(newValue.length === 1){
    valueSelect.value = [newValue[0].user_id]
  }else if(newValue.length > 1){
    document.querySelector("body")?.classList.add("user-details");
    valueSelect.value = getDataSelect().map(user => user.value)
  }
})

const resetAll = ref(0);
const resetKeys = ref<any>({});

const getDataSelect = () => {
  const data = userStore.itemsIdUserDetails?.map((item) => {
    return {
      label: item.user_id,
      value: item.user_id,
      }
  }).sort((a, b) => a.label.localeCompare(b.label));

  return data;
}

const rangePages = ref<string>('')
const pagProperty = ref({
  nextPage:false,
  lastPage:false
})

const  calculateValues = () => {
  let primerValor = (offsetValue.value === 0) ? 1 : offsetValue.value + 1;
  let segundoValor = (serverOptions.value.rowsPerPage !== 10 && offsetValue.value === 0) 
    ? serverOptions.value.rowsPerPage 
    :  offsetValue.value !== 0 
        ? offsetValue.value + serverOptions.value.rowsPerPage 
        : offsetValue.value + 10
  rangePages.value = `${primerValor} - ${segundoValor}`;
}

onMounted(async() => {
  pagProperty.value.lastPage = true
  capitalizeRowsLetter()
})

onUnmounted(() => {
  document.querySelector("body")?.classList.remove("user-details");
})

watchEffect(() => {
  pagProperty.value.nextPage = userStore.userDataDetail ? (userStore.userDataDetail.length < serverOptions.value.rowsPerPage || userStore.userDataCount === 0) : true
  calculateValues()
});

const filterStateUserDetail = ref<any>({
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

const sr_id = ref("");
const sr_id_temp = ref("");

const source_type = ref("");
const source_type_temp = ref("");

const mission = ref("");
const missionSearchTerm = ref<string>('');
const selectedMissionIdsTemp = ref<string[]>([]);

const acquisition_mode = ref("");

const acquisitionModeSearchTerm = ref<string>('');
const selectedAcquisitionModeIds = ref<string[]>([]);
const selectedAcquisitionModeIdsTemp = ref<string[]>([]);

const rule_name = ref<string[]>([]);
const rule_name_search = ref("");
const rule_name_temp = ref<string[]>([]);

const sensing_start_time = ref<any>("");
const sensing_end_time = ref<any>("");
const sensing_start_time_temp = ref<any>("");
const sensing_end_time_temp = ref<any>("");

const aois_id = ref<any>("");
const users_id = ref<any>("");

const enforcement_start_time = ref<any>("");
const enforcement_end_time = ref<any>("");
const enforcement_start_time_temp = ref<any>("");
const enforcement_end_time_temp = ref<any>("");

const userSearchTerm = ref<string>('');
const aoiSearchTerm = ref<string>('');
const selectedUserIdsTemp = ref<string[]>([]);
const selectedUserIds = ref<string[]>([]);
const selectedAoisIdsTemp = ref<string[]>([]);
const selectedAoisIds = ref<string[]>([]);
const itemsMission = ref<any>([]);
const itemsAcquisitionMode = ref<any>([]);
const itemsAois = ref<any>([]);
const itemsUsers = ref<any>([]);
const itemsRules  = ref<any>([]);
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
const handleFilterStateUserDetail = (valueFilter: string) => {
  if (filterStateUserDetail.value[valueFilter]) {
    filterStateUserDetail.value[valueFilter] = false;
  } else {
    for (const key in filterStateUserDetail.value) {
      if (Object.prototype.hasOwnProperty.call(filterStateUserDetail.value, key)) {
        filterStateUserDetail.value[key] = key === valueFilter;
      }
    }
  }
};
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

const handleCheckboxChange = (item: any, event: any, reset = false, sr_id?: string | number) => {

  const isChecked = event.target.checked;
  if (isChecked) {
    userStore.aoiSelected.push({ ...item, sr_id });
  } else {
    userStore.aoiSelected = userStore.aoiSelected.filter( (x:any) => x.id != item.id )
  }
  selectedCheckboxes.value[item.aoi_id] = reset ? undefined : isChecked;
};

watch(() => userStore.aoiSelected.length, () => {
  drawAoiSelected()
});

const expandedRows = ref<number[]>([]);
const selectedCheckboxes: any = ref({});

const isRowExpanded = (srId: number) => {
  return expandedRows.value.includes(srId);
};

const toggleRowExpansion = (srId: number) => {
  const index = expandedRows.value.indexOf(srId);
  if (index !== -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(srId);
  }
};

const filterOptionsUserDetail = computed((): FilterOption[] => {
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
  if (acquisition_mode.value !== "") {
    filterOptionsArray.push({
      field: "acquisition_mode_id",
      criteria: acquisition_mode.value,
      comparison: caseInsensitiveIncludes,
    });
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
      field: "aoi_id",
      criteria: aoiGroup,
      comparison: () => true,
    });
  } else if (Array.isArray(aoiGroup)) {
    if (aoiGroup.length > 0) {
      filterOptionsArray.push({
        field: "aoi_id",
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

watch(filterOptionsUserDetail, async (newFilterOptions, oldFilterOptions) => {
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
  resetOffsetValueDetailUsers()
  if (offsetValueDetailUsers === 0) {
    pagPropertyDetaiUsers.lastPage = true
  } else {
    pagPropertyDetaiUsers.lastPage = false
  }
  let result = [...userStore.itemsSelected]
  const userIds = result.map(item => item.user_id.toString());
  const userIdObject = { user_id: userIds };
  await getConflict({
    ...userIdObject,
    ...keyValueObject,
    limit: serverOptionsDetailUsers.rowsPerPage,
    offset: offsetValueDetailUsers,
    sort_by: serverOptionsDetailUsers.sortBy,
    sort: serverOptionsDetailUsers.sortType === "asc" ? "ascending" : "descending",
  });
  pagPropertyDetaiUsers.nextPage = userDataDetailCount < 10
})

onMounted(async () => {
  await satDataStore.getSatData('mission')
  await satDataStore.getSatData('acquisition_mode')
  await getData()
  resetValueFilter()
  userStore.itemsIdUserDetails = JSON.parse(JSON.stringify(userStore.itemsSelected))
});

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
  userStore.aoiSelected = []
}

const satDataStore = useSatDataStore();

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
  }).sort((a:any, b:any) => a.label.localeCompare(b.label));
}
watchEffect(() => {
  if(userStore.itemsIdUserDetails.length === 1){
    const id = userStore.itemsIdUserDetails[0]?.user_id
    const userId = id ? id : '' 
    valueSelect.value = String(userId)
  }else{
    valueSelect.value = ''
  }
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
    // const optionLabel = getDataSelect(option[0])
    // if (optionLabel) {
    //     let labels: any = [];
    //     option[1].forEach((element: any) => {
    //         const viewLabel = optionLabel.find(x => x.value == element)
    //         labels.push(viewLabel?.label)
    //     });
    //     const viewLabel = labels.join(' , ')
    //     let value = handleLabelMultiselectFilter(option[0], isButton) + viewLabel
    //     return value
    // }
    return ''
}
</script>
<template>
    <div id="tooltipHistory" class="ol-tooltip"></div>
  <DetailsCustom 
    widthContent="100%" 
    width="100%" 
    widthDetails="100%" 
    :itemSelected="userStore.userDetailsSeletect">

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
      <div style="font-size: 14px; font-family: 'Roboto'; color: white; margin-left: 10px"> User </div>
    </template>
    <template #firstDivLeft>
      <div style="z-index: 200; width: 424px;" v-if="userStore.itemsIdUserDetails?.length > 0">
        <qtm-dropdown-select size="medium" scrollable
          @value-changed="(event: any) => valueSelect = event.detail.valueChanged" :value="valueSelect"
          style=" scrollbar-width: var(--scrollbar-width, auto); scrollbar-color: #3b3d50 #1c1d26;">
          <qtm-dropdown-select-option v-if="userStore.itemsIdUserDetails?.length !== 1" :value="''">All</qtm-dropdown-select-option>
          <template  v-for="(optionsSelect, index) in userStore.itemsIdUserDetails" :key="index"
            style="height: 150px !important;">
            <qtm-dropdown-select-option :value="optionsSelect.user_id">
              {{ optionsSelect.user_id }}
            </qtm-dropdown-select-option>
          </template>
        </qtm-dropdown-select>
      </div>
    </template>
    <template #firstDivRight>
      <!-- <QtmButton variant="outline" color="neutral" label="View all users" :disabled="userStore.verifySeletedUsers()"
        @click-event="userStore.activeAllUserDetail()"></QtmButton> -->
    </template>

    <template #secondDiv>
      <EasyDataTable 
      class="table-rule-select-custom-th table-rule-date-top"
        :body-row-class-name="(item: Item, rowNumber: number) => bodyRowClassNameFunction(item, rowNumber, isRowExpanded(item.id))"
        v-model:items-selected="userStore.userDetailsSeletect" 
        :headers="headersDetail"
        :items="userStore.userDataDetail" 
        :filter-options="filterOptionsUserDetail" 
        theme-color="#4c5dff"
        table-class-name="customize-table" 
        header-text-direction="left" 
        body-text-direction="left"
        :table-height="screenStore.screenHeight - 410" 
        multi-sort style="z-index: 140;" 
        :rows-items="[10, 25, 50, 100, 250, 500]"
        :rows-per-page="10" 
        alternating
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        >
        <template #header-sr_id="header">
          <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_sr_id = false">
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
                @click.stop="handleFilterStateUserDetail('showFilter_sr_id')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateUserDetail.showFilter_sr_id" @click.stop>
                <QtmTextInput :value="sr_id_temp" @value-changed="(event: any) => sr_id_temp = event.detail" placeholder="Search"
                  size="small" left-icon="search" @click.stop>
                </QtmTextInput>
                <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton variant="outline" color="primary" size="small"
                      @click.stop="handleFilter('reset','sr_id')">Reset</QtmButton>
                    <QtmButton variant="filled" color="primary" size="small"
                      @click.stop="handleFilter(sr_id_temp,'sr_id'), filterStateUserDetail.showFilter_sr_id = false">Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-user_id="header">
        <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_user_id = false">
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
              @click.stop="handleFilterStateUserDetail('showFilter_user_id')"
            ></qtm-icon>
            <div class="filter-menu" v-if="filterStateUserDetail.showFilter_user_id">
              
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
                    @click="() => {applyUserFilters(),filterStateUserDetail.showFilter_user_id = false}"
                    >Apply</QtmButton
                  >
                </div>
              </div>

            </div>
          </div>
        </ClickOutSide>
        </template>
        <template #header-source="header">
          <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_source = false">
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
                @click.stop="handleFilterStateUserDetail('showFilter_source')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateUserDetail.showFilter_source" @click.stop>
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
                        @click.stop="handleFilter(source_type_temp, 'source_type'), filterStateUserDetail.showFilter_source = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois="header">
        <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_aois = false">
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
              @click.stop="handleFilterStateUserDetail('showFilter_aois')"
            ></qtm-icon>
            <div class="filter-menu" v-if="filterStateUserDetail.showFilter_aois">
              
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
                    @click="() => {applyAoiFilters(),filterStateUserDetail.showFilter_aois = false}"
                    >Apply</QtmButton
                  >
                </div>
              </div>

            </div>
          </div>
        </ClickOutSide>
        </template>
        <template #header-aois_mission_sensor="header">
          <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_mission = false">
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
                size="medium" @click.stop="handleFilterStateUserDetail('showFilter_mission')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateUserDetail.showFilter_mission" @click.stop>
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
                        @click.stop="handleFilter(selectedMissionIdsTemp, 'mission'), filterStateUserDetail.showFilter_mission = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois_acquisition_mode="header">
          <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_acquisition_mode = false">
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
              <qtm-icon icon="filter_list" :class="`column-filter ${selectedAcquisitionModeIdsTemp.length > 0 ? 'column-filtered' : ''}`" size="medium" @click.stop="handleFilterStateUserDetail('showFilter_acquisition_mode')"></qtm-icon>
              <div class="filter-menu" v-if="filterStateUserDetail.showFilter_acquisition_mode" @click.stop>
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
                        @click.stop="handleFilter(selectedAcquisitionModeIdsTemp, 'acquisition_mode_id'), filterStateUserDetail.showFilter_acquisition_mode = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois_rules="header">
          <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_aois_rules = false">
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
                @click.stop="handleFilterStateUserDetail('showFilter_aois_rules')"></qtm-icon>
              
              <div class="filter-menu" v-if="filterStateUserDetail.showFilter_aois_rules" @click.stop>
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
                        @click.stop="handleFilter(rule_name_temp, 'rule_id'), filterStateUserDetail.showFilter_aois_rules = false">
                        Apply</QtmButton>
                  </div>
              </div>
            </div>
          </ClickOutSide>
        </template>
        <template #header-aois_sensing_time ="header">
          <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_sensing_time = false">
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
              <qtm-icon icon="filter_list" :class="`column-filter ${((sensing_start_time && sensing_start_time.toString().length > 0) || (sensing_end_time && sensing_end_time.toString().length > 0)) ? 'column-filtered' : ''}`" size="medium" @click.stop="handleFilterStateUserDetail('showFilter_sensing_time')"></qtm-icon>
             
              <div class="filter-menu" style="width: 450px !important; position: absolute; right: 0" v-if="filterStateUserDetail.showFilter_sensing_time">

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
                      @click.stop="handleFilter(sensing_start_time_temp, 'sensing_time'), filterStateUserDetail.showFilter_sensing_time = false">
                      Apply</QtmButton>
                  </div>
              </div>


            </div>
          </ClickOutSide>
        </template>
        <template #header-enforcement_time ="header">
          <ClickOutSide @clickoutside="filterStateUserDetail.showFilter_enforcement_time = false">
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
              <qtm-icon icon="filter_list" :class="`column-filter ${((enforcement_start_time && enforcement_start_time.toString().length > 0) || (enforcement_end_time && enforcement_end_time.toString().length > 0)) ? 'column-filtered' : ''}`" size="medium" @click.stop="handleFilterStateUserDetail('showFilter_enforcement_time')"></qtm-icon>
              
              <div class="filter-menu" style="width: 450px !important; position: absolute; right: 0" v-if="filterStateUserDetail.showFilter_enforcement_time">

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
                      @click.stop="handleFilter(enforcement_start_time_temp, 'enforcement_time'), filterStateUserDetail.showFilter_enforcement_time = false">
                      Apply</QtmButton>
                  </div>
              </div>


            </div>
          </ClickOutSide>
        </template>
       
        <template #item-sr_id="item">
          <div style="display: flex; align-items: center">
            <QtmIcon :icon="isRowExpanded(item.id) ? 'expand_less' : 'expand_more'" size="medium" variant="outlined"
              style="cursor: pointer" @click="() => {
                toggleRowExpansion(item.id);
              }
                ">
            </QtmIcon>
            <span style="margin-left: 3px">{{ item.sr_id? item.sr_id:'-' }} </span>
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
          <ul v-if="expandedRows.includes(items.id)" style="margin-top: 50px;">
            <li v-for="item in items.aois" style="margin-bottom: 30px;">
              <div class="checkbox-rule-history">
                <qtm-checkbox size="small" :input-id="`layerAirports-${item.aoi_id}`"
                  :checked="selectedCheckboxes[item.aoi_id]"
                  @change="handleCheckboxChange(item, $event, false, items.sr_id)">
                  {{ item.aoi_id }}
                </qtm-checkbox>
              </div>
            </li>
          </ul>
          <div v-else>
            <div v-for="(item, index) in items.aois" >
              <div v-if="index === 0" >
                <qtm-checkbox size="small" :input-id="`layerAirports-${item.aoi_id}`"
                  :checked="selectedCheckboxes[item.aoi_id]"
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
            <!-- <ul v-if="expandedRows.includes(items.id)" style="margin-top: 50px;">
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
            <ul v-if="expandedRows.includes(items.id)" style="margin-top: 50px;">
              <div v-for="item in items.aois">
                <!-- <li v-for="item2 in item.rules">
                  <div class="style-text-row-table" style="margin-bottom: 30px">{{ item2.acquisition_mode_id }}</div>
                </li> -->
                <li>
                  <div class="style-text-row-table" style="margin-bottom: 30px">{{ item.acquisition_mode_id }}</div>
                </li>
              </div>
            </ul>
            <div v-else>
              <div v-for="(item, idx) in items.aois">
                <!-- <div v-for="(item2, index) in item.rules" v-if="idx === 0">
                  <div v-if="index === 0">{{
                    item2.acquisition_mode_id }}</div>
                </div> -->
                <div >
                  <div v-if="idx === 0">{{
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
            <ul v-if="expandedRows.includes(items.id)" style="margin-top: 50px;">
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
            <ul v-if="expandedRows.includes(items.id)" style="margin-top: 50px;">
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
            <ul v-if="expandedRows.includes(items.id)" style="margin-top: 50px;">
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
          :classes="'icon-left-right ' + ( pagProperty.lastPage ? 'cursor-disabled' : 'cursor-pointer')"
            @click=" !pagProperty.lastPage  ? loadFromServer(-serverOptions.rowsPerPage) : ''"></QtmIcon>
          <QtmIcon icon="chevron_right" size="medium"
          :classes="'icon-left-right ' + ((pagProperty.nextPage ) ? 'cursor-disabled' : 'cursor-pointer')"
          @click=" !pagProperty.nextPage ? loadFromServer(serverOptions.rowsPerPage) : ''"></QtmIcon>
        </template>

      </EasyDataTable>
    </template>
  </DetailsCustom>
  <teleport to=".map">
    <div class="container-modall" v-show="userStore.userDetailsSeletect?.length">
      <qtm-checkbox size="small" @change="handleCheckboxChangeOptionTeleport($event, 'rule')" v-model="historyRules" checked
      class="items-modal">Rules</qtm-checkbox>
      <qtm-checkbox size="small" @change="handleCheckboxChangeOptionTeleport($event, 'aoi')" v-model="historyAoi" checked class="items-modal">Aoi</qtm-checkbox>
      <!-- <qtm-checkbox size="small" checked class="items-modal">Service requests</qtm-checkbox>  -->
    </div>
  </teleport>
</template>
<style scope>
.container-modall {
  width: 220px;
  background-color: black;
  height: max-content;
  margin-top: 10px;
  margin-left: 5px;
  padding: 15px 10px;
  position: absolute;
  gap: 10px;
  display: flex;
  flex-direction: column;
  z-index: 160;
  top: 0;
  left: 0;

}
.user-details .p-multiselect-header .p-checkbox {
  display: block !important;
  margin-right: 5px !important;
  width: 40% !important;
  display: flex !important;
  flex-direction: row;
  justify-content: flex-start;
  gap: 7px;
  align-items: center;
}
.custom-scrollbar {
  display: flex;
  max-width: 500px;
  overflow-y: auto;
  scrollbar-width: var(--scrollbar-width, auto); 
  scrollbar-color: #3b3d50 #1c1d26;
  padding-top: 12px;
}

.container-icon {
  display: flex;
  justify-content: end;
  margin-right: -15px;
  margin-top: 10px;
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
