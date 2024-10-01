<script setup lang="ts">
import { useMapViewStore } from "@/stores/mapViewStore";
import { useRulesStore } from "@/stores/rulesStore";
import { onMounted, ref, watchEffect, watch, h } from "vue";
import { usePopupAlertStore } from "@/stores/popupAlertStore";
import { QtmTooltip,QtmToggleSwitch } from "@qtm/vue";
import DrawPolygon from "./DrawPolygon.vue";
import {
  _CANCELLED,
  _EXPIRED,
  TAB_DETAILS_RULE,
  TAB_UDS_GROUPS_DETAILS_USERS,
  TAB_USER,
} from "@/constants/constants";
import MenuFloatingBottom from "@/components/menu/MenuFloatingBottom.vue";
import OSM from "ol/source/OSM.js";
import GeoTIFF from "ol/source/GeoTIFF.js";
import TileLayer from "ol/layer/Tile.js";
import StadiaMaps from "ol/source/StadiaMaps.js";
import { Map, View } from 'ol';
import Draw from "ol/interaction/Draw.js";
import { Cluster, Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Circle as CircleGeom, Point } from "ol/geom.js";
import { Polygon as PolygonGeom } from "ol/geom.js";
import { Style, Fill, Stroke, Text, RegularShape } from "ol/style.js";
import { WKT } from "ol/format";
import { circular } from "ol/geom/Polygon";
import { colorClusterForTypeRules, colorPolygonForTypeRules, colorPolygonForTypeRulesStroke, getStyleMapVector, texturePolygon } from "@/helpers/mapHelper";
// @ts-ignore
import * as turf from "@turf/turf";
import XYZ from "ol/source/XYZ";
//import { environmentServerMaps } from '@/environments/environment';
import { useUserAndGroupStore } from "@/stores/userAndGroupStore";
import { useRoute } from "vue-router";
import { useScreenStore } from "@/stores/screenStore";
import { config } from "../../configService";
import * as ol from "ol";
import * as olProj from "ol/proj";
import { Select } from "ol/interaction";
import { pointerMove } from "ol/events/condition";
import { convertTextTruncate } from "@/helpers/convertDateTime";
import CircleStyle from "ol/style/Circle";
import MVT from 'ol/format/MVT';
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from 'ol/source/VectorTile';
import MenuContextual from "./MenuContextual.vue";
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
  DragPan
} from 'ol/interaction.js';
import { useExportStore } from "@/stores/exportStore";
import { useFilterStore } from "@/stores/filtersStore";
import {apply,applyStyle,applyBackground} from 'ol-mapbox-style';
import { useLayerStore } from "@/stores/layerStore";
import { defaultLayer } from "@/components/menu/config/dataLegend";
import VectorImageLayer from 'ol/layer/VectorImage.js';
import { fromLonLat } from 'ol/proj';
const rulesStore = useRulesStore();
const mapViewStore = useMapViewStore();
const userAndGroups = useUserAndGroupStore();
const popupAlertStore = usePopupAlertStore();
const exportStore = useExportStore()
const screenStore = useScreenStore();
const layerStore = useLayerStore()
const verifyClusters = ref(false)
const verifyClustersInMap = ref(false)
const drawnFeatures :any = ref([]);
const showTooltip = (index: number) => {
  mapViewStore.setTooltipVisibility(index, true);
};

const hideTooltip = (index: number) => {
  mapViewStore.setTooltipVisibility(index, false);
};

const isTooltipVisible = (index: number) => {
  return mapViewStore.tooltipVisibility[index];
};
const gradeMinuteSecond = (coordenada: number, tipo: string) => {
  const grados = Math.floor(Math.abs(coordenada));
  const minutos = Math.floor((Math.abs(coordenada) - grados) * 60);
  const segundos = (
    (Math.abs(coordenada) - grados - minutos / 60) *
    3600
  ).toFixed(1);
  const direccion =
    tipo === "latitud"
      ? coordenada > 0
        ? "N"
        : "S"
      : coordenada > 0
      ? "E"
      : "W";
  return `${grados}°${minutos}'${segundos}"${direccion}`;
};

