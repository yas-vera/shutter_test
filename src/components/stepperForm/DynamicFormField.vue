<template>
    <div class="marginTopInputStepForm" :class="{ twoInputGrupInner: isDateFromTo }">
      <QtmFormLabel :component="fields.titleComponent" :classes="fields.titleClasses">
        {{ fields.title }}
      </QtmFormLabel>
      <QtmFormLabel :component="fields.labelComponent" :required="fields.required">
        <span>{{ fields.label }}</span>
      </QtmFormLabel>
      <component :is="getInputType(fields.type)" :fields="fields" :formData="formData" />
    </div>
  </template>
  
  <script setup lang="ts">
  import {computed} from 'vue'
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
   QtmTextarea,QtmAlert
} from "@qtm/vue";
import DatePickerInput from '../datePicker/DatePickerInput.vue';
  const props = defineProps(['fields', 'formData']);
  
  const isDateFromTo = computed(() => props.fields.type === 'dateFromTo');
  
  function getInputType(type:string) {
    switch (type) {
      case 'select':
        return QtmDropdownSelect;
      case 'text':
        return QtmTextInput;
      case 'textArea':
        return QtmTextarea;
      case 'dateFromTo':
        return DatePickerInput;
      default:
        return 'div';
    }
  }
  </script>
  