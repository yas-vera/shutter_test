<script setup lang="ts">

const props = defineProps<{
  overviewGroup: number
}>();

</script>

<template>
    <div class="report-group14805">
        <div class="report-rectangle5726"></div>
        <div class="report-platinoimgformatoorizzontale">
            <img src="../../../assets/img/platino_2.jpeg" alt="platino" class="loginImage">
        </div>
    </div>

    <div class="report-overview">
        Overview
    </div>

    <div class="report-group14739">
        <div class="report-rectangle5729"></div>
        <div class="report-users report-users-1">
            {{ overviewGroup }} users
        </div>
    </div>
</template>
 
<style scoped>

.loginImage{
    max-width: 743px; 
    max-height: 475px; 
    aspect-ratio: 1/2; 
    object-fit: cover; 
    object-position: center 30%; 
    position: fixed; 
    width: 100%; 
    height: 100%; 
    margin-left: -15px;
    margin-top: -15px;
}

.report-group14805 {
    width: 545px;
    height: 364px;
    left: 25px;
    top: 186px;
    position: absolute;
}

.report-overview {
    width: 544px;
    height: 16px;
    left: 24px;
    top: 693px;
    position: absolute;
    color: black;
    font-size: 12px;
    font-family: Arial;
    font-weight: 400;
    word-wrap: break-word;
}


.report-rectangle5726 {
    width: 745px;
    height: 470px;
    left: 0px;
    top: 0px;
    position: absolute;
    /* background: #EEEEEE; */
}

.report-platinoimgformatoorizzontale {
    width: 447px;
    height: 16px;
    left: 17px;
    top: 15px;
    position: absolute;
    /* color: #0947E7; */
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    word-wrap: break-word;
}

.report-group14739 {
    width: 127px;
    height: 101px;
    left: 0px;
    top: 720px;
    position: absolute;
}

.report-rectangle5729 {
    width: 177px;
    height: 130px;
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
    font-family: Arial;
    word-wrap: break-word;
}

.report-users-1 {
    left: 25px;
    top: 40px;
    font-size: 20px;
    font-weight: 700;
}
</style>
