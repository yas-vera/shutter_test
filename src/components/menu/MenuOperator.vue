<script setup lang="ts">
</script>
<template>
    <div  class="menu">
      <div class="leftMenu">
        <slot name="leftMenu"></slot>
      </div>
      <div>
        <slot name="leftMenuDiv"></slot>
      </div>
      <div  class="rightMenu">
        <slot name="rightMenu"></slot>
      </div>
    </div>
  </template>
  
  <style scoped>
    .menu {
    background-color: #131319;
    color: #ffffff;
    padding: 28px 23px 0px 23px;
    height: 100px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    position: relative;
    bottom: 0;
    width: 100%;
  }
  .leftMenu{
    display: flex;
    gap: 20px;
    justify-content: left;
  }
  .rightMenu{
    display: flex;
    gap: 20px;
    justify-content: right;
  }
  .inputSearch{
    width: 349px;
  }
  .buttonSearh{
    width: 56px;
    background-color: #333344;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  