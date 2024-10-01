import type { FilteredItem } from "@/modules/userAndGroup/interfaces/Iuser";
import { useUserStore } from "@/stores/userStore";
import { computed, onMounted, ref } from "vue";
export interface Option {
    label: string;
    value: string;
  }
export default function useMissionsGroups() {
    const selectedMissionGroupIds = ref<string[]>([]);
    const selectedMissionGroupIdsTemp = ref<string[]>([]);
    const missionGroupSearchTerm = ref<string>('');

    const userStore = useUserStore();

    const applyMissionGroupFilters = () => {
        selectedMissionGroupIds.value = [...selectedMissionGroupIdsTemp.value];
    };
    const resetMissionGroupFilters = () => {
        selectedMissionGroupIdsTemp.value = [];
        selectedMissionGroupIds.value = [];
    }
    const handleMissionGroupCheckboxChange = (value:string | undefined) => {
        if(value === undefined){
            return
        }
        if (selectedMissionGroupIdsTemp.value.includes(value)) {
            selectedMissionGroupIdsTemp.value = selectedMissionGroupIdsTemp.value.filter(item => item !== value);
        } else {
            selectedMissionGroupIdsTemp.value.push(value);
        }
    };
    const filteredMappedDataMissionGroup  = computed<any[] >(() => {
        if(userStore.missionsData) {
          const dataFilter:any = userStore.missionsData 
          const searchTerm = missionGroupSearchTerm.value.toLowerCase();
          return dataFilter.filter((item:any) => item.id?.toLowerCase().includes(searchTerm));
        }
      });
    onMounted(async ()=>{

     })
    return{
        selectedMissionGroupIdsTemp,
        selectedMissionGroupIds,
        missionGroupSearchTerm,
        handleMissionGroupCheckboxChange,
        filteredMappedDataMissionGroup,
        applyMissionGroupFilters,
        resetMissionGroupFilters,
    }
}