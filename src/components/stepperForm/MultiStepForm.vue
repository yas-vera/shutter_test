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
  <div v-show="!isMinus" class="draggable" :style="{ top: posY + 'px', left: posX + 'px' }" >
    <div class="stepperContent modal-border" :style="{ width: `${screenStore.screenWidth > 1150 ? (isMaximise? PERCENT_100 :PERCENT_50): PERCENT_100 }`, height: (isMaximise ? `calc(100vh - 64px)` : `calc(100vh - 204px)`)}" ref="formRef">
      <div class="headerStepper">
        <div class="headerContent">
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
        <div style="display: flex; gap: 10px; justify-content: space-between; align-items: center;">
          <slot name="buttonsHeader"></slot>
        </div>
        <qtm-divider  />
        <div class="stepperNumber custom-overflow">
          <template v-for="(stepper, index) in props.ObjectStepper" :v-key="stepper.id">
            <div :class="(quantitySteps !== (index + 1))?'stepperNumberContent':'stepperNumberContentEnd'" @click="stepGo(index)" >
              <qtm-button
                :variant="currentStep == index ? 'filled' : 'outline'"
                :color="currentStep == index ? 'primary' : 'neutral'"
                size="small" classes="rounded-full"
                :props="{
                  id: 'buttonStep_' + (index + 1)
                }"
                v-if="currentStep <= index"
                >
                
                <qtm-typography :font-size="7" font-weight="normal" font-family="roboto">{{ index + 1 }}</qtm-typography>
              </qtm-button>
              <qtm-button :props="{
                  id: 'buttonStep_' + (index + 1)
                }"
                v-else variant="filled"
                :color="stepValidate(index)?'success':'danger'"
                size="small"
                classes="rounded-full">
                <qtm-icon :icon="stepValidate(index)?'done':'priority_high'"  ></qtm-icon>
              </qtm-button>
              <qtm-typography classes="font-step-custom" style="text-wrap: nowrap;">{{ stepper.title
                }} </qtm-typography>
              <qtm-divider v-if="quantitySteps !== (index + 1)"  style="margin-right: 7px;" />
            </div>
          </template>
        </div>
        <qtm-divider  />
      </div>
      <div class="bodyStepper "  >
        <template v-for="(stepContent, indexContent) in props.ObjectStepper">
          <div v-if="indexContent === currentStep" class="stepContent" :style="{ marginLeft :  leftBodyStep ? leftBodyStep : '' }" :class="stepContent.extraClass">
            <div style="margin-left: 20px; margin-right: 10px;">
              <slot :name="'step' + (indexContent + 1)" :stepContent="stepContent" :formData="formData"></slot>
            </div>
            <template v-if="stepContent.allOneColumn">
              <template v-for="fields in stepContent.fields">
                <qtm-grid :medium=2 :xsmall="1">
                  <div class="marginTopInputStepForm" v-if="fields.type === 'select'">
                    <QtmTypography classes="font-title-custom-3">{{ fields.title }} </QtmTypography>
                    <qtm-form-label component="body-1" :required="fields.required"><span>{{ fields.label
                        }}</span></qtm-form-label>
                    <qtm-dropdown-select
                      :class="fields.extraClass"
                      size="large"
                      :input-id="`select_${fields.name}`"
                      @value-changed="(event: any) => formData[fields.name] = event.detail.valueChanged"
                      :value="formData[fields.name]"
                      :disabled="fields.disabled"
                      >
                      <template v-for="(optionsSelect, index) in fields.options" :key="index">
                        <qtm-dropdown-select-option :value="optionsSelect.value">
                          {{ optionsSelect.label }}
                        </qtm-dropdown-select-option>
                      </template>
                    </qtm-dropdown-select>
                  </div>
                  <div class="marginTopInputStepForm " v-if="fields.type === 'text'">
                    
                    <QtmTypography classes="font-title-custom">{{ fields.title }} </QtmTypography>
                    <QtmFormLabel component="body-1" :required="fields.required"><span class="input-text-margin">{{ fields.label }}</span>
                    </QtmFormLabel>
                    <qtm-text-input :input-id="`select_${fields.name}`" class="" size="large" :right-icon="fields.rightIcon" :left-icon="fields.leftIcon"
                    :placeholder="fields.placeholder" @value-changed="(event: any) => formData[fields.name] = event.detail"
                      :value="formData[fields.name]"></qtm-text-input>
                  </div>
                  <div class="marginTopInputStepForm" v-if="fields.type === 'textArea'">
                    <QtmTypography classes="font-title-custom-3">{{ fields.title }} </QtmTypography>
                    <QtmFormLabel component="body-1" :required="fields.required"><span class="input-text-margin">{{ fields.label }}</span>
                    </QtmFormLabel>

                    <TextAreaCustom
                      :class="fields.extraClass"
                      :input-id="`select_${fields.name}`"
                      size="large"
                      :placeholder="fields.placeholder"
                      v-model="formData[fields.name]"
                      :disabled="fields.disabled"
                      :max-heigth="maxHeightArea"
                    />
                    <!-- <QtmTextarea :class="fields.extraClass" :input-id="`select_${fields.name}`" size="large" :placeholder="fields.placeholder"  resize :props="{ 'rows': '6' }"
                      @value-changed="(event: any) => formData[fields.name] = event.detail" :disabled="fields.disabled"
                      :value="formData[fields.name]" /> -->
                  </div>
                  <div  v-if="fields.type === 'dateFromTo'">
                    <div>

                    <div>
                      <!-- <QtmTypography classes="font-title-custom">{{ fields.title }} </QtmTypography> -->
                      <QtmTypography classes="font-title-custom-3">{{ fields.title }} </QtmTypography>
                    </div>
                    <div class="twoInputGroup">
                      <div class="twoInputGrup-inner" v-for="item in fields.dateOptions">
                        <QtmFormLabel component="body-1" :required="item.required"><span>{{ item.label }}</span>
                        </QtmFormLabel>
                        <DatePickerInput :extra-class="item.extraClass" :value="formData[item.valueForm]" :name="item.valueForm"
                          @update:model-value="(value) => updateDateValue(item.valueForm, value, item.dateOptions.find((x:any) => x.label === 'From').valueForm, item.dateOptions.find((x:any) => x.label === 'To').valueForm)" />
                      </div>
                    </div>
                  </div>
                  </div>
                  <div :class="`marginTopInputStepForm ${fields.containerClass ? fields.containerClass : ''}`" v-if="fields.type === 'twoColumn'">
                    <div style="width: max-content;">
                      <!-- <QtmTypography classes="font-title-custom">{{ fields.title }} </QtmTypography> -->
                      <QtmTypography classes="font-title-custom">{{ fields.title }} </QtmTypography>
                    </div>
                    <div class="twoInputGroupMultiStep twoInputGroupMultiStep-column">
                      <div :class="`twoInputGrup-inner ${item.containerSelectClass ? item.containerSelectClass : ''}`" v-for="item in fields.fields">
                          <QtmFormLabel component="body-1" :required="item.required && item.label"><span>{{ item.label }}</span>
                          </QtmFormLabel>
                          <qtm-text-input :input-id="`select_${item.name}`" v-if="item.type === 'text'" size="large" :right-icon="item.rightIcon"
                            :left-icon="item.leftIcon" :placeholder="item.placeholder"
                            @value-changed="(event: any) => formData[item.name] = event.detail"
                            :value="formData[item.name]"
                            :disabled="item.disabled"
                            :class="item.extraClass"></qtm-text-input>
                          <qtm-dropdown-select
                            v-if="item.type === 'select'"
                            size="large"
                            :class="item.extraClass"
                            :disabled="item.disabled"
                            :required="fields.required"
                            :input-id="`select_${item.name}`"
                            :placeholder="item.placeholder"
                            @value-changed="(event: any) => formData[item.name] = event.detail.valueChanged"
                            :value="formData[item.name]">

                            <div v-if="item.getData">
                              <template v-for="(optionsSelect, index) in getDataSelect(item.name)" :key="index">                          
                                <qtm-dropdown-select-option :value="optionsSelect.id">
                                  {{ optionsSelect.id }}
                                </qtm-dropdown-select-option>
                              </template>
                            </div>
                            <div v-else>
                              <template v-for="(optionsSelect, index) in item.options" :key="index">                          
                                <qtm-dropdown-select-option :value="optionsSelect.value">
                                  {{ optionsSelect.label }}
                                </qtm-dropdown-select-option>
                              </template>
                            </div>

                          </qtm-dropdown-select>



                          <div  v-if="item.type === 'multi-select'">
                                 
                                    <div>
                                        <MultiSelectCustom :modelValue="formData[item.name]" :disabled="item.disabled"
                                            :options="getDataSelectOP(item.name)" :resetAll="resetAll"
                                            :resetKey="resetKeys[item.name]"
                                            @update:modelValue="value => formData[item.name] = value" />
                                    </div>

                                </div>



                        <div  v-if="item.type === 'dateFromTo'">
                          <div >
                            <QtmFormLabel classes="font-title-custom-only-font" :required="item.required"><span v-html="item.title"></span> </QtmFormLabel>
                            <div class="twoInputGroupMultiStep">
                              <div class="twoInputGrup-inner container-select-type-mode" v-for="itemChildren in item.dateOptions" >
                                
                                <QtmFormLabel component="body-1" :required="itemChildren.required"><span>{{itemChildren.label }}  </span>
                                </QtmFormLabel>
                                <DatePickerInput
                                  :extra-class="itemChildren.extraClass"
                                  :value="formData[itemChildren.valueForm]"
                                  :min-date="itemChildren.minDate && minValueValidityEndTime(itemChildren.valueForm)"
                                  :disabled="itemChildren.disabled"
                                  :required="itemChildren.required"
                                  :name="itemChildren.valueForm"
                                  :hour="true"
                                  @update:model-value="(value) => updateDateValue(itemChildren.valueForm, value, item.dateOptions.find((x:any) => x.label === 'From').valueForm, item.dateOptions.find((x:any) => x.label === 'To').valueForm)"
                                  
                                  />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </qtm-grid>
              </template>
            </template>
            <template v-else>
              <qtm-grid :small="stepContent.numberColumn" :xsmall="1">
                <template v-for="fields in stepContent.fields">
 
                  <div class="marginTopInputStepForm" v-if="fields.type === 'select'" >
                    <QtmTypography classes="font-title-custom-3">{{ fields.title }} </QtmTypography>
                    <qtm-form-label component="body-1" :required="fields.required"><span>{{ fields.label
                        }}</span></qtm-form-label>
                    <qtm-dropdown-select
                      :disabled="fields.disabled"
                      :required="fields.required" size="large"
                      @value-changed="(event: any) => formData[fields.name] = event.detail.valueChanged"
                      :input-id="`select_${fields.name}`"
                      :value="formData[fields.name]">
                      <template v-for="(optionsSelect, index) in fields.options" :key="index">
                        <qtm-dropdown-select-option :value="optionsSelect.value">
                          {{ optionsSelect.label }}
                        </qtm-dropdown-select-option>
                      </template>
                    </qtm-dropdown-select>
                  </div>
                  <div class="marginTopInputStepForm" v-if="fields.type === 'text'">
                    <QtmTypography classes="font-title-custom">{{ fields.title }} </QtmTypography>
                    <QtmFormLabel component="body-1" :required="fields.required"><span>{{ fields.label }}</span>
                    </QtmFormLabel>
                    <qtm-text-input :input-id="`select_${fields.name}`" size="large" :right-icon="fields.rightIcon" :left-icon="fields.leftIcon"
                    :placeholder="fields.placeholder" @value-changed="(event: any) => formData[fields.name] = event.detail"
                      :value="formData[fields.name]"></qtm-text-input>
                  </div>
                  <div class="marginTopInputStepForm" v-if="fields.type === 'textArea'">
                    <QtmTypography classes="font-title-custom-3">{{ fields.title }} </QtmTypography>
                    <QtmFormLabel component="body-1" :required="fields.required"><span>{{ fields.label }}</span>
                    </QtmFormLabel>
                    <QtmTextarea :input-id="`select_${fields.name}`" size="large" :placeholder="fields.placeholder" :props="{ 'rows': '6' }"
                      @value-changed="(event: any) => formData[fields.name] = event.detail" :disabled="fields.disabled"
                      :value="formData[fields.name]" />
                  </div>
                  <div class="" v-if="fields.type === 'dateFromTo'">
                    <div>
                      <QtmTypography classes="font-title-custom-only-font">{{ fields.title }} </QtmTypography>
                    </div>
                    <div class="twoInputGroup">
                      <div class="twoInputGrup-inner" v-for="item in fields.dateOptions">
                        <QtmFormLabel component="body-1" :required="item.required"><span>{{ item.label }} </span>
                        </QtmFormLabel>
                        <DatePickerInput :extra-class="item.extraClass" :value="formData[item.valueForm]" :name="item.valueForm"
                          @update:model-value="(value) => updateDateValue(item.valueForm, value, item.dateOptions.find((x:any) => x.label === 'From').valueForm, item.dateOptions.find((x:any) => x.label === 'To').valueForm)" />
                      </div>
                    </div>
                  </div>
                  <div class="" v-if="fields.type === 'twoColumn'">
                    <div>
                      <QtmTypography classes="font-title-custom">{{ fields.title }} </QtmTypography>
                    </div>
                    <div class="twoInputGroup">
                      <div class="twoInputGrup-inner" v-for="item in fields.fields">
                        <div>
                          <QtmFormLabel component="body-1" :required="item.required"><span>{{ item.label }} </span>
                          </QtmFormLabel>
                        </div>
                        <div>
                          <qtm-text-input :input-id="`select_${item.name}`" v-if="item.type === 'text'" size="large" :right-icon="item.rightIcon"
                            :classes="'input_placeholder'"
                            :left-icon="item.leftIcon" :placeholder="item.placeholder"
                            :disabled="item.disabled"
                            @value-changed="(event: any) => formData[item.name] = event.detail"
                            :value="formData[item.name]"></qtm-text-input>
                          <qtm-dropdown-select
                            v-if="item.type === 'select'" size="large"
                            @value-changed="(event: any) => formData[item.name] = event.detail.valueChanged"
                            :input-id="`select_${item.name}`"
                            :disabled="item.disabled"
                            
                            :value="formData[item.name]">
                            <template v-for="(optionsSelect, index) in item.options" :key="index">
                              <qtm-dropdown-select-option :value="optionsSelect.value">
                                {{ optionsSelect.label }}
                              </qtm-dropdown-select-option>
                            </template>
                          </qtm-dropdown-select>
                          <div class="" v-if="item.type === 'dateFromTo'">
                            <div>
                              <!-- <QtmFormLabel component="body-1" :required="item.required" classes="font-bold">{{item.title }}
                              </QtmFormLabel> -->
                              <QtmTypography classes="font-title-custom-only-font">{{ item.title }}</QtmTypography>
                            </div>
                            <div class="twoInputGroup">
                              <div class="twoInputGrup-inner" v-for="itemChildren in item.dateOptions">
                                <QtmFormLabel component="body-1" :required="itemChildren.required"><span>{{itemChildren.label }} </span>
                                </QtmFormLabel>
                                <DatePickerInput
                                  :extra-class="itemChildren.extraClass"
                                  :name="itemChildren.valueForm"
                                  :value="formData[itemChildren.valueForm]"
                                  :hour="true"
                                  :min-date="itemChildren.label === 'To' && formData[item.dateOptions.find((x:any) => x.label === 'From').valueForm]"
                                  @update:model-value="(value) => updateDateValue(itemChildren.valueForm, value, item.dateOptions.find((x:any) => x.label === 'From').valueForm, item.dateOptions.find((x:any) => x.label === 'To').valueForm)"
                                  />
                              </div>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </template>
              </qtm-grid>
            </template>
          </div>
        </template>

      </div>

      <div class="footerStepper">
        <qtm-button variant="outline" classes="input-width-option-multiStep" lor="primary" size="medium" type="submit"
          @click-event="prevStep" v-if="currentStep !== 0">
          Previous
        </qtm-button>

        <qtm-button v-if="quantitySteps === currentStep + 1" variant="filled" color="primary" classes="input-width-option-multiStep"
          size="medium" type="submit" :disabled="((props.disableSend && !props.initialFormData) || validateSendForm() )" @click-event="submitForm">
          Save
        </qtm-button>
        <qtm-button v-else variant="filled" color="primary" size="medium" type="submit" classes="input-width-option-multiStep"
          :disabled="!areRequiredFieldsFilled" @click-event="nextStep">
          Next
        </qtm-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, watchEffect, onUpdated, nextTick, onUnmounted } from 'vue';
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
import './MultiStepForm.css'
import DatePickerInput from '../datePicker/DatePickerInput.vue';
import { draggingHelper } from '@/helpers/dragging';
import { convertTextTruncate } from '../../helpers/convertDateTime';
import { useModalSelectedStore } from '../../stores/modalSelectedStore';
import { useScreenStore } from '@/stores/screenStore';
import { usePopupAlertStore } from '@/stores/popupAlertStore';
import { useRulesStore } from '@/stores/rulesStore';
import TextAreaCustom from '@/components/input/TextAreaCustom.vue';
import useRules from '@/modules/rules/hooks/useRules';
import { useSatDataStore } from '@/stores/satDataStore';
import { PERCENT_93_5, VH_79, VH_82,PERCENT_100,PERCENT_64, PERCENT_50, VH_CALC_300 } from '@/constants/constants';
import { usePosition } from '@/helpers/positionMinHelper';
import { capitalizeRowsLetter } from '@/helpers/tableHelpers';
import MultiSelectCustom from "../input/MultiSelectCustom.vue";
const props = defineProps<{
  ObjectStepper: any[]
  Title: string,
  contentWidth?: string
  showStepForm?: boolean,
  nameProp: string,
  indexPosition?: number
  initialFormData?: any,
  disableSend?: boolean,
  leftBodyStep?: string,
}>();
const emits = defineEmits<{
  (e: 'submitAction', values: any): void
  (e: 'submitEditAction',values:any): void
  (e: 'closeForm',values:any): void
  (e: 'numberStep', currentStep: number): void
  (e: 'maximiseForm'): void
  (e: 'closeMaximiseForm',values:any): void
  (e: 'isFullSc',value:boolean): void
}>();
const { posX, posY, dragStart, maximise } = draggingHelper()
const quantitySteps = ref<number>(0)
const requiredInput = ref<"error" | "warning" | "success" | undefined>()
const currentStep = ref(0);
const formValidValidAlertForm = ref<any>([]); 
const namePropMinus = ref(''); 
const modalSelected = useModalSelectedStore();
const screenStore = useScreenStore();
const popupAlertStore = usePopupAlertStore();
const {formData,isEditRule,initialData} = useRulesStore();
const satDataStore = useSatDataStore();
const currentDate = new Date();

