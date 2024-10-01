import { filterEmptyValues } from "@/helpers/filterSearchHelper";
import type { response } from "@/interfaces/IResponse";
import shcGroupsService from "@/services/shcGroupsService";
import udsGroupsService from "@/services/udsGroupsService";
import { defineStore } from "pinia";
import { ref } from "vue";
import { usePopupAlertStore } from "./popupAlertStore";
import groupsService from "@/services/groupsService";
import { useUserStore } from "./userStore";
import { exportToXmlAndShp } from "@/helpers/exportToXmlAndShp";
import { convertFormatDate } from "@/helpers/convertDateTime";
import { exportToPdf } from "@/helpers/exportToPdf";
import { getValuesAndIds } from "@/helpers/tableHelpers";
import type { Item } from "vue3-easy-data-table";
import { useExportStore } from "./exportStore";
import { useLoadStore } from "./loadStore";
export const useShcGroupsStore = defineStore('shcGroupsStore', () => {
    const popupAlertStore = usePopupAlertStore()
    const shcGroupsData = ref<response>()
    const shcSelectGroupsData = ref<response>()
    const shcGroupsResponseAddUser = ref<any[]>([])
    const usersAddeditemsSelected = ref<Item[]>([]);
    const countUserFaildAddShcGroups = ref<number>(0)
    const countUserAddShcGroups = ref<number>(0)
    const showAddUser = ref<boolean>(false)
    const showResponseAddUser = ref<boolean>(false)
    const shcGroupsDataForAddUsers = ref<response>()
    const limit = ref <number>(12)
    const offset = ref<number>(0)
    const shcGroupsDataSelected = ref<any>()
    const shcGroupsRules = ref<any[]>([])
    const stanag_id_list = ref<any[]>([])
    const sortData = ref<string>('descending')
    const sortBy = ref<string>('group_name')
    const searchValueSHC = ref<string>('')
    const exportStore = useExportStore()
    const loadStore = useLoadStore()
    const restoreStates = () => {
        shcGroupsData.value = undefined
        shcGroupsResponseAddUser.value = []
        usersAddeditemsSelected.value = []
        countUserFaildAddShcGroups.value = 0
        countUserAddShcGroups.value = 0
        showAddUser.value = false
        showResponseAddUser.value = false
        shcGroupsDataForAddUsers.value = undefined
        limit.value = 12
        offset.value = 0
        shcGroupsDataSelected.value = undefined
        shcGroupsRules.value = []
        stanag_id_list.value = []
        sortData.value = 'descending'
        sortBy.value = 'group_name' 
    }
    const resetPagination = () => {
        limit.value = 12
        offset.value = 0
    }
    const handleShowAddUser = () => {
        showAddUser.value = !showAddUser.value
        showResponseAddUser.value = false
        shcGroupsResponseAddUser.value = []
        countUserFaildAddShcGroups.value = 0
    }
    const closeAddUser = () => {
        showAddUser.value = false
        showResponseAddUser.value = false
        shcGroupsResponseAddUser.value = []
        countUserFaildAddShcGroups.value = 0
    }
    const fetchDataFromAPI = async (values?: any) => {
        const filteredValues = filterEmptyValues(values);
        const response = await groupsService.getAllGroups({
            sort: sortData.value,
            limit: limit.value,
            offset: offset.value,
            type: 'shc',
            sort_by: sortBy.value,
            format: 'json',
            ...filteredValues
        });
        // const responseLength = await groupsService.getAllGroups({
        //     type: 'shc',
        //     sort_by: sortBy.value,
        //     format: 'json',
        //     ...filteredValues
        // });
        return {
            response: response,
            totalItems: response.length,
            currentPage: limit.value
        };
    }
    const assignData = (data: any) => {
        if (data.response) {
            shcGroupsData.value = data;
        }
    }
    const assignSelectData = (data: any) => {
        if (data.response) {
            shcSelectGroupsData.value = data;
        }
    }
    const searchByNameShcGroups = async (nameShc: string) => {
        const dataSearch = await groupsService.getAllGroups({
            type: 'shc',
            group_name: nameShc,
           
        });
        return dataSearch;
    }
    const assignDataForAddUsers = (data: any) => {

        if (data.response) {
            shcGroupsDataForAddUsers.value = data;
        }
    }
    const dataShcGroups = async (values?: any) => {
        const data = await fetchDataFromAPI(values);
        assignData(data);
    }
    const dataShcGroupsForAddUser = async (values?: any) => {
        const data = await fetchDataFromAPI(values);
        assignDataForAddUsers(data);
    }
    const submitActionAddUser = async (selectedGroups:any) =>{ 
        try {
            const userStore = useUserStore()
            const users = userStore.itemsSelected;
            const valueQuery = selectedGroups
            let newUsers: Item[] = []
            countUserAddShcGroups.value = userStore.itemsSelected.length
            for (let index = 0; index < valueQuery.length; index++) {
                const id = valueQuery[index].group_id
                newUsers = users.filter((user: any) => {
                    return !valueQuery[index].users_shc.some((existingUser: any) => existingUser.user_id === user.user_id);
                });

                if(newUsers.length == 0){
                    countUserFaildAddShcGroups.value++
                }else if(newUsers.length != countUserAddShcGroups.value){
                    countUserFaildAddShcGroups.value = countUserAddShcGroups.value - newUsers.length
                }

                valueQuery[index].users = [...valueQuery[index].users, ...newUsers];
                const response = await groupsService.updateGroups(id,valueQuery[index])

                if(response !== null || response !== undefined){
                    shcGroupsResponseAddUser.value.push(response)
                }else{
                    countUserFaildAddShcGroups.value++
                }
            }
            showResponseAddUser.value = true
            await userStore.dataUser()
            usersAddeditemsSelected.value =  newUsers
            userStore.itemsSelected = []
        } catch (error) {
            countUserFaildAddShcGroups.value++
        }
        
      }
    const handleShcGroupsSelected = (item:any) => {
        shcGroupsDataSelected.value = item
        if(item){
            shcGroupsRules.value = item.group_rules
        }
    }
    const changeSortData = async (valueSort:string, sortByValue: string) => {
        sortData.value = valueSort
        sortBy.value = sortByValue
        await dataShcGroups()
    }
    const removeData = async (idItem:any) => {
   
            popupAlertStore.showPopupAlert(`Delete ${idItem.group_name}`, 'Are you sure you want to delete the selected group?', 'Confirm',true).then(async () => {
                try {
                   await groupsService.deleteGroups(idItem.group_id);
                   popupAlertStore.showPopupAlert('Success', 'Removed successfully')
                   await dataShcGroups();
                 } catch (error:any) {
                   popupAlertStore.showPopupAlert(error.response.statusText, error.response.data.detail)
                 }
                
               
            });
       
    }
    const addShcGroup = async (data:any) =>{
        try {
            const userStore = useUserStore()
            const dataQuery = data
            const users = userStore.itemsSelectedForm.map((user: any) => ({
                user_id: user.user_id
            }));
            if(users.length>0){
                dataQuery.users = users
            }
           const response = await shcGroupsService.postShcGroups(dataQuery);
           popupAlertStore.showPopupAlert('Success', 'Added successfully')
           userStore.itemsSelectedForm = []
           await dataShcGroups();
           return response
         } catch (error:any) {
            let {error: err} = error
            popupAlertStore.showPopupAlert('Error  ' + err.status, err.message)
            return error
         }
    }
    const updateShcGroup = async (data:any) =>{
        try {
           const userStore = useUserStore()
           const dataQuery = data
           const users = userStore.itemsSelectedForm.map((user: any) => ({
               user_id: user.user_id
           }));
           if(users.length>0){
               dataQuery.users = users
           }
           const response = await shcGroupsService.putShcGroups(dataQuery);
           userStore.itemsSelectedForm = []
           popupAlertStore.showPopupAlert('Success', 'Modified successfully')
           await dataShcGroups();
           return response
         } catch (error:any) {
            let {error: err} = error
            popupAlertStore.showPopupAlert('Error  ' + err.status, err.message)
            return error
         }
    }
    const handleExportShcGroups = async (data:string[],titleDoc:string,clasification:string, option = 'shc') => {
        exportStore.titleExport = titleDoc
        exportStore.clasificationExport = clasification
       
        for (const item of data) {
          const valueSend = {
            export_format: item,
            type:'shc',
            sort: sortData.value,
            limit: limit.value,
            offset: offset.value,
            sort_by: sortBy.value,
            q:searchValueSHC.value
          }
          try {
            if(item == 'xml'){
                loadStore.setLoading(true);
                const response = await groupsService.getExport(valueSend);
                exportToXmlAndShp(response,item, 'shcGroups')
                loadStore.setLoading(false);
            }else{
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
        exportStore.titleExport = ''
        exportStore.clasificationExport = ''
        
      }
        
    }

    return{
        dataShcGroups,
        shcGroupsData,
        handleShcGroupsSelected,
        changeSortData,
        shcGroupsDataSelected,
        shcGroupsRules,
        offset,
        limit,
        removeData,
        addShcGroup,
        stanag_id_list,
        dataShcGroupsForAddUser,
        shcGroupsDataForAddUsers,
        showAddUser,
        handleShowAddUser,
        submitActionAddUser,
        showResponseAddUser,
        shcGroupsResponseAddUser,
        countUserFaildAddShcGroups,
        countUserAddShcGroups,
        handleExportShcGroups,
        searchByNameShcGroups,
        updateShcGroup,
        closeAddUser,
        usersAddeditemsSelected,
        restoreStates,
        resetPagination,
        assignData,
        assignSelectData,
        shcSelectGroupsData,
        searchValueSHC
    }
})