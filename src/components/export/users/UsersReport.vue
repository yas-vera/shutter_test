<script setup lang="ts">
import BaseReport from '../base/BaseReport.vue';
import { useExportStore } from '@/stores/exportStore';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import UserCoverReport from './UserCoverReport.vue';
import UserTableReport from './UserTableReport.vue';

const props = withDefaults(defineProps<{
      data: any
    }>(), { 
      data: [],
})

const exportStore = useExportStore()
const overviewUsers = ref(0);

watchEffect(() => {
  overviewUsers.value = props.data.length
});

const heightRule = 13; 
const maxHeight = 760; 

const dataByPage = computed(() => chunkArrayByHeight(props.data, maxHeight, heightRule));

const chunkArrayByHeight = (array:any, maxHeight:any, itemHeight:any) => {
    const chunks = [];
    let currentChunk:any = [];
    let currentHeight = 0;
    array.forEach((item:any) => {   
      let varNumbers = item.rule_set.length === 0 ? 3 : item.rule_set.length
        const itemTotalHeight = varNumbers  * Number(itemHeight);

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

</script>

<template>
  <div id="container_content_users" class="style-hidden-content">
    <BaseReport 
      :title="`Users Report`" 
      :first-page="true"
      :customizable-title="exportStore.titleExport"
      :total-pages="dataByPage.length + 1"
      :clasification="exportStore.clasificationExport"
      >
      <template #content>
        <div>
          <UserCoverReport :overview-group="overviewUsers" />
        </div>
      </template>
    </BaseReport>

    <div v-for="(item, index) in dataByPage" :key="index">
      <BaseReport 
        :title="`Users Report`"
        :customizable-title="exportStore.titleExport"
        :total-pages="dataByPage.length + 1"
        :current-page="index + 2" 
        :clasification="exportStore.clasificationExport"
      >
          <template #content>
              <UserTableReport :items="item" />
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