const formRef = ref(null);

const maxHeightArea = ref<string>('170px')

const heightLimitsArea:any = {
  750: '240px',
  830: '330px',
  930: '420px',
  1000: '480px',
  1100: '580px',
  1500: '780px',
};
const resetAll = ref(0);
const resetKeys = ref<any>({});

const areRequiredFieldsFilled = computed(() => {
  if(currentStep.value === 3) return true
  if(props.disableSend && currentStep.value === 4 && !props.initialFormData){
    return !props.disableSend
  }
  const value: boolean = watchFormData()
  return value
});

const watchFormData = () : boolean => {
  const currentFields = props.ObjectStepper[currentStep.value].fields;
  const requiredFields = currentFields.filter((field: any) => field.required);
  const currentFieldsChildren = currentFields
  .filter((field: any) => 
    ('fields' in field && field.fields.some((childField: any) => childField.required)) ||
    ('fields' in field && field.fields.some((childField: any) => 
      'dateOptions' in childField && childField.dateOptions.some((option: any) => option.required))
    )
  )
  .flatMap((field: any) => [
    ...field.fields.filter((childField: any) => childField.required),
    ...field.fields.flatMap((childField: any) =>
      childField.dateOptions ? childField.dateOptions.filter((option: any) => option.required) : []
    )
  ]);

  const allRequiredFieldsFilled = requiredFields.every(
    (field: any) => formData[field.name]
  );

  const allRequiredChildrenFieldsFilled = currentFieldsChildren.every(
    (field: any) => {
      if(Array.isArray(formData[field.name])) {
        return formData[field.name].length > 0
      }else {
        return formData[field.name]
      }
    }
  );

  return allRequiredFieldsFilled && allRequiredChildrenFieldsFilled;
}

