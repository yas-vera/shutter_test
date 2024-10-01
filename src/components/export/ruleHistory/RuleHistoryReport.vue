<script setup lang="ts">
import BaseReport from '../base/BaseReport.vue';
import RulesExtendedCoverReport from './RulesExtendedCoverReport.vue';
import RuleExtendedDetailsReport from './RuleExtendedDetailsReport.vue';
import { useExportStore } from '@/stores/exportStore';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRulesStore } from '@/stores/rulesStore';
import { useMapViewStore } from '@/stores/mapViewStore';
import { computed } from 'vue';
const props = withDefaults(defineProps<{
      data: any
    }>(), {
      data: [],
    })
const exportStore = useExportStore()
const rulesStore = useRulesStore()
const mapStore = useMapViewStore()
const result = ref<any>([]);

const overviewRules = ref({
  countAois: 0,
  countBlocking: 0,
  countTracking: 0,
  countPermissive: 0,
});

function getChunksWithParent(data:any) {
  let result:any = [];
  let srIdCounts:any = {};

  data.forEach((element:any) => {
    if (element.sr_id in srIdCounts) {
      srIdCounts[element.sr_id]++;
    } else {
      srIdCounts[element.sr_id] = 1;
    }
    element.aois.forEach((aoi:any) => {
      result.push({ parent: element, aoi: aoi });
    });
  });

  return { chunks: result, srIdCounts: srIdCounts };
}

watchEffect(() => {
  let rules:any = [];
  props.data.forEach((item:any) => {
    item.aois.forEach((aoi:any) => {
      aoi.rules.forEach((rule:any) => {
        rules.push(rule);
      })
    }); 
  });
  overviewRules.value = {
    countAois: rulesStore.aoiSelected.length,
    countBlocking: rules.filter((item:any) => item.rule_type === 'blocking' || item.rule_type === 'prohibitive').length,
    countTracking: rules.filter((item:any) => item.rule_type === 'tracking').length,
    countPermissive: rules.filter((item:any) => item.rule_type === 'permissive').length,
  };


  // result.value = getChunksWithParent(props.data)

  
});
</script>

<template>
  <div id="container_content" class="style-hidden-content">
    <BaseReport 
      :title="'Filtering History Report'" 
      :customizable-title="rulesStore.titleExportRuleHistory" 
      :total-pages="props.data.length + 1"
      :clasification="rulesStore.clasificationLvl"
      :first-page="true"
      >
      <template #content>
        <div>
          <RulesExtendedCoverReport :overview-rules="overviewRules" :customizable-title="rulesStore.titleExportRuleHistory"/>
        </div>
      </template>
    </BaseReport>

    <div v-for="(item, index) in props.data">
      <BaseReport 
        :title="'Filtering History Report'" 
        :customizable-title="rulesStore.titleExportRuleHistory" 
        :current-page="index + 2"  
        :total-pages="props.data.length + 1"
        :clasification="rulesStore.clasificationLvl">
        <template #content>
          <div>
            <RuleExtendedDetailsReport 
              :sr-current="index + 1" 
              :sr-total="props.data.length" 
              :items="item"
              :image-group1="exportStore.mapImageUrl"
              :image-group2="exportStore.mapImageUrl2"
            />
          </div>
        </template>
      </BaseReport>
    </div>
  </div>
</template>

<style scoped>
.style-hidden-content{
  position: relative;
  z-index: -10;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

</style>
