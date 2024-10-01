<template>
  
    <div v-show="isMinus" class="stepperContentMinus" :style="{ left: leftSize }">
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
      <div class="stepperContent modal-border" :style="{ width: `${screenStore.screenWidth > 1150 ? (props.contentWidth || '70%'):'100%'}`, height: heightMaximise }">
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
  import { useRulesStore } from '@/stores/rulesStore';
import { usePosition } from '@/helpers/positionMinHelper';
  const props = defineProps<{
    Title: string,
    contentWidth?: string
    nameProp: string,
    indexPosition?: number,
    isMinimize?: boolean,
  }>();
  const rulesStore = useRulesStore();
  // const leftSize = ref<string>('0 px');
    const { leftSize, updateLeftPosition } = usePosition('conflict_management');
  const emits = defineEmits<{
    (e: 'closeForm',values:any): void
    (e: 'maximiseForm'): void
    (e: 'closeMaximiseForm',values:any): void
    (e: 'minimizeForm',values:boolean): void
    (e: 'moved',values:boolean): void
  }>();
  const screenStore = useScreenStore();

  const { posX, posY, dragStart, maximise } = draggingHelper()
  const formData = ref<any>({}); 
 
  const closeForm = () => {
    //heightMaximise.value = '78vh';
    //minusForm();
    emits('closeForm',formData.value);
    emits('closeMaximiseForm',formData.value);
  }
  const minusForm = () => {
    emits('minimizeForm',isMinus.value)
    isMinus.value = !isMinus.value;
  }
  
  const heightMaximise = ref('calc(100vh - 204px)');
  const isMaximise = ref(false);
  const isMinus = ref(props.isMinimize || false);
  const positionX = ref<number>(0);
  const positionY = ref<number>(0);

  watch(() => rulesStore.minimizeItems, (newValue, oldValue) => {
    
    getLeftPosition()
  });
  
  watch(isMinus, (newValue, oldValue) => {
    
    if(newValue) {
      rulesStore.addMinimizeItem('conflict_management');
      getLeftPosition()
    }else {
      getLeftPosition()
    }
  });
  
  const maximiseForm = () => {
    if (heightMaximise.value == '93.5%') {
      heightMaximise.value = 'calc(100vh - 204px)';
      emits('moved',true)
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
  
  watch(posX,(newValue,oldValue) =>{
    if(posX.value !== 0){
      emits('moved',false)
    }
    
  })
  watch(posY,(newValue,oldValue) =>{
    if(posY.value !== 160){
      emits('moved',false)
    }
    
  })

  onMounted(() => {
    setTimeout(() => {
      getLeftPosition();
    }, 200);
  })

  const getLeftPosition = () => {
    updateLeftPosition()
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