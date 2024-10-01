<script setup lang="ts">

const props = defineProps<{
  group: string;
  overviewGroup: number
}>();

</script>

<template>
    <div class="report-group">
        <img src="../../../assets/img/report_platino.jpg" alt="platino" class="loginImage">
    </div>

    <div class="report-overview">
        Overview
    </div>

    <div class="report-group14739">
        <div class="report-rectangle5729"></div>
        <div class="report-users report-users-1">
            {{ overviewGroup }} {{  group.toUpperCase() }}
            <br>
            groups
        </div>
    </div>
</template>
 
<style scoped>

.loginImage{
    margin-left: -15px;
    margin-top: -15px;
    text-align: center
}

.report-overview {
    width: 544px;
    height: 16px;
    left: 24px;
    top: 765px;
    position: absolute;
    color: black;
    font-size: 12px;
    font-family: Arial;
    font-weight: 400;
    word-wrap: break-word;
}

.report-group {
    width: 467px;
    height: 364px;
    position: absolute;
    margin-top: 190px;
    margin-left: 179.2px
}

.report-group14739 {
    width: 127px;
    height: 101px;
    left: 0px;
    top: 800px;
    position: absolute;
}

.report-rectangle5729 {
    width: 127px;
    height: 101px;
    left: 25px;
    top: 0px;
    position: absolute;
    background: #EEEEEE;
    border: 0.50px rgba(0, 0, 0, 0) solid;
}

.report-users {
    width: 177px;
    height: 29px;
    position: absolute;
    text-align: center;
    color: black;
    font-family: "Inter-Bold", Helvetica;
    word-wrap: break-word;
}

.report-users-1 {
    left: 0px;
    top: 10px;
    font-size: 20px;
    font-weight: 700;
}
</style>
