<script setup lang="ts">
import { TAB_DETAILS_RULE, TAB_FORM_ADD_RULE } from "@/constants/constants";
import { useLayerStore } from "@/stores/layerStore";
import { useMapViewStore } from "@/stores/mapViewStore";
import { useRulesStore } from "@/stores/rulesStore";
import { convertTextTruncate } from '../../helpers/convertDateTime';
import {
    QtmButton,
    QtmIcon,
    QtmMenuItemList,
    QtmMenuItem,
    QtmMenuItemLabel,
    QtmCheckbox,
    QtmDivider,
    QtmTypography,
    QtmTextInput,
    QtmGrid,
    QtmFormLabel,
    QtmTabs,
    QtmTab,
    QtmTextarea,
    QtmTooltip
} from "@qtm/vue";
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from "vue-router";
import { usePopupAlertStore } from "@/stores/popupAlertStore";
import type { IAoiDraw } from "@/interfaces/IDraw";
import { defaultLayer, rulesStatus } from '@/components/menu/config/dataLegend'
import { useAdvanceSearchPanelStore } from "@/stores/advancedSearchPanelStore";
const rulesStore = useRulesStore()
const mapStore = useMapViewStore()
const layerStore = useLayerStore()
const isShowMenuLayersButtom = ref<boolean>(true)
const isTooltipVisible = ref<{ [key: number]: boolean }>({});
const isCustomTooltipVisible = ref<{ [key: number]: boolean }>({});
const isShowMenuLayers = ref<boolean>(false)
const isShowMenuLegend = ref<boolean>(true)
const advanceSearchPanelStore = useAdvanceSearchPanelStore()
const ifNameExist = computed(() => {
    const verifyName = layerStore.layerData.find((l: any) => l.label === layerStore.customsLater.label)
    if (verifyName !== undefined) {
        return true
    } else {
        return false
    }
})
const customsLayers = ref<any[]>([])
const activeTab = ref<'default' | 'custom'>('default')
const selectedLayers = ref<any[]>([])
const route = useRoute()
const popupAlertStore = usePopupAlertStore();

const showMenuLayers = () => {
    isShowMenuLayersButtom.value = !isShowMenuLayersButtom.value
    isShowMenuLayers.value = true
}
const cancelDrawLayer = async () => {
    mapStore.handleDrawActive()
    layerStore.showMenuAddLayer()
    mapStore.clearDraw()

}
const addCustomLayer = async () => {
    layerStore.customsLater.geometry.geometry_type = mapStore.selectDrawOption.toLowerCase()
    let res: any
    switch (mapStore.selectDrawOption) {
        case 'Polygon':
        case 'Point':
            customsLayers.value.push(layerStore.customsLater)
            res = await layerStore.postLayer(layerStore.customsLater)
            break;
        case 'Circle':
            try {
                const { latitude, longitude, radius_km } = parseAreaWKT(layerStore.customsLater.geometry.area_wkt);
                let circleCustom: any = {
                    geometry: {
                        center: {
                            latitude: latitude,
                            longitude: longitude
                        },
                        geometry_type: layerStore.customsLater.geometry.geometry_type.toLowerCase(),
                        radius_km: radius_km
                    },
                    label: layerStore.customsLater.label,
                }
                customsLayers.value.push(circleCustom)
                res = await layerStore.postLayer(circleCustom)
            } catch (error) {
                popupAlertStore.showPopupAlert('Error', 'Invalid circle')
                return
            }
            break;
    }
    mapStore.clearDraw()
    res.checked = true
    selectedLayers.value.push(res)
    drawLayer(res, true, false)
    layerStore.showMenuAddLayer()
    mapStore.handleDrawActive()
}

function parseAreaWKT(areaWKT: string): { latitude: number; longitude: number; radius_km: number } {
    const regex = /latitude:\s*(-?\d+\.\d+),\s*longitude:\s*(-?\d+\.\d+).*?radius_km:\s*(\d+\.\d+)/s;
    const matches = areaWKT.match(regex);
    if (matches) {
        const latitude = parseFloat(matches[1]);
        const longitude = parseFloat(matches[2]);
        const radius_km = parseFloat(matches[3]);
        return { latitude, longitude, radius_km };
    } else {
        throw new Error
    }
}
const removeCustomLayer = async (item: any) => {
    await layerStore.removeLayer(item)
    selectedLayers.value = selectedLayers.value.filter((layer) => layer.id !== item.id)
    drawLayer(item, true)
}
const handleGeometry = (value: any) => {
    layerStore.customsLater.geometry.area_wkt = value
}

