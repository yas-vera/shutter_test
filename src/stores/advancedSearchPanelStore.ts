import { ref, computed,reactive } from 'vue'
import { defineStore } from 'pinia'

export const useAdvanceSearchPanelStore = defineStore('advanceSearchPanelStore', () => {
 const openClose = ref<boolean>(false)
 const stateSearchPanel = reactive<any>({
  searchPanels:[]
 })
 const isShowSearchPanel = (option:boolean) =>{
    openClose.value = option
}
const addSearchPanel = (panel:any) => {
  stateSearchPanel.searchPanels.push(panel);
}
const  removeSearchPanel = (panel:any) => {
  const index = stateSearchPanel.searchPanels.indexOf(panel);
  if (index !== -1) {
    stateSearchPanel.searchPanels.splice(index, 1);
  }
}
const  openSearchPanel = (id:string) => {
  const panel = stateSearchPanel.searchPanels.find((p:any) => p.id === id);
  if (panel) {
    panel.instance = true;
  }
}
const  closeSearchPanel = (id:string) => {
  const panel = stateSearchPanel.searchPanels.find((p:any) => p.id === id);
  if (panel) {
    panel.instance = false;
  }
}
const verifyOpenClose = (id:string) => {
  const panel = stateSearchPanel.searchPanels.find((p:any) => p.id === id && p.instance);
  if(panel) {
      return true
  }
  return false
}
const verifySearchPanel = (id:string) => {
  const panel = stateSearchPanel.searchPanels.find((p:any) => p.id === id);
  if(panel) {
      return true
  }
  return false

}
  return { 
    openClose,
    isShowSearchPanel,
    addSearchPanel,
    removeSearchPanel,
    openSearchPanel,
    verifyOpenClose,
    closeSearchPanel,
    verifySearchPanel
}
})
