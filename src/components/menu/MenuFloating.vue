<script setup lang="ts">
import { TAB_RULES, TAB_DETAILS_RULE } from "@/constants/constants";
import useFilterRules from "@/modules/rules/hooks/useFilterRules";
import { useFilterStore } from "@/stores/filtersStore";
import { useNavBarStore } from "@/stores/navBarStore";

import { useRulesStore } from "@/stores/rulesStore";
import {
  QtmHeader,
  QtmTabs,
  QtmButton,
  QtmMenuItemList,
  QtmHeaderBrand,
  QtmHeaderDivider,
  QtmHeaderMenu,
  QtmHeaderMenuLeft,
  QtmTab,
  QtmTypography,
  QtmHeaderMenuRight,
  QtmIcon,
  QtmTextInput,
  QtmTooltip
} from "@qtm/vue";

const rulesStore = useRulesStore()
const navBarStore = useNavBarStore()
const filterRules = useFilterStore()
const handleMenuDivide = async() => {
    rulesStore.handleviewRules('divide')
    if(rulesStore.isInitDataRule && filterRules.rulesFilters){
        await rulesStore.dataRules(filterRules.rulesFilters, false)
        rulesStore.isInitDataRule = false
    }

}
const handleMenuTable = async() => {
    rulesStore.handleviewRules('table')
    if(rulesStore.isInitDataRule && filterRules.rulesFilters){
        await rulesStore.dataRules(filterRules.rulesFilters, false)
        rulesStore.isInitDataRule = false
    }

}
</script>

<template>
<div class="menuFloating" v-if="(navBarStore.verifyMenu(TAB_RULES) && !rulesStore.verifyMenu(TAB_DETAILS_RULE))">

    <qtm-tooltip
        v-bind="{classes:'tooltip-button',content:'',tipPosition:'center',lowContrast:false,orientation:'bottom',size:'small',title:'Map view',visible:false}"
        >
        <div @click="()=>rulesStore.handleviewRules('map')" class="button-style-custom" id="mapView">
           <qtm-icon size="large" icon="map" variant="outlined" :style="{'color':rulesStore.viewRules === 'map'?'#66d7eb':''}"></qtm-icon> 
        </div>
        
    </qtm-tooltip>
    <qtm-tooltip
        v-bind="{classes:'tooltip-button tooltip-button-middle',content:'',tipPosition:'center',lowContrast:false,orientation:'bottom',size:'small',title:'Table view',visible:false}"
    >
    <div @click="handleMenuTable" class="button-style-custom"  id="tableView">
        <qtm-icon size="large" icon="table_rows" variant="outlined" :style="{'color':rulesStore.viewRules === 'table'?'#66d7eb':''}"></qtm-icon>
    </div>
    </qtm-tooltip>
    <qtm-tooltip
        v-bind="{classes:'tooltip-button',content:'',tipPosition:'center',lowContrast:false,orientation:'bottom',size:'small',title:'Split view',visible:false}"
    >
    <div @click="handleMenuDivide" class="button-style-custom" id="splitView">
        <qtm-icon size="large" icon="splitscreen" variant="outlined" :style="{'color':rulesStore.viewRules === 'divide'?'#66d7eb':''}"></qtm-icon>
    </div>
    </qtm-tooltip>
    
    
</div>
</template>
<style scoped>
    .menuFloating{
        display: flex;
        margin-top: 15px;
        margin-right: 15px;
        justify-content: right;
        position: absolute; 
        top: 156px; 
        right: 4px; 
        z-index: 141; 
        border: 2px solid #bcbec0;
        border-radius: 3px;
    }
    .tooltip-button {
        background-color: #1c1d26;
    }
    .tooltip-button-middle {
        border-left: 2px solid #bcbec0;
        border-right: 2px solid #bcbec0;
    }
    .button-style-custom {
        padding: 7px;
        color: #bcbece;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        /* margin-top: 2px; */
    }
    .button-style-custom:hover {
        background-color: #bcbece41;

    }
</style>