import { PERCENT_100, PERCENT_40 } from "@/constants/constants";
import type { IAoiDraw, ViewOptions } from "@/interfaces/IDraw";
import { useConflictStore } from "@/stores/conflictStore"
import { useMapViewStore } from "@/stores/mapViewStore";
import { useRulesStore } from "@/stores/rulesStore";
import { useScreenStore } from "@/stores/screenStore";
import { onMounted, ref } from "vue"
import type { ClickRowArgument } from "vue3-easy-data-table";

export default function useConflictManagement() {
    const conflictStore = useConflictStore()
    const screenStore = useScreenStore();
    const rulesStore = useRulesStore();
    const mapStore = useMapViewStore()
    const widthMaximise = ref(PERCENT_40);
    const selectedRow = ref<number>(0);
    const maximiseForm = () => {
        widthMaximise.value = widthMaximise.value === PERCENT_40 ? PERCENT_100 : PERCENT_40;
        if (widthMaximise.value === PERCENT_40) {
            rulesStore.showConflictMoved = true
            rulesStore.showConflictMinimize = true
        }
    }
    const closeMaximiseForm = () => {
        widthMaximise.value = PERCENT_40;
    }
    const closeModal = () => {
        closeMaximiseForm();
        //mapStore.restoreZoom();
        mapStore.removeVectorLayer()
        rulesStore.handleShowConflictManagement();
        rulesStore.showConflictMinimize = false
        rulesStore.showConflictMoved = true
    }
    const expandedRows = ref<number[]>([]);



    const handleManageConflict = (item: string) => {
        if (item === 'permit') {
            return true;
        }
        return false
    }
    const handleClassConflict = (item: string) => {
        return item === 'prohibit' ? 'bg-color-custom-prohibitive' : 'bg-color-custom-permissive';
    };
    const handleValueChange = async (value: boolean, item: any) => {
        const requestPut = await conflictStore.putConflictData(item.id, value ? 'permit' : 'prohibit')
        if (requestPut) {
            await conflictStore.setUdsGroupData()
        }
    };
    const handleHeightTable = () => {
        if (widthMaximise.value === PERCENT_40) {
            return screenStore.dimanicScreenHeight(390)
        }
        return screenStore.dimanicScreenHeight(260)
    }
    const toggleRowExpansion = (userId: number) => {
        const index = expandedRows.value.indexOf(userId);
        if (index !== -1) {
            expandedRows.value.splice(index, 1);
        } else {
            expandedRows.value.push(userId);
        }
    }
    const isRowExpanded = (userId: number) => {
        return expandedRows.value.includes(userId);
    }
    const countItemHelper = (item: any, quantity: number) => {
        if (item.length > quantity) {
            return true
        }
        return false
    }

    const handleMinimizeOption = (value: boolean) => {
        rulesStore.showConflictMinimize = value
    }
    const handleMovedOption = (value: boolean) => {
        rulesStore.showConflictMoved = value
    }
    const showRow = async (item: ClickRowArgument) => {
        if (item) {
            if (item.id === selectedRow.value) {
                return
                // mapStore.restoreZoom();
                // selectedRow.value = 0
                // mapStore.removeVectorLayer()
                
            }
            selectedRow.value = item.id
            const options: ViewOptions = {
                centerPosition: 'custom',
                positionCustom: {
                    padding: [220,-750,220,0],
                    duration: 1000
                }
            };
            const selectedAreas: IAoiDraw = {
                wkt: item.geometry.area_wkt,
                colorType: item.rule_type
            };
            mapStore.selectAOIdraw([selectedAreas], options);
        } else {
            mapStore.restoreZoom();
            mapStore.removeVectorLayer()
        }
    };
    return {
        conflictStore,
        selectedRow,
        mapStore,
        showRow,
        closeModal,
        rulesStore,
        widthMaximise,
        maximiseForm,
        handleMinimizeOption,
        handleMovedOption,
        handleHeightTable,
        isRowExpanded,
        countItemHelper,
        toggleRowExpansion,
        expandedRows,
        handleClassConflict,
        handleManageConflict,
        handleValueChange
    }
}