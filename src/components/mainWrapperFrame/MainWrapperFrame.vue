  <script setup lang="ts">
    import { computed,ref } from 'vue';
    import Footer from '../footer/Footer.vue';
    import Navbar from '../navbar/Navbar.vue';
    import Loading from '../Loading/Loading.vue';

  </script>

<template>
  <div class="main-wrapper">
    <Loading />
    <Navbar />
    <div class="content-wrapper" >
    <slot></slot>
  </div>
    <Footer />
  </div>
</template>
  

  
  <style>
  .main-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 96vh;
}

.content-wrapper {
  flex: 1; 
}
  </style>