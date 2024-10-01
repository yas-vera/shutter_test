<template>
    <div v-show="isMinus" class="stepperContentMinus" :style="{ left: getLeftPosition(props.indexPosition?props.indexPosition:1) }">
      <div class="headerIcons">
        <qtm-typography classes="text-bluegrey-100" style="position: absolute; left: 16px;">{{ nameProp }}
        </qtm-typography>
        <qtm-icon icon="remove" size="medium" classes="text-bluegrey-100 margin-right"
          style="cursor : not-allowed !important"></qtm-icon>
        <qtm-icon icon="open_in_full" size="medium" classes="text-bluegrey-100 margin-right" @click="minusForm()"
          style="cursor: pointer !important;"></qtm-icon>
        <qtm-icon icon="close" size="medium" classes="text-bluegrey-100" @click="closeForm()"
          style="cursor: pointer !important;"></qtm-icon>
      </div>
    </div>
    <div v-show="!isMinus" class="draggable" :style="{ top: posY + 'px', left: posX + 'px' }">
      <div class="stepperContent" :style="{ width: `${screenStore.screenWidth > 1150 ? (props.contentWidth || '70%'):'100%'}`, height: heightMaximise }">
        <div class="headerStepper">
          <div class="header-content-modal-dragging">
            <div :class=" !isMaximise ? 'headerContentMoved' : 'headerContentNoMoved' " @mousedown=" x => !isMaximise && dragStart(x)">
              <qtm-typography classes="font-title-multistep-custom">{{ props.Title }}</qtm-typography>
            </div>
            <div class="headerIcons">
              <qtm-icon icon="remove" size="medium" classes="text-bluegrey-100 margin-right cursor-pointer"
                @click="minusForm()"></qtm-icon>
              <qtm-icon :icon="isMaximise?'close_fullscreen':'open_in_full'" size="medium" :classes="'text-bluegrey-100 margin-right cursor-pointer'"
                @click="maximiseForm"></qtm-icon>
              <qtm-icon icon="close" size="medium" classes="text-bluegrey-100 cursor-pointer"
                @click="closeForm()"></qtm-icon>
            </div>
          </div>
          
          <qtm-divider  />

        </div>
        <div class="bodyStepper">
            <slot name='body-modal'></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue';
  import {
    QtmDivider,
    QtmIcon,
    QtmButton,
    QtmTypography,
    QtmFormLabel,
    QtmTextInput,
    QtmDropdownSelect,
    QtmDropdownSelectOption,
    QtmGrid,
    QtmTextarea, QtmAlert
  } from "@qtm/vue";
  import './ModalDragging.css'
  import { draggingHelper } from '@/helpers/dragging';
  import { useScreenStore } from '@/stores/screenStore';
  const props = defineProps<{
    Title: string,
    contentWidth?: string
    nameProp: string,
    indexPosition?: number
  }>();
  const emits = defineEmits<{
    (e: 'closeForm',values:any): void
    (e: 'maximiseForm'): void
    (e: 'closeMaximiseForm',values:any): void
  }>();
  const screenStore = useScreenStore();
  const posCustomX = computed(() => screenStore.dimanicScreenWidth(1000));
  const { posX, posY, dragStart, maximise } = draggingHelper()
  const formData = ref<any>({}); 
  const closeForm = () => {
    emits('closeForm',formData.value);
    emits('closeMaximiseForm',formData.value);
  }
  const minusForm = () => {
    isMinus.value = !isMinus.value;
  }
 
  const heightMaximise = ref('78.5vh');
  const isMaximise = ref(false);
  const isMinus = ref(false);
  const positionX = ref<number>(0);
  const positionY = ref<number>(0);
  
  
  const maximiseForm = () => {
    if (heightMaximise.value == '93.5%') {
      heightMaximise.value = '78.5vh';
    } else {
      heightMaximise.value = '93.5%';
    }
  }
  

  
  watch(heightMaximise, (newValue, oldValue) => {
    isMaximise.value = newValue === '93.5%' ? true : false;
    if (isMaximise.value) {
      positionX.value = posX.value;
      positionY.value = posY.value;
      emits('maximiseForm');
      maximise()
    } else {
      emits('maximiseForm');
      maximise(positionX.value, positionY.value)
    }
  });
  
  

  const getLeftPosition = (index: number) => {
    const componentWidth = 225; 
    const horizontalGap = 5; 
    const initialGap = 9; 
    if (index === 1) {
      return `0 px`;
    }
    return `${(index - 1) * (initialGap + componentWidth + horizontalGap )}px`;
  };
  </script>
  
  <style scoped>
  .input-text-margin {
    margin-top: 30px !important;
  }
  
  .margin-right {
    margin-right: 10px !important;
  }
  </style>