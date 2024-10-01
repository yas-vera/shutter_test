<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount, watchEffect } from 'vue';
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
  QtmTextarea, QtmAlert,
  QtmMenuItemList,
  QtmMenuItem,
  QtmMenuItemLabel,
  QtmDropdown,
  QtmDropdownTrigger,
  QtmDropdownOverlay,
  QtmTag
} from "@qtm/vue";
// import './MultiStepForm.css'
import { draggingHelper } from '@/helpers/dragging';
import PaginationCustom from '@/components/tableCustom/PaginationCustom.vue';
import { useShcGroupsStore } from '@/stores/shcGroupsStore';
import { convertFormatDate, convertFormatDateSimple, convertTextTruncate } from '@/helpers/convertDateTime';
import { countItems } from '@/helpers/tableHelpers';
import { useUserStore } from '@/stores/userStore';
import ColorPickerCustom from '@/components/colorPicker/ColorPickerCustom.vue';
import { useGroupStore } from '@/stores/groupStore';
import { useScreenStore } from '@/stores/screenStore';
import SearchPicker from '@/components/searchPicker/SearchPicker.vue';
import { useLoadStore } from '@/stores/loadStore';
import { PERCENT_100, PERCENT_40, PERCENT_70 } from '@/constants/constants';
const shcGroupsStore = useShcGroupsStore()
const userStore = useUserStore()
const loaderStore = useLoadStore()
const groupsStore = useGroupStore();
const screenStore = useScreenStore();
const props = defineProps<{
  Title: string,
  contentWidth?: string
  showStepForm?: boolean
}>();
const emits = defineEmits<{
  (e: 'submitAction', values: any): void
  (e: 'closeForm'): void
  (e: 'maximiseForm'): void
  (e: 'closeMaximiseForm', values: any): void
}>();
const iconMapping = { success: 'check' }
const filterForName = ref<string>('')
const selectedGroup = ref<any[]>([]);
const quantitySteps = ref<number>(0)
const requiredInput = ref<"error" | "warning" | "success" | undefined>()
const currentStep = ref(0);
const formData = ref<any>({});

const handlePageChange = async (page: number) => {
  // const newOffset = (page - 1) * shcGroupsStore.limit;
  // shcGroupsStore.offset = newOffset;
  const newOffset = page;
  shcGroupsStore.offset = shcGroupsStore.offset + newOffset;
  await shcGroupsStore.dataShcGroupsForAddUser();
};
const handleLimitChange = async (page: number) => {
  shcGroupsStore.limit = page;
  const newOffset = 0 * shcGroupsStore.limit;
  shcGroupsStore.offset = newOffset;
  await shcGroupsStore.dataShcGroupsForAddUser();
};
const cardMinHeight = ref(515);
const adjustTableMinHeight = () => {
  const screenWidth = window.innerWidth;
  const scrennHeghit = window.innerHeight;
  if (scrennHeghit >= 1000) {
    cardMinHeight.value = 710;
  }
  else if (scrennHeghit >= 900) {
    cardMinHeight.value = 550;
  } else if (scrennHeghit >= 700) {
    cardMinHeight.value = 370;
  }
};
const cancelFunction = () => {
  emits('closeForm');
  selectedGroup.value = [];
};
const searchGroupShc = async (value: string) => {
  filterForName.value = value
  loaderStore.setLoadingSearch(true);
  const params = {
    group_name: value
  }
  await shcGroupsStore.dataShcGroupsForAddUser(params)
  loaderStore.setLoadingSearch(false);
}
const idsUsersAdded = () => {

  if (Array.isArray(shcGroupsStore.shcGroupsResponseAddUser) && shcGroupsStore.shcGroupsResponseAddUser.length > 0) {

    return shcGroupsStore.shcGroupsResponseAddUser.map((group: any) => group.users.map((user: any) => user.user_id)).flat();
  } else {
    return [];
  }

}
const toggleSelectGroup = (group: any) => {
  group.selected = !group.selected;

  if (group.selected) {
    selectedGroup.value.push(group);
  } else {
    const index = selectedGroup.value.findIndex((g: any) => g.group_id === group.group_id);
    if (index !== -1) {
      selectedGroup.value.splice(index, 1);
    }
  }
}

const isSelected = (groupId: any) => {
  return selectedGroup.value.some((group: any) => group.group_id === groupId);
}

onMounted(async () => {
  adjustTableMinHeight();

  await shcGroupsStore.dataShcGroupsForAddUser()

  window.addEventListener('resize', adjustTableMinHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustTableMinHeight);
});
watchEffect(() => {
  adjustTableMinHeight();
});
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

const heightMaximise = ref('auto');
const isMaximise = ref(false);
const isMinus = ref(false);
const minusForm = () => {
  isMinus.value = !isMinus.value;
}
const maximiseForm = () => {
  if (heightMaximise.value == 'auto') {
    heightMaximise.value = 'calc(-64px + 100vh)';
  } else {
    heightMaximise.value = 'auto';
  }

  widthMaximise.value = widthMaximise.value === PERCENT_70 ? PERCENT_100 : PERCENT_70;
}

