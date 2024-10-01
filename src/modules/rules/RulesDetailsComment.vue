<script setup  lang="ts">
import { computed, ref } from 'vue';
import {  validateLargeText } from '@/helpers/tableHelpers';
import { 
    QtmDivider,
    QtmIcon,
    QtmTypography,
    QtmDrawer,
    QtmButton,
    QtmMenuItemList,
    QtmMenuItem,
    QtmMenuItemLabel,
    QtmSubmenuItemList,
    QtmSubmenuItem,
    QtmDrawerHeader,
    QtmDrawerBody,
    QtmDrawerFooter,
    QtmTooltip

  } from "@qtm/vue";
import { useScreenStore } from '@/stores/screenStore';
const props = defineProps<{
  show: boolean;
  name: string;
  id: string | number;
  users?: string;
  udsGroups?: string;
  shcGroups?: string;
}>();
const emits = defineEmits(['close','minimize']);
const screenStore = useScreenStore();
interface IcloseOpen {
  users:boolean,
    udsGroups:boolean,
    shcGroups:boolean
}
const openClose = ref<IcloseOpen>(
  {
    users:false,
    udsGroups:false,
    shcGroups:false
  }
)
const handleOpenClose = (key: keyof IcloseOpen) => {
  openClose.value[key] = !openClose.value[key]; 
};
const maximiseOptions = ref(false);
const handleMaximiseOptions = () => {
  maximiseOptions.value = !maximiseOptions.value;
}
const responsiveHeight = computed(()=>{
  return screenStore.dimanicScreenHeight(410);
})
const maxHeightResposive = computed(()=>{
  if(screenStore.screenHeight < 800){
    return '260px';
  }
  return '450px';
})
const styleResponsive = computed(()=>{
  if(maximiseOptions.value){
    return {
      height: '93%',
      width: '100%',
      right: '0px',
      top: '64px'
    }
  }
  return {
    height: responsiveHeight.value + 'px',
    width: '350px',
    top: '321px',
    right: '20px',
  }
})

</script>
<template>
  
    <div class="container-rules-detail-comment modal-border-shadow"
          :style="{ top:styleResponsive.top,
                    height:styleResponsive.height,
                    width:styleResponsive.width,
                    right:styleResponsive.right
                    }" v-if="props.show">
        <div class="header-content-modal-comment" >
          
            <div class="container-header-comment">
              <div>
                <qtm-icon
                  icon="info"
                  variant="outlined"
                  size="medium"
                  classes="text-white-100"></qtm-icon>
                  
              </div>
              <div>
                <QtmTooltip
                  :content="$props.name"
                  orientation="left"
                  :position="'top'"
                  :trigger="'hover'"
                  :classes="'tooltip-custom'"
                  >
                  <QtmTypography :font-size="6"
                    font-weight="normal"
                    font-family="roboto"
                    classes="text-white-100">Rule details: {{ maximiseOptions?  $props.name:validateLargeText($props.name,15)}}</QtmTypography>
            </QtmTooltip>
                <qtm-typography
                    :font-size="6"
                    font-weight="normal"
                    font-family="roboto"
                    classes="text-white-50"
                   >
                   Rule ID: {{$props.id}}
                </qtm-typography>
              </div>
             
            </div>
            <div class="headerIcons">
              <qtm-icon @click="$emit('minimize')" icon="remove" size="medium" classes="text-bluegrey-100 margin-right cursor-pointer"
                ></qtm-icon>
              <qtm-icon @click="handleMaximiseOptions()" :icon="maximiseOptions?'close_fullscreen':'open_in_full'" size="medium" :classes="'text-bluegrey-100 margin-right cursor-pointer'"
                ></qtm-icon>
              <qtm-icon icon="close" @click="$emit('close')" size="medium" classes="text-bluegrey-100 cursor-pointer"
                ></qtm-icon>
            </div>
          </div>
          <QtmDivider></QtmDivider>
        <div class="container-body-comment" :style="{'max-height':maxHeightResposive}">
 
      <qtm-menu-item-list :size="'large'" class="drawer-content" >
       
        <qtm-menu-item :id="'id_'+props.id +'_user'" @clicked-menu-item="handleOpenClose('users')"  >
          <qtm-menu-item-label class="header-details">
            <div class="drawer-content-item">
              <qtm-typography>Users</qtm-typography>
             
            </div>
            <qtm-icon :icon="openClose.users? 'expand_more':'expand_less'" />
          </qtm-menu-item-label>
          <qtm-submenu-item-list >
            <div class="drawer-content-body">
              <qtm-typography
                    :font-size="6"
                    font-weight="normal"
                    font-family="roboto"
                    classes="text-white-100"
                   >
                   {{ props.users }}
                </qtm-typography>
             
            </div>
          </qtm-submenu-item-list>
        </qtm-menu-item>
        <qtm-menu-item
          :id="'id_'+props.id +'_uds_group'"
          @clicked-menu-item="handleOpenClose('udsGroups')"
          >
          <qtm-menu-item-label class="header-details">
            <div class="drawer-content-item">
              <qtm-typography>UDS groups</qtm-typography>
           
            </div>
            <qtm-icon :icon="openClose.udsGroups ? 'expand_more':'expand_less'" />
          </qtm-menu-item-label>
          <qtm-submenu-item-list>
            <div class="drawer-content-body">
              <qtm-typography
                    :font-size="6"
                    font-weight="normal"
                    font-family="roboto"
                    classes="text-white-100"
                   >{{ props.udsGroups }}
                  
                </qtm-typography>
             
            </div>
          </qtm-submenu-item-list>
        </qtm-menu-item>
        <qtm-menu-item
          :id="'id_'+props.id +'_shc_group'"
          @clicked-menu-item="handleOpenClose('shcGroups')"
          >
          <qtm-menu-item-label class="header-details">
            <div class="drawer-content-item">
              <qtm-typography>SHC groups</qtm-typography>
           
            </div>
            <qtm-icon :icon="openClose.shcGroups ? 'expand_more':'expand_less'" />
          </qtm-menu-item-label>
          <qtm-submenu-item-list>
            <div class="drawer-content-body">
              <qtm-typography
                    :font-size="6"
                    font-weight="normal"
                    font-family="roboto"
                    classes="text-white-100"
                   >
                   {{ props.shcGroups }}
                </qtm-typography>
             
            </div>
          </qtm-submenu-item-list>
        </qtm-menu-item>
      </qtm-menu-item-list>
   
      </div>
    </div>
  </template>
  
 
  
  <style scoped>
  .drawer-content{
    width: 100%;
    background-color: #252733;
  }
  .drawer-content-item{
    display: flex;
    justify-content: space-between;
  }
  .drawer-content-body{
    padding: 10px;
    background-color: #333344;
;
  }
  .header-details {
    background-color: #1C1D26;
  }
.header-content-modal-comment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px 10px 15px;
}
  .container-rules-detail-comment {
  position: absolute;
  top: 29.5%;
  /* right: 20px; */
  /* height: 568px; */
  width: 350px;
  background-color: black;
  z-index: 150;
}
.container-body-comment{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: 'top';
  align-items: first baseline;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #252733 #000000;

}
.container-header-comment{
  display: flex;
  gap: 5px;
}
  </style>
  