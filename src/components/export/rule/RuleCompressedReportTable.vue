<script setup lang="ts">
import { watchEffect } from 'vue';
import { convertFormatDate } from '../../../helpers/convertDateTime';
import { getValuesAndIds, getValuesAndIdsInCol } from "@/helpers/tableHelpers";
const props = withDefaults(defineProps<{
    items: any    
}>(), {
})
</script>

<template>
    <div class="number-activation" style="position: absolute; right: 27px; top: 85px; font-family: Roboto; font-weight: 400; font-size: 10px; color: #000;">
        <!-- Number of activations: 
        <br> ----- -->
    </div>
    <div class="RulesReportCompressedDetails" style="width: 1030px; height: 495px; position: relative; background: white">
        <table class="table-attributes" >
            <thead>
                <th>Rule ID</th>
                <th>Rule name</th>
                <th>Creation date</th>
                <th>Mission & <br>  sensor</th>
                <th>Acquisition <br> mode</th>
                <th>Rule type</th>
                <th>Validity time</th>
                <th>Sensing time</th>
                <th>Status</th>
                <th>N° <br>  of activations</th>
                <th style="width: 150px;">Comments</th>
            </thead>
            <tbody v-for="data in items" style="color: #000; font-family: Roboto; font-weight: 400">
                <td>{{ data.rule_id }}</td>
                <td>{{ data.rule_name }}</td>
                <td>{{ convertFormatDate(data.creation_date) }}</td>
                <td v-html="getValuesAndIdsInCol(data.missions, 'id')"></td>
                <td v-html="getValuesAndIdsInCol(data.acq_modes, 'id')"></td>
                <td>{{ data.rule_type === 'prohibitive'?'blocking':data.rule_type  }}</td>
                <td>
                    <span>Start {{ convertFormatDate(data.validity_start_time) }} </span>
                    <br>
                    <span>End {{ convertFormatDate(data.validity_end_time) }}</span>                      
                </td>
                <td>
                    <span>Start {{ convertFormatDate(data.sensing_start_time) }} </span>
                    <br>
                    <span>End {{ convertFormatDate(data.sensing_end_time) }}</span>                      
                </td>
                <td>{{ data.status }}</td>
                <td >{{ data.activation_count}}</td>
                
                <td>{{ data.comments }}</td>
            </tbody>
        </table>
    </div>
</template>

<style scoped>

.table-attributes {
    width: 998px; 
    height: 0px; 
    left: 25px; 
    top: 10px; 
    position: absolute;
}

.table-attributes th {
    padding-bottom: 10px;
    padding-top: 2px;
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
    color: black; 
    font-size: 10px; 
    font-family: Roboto; 
    font-weight: 700; 
    word-wrap: break-word;
    text-align: left;
    vertical-align: top; 
}
.table-attributes td {
    padding-bottom: 10px;
    padding-top: 2px;
    border-bottom: 0.50px #888888 solid;
    font-size: 9px;
    font-weight: 400;
    vertical-align: top; 
}
.line-bold{
    width: 998px;
    height: 0px;
    left: 25px;
    top: 20px;
    position: absolute;
    border: 1px black solid
}
.header-th-table {
    height: 9px; 
    top: 32px; 
    position: absolute; 
    color: black; 
    font-size: 8px; 
    font-family: Roboto; 
    font-weight: 700; 
    word-wrap: break-word
}
.body-td-table {
    color: black; 
    font-size: 7px; 
    font-family: Inter; 
    font-weight: 400; 
    word-wrap: break-word;
    display: inline-block;
}
</style>
