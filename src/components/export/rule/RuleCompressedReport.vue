<script setup lang="ts">
import BaseReportCompressed from '../base/BaseReportCompressed.vue';
import { useExportStore } from '@/stores/exportStore';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRulesStore } from '@/stores/rulesStore';
import { useMapViewStore } from '@/stores/mapViewStore';
import RuleCompressedCoverReport from './RuleCompressedCoverReport.vue';
import RuleCompressedReportTable from './RuleCompressedReportTable.vue';
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

const totalPages = ref(1);
const groupsData = ref<any[]>([]);

watchEffect(() => {
    let rules:any = props.data;
    overviewRules.value = {
        countRules: rules.length,
        countBlocking: rules.filter((item:any) => item.rule_type === 'blocking' || item.rule_type === 'prohibitive').length,
        countTracking: rules.filter((item:any) => item.rule_type === 'tracking').length,
        countPermissive: rules.filter((item:any) => item.rule_type === 'permissive').length,
    };
    totalPages.value = Math.ceil(rules.length / 10) + 1;
    const groups = [];
    for (let i = 0; i < rules.length; i += 10) {
        groups.push(rules.slice(i, i + 10));
    }
    groupsData.value = groups;    
});

</script>

<template>
  <div id="container_content_rule_compressed" class="style-hidden-content">
    <BaseReportCompressed 
      :title="'Rules report'" 
      :first-page="true"
      :total-pages="totalPages"
      :customizable-title="rulesStore.titleExportRule" 
      :clasification="rulesStore.clasificationLvlRule"
      >
      <template #content>
        <div>
          <RuleCompressedCoverReport 
            :overview-rules="overviewRules" 
            />
        </div>
      </template>
    </BaseReportCompressed>

    <div v-for="(item, index) in groupsData">
        <BaseReportCompressed 
        :title="'Rules report'" 
        :disable-line-footer="false"
        :total-pages="totalPages"
        :current-page="index + 2"
        :customizable-title="rulesStore.titleExportRule" 
        :clasification="rulesStore.clasificationLvlRule"
        >
        <template #content>
            <div>
            <RuleCompressedReportTable
                :items="item"
            />
            </div>
        </template>
        </BaseReportCompressed>
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
