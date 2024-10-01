<script setup lang="ts">
import { ref,onMounted,computed, watch } from 'vue';
import ClickOutSide from '../clickoutside/ClickOutSide.vue';
import { QtmMenuItemList,QtmMenuItem,
QtmMenuItemLabel,
QtmIcon} from '@qtm/vue';

const isOpen = ref(false);
const props = defineProps(['options','currenPage']);
const emits = defineEmits<{
(e: 'selected', option: any): void

}>();
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option:any) => {

  isOpen.value = false;
  emits('selected', option);
};
const isSelected = (option: any) => {
return option ==props.currenPage;
};

</script>
<template>
  <ClickOutSide @clickoutside="isOpen = false">
    <div class="container-select-custom">
      <div class="custom-select" @click="toggleDropdown">
      <div class="selected-option" style="display: flex; justify-content: space-between; align-items: center; padding: 4px;">
        <div>
          {{ props.currenPage }}
        </div>
        <qtm-icon :icon="isOpen?'expand_less':'expand_more'" size="medium" classes="text-primary-100"></qtm-icon>
      </div>
    </div>
    <div class="options" v-show="isOpen">



     
        <qtm-menu-item-list>
          <span>

          
                  <qtm-menu-item :active="isSelected(option.value)"  v-for="(option, index) in props.options" :key="index" @click="selectOption(option.value)" >
                    <qtm-menu-item-label>{{option.label}}</qtm-menu-item-label>
                  </qtm-menu-item >
                </span>
                </qtm-menu-item-list>
              

    </div>

    </div>

  </ClickOutSide>
  </template>



  <style scoped>
  .container-select-custom{
    position: relative;
    height: auto;
    display: flex;
  }
  .custom-select {
    position: relative;
    width: 56px;
    height: 44px;

  }

  .selected-option {
    color: white;
    display: flex;
    background-color: #000000;
    box-shadow: inset 0 0 0 1px #797D9C;
    cursor: pointer;
    width: 56px;
    height: 44px;
    top: 0;
  }

  .options333 {
  position: fixed;
  bottom: 95px;
  right: 250px;
  width: 50px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: #ffffff;

  border-top: none;
  z-index: 2;
}

.options {
  position: absolute !important;
  bottom:45px;
  right: 0;
  width: 56px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: #000000;

  border-top: none;
  z-index: 2;
}


.options-divs{
  background-color: black;
  color: #ffffff;
  height: 40px;
  padding: 10px;
  cursor: pointer;
}
.options-divs:hover{

  background-color: rgba(57, 57, 57, 0.9);

}

  .options li {
    padding: 10px;
    cursor: pointer;
  }

  .options li:hover {
    background-color: #f0f0f0;
  }
  </style>
