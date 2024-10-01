<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { QtmRadioButton } from "@qtm/vue";
const props = defineProps<{
    isLat: boolean;
    id: number;
    value: any;
    isEdit: boolean;
}>();

const grades = ref('')
const minutes = ref('')
const seconds = ref('')
const orientation = ref('')
const validInput = ref<any[]>([])
const emit = defineEmits();



onMounted(() => {
  //if (props.value) {

    let _grades = null;
    let _minutes = null;
    let _seconds = null;
    let _orientation = props.value.slice(-1);

    if(props.value.includes('°')) {
      _grades = props.value.split(' ')[0];
    }
    if(props.value.includes("'") || props.value.includes("′")) {
      _minutes = props.value.split(' ')[1];
    }
    if(props.value.includes('"') || props.value.includes("″")) {
      _seconds = props.value.split(' ')[2];
    }

    grades.value = _grades ? _grades.replace("°", "") : ( props.isEdit ? '0' : '' );
    minutes.value = _minutes ? _minutes.replace("'", "").replace("′", ""): ( props.isEdit ? '0' : '' );
    seconds.value = _seconds ? _seconds.replace('"', "").replace("″", "") : ( props.isEdit ? '0' : '' );
    orientation.value = _orientation;
      
    //}
  })


  const handleInput = (field: 'grades' | 'minutes' | 'seconds', event: Event) => {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.-]/g, '').replace(/(\..*?)\..*/g, '$1');
    switch (field) {
        case 'grades':
            grades.value = input.value;
            break;
        case 'minutes':
            minutes.value = input.value;
            break;
        case 'seconds':
            seconds.value = input.value;
            break;
    }
}

  
  watch([grades, minutes, seconds, orientation], ([newGrades, newMinutes, newSeconds, newOrientation]) => {
    const value = `${newGrades}° ${newMinutes}′ ${newSeconds}″ ${newOrientation}`;

    if(
      (props.isLat ? newGrades && (Number(newGrades) > 90 || Number(newGrades) < 0) : newGrades && (Number(newGrades) > 180 || Number(newGrades) < 0))
      || newMinutes && Number(newMinutes) > 59
      || newSeconds && Number(newSeconds) > 59.9999
    ){
      validInput.value[props.id] = true;
    } else {
      validInput.value[props.id] = false;
    }

    if(
      newGrades && newGrades.length > 0 
      && newMinutes && newMinutes.length > 0
      && newSeconds && newSeconds.length > 0
      && newOrientation && newOrientation.length > 0
      && !validInput.value[props.id]
    ) {
      emit('invalid-lat-lon', false);
      emit('update-value', value);
    }else {
      emit('invalid-lat-lon', true);
    }
  })

</script>

<template>
  <div class="container-input">
        <qtm-radio-button :id="`lat_${id}`" @change="orientation = 'N'" :name="`lat_${id}`" v-if="props.isLat"  :checked="orientation === 'N'" size="medium">N</qtm-radio-button>
        <qtm-radio-button :id="`lat_${id}`" @change="orientation = 'S'" :name="`lat_${id}`" v-if="props.isLat"  :checked="orientation === 'S'" size="medium">S</qtm-radio-button>
        
        <qtm-radio-button :id="`lon_${id}`" @change="orientation = 'E'" :name="`lon_${id}`" v-if="!props.isLat"  :checked="orientation === 'E'" size="medium">E</qtm-radio-button>
        <qtm-radio-button :id="`lon_${id}`" @change="orientation = 'W'" :name="`lon_${id}`" v-if="!props.isLat"  :checked="orientation === 'W'" size="medium">W</qtm-radio-button>
        <span class="flex">
        <input 
          type="text" 
          v-model="grades"
           @input="handleInput('grades', $event)"
          :class="`qtm-input-edit-table qtm-input-edit-table-grades ${(validInput && validInput[props.id]  ) ? 'input-text-danger': ''}`" /> 
        °
        </span>
        <span class="flex">
        <input 
          type="text" 
          v-model="minutes"
           @input="handleInput('minutes', $event)"
          :class="`qtm-input-edit-table qtm-input-edit-table-grades ${(validInput && validInput[props.id]  ) ? 'input-text-danger': ''}`" /> 
        '
        </span>
        <span class="flex">
        <input 
          type="text" 
          v-model="seconds"
           @input="handleInput('seconds', $event)"
          :class="`qtm-input-edit-table qtm-input-edit-table-seconds ${(validInput && validInput[props.id]  ) ? 'input-text-danger': ''}`" /> 
        "
        </span>
    </div>
</template>

<style scoped>
.container-input {
    display: flex;
    gap: 8px; 
    justify-content: center; 
    align-items: center;
}

.qtm-input-edit-table {
  min-width: 139px !important;
  max-width: 139px !important;
  height: 19px;
  background-color: #131319;
  font-family: 'Roboto';
  font-size: 14px;
  padding-top: 2px;
  padding-bottom: 1px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 2px;
}

.qtm-input-edit-table-grades {
  min-width: 36px !important;
  max-width: 36px !important;
  outline: none;
  outline-offset: 0;
}

.qtm-input-edit-table-seconds {
  min-width: 64px !important;
  max-width: 64px !important;
  outline: none;
  outline-offset: 0;
}
.input-text-danger {
  border: 1px solid red;
}
</style>