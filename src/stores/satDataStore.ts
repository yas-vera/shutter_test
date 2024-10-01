import satDataService from '@/services/satDataService';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';


export const useSatDataStore = defineStore('satDataStore', () => {

  const missionData = ref<any[]>([])
  const satelliteData = ref<any[]>([])
  const acquisitionModeData = ref<any[]>([])
  const sensorTypeData = ref<any[]>([])

  const getSatData = async (option:string) => {
    const response = await satDataService.getSatData(option)
    
    if(option === 'mission'){
        missionData.value = response
    }
    if(option === 'satellite'){
        satelliteData.value = response
    }
    if(option === 'acquisition_mode'){
        acquisitionModeData.value = response
    }
    if(option === 'sensor_type'){
        sensorTypeData.value = response
    }
    return response
  }

  return { 
    missionData,
    satelliteData,
    acquisitionModeData,
    sensorTypeData,
    getSatData
  } 
});
 