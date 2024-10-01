import { defineStore } from "pinia";
import { ref, computed } from 'vue';

export const useModalSelectedStore = defineStore('modalSelectedStore', () => {
    
    const selectedModal = ref<string[]>([]);

    const addOption = (option: string) => {
        if (!selectedModal.value.includes(option)) {
            selectedModal.value.push(option);
        }
    }

    const removeOption = (option: string) => {
        const index = selectedModal.value.indexOf(option);
        if (index !== -1) {
            selectedModal.value.splice(index, 1);
        }
    }

    const countModals = computed(() => selectedModal.value.length);

    return {
        selectedModal,
        addOption,
        removeOption,
        countModals
    }
})