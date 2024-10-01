div<script setup lang="ts">
import SearchPicker from "@/components/searchPicker/SearchPicker.vue";
import { useLoadStore } from "@/stores/loadStore";
import useSettings from "./hooks/useSettings";
import {
  QtmTypography,
  QtmIcon,
  QtmButton,
  QtmDropdown,
  QtmDropdownTrigger,
  QtmDropdownOverlay,
  QtmMenuItemList,
  QtmMenuItem
} from "@qtm/vue";
const loaderStore = useLoadStore();
const {
  searchSettingValue,
  searchSetting,
  showDropdownStatus,
  selectOptionStatus,
  selectOptionIcon,
  selectOptionColor,
  updateSelectStatusDropdown,
  handleStatusButton,
  selectOptionColorBox,
  saveSettings
} = useSettings();
</script>
<template>
  <div class="container-search">
    <SearchPicker
      placeholder="Search"
      margin-right-loader-icon="10px"
      input-search-id="searchGroupUds"
      :value="searchSettingValue"
      icon-left="search"
      @update="(event) => searchSetting(event)"
      size="medium"
      :show-loader="searchSettingValue.length > 0 && loaderStore.loadSearch"
    />
  </div>
  <div class="container-settings">
    <div class="container-system-status">
      <div class="title-and-buttom">
        <qtm-typography
          :font-size="7"
          classes="text-white-100"
          font-family="roboto"
        >
          System Status
        </qtm-typography>
      </div>
      <div class="container-alert">
        <div class="alert-info">
          <qtm-icon :class="selectOptionColor" size="medium" :icon="selectOptionIcon" />
          <qtm-typography
            class="text-white-100"
            :font-size="6"
            font-family="roboto"
          >
            Status: {{selectOptionStatus}}
          </qtm-typography>
        </div>
      </div>
      <div class="container-select-status">
        <qtm-typography
          :font-size="7"
          classes="text-white-100"
          font-family="roboto"
        >
          Select status
        </qtm-typography>
        <div style="margin: 5px"></div>
        <qtm-dropdown
          class="dropdown-status"
          @visible-change="showDropdownStatus = !showDropdownStatus"
          v-bind="{
            id: 'id_import_geometry_circle',
          }"
        >
          <qtm-dropdown-trigger :class="`button-large ${ selectOptionColorBox } hydrated`">
            <qtm-button
              variant="outline"
              color="neutral"
              :left-icon="selectOptionIcon"
              id="id-status-button"
              :label="selectOptionStatus"
            ></qtm-button>
          </qtm-dropdown-trigger>
          <qtm-icon
            class="icon-dropdown"
            @click="handleStatusButton"
            :icon="
              showDropdownStatus ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
            "
          />
          <qtm-dropdown-overlay style="z-index: 101" classes="min-width-100">
            <qtm-menu-item-list
              enable-auto-active
              @active-id-changed="(val: any) => updateSelectStatusDropdown(val)"
            >
            <qtm-menu-item id="NOMINAL" class="nominal-icon">
                <qtm-button
                  variant="ghost"
                  style="width: 100% !important"
                  left-icon="check_circle"
                  label="NOMINAL"
                ></qtm-button>
              </qtm-menu-item>
              <qtm-menu-item id="MAINTENANCE" class="maintenance-icon">
                <qtm-button
                  variant="ghost"
                  style="width: 100% !important"
                  left-icon="settings"
                  label="MAINTENANCE"
                ></qtm-button>
              </qtm-menu-item>
              <qtm-menu-item id="INCIDENT" class="incident-icon">
                <qtm-button
                  variant="ghost"
                  style="width: 100% !important"
                  left-icon="error"
                  label="INCIDENT"
                ></qtm-button>
              </qtm-menu-item>
              <qtm-menu-item id="OUTAGE" class="outage-icon">
                <qtm-button
                  variant="ghost"
                  style="width: 100% !important"
                  left-icon="warning"
                  label="OUTAGE"
                ></qtm-button>
              </qtm-menu-item>
            </qtm-menu-item-list>
          </qtm-dropdown-overlay>
        </qtm-dropdown>
      </div>

      <div class="container-button-status">
        <qtm-button
          variant="filled" 
          color="primary"
          label="Apply"
          @click="saveSettings"
        ></qtm-button>
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
.container-settings {
  width: 100%;
  background-color: rgb(28, 29, 38);
  height: calc(90vh - 97px);
  display: flex;
  position: absolute;
  flex-direction: column;
  z-index: 142;
}
.container-system-status {
  border: 1px solid #383a4b;
  width: 452px;
  height: 450px;
  background-color: #131319;
  margin-top: 24px;
  margin-left: 24px;
}
.title-and-buttom {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #383a4b;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px 15px 20px;
}
.container-alert {
  border-bottom: 1px solid #383a4b;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px 15px 20px;
}
.alert-info {
  display: flex;
  gap: 6px;
  padding: 12px;
  background-color: rgb(28, 29, 38);
  align-items: center;
  justify-content: center;
}
.container-select-status {
  padding: 15px 20px 15px 20px;
}
.container-button-status {
  padding: 15px 20px 15px 20px;
  margin-top: 148px;
  display: flex;
  justify-content: end;
}
.nominal-icon {
  color: green;
  font-size: 18px;
}
.incident-icon {
  color: #FF951A;
  font-size: 18px;
}
.maintenance-icon {
  color: #00BBDD;
  font-size: 18px;
}
.outage-icon {
  color: red;
  font-size: 18px;
}
.icon-dropdown {
  position: absolute;
  cursor: pointer;
  right: 5px;
  top: 10px;
  font-size: 20px;
  color: white !important;
}
</style>