watch(() => mapStore.polygonFigure.wkt, () => {
    layerStore.customsLater.geometry.area_wkt = mapStore.polygonFigure.wkt
})
const restoreViewCustomLayer = () => {
    isShowMenuLayersButtom.value = false
    isShowMenuLayers.value = false
    layerStore.isShowMenuAddLayer = false
}
watch(() => rulesStore.viewRules, (newValue) => {
    if (newValue === 'divide') {
        restoreViewCustomLayer()
    }
})
watch(() => advanceSearchPanelStore.verifyOpenClose('searchAdvancedRules'), (newValue) => {
    if (newValue) {
        restoreViewCustomLayer()
    }
})
watch(() => mapStore.circleFigure, () => {
    let circle = `center: {
    latitude: ${mapStore.circleFigure.centerLatidude},
    longitude: ${mapStore.circleFigure.centerLongitude}
    },
radius_km: ${mapStore.circleFigure.radius}`
    layerStore.customsLater.geometry.area_wkt = circle
})

watch(layerStore.layerData, (newValue, oldValue) => {
    console.log('newValue', newValue)
});

const polygonNew = () => {
    mapStore.selectDrawOption = 'Polygon'
    mapStore.drawPoligon()
    handleGeometry('')
}

const drawCircle = () => {
    mapStore.selectDrawOption = 'Circle'
    mapStore.drawCircle()
    handleGeometry('')

    // mapStore.circleFigureDraw()
    /*mapStore.selectDrawOption = 'Circle' 
    mapStore.activateDraw('Circle')
    handleGeometry('')*/
}

const drawPoint = () => {
    mapStore.selectDrawOption = 'Point';
    mapStore.drawPoint();
    handleGeometry('')
}

const classDinamicButtonLayers = () => {
    if (rulesStore.viewRules === 'divide' && route.path === '/operator/rules') {

        return 'menuFloatingBottom menu-divide-left-floating';
    } else if (rulesStore.showConflictManagement && rulesStore.viewRules === 'map' && rulesStore.showConflictMinimize && rulesStore.showConflictMoved) {
        return 'menuFloatingBottom menu-bottom-left-divide menu-bottom-left-divide-conflict-management';
    } else {
        if (rulesStore.minimizeItems.length > 0 && rulesStore.verifyMenu(TAB_DETAILS_RULE)) {
            return 'menuFloatingBottom menu-bottom-left-divide margin-btn';
        }
        return 'menuFloatingBottom menu-bottom-left-divide';
    }
};

const classDinamicButtonLayersCustom = () => {

    if (rulesStore.viewRules === 'divide') {
        return 'menuItemListModification';
    } else {
        return 'menuItemList';
    }
};

const classDinamicLayersCustom = () => {

    if (rulesStore.viewRules === 'divide') {
        return 'contentLayerListModification';
    } else {
        return 'content-layer-list';
    }
};


const toggleTooltip = (itemId: number, result: boolean) => {
    isTooltipVisible.value[itemId] = result;
}

const toggleCustomTooltip = (itemId: number, result: boolean) => {
    isCustomTooltipVisible.value[itemId] = result;
}

const drawLayer = (item: any, event: any, update = true) => {
    if (update) {
        layerStore.layerData.forEach((layer) => {
            if (layer.id === item.id) {
                layer.checked = !layer.checked
                if (layer.checked) {
                    selectedLayers.value.push(layer)
                } else {
                    selectedLayers.value = selectedLayers.value.filter((layer) => layer.id !== item.id)
                }
            }
        })
    }
    let layersSelectedIds = selectedLayers.value
    let layersSelected = layerStore.layerData.filter((layer) => layer.checked === true)
    let combined = [...layersSelectedIds, ...layersSelected]
    let layerDataCombined = combined.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.id === item.id
        ))
    )
    layerStore.layerData.forEach((layer) => {
        layerDataCombined.forEach((item) => {
            if (layer.id === item.id) {
                layer.checked = true
            }
        })
    })
    if (layerDataCombined.length == 0) {
        mapStore.restoreZoom();
        mapStore.removeVectorLayer()
        return
    }
    const selectedDrawLayer: IAoiDraw[] = layerDataCombined.map(item => ({
        wkt: item.geometry.area_wkt,
        colorType: undefined
    }));
    mapStore.selectAOIdraw(selectedDrawLayer);
}

