import { defineStore } from "pinia";
import { ref ,watch } from 'vue';

export const useLoadStore = defineStore('loadStore', () => {
    const isLoading = ref<boolean>(false);
    const showProgressBar = ref<boolean>(false);
    const progress = ref<number>(0);
    const loadSearch =ref<boolean>(false);
    const isActiveLoadArea =ref<boolean>(true)
    function setLoading(value: boolean) {
        if(!loadSearch.value){
            isLoading.value = value;
        } 
    }
    function setLoadingSearch(value: boolean) {
            loadSearch.value = value;
    }
    watch(() => isActiveLoadArea.value, (newValue) => {
            if (newValue === true) {
                isLoading.value = false;
            }
    });
    return {
        isLoading,
        progress,
        showProgressBar,
        setLoading,
        loadSearch,
        isActiveLoadArea,
        setLoadingSearch
    }
})