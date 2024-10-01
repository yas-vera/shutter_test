<script setup lang="ts">
import { convertTextTruncate } from '@/helpers/convertDateTime';
import { ref } from 'vue';

const date = ref('');
const currentDate = new Date();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
date.value = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

const props = withDefaults(defineProps<{
    title: string;
    customizableTitle: string;
    firstPage:boolean;
}>(), {
    title: 'Rules Report',
    customizableTitle: '[Customizable export title]',
    firstPage: false
});
</script>

<template>
    <!-- change height 120 -->
    <div :style="{ height: firstPage ? '220px' : '140px' }">
        <img class="report-logo-asi" src="../../../assets/export/logo_asi.png" alt="Asi logo" width="90" height="42.51" />

        <div class="report-line-img"></div>

        <img class="report-logo-thales" src="../../../assets/export/logo_tas.jpeg" />

        <div class="report-line-header"></div>

        <div class="report-date">PLATiNO SHUTTER CONTROL<br />{{ date }}</div>

        <div :class="firstPage ? 'report-title-header' : 'report-title'">
            <div class="report-title-description" >
                {{ props.title }}
            </div>

            <div :class="firstPage ? 'report-customizable-text' : 'report-customizable-text-subtitle'" :style="{marginTop: '-8px', width: firstPage ? '400px' : '980px'}">
                {{ convertTextTruncate(firstPage ? 40 : 160, props.customizableTitle) }} 
            </div>
        </div>
    </div>
</template>

<style scoped>
.report-logo-asi {
    left: 25px;
    top: 25px;
    position: absolute
}

.report-line-img {
    width: 27px;
    height: 0px;
    left: 130px;
    top: 33px;
    position: absolute;
    transform: rotate(90deg);
    transform-origin: 0 0;
    border: 0.50px #B9B9B9 solid
}

.report-logo-thales {
    width: 95px;
    height: 48px;
    left: 132px;
    top: 21px;
    position: absolute
}

.report-line-header {
    width: 998px;
    height: 0px;
    left: 25px;
    top: 80px;
    position: absolute;
    border: 0.50px #B9B9B9 solid
}

.report-date {
    width: 214px;
    height: 28px;
    left: 810px;
    top: 36px;
    position: absolute;
    text-align: right;
    color: black;
    font-size: 10px;
    font-family: "Arial-Regular", Helvetica, Arial;
    font-weight: 400;
    word-wrap: break-word
}

.report-title-header {
    width: 269px;
    height: 33px;
    left: 25px;
    top: 170px;
    position: absolute
}

.report-title {
    width: 269px;
    height: 33px;
    left: 25px;
    top: 96px;
    position: absolute
}

.report-title-description {
    color: black;
    font-size: 13px;
    font-family: Arial;
    font-weight: 400;
    word-wrap: break-word;
    margin-top: -10px;
}

.report-customizable-text {
    color: black;
    font-size: 17px;
    font-family: Arial;
    font-weight: 700;
    word-wrap: break-word;
    line-height: 15px;
    padding-top: 10px;
}

.report-customizable-text-subtitle {
    color: #000;
    font-family: Arial;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding-top: 9px;
    line-height: 13px;
}

</style>
