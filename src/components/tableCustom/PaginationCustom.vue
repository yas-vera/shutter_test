<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
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
import SelectPicker from '../selectPicker/SelectPicker.vue';
import { useScreenStore } from '@/stores/screenStore';
const props = defineProps(['totalItems', 'itemsPerPage', 'totalPagesByPages','disableIPP','offsetValue']);
const emits = defineEmits<{
  (e: 'page-changed', currentPage: number): void
  (e: 'limit-changed', limitPage: number): void
}>();
const currentPage = ref(1);
const screenStore = useScreenStore();
interface PageOption {
  label: string;
  value: string;
  active:boolean
}
const pageCount = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const displayRange = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage + 1;
  const end = Math.min(start + props.itemsPerPage - 1, props.totalItems);
  return `of ${props.totalItems ? props.totalItems : 0}`;
  // return `${isNaN(start) ? 0 : start}–${isNaN(end) ? 0 : end} of ${props.totalItems ? props.totalItems : 0}`;
});

const changePage = (page: number) => {
  currentPage.value = page;
  emits('page-changed', currentPage.value);
};

const changeLimit = (page: number) => {
  emits('limit-changed', page);
  currentPage.value = 1;
};
  const pageOptions = computed(() => {
  const totalItems = pageCount.value;
  const pages = [];

  for (let i = 1; i <= totalItems; i++) {
    pages.push({ label: i.toString(), value: i.toString(), active: false });
  }

  return pages;
});
const goToFirstPage = () => {
  changePage(1);
};

const goToLastPage = () => {
  changePage(pageCount.value);
};

const totalPerPage = ref(props.totalPagesByPages ? props.itemsPerPage : 12);
const defaultTotalPerPage = ref([]);

const handleTotalPage = () => {
  if (props.totalPagesByPages) {
    return props.totalPagesByPages;
  }
  return [10,25,50,100]
};
const selectedPerPage = computed(() => {
      if (props.itemsPerPage !== undefined && props.itemsPerPage !== null) {
        return props.itemsPerPage.toString();
      } else {
        return "12";
      }
    });
onMounted(() => {
  const value = handleTotalPage()
  defaultTotalPerPage.value = value;
});

</script>

<template>
  <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding-bottom: 10px; padding-right: 10px; padding-top: 10px;">
    <div style="display: flex; gap: 5px; align-items: center; height: 44px; width: 208px;" v-if="!disableIPP" >
      <p class="description-page text-primary-50 description-page-padding" >{{screenStore.widthResponsive(768) ? 'Items per page:':'IPP:' }}</p>
      <qtm-dropdown-select :input-id="`select_pagination_item_per_page`" key="dropdown1"  placement="top" size="medium" :value="selectedPerPage" style="width: 62px; height: 44px;" v-if="defaultTotalPerPage.length > 0"
        @value-changed="(value: any) => changeLimit(value.detail.valueChanged)">
        <template v-for="(optionsSelect, index) in defaultTotalPerPage" :key="optionsSelect">
          <qtm-dropdown-select-option :value="optionsSelect" >
            {{ optionsSelect }}
          </qtm-dropdown-select-option>
        </template>
      </qtm-dropdown-select>
      <!-- <QtmDivider orientation="vertical" shape="rounded" size="small" classes="qtm-divider-vertical" /> -->
      <!-- <p class="description-page-2">{{ props.totalItems  }} {{screenStore.widthResponsive(768) ? 'items in total':'items' }}</p> -->
    </div>

    <div style="display: flex; align-items: center; gap: 5px; padding-right: 36px; height: 44px; width: 50px; margin-right: 50px;">

        <!-- <SelectPicker :id="`select_page`" :options="pageOptions" @selected="(value) => changePage(Number(value))" :curren-page="currentPage.toString()" v-if="pageOptions?.length" />
        <p class="description-page text-primary-50">{{screenStore.widthResponsive(768) ? 'of ' + pageCount + ' Pages': pageCount + ' Pg.' }}</p>
      <QtmDivider orientation="vertical" shape="rounded" size="small" classes="qtm-divider-vertical " /> -->
      <!-- <QtmIcon icon="first_page" size="medium"
        :classes="'icon-left-right ' + ((currentPage == 1 || props.totalItems ===0 ) ? 'cursor-disabled' : 'cursor-pointer')"
        @click="(currentPage != 1 && props.totalItems !== 0) && goToFirstPage()">

      </QtmIcon> -->
      <QtmIcon icon="chevron_left" size="medium"
        :classes="'icon-left-right ' + ((props.offsetValue === 0 ) ? 'cursor-disabled' : 'cursor-pointer')"
        @click="(props.offsetValue !== 0) && changePage(- Number(props.itemsPerPage))"></QtmIcon>
      <QtmIcon icon="chevron_right" size="medium"
        :classes="'icon-left-right ' + ((Number(props.itemsPerPage) !== Number(props.totalItems)) ? 'cursor-disabled' : 'cursor-pointer')"
        @click="(props.itemsPerPage == props.totalItems) ? changePage(Number(props.itemsPerPage)):''"></QtmIcon>
      <!-- <QtmIcon icon="last_page" size="medium"
        :classes="'icon-left-right ' + ((currentPage == pageCount || props.totalItems ===0 ) ? 'cursor-disabled' : 'cursor-pointer')"
        @click="(currentPage != pageCount && props.totalItems !== 0) && goToLastPage()"></QtmIcon> -->
    </div>


  </div>
</template>



<style scoped>

.select-style-custom {
  background-color: #000000;
  color: white;
  border: none;
  width: 60px;
  height: 38px;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  border: 1px solid #797D9C;
}
.select-style-custom .option-custom {
  background-color: #000000; 
  color: white; 
  width: 23px;
  height: 34px;
  padding: 8px; 
}
.select-style-custom:focus {
  border: 1px solid #4C5DFF;
}
.select-style-custom option {
  background-color: #000000; 
  color: white; 
}
.select-style-custom option:hover {
  background-color: #7e7e7e !important; 
  box-shadow: inset 4px 0 0 rgb(45, 16, 209); 
}
.select-style-custom option:checked {
  background-color: blue;

}

ul {
  list-style: none;
  padding: 0;
  display: flex;
}

label {
  color: white;
}

li {
  margin: 0 5px;
}

button {
  color: white;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
}

button[disabled] {
  cursor: not-allowed;
}

.active {
  font-weight: bold;
}

.icon-left-right {
  color: white;
}

.qtm-divider-vertical {
  margin-left: 10px;
  margin-right: 10px;
}

.description-page {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px !important;
  line-height: 20px
}
.description-page-2 {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px !important;
  line-height: 20px;
  color: #9A9DB5;
}
.description-page-padding {
  padding-right: 5px;
}
</style>