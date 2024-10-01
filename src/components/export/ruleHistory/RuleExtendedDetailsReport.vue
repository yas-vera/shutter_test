<script setup lang="ts">
import { convertFormatDate } from "@/helpers/convertDateTime";
import { getValuesAndIds } from "@/helpers/tableHelpers";
import { useExportStore } from "@/stores/exportStore";
import { useMapViewStore } from "@/stores/mapViewStore";
import { useRulesStore } from "@/stores/rulesStore";
import html2canvas from "html2canvas";
import { computed } from "vue";
import { onMounted, ref, watch, watchEffect } from "vue";
const props = withDefaults(defineProps<{
    srCurrent: number
    srTotal: number
    items: any
    imageGroup1:any
    imageGroup2:any
}>(), {
    srCurrent: 1,
    srTotal: 1,
})

const rulesStore = useRulesStore()
const mapImageGroup1Url = ref('');
const mapImageGroup1Url2 = ref('');
const zoom1 = ref<number>(0);
const zoom2 = ref<number>(0);

onMounted(() => {
    getDataUrl()
    getDataUrl2()
});

const getDataUrl = async() => {
    // let data = props.imageGroup1.find( (x:any) => x.id.toString() == props.items.sr_id.toString())
    let data = props.imageGroup1.find((x: any) => {
        return (x.id.toString() === props.items.sr_id?.toString()) &&
                (x.id === "N/A" && props.items.sr_id === null);
        });
    if (!data) {
            data = props.imageGroup1.find((x: any) => {
                return props.items.aois.some((aoi: any) => x.id.toString() === aoi.aoi_id);
            });
    }
    if (data) {
        mapImageGroup1Url.value = data.url;
        zoom1.value = Number(data.zoom?.toFixed(2));
    }
    // mapImageGroup1Url.value = data?.url 
    // zoom1.value = Number(data?.zoom?.toFixed(2));
}
const getDataUrl2 = async() => {
    // let data = props.imageGroup2.find( (x:any) => x.id.toString() == props.items.sr_id.toString())
    let data = props.imageGroup2.find((x: any) => {
  return (x.id.toString() === props.items.sr_id?.toString()) &&
         (x.id === "N/A" && props.items.sr_id === null);
    });
     if (!data) {
        data = props.imageGroup2.find((x: any) => {
            return props.items.aois.some((aoi: any) => x.id.toString() === aoi.aoi_id);
        });
    }
    if (data) {
        mapImageGroup1Url2.value = data.url;
        zoom2.value = Number(data.zoom?.toFixed(2));
    }
    // mapImageGroup1Url2.value = data?.url 
    // zoom2.value = Number(data?.zoom?.toFixed(2)); 
}

const aoisSelected = computed(() => rulesStore.aoiSelected.filter((x:any) => x.sr_id == props.items.sr_id));

</script>

