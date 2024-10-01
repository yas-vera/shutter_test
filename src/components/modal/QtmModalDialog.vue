<script setup lang="ts">
import {
  QtmButton,
  QtmModal,
  QtmModalHeader,
  QtmModalTitle,
  QtmIcon,
  QtmTypography,
  QtmModalBody
} from "@qtm/vue";
const props = defineProps<{
  isModalOpen: boolean
  title:string
  icon:string
}>();
const emits = defineEmits<{
    (e: 'openOption', option: boolean): void
}>();
const openCloseModal = (value:boolean) => {
    emits('openOption',value)
}
</script>
<template>
    <qtm-modal
    :open="props.isModalOpen"
    :size="'large'"
    :overlay="false"
    :classes="'maintenanceMessage'"
    overlay-style="trueStyle"
    @close-modal="openCloseModal(false)"
  >

    <qtm-modal-header :close-icon="true" :classes="'border-x-medium border-t-medium border-dark-danger-default'"  >
      <qtm-modal-title>
        <qtm-icon :icon="props.icon" size="xlarge" variant="outlined"  />
          <qtm-typography>{{props.title}}</qtm-typography>
      </qtm-modal-title>
    </qtm-modal-header>
    <qtm-modal-body :classes="'border-x-medium border-dark-danger-default'">
      <div class="maintenanceMessage">
        <slot name="body"></slot>
      </div>
    </qtm-modal-body> 
    <div class="qtm-modal-footer  border-x-medium border-b-medium border-dark-danger-default footerModal" >
      <qtm-button variant="filled" @clickEvent="openCloseModal(false)"  color="primary" >Close</qtm-button>
    </div>
  </qtm-modal>

</template>
<style scoped>
.maintenanceMessage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.footerModal {
  justify-content: center;
}
</style>