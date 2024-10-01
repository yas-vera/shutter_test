<script setup lang="ts">
import BaseReport from '../base/BaseReport.vue';
import { useExportStore } from '@/stores/exportStore';
import { computed, ref, watchEffect } from 'vue';
import GroupCoverReport from './GroupCoverReport.vue';
import GroupDetailReport from './GroupDetailReport.vue';
const props = withDefaults(defineProps<{
      data: any
      group: string
    }>(), {
      data: [],
})

const exportStore = useExportStore()
const overviewGroup = ref(0);

watchEffect(() => {
  overviewGroup.value = props.data.length
});
const heightRule = 130; 
const maxHeight = 570; 
const dataByPage = computed(() => chunkArrayByHeight(props.data, maxHeight, heightRule));
const usersPerLine = 5; 
const lineHeight = 5;
const chunkArrayByHeight = (array:any, maxHeight:any, itemHeight:any) => {
    const chunks = [];
    let currentChunk:any = [];
    let currentHeight = 0;

    array.forEach((item:any) => {   
        const itemTotalHeight = calculateItemHeight(item, itemHeight);
        if (currentHeight + itemTotalHeight > maxHeight) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentHeight = 0;
        }
        currentChunk.push(item);
        currentHeight += itemTotalHeight;
    });
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}
const calculateItemHeight = (item:any, defaultHeight:number): number => {
  
  let userCount = 0;
    if (item.group_type === 'shc') {
        userCount = item.users_shc.length;
    } else {
        userCount = item.users_uds.length;
    }
    const numberOfLines = Math.ceil(userCount / usersPerLine);
    const dynamicHeight = numberOfLines * lineHeight;
    return defaultHeight + dynamicHeight;
    }
</script>

<template>
  <div :id="`container_content_group_${group}`" class="style-hidden-content">
    <BaseReport 
      :title="`${group.toUpperCase()} groups Report`" 
      :first-page="true"
      :customizable-title="exportStore.titleExport"
      :total-pages="props.data.length + 1"
      :clasification="exportStore.clasificationExport"
      >
      <template #content>
        <div>
          <GroupCoverReport :group="group" :overview-group="overviewGroup" />
        </div>
      </template>
    </BaseReport>
     <div v-for="(item, index) in dataByPage" :key="index">
        <BaseReport 
          :title="`${group.toUpperCase()} groups Report`" 
          :customizable-title="exportStore.titleExport"
          :total-pages="dataByPage.length + 1"
          :current-page="index + 2" 
          :clasification="exportStore.clasificationExport"
          >
          <template #content>
            <div>
              <GroupDetailReport 
                :group="group.toUpperCase()"
                :group-current="index" 
                :group-total="overviewGroup" 
                :items="item" 
                :page-quantity="dataByPage"
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