const stepValidate = (step:number) =>{
  //if(step === 3) return true
  
  if(props.disableSend && step === 4 && !props.initialFormData){
    return !props.disableSend
  }
  const currentFields = props.ObjectStepper[step].fields;
  const requiredFields = currentFields.filter((field: any) => field.required);
  // const currentFieldsChildren = currentFields
  //   .filter((field: any) => 'fields' in field && field.fields.some((childField: any) => childField.required))
  //   .flatMap((field: any) => field.fields);
  const currentFieldsChildren = currentFields
    .filter((field: any) => 'fields' in field && field.fields.some((childField: any) => childField.required))
    .flatMap((field: any) => field.fields.filter((childField: any) => childField.required)); 
  const allRequiredFieldsFilled = requiredFields.every(
    (field: any) => formData[field.name]
  );
  const allRequiredChildrenFieldsFilled = currentFieldsChildren.every(
    (field: any) => {
        const value = formData[field.name];
        return Array.isArray(value) ? value.length > 0 : value && value.trim() !== "";
      }
  );
  const isValidAlertFormIntervals = handleValidAlertFormIntervals(currentFields);
  // if(isValidAlertFormIntervals){
  //   return false
  // }
  //return allRequiredFieldsFilled && allRequiredChildrenFieldsFilled;
  const isStepValid = allRequiredFieldsFilled && (allRequiredChildrenFieldsFilled && !isValidAlertFormIntervals);
  return isStepValid;
}
const nextStep = () => {
  const currentFields = props.ObjectStepper[currentStep.value].fields;
  const requiredFields = currentFields.filter((field: any) => field.required);

  const isValidAlertFormIntervals = handleValidAlertFormIntervals(currentFields);

  if(isValidAlertFormIntervals){
    popupAlertStore.showPopupAlert('Warning', 'Please input a valid Sensing and Validity time to proceed.')
    return
  }

  const valid = validOptionsAlert()
  

  if(!valid) return


  // const currentFieldsChildren = currentFields
  //   .filter((field: any) => 'fields' in field && field.fields.some((childField: any) => childField.required))
  //   .flatMap((field: any) => field.fields);
    const currentFieldsChildren = currentFields
    .filter((field: any) => 'fields' in field && field.fields.some((childField: any) => childField.required))
    .flatMap((field: any) => field.fields.filter((childField: any) => childField.required)); 

  const allRequiredFieldsFilled = requiredFields.every(
    (field: any) => formData[field.name]
  );

  const allRequiredChildrenFieldsFilled = currentFieldsChildren.every(
    (field: any) => formData[field.name]
  );

  if (allRequiredFieldsFilled && allRequiredChildrenFieldsFilled) {
    if (currentStep.value < quantitySteps.value) {
      currentStep.value++;
    }
  } else {
    if(currentStep.value === 3){
      currentStep.value++;
    }
    console.log("¡Please complete all required fields!");
  }
};
const handleValidAlertForm = (currentFields: any) => {
    const valid = currentFields.flatMap((field: any) => {
        if (field.fields) {
            const dateOptions = field.fields.flatMap((option: any) => option.dateOptions || []);
            return dateOptions.filter((dateOption: any) => dateOption.isValidAlertForm == true);
        }
        return [];
    });
    return valid;
};

