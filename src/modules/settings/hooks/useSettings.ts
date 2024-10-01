import systemService from "@/services/systemService";
import { useLoadStore } from "@/stores/loadStore";
import { useSystemStore } from "@/stores/systemStore";
import type { Status } from "@/types/Settings";
import { onMounted, ref } from "vue";

export default function useSettings() {
    const searchSettingValue = ref<string>('');
    const loaderStore = useLoadStore();
    const showDropdownStatus = ref(false);
    const selectOptionStatus = ref<Status>('NOMINAL');
    const selectOptionIcon = ref<string>('check_circle');
    const selectOptionColor = ref<string>('nominal-icon');
    const selectOptionColorBox = ref<string>('nominal-icon');
    const systemStore = useSystemStore()
    const searchSetting = async (value:string) =>{
        searchSettingValue.value = value
        loaderStore.setLoadingSearch(true);
        loaderStore.setLoadingSearch(false);
    }

    const updateSelectStatusDropdown = ({ detail }: any) => {
        const selectedItem = detail as Status
        selectOptionStatus.value = selectedItem;

        const defaultClassIcon = 'qtm-icon qtm-icon-medium hydrated'
        
        switch(selectedItem){
            case 'NOMINAL':
                selectOptionIcon.value = 'check_circle';
                selectOptionColor.value = `nominal-icon ${defaultClassIcon}`;
                selectOptionColorBox.value = `nominal-icon`;
                break;
            case 'MAINTENANCE':
                selectOptionIcon.value = 'settings';
                selectOptionColor.value = `maintenance-icon ${defaultClassIcon}`;
                selectOptionColorBox.value = `maintenance-icon`;
                break;
            case 'INCIDENT':
                selectOptionIcon.value = 'error';
                selectOptionColor.value = `incident-icon ${defaultClassIcon}`;
                selectOptionColorBox.value = `incident-icon`;
                break;
            case 'OUTAGE':
                selectOptionIcon.value = 'warning';
                selectOptionColor.value = `outage-icon ${defaultClassIcon}`;
                selectOptionColorBox.value = `outage-icon`;
                break;
        }

        showDropdownStatus.value = false;
    };

    const handleStatusButton = () => {
        document.getElementById('id-status-button')?.click();
    }

    const saveSettings = async () => {
        await systemService.postStatus(selectOptionStatus.value);
        await systemStore.getStatusPetition()
    }
    onMounted(async () => {
        await systemStore.getStatusPetition();
        const statusFromStore = systemStore.status.status;
        selectOptionStatus.value = (['NOMINAL', 'OUTAGE', 'INCIDENT','MAINTENANCE'].includes(statusFromStore.toLocaleUpperCase()))
          ? statusFromStore.toLocaleUpperCase() as Status
          : 'NOMINAL';
          updateSelectStatusDropdown({ detail: selectOptionStatus.value });
      });
      
      
    return {
        searchSettingValue,
        searchSetting,
        showDropdownStatus,
        selectOptionStatus,
        updateSelectStatusDropdown,
        handleStatusButton,
        selectOptionIcon,
        selectOptionColor,
        selectOptionColorBox,
        saveSettings
    };
}