const raster = new TileLayer({
  source: new OSM(),
});

const source:any = new VectorSource({ wrapX: false });

const vector = new VectorLayer({
  source: source,
  renderBuffer: 40,
});
// new TileLayer({
//               source: new XYZ({
//                     url: environmentServerMaps.baseUrl + '{z}/{x}/{y}',
//                     projection: 'EPSG:3857'
//                   }),
//                 })
//style: (feature) => getStyleMapVector(feature, mapViewStore.mapTheme)
const darkModeStyle = ref();
const lightModeStyle = ref();
const environmentServerMaps = {
    baseUrl: config?.mapserverUrl,
    dark_:config?.dark_mode_url ? config?.dark_mode_url :"",
    light_:config?.light_mode_url ? config?.light_mode_url : ""
  };
  //'http://localhost:5151/data/v3/{z}/{x}/{y}.pbf',
const vectorTileLayer = ref()
const createVectorTileLayer = () => {
  vectorTileLayer.value = new VectorTileLayer({
    source: new VectorTileSource({
      format: new MVT(),
      url: environmentServerMaps.baseUrl,
      projection: 'EPSG:3857'
    }),
    renderBuffer: 30,
  });
};
const select = new Select({style: null});
function removeLayers() {
mapViewStore.map.getAllLayers().filter((layer:any) => layer.get('mapbox-layers')).forEach((layer:any) => console.log(mapViewStore.map.removeLayer(layer)))
}
const hideLabels = (style:any) => {
    style.layers.forEach((layer: any) => {
      if (labelsToHideAll.includes(layer.id)) {
          layer.layout.visibility = 'none';
      }
  });
  };
const applyTheme = (theme:string) => {
    if (theme === 'light') {
      hideLabels(lightModeStyle.value); 
      updateStyle2(theme);
    } else {
      hideLabels(darkModeStyle.value);
      updateStyle2(theme);
    }
  };
const labelsToHideAll = ['porti_small','porti_medium','porti_large','siti-minerari_label','airports_large','airports_medium','label_airport','airports_small','siti_minerari','centrali_nucleari','aeroway-aerodrome','label_airport','aeroway-area','label_road','label_airport','place_city_large','place_other','label_place_other', 'label_place_city', 'label_country_other','label_country','place_city','place_capital','place_country_minor','place_country_other','place_country_major','place_state']
const labelsToHideCapitalCities = ['place_capital'];
const labelsToHideCities = ['place_state','label_place_city','place_city'];
const labelsToHideAirports = ['airports_large','airports_medium','label_airport','airports_small','aeroway-area','aeroway-aerodrome'];
const labelsToHideNuclearPlants = ['centrali_nucleari'];
const labelsToHideCitiMinerari = ['siti-minerari_label','siti_minerari'];
const labelsToHidePorti = ['porti_small','porti_medium','porti_large'];
function updateStyle2(style:any) {
  const glStyle =  mapViewStore.map.get('mapbox-style');
  
  if ((glStyle.name === 'Positron' && style === 'light') || (glStyle.name === 'Dark Matter' && style=== 'dark')) { return }
  removeLayers()
  if (style === 'light') {
    apply(mapViewStore.map, lightModeStyle.value)
  } else {
    apply(mapViewStore.map,  darkModeStyle.value)
  }
}
const formatLayers = (valueLabel: string, active: boolean) => {
  const toggleVisibility = (layers: any[], labelsToHide: any[] = []) => {
    layers.forEach((layer: any) => {
      if (labelsToHide.includes(layer.id)) {
        layer.layout.visibility = active ? 'visible' : 'none';
      }
    });
  };

  const handleLayerVisibility = (labelsToHide: any[]) => {
    if (darkModeStyle.value && lightModeStyle.value) {
      toggleVisibility(darkModeStyle.value.layers, labelsToHide);
      toggleVisibility(lightModeStyle.value.layers, labelsToHide);
      mapViewStore.map.getAllLayers().forEach((layer: any) => {
        layer.changed();
      });
    }
  };

  switch (valueLabel) {
    case "CustomLayerCapitalCities":
      handleLayerVisibility(labelsToHideCapitalCities);
      break;
    case "CustomLayerCities":
      handleLayerVisibility(labelsToHideCities);
      break;
    case "CustomLayerAiports":
      handleLayerVisibility(labelsToHideAirports);
      break;
    case "CustomLayerNuclearPowerPlants":
      handleLayerVisibility(labelsToHideNuclearPlants);
      break;
    case "CustomLayerMiningSites":
      handleLayerVisibility(labelsToHideCitiMinerari);
      break;
    case "CustomLayerPorts":
      handleLayerVisibility(labelsToHidePorti);
      break;
    default:
      break;
  }
};
function saveVectorLayers(map: Map) {
  const vectorLayers = map.getLayers().getArray().filter(layer => {
    return layer instanceof VectorLayer;
  });

  return vectorLayers;
}

