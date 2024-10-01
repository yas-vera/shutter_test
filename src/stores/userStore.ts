import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { TAB_RULES } from '@/constants/constants'
import { usePopupAlertStore } from './popupAlertStore'
import userService from '@/services/userService'
import type { Item } from 'vue3-easy-data-table'
import { filterEmptyValues } from '@/helpers/filterSearchHelper'
import { dataUserDetailFake } from '@/dataFake/data'
import { exportToXmlAndShp } from '@/helpers/exportToXmlAndShp'
import { convertFormatDate } from '@/helpers/convertDateTime'
import { exportToPdf } from '@/helpers/exportToPdf'
import { getValuesAndIds } from '@/helpers/tableHelpers'
import aoiService from '@/services/aoiService'
import systemService from '@/services/systemService'
import { useMissionStore } from './missionStore'
import { useExportStore } from './exportStore'
import { useLoadStore } from './loadStore'
import satDataService from '@/services/satDataService'
import type { IUserFilter } from '../interfaces/IUser';

export const useUserStore = defineStore('userStore', () => {
  const popupAlertStore = usePopupAlertStore()
  const userDetailsSeletect = ref<any[]>([])
  const userData = ref<any[]>([])
  const userSelectData = ref<any[]>([])
  const userDataCount = ref<number>(0)
  const userId = ref<string>('')
  const userDataDetail = ref<any[]>([])
  const selectedFilters = ref<IUserFilter>({} as IUserFilter)
  const itemsSelected = ref<Item[]>([]);
  const itemsSelectedForm = ref<Item[]>([]);
  const aoiSelected = ref<any>([]);
  const missionsData = ref<any[]>();
  const itemsSelectedUserForm = ref<Item[]>([]);
  const itemsSelectedFormRules = ref<Item[]>([]);
  const exportStore = useExportStore()
  const loadStore = useLoadStore()
  const selectedAoisViewIds = ref<string[]>([])
  const selectedRowForPageDefault = ref(10)
  const userDataDetailSelected = computed(() => {
    const activeItemCount = itemsIdUserDetails.value.filter(item => item.activeItem).length;
    if (activeItemCount === 0) {
      return true;
    }
    if (activeItemCount === itemsIdUserDetails.value.length) {
      return false;
    }
    return activeItemCount === 1;
  });
  const itemsIdUserDetails = ref<Item[]>([]);
  const searchValue = ref<string>('')
  const missionStore = useMissionStore()
  const restoreStates = () => {
    userDetailsSeletect.value = []
    userData.value = []
    userDataDetail.value = []
    itemsSelected.value = []
    itemsSelectedForm.value = []
    itemsSelectedUserForm.value = []
    itemsSelectedFormRules.value = []
    itemsIdUserDetails.value = []
    searchValue.value = ''
  }

  const resetFilters = () => {
    selectedFilters.value = {
    } as IUserFilter;
  }

  const dataUser = async (values?: any) => {
    let filteredValues = filterEmptyValues(values);
    filteredValues = { ...filteredValues,
      q:searchValue.value,
      status: filteredValues?.status || ( searchValue.value !==''?'':'active'),
      sort_by: filteredValues?.sort_by || 'creation_date_start',
      sort: filteredValues?.sort || 'descending',
      limit: values?.limit || '10',
      offset: values?.offset || '0'
    };
    filteredValues = filterEmptyValues(filteredValues);
    const response = await userService.getUser(filteredValues)
    if (response) {

      response.forEach((item: any) => {
        item.isExpanded = false;
      });
      
      //! fix selected items
      hableSelectedItems(response);

      userData.value = response
      userDataCount.value = response.length
    }
    //const exampleResponseOperator = await userService.getExampleOperator()
  }
  const hableSelectedItems = (response:any) => {
    if (itemsSelected.value.length > 0) {
      itemsSelected.value.forEach(selectedItem => {
        const matchingResponseItem = response.find((respItem:any) => respItem.user_id === selectedItem.user_id);
    
        if (matchingResponseItem) {
          Object.keys(matchingResponseItem).forEach(key => {
            selectedItem[key] = matchingResponseItem[key];
          });
        }
      });
    }

    if (itemsSelectedFormRules.value.length > 0) {
      itemsSelectedFormRules.value.forEach(selectedItem => {
        const matchingResponseItem = response.find((respItem:any) => respItem.user_id === selectedItem.user_id);
    
        if (matchingResponseItem) {
          Object.keys(matchingResponseItem).forEach(key => {
            selectedItem[key] = matchingResponseItem[key];
          });
        }
      });
    }
  }
  const dataSelectUser = async () => {
    const response  =  await userService.getSelectUser()
    userSelectData.value = response
  }
  const syncUser = async () => {
    const lastSyncDate = await systemService.getUdsSync()
    let messageTime = ''
    const detailError = lastSyncDate?.data?.detail
    if (detailError) {
      messageTime = detailError
    } else if (lastSyncDate.last_uds_sync) {
      messageTime = `Last Sync ${convertFormatDate(lastSyncDate.last_uds_sync)}`
    }
    popupAlertStore.showPopupAlert('Sync UDS users', `${messageTime}. Do you want to launch the UDS users sync?`, 'Confirm').then(async() => {
      const response = await systemService.postUdsSync()
      if(!response) {
        popupAlertStore.showPopupAlert('Error', 'There was an error during the synchronization process');
        return
      }
      popupAlertStore.showPopupAlert('Success', 'Users synchronized successfully')
    });
  }
  const handleSubmit = (values: any) => {
    dataUser(values)
  }
  const handleUserDetails = async () => {
    itemsIdUserDetails.value = []
    userDataDetail.value = []
    let result = [...itemsSelected.value]

    
    const userIds = result.map(item => item.user_id.toString());
    const userIdObject = { user_id: userIds };
    await missionStore.getConflict({
        ...userIdObject,
        limit: 10,
        offset: 0,
        sort_by: "id",
        sort: "descending",
      })

    userDataDetail.value = missionStore.conflictData
    missionStore.serverItemsDetailRulesLength = missionStore.rulesDataDetailRulesCount;
    missionStore.pagPropertyDetailRules.lastPage = true
    missionStore.pagPropertyDetailRules.nextPage = missionStore.rulesDataDetailRulesCount < 10
    itemsIdUserDetails.value = JSON.parse(JSON.stringify(itemsSelected.value))

    // itemsIdUserDetails.value = JSON.parse(JSON.stringify(itemsSelected.value));
    // itemsIdUserDetails.value.sort((a, b) => a.user_id - b.user_id);
    // if (itemsIdUserDetails.value.length > 0) {
    //   itemsIdUserDetails.value.forEach((item, index) => {
    //     item.activeItem = index === 0;
    //     if (index === 0) {
    //       userId.value = item.user_id
    //       findByIdUserDetail(item.user_id, {
    //         limit: 10,
    //         offset: 0,
    //         sort_by: "aoi_id",
    //         sort: "descending",
    //       }) 
    //     }
    //   });
    // }
  };
  const findFakeDataUserDetail = (id: string) => {
    const response = dataUserDetailFake.value.find((x: any) => x.user_id === id)
    if (response) {
      userDataDetail.value = response.children
    } else {
      userDataDetail.value = []
    }

  }
  const findByIdUserDetail = async (id: string, extraParams: any = {}) => {
    const response = await aoiService.getAsync({ user_id: id, ...extraParams })
    if (response) {
      userDataDetail.value = response
    } else {
      userDataDetail.value = []
    }
  }
  const fetchMissions = async () => {
    const response = await satDataService.getSatData('mission')
    if (response) {
      missionsData.value = response
    }
  }
  const activeAllUserDetail = async () => {
    userDataDetail.value = []
    for (let index = 0; index < itemsIdUserDetails.value.length; index++) {
      const item = itemsIdUserDetails.value[index];
      item.activeItem = true;
      const response = await aoiService.getAsync({ user_id: item.user_id })
      if (response) {
        userDataDetail.value.push(...response)
      }
    }
  }
  const desactiveAllUserDetail = () => {
    userDataDetail.value = []
    itemsIdUserDetails.value.forEach(item => {
      item.activeItem = false;
    });

  }
  const activeUserDetailId = async(id: string, extraParams: any) => {
    if(id.length == 0){
        let result = [...itemsSelected.value]
        const userIds = result.map(item => item.user_id.toString());
        const userIdObject = { user_id: userIds };
        await missionStore.getConflict({
          ...extraParams,
          ...userIdObject,
          limit: 10,
          offset: 0,
          sort_by: "id",
          sort: "descending",
        })
      }else{
        await missionStore.getConflict({
          ...extraParams,
          user_id: id,
          limit: 10,
          offset: 0,
          sort_by: "id",
          sort: "descending",
        })
      }
      userDataDetail.value = missionStore.conflictData
      missionStore.serverItemsDetailRulesLength = missionStore.rulesDataDetailRulesCount;
      missionStore.pagPropertyDetailRules.lastPage = true
      missionStore.pagPropertyDetailRules.nextPage = missionStore.rulesDataDetailRulesCount < 10
      // userId.value = id
      // const userDetailToActivate = itemsIdUserDetails.value.find(item => item.user_id === id);

      // if (userDetailToActivate) {
      //   itemsIdUserDetails.value.forEach(item => {
      //     item.activeItem = item.user_id === id;
      //   });
      //   findByIdUserDetail(id, extraParams)
      // }
  };
  const handleExportUsers = async (data: string[], titleDoc: string, clasification: string) => {
    exportStore.titleExport = titleDoc
    exportStore.clasificationExport = clasification
    
    for (const item of data) {
      const valueSend = {
        export_format: item
      }
      try {
        if (item == 'xml') {
          loadStore.setLoading(true);
          const userIds = itemsSelected.value.map(item => item.user_id);
          const response = await userService.getExport({...valueSend, user_id:userIds});
          exportToXmlAndShp(response, item, 'users')
          loadStore.setLoading(false);
        } else {
          loadStore.setLoading(true);
          loadStore.showProgressBar = true
          loadStore.progress = 100
          await exportStore.exportUsers()
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
  const verifySeletedUsers = () => {
    const valueSeleted = itemsIdUserDetails.value.filter(item => item.activeItem);
    if (valueSeleted.length > 1 || itemsIdUserDetails.value.length === 1) {
      return true
    }
    return false
  }

  const expandDetailUser = ref<boolean>(false);

  const risizeUserDetail = () => {
    expandDetailUser.value = !expandDetailUser.value;
  }

  const defaultUserDetail = () => {
    expandDetailUser.value = false;
  }

  return {
    syncUser,
    dataUser,
    userData,
    userDataCount,
    itemsSelected,
    handleSubmit,
    searchValue,
    handleUserDetails,
    itemsIdUserDetails,
    activeUserDetailId,
    userDataDetail,
    itemsSelectedForm,
    itemsSelectedFormRules,
    selectedAoisViewIds,
    userDetailsSeletect,
    aoiSelected,
    handleExportUsers,
    activeAllUserDetail,
    desactiveAllUserDetail,
    userDataDetailSelected,
    verifySeletedUsers,
    itemsSelectedUserForm,
    restoreStates,
    fetchMissions,
    missionsData,
    findByIdUserDetail,
    userId,
    expandDetailUser,
    risizeUserDetail,
    defaultUserDetail,
    selectedFilters,
    resetFilters,
    selectedRowForPageDefault,
    dataSelectUser,
    userSelectData
  }
})
