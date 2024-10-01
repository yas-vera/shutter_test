<script setup lang="ts">
import { getValues, getValuesAndIds } from '@/helpers/tableHelpers';
import { convertFormatDate } from '../../../helpers/convertDateTime';
import { onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{
    groupCurrent: number
    groupTotal: number
    items: any
    group: string,
    pageQuantity: any
}>(), {
    groupCurrent: 1,
    groupTotal: 1,
})
onMounted(() => {
    continueIndex()
})
const currentIn = ref(0);
const continueIndex = () => {
    let sum = 0;
    for (let index = 0; index < props.groupCurrent; index++) {
        sum += props.pageQuantity[index].length;
    }
    currentIn.value = sum;
}
const calculateGroupIndex = (itemIndex: number) => {
  return currentIn.value + itemIndex + 1;
}
</script>

<template>
    <div class="container-grups-export">
        <div v-for="(item, index) in items" :key="index">
        <div class="text-wrapper">{{ group }} group {{ calculateGroupIndex(index) }} /{{ groupTotal }}</div>
        <div class="overlap-group-content">
            <div class="line-bold"></div>
            <div class="text-wrapper-custom">Group ID: <span class="span-wrapper-custom">{{ item.group_id }}</span></div>
            <div class="line"></div>
            <div class="text-wrapper-custom">Group name: <span class="span-wrapper-custom">{{ item.group_name }}</span></div>
            <div class="line"></div>
            <div class="text-wrapper-custom">Description: <span class="span-wrapper-custom">{{ item.description }}</span></div>
            <div class="line"></div>
            <div class="text-wrapper-custom">STANAG CODE: <span class="span-wrapper-custom">{{getValues(item.dynamic_user_assignment_stanag_id_list) }}</span></div>
            <div class="line"></div>
            <div class="text-wrapper-custom">
                Users ID: 
                <span class="span-wrapper-custom">{{getValuesAndIds(item.group_type == 'uds'? item.users_uds:item.users_shc, 'user_id') }}</span>
            </div>
            <div class="line"></div>
            <div class="text-wrapper-custom">Creation date: <span class="span-wrapper-custom">{{ convertFormatDate(item.creation_date) }}</span></div>
            <div class="line-bold"></div>
        </div>

    </div>
    </div>
    
</template>
 
<style scoped>
.container-grups-export {
    margin-top: 150px;
    position: absolute;
}
.text-wrapper {
    position: relative;
    width: 544px;
    margin-left: 25px;
    font-family: "Roboto-Bold", Helvetica;
    margin-bottom: 10px;
    font-weight: 700;
    color: #000000;
    font-size: 10px;
    letter-spacing: 0;
    line-height: normal;
}

.text-wrapper-custom {
    font-family: "Roboto-Bold", Helvetica;
    font-weight: 700;
    color: #000000;
    font-size: 10px;
    letter-spacing: 0;
    line-height: normal;
    margin-bottom: 11px;
}

.span-wrapper-custom {
    font-family: "Arial-Regular", Helvetica;
}

.overlap-group-content {
    position: relative;
    width: 746px;
    margin-left: 25px;
    margin-bottom: 20px; 
}

.line {
    width: 746px;
    height: 0;
    border: 0.1px #B9B9B9 solid;
    margin-bottom: 0px;
}

.line-bold {
    width: 746px;
    height: 0;
    border: 0.1px #000 solid;
    margin-bottom: 0px;
}

</style>
