<script lang="ts" setup>
import LoadIcon from '@/assets/icons/LoadIcon.svg'
import { useLoadStore } from '../../stores/loadStore';
import {
   QtmTypography,
} from "@qtm/vue";
const loadStore = useLoadStore()
</script>

<template>
  <div class="loading-mask" v-if="loadStore.isLoading">

      <div role="status" class="loading-wrapper" style="z-index: 999999">
      <img :src="LoadIcon" alt="Loading icon" style="fill: #fff;" />
      <qtm-typography v-if="loadStore.showProgressBar" component="subtitle-2" style="color: white;">Export in progress. Please wait.</qtm-typography>
      <div v-if="loadStore.showProgressBar" class="progress-container">
        <div class="progress-bar" :style="{ width: loadStore.progress + '%' }"></div>
      </div>
      <!-- <span class="sr-only">Loading...</span> -->
    </div>
    
  </div>
</template>

<style scoped>
.loading-mask {
  position: fixed;
  z-index: 9998;
  margin: auto;
  top: 0;
  left: 0;
  width: calc(100vw);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.progress-container {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 5px;
  margin-top: 10px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4c5dff;
  width: 0%;
  transition: width 0.4s ease;
}
</style>
