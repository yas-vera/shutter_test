
import missionService from '@/services/missionService';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { FilterOption, ServerOptions } from 'vue3-easy-data-table';
import { useRulesStore } from './rulesStore';
import { useUserStore } from './userStore';


export const useMissionStore = defineStore('missionStore', () => {

  const conflictData = ref<any[]>([])
  const offsetValueDetailRules = ref(0)
  const rulesDataDetailCount = ref(0)
  
  const offsetValueDetailUsers = ref(0)
  const userDataDetailCount = ref(0)

  const pagPropertyDetailRules = ref({
    nextPage:false,
    lastPage:false
  })

  const pagPropertyDetaiUsers = ref({
    nextPage:false,
    lastPage:false
  })

  const serverOptionsDetailRules = ref<ServerOptions>({
    page: 1,
    rowsPerPage: 10,
    sortBy: 'id',
    sortType: 'desc',
  });

  const serverOptionsDetailUsers = ref<ServerOptions>({
    page: 1,
    rowsPerPage: 10,
    sortBy: 'id',
    sortType: 'desc',
  });

  const rulesDataDetailRulesCount = ref<number>(0)
  const serverItemsDetailRulesLength = ref(0);
  const userStore = useUserStore();
  const rulesStore = useRulesStore()
  const getConflict = async (values?:any) => {
    let response = await missionService.getConflictByRuleOrUser(values)
    response = response.map((item:any, index:any) => ({
      ...item,
      idx: index 
    }));
    conflictData.value = response
    userStore.userDataDetail = response
    userDataDetailCount.value = response.length
  }
  const getConflictRules = async (values?:any) => {
    let response = await missionService.getConflictByRuleOrUser(values)
    response = response.map((item:any, index:any) => ({
      ...item,
      idx: index 
    }));
    conflictData.value = response
    rulesStore.rulesDataDetail = response
    userDataDetailCount.value = response.length
  }

  const loadFromServerDetailRules = async(offsetValueProp?:number) => {
      if(offsetValueProp){
        offsetValueDetailRules.value = offsetValueDetailRules.value + offsetValueProp
        if(offsetValueDetailRules.value === 0){
          pagPropertyDetailRules.value.lastPage = true
        }else{
          pagPropertyDetailRules.value.lastPage = false
        }
      }
      await missionService.getConflictByRuleOrUser({
        limit: serverOptionsDetailRules.value.rowsPerPage,
        offset: offsetValueDetailRules.value,
        sort_by: serverOptionsDetailRules.value.sortBy,
        sort: serverOptionsDetailRules.value.sortType === "asc" ? "ascending" : "descending",
      });
      pagPropertyDetailRules.value.nextPage = rulesDataDetailRulesCount.value < 10
      serverItemsDetailRulesLength.value = rulesDataDetailCount.value;
  }

  const resetOffsetValueDetailRules = () => {
    offsetValueDetailRules.value = 0
  }

  const resetOffsetValueDetailUsers = () => {
    offsetValueDetailUsers.value = 0
  }

  //watch(serverOptionsDetailRules, (value) => { loadFromServerDetailRules(); }, { deep: true });

  // filter



  return { 
    conflictData,
    getConflict,
    pagPropertyDetailRules,
    loadFromServerDetailRules,
    serverItemsDetailRulesLength,
    rulesDataDetailRulesCount,
    serverOptionsDetailRules,
    resetOffsetValueDetailRules,
    offsetValueDetailRules,

    pagPropertyDetaiUsers,
    serverOptionsDetailUsers,
    userDataDetailCount,
    offsetValueDetailUsers,
    resetOffsetValueDetailUsers,
    getConflictRules
  } 
});
 