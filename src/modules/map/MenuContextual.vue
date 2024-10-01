<script setup lang="ts">
import ClickOutSide from "@/components/clickoutside/ClickOutSide.vue";
import {
    QtmMenuItemList,
    QtmMenuItem,
    QtmMenuItemLabel
} from "@qtm/vue";
const props = defineProps<{
  show: boolean
  contextMenuPosition?:any
}>()
const emits = defineEmits(['close','removePoint']);

</script>
<template>
    <ClickOutSide @clickoutside="$emit('close')">
    <div 
    v-if="props.show" 
    :style="{ position: 'absolute', top: contextMenuPosition?.y + 'px', left: contextMenuPosition?.x + 'px', display: 'flex', width: '115px', height: '40px', backgroundColor: 'black' }"
    
  >
        <qtm-menu-item-list :disabled-ids="['remove_point']">
            <qtm-menu-item @clicked-menu-item="$emit('removePoint')" itemid="remove_point" >
                <qtm-menu-item-label> Remove point </qtm-menu-item-label>
            </qtm-menu-item>
           
            </qtm-menu-item-list>
    </div>
    </ClickOutSide>
</template>
<style>
.context-menu {
  display: none;
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu-item {
  padding: 8px 12px;
  cursor: pointer;
}

.context-menu-item:hover {
  background-color: #eee;
}
</style>