function restoreVectorLayers(map: Map, layers: any[]) {
  layers.forEach(layer => map.addLayer(layer));
}
function applyThemePreservingLayers(newTheme: string) {
  const vectorLayers = saveVectorLayers(mapViewStore.map);
  mapViewStore.map.getLayers().clear();
  if (newTheme === 'light') {
    apply(mapViewStore.map, lightModeStyle.value);
  } else {
    apply(mapViewStore.map, darkModeStyle.value);
  }
  restoreVectorLayers(mapViewStore.map, vectorLayers);
}
onMounted(async() => {
  darkModeStyle.value = await fetch(environmentServerMaps.dark_).then(response => response.json());
  lightModeStyle.value = await fetch(environmentServerMaps.light_).then(response => response.json());
  
   hideLabels(lightModeStyle.value);
   hideLabels(darkModeStyle.value);
   
  //createVectorTileLayer();
  mapViewStore.map = new Map({
    interactions: defaultInteractions().extend([new DragPan(), new DragRotateAndZoom()]),
  target: 'map',
  layers: [
  vector
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 3,
  }),
});

  //removeLayers()
  apply(mapViewStore.map, darkModeStyle.value)
  watch(() => mapViewStore.mapTheme, (newTheme) => {
    applyThemePreservingLayers(newTheme);
  });
  mapViewStore.map.addLayer(mapViewStore.vectorLayer);
  vector.getSource()?.clear();
  mapViewStore.map.on('pointermove', (event: any) => {
    if (event.dragging) {
      return;
    }
    const coordinate = olProj.toLonLat(event.coordinate).map((coord: any) => coord.toFixed(6));
    const latitud = gradeMinuteSecond(coordinate[1], 'latitud');
    const longitud = gradeMinuteSecond(coordinate[0], 'longitud');
    mapViewStore.positionInMap = `${latitud} ${longitud}`;
  });
  const mapContainer = document.getElementById('map');
  if(mapContainer){
    mapContainer.addEventListener('mouseout', () => {
      mapViewStore.positionInMap = '';
  });
  }
  
  mapViewStore.addZoomEventHandler()
  
  mapViewStore.map.addInteraction(select);

  
updateSelectEvent();

});
const handleSelectEvent = (e:any) => {
  const selectedFeatures = e.selected;
  if(selectedFeatures === undefined) return
  if (selectedFeatures.length > 0) {
    const feature: any = selectedFeatures[0];
    if (feature.values_.features) {
      const id_value = feature.values_.features[0].values_.id_rule;
      if (id_value) {
        selectedRulePolygon(id_value);
      }
    }
  }
  };
  const updateSelectEvent = () => {
    select.getFeatures().clear();
    if (mapViewStore.isDrawActive) {
      select.un('select', handleSelectEvent);
    } else {
      select.on('select', handleSelectEvent);
    }
  };
  watch(
  () => mapViewStore.isDrawActive,
  () => {
   
    updateSelectEvent();
  }
);
function selectedRulePolygon(id:number) {
  filterStore.handleFilters({
      'rule_id': id.toString()
    });
    rulesStore.handleviewRules('divide')
}

