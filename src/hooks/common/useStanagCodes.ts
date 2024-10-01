import type { FilteredItem } from "@/modules/userAndGroup/interfaces/Iuser";
import stanag_codes from "@/modules/userAndGroup/users/config/stanag_codes";
import { useCountryStore } from "@/stores/countryStore";
import { computed, onMounted, ref } from "vue";
interface Option {
    label: string;
    value: string;
  }
export default function useStanagCodes() {
    const mappedDataStanag = ref<any>([])
    const mappedDataStanagCountrys = ref<any>([])
    const selectedStanagIds = ref<string[]>([]);
    const selectedStanagIdsTemp = ref<string[]>([]);
    const countryStore = useCountryStore();
    const stanagSearchTerm = ref<string>('');
    const filteredMappedDataStanag  = computed<FilteredItem[] >(() => {
        const dataStanagByFilter :Option [] = mappedDataStanag.value
        const uniqueValuesSet = dataStanagByFilter.filter((item, index, self) =>
            self.findIndex(other => compareObjects(item, other)) === index
          );
        uniqueValuesSet.push({value:'ENG',label:'ENG'})
        if (stanagSearchTerm.value === '') {
            return uniqueValuesSet;
        } else {
            const searchTerm = stanagSearchTerm.value.toLowerCase();
            return uniqueValuesSet.filter((item: FilteredItem) => item.label?.toLowerCase().includes(searchTerm));
        }
    }); 
    const applyFilters = () => {
        
        selectedStanagIds.value = [...selectedStanagIdsTemp.value];
    };
    function compareObjects(obj1:Option, obj2:Option) {
        return obj1.value === obj2.value && obj1.label === obj2.label;
      }
    const resetFilters = () => {
        selectedStanagIdsTemp.value = [];
        selectedStanagIds.value = [];
        stanagSearchTerm.value = '';
    } 
    const handleStanagIdCheckboxChange = (value:string | undefined) => {
        
        if(value === undefined){
            return
        }
        if (selectedStanagIdsTemp.value.includes(value)) {
            selectedStanagIdsTemp.value = selectedStanagIdsTemp.value.filter(item => item !== value);
        } else {
            selectedStanagIdsTemp.value.push(value);
        }
    };
    onMounted(async ()=>{

        await countryStore.getCountryData();

        mappedDataStanag.value = countryStore.countryData;
        mappedDataStanagCountrys.value = countryStore.countryData;
         
     })
    return{
        selectedStanagIds,
        selectedStanagIdsTemp,
        stanagSearchTerm,
        filteredMappedDataStanag,
        mappedDataStanag,
        applyFilters,
        resetFilters,
        handleStanagIdCheckboxChange,
        mappedDataStanagCountrys
    }
}