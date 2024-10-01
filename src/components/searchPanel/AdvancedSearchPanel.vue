<script setup lang="ts">
import { useAdvanceSearchPanelStore } from "@/stores/advancedSearchPanelStore";
import {
    QtmDropdownSelect,
    QtmDropdownSelectOption,
    QtmTypography,
    QtmFormLabel,
    QtmButton,
    QtmIcon,
    QtmTextInput,
    QtmCheckbox,
    QtmTag
} from "@qtm/vue";
import { ref, computed, reactive, onMounted, watch, watchEffect, toRaw, nextTick } from 'vue';
import DatePickerInput from "../datePicker/DatePickerInput.vue";
import MultiSelectCustom from "../input/MultiSelectCustom.vue";
import type { IAdvancedSearchPanel } from "@/interfaces/IAdvancedSearchPanel";
import './AdvancedSearchPanel.css'
import { useScreenStore } from "@/stores/screenStore";
import { useLayerStore } from "@/stores/layerStore";
import ClickOutSide from "../clickoutside/ClickOutSide.vue";
import { convertFormatDateAndValidDate, getFormattedDateTime, parseFormattedDateTime } from "@/helpers/convertDateTime"
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import { useUserStore } from "@/stores/userStore";
import { useSatDataStore } from "@/stores/satDataStore";
import { useRulesStore } from "@/stores/rulesStore";
import { useFilterStore } from "@/stores/filtersStore";
import { filterOptions } from "@/data/filterOptions";
import { useGroupStore } from "@/stores/groupStore";
import useFilterRules from "@/modules/rules/hooks/useFilterRules";

const advanceSearchPanelStore = useAdvanceSearchPanelStore()
const screenStore = useScreenStore()
const layerStore = useLayerStore()
const shcGroupsStore = useShcGroupsStore()
const udsGroupsStore = useUdsGroupsStore()
const userStore = useUserStore()
const satDataStore = useSatDataStore();
const rulesStore = useRulesStore();
const filterRules = useFilterRules();
type OptionType = [string, string | number];
const props = defineProps<{
    nameComponent: string
    form: any[]
    excludeClick?: string
}>();
const emits = defineEmits<{
    (e: 'openOption', option: boolean): void
    (e: 'applyFilters', data: any): void
}>();
const getInitialFormData = () => {
    const initialData: Record<string, any> = {};
    for (const field of props.form) {
        if (field.valueForm != '') {
            initialData[field.valueForm] = '';
        }
        if (field.type === 'dateFromTo' && 'dateOptions' in field) {
            if (field.dateOptions) {
                for (const fieldChildren of field.dateOptions) {
                    if (fieldChildren.valueForm && initialData[fieldChildren.valueForm] !== undefined) {
                        initialData[fieldChildren.valueForm] = fieldChildren.value;
                    } else {
                        initialData[fieldChildren.valueForm] = '';
                    }
                }
            }
        }
    }
    return initialData;
};
const shouldDisplayFormData = ref<boolean>(false)
const applyFilters = ref<boolean>(false)
const defaultDate = ref<boolean>(true)
const resetDate = ref<boolean>(false)
const formData = reactive<Record<string, any>>({});
const formDataFilter = reactive<Record<string, any>>({});
const currentDate = new Date();
const filterStore = useFilterStore();
const groupsStore = useGroupStore()

function isValidDate(dateString: any) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

const isValidISODate = (value: string): boolean => {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
    return isoRegex.test(value);
};