const handleObjectValidAlertFormIntervals = (currentFields:any) => {
    const valid = currentFields.reduce((acc:any, field:any) => {
        if (field.fields) {
            const dateOptions = field.fields.filter((option:any) => option.dateOptions);
            dateOptions.forEach((option:any) => {
                const validAlertForms = option.dateOptions.filter((dateOption:any) => dateOption.isValidAlertIntervalForm);
                validAlertForms && acc.push(...validAlertForms);
            });
        }
        return acc;
    }, []);
    return valid;
}

const handleValidAlertFormIntervals = (currentFields:any) => {

  const valid = currentFields.reduce((acc:any, field:any) => {
      if (field.fields) {
          const dateOptions = field.fields.filter((option:any) => option.dateOptions);
          dateOptions.forEach((option:any) => {
              const validAlertForms = option.dateOptions.filter((dateOption:any) => dateOption.isValidAlertIntervalForm);
              validAlertForms && acc.push(...validAlertForms);
          });
      }
      return acc;
  }, []);


  if(valid.length > 0){
    let groupValidity = valid.filter( (x:any )=> x.intervalGroup !== 'validity');
    let groupSensing = valid.filter( (x:any )=> x.intervalGroup !== 'sensing');

    let resultValidity = hasZeroInterval(groupValidity)
    let resultSensing = hasZeroInterval(groupSensing)

    if((resultValidity || resultSensing) ){
      return true;
    }
  }

  return false;
}

