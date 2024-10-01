<script setup lang="ts">

const props = defineProps<{
  overviewRules: any;
  customizableTitle: string;
}>();

</script>

<template>
    <div class="report-tagbluegrey" :style="{top: customizableTitle.length > 77 ? '168px' : '148px'}">
        <div class="report-iconlabel">
            <div class="report-label">
                Extended view
            </div>
        </div>
    </div>

    <div class="report-group">
        <img src="../../../assets/img/report_platino.jpg" alt="platino" class="loginImage">
    </div>

    <div class="report-overview">
        Overview
    </div>

    <div class="report-group14739">
        <div class="report-rectangle5729"></div>
        <div class="report-rectangle5729"></div>
        <div class="report-rectangle5729"></div>
        <div class="report-rectangle5729"></div>
        <div class="report-users report-users-1">{{ overviewRules.countAois }} AOIs</div>
        <div class="report-users report-users-2">
            <span class="textOverviewContainer" style="background-color: #991019">
                <span class="textOverviewContent">
                    {{ overviewRules.countBlocking }} blocking  
                </span>
            </span>   
        </div>
        <div class="report-users report-users-3">
            <span class="textOverviewContainer" style="background-color: #988316">
                <span class="textOverviewContent">
                    {{ overviewRules.countTracking }} tracking
                </span>
            </span>            
        </div> 
        <div class="report-users report-users-4">
            <span class="textOverviewContainer" style="background-color: #136D39">
                <span class="textOverviewContent">
                    {{ overviewRules.countPermissive }} Permissive
                </span>
            </span>   
        </div>
    </div>
</template>
 
<style scoped>

.loginImage{
    margin-left: -15px;
    margin-top: -15px;
}

.textOverviewContainer{
    color: #EEEFF3; 
    border-radius: 20px; 
    padding-left: 10px; 
    padding-right: 10px; 
    padding-top: 4px; 
    padding-bottom: 4px;
}
.textOverviewContent{
    position: relative; 
    top: -8px; 
    width: auto
}

.report-tagbluegrey {
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 8px;
    padding-right: 4px;
    left: 25px;
    position: absolute;
    background: #DEDEE6;
    border-radius: 2px;
    justify-content: flex-start;
    align-items: center;
    display: inline-flex;
}

.report-iconlabel {
    height: 16px;
    padding-right: 4px;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    display: flex;
}

.report-label {
    color: #131319;
    font-size: 13px;
    font-family: Arial;
    font-weight: 400;
    line-height: 16px;
    word-wrap: break-word;
    position: relative;
    top: -7.5px;
}

.report-group14805 {
    width: 545px;
    height: 364px;
    left: 25px;
    top: 186px;
    position: absolute;
}

.report-rectangle5726 {
    width: 745px;
    height: 470px;
    left: 0px;
    top: 0px;
    position: absolute;
    /* background: #EEEEEE; */
}

.report-group {
    width: 467px;
    height: 364px;
    position: absolute;
    margin-top: 190px;
    margin-left: 179.2px
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

.report-rectangle5729:nth-child(2) {
    left: 170px;
}

.report-rectangle5729:nth-child(3) {
    left: 316px;
}

.report-rectangle5729:nth-child(4) {
    left: 462px;
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
    left: 0px;
    top: 25px;
    font-size: 20px;
    font-weight: 700;
}

.report-users-2 {
    left: 144px;
    top: 39px;
    font-size: 14px;
    font-weight: 400;
}

.report-users-3 {
    left: 292px;
    top: 39px;
    font-size: 14px;
    font-weight: 400;
}

.report-users-4 {
    left: 436px;
    top: 39px;
    font-size: 14px;
    font-weight: 400;
}
</style>