const addPolygon = (coordenadasWKT: any) => {
      const wktFormatX = new WKT();

      const featurex: any = wktFormatX.readFeature(
        coordenadasWKT.geometryX.area_wkt,
        {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }
      );

      featurex.name = coordenadasWKT.name;
      featurex.status = coordenadasWKT.status;

      const style = new Style({
        fill: new Fill({
          color: colorPolygonForTypeRules(coordenadasWKT.rule_type),
        }),
        stroke: new Stroke({
          color: "rgba(255, 255, 255, 0.5)",
          width: 0.5,
        }),
      });

      featurex.setStyle(style);
      vector.getSource()?.addFeature(featurex);
};

const addTooltip = () => {
  
  const tooltipElement = document.getElementById("tooltipCustom");
  let tooltipOverlay: any;

  if (tooltipElement) {
    tooltipOverlay = new ol.Overlay({
      element: tooltipElement,
      offset: [0, -20],
      positioning: "bottom-center",
    });
    
    mapViewStore.map.addOverlay(tooltipOverlay);
    
       mapViewStore.map.on("pointermove", function (event: any) {
        if (event.dragging || mapViewStore.isDrawActive) {
          tooltipOverlay.setPosition(undefined);
          return;
        }
      //if (!mapViewStore.isDrawActive) {
       const hoveredFeature = mapViewStore.map.forEachFeatureAtPixel(
        event.pixel,
        function (feature: any) {
          return feature;
        }
      );
      if (hoveredFeature == undefined) {
        if (tooltipOverlay) {
          tooltipOverlay.setPosition(undefined);
        }
        return;
      }
      const features = hoveredFeature.values_?.features;
      if (features && features.length === 1 && !('properties_' in features[0])) {
        const featureProperties = features[0].values_;
        if (featureProperties.name) {
          const coordinate = event.coordinate;
          const featureInfo = `<div class="tooltip-custom-map">
                                  <p><strong>Rule name: ${convertTextTruncate(14, featureProperties.name)}</strong></p>
                                  <p>Status: ${featureProperties.status}</p>
                                </div>`;
          tooltipElement.innerHTML = featureInfo;
          tooltipOverlay.setPosition(coordinate);
          return;
        }
      }

      tooltipOverlay.setPosition(undefined);
      //}
      
    });
    
   
  }
};

const clearLayer = (limit:number = 1) => {
  for (let index = 0; index < limit; index++) {
    mapViewStore.map.getLayers().forEach((layer:any) => {
      if (layer instanceof VectorLayer && 
          (layer.get('createRule') === undefined && (layer as any).id !== 'aoiLayerCustom')) {
        mapViewStore.map.removeLayer(layer);
      }
    });
  }
  const isLayerAdded = mapViewStore.map.getLayers().getArray().includes(mapViewStore.vectorLayer);
  if (!isLayerAdded) mapViewStore.map.addLayer(mapViewStore.vectorLayer);
};


watch(
  () => rulesStore.rulesData,
  () => {
    if(!mapViewStore.disabledClustersAndPolygons && route.path === '/operator/rules' && !rulesStore.verifyMenu(TAB_DETAILS_RULE) && !exportStore.hiddenClustersAndPoligon){
      if (mapViewStore.map) {
        verifyClustersInMap.value = false
        verifyClusters.value = false
        handleFiguresMaps()
        }
    }else{
      clearLayer(2)
      vector.getSource()?.clear();
    }
  }
);

const filterStore = useFilterStore()


