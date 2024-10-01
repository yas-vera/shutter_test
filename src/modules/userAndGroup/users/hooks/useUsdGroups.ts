import type { FilteredItem } from "@/modules/userAndGroup/interfaces/Iuser";
import { useGroupStore } from "@/stores/groupStore";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import { computed, onMounted, ref } from "vue";
export interface Option {
    label: string;
    value: string;
  }
export default function useUsdGroups() {
    const selectedUdsGroupIds = ref<string[]>([]);
    const selectedUdsGroupIdsTemp = ref<string[]>([]);
    const udsGroupSearchTerm = ref<string>('');

    const groupStore = useGroupStore();
    const udsGroupStore = useUdsGroupsStore()
    const applyUdsGroupFilters = () => {
        selectedUdsGroupIds.value = [...selectedUdsGroupIdsTemp.value];
    };
    const resetUdsGroupFilters = () => {
        selectedUdsGroupIdsTemp.value = [];
        selectedUdsGroupIds.value = [];
    }
    const handleUdsGroupCheckboxChange = (value:string | undefined) => {
        if(value === undefined){
            return
        }
        if (selectedUdsGroupIdsTemp.value.includes(value)) {
            selectedUdsGroupIdsTemp.value = selectedUdsGroupIdsTemp.value.filter(item => item !== value);
        } else {
            selectedUdsGroupIdsTemp.value.push(value);
        }
    };
    const filteredMappedDataUdsGroup  = computed<any[] >(() => {
        if(udsGroupStore.udsSelectGroupsData) {
          const dataFilter:any = udsGroupStore.udsSelectGroupsData?.response
          const searchTerm = udsGroupSearchTerm.value.toLowerCase();
          return dataFilter.filter((item:any) => item.name?.toLowerCase().includes(searchTerm));
        }
    });
    onMounted(async ()=>{

     })
    return{
        selectedUdsGroupIdsTemp,
        selectedUdsGroupIds,
        udsGroupSearchTerm,
        handleUdsGroupCheckboxChange,
        filteredMappedDataUdsGroup,
        applyUdsGroupFilters,
        resetUdsGroupFilters,
    }
}