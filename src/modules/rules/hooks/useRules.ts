import { TAB_FORM_ADD_RULE, TAB_RULES, TAB_SHC_ADD_RULE } from "@/constants/constants";
import { useMapViewStore } from "@/stores/mapViewStore";
import { useRulesStore } from "@/stores/rulesStore";
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import { useUserStore } from "@/stores/userStore";
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { formConfigRules, validEditFormConfigRules } from "../config/formConfig";
import { useModalSelectedStore } from "@/stores/modalSelectedStore";
import { isEmptyExcludingDates } from "@/helpers/multisteepHelper";
import { usePopupAlertStore } from "@/stores/popupAlertStore";
import { Polygon as PolygonGeom } from "ol/geom.js";
import { useGroupStore } from "@/stores/groupStore";
import { useLoadStore } from "@/stores/loadStore";
import * as olProj from 'ol/proj';
import { convertToWKT, ensurePolygonClosed } from "@/helpers/convertWKT";
import { Feature } from "ol";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
interface Option {
  label: string;
  value: string;
}
export default function useRules() {

  const shcGroupsStore = useShcGroupsStore()
  const loaderStore = useLoadStore()
  const groupsStore = useGroupStore()
  const mapStore = useMapViewStore()
  const userStore = useUserStore()
  const rulesStore = useRulesStore()
  const popupAlertStore = usePopupAlertStore()
  const selectedGroup = ref<any[]>([]);
  const filterForName = ref<string>('')
  const cardMinHeight = ref(515);
  const showModalClose = ref(false)
  const requiredInput = ref<"error" | "warning" | "success" | undefined>()
  const currentStepNumber = ref<number>(0)
  const uploadFileInput = document.createElement('input');
  const uploadFileInputShp = document.createElement('input');
  const modalSelected = useModalSelectedStore()
  const menuShape = ref('Polygon');
  const menuGeometry = ref<'shape' | 'country'>('shape')
  const selectedDataStagna = ref<any>();
  const selectOptionPolygon = ref<string>('');
  const activeRuleNew = ref<boolean>(false)
  const dataImportShp = ref({})
  const dataNameImportShp = ref<string>('')
  const isImportedGeometry =ref<boolean>(false)
  const isMultipolygon =ref<boolean>(false)
  const handleMenuShape = (value: string) => {
    menuShape.value = value
  }
  const handleMenuGeometry = (value: 'shape' | 'country') => {
    if (!rulesStore.isEditRule) {
      restoreValuesPolygon(value)
    }
    menuGeometry.value = value
  }
  const restoreValuesPolygon = (value: string) => {
    if (value === 'country') {
      mapStore.restorePoylgonFigure()
      selectedDataStagna.value = undefined
      mapStore.clearDraw()
    }
    if (value === 'shape') {
      mapStore.restoreCountryPoylgonFigure()
      mapStore.removeLayerCountryPolygon()

      selectOptionPolygon.value = ''
    }
  }
  const importFromFile = () => {
    uploadFileInput.value = '';
    uploadFileInput.click();
  };
  const importFromFileShp = async () => {
    uploadFileInputShp.value = '';
    uploadFileInputShp.click();
  };
  const toggleSelectGroup = (group: any) => {
    let groupNoEdit = false;
    if (rulesStore.initialData) {
      if (rulesStore.initialData.groups) {
        let groupIds = rulesStore.initialData.groups.map((group: any) => group.group_id);
        groupNoEdit = groupIds.includes(group.group_id);
        if(group.selected == undefined && groupIds.find( (x:any) => x == group.group_id) && rulesStore.isEditRule == false){
          group.selected = true
        }
      }
    }

    if (groupNoEdit && rulesStore.isEditRule == true) return

    group.selected = !group.selected;
    if (group.selected) {
      selectedGroup.value.push(group.group_id);
    } else {
      const index = selectedGroup.value.indexOf(group.group_id);
      if (index !== -1) {
        selectedGroup.value.splice(index, 1);
      }
    }
  }
  const isSelected = (groupId: any) => {
    return selectedGroup.value.includes(groupId);
  }
  const handlePageChange = async (page: number) => {
    // const newOffset = (page - 1) * groupsStore.limit;
    // groupsStore.offset = newOffset;
    const newOffset = page;
    groupsStore.offset = groupsStore.offset + newOffset;
    await groupsStore.dataGroups();
  }
  const handleLimitChange = async (page: number) => {
    groupsStore.limit = page;
    const newOffset = 0 * groupsStore.limit;
    groupsStore.offset = newOffset;
    await groupsStore.dataGroups();
  };
  const formDataSubmit = async (values: any) => {
    const valuesCopy = JSON.parse(JSON.stringify(values));
    if (menuGeometry.value === 'shape' && mapStore.selectDrawOption === 'Polygon') {
      if (!mapStore.isPolygonValid(mapStore.polygonFigure.cordinates)) {

        popupAlertStore.showPopupAlert('Error', 'Invalid polygon')
        return
      }
    }
    // const verifyName = await rulesStore.findRulesByName(values.rule_name)
    // if (verifyName?.length > 0 && !values.rule_id) {
    //   popupAlertStore.showPopupAlert('Error', 'Rule name already exists')
    //   return
    // }
    if (valuesCopy.sensing_end_time === '') {
      valuesCopy.sensing_end_time = new Date()
    }
    if (valuesCopy.sensing_start_time === '') {
      valuesCopy.sensing_start_time = new Date()
    }
    if (valuesCopy.validity_end_time === '') {
      valuesCopy.validity_end_time = new Date()
    }
    if (valuesCopy.validity_start_time === '') {
      valuesCopy.validity_start_time = new Date()
    }
    if (valuesCopy.acquisition_mode_id && valuesCopy.acquisition_mode_id.length > 0) {
      
      valuesCopy.acq_modes = valuesCopy.acquisition_mode_id.map((aq:any) => ({ id: aq }));
      
      delete valuesCopy.acquisition_mode_id;
    }

    if (valuesCopy.mission_id && valuesCopy.mission_id.length > 0) {
      
      valuesCopy.missions = valuesCopy.mission_id.map((mission:any) => ({ id: mission }));
      
      delete valuesCopy.mission_id;
    }
    
    if (valuesCopy.sensor_type_id && valuesCopy.sensor_type_id.length > 0) {
      valuesCopy.sensors = valuesCopy.sensor_type_id.map((sensor:any) => ({ id: sensor }));
      delete valuesCopy.sensor_type_id;
    }
    
    if (valuesCopy.satellite_id && valuesCopy.satellite_id.length > 0) {
      valuesCopy.satellites = valuesCopy.satellite_id.map((satellite:any) => ({ id: satellite }));
      delete valuesCopy.satellite_id;
    }
    if (mapStore.selectDrawOption === 'Circle') {
      //area_wkt:mapStore.circleFigure.wkt,

      const valueCircle = {
        center: {
          latitude: mapStore.circleFigure.centerLatidude,
          longitude: mapStore.circleFigure.centerLongitude
        },
        geometry_type: "circle",
        radius_km: Number(mapStore.circleFigure.radius)
      }
      valuesCopy.geometry = valueCircle
    } else {
      const currentFigure = mapStore.polygonFigure;
      if (mapStore.polygonFigure.wkt.length) {
//mapStore.polygonFigure.isMultiPolygon?"multipolygon":
        const valuePolygon = {
          area_wkt: ensurePolygonClosed(mapStore.polygonFigure.wktFigure),
          center: null,
          geometry_type:"polygon",
          radius_km: null
        }
        valuesCopy.geometry = valuePolygon
      } else {
        const valuePolygon = {
          area_wkt: mapStore.polygonCountryFigure.wkt,
          center: null,
          geometry_type: "polygon",
          radius_km: null
        }
        valuesCopy.geometry = valuePolygon
      }

    }
    if (userStore.itemsSelectedFormRules.length > 0) {
      valuesCopy.users = userStore.itemsSelectedFormRules
    }
    if (selectedGroup.value.length > 0) {
      valuesCopy.groups = selectedGroup.value.map(id => ({ group_id: id }));
    }
    if(menuGeometry.value === 'country'){
      const selectedValue = selectedDataStagna.value;
      if(selectedValue === undefined ) return
        const stanagCode:string = selectedValue.value//selectedValue.split(' - ')[0].trim();

        if (stanagCode.length === 3) {
            valuesCopy.country = stanagCode;
            valuesCopy.geometry = null;
        } 
    }
    if (valuesCopy.rule_id) {
      await rulesStore.putRules(valuesCopy, valuesCopy.rule_id)
    } else {
      const responsePost = await rulesStore.postRules(valuesCopy)
      if(responsePost){
        if(responsePost.error) {
          popupAlertStore.showPopupAlert(responsePost.error.status, responsePost.error.message)
          return
        }
      }
      if(activeRuleNew.value && responsePost){
        await rulesStore.activeRule(responsePost.rule_id)
        popupAlertStore.showPopupAlert('Success', 'Rule saved and activated successfully')
      }else {
        popupAlertStore.showPopupAlert('Success', 'Rule saved successfully')
      }
    }
    await rulesStore.dataRules({
      ...rulesStore.valuesFilter
    })
    closeFormNewRule()
    if(activeRuleNew.value){
      activeRuleNew.value = false
    }
    
  }
  const handleCurrentRuleId = async (ruleId: number, isEdit = false, isSavedState = false) => {
   
    const data = await rulesStore.findRuleById(ruleId)
    validEditFormConfigRules(isSavedState)
    rulesStore.setInitialData(data)
    
    if (isEdit) {
      rulesStore.isEditRule = isEdit
    }
    rulesStore.menuChange(TAB_FORM_ADD_RULE)
    mapStore.resetPolygonFigure()
    if (rulesStore.showConflictManagement && rulesStore.showConflictMinimize) {
      rulesStore.handleShowConflictManagement()
    }
  }
  const handleCloneRule = async (data:any) => {
    validEditFormConfigRules(true)
    data.rule_id = null
    data.rule_name = data.rule_name + "_cloned"
    data.isCloning = true;
    rulesStore.isEditRule = false;
    rulesStore.setInitialData(data)

    rulesStore.menuChange(TAB_FORM_ADD_RULE)
    mapStore.resetPolygonFigure()
    if (rulesStore.showConflictManagement && rulesStore.showConflictMinimize) {
      rulesStore.handleShowConflictManagement()
    }
  }
  const restoreDefultNewRule = () => {

    mapStore.selectDrawOption = 'None'
    mapStore.removeInteraction()
    mapStore.removeModifyInteraction()
    userStore.itemsSelectedFormRules = []
    selectedGroup.value = []
    mapStore.restorePoylgonFigure()
    restorePolygon()
    mapStore.resetCircleFigure()
    mapStore.restoreCountryPoylgonFigure()
    mapStore.removeCountryMapSelected()
    currentStepNumber.value = 0


  }
  const modalConfirmClose = async (values: any) => {
    const valuesCheck = isEmptyExcludingDates(values);
    const selectUsers = userStore.itemsSelectedFormRules.length > 0;
    const selectGroups = selectedGroup.value.length > 0;
    rulesStore.setInitialData(null);
    if (!valuesCheck || selectUsers || selectGroups) {
      showModalClose.value = true;
    } else {
      closeFormNewRule();
    }
  }
  const closeFormNewRule = () => {
    rulesStore.formData = {}
    restoreDefultNewRule()
    rulesStore.menuChange(TAB_RULES)
    mapStore.cancelDrawing()
    modalSelected.removeOption(TAB_FORM_ADD_RULE)
    modalSelected.removeOption(TAB_SHC_ADD_RULE)
    modalSelected.removeOption(TAB_RULES)
  }
  const resetForm = () => {
    formConfigRules.value.forEach(section => {
      section.fields.forEach((field: any) => {
        if (field.hasOwnProperty('dateOptions')) {
          field.dateOptions.forEach((option: any) => {
            option.value = '';
          });
        } else {
          field.value = '';
        }
      });
    });
  }
  const searchGroup = async () => {
    loaderStore.setLoadingSearch(true)
    groupsStore.setCurrentPage(0);
    if (filterForName.value.length > 0) {

      await groupsStore.dataGroups({ group_name: filterForName.value })
    } else {
      await groupsStore.dataGroups()
    }
    loaderStore.setLoadingSearch(false)
  }
  const handleCurrentStepNumber = (stepNumber: number) => {
    currentStepNumber.value = stepNumber
  }
  watch(filterForName, async (newValue, oldValue) => {
    await searchGroup();
  });
  const handleSubmitFilterRules = async (data: any) => {
    rulesStore.handleValuesFilter(data)
    await rulesStore.dataRules()
  }
  async function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      await rulesStore.postImportRules(file, fileExtension)
      await rulesStore.dataRules()

    }
  }
  async function handleFileShpChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      dataNameImportShp.value = file.name
      dataImportShp.value = await rulesStore.postImportShpRules(file)
    }
  }
  const hasNonEmptyValues = computed(() => {
    return formConfigRules.value.some(section => {
      return section.fields.some((field: any) => {
        if (field.hasOwnProperty('dateOptions')) {
          return field.dateOptions.some((option: any) => option.value !== '');
        } else {
          return field.value !== '';
        }
      });
    });
  });
  uploadFileInput.type = 'file';
  uploadFileInput.style.display = 'none';
  uploadFileInput.addEventListener('change', handleFileChange);
  document.body.appendChild(uploadFileInput);
  
  uploadFileInputShp.type = 'file';
  uploadFileInputShp.style.display = 'none';
  uploadFileInputShp.addEventListener('change', handleFileShpChange);
  document.body.appendChild(uploadFileInputShp);

  onBeforeUnmount(() => {
    uploadFileInput.removeEventListener('change', handleFileChange);
    document.body.removeChild(uploadFileInput);

    uploadFileInput.removeEventListener('change', handleFileShpChange);
    document.body.removeChild(uploadFileInputShp);
  });
  onMounted(async () => {
    //await userStore.dataUser()
    //await groupsStore.dataGroups()
  })
  const sourceWKTGeometry = new VectorSource({ wrapX: false });

    const vectorWktGeometry = new VectorLayer({
      source: sourceWKTGeometry,
    });
  const clearPolygon = () => {
    mapStore.polygonFigure.cordinates = [];
    mapStore.polygonFigure.wkt = '';
    mapStore.polygonFigure.wktFormat = '';
    mapStore.polygonFigure.isMultiPolygon = false;
    vectorWktGeometry.getSource()?.clear();
    mapStore.clearDraw();
  };
  const restorePolygon = async () => {
    await clearPolygon()
    await restoreImportShp()
  }
  const restoreImportShp = () => {
    isMultipolygon.value = false
    isImportedGeometry.value = false
    dataNameImportShp.value = ''
  }

  const isUnSelectGroups = computed(() => {
    const groupIds = rulesStore.initialData?.groups?.map((group: any) => group.group_id) || [];
    const isEditing = rulesStore.isEditRule;
      
    return isEditing 
      ? selectedGroup.value.some(group => !groupIds.includes(group))
      : selectedGroup.value.length > 0;
  });
  
  const isUnSelectUsers = computed(() => {
    const userIds = rulesStore.initialData?.users?.map((user: any) => user.user_id) || [];
    const isEditing = rulesStore.isEditRule;
    
    return isEditing 
      ? userStore.itemsSelectedFormRules.some(user => !userIds.includes(user.user_id))
      : userStore.itemsSelectedFormRules.length > 0;
  });

  const unSelectGroups = () => {
    if (rulesStore.initialData && rulesStore.initialData.groups && rulesStore.isEditRule == true) {
      let groupIds = rulesStore.initialData.groups.map((group: any) => group.group_id);
      const filteredSelectGroups = selectedGroup.value.filter(group => groupIds.includes(group));
      const filteredSelectNoGroups = selectedGroup.value.filter(group => !groupIds.includes(group));
      const filteredItems = groupsStore.groupsData?.response.filter(element => 
        filteredSelectNoGroups.includes(element.group_id) 
      );
      filteredItems?.forEach(element => {
        element.selected = undefined
      });
      selectedGroup.value = filteredSelectGroups
    }else{
      const filteredItems = groupsStore.groupsData?.response.filter(element => 
          selectedGroup.value.includes(element.group_id) 
      );
      filteredItems?.forEach(element => {
        element.selected = undefined
      });
      selectedGroup.value = []
    }
  }
  const unSelectUsers = () => {
    if (rulesStore.initialData && rulesStore.initialData.groups && rulesStore.isEditRule == true) {
      let userIds = rulesStore.initialData.users.map((user: any) => user.user_id);
      const filteredSelectUsers = userStore.itemsSelectedFormRules.filter(user => userIds.includes(user));
      userStore.itemsSelectedFormRules = filteredSelectUsers
    }else{
      userStore.itemsSelectedFormRules = []
    }
  }

  return {
    shcGroupsStore,
    loaderStore,
    mapStore,
    userStore,
    rulesStore,
    selectedGroup,
    filterForName,
    importFromFile,
    importFromFileShp,
    toggleSelectGroup,
    isSelected,
    handlePageChange,
    formDataSubmit,
    resetForm,
    searchGroup,
    handleSubmitFilterRules,
    hasNonEmptyValues,
    requiredInput,
    cardMinHeight,
    closeFormNewRule,
    currentStepNumber,
    handleCurrentStepNumber,
    handleLimitChange,
    showModalClose,
    modalConfirmClose,
    handleMenuShape,
    handleMenuGeometry,
    menuShape,
    menuGeometry,
    restoreDefultNewRule,
    selectedDataStagna,
    selectOptionPolygon,
    handleCurrentRuleId,
    activeRuleNew,
    handleFileShpChange,
    dataImportShp,
    dataNameImportShp,
    isImportedGeometry,
    isMultipolygon,
    handleCloneRule,

    restorePolygon,
    restoreImportShp,
    sourceWKTGeometry,
    vectorWktGeometry,
    clearPolygon,
    unSelectGroups,
    isUnSelectGroups,
    unSelectUsers,
    isUnSelectUsers
  }
}