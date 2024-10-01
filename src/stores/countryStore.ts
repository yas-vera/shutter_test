
import countryService from '@/services/countryService';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';


export const useCountryStore = defineStore('countryStore', () => {

  const countryData = ref<any[]>([])

  const getCountryData = async () => {
    const response = await countryService.getCountryData()
    const formattedData = response.map(function(item:any) {
        return {
            label: item.country_code + ' - ' + item.country_name,
            value: item.country_code
        };
    });
    countryData.value = formattedData
  }

  return { 
    getCountryData,
    countryData,
  } 
});
 