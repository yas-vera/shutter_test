import { defineStore } from 'pinia';
import { ref } from 'vue';
// @ts-ignore
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas';
import { useMapViewStore } from './mapViewStore';
import { getCurrentDateTimeFormatted } from '@/helpers/exportToXmlAndShp';

export const useExportStore = defineStore('exportStore', () => {
  const visibleRuleHistory = ref(false);
  const visibleRule = ref(false);
  const visibleRuleCompressed = ref(false);
  const visibleRuleHistoryCompressed = ref(false);
  const visibleGroups = ref(false);
  const visibleUsers = ref(false);
  const visibleOptionMap = ref(true);
  const hiddenClustersAndPoligon = ref(false)
  const mapStore = useMapViewStore()
  const mapImageUrl = ref<any>([]);
  const mapImageUrl2 = ref<any>([]);
  const currentThemeMap = ref<'light' | 'dark' | ''>('')
  const titleExport = ref<string>('')
  const clasificationExport = ref<string>('')

  const captureMapImage = async (id:string,padding:number,zoom:number) => {
    const element: any = document.getElementById('map');
    const canvas = await html2canvas(element, { scale: 2, logging: false });
      
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenContext = offscreenCanvas.getContext('2d', { willReadFrequently: true });

    if (offscreenContext) {
        offscreenContext.drawImage(canvas, 0, 0);
        const dataUrl = offscreenCanvas.toDataURL('image/png');
        if(padding === 30){
          mapImageUrl.value.push({
            id: id,
            url: dataUrl,
            zoom: zoom
          });
        }else{
          mapImageUrl2.value.push({
            id: id,
            url: dataUrl,
            zoom: zoom
          });
        }
        
    } else {
        const dataUrl = canvas.toDataURL('image/png');
        if(padding === 30){
          mapImageUrl.value.push({
            id: id,
            url: dataUrl
          });
        }else{
          mapImageUrl2.value.push({
            id: id,
            url: dataUrl
          });
        }
    }

};
  const handleThemeMap = () => {
    currentThemeMap.value = mapStore.mapTheme
    if(mapStore.mapTheme === 'dark'){
      mapStore.handleMapTheme(true)
    }
  }
  const handleThemeRevert = () => {
    if(currentThemeMap.value !== mapStore.mapTheme ){
      mapStore.handleMapTheme(false)
      currentThemeMap.value = ''
    }
  }
  const exportToPdfView = async (idElement:string,nameFile:string, pageOrientation = 'portrait') => {
    await new Promise(resolve => setTimeout(resolve, 0));
   
    var element = document.getElementById(idElement);    
    var opt :any = {
      margin: [0, 0, 0, 0],
      filename: nameFile,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas: { scale: 2},
      jsPDF: { unit: 'in', format: 'letter', orientation: pageOrientation },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy']}   
    };
    await html2pdf().set(opt).from(element).save();
  }
  const clearImg = () => {
    mapImageUrl.value = []
    mapImageUrl2.value = []
  }
  const exportRule = async () => { 
    hiddenClustersAndPoligon.value = true
    handleThemeMap()
    clearImg() 
    await mapStore.viewSelectedAoi('ruleFigure-',true)
    visibleRule.value = true;
    const fileName = `rules_extended_${getCurrentDateTimeFormatted()}.pdf`;
    await exportToPdfView('container_content_rule',fileName)
    visibleRule.value = false;
    handleThemeRevert()
    hiddenClustersAndPoligon.value = false
    mapStore.restoreZoom();
  }
  const exportRuleCompressed = async () => {
    visibleRuleCompressed.value = true;
    clearImg()
    const fileName = `rules_compressed_${getCurrentDateTimeFormatted()}.pdf`;
    await exportToPdfView('container_content_rule_compressed',fileName, 'landscape')
    visibleRuleCompressed.value = false;
  }
  const exportRuleHistory = async () => {
    handleThemeMap()
    clearImg()
    visibleOptionMap.value = false;
    await mapStore.viewSelectedAoi()
    visibleRuleHistory.value = true;
    const fileName = `rules_history_${getCurrentDateTimeFormatted()}.pdf`;
    await exportToPdfView('container_content',fileName)
    visibleRuleHistory.value = false;
    handleThemeRevert()
    visibleOptionMap.value = true;
  };
  const exportRuleHistoryCompressed = async () => {
    visibleRuleHistoryCompressed.value = true;
    clearImg()
    const fileName = `rules_history_compressed_${getCurrentDateTimeFormatted()}.pdf`;
    await exportToPdfView('container_content_rule_compressed',fileName, 'landscape')
    visibleRuleHistoryCompressed.value = false;
  }
  const exportGroups = async (option = 'uds') => {
    visibleGroups.value = true;
    clearImg()
    const fileName = `groups_${option}_${getCurrentDateTimeFormatted()}.pdf`;
    await exportToPdfView(`container_content_group_${option}`,fileName)
    visibleGroups.value = false;
  };
  const exportUsers = async () => {
    visibleUsers.value = true;
    const fileName = `users_${getCurrentDateTimeFormatted()}.pdf`;
    await exportToPdfView(`container_content_users`,fileName,'landscape')
    visibleUsers.value = false;
  };


  return { 
    exportRuleHistory,
    exportRuleHistoryCompressed,
    visibleRuleHistoryCompressed,
    visibleRuleHistory,
    captureMapImage,
    mapImageUrl,
    mapImageUrl2,
    visibleOptionMap,
    visibleRule,
    exportRule,
    hiddenClustersAndPoligon,
    exportToPdfView,
    exportRuleCompressed,
    visibleRuleCompressed,
    visibleGroups,
    exportGroups,
    titleExport,
    clasificationExport,
    visibleUsers,
    exportUsers
  }
  
});
 