const hableActiveTab = (tab: 'default' | 'custom') => {
    activeTab.value = tab
}
const verifyNameExistLayer = (value: string) => {

}

const containerLayerCustom = ref();

const scrollToLastItem = () => {
    const container = containerLayerCustom.value;
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

watch( () => layerStore.layerData?.length,(newLength, oldLength) => {
    if (newLength > oldLength) {
        nextTick(() => {
            scrollToLastItem();
        });
    }
});

onMounted(() => {
    layerStore.getLayer()
});

</script>
<template>
    <div :class="classDinamicButtonLayers()">
        <div class="menuBottomLeft">
            <div :class="classDinamicButtonLayersCustom()" v-show="isShowMenuLayers" id="menuLayer">

                <div @click-event="isShowMenuLayers = false">
                    <div>
                        <qtm-menu-item-label classes="header-layer">
                            <qtm-typography component="body-2">Layers</qtm-typography>
                            <qtm-icon icon="close" size="medium"></qtm-icon>
                        </qtm-menu-item-label>
                    </div>
                    <qtm-divider />
                    <div>
                        <QtmTabs>
                            <QtmTab class="font-tab" @click="hableActiveTab('default')" active label="Default"></QtmTab>
                            <QtmTab class="font-tab" @click="hableActiveTab('custom')" label="Custom"></QtmTab>
                        </QtmTabs>
                    </div>
                    <qtm-divider style="margin-top: -2px !important;" />
                </div>
                <div :class="classDinamicLayersCustom()" v-if="activeTab === 'default'">
                    <div v-for="(item, index) in defaultLayer" :key="item.id" class="option-layer">
                        <qtm-checkbox size="medium" :input-id="item.id"
                            :checked="layerStore.isLayerActive(item.id)"
                            @value-changed="(e) => layerStore.handleListLayers(item.id)">
                            <img :src="item.icon" class="mx-2"> {{ item.label }}
                        </qtm-checkbox>
                    </div>
                </div>

                <div size="medium" v-if="activeTab === 'default'" class="option-layer flex">
                    <img src="/src/assets/icons/base_map_icon.svg" class="mr-2 my-2">
                    Basemap
                </div>

                <div ref="containerLayerCustom" :class="classDinamicLayersCustom()" v-if="activeTab === 'custom'" >
                    <div v-for="(item, index) in layerStore.layerData" :key="item.id" class="option-layer-custom">
                        <qtm-checkbox size="medium" :input-id="item.label ? item.label.replace(/\s+/g, '') : ''" @change="drawLayer(item, $event)"
                            :checked="item.checked">
                            <img src="/src/assets/icons/polyline_icon.svg" class="mx-2">
                            <span @mouseenter.stop="toggleCustomTooltip(item.id, true)"
                                @mouseleave.stop="toggleCustomTooltip(item.id, false)">
                                {{ convertTextTruncate(16, item.label) }}
                                <qtm-tooltip size="small" classes="tooltip-layer tooltip-custom-layer"
                                    :visible="isCustomTooltipVisible[item.id]" :title="item.label" orientation="top"
                                    tip-position="center">
                                </qtm-tooltip>
                            </span>
                        </qtm-checkbox>
                        <div style="display: flex; gap: 8px;" class="options-edit-remove">
                            <!-- <qtm-icon icon="save" variant="outlined" size="medium" classes="cursor-pointer"></qtm-icon> -->
                            <qtm-icon icon="delete" variant="outlined" classes="cursor-pointer"
                                @click="removeCustomLayer(item)" @mouseenter.stop="toggleTooltip(item.id, true)"
                                @mouseleave.stop="toggleTooltip(item.id, false)" size="medium">
                                <qtm-tooltip size="small" classes="tooltip-layer tooltip-delete-button"
                                    :visible="isTooltipVisible[item.id]" title="Delete" orientation="top"
                                    tip-position="center">
                                </qtm-tooltip>
                            </qtm-icon>
                        </div>
                    </div>
                </div>

                <div class="customButtomLayersMenu" v-if="activeTab === 'custom'">
                    <qtm-divider />
                    <div class="contentLayersMenu" @click="layerStore.showMenuAddLayer()" id="showMenuAddLayer">
                        <qtm-icon icon="library_add" variant="outlined" size="medium"></qtm-icon>
                        <qtm-typography component="body-2">Add custom layer</qtm-typography>
                    </div>
                </div>
            </div>
        </div>

        <div class="menuItemListAddLayer"
            :class="rulesStore.viewRules === 'divide' ? 'menuItemListAddLayerHeighDivide' : 'menuItemListAddLayerHeight'"
            v-show="layerStore.isShowMenuAddLayer">
            <qtm-menu-item-list>
                <qtm-menu-item id="id1" @click-event="cancelDrawLayer()">
                    <div class="">
                        <qtm-menu-item-label>
                            <qtm-typography component="body-2">Add custom layer</qtm-typography>
                            <qtm-icon icon="close" size="medium"></qtm-icon>
                        </qtm-menu-item-label>
                    </div>
                    <qtm-divider />
                </qtm-menu-item>
            </qtm-menu-item-list>
            <div style="padding: 10px;">
                <QtmFormLabel component="body-1" :required="true"><span>Layer name</span></QtmFormLabel>
                <QtmTextInput size="small" placeholder="Layer name" :value="layerStore.customsLater.label"
                    @value-changed="(event) => layerStore.customsLater.label = event.detail"
                    :severity="ifNameExist ? 'error' : undefined" />
                <QtmFormLabel component="body-1" v-if="ifNameExist" classes="text-dark-danger-default" size="small">
                    <span>Name already exists.</span>
                </QtmFormLabel>
                <div :style="rulesStore.viewRules === 'divide' ? 'margin-top: 10px;' : 'margin-top: 15px;'">
                    <QtmFormLabel component="body-1" :required="true">Draw layer</QtmFormLabel>
                </div>

                <div style="display:flex; gap: 7px;">
                    <QtmButton :disabled="!layerStore.customsLater.label.length" size="small" variant="filled"
                        :color="mapStore.selectDrawOption == 'Point' ? 'success' : 'primary'" :props="{
                            id: 'pointLayer'
                        }" @click-event="() => drawPoint()">
                        <qtm-icon icon="location_on" variant="outlined" size="medium"></qtm-icon>
                    </QtmButton>
                    <QtmButton :disabled="!layerStore.customsLater.label.length" size="small" variant="filled"
                        :color="mapStore.selectDrawOption == 'Circle' ? 'success' : 'primary'" :props="{
                            id: 'circleLayer'
                        }" @click-event="() => drawCircle()">
                        <qtm-icon icon="circle" variant="outlined" size="medium"></qtm-icon>
                    </QtmButton>
                    <QtmButton :disabled="!layerStore.customsLater.label.length" size="small" variant="filled"
                        :color="mapStore.selectDrawOption == 'Polygon' ? 'success' : 'primary'" :props="{
                            id: 'polygonLayer'
                        }" @click-event="() => polygonNew()">
                        <qtm-icon icon="polyline" variant="outlined" size="medium"></qtm-icon>
                    </QtmButton>
                </div>
                <div :style="rulesStore.viewRules === 'divide' ? 'margin-top: 10px;' : 'margin-top: 15px;'">
                    <QtmFormLabel component="body-1" :required="true">Geometry</QtmFormLabel>
                    <QtmTextarea :size="rulesStore.viewRules === 'divide' ? 'small' : 'large'" placeholder="Geometry"
                        :disabled="true"
                        :value="mapStore.selectDrawOption == 'Circle' ? '' : layerStore.customsLater.geometry.area_wkt"
                        @value-changed="(event) => handleGeometry(event.detail)" />
                </div>


                <div style="display: flex; justify-content: end; gap: 5px;"
                    :style="rulesStore.viewRules === 'divide' ? 'margin-top: 10px;' : 'margin-top: 26px;'">
                    <QtmButton size="small" variant="ghost" color="neutral" :props="{
                        id: 'cancelAddLayer'
                    }" @click-event="() => cancelDrawLayer()" label="Cancel">

                    </QtmButton>
                    <QtmButton size="small" variant="filled" color="primary" :props="{
                        id: 'saveAddLayer'
                    }" :disabled="layerStore.customsLater.label.trim() === '' || layerStore.customsLater.geometry.area_wkt === '' || ifNameExist"
                        @click-event="() => addCustomLayer()" label="Save">

                    </QtmButton>
                </div>
            </div>
        </div>

        <qtm-button size="large" v-show="(!isShowMenuLayers && !layerStore.isShowMenuAddLayer)"
            classes="bg-dark-neutral-hover text-black-100" variant="filled" :props="{
                id: 'layers'
            }" @click-event="() => showMenuLayers()">
            <qtm-icon icon="layers" variant="outlined" size="medium"></qtm-icon>

            <qtm-typography component="body-1">Layers</qtm-typography>
        </qtm-button>

    </div>

    <div class="menuBottomRight"
        :class="(rulesStore.viewRules === 'divide' && route.path === '/operator/rules') ? 'menu-divide-right-floating' : 'menu-bottom-right-divide'">
        <div style="gap: 7px; display: flex; flex-direction: column;"
            v-show="(isShowMenuLegend || rulesStore.viewRules === 'map')">
            <qtm-button size="medium" @click="mapStore.restoreZoom()" :disabled="mapStore.disableButtonZoom.resetZoom"
                :props="{
                    id: 'resetZoom'
                }">
                <qtm-icon icon="restart_alt" variant="outlined"></qtm-icon>
            </qtm-button>
            <qtm-button size="medium" @click="mapStore.zoomIn()" :disabled="mapStore.disableButtonZoom.zoomIn" :props="{
                id: 'zoomIn'
            }">
                <qtm-icon icon="add"></qtm-icon>
            </qtm-button>
            <qtm-button size="medium" @click="mapStore.zoomOut()" :disabled="mapStore.disableButtonZoom.zoomOut" :props="{
                id: 'zoomOut'
            }">
                <qtm-icon icon="remove"></qtm-icon>
            </qtm-button>
        </div>

        <qtm-button size="medium" class="roundButton" classes="bg-bluegrey-200" v-show="isShowMenuLegend" :props="{
            id: 'legend'
        }" @click-event="isShowMenuLegend = false">
            <qtm-icon icon="list" classes="text-black-100"></qtm-icon>
        </qtm-button>

        <div class="menuItemListRight" v-show="!isShowMenuLegend">
            <qtm-menu-item-list size="small">
                <qtm-menu-item id="id0" @click-event="isShowMenuLegend = true">
                    <div>
                        <qtm-menu-item-label>
                            <label component="body-1" style="margin-left: 4px; font-size: 15px;">Legend</label>
                            <qtm-icon icon="close" size="medium"></qtm-icon>
                        </qtm-menu-item-label>
                    </div>
                    <qtm-divider />
                </qtm-menu-item>
                <div class="customListLegend">
                    <label class="titleCustomList">Rules typology</label>
                    <li class="customList">
                        <ul>
                            <span class="green"></span>Permissive
                        </ul>
                        <ul>
                            <span class="yellow"></span>Tracking
                        </ul>
                        <ul>
                            <span class="red"></span>Blocking
                        </ul>
                    </li>
                    <label class="titleCustomList">Rules status</label>
                    <li class="customList">
                        <template v-for="item in rulesStatus" :key="item.id">
                            <ul :id="item.id">
                                <span class="align-icon">
                                    <img :src="item.icon" alt="">
                                </span>{{ item.label }}
                            </ul>
                        </template>
                    </li>
                </div>
            </qtm-menu-item-list>
        </div>
    </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');