const addLayerClustersTheRules = () => {
  verifyClustersInMap.value = true;
  const wktFormat = new WKT();
  const features:any = [];
  let multipolygonLayer
  const multipolygonFeatures:any = [];
  vector.getSource()?.clear();  

  addTooltip();

  rulesStore.rulesData.forEach(coordenadasWKT => {
    const geometry:any = wktFormat.readGeometry(coordenadasWKT.geometry.area_wkt, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    let centroid = null;

    if (geometry.getType() === 'MultiPolygon') {
      const ruleType = coordenadasWKT.rule_type;
      const statusFigure = coordenadasWKT.status;
      if (statusFigure === _CANCELLED) return;

      const statusActive = statusFigure === _EXPIRED;
      const color:any = statusActive ? 'rgba(0, 0, 0, 0)' : colorPolygonForTypeRules(ruleType);

      const multipolygonStyle = new Style({
        geometry: geometry,
        fill: new Fill({
          color: texturePolygon(statusFigure, color),
        }),
        stroke: new Stroke({
          color: statusActive ? colorPolygonForTypeRulesStroke(ruleType) : '#FFFFFF',
          width: 2,
        }),
      });

      const feature = new ol.Feature({
        geometry: geometry,
        name: coordenadasWKT.rule_name,
        status: coordenadasWKT.status,
        id_rule: coordenadasWKT.rule_id,
        isMultipoligon: true,
        rule_type: coordenadasWKT.rule_type,
      });

      feature.setStyle(multipolygonStyle); 
      multipolygonFeatures.push(feature); 
    } else {
      centroid = geometry.getInteriorPoint(); 
    }

    if (centroid) {
      if(geometry.getType() === 'MultiPolygon') return
      const feature = new ol.Feature({
        geometry: centroid,
        name: coordenadasWKT.rule_name,
        status: coordenadasWKT.status,
        id_rule: coordenadasWKT.rule_id,
        geometryX: {
          area_wkt: coordenadasWKT.geometry.area_wkt,
        },
        rule_type: coordenadasWKT.rule_type,
      });

      if (coordenadasWKT.status !== _CANCELLED) {
        features.push(feature);
      }
    }
  });
  if (multipolygonFeatures.length > 0) {
    
    const multipolygonSource = new VectorSource({
      features: multipolygonFeatures,
    });

    multipolygonLayer = new VectorLayer({
      source: multipolygonSource,
    });

    
  }
  if (features.length === 0) {
    clearLayer(2);
  } else {
    const source = new VectorSource({
      features: features,
    });

    const clusterSource = new Cluster({
      distance: 80,
      source: source,
    });

    const styleCache:any = {};
    const clustersLayer:any = new VectorLayer({
      source: clusterSource,
      renderBuffer: 40,
      style: function (feature) {
        const clusterFeatures = feature.get("features");
        const size = clusterFeatures.length;

        const ruleTypes = clusterFeatures.map((f:any) => f.get("rule_type"));
        const uniqueRuleTypes:any = [...new Set(ruleTypes)];
        let color;

        if (uniqueRuleTypes.length === 1) {
          color = colorClusterForTypeRules(uniqueRuleTypes[0]);
        } else {
          color = '#4D96CE';
        }

        let style = styleCache[size + uniqueRuleTypes.join(',')];
        if (!style) {
          if (size === 1) {
            const singleFeature = clusterFeatures[0];
            const ruleType = singleFeature.get("rule_type");
            const statusFigure = singleFeature.get("status");

            if (statusFigure === _CANCELLED) return;

            const statusActive = statusFigure === _EXPIRED;
            const color:any = statusActive ? 'rgba(0, 0, 0, 0)' : colorPolygonForTypeRules(ruleType);

            const originalGeometry = wktFormat.readGeometry(singleFeature.get("geometryX").area_wkt, {
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            });

            return new Style({
              geometry: originalGeometry,
              fill: new Fill({
                color: texturePolygon(statusFigure, color),
              }),
              stroke: new Stroke({
                color: statusActive ? colorPolygonForTypeRulesStroke(ruleType) : '#FFFFFF',
                width: 2,
              }),
            });
          }

          style = new Style({
            image: new RegularShape({
              fill: new Fill({
                color: color,
              }),
              stroke: new Stroke({
                color: "#fff",
                width: 2,
              }),
              points: 4,
              radius: 22,
              angle: 0,
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: "#fff",
              }),
            }),
          });

          styleCache[size + uniqueRuleTypes.join(',')] = style;
        }
        return style;
      },
    });

    clearLayer(2);
    if (multipolygonFeatures.length > 0) {
       mapViewStore.map.addLayer(multipolygonLayer);
    }
   
    mapViewStore.map.addLayer(clustersLayer);
  }
};


