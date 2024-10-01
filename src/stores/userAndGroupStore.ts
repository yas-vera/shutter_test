import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TAB_FORM_ADD_SHC_GROUP, TAB_RULES, TAB_SHC_GROUPS, TAB_UDS_GROUPS, TAB_UDS_GROUPS_DETAILS_SHC, TAB_UDS_GROUPS_DETAILS_UDS, TAB_UDS_GROUPS_DETAILS_USERS, TAB_USER } from '@/constants/constants'
import { useUserStore } from './userStore'
import { useUdsGroupsStore } from './udsGroupsStore'
import { useShcGroupsStore } from './shcGroupsStore'
import router from '@/router'
import { useModalSelectedStore } from './modalSelectedStore'

export const useUserAndGroupStore = defineStore('userAndGroupStore', () => {
 const modalSelected = useModalSelectedStore()
 const menuSelected = ref<string>(TAB_USER)
 const showModalExportUserAndGroups = ref<boolean>(false)
 const menuChange = (option:string) =>{
    //router.push('usergroups')
    if (option === TAB_USER || option === TAB_UDS_GROUPS_DETAILS_USERS) router.replace('/operator/usergroups/users')
    if (option === TAB_UDS_GROUPS || option === TAB_UDS_GROUPS_DETAILS_UDS) router.replace('/operator/usergroups/uds')
    if (option === TAB_SHC_GROUPS || option === TAB_UDS_GROUPS_DETAILS_SHC) router.replace('/operator/usergroups/shc')
    //router.replace('/operator/usergroups/users')
    menuSelected.value = option
    
    modalSelected.addOption(option)
  }
const verifyMenu = (value:string) =>{
  return menuSelected.value === value
}
const showTableDetails = () =>{
  const isUDSGroupsDetailsUsers = verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS);
  const isUDSGroupsDetailsUDS = verifyMenu(TAB_UDS_GROUPS_DETAILS_UDS);
  const isUDSGroupsDetailsSHC = verifyMenu(TAB_UDS_GROUPS_DETAILS_SHC);
  
return (!isUDSGroupsDetailsUsers && !isUDSGroupsDetailsUDS && !isUDSGroupsDetailsSHC);
}
const showFormAddShcGroup = ()=> {
  const isAddShcGroup = verifyMenu(TAB_FORM_ADD_SHC_GROUP);
  return (showTableDetails() && !isAddShcGroup)
}
const handleBackButtonClick = () => {
  const isUDSGroupsDetailsUsers = verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS);
  const isUDSGroupsDetailsSHC = verifyMenu(TAB_UDS_GROUPS_DETAILS_SHC);
  if (isUDSGroupsDetailsUsers) {
     menuChange(TAB_USER);
  } else if (isUDSGroupsDetailsSHC) {
     menuChange(TAB_SHC_GROUPS);
  } else {
     menuChange(TAB_UDS_GROUPS);
  }
};
const labelUserAndGroup = ()=>{
  const isUser = verifyMenu(TAB_USER);
  const isUdsGroup = verifyMenu(TAB_UDS_GROUPS);
  const isShcGroup = verifyMenu(TAB_SHC_GROUPS);
  if (isUser) {
    return "Users";
  } else if (isUdsGroup) {
    return "UDS Groups";
  } else if (isShcGroup){
    return "SHC Groups";
  }

}
const getBreadcrumbItemContent = () => {
  const userStore = useUserStore()
  const udsGroupsStore = useUdsGroupsStore()
  const shcGroupsStore = useShcGroupsStore()
  const menuConditions = [
    {
      condition: verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS),
      content: userStore.itemsSelected.length > 1 ? "Multiple users" : `User ${userStore.itemsSelected[0]?.user_id}`,
    },
    {
      condition: verifyMenu(TAB_UDS_GROUPS_DETAILS_UDS), 
      content: udsGroupsStore.udsGroupsDataSelected?.group_name,
    },
    {
      condition: verifyMenu(TAB_UDS_GROUPS_DETAILS_SHC),
      content: shcGroupsStore.shcGroupsDataSelected?.group_name,
    },
  ];

  const matchedCondition = menuConditions.find((condition) => condition.condition);

  return matchedCondition ? matchedCondition.content : "";
};
const handleShowModalExportUserAndGroup = () => {
  showModalExportUserAndGroups.value = !showModalExportUserAndGroups.value;
}
  return { 
    menuSelected,
    menuChange,
    verifyMenu,
    showTableDetails,
    handleBackButtonClick,
    getBreadcrumbItemContent,
    showFormAddShcGroup,
    labelUserAndGroup,
    handleShowModalExportUserAndGroup,
    showModalExportUserAndGroups
    
}
})
