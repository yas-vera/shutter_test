<template>
    <div class="buttomsLogout">
        <div class="buttomsLeft">
        <qtm-icon
            :size="props.iconLeft.size"
            :variant="props.iconLeft.variant"
            :icon="props.iconLeft.icon"
        />
        </div>
        <div class="middleContent">
        <qtm-typography classes="font-bold" class="no-wrap">
        {{ props.label }}
        </qtm-typography>
        </div>
        <div class="buttomsRight">
        <qtm-icon
            :size="props.iconRight.size"
            :variant="props.iconRight.variant"
            :icon="props.iconRight.icon"
        />
        </div>
      </div>
</template>
<script setup lang="ts">
import type { iconQtm, variantQtm } from "@/types/TIconQtm";
import {
   QtmIcon,
   QtmTypography,
} from "@qtm/vue";
const props = defineProps<{
  label?: string
  iconLeft: {
    size:iconQtm,
    variant:variantQtm,
    icon:string
  }
  iconRight: {
    size:iconQtm,
    variant:variantQtm,
    icon:string
  }
  
}>()
</script>
<style scoped>
.buttomsLogout{
    display: flex;
    width: 100%;
    padding: 10px;
    align-items: center;
  }
  .buttomsLeft{
    justify-content: left;
    margin-right: 15px;
  }
  .buttomsRight{
    width: 100%;
    display: flex;
    justify-content: end;
  }
  .middleContent {
  flex: 1; 
  display: flex;
  align-items: center;
}
.no-wrap {
  white-space: nowrap;
}
</style>