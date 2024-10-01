<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount, watchEffect } from "vue";
import ColorPicker from "@/components/colorPicker/ColorPicker.vue";
import {
  QtmButton,
  QtmIcon,
  QtmMenuItemList,
  QtmMenuItem,
  QtmMenuItemLabel,
  QtmCheckbox,
  QtmDropdown,
  QtmDropdownTrigger,
  QtmDropdownOverlay,
  QtmDivider,
  QtmTypography,
  QtmFormLabel,
  QtmFormField,
  QtmDropdownSelect,
  QtmDropdownSelectOption,
  QtmGrid,
} from "@qtm/vue";
import { udsGroupItems } from "@/dataFake/data";
import { countItems } from "@/helpers/tableHelpers";
import { convertFormatDate } from "@/helpers/convertDateTime";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import {
  TAB_FORM_ADD_SHC_GROUP,
  TAB_UDS_GROUPS_DETAILS_SHC,
  TAB_UDS_GROUPS_DETAILS_UDS,
} from "@/constants/constants";
import TableCustom from "@/components/tableCustom/TableCustom.vue";
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import PaginationCustom from "@/components/tableCustom/PaginationCustom.vue";
import { useGroupStore } from "@/stores/groupStore";
import ColorPickerCustom from '@/components/colorPicker/ColorPickerCustom.vue';
import SortByGroup from '@/components/groups/SortByGroup.vue';
import { convertFormatDateSimple, convertTextTruncate } from '../../../helpers/convertDateTime';
import './css/shcGroupsTable.css';
const shcGroupsStore = useShcGroupsStore();
const userAndGroups = useUserAndGroupStore();
const groupsStore = useGroupStore();
const emits = defineEmits(["updateGroup"]);
const handlePageChange = async (page: number) => {
  //const newOffset = (page - 1) * shcGroupsStore.limit;
  const newOffset = page;
  shcGroupsStore.offset = shcGroupsStore.offset + newOffset;
  
  await shcGroupsStore.dataShcGroups();
};
const handleLimitChange = async (page: number) => {
  
  shcGroupsStore.limit = page;
  const newOffset = 0 * shcGroupsStore.limit;
  shcGroupsStore.offset = newOffset;
  await shcGroupsStore.dataShcGroups();
};
const changeColorCard = async (color: string, element: any) => {
  if (shcGroupsStore.shcGroupsData?.response) {
    const targetId = element.group_id;
    const targetElement = shcGroupsStore.shcGroupsData.response.find(
      (element) => element.group_id === targetId
    );

    if (targetElement) {
      targetElement.color_code = color;
      const valuesUpdate = {
        group_id: element.group_id,
        group_name: element.group_name,
        group_type: element.group_type,
        stanag_id: element.stanag_id,
        color_code: element.color_code,
        description: element.description,
      };
      await groupsStore.putGroup(valuesUpdate);
    }
  }
};
//@click="userAndGroups.menuChange(TAB_UDS_GROUPS_DETAILS_SHC),shcGroupsStore.handleShcGroupsSelected(item)"
</script>
<template>
  <TableCustom>
    <template #headerCardContainer>
      <SortByGroup :group="'shc'" /> 
    </template>
    <template #bodyCardContainer>
      <div v-for="item in shcGroupsStore.shcGroupsData?.response" :key="item.group_id" class="card-custom"
        :style="{ 'padding': 0}" >
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 10px;
          " :style="{ 'background-color': item.color_code }" @click.stop>
          <div style="display: flex; align-items: center; gap: 5px">
            <qtm-typography classes="mt-s mb-s card-title">
              {{convertTextTruncate(25,item.group_name)}}</qtm-typography>
          </div>
        </div>

        <QtmDivider />

        <div class="card-content">
          <div style="padding: 10px">
            <div :style="{
              display: 'flex',
              gap: '10px',
            }">
              <QtmIcon icon="calendar_month" variant="outlined" size="medium" />
              <qtm-typography component="body-1">Creation date:</qtm-typography>
              <qtm-typography classes="font-bold" component="body-1">{{ convertFormatDateSimple(item.creation_date) }}</qtm-typography>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px">
              <QtmIcon icon="person" variant="outlined" size="medium" />
              <qtm-typography component="body-1">{{ countItems(item.users_shc) }} Users</qtm-typography>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px" class="truncate">
              <qtm-typography component="body-1">
                {{
                  item.description && item.description.length > 78 ?
                    item.description.slice(0, 78) + " ..." :
                    item.description
                }}
              </qtm-typography>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <QtmDivider />
          <div class="mt-s" style="display: flex; justify-content: end;">

            <qtm-button
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right"
              class="show-only-hover"
              @click="emits('updateGroup',item) "
              @click.stop
            >
              <qtm-icon icon="edit" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button>

            <ColorPickerCustom 
              label="" 
              class="show-only-hover"
              :color="item.color_code" 
              :position-tooltip-left="'-133px'"
              @update="(value) => 
              changeColorCard(value, item)" 
            />

            <qtm-button
              class="show-only-hover"
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right-first"
              @click="shcGroupsStore.removeData(item)"
              @click.stop
            >
              <qtm-icon icon="delete" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button>

          </div>
        </div>

      </div>
    </template>
    <template #paginationCardContainer>
      <PaginationCustom 
        :total-items="shcGroupsStore.shcGroupsData?.totalItems"
        :items-per-page="shcGroupsStore.shcGroupsData?.currentPage"
        :offset-value="shcGroupsStore.offset" 
        :total-pages-by-pages="[6,12,25,50]"
        @page-changed="handlePageChange" 
        @limit-changed="handleLimitChange"
      />
    </template>
  </TableCustom>
</template>
