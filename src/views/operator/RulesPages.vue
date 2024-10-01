<script setup lang="ts">
import MenuFloating from '@/components/menu/MenuFloating.vue';
import MainWrapperFrame from '@/components/mainWrapperFrame/MainWrapperFrame.vue';
import Rules from '@/modules/rules/rules.vue';
import MapView from '@/modules/map/MapView.vue';
import { onMounted } from 'vue';
import { useRulesStore } from '@/stores/rulesStore';
const ruleStore = useRulesStore()
onMounted(()=>{
  ruleStore.dataRules({
    limit: 500
  })
  ruleStore.limitData = 10;
})
</script>
<template>
  
   <MainWrapperFrame>
    <MenuFloating/>
    
    <Rules />
    <MapView/>
   </MainWrapperFrame>
</template>