const hasZeroInterval = (intervalGroup:any) => {
    const startInterval = intervalGroup.find((option:any) => option.intervalOption === 'start');
    const endInterval = intervalGroup.find((option:any) => option.intervalOption === 'end');
    if (!startInterval || !endInterval || 
        formData[startInterval.valueForm] === null || formData[startInterval.valueForm] === '' || 
        formData[endInterval.valueForm] === null || formData[endInterval.valueForm] === ''
    ) {
        return true;  
    }
    const startTime = new Date(formData[startInterval.valueForm]);
    const endTime = new Date(formData[endInterval.valueForm]);
    startTime.setSeconds(0, 0);
    endTime.setSeconds(0, 0);
    if (startTime.getTime() === endTime.getTime()) {
        return true;
    }
    return false;
};
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};
const stepGo = (numberStep:number) => {
  //const value = stepValidate(numberStep)
 // if(value){
    currentStep.value = numberStep;
  //}
};
const validateSendForm = () => {
  for (let index = 0; index < quantitySteps.value; index++) {
    if (!stepValidate(index)) {
      return true; 
    }
  }
  return false; 
}
const submitForm = () => {
  if(props.initialFormData !== undefined && props.initialFormData !== null){
    emits('submitEditAction', formData);
  }else{
    emits('submitAction', formData);
  
  }
 // emits('submitAction', formData);
  //clearValuesFormData()
};
const submitEditForm = () => {
 
  //clearValuesFormData()
};
const clearValuesFormData = () => {
  for (let index = 0; index < formData.length; index++) {
    formData[index] = ''
  }
}
const closeForm = () => {
  //heightMaximise.value = '78vh';
  //minusForm();
  emits('closeForm',formData);
  emits('closeMaximiseForm',formData);
}
const minusForm = () => {
  isMinus.value = !isMinus.value;
}