.menuFloatingBottom {
    z-index: 120 !important;
    color: #ffffff;
    text-align: center;
    position: absolute;
    display: flex;
    bottom: 0;
    left: 0;
}

.align-icon {
    margin-top: -2px;
}

.mx-2 {
    margin-right: 4px;
    margin-left: 4px;
}

.menu-divide-left-floating {
    bottom: 60px;
    max-height: 302px;
}

.menu-divide-right-floating {
    /* bottom: 50px; */
    /* z-index: 99999 !important; */
    transform: translateY(20%);
    z-index: 142;
}

@media screen and (max-height: 839px) {
    .menu-divide-right-floating {
        bottom: 190px;
    }
}

@media screen and (min-height: 840px) and (max-height: 924px) {
    .menu-divide-right-floating {
        bottom: 130px;
    }
}

@media screen and (min-height: 925px) and (max-height: 1000px) {
    .menu-divide-right-floating {
        bottom: 90px;
    }
}

@media screen and (min-height: 1001px) and (max-height: 1300px) {
    .menu-divide-right-floating {
        bottom: 50px;
    }
}

@media screen and (min-height: 1301px) and (max-height: 1800px) {
    .menu-divide-right-floating {
        bottom: 70px;
    }
}

@media screen and (min-height: 1801px) {
    .menu-divide-right-floating {
        bottom: 190px;

    }
}

