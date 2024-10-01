<script setup lang="ts">
import { useMapViewStore } from "@/stores/mapViewStore";
import { useRulesStore } from "@/stores/rulesStore";
import {
  QtmTypography,
} from "@qtm/vue";
//41'24'12.2N2'10'23.5'E
const mapViewStore = useMapViewStore()
</script>
<template>
    <footer class="footer">
      <qtm-typography :font-size="7" font-weight="normal" font-family="roboto">Thales Alenia Space | PLATiNO Shutter Control © all rights reserved</qtm-typography>
      <qtm-typography :font-size="7" font-weight="normal" font-family="roboto">{{ mapViewStore.positionInMap }}</qtm-typography>
    </footer>
  </template>
   
  <style scoped>
    .footer {
    background-color: #252733;
    color: #ffffff;
    padding: 10px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 40px
  }
  .font-footer-custom {
    font-size: 12px;
    line-height: 14.06px;
    font-weight: 400;
    color: #ffffff;
  }
  </style>
  