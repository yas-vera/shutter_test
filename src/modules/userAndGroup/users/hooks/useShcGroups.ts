import type { FilteredItem } from "@/modules/userAndGroup/interfaces/Iuser";
import { useGroupStore } from "@/stores/groupStore";
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import { computed, onMounted, ref } from "vue";
export interface Option {
    label: string;
    value: string;
  }
export default function useShcGroups() {
    const selectedShcGroupIds = ref<string[]>([]);
    const selectedShcGroupIdsTemp = ref<string[]>([]);
    const shcGroupSearchTerm = ref<string>('');

    const groupStore = useGroupStore();
    const shcGroupStore = useShcGroupsStore()
    const applyShcGroupFilters = () => {
        selectedShcGroupIds.value = [...selectedShcGroupIdsTemp.value];
    };
    const resetShcGroupFilters = () => {
        selectedShcGroupIdsTemp.value = [];
        selectedShcGroupIds.value = [];
    }
    const handleShcGroupCheckboxChange = (value:string | undefined) => {
        if(value === undefined){
            return
        }
        if (selectedShcGroupIdsTemp.value.includes(value)) {
            selectedShcGroupIdsTemp.value = selectedShcGroupIdsTemp.value.filter(item => item !== value);
        } else {
            selectedShcGroupIdsTemp.value.push(value);
        }
    };
    const filteredMappedDataShcGroup  = computed<any[] >(() => {
        if(shcGroupStore.shcSelectGroupsData) {
          const dataFilter:any = shcGroupStore.shcSelectGroupsData?.response
          const searchTerm = shcGroupSearchTerm.value.toLowerCase();
          return dataFilter.filter((item:any) => item.name?.toLowerCase().includes(searchTerm));
        }
      });
    onMounted(async ()=>{

     })
    return{
        selectedShcGroupIdsTemp,
        selectedShcGroupIds,
        shcGroupSearchTerm,
        handleShcGroupCheckboxChange,
        filteredMappedDataShcGroup,
        applyShcGroupFilters,
        resetShcGroupFilters,
    }
}