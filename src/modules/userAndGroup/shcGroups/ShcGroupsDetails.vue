<script setup lang="ts">
import DetailsCustom from "@/components/tableCustom/DetailsCustom.vue";
import { bodyRowClassNameFunction, capitalizeFirstLetter, colorButton } from "@/helpers/tableHelpers";
import { useScreenStore } from "@/stores/screenStore";
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import {  QtmTypography, QtmButton } from "@qtm/vue";
import type { Header, Item } from "vue3-easy-data-table";
import { computed } from "vue";
const  shcGroupsStore = useShcGroupsStore()
const screenStore = useScreenStore();
const headers: Header[] = [
  { text: "Applicable rules", value: "rule_name",sortable: true},
  { text: "Rules status", value: "status" ,sortable: true},
];
const dynamicWidth = computed(() => (screenStore.screenWidth < 960 ? "100%" : "50%"));
</script>
<template>
  <DetailsCustom
    :width="dynamicWidth"
  >
    <template #firstDivLeft>
      <div style="margin-left: 13px;">
        <QtmTypography 
        classes="text-dark-neutral-pressed text-scale-5 font-medium">
        {{shcGroupsStore.shcGroupsDataSelected?.group_name}}
      </QtmTypography>
      </div>
     
    </template>
    <template #secondDiv>
      <div style="margin-left: 13px;">
        <EasyDataTable
          :body-row-class-name="bodyRowClassNameFunction"
          :headers="headers"
          :items="shcGroupsStore.shcGroupsRules"
          theme-color="#4c5dff"
          table-class-name="customize-table"
          header-text-direction="left"
          body-text-direction="left"
          :table-height="screenStore.screenHeight - 320"
          multi-sort
          style="z-index: 140; width: 100%;"
          :rows-items="[10,25, 50, 100]"
          :rows-per-page="10"
          alternating
          >
          <template #item-status="items">
            <qtm-button 
                style="margin-right: 14px;"
                classes="rounded-full "
                variant="filled"
                size="small"
                :color="colorButton(items?.status)"
            >
              {{capitalizeFirstLetter(items?.status)}}
            </qtm-button>
          </template>
            </EasyDataTable>
      </div>
      
    </template>
  </DetailsCustom>
  </template>