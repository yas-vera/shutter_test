<script setup lang="ts">
import ModalDragging from '@/components/modalDragging/ModalDragging.vue';
import { QtmTypography,QtmToggleSwitch,QtmTag,QtmIcon,QtmGrid,QtmTooltip } from '@qtm/vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { bodyRowClassNameFunction,sortType,capitalizeFirstLetter,colorTagClass,validateLargeText, capitalizeRowsLetter} from '@/helpers/tableHelpers';
import { headersConflict } from './config/headersTable';
import type { Item } from 'vue3-easy-data-table';
import useConflictManagement from './hooks/useConflictManagement';

const {
    conflictStore,
    selectedRow,
    mapStore,
    showRow,
    closeModal,
    rulesStore,
    widthMaximise,
    maximiseForm,
    handleMinimizeOption,
    handleMovedOption,
    handleHeightTable,
    isRowExpanded,
    countItemHelper,
    toggleRowExpansion,
    expandedRows,
    handleClassConflict,
    handleManageConflict,
    handleValueChange
} =  useConflictManagement()

const isMinimize = ref<boolean>(!rulesStore.showConflictMinimize);

onMounted(async () => {
    if((rulesStore.showConflictManagement)) {
        
        rulesStore.addMinimizeItem('conflict_management');
    }
    await conflictStore.setUdsGroupData()
    capitalizeRowsLetter()
})

onUnmounted(() => {
    rulesStore.removeMinimizeItem('conflict_management');
})
</script>
<template>
        <ModalDragging 
            v-if="(rulesStore.showConflictManagement)"
            :index-position="1"
            Title="Conflict management"
            name-prop="Conflict management"
            :content-width="widthMaximise"
            :is-minimize="isMinimize"
            @close-form="closeModal"
            @maximise-form="maximiseForm"
            @minimize-form="handleMinimizeOption" 
            @moved="handleMovedOption"   
        >
       <template #body-modal>
            <div class="content-conclift-management">
                <qtm-typography
                :font-size="6"
                font-weight="normal"
                font-family="roboto"
                classes="text-white-100"
                >
                    Click on the table rows to view the conflict on the map
                </qtm-typography>
                <div class="container-table-conflict">
                    <EasyDataTable
                    :body-row-class-name="(item:Item, rowNumber:number) => bodyRowClassNameFunction(item, rowNumber, isRowExpanded(item.id))"
                    :headers="headersConflict"
                    :items="conflictStore.conflictData"
                    theme-color="#4c5dff"
                    table-class-name="customize-table"
                    header-text-direction="left"
                    body-text-direction="left"
                    :sort-type="sortType"
                    multi-sort
                    :table-height="handleHeightTable()"
                    style="z-index: 140;"
                    :rows-items="[10,25, 50, 100]"
                    :rows-per-page="10"
                    alternating
                    >
                    <template #header-id="header">
                    <div >
                        {{ header.text }}
                    </div>
                    </template>
                    <template #header-rules="header">
                    <div class="header-text">
                        {{ header.text }}
                    </div>
                    </template>
                    <template #header-resolution="header">
                    <div class="header-text-custom">
                        {{ header.text }}
                    </div>
                    </template>
                    <template #item-id="item" >
                        <div style="display: flex; align-items: center; cursor: pointer;">
                            <QtmIcon 
                            v-if="countItemHelper(item.rule_ids,item.countExpand - 1)"
                            :icon="isRowExpanded(item.id) ? 'expand_less' : 'expand_more'"
                            size="medium"
                            variant="outlined"
                            style="cursor: pointer;"
                            @click="() => {toggleRowExpansion(item.id)}">
                            </QtmIcon>
                        <span :style="'margin-left:' + (countItemHelper(item.rule_ids,3) ? '3px' : '23px')">{{item.id}} </span>
                        </div>
                    </template>
                    <template #item-rule_ids="item">
                        <div class="tags-container-conflict-mangament" style="cursor: pointer" @click="showRow(item)">
                            <template v-if="!expandedRows.includes(item.id)">                  
                                <template v-for="(it, index) in item.rules">
                                    <div style="max-width: 130px; margin-right: 5px; margin-bottom: 8px">
                                        <qtm-tooltip :content="it.rule_name">
                                            <qtm-tag
                                                v-if="index < item.countExpand"
                                                :label="validateLargeText(it.rule_name,14)"
                                                size="small"
                                                :classes="`${colorTagClass(it.rule_type)}`"
                                                :dismissible="false">
                                            </qtm-tag>
                                        </qtm-tooltip>
                                    </div>
                                </template>
                              
                              
                            </template>

                            <template v-else>            
                                <template v-for="(it, index) in item.rules">
                                    <div style="min-width: 128px; margin-right: 5px; margin-bottom: 8px">
                                        <qtm-tooltip :content="it.rule_name">
                                            <qtm-tag                                               
                                                :label="it.rule_name"
                                                size="small"
                                                :classes="`${colorTagClass(it.rule_type)}`"
                                                :dismissible="false">
                                            </qtm-tag>
                                        </qtm-tooltip>
                                    </div>
                                </template>
                            </template>    
                        </div>
                    </template>
                    <template #item-resolution="item">
                        <div class="cell-manage-conflict">
                            <qtm-toggle-switch 
                                size="medium"
                                :class="handleClassConflict(item.resolution)"
                                :checked="handleManageConflict(item.resolution)"
                                @value-changed="(value) => handleValueChange(value.detail.checked,item)"
                                @click.stop
                                display-icon></qtm-toggle-switch>
                            <qtm-typography
                            :font-size="6"
                            font-weight="normal"
                            font-family="roboto"
                            classes="text-white-100"
                            >
                            {{capitalizeFirstLetter(item.resolution)  }}
                            
                            </qtm-typography>
                        </div>
                    </template>
                </EasyDataTable>
                </div>
                
            </div>
       </template>
      </ModalDragging>
</template>
<style scoped>
.content-conclift-management{
  height: 100%;
  width: 100%;
  padding: 10px 20px 0px 20px;
  /* margin-left: 10px; */
}
.header-text{
    margin-left: 7px
}
.header-text-custom{
    margin-left: 3px
}
.container-table-conflict{

  margin-top: 10px;
}
.cell-manage-conflict{
    display: flex;
    margin-left: -10px;
    align-items: center;
}
.bg-color-custom .qtm-toggle-slider{
    background-color: red !important;
}
.tags-container-conflict-mangament{
    /* margin-left: -30px; */
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.custom-label-position{
    margin-left: -20px;
    display: flex;
    align-items: self-end;
}
</style>