const closeForm = () => {
  emits('closeForm');
  emits('closeMaximiseForm',formData.value);
}

const { maximise,posX, posY } = draggingHelper()

watch(heightMaximise, (newValue, oldValue) => {
  isMaximise.value = newValue === 'calc(-64px + 100vh)' ? true : false;
  
    if (isMaximise.value) {
      maximise()
    }else {
      posY.value = 164;
      posX.value = 0;
    }
  });

  const widthMaximise = ref(PERCENT_70);

</script>

<template>
  <div v-show="isMinus" class="stepperContentMinus" :style="{ left: '50%', transform: 'translate(-50%, 0%)' }">
    <div class="headerIcons">
      <qtm-typography classes="text-bluegrey-100" style="position: absolute; left: 16px;">{{ props.Title }}
      </qtm-typography>
      <qtm-icon icon="remove" size="medium" classes="text-bluegrey-100 margin-right"
        style="cursor : not-allowed !important"></qtm-icon>
      <qtm-icon icon="open_in_full" size="medium" classes="text-bluegrey-100 margin-right" @click="minusForm()"
        style="cursor: pointer !important;"></qtm-icon>
      <qtm-icon icon="close" size="medium" classes="text-bluegrey-100" @click="closeForm()"
        style="cursor: pointer !important;"></qtm-icon>
    </div>
  </div>

  <div v-show="!isMinus" class="draggable" :style="{ top: posY + 'px', left: posX + 'px' }">
    <div class="stepperContent modal-border" :style="{ width: screenStore.screenWidth > 1150 ? (widthMaximise || '70%') : '100%', 'background-color': '#000000', paddingBottom: isMaximise ? '8px' : '2px' }">
      <div class="headerStepper"
        style="display: flex; justify-content: space-between; background-color: #000000; margin-left: 16px ; padding: 16px; max-height: 54px;">
        <div style="color: white; display: flex; gap: 4px; align-items: center; margin-left: -15px; margin-right: 5px;">
          <QtmIcon icon="group_add" variant="outlined" size="medium" classes="text-bluegrey-100"
            style="cursor: pointer; margin-top: -5px ; "></QtmIcon>

          <span style="font-size: 15px; margin-top: -2px; margin-left: 3px;">{{ props.Title }} </span>
        </div>
        <div style="display: flex; align-items: center; margin-left: 5px; justify-content: end">
          <qtm-icon icon="remove" @click="minusForm()" size="medium" classes="text-bluegrey-100 margin-right"
            style="cursor : pointer !important"></qtm-icon>
          <qtm-icon :icon="isMaximise ? 'close_fullscreen' : 'open_in_full'" size="medium"
            :classes="'text-bluegrey-100 margin-right cursor-pointer'" @click="maximiseForm"></qtm-icon>
          <qtm-icon icon="close" size="medium" classes="text-bluegrey-100" @click="emits('closeForm')"
            style="cursor: pointer !important;"></qtm-icon>
        </div>
      </div>
      <QtmDivider />
      <div>
        <div style="margin-left: 36px;margin-right: 21px; margin-bottom: 5px; margin-top: 15px;">
          <div v-if="!shcGroupsStore.showResponseAddUser">
            <QtmTypography classes="text-bluegrey-100 text-scale-7">Select the SHC group you want to add the selected
              users to.</QtmTypography>
            <div style="margin-top: 40px;">

              <SearchPicker placeholder="Search group name" margin-right-loader-icon="10px"
                input-search-id="searchGroupShcAddUser" :value="filterForName" icon-left="search"
                @update="(event) => searchGroupShc(event)" size="medium"
                :show-loader="(filterForName.length > 0 && loaderStore.loadSearch)" />
            </div>
          </div>
          <div v-else>
            <div style="margin-top: -10px; margin-bottom: 5px;">
              <QtmTypography classes="text-bluegrey-100 text-scale-7">Select the SHC group you want to add the selected
                users to.</QtmTypography>
            </div>
            <qtm-alert size="small" style="margin-bottom: 10px; background: #D1E6DA; color:#136D39" emphasis="high"
              severity="success" :leftIcon="false"
              v-if="shcGroupsStore.countUserFaildAddShcGroups !== shcGroupsStore.countUserAddShcGroups">
              <div style="display: flex;gap: 5px;">
                <qtm-icon icon="check_circle" size="medium" style="color:#136D39 ;"></qtm-icon>
                <QtmTypography classes="text-scale-7">{{ `the users User [
                  ${shcGroupsStore.usersAddeditemsSelected.map((user: any) => user.user_id)} ] have been successfully
                  added to the following SHC groups.`}}</QtmTypography>
              </div>
            </qtm-alert>
            <qtm-alert size="small" emphasis="high" :leftIcon="false" style=" background: #D2D7FF;color:#1F35FF"
              color="informative">
              <div style="display: flex;gap: 5px;">
                <qtm-icon icon="info" size="medium" style="color:#1F35FF ;"></qtm-icon>
                <QtmTypography classes="text-scale-7">{{ `${shcGroupsStore.countUserFaildAddShcGroups} of
                  ${shcGroupsStore.countUserAddShcGroups} selected users already belong to one of the selected groups
                  and have not been added.`}}</QtmTypography>
              </div>

            </qtm-alert>
          </div>


        </div>

      </div>
      <div :style="{ 
        overflow: 'auto', 
        'max-height': 'calc(100vh - 505px)', 
        'min-height': `calc(100vh - ${isMaximise ? '373px' : '505px'})`, 
        'scrollbar-width': 'thin', 
        'margin-left': '13px', 
        'scrollbar-color': '#3b3d50 #1c1d26'
      }">

        <div class="card-container-custom" style="margin-left: 0px" v-if="shcGroupsStore.showResponseAddUser">
          <div v-for="item in shcGroupsStore.shcGroupsResponseAddUser" :key="item.group_id"
            :class="{ 'card-custom': true, 'selected': isSelected(item.group_id) }" :style="{ 'padding': 0 }"
            @click="toggleSelectGroup(item)">
            <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 10px;
          " :style="{ 'background-color': item.color_code }" @click.stop>
              <div style="display: flex; align-items: center; gap: 5px">
                <qtm-typography classes="mt-s mb-s card-title">{{convertTextTruncate(25,item.group_name)}}</qtm-typography>
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
                  <qtm-typography classes="font-bold" component="body-1">{{ convertFormatDateSimple(item.creation_date)
                    }}</qtm-typography>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px">
                  <qtm-tag :label="`${countItems(item.users_shc)} Users`" icon="person" :dismissible="false"
                    classes="color-tag-custom-uds-user-add"></qtm-tag>
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

                <!-- <qtm-button
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right"
              @click.stop
            >
              <qtm-icon icon="edit" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button>

            <ColorPickerCustom 
              label="" 
              :color="item.color_code" 
              :position-tooltip-left="'-133px'"
              @update="(value) => 
              changeColorCard(value, item)" 
            />

            <qtm-button
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right-first"
              @click.stop
            >
              <qtm-icon icon="delete" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button> -->

              </div>
            </div>

          </div>
        </div>
        <div class="card-container-custom" style="margin-left: 13px" v-else>
          <div v-for="item in shcGroupsStore.shcGroupsDataForAddUsers?.response" :key="item.group_id"
            :class="{ 'card-custom': true, 'selected': isSelected(item.group_id) }" :style="{ 'padding': 0 }"
            @click="toggleSelectGroup(item)">
            <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 10px;
          " :style="{ 'background-color': item.color_code }" @click.stop>
              <div style="display: flex; align-items: center; gap: 5px">
                <qtm-typography classes="mt-s mb-s card-title">{{convertTextTruncate(25,item.group_name)}}</qtm-typography>
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
                  <qtm-typography classes="font-bold" component="body-1">{{ convertFormatDateSimple(item.creation_date)
                    }}</qtm-typography>
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

                <!-- <qtm-button
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right"
              @click.stop
            >
              <qtm-icon icon="edit" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button>

            <ColorPickerCustom 
              label="" 
              :color="item.color_code" 
              :position-tooltip-left="'-133px'"
              @update="(value) => 
              changeColorCard(value, item)" 
            />

            <qtm-button
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right-first"
              @click.stop
            >
              <qtm-icon icon="delete" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button> -->

              </div>
            </div>

          </div>
        </div>

      </div>
      <div style=" margin-left: 10px;" v-if="!shcGroupsStore.showResponseAddUser">
        <PaginationCustom style="margin-right: 10px;" :total-items="shcGroupsStore.shcGroupsDataForAddUsers?.totalItems"
          :items-per-page="shcGroupsStore.shcGroupsDataForAddUsers?.currentPage" :offset-value="shcGroupsStore.offset"
          :total-pages-by-pages="[6, 12, 25, 50]" @page-changed="handlePageChange" @limit-changed="handleLimitChange" />
      </div>
      <QtmDivider />
      <div class="footerContent" style="background-color: #000000;" v-if="!shcGroupsStore.showResponseAddUser">
        <QtmButton color="neutral" variant="ghost" @click="cancelFunction">Cancel</QtmButton>
        <QtmButton color="primary" @click="emits('submitAction', selectedGroup)">Add</QtmButton>
      </div>
      <div class="footerContent-close" style="background-color: #000000;" v-else>
        <QtmButton color="primary" @click="cancelFunction">Close</QtmButton>
      </div>
    </div>
  </div>

</template>

<style scoped>
.footerContent {
  flex: 0 0 10%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 30px 10px 30px;
  background-color: #252733;
}

.footerContent-close {
  flex: 0 0 10%;
  display: flex;
  justify-content: end;
  gap: 10px;
  padding: 10px 30px 10px 30px;
  background-color: #252733;
}

.card-container-custom {
  gap: 0 15px !important;
  height: 96% !important;
  margin-left: 15px !important;
  grid-template-columns: repeat(auto-fill, 295.1px) !important;
}

.margin-right {
  margin-right: 10px !important;
}

.stepperContentMinus {
  width: 260px !important;
}
</style>