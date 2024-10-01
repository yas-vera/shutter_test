<script setup lang="ts">
import { nextTick, onMounted, ref, watchEffect } from 'vue';
import MultiSelect from 'primevue/multiselect';
import { watch } from 'vue';
import { onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: any;
  options: any;
  placeholder?: string;
  resetAll?: number;
  resetKey?: number;
  showLabelAll?: boolean;
  viewFooter: boolean
  disabled:boolean
  maxSelectedLabels: number
  display: 'chip' | "comma" | undefined
  selectionLimit?: number
  extraClass:string
  height:string
}>(), {
  viewFooter: false,
  disabled: false,
  maxSelectedLabels: 3,
  showLabelAll: false,
  display: 'chip',
  extraClass: '',
  height: '48px'
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const selectedOptions = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  selectedOptions.value = newValue;
});

watch(selectedOptions, (newValue) => {
  emits('update:modelValue', newValue);
});

watch(() => props.resetAll, () => {
  selectedOptions.value = [];
});

watch(() => props.resetKey, () => {
  selectedOptions.value = [];
});

onMounted( () => {
  if(selectedOptions.value && typeof selectedOptions.value === 'string'){
    selectedOptions.value = [selectedOptions.value]
  }
})

const showSelect = () => {
  if(props.showLabelAll) onShow();
}

const hideLabel = () => {
  const element = document.querySelectorAll('.p-multiselect-header .p-checkbox');
  if (element.length > 0) {
    element[0].setAttribute('style', 'display: none !important');
  }
}

const onShow = () => {
  addLabelToFirstCheckbox();
};

const addLabelToFirstCheckbox = () => {
  const checkboxes = document.querySelectorAll('.p-multiselect-header .p-checkbox .p-checkbox-input');
  if (checkboxes.length > 0) {
    const firstCheckbox = checkboxes[0];
    const label = document.createElement('span');
    label.textContent = '(All) - Search';
    if (firstCheckbox && firstCheckbox.parentNode) {
      firstCheckbox.parentNode.appendChild(label);
    }
  }
};

</script>

<template>
  <MultiSelect 
    v-model="selectedOptions" 
    :options="props.options" 
    optionLabel="label" 
    @show="showSelect"
    optionValue="value" 
    :display="props.display"
    filter :placeholder="props.placeholder || 'Select options'" 
    :maxSelectedLabels="props.maxSelectedLabels" 
    :disabled="disabled"
    :style="{ width: '100%', height: props.height }"
    :selectionLimit="props.selectionLimit"
    :class="'w-full md:w-20rem container-select ' + props.extraClass" >
    <template #footer v-if="props.viewFooter">
      <slot name="footer">
        <div class="py-2 px-4">

        </div>
      </slot>
    </template>
    </MultiSelect>
</template>


<style scoped>
.container-select {
  border-radius: 0;
  background-color: #000;
  border: 1px solid #797d9c;
}

.p-multiselect:not(.p-disabled).p-focus {
  outline: none !important;
  border: 0.5px solid #4c5dff !important;
}

</style>