.menu-bottom-right-divide {
    bottom: 25px;
}

.menu-bottom-left-divide {
    bottom: 20px;

}

.menu-bottom-left-divide-conflict-management {
    margin-left: 40%
}

.menuBottomRight {
    display: flex;
    position: absolute;
    flex-direction: column;
    overflow-y: auto;
    gap: 15px;
    right: 0;
    margin-right: 14px;
    align-items: flex-end;

}

.menuBottomLeft {
    align-self: flex-end;
    margin-left: 9px;
    display: flex;
    gap: 10px;

}

.menuItemListAddLayer {
    width: 250px;
    margin-left: 7px;
    overflow-y: hidden;
    background-color: #000000;
}

.menuItemListAddLayerHeight {
    max-height: 400px;
    min-height: 375px;
}

.menuItemListAddLayerHeighDivide {
    max-height: 330px;
    min-height: 330px;
}

.menuItemList {
    max-height: 400px;
    width: 260px;
    overflow-y: hidden;
    background-color: #000000;
    position: relative;
    /* Change to relative */
    z-index: 100;
    /* Add a high z-index to make sure it appears above other elements */
}

.menuItemListModification {
    max-height: 400px;
    /* Ajusta la altura máxima para que el modal se ajuste a la pantalla */
    width: 270px;
    /*overflow-y: auto;*/
    /* Permite desplazamiento vertical si el contenido excede la altura máxima */
    background-color: #000000;
    margin-left: 12px;
    margin-bottom: -28px;
    /* margin-top: 50%; */
    z-index: 100;
    /* Add a high z-index to make sure it appears above other elements */

}

