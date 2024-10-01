<script setup lang="ts">
import BaseReport from '../base/BaseReport.vue';
import { useExportStore } from '@/stores/exportStore';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRulesStore } from '@/stores/rulesStore';
import { useMapViewStore } from '@/stores/mapViewStore';
import RuleCoverReport from './RuleCoverReport.vue';
import RuleExtendedReport from './RuleExtendedReport.vue';
const props = withDefaults(defineProps<{
      data: any
    }>(), {
      data: [],
    })

const exportStore = useExportStore()
const rulesStore = useRulesStore()
const overviewRules = ref({
  countRules: 0,
  countBlocking: 0,
  countTracking: 0,
  countPermissive: 0,
});

watchEffect(() => {
  overviewRules.value = {
    countRules: props.data.length,
    countBlocking: props.data.filter((item:any) => item.rule_type === 'blocking' || item.rule_type === 'prohibitive').length,
    countTracking: props.data.filter((item:any) => item.rule_type === 'tracking').length,
    countPermissive: props.data.filter((item:any) => item.rule_type === 'permissive').length,
  };
  
});
</script>
 
<template>
  <div id="container_content_rule" class="style-hidden-content">
    <BaseReport 
      :title="'Rules Report'" 
      :customizable-title="rulesStore.titleExportRule" 
      :total-pages="props.data.length + 1"
      :clasification="rulesStore.clasificationLvlRule"
      :first-page="true"
      >
      <template #content>
        <div>
          <RuleCoverReport :overview-rules="overviewRules" :customizable-title="rulesStore.titleExportRule"  />
        </div>
      </template>
    </BaseReport>

    <div v-for="(item, index) in props.data">      
      <BaseReport 
        :title="'Rules Report'" 
        :customizable-title="rulesStore.titleExportRule" 
        :current-page="index + 2"  
        :total-pages="props.data.length + 1"
        :clasification="rulesStore.clasificationLvlRule">
        <template #content>
          <div>
            <RuleExtendedReport 
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
