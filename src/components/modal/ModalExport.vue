<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { 
    QtmButton,
    QtmCheckbox,
    QtmDivider,
    QtmIcon,
    QtmTypography,
    QtmTextInput,
    QtmFormLabel,
    QtmDropdownSelect,
    QtmDropdownSelectOption,
    QtmHeader
} from '@qtm/vue';
import { computed } from 'vue';
const emits = defineEmits(['close', 'export']);
const props = defineProps<{
    show: boolean;
    shpHidden?: boolean;
    xmlHidden?: boolean;
    csvHidden?: boolean;
    pdfCompressedHidden?: boolean;
    labelPdf?:string
    visibleRequired?:boolean
}>();
const selectedFormats = ref<string[]>([]);
const titleDoc = ref<string>('');
const ClassificationLevel = ref<string>('UNCLASSIFIED');
const close = () => {
    resetValuesDefault()
    emits('close');
};
const exportData = () => {
    emits('export', selectedFormats.value,titleDoc.value,ClassificationLevel.value);
    selectedFormats.value = [];
    close();
};

const handleCheckboxChange = (format:string) => {
    if (selectedFormats.value.includes(format)) {
        selectedFormats.value = selectedFormats.value.filter((f) => f !== format);
    } else {
        selectedFormats.value.push(format);
    }
};
const resetValuesDefault = () => {
    selectedFormats.value= []
    titleDoc.value = ''
    ClassificationLevel.value = 'UNCLASSIFIED'
}

const isPdf = computed(() => selectedFormats.value.find( x => x == 'pdf' || x == 'pdfC') ? true : false);

const verifyInputs = () => {
    
    if(selectedFormats.value.length > 0){
        if(isPdf.value){
            if(selectedFormats.value.length === 0 || titleDoc.value === '' || ClassificationLevel.value === ''){
                return true
            }
            return false
        }else{
            return false
        }
    }else{
        return true
    }
}
</script>

<template>
    <div class="modal" v-if="props.show">
        <div class="modal-content">
            <div class="modal-header">
                <div style="display: flex;gap: 5px; ">
                    <QtmIcon icon="download" size="medium" />
                <qtm-typography component="body-1"  style="color: white;">Export settings</qtm-typography>
                </div>
                <QtmIcon icon="close" style="cursor: pointer;" size="medium" @click="close()"/>
            </div>
            <div class="modal-body">
                <div style="margin-top: 10px;">
                    <qtm-form-label  :required="isPdf || visibleRequired"><span>Document title</span></qtm-form-label>
                <QtmTextInput
                    :value="titleDoc"
                    @value-changed="(event:any) => titleDoc = event.detail "
                    placeholder="Title"
                    size="large"
                    @click.stop>
                  </QtmTextInput>
                </div>
                <div style="margin-top: 25px;">
                  <qtm-form-label style="margin-top: 10px;" :required="isPdf || visibleRequired" ><span>Classification level</span></qtm-form-label>
                  <qtm-dropdown-select value="UNCLASSIFIED" size="large" @value-changed="(event:any) => ClassificationLevel = event.detail.valueChanged">
                    <qtm-dropdown-select-option value="CLASSIFIED" disabled>
                            CLASSIFIED
                        </qtm-dropdown-select-option>
                        <qtm-dropdown-select-option value="UNCLASSIFIED">
                            UNCLASSIFIED
                        </qtm-dropdown-select-option>
                        <qtm-dropdown-select-option value="RESTRICTED" disabled>
                            RESTRICTED
                        </qtm-dropdown-select-option>
                        <qtm-dropdown-select-option value="SECRET" disabled>
                           SECRET
                        </qtm-dropdown-select-option>
                   </qtm-dropdown-select>
                </div>
                <div style="margin-top: 50px;">
                   <qtm-form-label required><span>File format</span></qtm-form-label> 
                
                <div class="checkboxes" :style="props.shpHidden && 'margin-bottom:60px'">
                    <QtmCheckbox v-if="!props.xmlHidden" label="XML" size="large"   @change="handleCheckboxChange('xml')" />
                    <QtmCheckbox v-if="!props.shpHidden" label="SHP" size="large"  @change="handleCheckboxChange('shp')" />
                    <QtmCheckbox :label="props.labelPdf ? props.labelPdf : 'PDF - Extended view'" size="large"  @change="handleCheckboxChange('pdf')" />
                    <QtmCheckbox v-if="!props.pdfCompressedHidden" label="PDF - Compressed view" size="large"  @change="handleCheckboxChange('pdfC')" />
                    <QtmCheckbox v-if="!props.csvHidden" label="CSV" size="large" :disabled="true"  @change="handleCheckboxChange('pdf')" />
                  
                </div>
            </div>
            </div>
            <QtmDivider  style="margin-bottom: 15px;"/>
            <div class="modal-footer">              
                <QtmButton label="Cancel" color="neutral" variant="ghost" @click-event="close()"></QtmButton>
                <QtmButton label="Confirm" :disabled="verifyInputs()"  @click-event="exportData()"></QtmButton>
            </div>
        </div>
    </div>
</template>


<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: black;
    z-index: 200;
}

.modal-content {
    width: 480px;
    height: 678px;
    /* background-color: #bcbece; */
    background-color:#000000;
    color: white;
    display: flex;
    
    flex-direction: column;
    border: 1px solid rgb(97, 97, 97);
    /* border-radius: 8px; */
    /* padding: 20px; */
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 15px;
    
}

.modal-body {
    height: 600px;
    padding: 20px 20px 20px 30px;
}

.checkboxes {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 20px;
    margin-top: 20px;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 20px;
}

.export-button {
    background-color: blue;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
}
</style>