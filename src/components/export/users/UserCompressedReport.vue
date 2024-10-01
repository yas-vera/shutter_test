<script setup lang="ts">
import BaseReportCompressed from '../base/BaseReportCompressed.vue';
import { useExportStore } from '@/stores/exportStore';
import { computed, ref, watchEffect } from 'vue';
import UserCompressedCoverReport from './UserCompressedCoverReport.vue';
import UserCompressedTableReport from './userCompressedTableReport.vue';


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
const maxHeight = 420; 

const dataByPage = computed(() => chunkArrayByHeight(props.data, maxHeight, heightRule));

const chunkArrayByHeight = (array:any, maxHeight:any, itemHeight:any) => {
    const chunks = [];
    let currentChunk:any = [];
    let currentHeight = 0;

    array.forEach((item:any) => {
      let varNumbers = item.rule_set.length === 0 ? 3 : item.rule_set.length
        const itemTotalHeight = varNumbers  * Number(itemHeight);

        if ((Number(currentHeight) + Number(itemTotalHeight)) > Number(maxHeight)) {
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
  <div id="container_content_users" class="style-hidden-content" >
    <BaseReportCompressed 
      :title="'Users Report'" 
      :first-page="true"
      :total-pages="dataByPage.length + 1"
      :customizable-title="exportStore.titleExport" 
      :clasification="exportStore.clasificationExport"
      >
      <template #content>
        <div>
          <UserCompressedCoverReport 
            :overview-users="overviewUsers" 
            />
        </div>
      </template>
    </BaseReportCompressed>

    <div v-for="(item, index) in dataByPage" :key="index">
      <BaseReportCompressed 
        :title="`Users Report`"
        :customizable-title="exportStore.titleExport"
        :total-pages="dataByPage.length + 1"
        :current-page="index + 2" 
        :clasification="exportStore.clasificationExport"
      >
          <template #content>
              <UserCompressedTableReport :items="item" />
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
