<script setup lang="ts">
import { QtmButton, QtmTypography } from '@qtm/vue';
import { bodyRowClassNameFunction,colorButtonRulesType, capitalizeFirstLetter, caseInsensitiveIncludes, colorButton, colorButtonClass, getValuesAndIds, sortBy, sortType, colorTagClass, validateLargeText } from '@/helpers/tableHelpers';
import {headersActivityLogs,headersContentLogs} from './config/headersTable'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { useSystemStore } from '../../stores/systemStore';
import { useScreenStore } from '@/stores/screenStore';
import type { ClickRowArgument, Item } from 'vue3-easy-data-table';
import useActivityLogs from './hooks/useActivityLogs';
import SearchPicker from '@/components/searchPicker/SearchPicker.vue';
import { useLoadStore } from '@/stores/loadStore';
const screenStore = useScreenStore();
const systemStore = useSystemStore();
const loaderStore = useLoadStore()
const {
        itemsSelected,
        singleSelected,
        calculateMaxHeight,
        showRow,
        downloadFileLogs,
        searchLogValue,
        searchLog,
        filteredLogs
} = useActivityLogs()

</script>
<template>
    <div class="container-search">
        <SearchPicker
            placeholder="Search"
            margin-right-loader-icon="10px"
            input-search-id="searchGroupUds"
            :value="searchLogValue"
            icon-left="search" 
            @update="(event) => searchLog(event)"
            size="medium"
            :show-loader="(searchLogValue.length > 0 && loaderStore.loadSearch)"
        />
    </div>
    <div class="container-activity">
        <div class="container-left-children">
            <div class="title-and-buttom">
                <qtm-typography
                    :font-size="4"
                    font-weight="bold"
                    classes="text-white-100"
                    font-family="roboto">
                    Activity logs
                </qtm-typography>
                <QtmButton
                    variant="outline"
                    size="medium"
                    color="neutral"
                    left-icon="download"
                    :disabled="itemsSelected.length === 0"
                    :props="{
                            id:'exportActivityLogsButton'
                        }"
                    label="Download Logs"
                    @click-event="downloadFileLogs()"
                ></QtmButton>
            </div>
            <div class="table-container">
                 <EasyDataTable
                    v-model:items-selected="itemsSelected"
                    :body-row-class-name="bodyRowClassNameFunction"
                    :headers="headersActivityLogs"
                    class="table-rule-select-custom-th"
                    :items="filteredLogs"
                    theme-color="#4c5dff"
                    table-class-name="customize-table"
                    header-text-direction="left"
                    body-text-direction="left"
                    :sort-type="sortType"
                    :table-height="screenStore.dimanicScreenHeight(252)"
                    multi-sort
                    style="z-index: 140;"
                    :rows-items="[10,25, 50, 100]"
                    :rows-per-page="10"
                    alternating
                    fixed-checkbox
                    :checkbox-column-width="35"
                    @click-row="showRow"
                    >
                    <template #header-log_id="header">
                        <div class="filter-column">
                            <div>
                                {{ header.text }}
                               
                                    <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                                    classes="text-primary-200 filter-icon"></qtm-icon>
                                    <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                                        classes="text-primary-200 filter-icon"></qtm-icon>
                                    <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                                        classes="text-primary-200 filter-icon"></qtm-icon>
                                
                            </div>
                        </div>
                    </template>
                </EasyDataTable> 
            </div>
        </div>
        <div class="container-right-children">
            <div>
                <div class="container-log-title container-log-details">
                    <qtm-typography :font-size="7" font-weight="bold" classes="text-white-100" font-family="roboto">{{ singleSelected ? '' : 'Details' }}</qtm-typography>
                    <qtm-typography v-if="singleSelected" :font-size="7" font-weight="bold" classes="text-white-100" font-family="roboto">{{ singleSelected.log_id }}</qtm-typography>
                </div>
                <div class="container-log-body" :style="calculateMaxHeight">
                    <EasyDataTable
                    v-if="singleSelected"
                    :body-row-class-name="bodyRowClassNameFunction"
                    :headers="headersContentLogs"
                    :items="systemStore.logById"
                    class="table-rule-select-custom-th"
                    theme-color="#4c5dff"
                    table-class-name="customize-table"
                    header-text-direction="left"
                    body-text-direction="left"
                    :sort-type="sortType"
                    :table-height="screenStore.dimanicScreenHeight(270)"
                    multi-sort
                    style="z-index: 140;"
                    :rows-items="[10,25, 50, 100]"
                    :rows-per-page="10"
                    alternating
                    >
                    <template #header-level="header">
                        <div class="filter-column">
                            <div>
                                    {{ header.text }}

                            <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            </div>
                        </div>
                    </template>
                    <template #header-where="header">
                        <div class="filter-column">
                            <div>
                            {{ header.text }}
                            <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            </div>
                        </div>
                    </template>
                    <template #header-time="header">
                        <div class="filter-column">
                            <div>
                            {{ header.text }}
                            <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            </div>
                        </div>
                    </template>
                    <template #header-message="header">
                        <div class="filter-column">
                            <div>
                            {{ header.text }}
                            <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                                classes="text-primary-200 filter-icon"></qtm-icon>
                            </div>
                        </div>
                    </template>
                </EasyDataTable> 
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .container-search {
        height: 10vh;
        padding-top: 3vh;
        margin-left: 1.7vh;
        width: 334px;
    }
    .container-activity {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        
    }
    .container-left-children {
        width: 40%;
        height: 100%;
        background-color: #1C1D26;
    }
    .container-right-children {
        width: 60%;
        height: 100%;
        background-color: #131319;
        border: 1px solid #383A4B;
    }
    .container-log-title {
        border-bottom: 1px solid #383A4B;
    }
    .title-and-buttom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 35px 20px 0px 20px;
    }
    .table-container {
        padding: 20px;
    }
    .container-log-details {
        padding: 25px 20px;
    }
    .container-log-body {
        padding: 0px 20px 20px 20px;
        margin-top: 22px;
        overflow: auto;
        scrollbar-width: thin;
        min-height: calc(90vh - 188px);
        scrollbar-color: #4c5dff #1C1D26;
    }
    .filter-column {
        margin-left: 6px;
        display: flex;
        align-items: top;
        gap: 5px;
    }
    .filter-icon {
    position: absolute !important;
    right: 33px !important;
    font-size: 18px !important;
    }
</style>