<template>
    <div class="filtering-history">
        <div class="div">
            <div class="overlap-group">
                <img :src="mapImageGroup1Url" class="image-group" alt="Captured Map Image">
                <strong class="zoom">Zoom: {{ zoom1 }}</strong>
            </div>
            <div class="overlap-group-2">
                <img :src="mapImageGroup1Url2" class="image-group" alt="Captured Map Image">
                <strong class="zoom">Zoom: {{ zoom2 }}</strong>
            </div>
            <div class="text-wrapper">SR {{ srCurrent }} /{{ srTotal }}</div>

            <div class="overlap-group-content">
                <div class="text-wrapper-custom">History</div>
                <div class="line-bold"></div>

                <div class="text-wrapper-custom">SR ID: <span class="span-warpper-custom">{{ items.sr_id ?  items.sr_id : ' - ' }}</span></div>
                <div class="line"></div>
                <div class="text-wrapper-custom">User ID: <span class="span-warpper-custom">{{ items.user_id }}</span>
                </div>
                <div class="line"></div>
                <div class="text-wrapper-custom">Source type: <span class="span-warpper-custom">{{ items.source
                        }}</span></div>
                <div class="line-bold"></div>
                <div v-for="(item,index) in items.aois">
                    <div  v-if="index == 0">
                        <div class="text-wrapper-custom ">Aoi ID: 
                            <span class="span-warpper-custom" v-for="(aoi,idx) in aoisSelected">
                                {{ aoi.aoi_id }}
                                <span v-if="idx !== aoisSelected.length - 1">, </span>
                            </span>
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom ">Mission & sensor: <span
                                class="span-warpper-custom">{{getValuesAndIds([items.mission], 'id')}}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom ">Acquisition mode: <span
                                class="span-warpper-custom">{{ item.acquisition_mode_id }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom ">Rule name: 
                            <span v-for="value in item.rules" class="span-warpper-custom" style="margin-right: 10px;">{{ value.rule_name }} </span>
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom ">Rule type: 
                            <span v-for="value in item.rules" class="span-warpper-custom" style="margin-right: 10px;">{{ value.rule_type === 'prohibitive'?'blocking':value.rule_type}} </span>       
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom " style="height: 34px;">
                            <div style="display: flex;">
                                <span class="wrapper-custom">Sensing time: </span>
                                <div style="padding-left: 3px;">
                                    <span class="span-warpper-custom">Start - {{convertFormatDate(item.sensing_start_time)}}</span>
                                    <br>
                                    <span class="span-warpper-custom">End - {{convertFormatDate(item.sensing_stop_time)}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom ">Event date: <span
                                class="span-warpper-custom">{{convertFormatDate(item.enforcement_time)}}</span></div>
                        <div class="line-bold"></div>
                    </div>
                </div>
            </div>

            <div class="overlap-group-content-2">
                <div class="text-wrapper-custom">Rule attributes</div>
                <div class="line-bold"></div>
                <div v-for="(item,index) in items.aois">
                    <div v-for="value in item.rules" v-if="index == 0">
                        <div class="text-wrapper-custom">Rule ID: <span class="span-warpper-custom">{{ value.rule_id
                                }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Rule name: <span class="span-warpper-custom">{{ value.rule_name
                                }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Creation date: <span class="span-warpper-custom">{{
                            convertFormatDate(value.creation_date) }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Mission & sensor: <span class="span-warpper-custom">{{ getValuesAndIds([items.mission], 'id') }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Acquisition mode: <span class="span-warpper-custom">{{
                            item.acquisition_mode_id }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Rule type: <span class="span-warpper-custom">{{ value.rule_type === 'prohibitive'?'blocking':value.rule_type
                                }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom" style="height: 34px;">
                            <div style="display: flex;">
                                <span class="wrapper-custom">Validity time: </span>
                                <div style="padding-left: 3px;">
                                    <span class="span-warpper-custom">Start - {{
                                        convertFormatDate(value.validity_start_time) }}</span>
                                    <br>
                                    <span class="span-warpper-custom">End - {{
                                        convertFormatDate(value.validity_end_time)
                                        }}</span>
                                </div>
                                <br>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom" style="height: 34px;">
                            <div style="display: flex;">
                                <span class="wrapper-custom">Sensing time: </span>
                                <div style="padding-left: 3px;">
                                    <span class="span-warpper-custom">Start - {{
                                        convertFormatDate(value.sensing_start_time)
                                    }}</span>
                                    <br>
                                    <span class="span-warpper-custom">End - {{ convertFormatDate(value.sensing_end_time)
                                        }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Status: <span class="span-warpper-custom">{{ value.status
                                }}</span>
                        </div>
                        <div class="line"></div>
                        <div style="height: 100px;">
                            <div class="text-wrapper-custom">Comments: <span class="span-warpper-custom">{{
                                value.comments
                                    }}</span></div>
                        </div>
                        <div class="line-bold"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.data-count {
    font-weight: 100;
}

.table-attributes {
    width: 370px;
}

.zoom{
    position: absolute; 
    right: 3px; 
    top:175px; 
    font-family: "Roboto-Bold", Helvetica;
    font-weight: 700;
    font-size: 12px;
}

.image-group{
    aspect-ratio: auto; 
    object-fit: contain; 
    object-position: center 30%; 
    width: 100%; 
    height: 100%; 
    /* padding: 5px */
}

.table-attributes th {
    padding-bottom: 7px;
    padding-top: 7px;
    border-bottom: 1px solid #ddd;
}

.filtering-history {
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
}

.filtering-history .div {
    background-color: #ffffff;
    width: 791px;
    position: relative;
    top: 40px;
}

.filtering-history .overlap-group {
    position: absolute;
    width: 366px;
    height: 200px;
    top: 141px;
    left: 25px;
    background-color: #eeeeee;
}

.filtering-history .overlap-group-2 {
    position: absolute;
    width: 366px;
    height: 200px;
    top: 141px;
    left: 405px;
    background-color: #eeeeee;
}

.filtering-history .text-wrapper {
    position: absolute;
    width: 544px;
    top: 116px;
    left: 25px;
    font-family: "Roboto-Bold", Helvetica;
    font-weight: 700;
    color: #000000;
    font-size: 10px;
    letter-spacing: 0;
    line-height: normal;
}

.filtering-history .overlap-group-content {
    position: absolute;
    width: 366px;
    height: 200px;
    top: 350px;
    left: 25px;
}

.filtering-history .overlap-group-content-2 {
    position: absolute;
    width: 366px;
    height: 200px;
    top: 350px;
    left: 405px;
}

.filtering-history .text-wrapper-custom {
    font-family: "Roboto-Bold", Helvetica;
    font-weight: 700;
    color: #000000;
    font-size: 10px;
    letter-spacing: 0;
    line-height: normal;
    margin-bottom: 11px;
}

.filtering-history .wrapper-custom {
    font-family: "Roboto-Bold", Helvetica;
    font-weight: 700;
    color: #000000;
    font-size: 10px;
    letter-spacing: 0;
    line-height: normal;
}

.filtering-history .text-wrapper-custom-padding-left {
    padding-left: 27px;
}

.filtering-history .line {
    width: 366px;
    height: 0;
    border: 0.1px #B9B9B9 solid;
    margin-bottom: 0px;
}

.filtering-history .line-bold {
    width: 366px;
    height: 0;
    border: 0.1px #000 solid;
    margin-bottom: 0px;
}

.filtering-history .span-warpper-custom {
    font-family: "Arial-Regular", Helvetica;
}
</style>
