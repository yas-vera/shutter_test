<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount, watchEffect } from "vue";
import {
  QtmButton,
  QtmIcon,
  QtmMenuItemList,
  QtmMenuItem,
  QtmMenuItemLabel,
  QtmCheckbox,
  QtmDivider,
  QtmTypography,
  QtmFormLabel,
  QtmFormField,
  QtmDropdownSelect,
  QtmDropdownSelectOption,
  QtmDropdown,
  QtmDropdownOverlay,
  QtmDropdownTrigger,
  QtmGrid,
} from "@qtm/vue";
import { udsGroupItems } from "@/dataFake/data";
import { countItems } from "@/helpers/tableHelpers";
import { convertFormatDate } from "@/helpers/convertDateTime";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import { useGroupStore } from "@/stores/groupStore";
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import {
  TAB_FORM_ADD_SHC_GROUP,
  TAB_UDS_GROUPS_DETAILS_UDS,
} from "@/constants/constants";
import TableCustom from "@/components/tableCustom/TableCustom.vue";
import PaginationCustom from "@/components/tableCustom/PaginationCustom.vue";
import ColorPicker from "@/components/colorPicker/ColorPicker.vue";
import ColorPickerCustom from "@/components/colorPicker/ColorPickerCustom.vue";
import SortByGroup from '@/components/groups/SortByGroup.vue';
import { convertFormatDateSimple, convertTextTruncate } from '../../../helpers/convertDateTime';
const udsGroupsStore = useUdsGroupsStore();
const userAndGroups = useUserAndGroupStore();
const groupsStore = useGroupStore();
const handlePageChange = async (page: number) => {
  const newOffset = page;
  udsGroupsStore.offset = udsGroupsStore.offset + newOffset;
  await udsGroupsStore.dataUdsGroups();
};
const handleLimitChange = async (page: number) => {
  udsGroupsStore.limit = page;
  const newOffset = 0 * udsGroupsStore.limit;
  udsGroupsStore.offset = newOffset;
  await udsGroupsStore.dataUdsGroups();
};
const changeColorCard = async (color: string, element: any) => {
  if (udsGroupsStore.udsGroupsData?.response) {
    const targetId = element.group_id;
    const targetElement = udsGroupsStore.udsGroupsData.response.find(
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
//@click="userAndGroups.menuChange(TAB_UDS_GROUPS_DETAILS_UDS),udsGroupsStore.handleUdsGroupsSelected(item)"
</script>
<template>
  <TableCustom>
    <template #headerCardContainer>
      <SortByGroup :group="'uds'" /> 
    </template>
    <template #bodyCardContainer>
      <div
        v-for="item in udsGroupsStore.udsGroupsData?.response"
        :key="item.group_id"
        class="card-custom"
        :style="{'padding': 0 }"
       
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 10px;
            height: 48px;
          "
          :style="{ 'background-color': item.color_code }"
          @click.stop
        >
          <qtm-typography classes="mt-s mb-s card-title">
            {{convertTextTruncate(25,item.group_name)}}</qtm-typography>
        </div>
        <QtmDivider />
        <div class="card-content">
          <div style="padding: 10px">
          <div
            :style="{
              display: 'flex',
              gap: '10px',
             
            }"
          >
            <QtmIcon icon="calendar_month" variant="outlined" size="medium" />
            <qtm-typography component="body-1">Creation date:</qtm-typography>
            <qtm-typography classes="font-bold" component="body-1">{{ convertFormatDateSimple(item.creation_date) }}</qtm-typography>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 15px">
            <QtmIcon icon="person" variant="outlined" size="medium" />
            <qtm-typography component="body-1"
              >{{ countItems(item.users_uds) }} Users</qtm-typography
            >
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
          <div class="mt-s" style="display: flex; justify-content: end; padding-right: 10px; padding-bottom: 10px;">
            <ColorPickerCustom
              class="show-only-hover"
              label=""
              :color="item.color_code"
              @update="(value) => changeColorCard(value, item)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #paginationCardContainer>
      <PaginationCustom
        :total-items="udsGroupsStore.udsGroupsData?.totalItems"
        :items-per-page="udsGroupsStore.udsGroupsData?.currentPage"
        :offset-value="udsGroupsStore.offset"
        :total-pages-by-pages="[6,12,25,50]"
        @page-changed="handlePageChange"
        @limit-changed="handleLimitChange"
      />
    </template>
  </TableCustom>
</template>
