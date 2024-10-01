import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { TAB_RULES } from "@/constants/constants";
import groupsService from "@/services/groupsService";
import { filterEmptyValues } from "@/helpers/filterSearchHelper";
import type { response } from "@/interfaces/IResponse";

export const useGroupStore = defineStore("groupStore", () => {
  const groupsData = ref<response>();
  const udsGroupsData = ref<response>();
  const shcGroupsData = ref<response>();
  const sortData = ref<string>("descending");
  const sortBy = ref<string>("group_name");
  const limit = ref<number>(12);
  const offset = ref<number>(0);
  const defaultParams:any = {
    limit: 10000,
    offset: 0,
    status: "active",
    sort: "descending",
    sort_by: "group_id",
  }
  const fetchDataFromAPI = async (values?: any) => {
    const filteredValues = filterEmptyValues(values);
    const response = await groupsService.getAllGroups({
      sort: sortData.value,
      limit: limit.value,
      offset: offset.value,
      sort_by: sortBy.value,
      format: "json",
      ...filteredValues,
    });
    // const responseLength = await groupsService.getAllGroups({
    //   sort_by: sortBy.value,
    //   format: "json",
    //   ...filteredValues,
    // });
    return {
      response: response,
      totalItems: response?.length,
      currentPage: limit?.value,
    };
  };
  const fetchUdsGroupData = async () => {
    defaultParams['type'] = 'uds'
    const response = await groupsService.getAllGroups(defaultParams);
    return response;
  };
  const fetchShcGroupData = async () => {
    defaultParams['type'] = 'shc'
    const response = await groupsService.getAllGroups(defaultParams);
    return response;
  };
  const setUdsGroupData = async () => {
    const data = await fetchUdsGroupData();
    udsGroupsData.value = data;
  }
  const setShcGroupData = async () => {
    const data = await fetchShcGroupData();
    shcGroupsData.value = data;
  }
  const setGroupsData = async (params?: any) => {
    const data = await getGroupsData(params);
    shcGroupsData.value = data.shc;
    udsGroupsData.value = data.uds;
  }
  const getGroupsData = async (params?: any) => {
    const { response } = await fetchDataFromAPI(params);
    return {
      'shc': response.filter((x:any) => x.group_type === 'shc'),
      'uds': response.filter((x:any) => x.group_type === 'uds'),
    }
  }
  const getGroupsToSelect = async (params?: any) => {
    const response = await groupsService.getAllGroupsToSelect(params)
    return response
  }
  const searchByNameGroups = async (nameShc: string) => {
    const dataSearch = await groupsService.getAllGroups({
      group_name: nameShc,
    });
    return dataSearch;
  };
  const dataGroups = async (values?: any) => {
    const data = await fetchDataFromAPI(values);
    assignData(data);
  };
  const assignData = (data: any) => {
    if (data.response) {
      groupsData.value = data;
    }
  };
  const setCurrentPage = (page: number) => {
    offset.value = page;
  }
  const putGroup = async (item: any) => {
    await groupsService.updateGroups(item.group_id, item);
  };
  return {
    putGroup,
    groupsData,
    sortData,
    sortBy,
    limit,
    offset,
    searchByNameGroups,
    dataGroups,
    setUdsGroupData,
    setGroupsData,
    setShcGroupData,
    udsGroupsData,
    shcGroupsData,
    getGroupsData,
    setCurrentPage,
    getGroupsToSelect
  };
});