watch(
    () => filterStore.rulesFilters,
    (newValue) => {
        let updates: any = {};
        const fields = [
            'rule_id',
            'rule_name',
            'status',
            'rule_type',
            'validity_start_time',
            'validity_end_time',
            'sensing_start_time',
            'sensing_end_time',
            'creation_date_start_criteria',
            'creation_date_end_criteria',
            'mission_id',
            'acquisition_mode_id',
            'comments',
            'area',
            'group_uds',
            'group_shc',
            'user'
        ];
        
        fields.forEach(field => {
            if ((newValue && newValue[field]) || formData[field] !== '') {
                if (field === 'validity_start_time' || field === 'validity_end_time' || field === 'sensing_start_time' || field === 'sensing_end_time'
                    || field === 'creation_date_start_criteria' || field === 'creation_date_end_criteria') {
                        if (typeof newValue[field] === 'string' && newValue[field].endsWith('Z')) {
                        //formData[field] = isValidDate(newValue.validity_start_time) ? getFormattedDateTime(new Date(newValue[field])) : newValue[field];
                        formData[field] = newValue[field];
                        updates[field] = isValidISODate(newValue[field]) ? newValue[field].slice(0, -1) : newValue[field];
                    } else {
                        formData[field] = isValidDate(new Date(newValue[field])) ? new Date(newValue[field]).toISOString() : newValue[field] ? newValue[field] : '';
                        updates[field] = newValue[field] ? newValue[field] : '';
                    }
                    // if (typeof newValue[field] === 'string' && newValue[field].endsWith('Z')) {
                    //     //formData[field] = isValidDate(newValue.validity_start_time) ? getFormattedDateTime(new Date(newValue[field])) : newValue[field];
                    //     formData[field] = convertFormatDateAndValidDate(newValue[field]);
                    //     updates[field] = isValidISODate(newValue[field]) ? newValue[field].slice(0, -1) : newValue[field];
                    // } else {
                    //     formData[field] = isValidDate(new Date(newValue[field])) ? convertFormatDateAndValidDate(new Date(newValue[field]).toISOString()) : newValue[field] ? newValue[field] : '';
                    //     updates[field] = newValue[field] ? newValue[field] : '';
                    // }
                } else {
                    formData[field] = newValue[field] ? newValue[field] : '';
                    updates[field] = newValue[field] ? newValue[field] : '';
                }
            }
        });
        rulesStore.itemsSelected = [];
        filterRules.selectedAcquisitionModeIds = updates.acquisition_mode_id;
        filterRules.selectedGroupIds = updates.group_uds;
        rulesStore.handleValuesFilter(updates);
        shouldDisplayFormData.value = Object.values(formData).some(value => value !== '')
        Object.assign(formDataFilter, formData);
    },
    { deep: true }
);

const handleSubmit = () => {
    
    shouldDisplayFormData.value = applyFilters.value && Object.values(formData).some(value => value !== '');
    Object.assign(formDataFilter, formData);
    if (formData['validity_start_time'] && formData['validity_start_time'].length > 14) {
        let valid = isValidDate(formData['validity_start_time'])
        if (!valid) {
            formData['validity_start_time'] = parseFormattedDateTime(formData['validity_start_time'])
        }
    }
    if (formData['validity_end_time'] && formData['validity_end_time'].length > 14) {
        let valid = isValidDate(formData['validity_end_time'])
        if (!valid) {
            formData['validity_end_time'] = parseFormattedDateTime(formData['validity_end_time'])
        }
    }
    areaLabelFind()
    emits('applyFilters', formData);
    if (applyFilters.value) {
        advanceSearchPanelStore.closeSearchPanel(props.nameComponent)
    }
}

const resetAll = ref(0);
const resetKeys = ref<any>({});

const setDefault = (key: string) => {
    formData[key] = null;
    formDataFilter[key] = null;
    formData[key] = '';
    formDataFilter[key] = '';
    resetKeys.value[key] = (resetKeys.value[key] || 0) + 1;
}

const resetUserForm = () => {
    resetDate.value = true
    Object.assign(formData, getInitialFormData());
    Object.assign(formDataFilter, formData);
    shouldDisplayFormData.value = false;
    applyFilters.value = false;
    resetAll.value++;
    filterStore.resetFilters()
    setTimeout(() => { resetDate.value = false}, 100);
};
const labelArea = ref('')
const areaLabelFind = () => {
    if (formData.area != "" && formData.area.length > 0) {
        let labels: any = []
        let idSelects :any = []
        formData.area.forEach((element: any) => {
            let label = layerStore.layerDataSelect.find((item) => item.value === element)?.label
            label && labels.push(label)
        });
        formData.area.forEach((element: any) => {
            let selectedIds = layerStore.layerDataSelect.find((item) => item.value === element)?.id
            selectedIds && idSelects.push(selectedIds)
        });
        if(idSelects.length > 0){
            layerStore.layerData.forEach((layer: any) => {
                if (idSelects.includes(layer.id)) {
                    layer.checked = true;
                }else{
                    layer.checked = false;
                }
            });
        }
        if (labels.length > 0) {
            let value = 'Acquisition area: ' + labels.join(' , ')
            labelArea.value = value
        } else {
            labelArea.value = ''
        }
    }else{
        layerStore.layerData.forEach((layer: any) => {
                    layer.checked = false;
            });
    }

}