const addLayersPolygonsTheRules = () => {
  verifyClusters.value = true;
  vector.getSource()?.clear();
  if (rulesStore.rulesData.length > 0) {
    const wktFormat = new WKT();
    for (const coordenadasWKT of rulesStore.rulesData) {
      if(coordenadasWKT.status === _CANCELLED) return
      const statusActive = coordenadasWKT.status === _EXPIRED
      const color:any = statusActive? 'rgba(0, 0, 0, 0)': colorPolygonForTypeRules(coordenadasWKT.rule_type);
      const statusFigure = coordenadasWKT.status;
      const style = new Style({
        fill: new Fill({
          color: texturePolygon(statusFigure,color),
        }),
        stroke: new Stroke({
          color:statusActive? colorPolygonForTypeRulesStroke(coordenadasWKT.rule_type):'#FFFFFF',
          width: 2,
        }),
      });

      const feature = wktFormat.readFeature(coordenadasWKT.geometry.area_wkt, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });

      feature.setProperties({
        name: coordenadasWKT.rule_name,
        status: coordenadasWKT.status,
        id_rule: coordenadasWKT.rule_id,
      });

      feature.setStyle(style);
      vector.getSource()?.addFeature(feature);
    }

    mapViewStore.map.addLayer(vector);

    // Add tooltip
    const tooltipElement:any = document.getElementById('tooltipCustom');
    let tooltipOverlay:any;

    if (tooltipElement) {
      tooltipOverlay = new ol.Overlay({
        element: tooltipElement,
        offset: [0, -20],
        positioning: 'bottom-center',
      });
      mapViewStore.map.addOverlay(tooltipOverlay);
    }
    let lastCoordinate :any;
    mapViewStore.map.on('pointermove', function (event:any) {
      if (event.dragging || !tooltipOverlay) {
        return;
      }

      const pixel = event.pixel;
      let hit = false;
      if (!mapViewStore.isDrawActive) {
        mapViewStore.map.forEachFeatureAtPixel(pixel, function (feature:any) {
          
          if (feature && feature.get('name')) {
            if (!('properties_' in feature)) {
              const coordinate = event.coordinate;
              if (coordinate !== lastCoordinate) {
                lastCoordinate = coordinate;
                const featureInfo = `<div class="tooltip-custom-map">
                                      <p><strong>Rule name: ${convertTextTruncate(14, feature.get('name'))}</strong></p>
                                      <p>Status: ${feature.get('status')}</p>
                                    </div>`;
                tooltipElement.innerHTML = featureInfo;
                tooltipOverlay.setPosition(coordinate);
                hit = true;
              }
            }
          }
      });
      }
      

      //const select = new Select({style: null});
      mapViewStore.map.addInteraction(select);

      // select.on('select', (e) => {
      //   const selectedFeatures = e.selected;
      //   if (selectedFeatures.length > 0) {
      //     const features:any = select.getFeatures();
      //     const feature:any = features.array_[0];
      //     if(feature.values_) {
      //       const id_value = feature.values_.id_rule
      //       if(id_value){
      //         selectedRulePolygon(id_value);
      //       }
      //     }
      //   }
      // });
      handleSelectEvent(select)
      if (!hit) {
        tooltipOverlay.setPosition(undefined);
      }
    });
  }
};

