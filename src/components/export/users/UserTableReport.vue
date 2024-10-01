<script setup lang="ts">
import { watchEffect } from 'vue';
import { convertFormatDate } from '../../../helpers/convertDateTime';
import { groupRuleset } from '@/helpers/tableHelpers';

const props = withDefaults(defineProps<{
    items: any
}>(), {
})

</script>

<template>
    <div style="width: 100%;">
        <table class="table-attributes" >
            <thead>
                <th style="width: 75px;">User <br> ID</th>
                <th style="width: 75px;">Status</th>
                <th>Subscription <br> date</th>
                <th style="width: 75px;">Country</th>
                <th style="width: 75px;">UDS <br> group</th>
                <th style="width: 75px;">Mission <br> ID</th>
                <th>Licence <br>Expiration <br>date</th>
                <th>Applicable <br>rules</th>
            </thead>
            <tbody v-for="data in items">
                <td>{{ data.user_id }}</td>
                <td>{{ data.status }}</td>
                <td>{{ convertFormatDate(data.creation_date) }}</td>
                <td>{{ data.country }}</td>
                <td>{{ data.group_uds.group_name }}</td>
                <td>
                    <div v-for="value in data.missions">
                        <div>{{ value.id }}</div>
                    </div>
                </td>
                <td>{{ convertFormatDate(data.license_expiration_date) }}</td>
                <td>
                    <div v-for="(rule, index) in data.rule_set" :key="rule.rule_id">
                        <div>{{  rule.rule_name }}</div>
                    </div>                   
                </td>
            </tbody>
        </table>
    </div>
</template>

<style scoped>

.table-attributes {
    width: 746px; 
    height: 0; 
    max-height: 760px;
    left: 25px; 
    top: 140px; 
    position: absolute;
}
.table-attributes th {
    padding-bottom: 7px;
    padding-top: 7px;
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
    color: black; 
    font-size: 8px; 
    font-family: Roboto; 
    font-weight: 700; 
    word-wrap: break-word;
    text-align: left; 
    vertical-align: top; 
}
.table-attributes td {
    padding-bottom: 10px;
    padding-top: 7px;
    border-bottom: 0.50px #888888 solid;
    font-size: 7px;
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
