<script setup lang="ts">
import { ref } from 'vue';
import { useShcGroupsStore } from '../../stores/shcGroupsStore';
import { useUdsGroupsStore } from '../../stores/udsGroupsStore';

import {
  QtmButton,
  QtmIcon,
  QtmDivider,
  QtmFormLabel,
  QtmFormField,
  QtmDropdownSelect,
  QtmDropdownSelectOption
} from "@qtm/vue";

const props = defineProps<{
  group: string;
}>();

const shcGroupsStore = useShcGroupsStore();
const udsGroupsStore = useUdsGroupsStore();
const sortOrderBy = ref('descending');
const sortValue = ref('group_name');

const handleSort = () => {
    if (sortOrderBy.value === 'descending') {
        sortOrderBy.value = 'ascending';
    } else {
        sortOrderBy.value = 'descending';
    }
    handleSelectStore();
};

const handleChangeSortBy = (value: string) => {
    sortValue.value = value;
    handleSelectStore();
};

const handleSelectStore = () => {
    if (props.group === 'shc') {
        shcGroupsStore.changeSortData(sortOrderBy.value, sortValue.value);
    } else {
        udsGroupsStore.changeSortData(sortOrderBy.value, sortValue.value)
    }
};
</script>

<template>
    <div class="qtm-width-sort">
        <qtm-form-label required for="example2" style="padding-top: 4px;">Sort by</qtm-form-label>
        <qtm-dropdown-select :input-id="props.group + '_input_sort_by' " size="small" :style="{ width: '205px' }" value="group_name"
            @value-changed="(value) => handleChangeSortBy(value.detail.valueChanged)">
            <qtm-dropdown-select-option value="group_name">
                Group name
            </qtm-dropdown-select-option>
            <qtm-dropdown-select-option value="creation_date">
                Creation date
            </qtm-dropdown-select-option>
        </qtm-dropdown-select>
        
        <qtm-button
            variant="ghost"
            size="small"
            color="primary"
            @click="handleSort()"
        >
            <qtm-icon icon="swap_vert" size="medium" classes="text-primary-200"></qtm-icon>
        </qtm-button>
        <!-- <div class="qtm-button-order-by" @click="handleSort">
            <qtm-icon icon="straight" size="small" :classes="'qtm-arrow-up ' + (sortOrderBy === 'ascending' ? 'text-primary-300' : 'text-primary-100')"></qtm-icon>
            <qtm-icon icon="straight" size="small" :classes="'qtm-arrow-down qtm-rotate ' + (sortOrderBy === 'descending' ? 'text-primary-300' : 'text-primary-100')"></qtm-icon>
        </div> -->
    </div>
</template>

<style scope>
.qtm-width-sort {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
    margin-right: 10px;
    cursor: pointer;
    gap: 10px;
}

.qtm-button-order-by {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* background-color: #333344; */
    height: 100%;
}

.qtm-button-order-by:hover {
    background-color: #333344;
}

.qtm-arrow-up {
    margin-top: -13px;
    padding-left: 5px;
}

.qtm-arrow-down {
    margin-top: 8px;
    padding-left: 8px;
}

.qtm-rotate {
    transform: rotate(180deg);
}
</style>