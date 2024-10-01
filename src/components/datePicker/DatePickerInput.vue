<script setup lang="ts">
import { ref, computed,watch,onMounted } from 'vue';
import {
    QtmTextInput
} from "@qtm/vue";
import { datePickerFormat, datePickerFormatHours, isValidDate, parseFormattedDateTime } from '@/helpers/convertDateTime';
const selectedDate = ref<any>(new Date());
const darkMode = ref(true);
const props = defineProps(['modelValue', 'maxDate', 'enableSeconds', 'value','minDate','name','hour','noDefaultDate','placeholder','size','extraClass', 'disabled', 'required']);
const emits = defineEmits<{
    (e: 'update:modelValue', option: string): void
}>();
const formattedDate = ref<string | undefined>(undefined);
const updateDate = () => {
  if(props.hour) {
    return datePickerFormatHours(selectedDate)
  }
  if(selectedDate.value.toLocaleString() == 'Invalid Date'){
    return ''
  }
  return datePickerFormat(selectedDate)
}
const updateModel = (event:any) => {
  if(event.target.value && (event.target.value.length === 16 || event.target.value.length === 10)) {
    emits('update:modelValue', selectedDate.value.toISOString());
    return
  }

  emits('update:modelValue', '');
};
watch(() => props.value, (newValue) => {
  if(!newValue) return
  selectedDate.value = new Date(newValue);
  formattedDate.value = updateDate()
});

watch(() => selectedDate.value, (newValue) => { 
    if(newValue.toLocaleString() == 'Invalid Date'){
      return
    }else{
      emits('update:modelValue', newValue.toISOString());
      formattedDate.value = updateDate();
    }
});
onMounted(() => {
  
  /*if(!props.noDefaultDate) {
    let valid = isValidDate(props.value)
    if(valid){
      
      selectedDate.value = new Date(props.value)
    }else{
      
      let datevalue:any =  parseFormattedDateTime(props.value) 
      selectedDate.value = datevalue//datevalue.slice(0, -1);
    }
  }*/

  if(!props.noDefaultDate) {
     
     if(props.value !== undefined && props.value !== '' && props.value !== null){
      selectedDate.value = new Date(props.value);
    }
    // formattedDate.value = updateDate()
  } 
})
</script>

<template>
    <VueDatePicker 
      class="date-picker-input-custom"
      :teleport="true"
      :class="props.extraClass ? props.extraClass:''"
      v-model="selectedDate"
      :dark="darkMode"
      :min-date="props.minDate"
      :required="props.required"
      :max-date="props.maxDate"
      :enable-seconds="props.enableSeconds || false"
      time-picker-inline
      v-bind="$attrs"  
      position="left"
      >
      <template #trigger>
        <qtm-text-input
          classes="cursor-pointer"
          :size="props.size ? props.size : 'large'"
          :value="formattedDate"
          right-icon="calendar_month"
          :placeholder="props.placeholder ? props.placeholder : 'Select date'"
          :input-id="`input_${props.name}`"
          :disabled="props.disabled"
          @input="updateModel"
        ></qtm-text-input>
      </template>
    </VueDatePicker>
  </template>
 <style scoped>

</style>
  