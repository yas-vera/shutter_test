<script setup lang="ts">
import { QtmButton } from "@qtm/vue";
import MenuRules from "./menu/MenuRules.vue";
import AdvancedSearchPanel from "@/components/searchPanel/AdvancedSearchPanel.vue";
import RulesTable from "./RulesTable.vue";
import { useRulesStore } from "@/stores/rulesStore";
import { TAB_FORM_ADD_RULE, TAB_RULES, TAB_DETAILS_RULE } from "@/constants/constants";
import RulesDetails from "./RulesDetails.vue";
import { formContentRules } from "./config/dataSearch";
import ModalExport from "@/components/modal/ModalExport.vue";
import RulesCreate from "./RulesCreate.vue";
import ModalDragging from "@/components/modalDragging/ModalDragging.vue";
import { computed, nextTick, onMounted, onUpdated, ref, watch, watchEffect } from "vue";
import RulesConflictManagement from "@/modules/rules/RulesConflictManagement.vue";
import RulesDetailsComment from "@/modules/rules/RulesDetailsComment.vue";
import { useScreenStore } from "@/stores/screenStore";
import type { IAoiDraw } from "@/interfaces/IDraw";
import { useMapViewStore } from "@/stores/mapViewStore";
import interact from "interactjs";
import RuleCompressedReport from "@/components/export/rule/RuleCompressedReport.vue";
import { useExportStore } from "@/stores/exportStore";
import { useFilterStore } from "@/stores/filtersStore";
import useFilterRules from "./hooks/useFilterRules";
const rulesStore = useRulesStore();
const exportStore = useExportStore();

const screenStore = useScreenStore();
const mapStore = useMapViewStore()
const heightContent = ref<string>('');
const posCustomX = computed(() => screenStore.screenWidth);
const showExportHistory = ref<boolean>(false)
const filterRules =  useFilterRules()
const handleShowExportHistory = () => {
  showExportHistory.value = !showExportHistory.value
}
const filterStore = useFilterStore();
const handleSubmitFilterRules = async (data: any) => { 
  const dateKeys = [
    'sensing_end_time',
    'sensing_start_time',
    'validity_end_time',
    'validity_start_time'
  ];
  const updatedData = { ...data };
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (dateKeys.includes(key) && typeof value === 'string' && isValidISODate(value)) {
      updatedData[key] = value.slice(0, -1);
    }
  });
  if(data.area !== ''){
    // mapStore.disabledClustersAndPolygons = true
    // mapStore.viewLayers = true
    const selectedDrawLayer: IAoiDraw[] = [];
    data.area.forEach((element:any) => {
      selectedDrawLayer.push({
        wkt: element,
        colorType: undefined
      });
    }); 
    mapStore.selectAOIdraw(selectedDrawLayer);
  }else{
      mapStore.viewLayers = false
      mapStore.disabledClustersAndPolygons = false
      //mapStore.restoreZoom();
      mapStore.removeVectorLayer()
  }  
  filterStore.handleFilters({...data});
  await rulesStore.handleValuesFilter(updatedData);
  await rulesStore.dataRules(undefined, false);
}

const isValidISODate = (value: string): boolean => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
  return isoRegex.test(value);
};

const modalRuleHistory  = ref(null);      


watch(posCustomX, () => {
  if (posCustomX.value > 1920) {
    let heightPercentage = ((posCustomX.value - 1920) / 100) + 37;
    heightContent.value = heightPercentage + '%';
  } else {
    heightContent.value = 'auto';
  }
})

onMounted(() => {
  interact('#draggableElement')
  .resizable({
    // resize from all edges and corners
    //edges: { left: true, right: true, bottom: true, top: true },
    edges: { right: true },

    listeners: {
      move (event:any) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        rulesStore.modalContentChangeRuleHistory = event.rect.width;

      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),

    ],

    inertia: true
  })


})

onUpdated(async () => {
  await nextTick();
  const formElement:any = modalRuleHistory.value;
  if (formElement) {
    const width = formElement.offsetWidth;
    rulesStore.modalContentDefaulftRuleHistory = width;
  }
});

const optionCloseSearchRules = computed(() => {
  if(rulesStore.verifyMenu(TAB_DETAILS_RULE)){
    if(!rulesStore.expandDetailRule){
      return '45%'
    }else{
      return '100%'
    }
  }else{
    return '100%'
  }
})
watch(() => rulesStore.menuSelected, (length) => {
  if(rulesStore.verifyMenu(TAB_DETAILS_RULE)){
    mapStore.removeVectorLayer()
  }else{
    if (rulesStore.itemsSelected.length > 0) {
    const selectedAreas: IAoiDraw[] = rulesStore.itemsSelected.map(item => ({
        wkt: item.geometry.area_wkt,
        colorType: item.rule_type
      }));
    mapStore.selectAOIdraw(selectedAreas);
  } 
  }
});

