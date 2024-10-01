<script setup lang="ts">
import { watchEffect } from 'vue';
import { convertFormatDate } from '../../../helpers/convertDateTime';
import { getAllValuesAndIdsInCol, getValuesAndIds, getValuesAndIdsInCol } from "@/helpers/tableHelpers";
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
                <th>SR ID</th>
                <th>User ID</th>
                <th>Source Type</th>
                <th>Aoi ID</th>
                <th>Mission & <br>  sensor</th>
                <th>Acquisition <br> mode</th>
                <th>Rules</th>
                <th>Sensing time</th>
                <th>Event Date</th>
            </thead>
            <tbody v-for="data in items" style="color: #000; font-family: Roboto; font-weight: 400">
                <td>{{ data.sr_id ? data.sr_id : ' _ ' }}</td>
                <td>{{ data.user_id }}</td>
                <td>{{ data.source }}</td>
                <td v-html="getAllValuesAndIdsInCol(Array.isArray(data.aois) ? data.aois : [], 'aoi_id')"></td>
                <td v-html="getValuesAndIdsInCol(Array.isArray(data.mission) ? data.mission : [data.mission], 'id')"></td>
                <td v-html="getAllValuesAndIdsInCol(Array.isArray(data.aois) ? data.aois : [], 'acquisition_mode_id')"></td>
                <td >
                    <div  v-for="item in data.aois">
                        <div v-for="rule in item.rules">
                            <span>{{rule.rule_name}} </span>
                        </div> 
                    </div>

                </td>
                <td>
                    <div  v-for="item in data.aois">
                        <span>Start {{ convertFormatDate(item.sensing_start_time) }} </span>
                        <br>
                        <span>End {{ convertFormatDate(item.sensing_stop_time) }}</span>  
                    </div>
                   

                </td>
                <td>
                    <div  v-for="item in data.aois">
                        <span>{{ convertFormatDate(item.enforcement_time) }} </span> 
                    </div>
                    
                </td>
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
    padding-bottom: 14px;
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
    padding-bottom: 14px;
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