const getDataSelect = (option:string) => {
  const data = {
    mission_id: satDataStore.missionData,
    satellite_id: satDataStore.satelliteData,
    sensor_type_id: satDataStore.sensorTypeData,
    acquisition_mode_id: satDataStore.acquisitionModeData
  }[option];
  return Array.isArray(data) ? data.sort((a, b) => a.id.localeCompare(b.id)) : [];
}




const getDataSelectOP = (field: string) => {
  if (field == 'satellite_id') {
        let data = satDataStore.satelliteData
        return data?.map((item) => {
            return {
                label: item.id,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }

    if (field == 'sensor_type_id') {
        let data = satDataStore.sensorTypeData
        return data?.map((item) => {
            return {
                label: item.id,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
 
    if (field == 'mission_id') {
        let data = satDataStore.missionData
        return data?.map((item) => {
            return {
                label: item.id,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    if (field == 'acquisition_mode_id') {
        let data = satDataStore.acquisitionModeData
        return data?.map((item) => {
            return {
                label: item.id,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    return []
}


onMounted(async() => {
  quantitySteps.value = props.ObjectStepper.length;
  namePropMinus.value = convertTextTruncate(14, props.nameProp)

  for (const step of props.ObjectStepper) {
    for (const field of step.fields) {

      if (field.name !== '' && field.name !== undefined) {
        if (field.value !== undefined) {
          formData[field.name] = field.value;
        } 
        // else {
        //   formData[field.name] = '';
        // }
      }
      if (field.type === 'dateFromTo' && 'dateOptions' in field) {
        if (field.dateOptions) {
          for (const fieldChildren of field.dateOptions) {
            if (fieldChildren.valueForm && formData[fieldChildren.valueForm] !== undefined) {
              formData[fieldChildren.valueForm] = fieldChildren.value;
            } else {
              formData[fieldChildren.valueForm] = currentDate;
            }
          }
        }
      }
      if (field.type === 'twoColumn' && 'fields' in field) {
        if (field.fields) {
          for (const fieldChildren of field.fields) {
            if((fieldChildren.type == 'select' || fieldChildren.type == 'multi-select') && fieldChildren.getData){
              switch (fieldChildren.name) {
                case 'mission_id':
                  const resultMission = await satDataStore.getSatData('mission')
                  if(resultMission === true)  closeForm()
                  break;
                case 'satellite_id':
                  const resultSat = await satDataStore.getSatData('satellite')
                  if(resultSat === true)  closeForm()
                  break;
                case 'sensor_type_id':
                  const resultSensor = await satDataStore.getSatData('sensor_type')
                  if(resultSensor === true)  closeForm()
                  break;
                case 'acq_modes':
                const resultAcqMode = await satDataStore.getSatData('acquisition_mode')
                  if(resultAcqMode === true)  closeForm()
                  break;      
                default:
                  break;
              }
            }
            if (fieldChildren.type === 'dateFromTo' && 'dateOptions' in fieldChildren) {
              if (fieldChildren.dateOptions) {
                for (const fieldDateOption of fieldChildren.dateOptions) {
                  if (fieldDateOption.valueForm && formData[fieldDateOption.valueForm] !== undefined) {
                    formData[fieldDateOption.valueForm] = fieldDateOption.value;
                  } else {
                    // fix default dates
                    // if(
                    //   fieldDateOption.valueForm !== 'validity_end_time' && 
                    //   fieldDateOption.valueForm !== 'sensing_end_time'
                    // ){ 
                    //   formData[fieldDateOption.valueForm] = currentDate;
                    // }

                    formData[fieldDateOption.valueForm] = currentDate;
                  }
                }
              }
            }
            if (fieldChildren.valueForm  && formData[fieldChildren.valueForm] !== undefined) {
              
              formData[fieldChildren.valueForm] = fieldChildren.value;
            }
            // else {
            //   formData[fieldChildren.valueForm] = '';
            // }
          }
        }
      }
    }
  }
  if (props.initialFormData) {
    if (props.initialFormData.acq_modes && props.initialFormData.acq_modes.length > 0) {
      props.initialFormData.acquisition_mode_id = props.initialFormData.acq_modes.map((aq: any) => aq.id);
    }

    if (props.initialFormData.missions && props.initialFormData.missions.length > 0) {
      props.initialFormData.mission_id = props.initialFormData.missions.map((mission: any) => mission.id);
    }

    if (props.initialFormData.sensors && props.initialFormData.sensors.length > 0) {
      props.initialFormData.sensor_type_id = props.initialFormData.sensors.map((sensor: any) => sensor.id);
    }

    if (props.initialFormData.satellites && props.initialFormData.satellites.length > 0) {
      props.initialFormData.satellite_id = props.initialFormData.satellites.map((satellite: any) => satellite.id);
    }

    Object.assign(formData, props.initialFormData);
  }

});



function emitNumberStep(currentStepValue: number) {
  emits('numberStep', currentStepValue);
  
}
const isFullScreen = ref(false);
const heightMaximise = ref(VH_79);
const valueHeightActuality = computed(() => screenStore.dimanicScreenHeight(0));
const screenHeight = computed(() => window.screen.height);
const isMaximise = ref(false);
const isMinus = ref(false);
const positionX = ref<number>(0);
const positionY = ref<number>(0);
const rulesStore = useRulesStore();
// const leftSize = ref<string>('0 px');
  const { leftSize, updateLeftPosition } = usePosition('rules_create');
watch(() => rulesStore.minimizeItems, (newValue, oldValue) => {
  
  getLeftPosition()
});

watch(isMinus, (newValue, oldValue) => {
    
    if(newValue) {
      rulesStore.addMinimizeItem('rules_create');
      getLeftPosition()
    }else {
      getLeftPosition()
    }
});

const maximiseForm = () => {
  if (heightMaximise.value == PERCENT_93_5) {
    heightMaximise.value = isFullScreen.value ? VH_82 : VH_79;
  } else {
    heightMaximise.value = PERCENT_93_5;
  }
}
const updateFullScreenStatus = () => {
  const tolerance = 5;
    if (Math.abs( screenHeight.value -  window.innerHeight) <= tolerance) {
      isFullScreen.value = true;
      heightMaximise.value = VH_82;
      maximise(0,164)
    } else {
      isFullScreen.value = false;
      heightMaximise.value = VH_79;
      maximise(0,164)
    }
    
    };
    watch(screenHeight, (newValue) => {
      if(isFullScreen.value){
        heightMaximise.value = VH_82;
      }else{
        heightMaximise.value = VH_79;
      
      }
    });
onMounted(() => {
      updateFullScreenStatus();
      
    });

watch(currentStep, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    emitNumberStep(newValue);
  }
  
});

watch(heightMaximise, (newValue, oldValue) => {
  
  isMaximise.value = newValue === PERCENT_93_5 ? true : false;
  if (isMaximise.value) {
    positionX.value = posX.value;
    positionY.value = posY.value;
    emits('maximiseForm');
    
    maximise()
  } else {
    
    emits('maximiseForm');
    if(isFullScreen.value){
      positionY.value = 164;
    }
    maximise(positionX.value, positionY.value)
  }
});

const minValueValidityEndTime = (name:string) => {
  if(isEditRule){
    if(initialData){
        if(name = 'validity_end_time'){
          let data:any = initialData;
          return new Date(data.validity_end_time);
        }
    }
  }
  let date = new Date();
  return date
}

const updateDateValue = (field:string, value:string | Date, fromField: string, toField: string) => {
  if(!value) {
    formData[field] = null;
    return
  }
  formData[field] = value;
  if (field === fromField) {
    const startDate = new Date(value);
    const endDate = new Date(formData[toField]);

    if (startDate > endDate) {
      formData[toField] = value;
    }
  }
}

function validOptionsAlert() {

  let state = [];

  if(formData['validity_start_time'] && formData['validity_end_time'] && currentStep.value == 3){
    let date1 = new Date(formData['validity_start_time'])
    let date2 = new Date(formData['validity_end_time'])

    let res1 = date1.getTime() == currentDate.getTime();
    let res2 = date2.getTime() == currentDate.getTime();

    date1.setSeconds(0, 0);
    date2.setSeconds(0, 0);

    if( (res1 && res2) || ( date1.getTime() >= date2.getTime() ) ){
      state.push('invalid_validity_time')
    }
  }

  if(formData['sensing_start_time'] && formData['sensing_end_time'] && currentStep.value == 3){
    let date1 = new Date(formData['sensing_start_time'])
    let date2 = new Date(formData['sensing_end_time'])

    let res1 = date1.getTime() == currentDate.getTime();
    let res2 = date2.getTime() == currentDate.getTime();

    date2.setSeconds(0, 0);
    date2.setSeconds(0, 0);

    if( (res1 && res2) || ( date1.getTime() >= date2.getTime() ) ){
      state.push('invalid_sensing_time')
    }
  }

  if(state.includes('invalid_sensing_time') && state.includes('invalid_validity_time')){
    state.push('invalid_times')
  }

  if(state.length > 0) {
    let messageWarning = '';

    if(state.includes('invalid_times')) {
      messageWarning = 'Please input a valid Sensing and Validity time to proceed.'
    } else if(state.includes('invalid_sensing_time')) {
      messageWarning = 'Please input a valid Sensing time to proceed.'
    } else if(state.includes('invalid_validity_time')) {
      messageWarning = 'Please input a valid Validity time to proceed.'
    }

    popupAlertStore.showPopupAlert('Warning', messageWarning);
  }

  return (state.length === 0)

}

const getLeftPosition = () => {
  updateLeftPosition()

};

const calculateMaxHeightArea = (height:number) => {
  let heightValue = '170px';
  for (const limit in heightLimitsArea) {
    if (height > parseInt(limit)) {
      heightValue = heightLimitsArea[limit];
    } else {
      break;
    }
  }
  maxHeightArea.value = heightValue;
};

onUpdated(async () => {
  await nextTick();
  const formElement:any = formRef.value;
  if (formElement) {
    const height = formElement.offsetHeight;
    calculateMaxHeightArea(height)
  }
  capitalizeRowsLetter()
})

</script>

<style scoped>
.input-text-margin {
  margin-top: 30px !important;
}

.input-width {
  width: 100px !important;
}

.margin-right {
  margin-right: 10px !important;
}

.input_placeholder input::placeholder{
  color: blue !important;
  background-color: brown !important;
}

#select_rule_name::placeholder{
  color: red  !important;
  background-color: red !important;
}

</style>