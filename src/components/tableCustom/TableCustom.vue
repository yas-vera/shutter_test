<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount, watchEffect } from "vue";
const tableCardMinHeight = ref(550);
const adjustTableMinHeight = () => {
  const screenWidth = window.innerWidth;
  const scrennHeghit = window.innerHeight;
  const customHeight= scrennHeghit - 40 - 233;
  tableCardMinHeight.value = customHeight;
};
onMounted(() => {
  adjustTableMinHeight();

  window.addEventListener("resize", adjustTableMinHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", adjustTableMinHeight);
});
watchEffect(() => {
  adjustTableMinHeight();
});
</script>

<template>
    <div class="udsGroupStyle" :style="'height:' + tableCardMinHeight + 'px'">
        <div style="display: flex; justify-content: space-between; margin-right: 16px; margin-left: 24px; margin-top: 2px;">
           <slot name="headerCardContainer">

           </slot>
        </div>
        <div class="card-container-custom" >
               <slot name="bodyCardContainer"></slot>
        </div>
        <div class="pagination-container">
            <slot name="paginationCardContainer"></slot>
           
        </div>
    </div>
</template>
<style scoped>
.pagination-container {
  position: absolute;
  bottom: 0;
  /* right: 0; */
  margin-right: 10px;
  margin-left: 24px;
  width: 100%;
}


</style>