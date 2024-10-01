<script setup lang="ts">
import {onMounted, watch} from 'vue'
import { QtmCheckbox, QtmTextInput } from "@qtm/vue";
import { useUserStore } from "@/stores/userStore";
import { useScreenStore } from '@/stores/screenStore';
const props = defineProps<{
  width?: string;
  widthContent?: string;
  widthDetails?: string;
  itemSelected? : any[];
}>();
const screenStore = useScreenStore();

//userDetails
</script>
<template>
  <div class="container-main" :style="`width: ${props.widthContent ? props.widthContent : '70%'}; position: relative;height: ${screenStore.screenHeight -205}px ; `">
    <div
      class="container-detail"
      :style="props.widthDetails ? `width: ${props.widthDetails};` : ''"
    >
      <div class="iconDiv" style="flex: 0 0 10%;" >
          <slot name="iconDiv"></slot> 
      </div>
      <div class="titleDiv" style="flex: 1" >
        <slot name="titleDiv"></slot>
      </div>
      <div class="firstDiv" style="flex: 0 0 10%;">
        <div class="firstDivLeft">
          <slot name="firstDivLeft"></slot>
        </div>
        <div>
          <slot name="firstDivRight"></slot>
        </div>
      </div>

      <div class="secondDiv" style="flex: 1">
        <div
          :style="`height: 100%; width: ${props.width ? props.width : '100%'};`" 
        >
          <slot name="secondDiv"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped> 
.container-main {
  display: flex;
  position: relative;
}
.text-modal {
  color: white;
}
.container-detail {
  width: 100%;
  background-color: #1C1D26;
}

</style>
