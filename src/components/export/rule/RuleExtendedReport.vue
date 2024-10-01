<script setup lang="ts">
import { convertFormatDate } from "@/helpers/convertDateTime";
import { getValuesAndIds } from "@/helpers/tableHelpers";
import { useExportStore } from "@/stores/exportStore";
import { useMapViewStore } from "@/stores/mapViewStore";
import html2canvas from "html2canvas";
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

const exportStore = useExportStore()
const mapViewStore = useMapViewStore()
const mapImageGroup1Url = ref('');
const mapImageGroup1Url2 = ref('');
const zoom1 = ref<number>(0);
const zoom2 = ref<number>(0);
const polygonPoints =  ref<any>([])
onMounted(() => {
    getDataUrl()
    getDataUrl2()
    if (props.items.geometry.geometry_type === 'polygon' && !props.items.country) {
        polygonPoints.value = parseWKTPolygon(props.items.geometry.area_wkt)
    }
});
const parseWKTPolygon = (wkt:string) => {
    const cleanedWKT = wkt.replace('POLYGON ((', '').replace('))', '');
    const coordinates = cleanedWKT.split(', ');
    
    return coordinates.map(coord => {
        const [lon, lat] = coord.split(' ').map(Number);
        return { lat, lon };
    });
}
const getDataUrl = async() => {
    let data = props.imageGroup1.find( (x:any) => x.id.toString() == props.items.rule_id.toString())
    mapImageGroup1Url.value = data?.url 
    zoom1.value = Number(data?.zoom?.toFixed(2));
}
const getDataUrl2 = async() => {
    let data = props.imageGroup2.find( (x:any) => x.id.toString() == props.items.rule_id.toString())
    mapImageGroup1Url2.value = data?.url 
    zoom2.value = Number(data?.zoom?.toFixed(2));
}
  
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
            <div class="text-wrapper">Rule {{ srCurrent }} /{{ srTotal }}</div>
            <div class="overlap-group-content">
                <div class="text-wrapper-custom">Rule attributes</div>
                <div class="line-bold"></div>
             
                        <div class="text-wrapper-custom">Rule ID: <span class="span-warpper-custom">{{ items.rule_id
                                }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Rule name: <span class="span-warpper-custom">{{ items.rule_name
                                }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Creation date: <span class="span-warpper-custom">{{
                            convertFormatDate(items.creation_date) }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Mission & sensor: <span class="span-warpper-custom">{{
                            getValuesAndIds(items.missions, 'id') }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Acquisition mode: <span class="span-warpper-custom">{{
                            getValuesAndIds(items.acq_modes, 'id') }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Rule type: <span class="span-warpper-custom">{{ items.rule_type === 'prohibitive'?'blocking':items.rule_type
                                }}</span></div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom " style="height: 34px;">
                            <div style="display: flex;">
                                <span class="wrapper-custom">Validity time: </span>
                                <div style="padding-left: 3px;">
                                    <span class="span-warpper-custom">Start - {{
                                        convertFormatDate(items.validity_start_time) }}</span>
                                    <br>
                                    <span class="span-warpper-custom">End - {{
                                        convertFormatDate(items.validity_end_time)
                                        }}</span>
                                </div>
                                <br>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom " style="height: 34px;">
                            <div style="display: flex;">
                                <span class="wrapper-custom">Sensing time: </span>
                                <div style="padding-left: 3px;">
                                    <span class="span-warpper-custom">Start - {{
                                        convertFormatDate(items.sensing_start_time)
                                    }}</span>
                                    <br>
                                    <span class="span-warpper-custom">End - {{ convertFormatDate(items.sensing_end_time)
                                        }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="text-wrapper-custom">Status: <span class="span-warpper-custom">{{ items.status
                                }}</span>
                        </div>
                        <div class="line"></div>
                        <div style="height: 100px;">
                            <div class="text-wrapper-custom">Comments: <span class="span-warpper-custom">{{
                                items.comments
                                    }}</span></div>
                        </div>
                        <div class="line-bold"></div>
                 
            </div>
           <!-- Geometry - Polygon Section -->
           <div v-if="(items.geometry.geometry_type === 'polygon' && items.country === null)" class="overlap-group-content-2">
                <div class="text-wrapper-custom">Geometry - Polygon</div>
                <div class="line-bold"></div>
                <table class="table-stlye-custom">
                    <thead>
                        <tr>
                            <th ><div class="text-wrapper-custom">ID</div></th>
                            <th ><div class="text-wrapper-custom">LAT</div></th>
                            <th ><div class="text-wrapper-custom">LON</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(point, index) in polygonPoints" :key="point.id">
                            <template v-if="index < 18">
    
                                <td v-if="index < 17">
                                    <div class="text-wrapper-custom">
                                        <span class="span-warpper-custom">{{ index + 1 }}</span>
                                    </div>
                                </td>
                                <td v-if="index < 17">
                                    <div class="text-wrapper-custom">
                                        <span class="span-warpper-custom">{{ point.lat }}</span>
                                    </div>
                                </td>
                                <td v-if="index < 17">
                                    <div class="text-wrapper-custom">
                                        <span class="span-warpper-custom">{{ point.lon }}</span>
                                    </div>
                                </td>
                                <td colspan="3" v-if="index === 17">
                                    <div class="text-wrapper-custom">
                                        <span class="span-warpper-custom">
                                            Only the first points are shown. Additional points are not displayed due to the large number of coordinates in this geometry.
                                        </span>
                                    </div>                                 
                                </td>
                            </template>

                        </tr>
                    </tbody>
                </table>
                <div class="line-bold" style="margin-top: 3px;"></div> 
                <div class="text-wrapper-custom"><span class="span-warpper-custom">Number of activations: {{ items.activation_count }}</span></div>
         
            </div>

            <!-- Geometry - Circle Section -->
            <div v-if="items.geometry.geometry_type === 'circle'" class="overlap-group-content-2">
                <div class="text-wrapper-custom">Geometry - Circle</div>
                <div class="line-bold"></div>
                <table class="table-stlye-custom">
                    <thead>
                        <tr>
                            <th ><div class="text-wrapper-custom">Center</div></th>
                            <th ><div class="text-wrapper-custom">LAT</div></th>
                            <th ><div class="text-wrapper-custom">LON</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr >
                            <td ><div class="text-wrapper-custom"><span class="span-warpper-custom">1</span></div></td>
                            <td ><div class="text-wrapper-custom"><span class="span-warpper-custom">{{ items.geometry.center.latitude }}</span></div></td>
                            <td ><div class="text-wrapper-custom"><span class="span-warpper-custom">{{ items.geometry.center.longitude }}</span></div></td>
                        </tr>
                        
                    </tbody>
                </table>
                <div class="text-wrapper-custom">Radius: <span class="span-warpper-custom">{{ items.geometry.radius_km }}</span></div>
                <div class="line-bold"></div>
                <div class="text-wrapper-custom" style="margin-top: 275px;">Statistics</div>
                <div class="line-bold"></div> 
                <div class="text-wrapper-custom"><span class="span-warpper-custom">Number of activations: {{ items.activation_count }}</span></div>
                <div class="line-bold" style="margin-top: 70px;"></div> 
            </div>

            <!-- Geometry - Country Section -->
            <div v-if="items.country !== null" class="overlap-group-content-2">
                <div class="text-wrapper-custom">Geometry - Country</div>
                <div class="line-bold"></div>
                <div class="text-wrapper-custom">Name: <span class="span-warpper-custom">{{ items.country }}</span></div>
                <div class="line-bold"></div>
                <div class="text-wrapper-custom" style="margin-top: 330px;">Statistics</div>
                <div class="line-bold"></div> 
                <div class="text-wrapper-custom"><span class="span-warpper-custom">Number of activations : {{ items.activation_count }}</span></div>
                <div class="line-bold" style="margin-top: 70px;"></div> 
            </div>
        </div>
    </div>
</template>

<style scoped>
.data-count {
    font-weight: 100;
}
.table-stlye-custom{
    width: 100%;
    border-collapse: collapse;
    /* margin-top: 2px; */
}
.zoom{
    position: absolute; 
    right: 3px; 
    top:175px; 
    font-family: "Roboto-Bold", Helvetica;
    font-weight: 700;
    font-size: 12px;
}
.table-stlye-custom th {
    text-align: left; /* Alinea el texto a la izquierda */
    justify-content: center;
    font-family: "Roboto-Bold", Helvetica;
    font-weight: 700;
    color: #000000;
    font-size: 10px;
    letter-spacing: 0;
    line-height: normal;
    border-bottom: 2px solid #ddd;
}
.table-stlye-custom td {
    border-bottom: 2px solid #ddd;
    /* border-top: 2px solid #ddd; */
    text-align: left; /* Alinea el texto a la izquierda */
    justify-content: center;
}

.table-attributes {
    width: 370px;
}

.image-group{
    aspect-ratio: auto; 
    object-fit: contain; 
    object-position: center 30%; 
    width: 100%; 
    height: auto; 
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
    display: flex;
    width: 366px;
    height: 200px;
    top: 141px;
    left: 25px;
    background-color: #eeeeee;
    align-items: center;
}

.filtering-history .overlap-group-2 {
    position: absolute;
    display: flex;
    width: 366px;
    height: 200px;
    top: 141px;
    left: 405px;
    background-color: #eeeeee;
    align-items: center;
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
