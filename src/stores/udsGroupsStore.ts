import { convertFormatDate } from "@/helpers/convertDateTime";
import { exportToPdf } from "@/helpers/exportToPdf";
import { exportToXmlAndShp } from "@/helpers/exportToXmlAndShp";
import { filterEmptyValues } from "@/helpers/filterSearchHelper";
import { getValuesAndIds } from "@/helpers/tableHelpers";
import type { IOptionDropdown } from "@/interfaces/IOptionDropdown";
import type { response } from "@/interfaces/IResponse";
import groupsService from "@/services/groupsService";
import udsGroupsService from "@/services/udsGroupsService";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useExportStore } from "./exportStore";
import { useLoadStore } from "./loadStore";

export const useUdsGroupsStore = defineStore('udsGroupsStore', () => {
  const udsGroupsData = ref<response>()
  const udsSelectGroupsData = ref<response>()
  const udsGroupsOptions = ref<any[]>([])
  const udsGroupsDataSelected = ref<any>()
  const udsGroups_dynamic_list = ref<any[]>([])
  const limit = ref<number>(12)
  const offset = ref<number>(0)
  const udsGroupsRules = ref<any[]>([])
  const sortData = ref<string>('descending')
  const sortBy = ref<string>('group_name')
  const searchValueUDS = ref<string>('')
  const exportStore = useExportStore()
  const loadStore = useLoadStore()
  const restoreStates = () => {
    udsGroupsData.value = undefined
    udsGroupsOptions.value = []
    udsGroupsDataSelected.value = undefined
    udsGroups_dynamic_list.value = []
    limit.value = 12
    offset.value = 0
    udsGroupsRules.value = []
    sortData.value = 'descending'
    sortBy.value = 'group_name'

  }
  const resetPagination = () => {
    limit.value = 12
    offset.value = 0
  }
  const dataUdsGroups = async (values?: any) => {
    const filteredValues = filterEmptyValues(values);
    const response = await groupsService.getAllGroups({ 
      sort: sortData.value, 
      limit: limit.value, 
      offset: offset.value, 
      type: 'uds', 
      sort_by: sortBy.value, 
      format: 'json', 
      ...filteredValues 
    })
    // const responseLength = await groupsService.getAllGroups({ 
    //   type: 'uds', 
    //   sort_by: sortBy.value,
    //   format: 'json',
    //    ...filteredValues 
    // })
    if (response) {
      udsGroupsData.value = {
        response: response,
        totalItems: response.length,
        currentPage: limit.value,
      };
      const formattedOptions = response.map((group: any) => ({
        label: "UDS " + group.group_name,
        value: group.group_id
      }));

      udsGroupsOptions.value = formattedOptions

    }
  }

  const setUdsGroupData = async(response:any) => {
    if (response) {
      udsGroupsData.value = {
        response: response,
        totalItems: response.length,
        currentPage: limit.value,
      };
      const formattedOptions = response.map((group: any) => ({
        label: "UDS " + group.group_name,
        value: group.group_id
      }));

      udsGroupsOptions.value = formattedOptions

    }
  }
  const assignSelectData = (data: any) => {
    if (data.response) {
      udsSelectGroupsData.value = data;
    }
}
  const handleUdsGroupsSelected = (item: any) => {
    udsGroupsDataSelected.value = item
    if (item) {
      udsGroupsRules.value = item.group_rules
    }
  }
  const changeSortData = async (valueSort: string, sortByValue: string) => {
    sortData.value = valueSort
    sortBy.value = sortByValue
    await dataUdsGroups()
  }
  const handleExportUdsGroups = async (data: string[],titleDoc:string,clasification:string, option = 'uds') => {
    exportStore.titleExport = titleDoc
    exportStore.clasificationExport = clasification
    
    for (const item of data) {
      const valueSend = {
        export_format: item,
        type: 'uds',
        sort: sortData.value, 
        limit: limit.value, 
        offset: offset.value,  
        sort_by: sortBy.value,
        q:searchValueUDS.value
      }
      try {
        if (item == 'xml') {
          loadStore.setLoading(true);
          const response = await groupsService.getExport(valueSend);
          exportToXmlAndShp(response, item, 'udsGroups')
          loadStore.setLoading(false);
        } else {
          loadStore.setLoading(true);
          loadStore.showProgressBar = true
          loadStore.progress = 100
          await exportStore.exportGroups(option)
          loadStore.setLoading(false);
          loadStore.showProgressBar = false
        }
      } catch (error) {
        console.error('Error downloading file', error);
      }
    }
    exportStore.titleExport = ''
    exportStore.clasificationExport = ''
    

  }
  return {
    dataUdsGroups,
    udsGroupsData,
    handleUdsGroupsSelected,
    udsGroupsDataSelected,
    udsGroupsRules,
    changeSortData,
    limit,
    offset,
    udsGroupsOptions,
    udsGroups_dynamic_list,
    handleExportUdsGroups,
    restoreStates,
    resetPagination,
    setUdsGroupData,
    assignSelectData,
    udsSelectGroupsData,
    searchValueUDS
  }
})