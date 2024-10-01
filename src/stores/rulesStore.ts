import { TAB_RULES } from "@/constants/constants";
import { filterEmptyValues } from "@/helpers/filterSearchHelper";
import rulesService from "@/services/rulesService";
import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import type { Item } from "vue3-easy-data-table";
import { usePopupAlertStore } from "./popupAlertStore";
import aoiService from "@/services/aoiService";
import { convertFormatDate } from "@/helpers/convertDateTime";
import { exportToXmlAndShp } from "@/helpers/exportToXmlAndShp";
import { exportToPdf } from "@/helpers/exportToPdf";
import { useModalSelectedStore } from "./modalSelectedStore";
import { useAdvanceSearchPanelStore } from "./advancedSearchPanelStore";
import { validEditFormConfigRules } from "@/modules/rules/config/formConfig";
import type { IAoiDraw } from "@/interfaces/IDraw";
import { useMapViewStore } from "./mapViewStore";
import { useMissionStore } from "./missionStore";
import html2PDF from 'jspdf-html2canvas';
import { useExportStore } from "./exportStore";
import { useLoadStore } from "./loadStore";
import useFilterRules from "@/modules/rules/hooks/useFilterRules";
import { useFilterStore } from "./filtersStore";
import type { IRulesFilter } from "@/interfaces/IRules";
export const useRulesStore = defineStore('rulesStore', () => {
    const rulesData = ref<any[]>([])
    const rulesAll = ref<any[]>([])
    const rulesDataDetail = ref<any[]>([])
    const rulesSelectedAddGroup = ref<any[]>([])
    const popupAlertStore = usePopupAlertStore()
    const modalSelected = useModalSelectedStore()
    const exportStore = useExportStore()
    const loadStore = useLoadStore()
    const advanceSearchPanelStore = useAdvanceSearchPanelStore()
    const viewRules = ref<'map'| 'table'| 'divide'>('map')
    const itemsSelected = ref<Item[]>([]);
    const itemsIdRulesDetails = ref<Item[]>([]);
    const valuesFilter = ref<any>({})
    const selectedFilters = ref<IRulesFilter>({} as IRulesFilter)
    const valuesFilterCustom = ref<any>({})
    const menuSelected = ref<string>(TAB_RULES)
    const initialData = ref<any>(null)
    const showModalExport = ref<boolean>(false)
    const showConflictManagement = ref<boolean>(false);
    const showConflictMinimize = ref<boolean>(false);
    const showConflictMoved = ref<boolean>(true);
    const rulesDataCount = ref<number>(0)
    const isEditRule = ref<boolean>(false)
    const mapViewStore = useMapViewStore() 
    const formData = ref<any>({}); 
    const missionStore = useMissionStore()
    const expandDetailRule = ref<boolean>(false);
    const searchValueRulesDinamic = ref<string>('')
    const modalContentChangeRuleHistory = ref<any>('');
    const modalContentDefaulftRuleHistory = ref<any>('');
    const selectedAoisViewIds = ref<string[]>([])
    const exportRuleDetails = ref<Item[]>([]);
    const titleExportRuleHistory = ref<string>('')
    const titleExportRule = ref<string>('')
    const clasificationLvl = ref<string>('')
    const clasificationLvlRule = ref<string>('')
    const rulesSelectedDraw = ref<string[]>([])
    const aoiSelected = ref<any>([]);
    const minimizeItems = ref<string[]>([]);
    const limitData = ref<number>(10)
    const isInitDataRule = ref(true)
    const resetLabelDate = ref(false)
    const restoreStates = () => {
      advanceSearchPanelStore.closeSearchPanel('searchAdvancedRules')
      rulesData.value = []
      rulesDataDetail.value = []
      rulesSelectedAddGroup.value = []
      viewRules.value = 'map'
      itemsSelected.value = []
      itemsIdRulesDetails.value = []
      valuesFilter.value = {}
      menuSelected.value = TAB_RULES
      showModalExport.value = false
      showConflictManagement.value = false
      showConflictMinimize.value = false
      showConflictMoved.value = false
      searchValueRulesDinamic.value = ''
      clasificationLvl.value = ''
      titleExportRuleHistory.value = ''
      titleExportRule.value = ''
      clasificationLvlRule.value = ''
    }
    const addMinimizeItem = (item: string) => {
      if(minimizeItems.value.find(x => x === item)) return
      minimizeItems.value.push(item);
    }
    const removeMinimizeItem = (item: string) => {
      const items = [ ...minimizeItems.value ];
      minimizeItems.value = items.filter(x => x !== item)
    }
    const handleShowConflictManagement = () => {
      showConflictManagement.value = !showConflictManagement.value;
      showConflictMinimize.value = !showConflictMinimize.value
    }
    const handleShowModalExport = () => {
      showModalExport.value = !showModalExport.value
    }
    const setInitialData = (data:any) => {
      initialData.value = data
    }

    const resetFilters = () => {
      selectedFilters.value = {} as IRulesFilter;
    }
    
    const hasObjectData = (obj:{}) => {
      return Object.keys(obj).length > 0 && obj.constructor === Object;
    };

    const disableFormRule = computed(() => hasObjectData(formData.value));

    const handleExportRules = async (data:string[],titleDoc:string,clasification:string) => {
      titleExportRule.value = titleDoc
      clasificationLvlRule.value = clasification
      
      for (const item of data) {
        const rule_id = itemsSelected.value.map(it => it.rule_id);
        
        const valueSend = {
          export_format: item
        }
        try {
          if(item === 'shp' || item === 'xml'){
            loadStore.setLoading(true);
            const response = await rulesService.getExport({...valueSend,rule_id});
            exportToXmlAndShp(response, item, 'rules')
            loadStore.setLoading(false);
          }
          if(item === 'pdf'){
            loadStore.setLoading(true);
            loadStore.showProgressBar = true
            loadStore.progress = 0
            await exportStore.exportRule()
            loadStore.setLoading(false);
            loadStore.showProgressBar = false
          }
          if(item === 'pdfC' ){
            loadStore.setLoading(true);
            loadStore.showProgressBar = true
            loadStore.progress = 100
            await exportStore.exportRuleCompressed()
            loadStore.setLoading(false);
            loadStore.showProgressBar = false
          }
        } catch (error) {
            console.error('Error downloading file', error);
        }
      }
      titleExportRule.value = ''
      clasificationLvlRule.value = '' 
    }
    const handleExportHistory = async (data:string[],titleDoc:string,clasification:string) => {
      titleExportRuleHistory.value = titleDoc
      clasificationLvl.value = clasification
      for (const item of data) {
        const valueSend = {
          ...valuesFilter.value,
          export_format: item
        }
        try { 
          if(item === 'pdf'){
            loadStore.setLoading(true);
            loadStore.showProgressBar = true
            loadStore.progress = 0
            await exportStore.exportRuleHistory()
            titleExportRuleHistory.value = ''
            clasificationLvl.value = ''
            loadStore.setLoading(false);
            loadStore.showProgressBar = false
          }
          if(item === 'pdfC'){
            loadStore.setLoading(true);
            loadStore.showProgressBar = true
            loadStore.progress = 100
            await exportStore.exportRuleHistoryCompressed()
            titleExportRuleHistory.value = ''
            clasificationLvl.value = ''
            loadStore.setLoading(false);
            loadStore.showProgressBar = false
          }
      } catch (error) {
          console.error('Error downloading file', error);
      }
      }
      
    }
    const menuChange = (option:string) =>{
      modalSelected.addOption(option)
      menuSelected.value = option
    }
    const verifyMenu = (value:string) =>{
     return menuSelected.value === value
    }
    const {
      getFilterRuleValues
    } = useFilterRules();
    const handleValuesFilter = (values:any) => {
      let filteredUser = filterStore.rulesFilters.user;
      if (filteredUser && Array.isArray(filteredUser) && filteredUser.length > 0) {
        values = { ...values, user: filteredUser };
      }
      values = { ...values,
        q:searchValueRulesDinamic.value,
        status: values?.status || ( searchValueRulesDinamic.value !==''?'':'active'),
        sort_by: values?.sort_by || 'rule_id',
        sort: values?.sort || 'descending',
        limit: String(limitData.value),
        offset: values?.offset || '0'
      };
      valuesFilterCustom.value = values;
      valuesFilter.value = filterEmptyValues(values);
    }
    const filterStore = useFilterStore();
    const dataRules = async (values?:any, refresh: boolean = true) => {
        // const filteredValues = filterEmptyValues(values);
        if (refresh) {
          limitData.value = values ? values.limit : 10
          handleValuesFilter(values)
        }  
        const response  = await rulesService.get(valuesFilter.value)
        if(response){
          clearRulesResult()
          setTimeout(() => {
            
            response.forEach((element:any) => {
              if(String(element.acquisition_mode_id).toLowerCase() === 'scansar') {
                element.acquisition_mode_id = 'ScanSAR'
              }
              if(String(element.acquisition_mode_id).toLowerCase() === 'stripmap') {
                element.acquisition_mode_id = 'Stripmap'
              }
              if(String(element.acquisition_mode_id).toLowerCase() === 'spotlight') {
                element.acquisition_mode_id = 'Spotlight'
              }
            });
            rulesData.value = response
            rulesDataCount.value = response.length
          }, 200);
        }
    }
    const dataRulesNameAll = async () => {
      const response = await rulesService.getRuleNameAll()
      if(response){
        rulesAll.value = response
      }
      
    }
    const clearRulesResult = () => {
      rulesData.value = []
      rulesDataCount.value = 0
    }
    const loadShpFile = async (data:FormData) =>{
      return await rulesService.postLoadShp(data)
    }
    const findRulesByName = async (name:string) => {
      return await rulesService.get({rule_name:name})
    }
    const findRuleById = async (id:number) => {
      return await rulesService.getById(id)
    }
    const postRules = async (data:any) => {
      try {
        const filteredValues = filterEmptyValues(data);
        //filteredValues.status = "active"
        const response = await rulesService.post(filteredValues)
        return response
      } catch (error:any) {
        let {error: err} = error
        popupAlertStore.showPopupAlert(err.status, err.message)
        // popupAlertStore.showPopupAlert(error.response.statusText, error.response.data.detail)
        return error
      }
      
    }
    const putRules = async (data:any, id: number) => {
      try {
        const filteredValues = filterEmptyValues(data);
        filteredValues.status = "active"
        await rulesService.put(filteredValues, id)
        popupAlertStore.showPopupAlert('Success', 'Updated successfully')
      } catch (error:any) {
        let {error: err} = error
        popupAlertStore.showPopupAlert('Error  ' + err.status, err.message)
        //popupAlertStore.showPopupAlert(error.response.statusText, error.response.data.detail)
      }
      
    }
    const postImportRules = async (data:any, fileExtension:string = 'json') => {
      try {
       /* if(fileExtension!='json'){
         return popupAlertStore.showPopupAlert('ERROR', "Invalid file")
        }*/
        
        if(fileExtension.valueOf() =='json' || fileExtension.valueOf() =='xml'){
          await rulesService.postImport(data,fileExtension)
          popupAlertStore.showPopupAlert('Success', 'Imported successfully')
        }else{
        
          return  popupAlertStore.showPopupAlert('ERROR', "Invalid file")
        }      

      } catch (error:any) {
        if(error.response){
          popupAlertStore.showPopupAlert('ERROR',error.response.statusText +': '+ error.response.data.detail)
        }else{
          popupAlertStore.showPopupAlert('ERROR', "Invalid file")
        }
        
      }  
    }
    const postImportShpRules = async (data:any) => {
      try {
        let result = await rulesService.postImportShp(data)
        popupAlertStore.showPopupAlert('Success', 'Imported successfully')
        return result
      } catch (error:any) {
        if(error.response){
          popupAlertStore.showPopupAlert(error.response.statusText, error.response.data.detail)
        }else{
          popupAlertStore.showPopupAlert('ERROR', error)
        }
       
      }  
    }
    const removeData = async (idItem:any) => {
          
      popupAlertStore.showPopupAlert(`Delete ${idItem.rule_name}`, 'Are you sure you want to delete the selected rule?', 'Confirm',true).then(async () => {
        try { 
          await rulesService.delete(idItem.rule_id);
          const filters = {
            ...filterStore.rulesFilters,
            limit: limitData.value
          }
          await dataRules(filters);
        } catch (error:any) {
          popupAlertStore.showPopupAlert(error.response.statusText, error.response.data.detail)
        }
      });
    }

    const postCloneRules = async (item:any) => {
      try {
        await popupAlertStore.showPopupAlert(`Clone ${item.rule_name}`, 'Are you sure you want to clone the selected rule?', 'Confirm', true);       
        let data = await rulesService.postClone(item.rule_id);
        const filters = {
          ...filterStore.rulesFilters,
          limit: limitData.value
        };
        await dataRules(filters);
        popupAlertStore.showPopupAlert('Success', 'Successful cloning');
        return data; 
      } catch (error:any) {
        let { error: err } = error;
        popupAlertStore.showPopupAlert('Error ' + err.status, err.message);
      }
    };
    
    const suspendData = async (item:any) => {
      popupAlertStore.showPopupAlert(`Suspend ${item.rule_name}`, 'Are you sure you want to suspend the selected rule?', 'Confirm',true).then(async () => {
        try {
          await rulesService.postSuspend(item.rule_id)
          const filters = {
            ...filterStore.rulesFilters,
            limit: limitData.value
          }
          await dataRules(filters);
          popupAlertStore.showPopupAlert('Success', 'Rule suspended successfully')
        } catch (error:any) {
          popupAlertStore.showPopupAlert(error.response.statusText, error.response.data.detail)
        }
      });
    }
    const activeData = async (item:any) => {
      popupAlertStore.showPopupAlert(`Active ${item.rule_name}`, 'Are you sure you want to active the selected rule?', 'Confirm',true).then(async () => {
        try {
          await activeRule(item.rule_id)
          const filters = {
            ...filterStore.rulesFilters,
            limit: limitData.value
          }
          await dataRules(filters);
          popupAlertStore.showPopupAlert('Success', 'Rule active successfully')
        } catch (error:any) {
          popupAlertStore.showPopupAlert(error.response.statusText, error.response.data.detail)
        }    
      });      
    }
    const activeRule = async (id:string)=> {
      await rulesService.postActive(id)
    }
    const handleviewRules = (value:'map'| 'table'| 'divide') =>{
        viewRules.value = value
    }
    const handleRulesDetails = async () => {
      itemsIdRulesDetails.value = []
      rulesDataDetail.value = []

      let result = [...itemsSelected.value]

      const ruleIds = result.map(item => item.rule_id.toString());
      const ruleIdObject = { rule_id: ruleIds };
      await missionStore.getConflict({
        ...ruleIdObject,
        limit: 10,
        offset: 0,
        sort_by: "id",
        sort: "descending",
      })
      rulesDataDetail.value = missionStore.conflictData
      missionStore.serverItemsDetailRulesLength = missionStore.rulesDataDetailRulesCount;
      missionStore.pagPropertyDetailRules.lastPage = true
      missionStore.pagPropertyDetailRules.nextPage = missionStore.rulesDataDetailRulesCount < 10

      

      itemsIdRulesDetails.value = JSON.parse(JSON.stringify(itemsSelected.value))
      exportRuleDetails.value = JSON.parse(JSON.stringify(itemsSelected.value))

      
      /*itemsIdRulesDetails.value = JSON.parse(JSON.stringify(itemsSelected.value));
      itemsIdRulesDetails.value.sort((a, b) => a.rule_id - b.rule_id);
      if (itemsIdRulesDetails.value.length > 0) {
        itemsIdRulesDetails.value.forEach((item, index) => {
          item.activeItem = index === 0;
          if(index === 0){
            dataRulesDetail(item.rule_id)
          }
        });
      }*/
    }
    const dataRulesDetail = async (idRule:string) =>{
        const response  = await aoiService.getAsync({rule_id:idRule})
        if(response){
          rulesDataDetail.value = response
        }
    }
    const activeRulesDetailId = async(id:string) => {
      if(id.length == 0){ 
        let result = [...itemsSelected.value]
        const ruleIds = result.map(item => item.rule_id.toString());
        const ruleIdObject = { rule_id: ruleIds };
        await missionStore.getConflict({
          ...ruleIdObject,
          limit: 10,
          offset: 0,
          sort_by: "id",
          sort: "descending",
        })
        exportRuleDetails.value = itemsIdRulesDetails.value
      }else{
        await missionStore.getConflict({
          rule_id: id,
          limit: 10,
          offset: 0,
          sort_by: "id",
          sort: "descending",
        })
        exportRuleDetails.value = itemsIdRulesDetails.value.filter(item => item.rule_id == id)
      }
      rulesDataDetail.value = missionStore.conflictData
      missionStore.serverItemsDetailRulesLength = missionStore.rulesDataDetailRulesCount;
      missionStore.pagPropertyDetailRules.lastPage = true
      missionStore.pagPropertyDetailRules.nextPage = missionStore.rulesDataDetailRulesCount < 10
    }
    const verifySeletedRules = () => {
      const valueSeleted = itemsIdRulesDetails.value.filter(item => item.activeItem);
      if(valueSeleted.length > 1){
        return true
      }
      return false
    }
    const activeAllDetail = async () =>{
      rulesDataDetail.value = []
      for (let index = 0; index < itemsIdRulesDetails.value.length; index++) {
        const item = itemsIdRulesDetails.value[index];
        item.activeItem = true;
        const response = await aoiService.getAsync({rule_id:item.rule_id})
        if(response){
          rulesDataDetail.value.push(...response)
      }
    }
    }

    const risizeRuleDetail = () => {
      expandDetailRule.value = !expandDetailRule.value;
    }

    const defaultRuleDetail = () => {
      expandDetailRule.value = false;
    }

    const updateDataRuleDetail = () => {
      rulesDataDetail.value = missionStore.conflictData
    }

    const handleResetDate = (value = false) => {
      resetLabelDate.value = value
    }

    watch(() => initialData.value, (value) => {
      if(value){
        const selectedAreas: IAoiDraw[] = [{
          wkt: initialData.value.geometry.area_wkt,
          colorType: initialData.value.rule_type
        }]
        mapViewStore.selectAOIdraw(selectedAreas);
      }else{
        mapViewStore.restoreZoom();
        mapViewStore.removeVectorLayer()
      }
    })


return{
    itemsSelected,
    rulesData,
    dataRules,
    handleviewRules,
    viewRules,
    menuSelected,
    menuChange,
    verifyMenu,
    postRules,
    putRules,
    removeData,
    postCloneRules,
    postImportRules,
    rulesSelectedAddGroup,
    itemsIdRulesDetails,
    rulesDataDetail,
    handleRulesDetails,
    activeRulesDetailId,
    handleValuesFilter,
    showModalExport,
    handleShowModalExport,
    handleExportRules,
    activeAllDetail,
    verifySeletedRules,
    findRulesByName,
    showConflictManagement,
    handleShowConflictManagement,
    showConflictMinimize,
    showConflictMoved,
    restoreStates,
    rulesDataCount,
    findRuleById,
    setInitialData,
    initialData,
    valuesFilterCustom,
    valuesFilter,
    isEditRule,
    formData,
    disableFormRule,
    handleExportHistory,
    expandDetailRule,
    risizeRuleDetail,
    defaultRuleDetail,
    suspendData,
    searchValueRulesDinamic,
    modalContentChangeRuleHistory,
    modalContentDefaulftRuleHistory,
    activeData,
    exportRuleDetails,
    titleExportRuleHistory,
    clasificationLvl,
    selectedAoisViewIds,
    titleExportRule,
    clasificationLvlRule,
    updateDataRuleDetail,
    aoiSelected,
    activeRule,
    loadShpFile,
    minimizeItems,
    addMinimizeItem,
    removeMinimizeItem,
    postImportShpRules,
    limitData,
    resetFilters,
    selectedFilters,
    dataRulesNameAll,
    rulesAll,
    isInitDataRule,
    resetLabelDate,
    handleResetDate
}
})