.contentLayerListModification {
    max-height: 195px;
    min-height: 195px;
    overflow-y: auto;
    scrollbar-width: thin !important;
    scrollbar-color: #3b3d50 #1c1d26 !important;
}

.content-layer-list {
    max-height: 252px;
    min-height: 252px;
    scrollbar-width: thin !important;
    scrollbar-color: #3b3d50 #1c1d26 !important;
}


.menuItemListRight {
    max-height: 315px;
    width: 220px;
    background-color: #000000;
    position: relative;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #3b3d50 #1c1d26;
    right: 0;
    bottom: 0;
    margin-left: 50px;
    font-size: 15px;
}

.layersTitle {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    margin-left: 10px;
    margin-right: 10px;
}

.customButtomLayersMenu {
    background-color: #252733;
    margin-top: 4px;

}

.customButtomLayersMenu:hover {
    background-color: #4C5DFF;
    cursor: pointer;
}

.contentLayersMenu {
    display: flex;
    justify-content: left;
    height: 46px;
    gap: 8px;

    margin-left: 10px;
    padding: 5px;
    padding-top: 12px;


}



.customListLegend {
    padding: 10px;
    margin-left: 5px;
}

.titleCustomList {
    font-family: 'Roboto';
    font-weight: bold;
    color: white;
    margin-left: 5px;
    font-size: 15px;
}

.customList {
    color: white;
    list-style: none;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5px;
    font-size: 15px;
}

.customList span {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    vertical-align: middle;
}

.customList span.red {
    background-color: red;
}

.customList span.blue {
    background-color: blue;
}

.customList span.yellow {
    background-color: yellow;
}

.customList span.green {
    background-color: green;
}

.customList span.gray {
    background-color: rgb(180, 180, 180);
}

.font-tab {
    font-size: 0.875rem !important;
}

.mr-2 {
    margin-right: 4px;
}

.my-2 {
    margin-top: 2px;
    margin-bottom: 2px;
}

.tooltip-custom-layer {
    position: absolute !important;
    left: 134px !important;
    bottom: auto !important
}

.tooltip-delete-button {
    position: absolute !important;
    left: 225px !important;
    padding: 8px !important;
    bottom: auto !important
}

.roundButton {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.header-layer {
    padding: 10px 16px;
}

.option-layer {
    margin: 14px 16px !important;
}

.option-layer-custom {
    margin: 14px 16px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.options-edit-remove {
    display: flex;
    align-items: center
}

.tooltip-layer {
    position: relative;
    bottom: 10px;
    left: 10px;
}

.red-button {
    background-color: red;
    color: white;
}
</style>