</script>
<template>

  <MenuRules />
   
  <RulesConflictManagement  v-if="(rulesStore.showConflictManagement)"/>
  <ModalExport :show="showExportHistory" @close="handleShowExportHistory()"
    @export="rulesStore.handleExportHistory" 
    :shp-hidden="true"
    :csv-hidden="true"
    :xml-hidden="true"
    :pdf-compressed-hidden="false"
    :visible-required="true"
    />

  <ModalExport 
    :show="rulesStore.showModalExport" 
    :csv-hidden="true"
    @close="rulesStore.handleShowModalExport" 
    @export="rulesStore.handleExportRules" 
  />
  <AdvancedSearchPanel
    nameComponent="searchAdvancedRules"
    :form="formContentRules"
    excludeClick="optionCloseSearchRules"
    @apply-filters="handleSubmitFilterRules" />

  <template v-if="rulesStore.verifyMenu(TAB_FORM_ADD_RULE) || ( rulesStore.disableFormRule && (rulesStore.verifyMenu(TAB_DETAILS_RULE) || rulesStore.verifyMenu(TAB_RULES)))">
    <RulesCreate :show="rulesStore.verifyMenu(TAB_FORM_ADD_RULE) || rulesStore.verifyMenu(TAB_DETAILS_RULE) || rulesStore.verifyMenu(TAB_RULES)  " :index-position="rulesStore.minimizeItems.length+1" />
  </template>
  <div id="draggableElement" class="container-module"  ref="modalRuleHistory" :style="{
    'background-color': '#1c1d26', 'bottom': rulesStore.viewRules === 'divide' ? '0' : '', 'width': optionCloseSearchRules
    , 'height': rulesStore.viewRules === 'divide' ? heightContent : '','margin-top':!rulesStore.verifyMenu(TAB_DETAILS_RULE)?'60px':'',
  }"
    v-show="rulesStore.viewRules !== 'map' || rulesStore.verifyMenu(TAB_DETAILS_RULE)">
    <div class="content-module">
      <div :class="rulesStore.viewRules === 'divide' ? 'contend-divide' : ''"
        v-if="!rulesStore.verifyMenu(TAB_DETAILS_RULE)">
        <div class="container-button"
          :style="{ 'cursor': 'pointer', 'margin-bottom': rulesStore.viewRules !== 'divide' ? '45px' : '' }">
          <qtm-button v-if="rulesStore.viewRules !== 'map'" :disabled="rulesStore.itemsSelected.length === 0"
            size="medium" left-icon="visibility" :props="{
              id: 'buttonViewRuleDetails'
            }" :label="screenStore.screenWidth > 900 ? 'View rule enforcement' : 'Rules'"
            classes="text-scale-7 bg-bluegrey-700" @click-event="rulesStore.menuChange(TAB_DETAILS_RULE),rulesStore.handleviewRules('map'),rulesStore.handleRulesDetails()">
          </qtm-button>
          <qtm-button size="medium" left-icon="download" :disabled="rulesStore.itemsSelected.length === 0" :props="{
            id: 'exportRulesButton'
          }" classes="text-scale-7 bg-bluegrey-700" @click-event="rulesStore.handleShowModalExport()">Export Rules
          </qtm-button>
        </div>
      </div>
      <div id="id-user-table-container-rules" class="user-table-container-rules">
        <RulesDetails v-if="rulesStore.verifyMenu(TAB_DETAILS_RULE)" @show-export="handleShowExportHistory"  />
        <RulesTable v-else  /> 
      </div>
    </div>
  </div>

</template>
<style scoped>
.contend-divide {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.contend-divide-buttom-export {
  display: flex;
  justify-content: end;
  margin-top: -10px;
  margin-bottom: 10px;
  gap: 20px;
}

.contend-divide-buttom-export-down {
  display: flex;
  justify-content: end;
  margin-top: 5px;
  margin-bottom: 5px;
  gap: 20px;
}

.container-module {
  /* width: auto; */
  height: auto;
  display: flex;
  position: absolute;
  min-width: 45% !important;
  flex-direction: column;
  z-index: 139;
  
}

.content-module {
  position: relative;
  flex: 1;
  height: auto;
  margin-left: 23px;
  margin-right: 19px;
}

.user-table-container {
  overflow: auto;
  max-height: 90% !important;
  scrollbar-width: thin;
  scrollbar-color: #3b3d50 #1c1d26;
}

.container-ste3-custom {
  display: flex;
  flex-direction: column;
  gap: 10px;

  height: 100%;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.container-button {
  display: flex;
  margin-top: 12px;
  gap: 15px;
}
</style>