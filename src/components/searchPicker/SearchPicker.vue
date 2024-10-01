<script setup lang="ts">
import {ref, watch} from 'vue'
import { QtmIcon, QtmTextInput } from "@qtm/vue";
const props = defineProps<{
  value:string
  placeholder:string
  size:'small' | 'medium' | 'large'
  iconLeft?:string
  showLoader: boolean
  inputSearchId:string
  classInputCustom?:string
  classesInputCustom?:string
  marginRightLoaderIcon?:string
  extraClass?:string
}>()
const emits = defineEmits<{
    (e: 'update', option: string): void
}>();
const valueLocal = ref(props.value)
watch(() => valueLocal.value, (newValue) => {
  emits('update',valueLocal.value)
});
</script>
<template>
  <div class="container-search-picker">
    <div style="width: 100%; position: relative;" :class="extraClass">
      <QtmTextInput
            :classes="props.classesInputCustom?props.classesInputCustom:''"
            :class="props.classInputCustom?props.classInputCustom:''"
            :value="valueLocal"
            @value-changed="(event:any) => valueLocal = event.detail "
            :placeholder="placeholder"
            :size="props.size"
            :left-icon="props.iconLeft"
            :input-id="props.inputSearchId"
        >
        </QtmTextInput>
    </div>
    
        <div v-if="props.showLoader" :style="{'margin-right':marginRightLoaderIcon?marginRightLoaderIcon:'30px'}" class="loader"></div>
  </div>
        
</template>
<style scoped>
.container-search-picker{
  display: flex;
  position: relative;
}
.loader {
  position: absolute;
  right: 0;
  margin-top: 4px;
  border: 5px solid #000000; 
  border-top: 5px solid #5a5a5a; 
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>