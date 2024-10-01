import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export interface IFilters {
    [key: string]: string | undefined;
    rule_id?: string
    rule_name?: string
    status?: string
    rule_type? :string
    validity_start_time? :any
    validity_end_time? :any
    sensing_start_time? :any    
    sensing_end_time? :any    
    creation_date_start_criteria? :any
    comments? :string
    creation_date_end_criteria? :any
    mission_id? :any
    acquisition_mode_id? :any
    area? :any
    group_uds? :any
    group_shc? :any
    user?:any
} 

export const useFilterStore = defineStore('filtersStore', () => {
    const rulesFilters = reactive<IFilters>({})

    const handleFilters = (filters: IFilters) => {
        Object.assign(rulesFilters, { ...rulesFilters, ...filters })
    }
    

    const resetFilters = () => {
        rulesFilters.id = ''
        Object.keys(rulesFilters).forEach(key => {
            rulesFilters[key] = '';
        });
    }

    return {
        rulesFilters,
        handleFilters,
        resetFilters
    }
}, {
    persist: true,
})
 