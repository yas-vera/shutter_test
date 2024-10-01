import layersService from '@/services/layersService';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePopupAlertStore } from './popupAlertStore';
import { useMapViewStore } from './mapViewStore';
import { useAdvanceSearchPanelStore } from './advancedSearchPanelStore';

interface Geometry {
  area_wkt: string;
  center?: {
    latitude: number;
    longitude: number;
  };
  geometry_type: string;
  radius_km?: number;
}

export interface CustomLayer {
  geometry: Geometry;
  label: string;
}
 
export const useLayerStore = defineStore('layerStore', () => {
  const popupAlertStore = usePopupAlertStore()
  const mapStore = useMapViewStore()
  const advanceSearchPanelStore = useAdvanceSearchPanelStore()
  const layerData = ref<any[]>([])
  const layerDataSelect = ref<any[]>([])
  const layerSelectedDefault = ref<any>()
  const isShowMenuAddLayer = ref<boolean>(false)
  const isShowDefaultValueLayer = ref<boolean>(false)
  const listLayersActived = ref<any[]>([
    {
      id:'CustomLayerCapitalCities',
      active:false
    },
    {
      id:'CustomLayerCities',
      active:false
    },
    {
      id:'CustomLayerAiports',
      active:false
    },
    {
      id:'CustomLayerPorts',
      active:false
    },
    {
      id:'CustomLayerOilPlatforms',
      active:false
    },
    {
      id:'CustomLayerNuclearPowerPlants',
      active:false
    },
    {
      id:'CustomLayerMiningSites',
      active:false
    },

  ]);
  const handleListLayers = (valueId: string) => {
    const index = listLayersActived.value.findIndex(layer => layer.id === valueId);
    if (index !== -1) {
      listLayersActived.value[index].active = !listLayersActived.value[index].active;
    }
  };
  const isLayerActive = (valueId: string): boolean => {
    const layer = listLayersActived.value.find(layer => layer.id === valueId);
    return layer ? layer.active : false;
  };
  const customsLater = ref<any>({
    label: '',
    geometry: {
        area_wkt: "",
        geometry_type: mapStore.selectDrawOption
    },
})
  const showMenuAddLayer = () => {
    mapStore.selectDrawOption = 'None'
    isShowMenuAddLayer.value = !isShowMenuAddLayer.value
    customsLater.value = {
        label: '',
        geometry: {
            area_wkt: "",
            geometry_type: mapStore.selectDrawOption
        },
    }
    if(!isShowDefaultValueLayer.value){
      layerSelectedDefault.value = undefined
    }
  }
  const getLayer = async (activeIdItem = 0) => {
    const response = await layersService.getLayers()
    if(response.length > 0){
      response.filter((item:any) => item.id === activeIdItem).map((item:any) => item.checked = true)
      response.filter((item:any) => item.id !== activeIdItem).map((item:any) => item.checked = false)
    }
    layerData.value = response
    const selectResult = selectData(response);
    layerDataSelect.value = selectResult.formattedData
    layerSelectedDefault.value =selectResult.lastValue
  }

  const selectData = (data:any)  => {
    const formattedData = data.map(function(item:any) {
        return {
            label: item.label,
            value: item.geometry.area_wkt,
            id:item.id
        };
    });
    let lastValue = ''
    if(isShowDefaultValueLayer.value){
      lastValue = formattedData[formattedData.length - 1].value;
    }
    

    return {
        formattedData: formattedData,
        lastValue: lastValue
    };
}

  const postLayer = async (data:CustomLayer) => {
    try {
      const result = await layersService.postLayer(data)
      await getLayer(result.id)
      popupAlertStore.showPopupAlert('Success', 'Saved successfully')
      if(isShowDefaultValueLayer.value){
        advanceSearchPanelStore.openSearchPanel('searchAdvancedRules')
        isShowDefaultValueLayer.value = false
      }
      return result
    } catch (error:any) {
      let {error: err} = error
      popupAlertStore.showPopupAlert(err.status, err.message)
    }  
  }

  const removeLayer = async (data:any) => {  
    await popupAlertStore.showPopupAlert(`Delete ${data.label}`, 'Are you sure you want to delete the custom layer?', 'Confirm',true).then(async () => {
        try {
           await layersService.deleteLayer(data.id);
           popupAlertStore.showPopupAlert('Success', 'Removed successfully')
           await getLayer()
         } catch (error:any) {
          let {error: err} = error
          popupAlertStore.showPopupAlert(err.status, err.message)
         } 
    });
}

  return { 
    getLayer,
    postLayer,
    removeLayer,
    layerData,
    layerDataSelect,
    customsLater,
    showMenuAddLayer,
    isShowMenuAddLayer,
    isShowDefaultValueLayer,
    layerSelectedDefault,
    handleListLayers,
    listLayersActived,
    isLayerActive
  }
  
});
 