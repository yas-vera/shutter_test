<template>
    <div>
      <svg
        width="500"
        height="400"
        @mousedown="startDrawing"
        @mousemove="drawPolygon"
        @mouseup="endDrawing"
      >
        <polygon
          v-if="data.drawing"
          :points="data.polygonPoints"
          fill="lime"
          stroke="purple"
          stroke-width="2"
        />
      </svg>
    </div>
  </template>
  
  <script setup lang="ts">
import { reactive } from 'vue';

  const data = reactive({
    drawing: false,
    polygonPoints: "",
  });
  
  const startDrawing = (event:any) => {
    data.drawing = true;
    data.polygonPoints = `${event.offsetX},${event.offsetY}`;
  };
  
  const drawPolygon = (event:any) => {
    if (data.drawing) {
      data.polygonPoints += ` ${event.offsetX},${event.offsetY}`;
    }
  };
  
  const endDrawing = () => {
    data.drawing = false;
  };
  </script>
  