watchEffect(async () => {
    if (layerStore.layerSelectedDefault) {
        if (layerStore.isShowDefaultValueLayer) {
            formData.area = layerStore.layerSelectedDefault
        }

    }
})
const updateDateValue = (field: string, value: string | Date, fromField: string, toField: string) => {
    formData[field] = value;
    if (field === fromField) {
        const startDate = new Date(value);
        const endDate = new Date(formData[toField]);
        if ((startDate > endDate || endDate.toLocaleString() == 'Invalid Date' ) && rulesStore.resetLabelDate == false) {
            formData[toField] = value;
        }
    }
}

const hasFormDataFilterValues = computed(() => {
    return Object.values(formDataFilter).some(value => value !== '' && value.length > 0);
});

const getDataSelect = (field: string) => {
    if (field == 'group_uds') {
        let data = udsGroupsStore.udsSelectGroupsData?.response
        return data?.map((item) => {
            return {
                label: item.name,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    if (field == 'group_shc') {
        let data = shcGroupsStore.shcSelectGroupsData?.response
        return data?.map((item) => {
            return {
                label: item.name,
                value: item.id,
            }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
    if (field == 'user') {
        let data = userStore.userSelectData
        return data?.map((item) => {
            return {
                label: item.name,
                value: item.name,
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
onMounted(async () => {
    Object.assign(formData, getInitialFormData());
    for (const field of props.form) {
        if ((field.type == 'select' || field.type == 'multi-select') && field.getData) {
            switch (field.valueForm) {
                case 'group_uds' || 'group_shc':
                    const dataSelectUds = await groupsStore.getGroupsToSelect({group_type:'uds'})
                    const dataSelectShc = await groupsStore.getGroupsToSelect({group_type:'shc'})
                    await shcGroupsStore.assignSelectData({response:dataSelectShc})
                    await udsGroupsStore.assignSelectData({response:dataSelectUds})
                    break;
                case 'user':
                    await userStore.dataSelectUser()
                    break;
                case 'mission_id':
                    await satDataStore.getSatData('mission')
                case 'acquisition_mode_id':
                    await satDataStore.getSatData('acquisition_mode')
                default:
                    break;
            }
        }

    }
    filterStore.resetFilters()
    defaultDate.value = true

})

function handleLabelMultiselect(option: string, isButton: boolean = false) {
    let label: string = ''
    switch (option) {
        case 'group_uds':
            label = isButton ? `Group uds: ` : `<span class='filter-title'>Group uds: </span>`
            break;
        case 'group_shc':
            label = isButton ? `Group shc: ` : `<span class='filter-title'>Group shc: </span>`
            break;
        case 'user':
            label = isButton ? `User: ` : `<span class='filter-title'>User: </span>`
            break;
    }
    return label
}

const handleLabelDate = (option: string) => {
    const timeOptions = [
        'validity_start_time',
        'validity_end_time',
        'sensing_start_time',
        'sensing_end_time',
        'creation_date_start',
        'creation_date_start_criteria',
        'creation_date_end',
        'creation_date_end_criteria'
    ];

    return timeOptions.includes(option);
}

const viewLabelFilter = (option: any, isButton: boolean = false) => {
    const optionKeys = [
        'group_uds',
        'group_shc',
        'user'
    ];
    if (option[0] && !optionKeys.includes(option[0])) {
        let result: any = convertFormatDateAndValidDate(option[1]?.toString())
        result = result?.replace(/,/g, ' , ');

        for (const [key, value] of Object.entries(filterOptions)) {
            if (key === option[0]) {
                if (option[0] == 'mission_id' || option[0] == 'acquisition_mode_id') {
                    result = isButton ? `${value}: ${result}` : `<span class='filter-title'>${value}:</span> ${result}`;               
                }else if( handleLabelDate(option[0])){
                    result = isButton 
                        ? `${value}: ${ convertFormatDateAndValidDate(option[1])}` 
                        : `<span class='filter-title'>${value}:</span> ${convertFormatDateAndValidDate(option[1])}`;
                }
                else {
                    result = isButton ? `${value}: ${option[1] === "prohibitive" ? "blocking" : option[1]}` : `<span class='filter-title'>${value}:</span> ${option[1] === "prohibitive" ? "blocking" : option[1]}`;
                }
                break;
            }
        }
        return result;
    }
    const optionLabel = getDataSelect(option[0])
    if (optionLabel) {
        let labels: any = [];
        option[1].forEach((element: any) => {
            const viewLabel = optionLabel.find(x => x.value == element)
            labels.push(viewLabel?.label)
        });
        const viewLabel = labels.join(' , ')
        let value = handleLabelMultiselect(option[0], isButton) + viewLabel
        return value
    }
    return ''
}
</script>
<template>
    <div class="options-filter-column"
        v-if="shouldDisplayFormData && hasFormDataFilterValues || rulesStore.viewRules === 'table'">
        <div class="filters-options">
            <template v-for="value in Object.entries(formDataFilter)" :key="value[0]">
                <qtm-tag size="medium" classes="color-button-status-active style-custom-tag custom-tag"
                    :dismissible="true" v-if="value[1] !== '' && value[1].length > 0"
                    @clicked-tag-button-event="setDefault(value[0]), handleSubmit()">
                    <span v-html="value[0] != 'area' ? viewLabelFilter(value) : labelArea"></span>
                </qtm-tag>
            </template>

            <qtm-typography classes="text-bluegrey-100 custom-clear-all style-custom-tag" :font-size="7"
                font-weight="normal" font-family="roboto" v-show="shouldDisplayFormData && hasFormDataFilterValues"
                @click="() => { resetUserForm(), handleSubmit(), filterStore.resetFilters() }">
                Clear All
            </qtm-typography>
        </div>
    </div>
    <!-- <ClickOutSide @clickoutside="advanceSearchPanelStore.closeSearchPanel(props.nameComponent)" :exclude-class="props.excludeClick"> -->
    <ClickOutSide :exclude-class="props.excludeClick">
        <div class="containerSearchPanel" v-if="advanceSearchPanelStore.verifyOpenClose(props.nameComponent)">
            <div style="padding: 3px; display: flex; gap: 10px; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #3b3d50 #1c1d26;"
                v-if="shouldDisplayFormData">
                <template v-for="value in Object.entries(formDataFilter)" :key="value[0]">

                    <QtmButton classes="style-custom-tag-advanced"
                        :label="value[0] != 'area' ? viewLabelFilter(value, true) : 'labelArea'" variant="outline"
                        right-icon="close" v-if="value[1] !== '' && value[1].length > 0"
                        @click="setDefault(value[0])" />

                </template>
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="grid-container" :style="`max-height:${screenStore.screenHeight - 320}px`">
                    <div class="search-advance-row-1">
                        <div v-for="formValues in props.form" :key="formValues.id">
                            <div v-if="formValues.column == 1">
                                <div class="marginTopInput" v-if="formValues.type === 'select'"
                                    :style="`width: ${formValues.width} ; margin-right: ${formValues.right}`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>
                                    <qtm-dropdown-select size="large" :input-id="`select_${formValues.valueForm}`"
                                        :placeholder="formValues.placeholder"
                                        @value-changed="(event) => formData[formValues.valueForm] = event.detail.valueChanged"
                                        :value="formData[formValues.valueForm]">
                                        <div style="max-height: 170px !important; overflow-y: auto;">
                                            <div v-if="formValues.getData">
                                                <template
                                                    v-for="(optionsSelect, index) in getDataSelect(formValues.valueForm)"
                                                    :key="index">
                                                    <qtm-dropdown-select-option :value="optionsSelect.value">
                                                        {{ optionsSelect.label }}
                                                    </qtm-dropdown-select-option>
                                                </template>
                                            </div>
                                            <div v-else>
                                                <template v-for="(optionsSelect, index) in formValues.options"
                                                    :key="index">
                                                    <qtm-dropdown-select-option :value="optionsSelect.value">
                                                        {{ optionsSelect.label }}
                                                    </qtm-dropdown-select-option>
                                                </template>
                                            </div>

                                        </div>
                                    </qtm-dropdown-select>
                                </div>
                                <div class="marginTopInput" v-if="formValues.type === 'multi-select'"
                                    :style="`width: ${formValues.width} ; margin-right: ${formValues.right};`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>
                                    <div>
                                        <MultiSelectCustom :modelValue="formData[formValues.valueForm]"
                                            :options="getDataSelect(formValues.valueForm)" :resetAll="resetAll"
                                            :resetKey="resetKeys[formValues.valueForm]"
                                            @update:modelValue="value => formData[formValues.valueForm] = value" />
                                    </div>

                                </div>
                                <div class="marginTopInput" v-if="formValues.type === 'select-custom-area'"
                                    :style="`width: ${formValues.width}`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>

                                    <MultiSelectCustom :modelValue="formData[formValues.valueForm]"
                                        :options="layerStore.layerDataSelect" :resetAll="resetAll"
                                        :resetKey="resetKeys[formValues.valueForm]" :view-footer="true"
                                        @update:modelValue="value => formData[formValues.valueForm] = value">
                                        <template #footer>
                                            <div class="custom-footer">
                                                <qtm-button
                                                    @click-event="layerStore.showMenuAddLayer(), layerStore.isShowDefaultValueLayer = true, advanceSearchPanelStore.closeSearchPanel(props.nameComponent)"
                                                    type="button" variant="filled" color="neutral" size="large"
                                                    class="custom-button-select" classes="bg-bluegrey-700">
                                                    <div style="display: flex;">
                                                        <qtm-icon icon="polyline" variant="outlined"
                                                            size="large"></qtm-icon>
                                                        <qtm-typography component="body-2">Add new geometric
                                                            area</qtm-typography>
                                                    </div>
                                                </qtm-button>
                                            </div>
                                        </template>
                                    </MultiSelectCustom>


                                    <!-- <qtm-dropdown-select size="large" :input-id="`select_${formValues.valueForm}`"
                                        @value-changed="(event) => formData[formValues.valueForm] = event.detail.valueChanged"
                                        :placeholder="formValues.placeholder" :value="formData[formValues.valueForm]"
                                        scrollable :nb-visible-options="3">
                                        <template v-for="(optionsSelect, index) in layerStore.layerDataSelect" :key="index"
                                            style="height: 100px !important;">
                                            <qtm-dropdown-select-option :value="optionsSelect.value">
                                                {{ optionsSelect.label }}
                                            </qtm-dropdown-select-option>
                                        </template>

                                        <div style="position: sticky; bottom: 0; width: 100%;">
                                            <qtm-button
                                                @click-event="layerStore.showMenuAddLayer(), layerStore.isShowDefaultValueLayer = true, advanceSearchPanelStore.closeSearchPanel(props.nameComponent)"
                                                type="button" variant="filled" color="neutral" size="large"
                                                class="custom-button-select" classes="bg-bluegrey-700">
                                                <div style="display: flex;">
                                                    <qtm-icon icon="polyline" variant="outlined" size="large"></qtm-icon>
                                                    <qtm-typography component="body-2">Add new geometric
                                                        area</qtm-typography>
                                                </div>

                                            </qtm-button>
                                        </div>
                                    </qtm-dropdown-select> -->


                                </div>
                                <div class="marginTopInput height-input" v-if="formValues.type === 'input'"
                                    :style="`width: ${formValues.width} ; margin-right: ${formValues.right}`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>
                                    <qtm-text-input size="medium" right-icon=""
                                        :input-id="`input_${formValues.valueForm}`" :style="'width: 100px !important'"
                                        :placeholder="formValues.placeholder"
                                        @value-changed="(event) => formData[formValues.valueForm] = event.detail"
                                        :value="formData[formValues.valueForm]"
                                        :props="{ type: formValues.inputType !== '' && formValues.inputType !== undefined ? formValues.inputType : 'text' }"></qtm-text-input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="search-advance-row-2">
                        <div v-for="formValues in props.form" :key="formValues.id">
                            <div v-if="formValues.column == 2">
                                <div class="" v-if="formValues.type === 'checkbox'"
                                    :style="`width: ${formValues.width} ; margin-left: ${formValues.left}`">
                                    <qtm-checkbox size="small" input-id="layerAirports"> {{ formValues.Label
                                        }}</qtm-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="search-advance-row-3">
                        <div v-for="formValues in props.form" :key="formValues.id">
                            <div v-if="formValues.column == 3">
                                <div class="marginTopInput" v-if="formValues.type === 'select'"
                                    :style="`width: ${formValues.width} ; margin-right: ${formValues.right}`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>
                                    <qtm-dropdown-select size="large" :input-id="`select_${formValues.valueForm}`"
                                        :placeholder="formValues.placeholder"
                                        @value-changed="(event) => formData[formValues.valueForm] = event.detail.valueChanged"
                                        classes="custom-select-advance-search-container custom-select-advance-search-container-input"
                                        :value="formData[formValues.valueForm]">
                                        <div v-if="formValues.getData">
                                            <template
                                                v-for="(optionsSelect, index) in getDataSelect(formValues.valueForm)"
                                                :key="index">
                                                <qtm-dropdown-select-option :value="optionsSelect.value">
                                                    {{ optionsSelect.label }}
                                                </qtm-dropdown-select-option>
                                            </template>
                                        </div>
                                        <div v-else>
                                            <div style="max-height: 170px !important; overflow-y: auto;">
                                                <template v-for="(optionsSelect, index) in formValues.options"
                                                    :key="index">
                                                    <qtm-dropdown-select-option :value="optionsSelect.value">
                                                        {{ optionsSelect.label }}
                                                    </qtm-dropdown-select-option>
                                                </template>
                                            </div>
                                        </div>
                                    </qtm-dropdown-select>
                                </div>
                                <div class="marginTopInput" v-if="formValues.type === 'multi-select'"
                                    :style="`width: ${formValues.width} ; margin-right: ${formValues.right}`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>
                                    <MultiSelectCustom 
                                        :modelValue="formData[formValues.valueForm]"
                                        :options="getDataSelect(formValues.valueForm)" 
                                        :resetAll="resetAll"
                                        :resetKey="resetKeys[formValues.valueForm]"
                                        @update:modelValue="value => formData[formValues.valueForm] = value" />
                                </div>
                                <div class="marginTopInput" v-if="formValues.type === 'select-custom-area'"
                                    :style="`width: ${formValues.width}`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>

                                    <qtm-dropdown-select size="large" :input-id="`select_${formValues.valueForm}`"
                                        @value-changed="(event) => formData[formValues.valueForm] = event.detail.valueChanged"
                                        :placeholder="formValues.placeholder" :value="formData[formValues.valueForm]"
                                        scrollable :nb-visible-options="3">
                                        <template v-for="(optionsSelect, index) in layerStore.layerDataSelect"
                                            :key="index" style="height: 100px !important;">
                                            <qtm-dropdown-select-option :value="optionsSelect.value">
                                                {{ optionsSelect.label }}
                                            </qtm-dropdown-select-option>
                                        </template>

                                        <div style="position: sticky; bottom: 0; width: 100%;">
                                            <qtm-button
                                                @click-event="layerStore.showMenuAddLayer(), layerStore.isShowDefaultValueLayer = true, advanceSearchPanelStore.closeSearchPanel(props.nameComponent)"
                                                type="button" variant="filled" color="neutral" size="large"
                                                class="custom-button-select" classes="bg-bluegrey-700">
                                                <div style="display: flex;">
                                                    <qtm-icon icon="polyline" variant="outlined"
                                                        size="large"></qtm-icon>
                                                    <qtm-typography component="body-2">Add new geometric
                                                        area</qtm-typography>
                                                </div>

                                            </qtm-button>
                                        </div>
                                    </qtm-dropdown-select>


                                </div>
                                <div class="marginTopInput height-input" v-if="formValues.type === 'input'"
                                    :style="`width: ${formValues.width} ; margin-right: ${formValues.right}`">
                                    <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}&nbsp;
                                    </QtmFormLabel>
                                    <QtmFormLabel component="body-1">{{ formValues.Label }}</QtmFormLabel>
                                    <qtm-text-input size="medium" right-icon=""
                                        :input-id="`input_${formValues.valueForm}`" :style="'width: 100px !important'"
                                        :placeholder="formValues.placeholder"
                                        @value-changed="(event) => formData[formValues.valueForm] = event.detail"
                                        :value="formData[formValues.valueForm]"
                                        :props="{ type: formValues.inputType !== '' && formValues.inputType !== undefined ? formValues.inputType : 'text' }"></qtm-text-input>
                                </div>
                                <div v-show="formValues.type === 'dateFromTo'"
                                    :style="`width: ${formValues.width} ; margin-right: ${formValues.right}`">
                                    <div class="marginTopInput">
                                        <QtmFormLabel component="body-1" classes="font-bold">{{ formValues.title }}
                                            &nbsp;
                                        </QtmFormLabel>
                                    </div>
                                    <div class="twoInputGroup" style="gap: 15px;" v-if="!resetDate">
                                        <div class="twoInputGrup-inner" v-for="item in formValues.dateOptions"
                                            :style="`width: ${item.width}`">
                                            <QtmFormLabel component="body-1">{{ item.label }}</QtmFormLabel>
                                            <DatePickerInput :size="'large'" :value="formData[item.valueForm]"
                                                :name="item.valueForm" extra-class="custom-date-picker-input"
                                                :no-default-date="formData[item.valueForm]?.length > 0 ? false : true"
                                                :placeholder="item.placeholder"
                                                @update:model-value="(value) => updateDateValue(item.valueForm, value, formValues.dateOptions.find((x: any) => x.label === 'From').valueForm, formValues.dateOptions.find((x: any) => x.label === 'To').valueForm)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="buttons-container">
                    <qtm-button variant="outline" color="primary" size="large" classes="width-reset-filter" :props="{
                        id: `resetButton_${props.nameComponent}`
                    }" @click-event="resetUserForm(), handleSubmit(), filterStore.resetFilters()">
                        Reset
                    </qtm-button>
                    <qtm-button variant="filled" color="primary" size="large" type="submit" classes="width-apply-filter"
                        :props="{
                            id: `applyButton_${props.nameComponent}`
                        }" @click="applyFilters = true">
                        Apply filters
                    </qtm-button>

                    <qtm-button style="margin-left: auto" variant="ghost" color="primary"
                        @click="advanceSearchPanelStore.closeSearchPanel(props.nameComponent)" size="large"
                        classes="qtm-rotate-apply-filter">
                        <qtm-icon icon="expand_more" variant="outlined" rotation
                            classes="text-dark-neutral-default qtm-rotate-apply-icon cursor-pointer"></qtm-icon>
                    </qtm-button>
                    <!-- <qtm-icon icon="expand_less" size="xlarge" variant="outlined" classes="text-dark-neutral-default cursor-pointer" style="margin-left: auto"
                        @click="advanceSearchPanelStore.closeSearchPanel(props.nameComponent)"></qtm-icon> -->
                </div>
            </form>

        </div>
    </ClickOutSide>
</template>
<style>
.width-reset-filter {
    width: 74px;
}

.width-apply-filter {
    width: 118px;
}

.qtm-rotate-apply-filter {
    transform: rotate(180deg);
}

.qtm-rotate-apply-icon i {
    font-size: 30px !important;
}

.options-filter-column {
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: absolute;
    z-index: 120;
    background-color: #1C1D26;
    width: 100%;
    overflow: hidden;
    height: 65px;

}

.custom-clear-all {
    cursor: pointer;
}

.options-filter-column .filters-options {
    width: 80%;
    min-width: 80%;
    overflow-x: scroll;
    display: flex;
    gap: 10px;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #3b3d50 #1c1d26;
}

.custom-tag {
    display: flex;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.filter-title {
    color: #9A9DB5;
}
</style>
