<script setup lang="ts">

const props = defineProps<{
  overviewRules: any;
}>();


</script>

<template>
    <div class="UsersReportCover" style="width: 795px; height: 1120px; position: relative; background: white">

        <div class="TagBluegrey">
            <div class="IconLabel"
                style="padding-right: 4px; justify-content: flex-start; align-items: center; gap: 4px; display: flex">
                <div class="Label" style="color: #131319; font-size: 13px; font-family: Arial; font-weight: 400; line-height: 16px; word-wrap: break-word;position: relative;top: -7.5px;">
                    Compressed view</div>
            </div>
        </div>

        <div class="Overview">
            Overview
        </div>

        <div class="Group1">
            <div class="Rectangle5729"
                style="width: 127px; height: 101px; left: 25px; top: 0px; position: absolute; background: #EEEEEE; border: 0.50px rgba(0, 0, 0, 0) solid">
            </div>
            <div class="Rectangle5729"
                style="width: 127px; height: 101px; left: 170px; top: 0px; position: absolute; background: #EEEEEE; border: 0.50px rgba(0, 0, 0, 0) solid">
            </div>
          
            <div class="Users"
                style="width: 127px; height: 29px; left: 25px; top: 25px; position: absolute; text-align: center; color: black; font-size: 20px; font-family: Arial; font-weight: 700; word-wrap: break-word">
                {{ overviewRules.countRules }} rules</div>
            <div class="Users" style="width: 127px; height: 29px; left: 170px; top: 39px; position: absolute; text-align: center; color: black; font-size: 14px; font-family: Arial; font-weight: 400; word-wrap: break-word">
                <span class="textOverviewContainer" style="background-color: #991019">
                    <span class="textOverviewContent">
                        {{ overviewRules.countBlocking }} blocking  
                    </span>
                </span>
            </div>
        </div>

        <div class="Group2">
            <div class="Rectangle5729"
                style="width: 127px; height: 101px; left: 25px; top: 0px; position: absolute; background: #EEEEEE; border: 0.50px rgba(0, 0, 0, 0) solid">
            </div>
            <div class="Rectangle5729"
                style="width: 127px; height: 101px; left: 170px; top: 0px; position: absolute; background: #EEEEEE; border: 0.50px rgba(0, 0, 0, 0) solid">
            </div>
            <div class="Users"
                style="width: 127px; height: 29px; left: 25px; top:39px; position: absolute; text-align: center; color: black; font-size: 14px; font-family: Arial; font-weight: 400; word-wrap: break-word">
                <span class="textOverviewContainer" style="background-color: #988316">
                    <span class="textOverviewContent">
                        {{ overviewRules.countTracking }} tracking
                    </span>
                </span>
            </div>
            <div class="Users"
                style="width: 127px; height: 29px; left: 170px; top: 39px; position: absolute; text-align: center; color: black; font-size: 14px; font-family: Arial; font-weight: 400; word-wrap: break-word">
                <span class="textOverviewContainer" style="background-color: #136D39">
                    <span class="textOverviewContent">
                        {{ overviewRules.countPermissive }} permissive
                    </span>
                </span>
            </div>
        </div>

        <div class="Group14805">
            <div class="Rectangle5726"
                style="width: 580px; height: 412px; left: 0px; top: 0px; position: absolute;"></div>
            <div class="PlatinoImgFormatoOrizzontale"
                style="width: 467px; height: 16px; left: 122px; top: 20px; position: absolute; font-size: 14px; font-family: Arial; font-weight: 400; word-wrap: break-word">
                <img src="../../../assets/img/report_platino.jpg" alt="platino" class="loginImage">
            </div>
        </div>
    </div>
</template>

<style scoped>

.loginImage{
    margin-left: -15px;
    margin-top: -15px;
    /* max-height: 390px;  */
}

.TagBluegrey{
    padding-top: 4px; 
    padding-bottom: 4px; 
    padding-left: 8px; 
    padding-right: 4px; 
    left: 25px; 
    top: -8px; 
    position: absolute; 
    background: #DEDEE6; 
    border-radius: 2px; 
    justify-content: flex-start; 
    align-items: center; 
    display: inline-flex
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

.Overview{
    width: 544px; 
    height: 16px; 
    left: 24px; 
    top: 25px; 
    position: absolute; 
    color: black; 
    font-size: 12px; 
    font-family: Arial; 
    font-weight: 400; 
    word-wrap: break-word
}

.Group1{
    width: 500px; 
    height: 101px; 
    left: 0px; 
    top: 70px; 
    position: absolute
}

.Group2{
    width: 500px; 
    height: 101px; 
    left: 0px; 
    top: 187px; 
    position: absolute
}

.Group14805{
    width: 580px; 
    height: 264px; 
    left: 330px; 
    top: -115px; 
    position: absolute
}
/* .Group14805{
    width: 580px; 
    height: 264px; 
    left: 330px; 
    top: -115px; 
    position: absolute
} */


</style>