const route = useRoute();
const handleFiguresMaps = () => {
  var zoomLevel = mapViewStore.map.getView().getZoom();
  if(zoomLevel >= 7 || mapViewStore.viewLayers){
    if(verifyClusters.value === false){
      clearLayer(2)
      addLayersPolygonsTheRules()
      verifyClustersInMap.value = false
    }
  }else{
    verifyClusters.value = false
    vector.getSource()?.clear();  
    if(verifyClustersInMap.value === false){
      addLayerClustersTheRules()
    }
  }
}
const modifyFiguresInMap = () => {
  if (mapViewStore.map) {
   
    if(!mapViewStore.disabledClustersAndPolygons && route.path === '/operator/rules' && !rulesStore.verifyMenu(TAB_DETAILS_RULE)  && !exportStore.hiddenClustersAndPoligon){
      mapViewStore.map.getView().on('change:resolution', function() {
          handleFiguresMaps()
        });
    }else{
      clearLayer(2)
      vector.getSource()?.clear();
      handleFiguresMaps()
    }
  }
}
watchEffect(() => {
  modifyFiguresInMap()
});

const calculateWidth = () => {
  if (
    rulesStore.verifyMenu(TAB_DETAILS_RULE) &&
    route.path === "/operator/rules"
  ) {
    return "55%";
  } else if (
    userAndGroups.verifyMenu(TAB_UDS_GROUPS_DETAILS_USERS) &&
    route.path === "/operator/usergroups/users"
  ) {
    return "55%";
  } else {
    return "100%";
  }
};
const calculateHeight = () => {
  if (rulesStore.viewRules === "divide" && route.path === "/operator/rules") {
    return "45%";
  } else {
    return `${screenStore.screenHeight - 200}px`;
  }
};
watch(
  () => layerStore.listLayersActived,
  (newValue) => {
    for (let index = 0; index < newValue.length; index++) {
        formatLayers(newValue[index].id,newValue[index].active);
    }
  },
  { deep: true }
);
//:style="'background-color:' + (mapViewStore.mapTheme ==='light' ? 'rgb(242,243,240)' : '#2A2929') + ';'"
</script>

<template>
  <div
    class="contain-map-view"
    :style="{ height: calculateHeight(), width: calculateWidth() }"
  >
    <div id="map" class="map" tabindex="0" >
      <div style="position: fixed; margin-top: 10px; z-index: 99;">
        <qtm-toggle-switch
          v-if="true"
          label-position="right"
          :classes="mapViewStore.mapTheme ==='light' ? 'text-black-100':''"
          :checked="mapViewStore.mapTheme ==='light'"
          @value-changed="(e) => {mapViewStore.handleMapTheme(e.detail.checked)}">
          {{mapViewStore.mapTheme.charAt(0).toUpperCase() + mapViewStore.mapTheme.slice(1)}}
        </qtm-toggle-switch>
      </div>
      
    </div>
    <MenuFloatingBottom />
   
    <div id="tooltipCustom" class="ol-tooltip"></div>
    <div id="tooltipHistory" class="ol-tooltip"></div>
  </div>
</template>

<style scoped>
.svg-container {
  position: absolute;
  width: 500px;
  height: 480px;
}

.contain-map-view {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
}

.tooltip {
  position: absolute;
  top: 20%;
  left: 50%;
  background-color: #fff;
  padding: 5px;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.map {
  width: 100%;
  height: 100%;
  outline: none !important;
}

a.skiplink {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}

a.skiplink:focus {
  clip: auto;
  height: auto;
  width: auto;
  background-color: #fff;
  padding: 0.3em;
}

#map:focus {
  outline: #4a74a8 solid 0.15em;
}
</style>
