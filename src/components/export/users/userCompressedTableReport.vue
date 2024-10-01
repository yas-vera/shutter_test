<script setup lang="ts">
import { convertFormatDate } from '../../../helpers/convertDateTime';
const props = withDefaults(defineProps<{
    items: any
}>(), {
})

</script>

<template>
    <div style="width: 100%;">
        <table class="table-attributes" >
            <thead>
                <th style="min-width: 100px;">User ID</th>
                <th style="min-width: 75px;">UDS group</th>
                <th style="min-width: 75px;">Status</th>
                <th style="min-width: 75px;">Country</th>
                <th>Subscription date</th>
                <th>Licence Expiration date</th>
                <th style="min-width: 75px;">Mission ID</th>
                <th>Applicable rules</th>
            </thead>
            <tbody v-for="data in items" style="color: #000; font-family: Roboto; font-weight: 400">
                <td>{{ data.user_id }}</td>
                <td>{{ data.group_uds.group_name }}</td>
                <td>{{ data.status }}</td>
                <td>{{ data.country }}</td>
                <td>{{ convertFormatDate(data.creation_date) }}</td>
                <td>{{ convertFormatDate(data.license_expiration_date) }}</td>
                <td>
                    <div v-for="value in data.missions">
                        <div>{{ value.id }}</div>
                    </div>
                </td>
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
    width: 998px; 
    height: 0px; 
    left: 25px; 
    top: 140px;
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
