import { ref, computed, watch, onMounted } from 'vue'
import { defineStore, mapState } from 'pinia'
import { useRulesStore } from './rulesStore';
import { usePopupAlertStore } from "./popupAlertStore";
import Draw from 'ol/interaction/Draw.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Layer, Vector as VectorLayer } from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleGeom, Geometry, Point } from 'ol/geom.js';
import { Polygon as PolygonGeom } from 'ol/geom.js';
import { circular } from 'ol/geom/Polygon';
import { WKT } from 'ol/format';
import { Feature, View } from 'ol';
import { extend as extentExtend,createEmpty } from 'ol/extent';
import { Interaction, Modify, MouseWheelZoom } from 'ol/interaction';
import Collection from 'ol/Collection';
import { Style, Fill, Stroke,Text, Circle } from 'ol/style.js';
import * as olProj from 'ol/proj';
// @ts-ignore
import * as turf from '@turf/turf';
import { isFocusableElement } from '@/helpers/isFocusableElement';
import { colorPolygonForTypeRules, texturePolygon } from '@/helpers/mapHelper';
import type { IAoiDraw, ViewOptions } from '@/interfaces/IDraw';
import TileLayer from 'ol/layer/Tile';
import html2canvas from 'html2canvas';
import * as ol from "ol";
import { useExportStore } from './exportStore';
import { useCountryStore } from './countryStore';
import getApiDocker from '@/api/apiDocker';
import { _EXPIRED } from '@/constants/constants';
import { useLoadStore } from './loadStore';
import { useScreenStore } from './screenStore';
interface Coordinate {
  latitud: number;
  longitud: number;
}

export const useMapViewStore = defineStore('mapViewStore', () => {
  const selectDrawOption = ref<'Circle' | 'Polygon' | 'None' | 'Point'>('None');
  const mapTheme = ref<'light' | 'dark'>('dark')
  const disabledClustersAndPolygons = ref<boolean>(false)
  const viewLayers = ref<boolean>(false)
  const drawFigure = ref();
  const positionInMap = ref<string>()
  const popupAlertStore = usePopupAlertStore()
  const exportStore = useExportStore()
  const countryStore = useCountryStore();
  const loadStore = useLoadStore()
  const positionModalContext = ref()
  const showMenuContextual = ref(false)
  const isDrawActive = ref<boolean>(false)
  const disableButtonZoom = ref({
    zoomIn: false,
    zoomOut: false,
    resetZoom: false
  })
  const rulesStore = useRulesStore()
  const screenStore = useScreenStore();
  const vectorCountryMap = ref()
  const handleMapTheme = (value: boolean) => {
    if (value) {
      mapTheme.value = 'light'
    } else {
      mapTheme.value = 'dark'
    }
  }
  const drawFigureLayerCreation = ref();
  const circleFigure: any = ref({
    centerLatidude: 0,
    centerLongitude: 0,
    radius: 0,
    wkt: ''
  });
  const polygonFigure: any = ref({
    cordinates: [],
    wkt: ''
  });
  const polygonCountryFigure: any = ref({
    cordinates: [],
    wkt: ''
  });
  let map = ref();
  var vectorSource = new VectorSource();
  var vectorLayer = new VectorLayer({
    source: vectorSource
  });
  const addPolygons = () => {
    
    const ruleTypeColors: Record<string, string> = {
      permissive: 'rgba(32,182,95,0.7)',
      tracking: 'rgba(254,233,124,0.7)',
      prohibitive: 'rgba(255,26,41,0.7)',
    };
    rulesStore.itemsSelected.forEach((rule, index) => {
      const wkt = rule.geometry.area_wkt;

      const matches = wkt.match(/([\d.-]+ [\d.-]+)/g);

      if (matches) {
        const coordenadasWKT: Coordinate[] = matches.map((match: string) => {
          const [longitud, latitud] = match.split(' ').map(Number);
          return { latitud, longitud };
        });

        const centroLatitud = coordenadasWKT.reduce((sum, coord) => sum + coord.latitud, 0) / coordenadasWKT.length;
        const centroLongitud = coordenadasWKT.reduce((sum, coord) => sum + coord.longitud, 0) / coordenadasWKT.length;

        const puntosSVG = coordenadasWKT.map(({ latitud, longitud }: { latitud: number, longitud: number }) => {
          const x = (longitud - centroLongitud) * 15 + 250;
          const y = (centroLatitud - latitud) * 15 + 250;
          return `${x},${y}`;
        }).join(' ');

        const color = ruleTypeColors[rule.rule_type] || 'gray';
        const elementId = `myPolygon${index}`;
        const element = document.getElementById(elementId);

        if (element) {
          element.setAttribute('points', puntosSVG);
          element.setAttribute('style', `fill: ${color}; stroke: white; stroke-width: 1;`);
        }
      }
    });
  };

  const tooltipVisibility = ref<boolean[]>([]);

  const setTooltipVisibility = (index: number, isVisible: boolean) => {
    tooltipVisibility.value[index] = isVisible;

  };

  const getTooltipVisibility = (index: number) => {

    return tooltipVisibility.value[index] || false;
  };
  const handleSelectDrawOption = (option: 'Circle' | 'Polygon') => {
    selectDrawOption.value = option;
  }
  const circleFigureDraw = (center: any, radius: number, wktValue: string) => {
    //const wkt = `CIRCLE ((${center[0]} ${center[1]}, ${radius}))`;
    var centerCoords = olProj.transform([center[0], center[1]], 'EPSG:3857', 'EPSG:4326');
    var latitude = centerCoords[1];
    var longitude = centerCoords[0];
    var radius_km = radius / 1000
    circleFigure.value = {
      centerLatidude: latitude,
      centerLongitude: longitude,
      radius: radius_km,
      wkt: wktValue
    }
  }
  const polygonFigureDraw = (coordinates: any, wktValue: string,isMultipolygonValue:boolean = false) => {
    polygonFigure.value = {
      cordinates: coordinates,
      wkt: wktValue,
      wktFigure: wktValue,
      isMultiPolygon:isMultipolygonValue
    }

  }
  const restorePoylgonFigure = () => {
    polygonFigure.value = {
      cordinates: [],
      wkt: ''
    }
  }
  const polygonCountryFigureDraw = (coordinates: any, wktValue: string) => {
    polygonCountryFigure.value = {
      cordinates: coordinates,
      wkt: wktValue
    }

  }
  const restoreCountryPoylgonFigure = () => {
    polygonCountryFigure.value = {
      cordinates: [],
      wkt: ''
    }
  }
  const removeLayerCountryPolygon = () => {
    map.value.removeLayer(vectorCountryMap.value);
  }

  const isPolygonValid = (coordinates: any) => {
    const poly2 = turf.polygon([coordinates[0]]);
    const kinks = turf.kinks(poly2)
    if (kinks.features.length > 0) {

      return false
    }
    return true;
  }

  async function removeInteraction() {
    if(drawFigure.value !== undefined){
      map.value.removeInteraction(drawFigure.value);
    }
    if(drawFigureLayerCreation.value !== undefined){
      map.value.removeInteraction(drawFigureLayerCreation.value);
    }
  }
  const handleDrawActive =  async () => {
    isDrawActive.value = false
  }

  const activateDraw =  (geometryType: any) => {
    isDrawActive.value = true
    map.value.getInteractions().forEach((interaction: any) => {
      if (interaction instanceof Draw) {
        map.value.removeInteraction(interaction);

      }
    });

    drawFigureLayerCreation.value = new Draw({
      source: vectorSource,
      type: geometryType,
    });

    drawFigureLayerCreation.value.on('drawend', handleDrawEnd);
    map.value.addInteraction(drawFigureLayerCreation.value);
  }
  async function handleDrawEnd(event: any) {
    
    const feature = event.feature;
    const geometry = feature.getGeometry();

    if (geometry instanceof CircleGeom) {

      const center = geometry.getCenter();
      const radius = geometry.getRadius();
   
      const numSegments = 64;
      let polygonPoints: Array<number>[] = [];
      for (let i = 0; i < numSegments; i++) {
        const angle = (2 * Math.PI / numSegments) * i;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        const point: Array<number> = [x, y];
        polygonPoints.push(point);
      }
      polygonPoints.push(polygonPoints[0]);
      const polygonGeometry = new PolygonGeom([polygonPoints]);
     
      const wktFormat = new WKT();
      let wktCircle = wktFormat.writeGeometry(polygonGeometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      const handleModifyEnd = () => {
        const centerModify = geometry.getCenter();
        const radiusModify = geometry.getRadius();
        let polygonPointsModify: Array<number>[] = [];
        for (let i = 0; i < numSegments; i++) {
          const angle = (2 * Math.PI / numSegments) * i;
          const x = centerModify[0] + radiusModify * Math.cos(angle);
          const y = centerModify[1] + radiusModify * Math.sin(angle);
          const point: Array<number> = [x, y];
          polygonPointsModify.push(point);
        }
        polygonPointsModify.push(polygonPointsModify[0]);
        const polygonGeometry = new PolygonGeom([polygonPointsModify]);
        wktCircle = wktFormat.writeGeometry(polygonGeometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        circleFigureDraw(centerModify, radiusModify, wktCircle);
      };
      
      circleFigureDraw(center, radius, wktCircle);
      feature.setId('feature-circle-table'); 
      const modifyInteraction = new Modify({
        features: new Collection([feature]),
      });
      modifyInteraction.on('modifyend', handleModifyEnd);
      map.value.addInteraction(modifyInteraction);
    }
    if (geometry instanceof PolygonGeom || geometry instanceof Point) {
      const coordinates = geometry.getCoordinates();

      if(geometry instanceof PolygonGeom) {
        if (!isPolygonValid(coordinates)) {
          popupAlertStore.showPopupAlert('Error', 'Invalid polygon')
        }
      }

      const wktFormat = new WKT();
      let wkt = wktFormat.writeGeometry(geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      const handleModifyEnd = () => {
        const modifiedCoordinates = geometry.getCoordinates();
        wkt = wktFormat.writeGeometry(geometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        polygonFigureDraw(modifiedCoordinates, wkt);
       
      };
      polygonFigureDraw(coordinates, wkt);
      const modifyInteraction = new Modify({
        features: new Collection([feature]),
      });
      modifyInteraction.on('modifyend', handleModifyEnd);
      map.value.addInteraction(modifyInteraction);
    }
   removeInteraction()
   setTimeout(async () => {
    await handleDrawActive()
   }, 1000);
   
  }
  function removeModifyInteraction() {
    if (map.value) {
      map.value.getInteractions().forEach((interaction: any) => {
        if (interaction instanceof Modify) {
          map.value.removeInteraction(interaction);
        }
      });
    }
  }
  function cancelDrawing() {
    vectorSource.clear()
  }
  function clearDraw() {
    removeInteraction()
    removeModifyInteraction()
    cancelDrawing()
  }
  const resetPolygonFigure = () => {
    Object.assign(polygonFigure.value, {
      cordinates: [],
      wkt: ''
    });
  }
  const resetCircleFigure = () => {
    Object.assign(circleFigure.value, {
      centerLatidude: 0,
      centerLongitude: 0,
      radius: 0,
      wkt: ''
    });
  }
  const drawPoligon = () => {
    resetPolygonFigure()
    removeModifyInteraction()
    cancelDrawing()
    activateDraw('Polygon')
  }
  const drawCircle = () => {
    resetCircleFigure()
    removeModifyInteraction()
    cancelDrawing()
    activateDraw('Circle')
  }
  const drawPoint = () => {
    resetCircleFigure()
    removeModifyInteraction()
    cancelDrawing()
    activateDraw('Point')
  }
  
  const vectorAoiLayer = ref()
  const selectAOIdraw = (wkts: IAoiDraw[],viewOptions: ViewOptions = {}) => {
    if (!map.value) {
      console.error('Map is not initialized.');
      return;
  }
    var format = new WKT();
    const features: Feature[] = [];
    wkts.forEach((item: IAoiDraw) => {
      let style;
      const statusActive = item.statusRule === _EXPIRED
      const color:any = statusActive? 'rgba(0, 0, 0, 0)': colorPolygonForTypeRules(item.colorType);
      const baseStyle = new Style({
        fill: new Fill({
          color: item.statusRule?texturePolygon(item.statusRule,color):color,
        }),
        stroke: new Stroke({
          color: 'rgba(255, 255, 255)',
          width: 0.5,
        }),
      });

      if (item.wkt.startsWith('POINT')) {
        style = new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: colorPolygonForTypeRules(item.colorType),
            }),
            stroke: new Stroke({
              color: 'rgba(255, 255, 255)',
              width: 0.1,
            }),
          }),
        });
      } else {
        style = baseStyle;
      }

      const feature = format.readFeature(item.wkt, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      feature.setStyle(style);
      feature.set('groupId', 'ruleFigure-' + item.idAoi);
      features.push(feature);
    });
    if(vectorAoiLayer.value !== undefined){
      map.value.removeLayer(vectorAoiLayer.value);
    }

    vectorAoiLayer.value = new VectorLayer({
      source: new VectorSource({
        features: features
      })
    });
    (vectorAoiLayer.value as any).id = 'aoiLayerCustom';
    map.value.addLayer(vectorAoiLayer.value);
    const polygonGeometries = features.map(feature => feature.getGeometry());
    const combinedExtent = polygonGeometries.reduce((extentValue: number[] | null, geometry) => {
      if (geometry) {
        const geometryExtent = geometry.getExtent();
        if (extentValue && geometryExtent) {
          return extentExtend(extentValue, geometryExtent);
        } else if (geometryExtent) {
          return geometryExtent.slice();
        } else {
          return extentValue;
        }
      } else {
        return extentValue;
      }
    }, null);
    const view = map.value.getView();
    view.setMaxZoom(Infinity);
    if (viewOptions.centerPosition === 'right' ) {   
      view.fit(combinedExtent, {
        padding: [200, -50, 200, 1250],
        duration: 1000
      });
    } else {
      if (viewOptions.centerPosition === 'custom' ) {
        view.setMaxZoom(8);
        view.fit(combinedExtent, {
          padding: viewOptions.positionCustom?.padding,
          duration: viewOptions.positionCustom?.duration,
          
        });
      }else{
        if (combinedExtent) {
           view.fit(combinedExtent, {
          padding: [50, 50, 50, 50],
          duration: 1000
        });
        }
       
      }

    }
    // this comment for zoom options.
    // if (viewOptions.zoomLevel !== undefined) {
    //   view.setZoom(viewOptions.zoomLevel);
    // }
  }
  const selectAOIdrawCustom = async(wkts: IAoiDraw[], viewOptions: ViewOptions = {}, paddingCustom = [50, 50, 50, 50]) => {
    var format = new WKT();
    const features: Feature[] = [];
    wkts.forEach((item: IAoiDraw, index: number) => {
      
        const style = new Style({
          fill: new Fill({
              color: item?.name == 'SR'? 'rgba(23, 62, 191, 0.5)': colorPolygonForTypeRules(item.colorType),
          }),
          stroke: new Stroke({
              color: item.colorType === 'aoi' ? '#173EBF' : item?.name == 'SR' 
                                                    ?'#FFFFFF'
                                                    :'rgba(255, 255, 255)',
              width: (item.colorType === 'aoi' || item?.name == 'SR') ? 1 : item?.name == "AoI" ? 0.75 : 0.5,
          })
        //   text: new Text({
        //     text: item.name,
        //     font: '14px Roboto,sans-serif',
        //     fill: new Fill({
        //         color: '#000',
        //     }),
        //     overflow: true,
        //     textAlign: item?.name == 'SR'?'start':'end',
        //     textBaseline:item?.name == 'SR'? 'bottom':'top'          
        // })
      });
      
      const feature = format.readFeature(item.wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
      });
      feature.setStyle(style);
      feature.setId('ruleHistory-' + item.idAoi+ '-' + index);
      feature.set('groupId', 'ruleHistory-' + item.idAoi);
      feature.set('idFigure', item.idAoi);
      feature.set('figureType', item.name);
      feature.set('aoiDrawCustom','aoiDrawCustom')
      features.push(feature);  
    });
    if (vectorAoiLayer.value !== undefined) {
        map.value.removeLayer(vectorAoiLayer.value);
    }

    vectorAoiLayer.value = new VectorLayer({
        source: new VectorSource({
            features: features
        })
    });
    (vectorAoiLayer.value as any).id = 'aoiLayerCustom';
    map.value.addLayer(vectorAoiLayer.value);

    

    const polygonGeometries = features.map(feature => feature.getGeometry());
    let features2: Feature<Geometry>[] = vectorAoiLayer.value.getSource().getFeatures();
    const combinedExtent = polygonGeometries.reduce((extentValue: number[] | null, geometry) => {
        if (geometry) {
            const geometryExtent = geometry.getExtent();
            if (extentValue && geometryExtent) {
                return extentExtend(extentValue, geometryExtent);
            } else if (geometryExtent) {
                return geometryExtent.slice();
            } else {
                return extentValue;
            }
        } else {
            return extentValue;
        }
    }, null);
    const view = map.value.getView();
    if (viewOptions.centerPosition === 'right') {
        view.fit(combinedExtent, {
            padding: [200, -50, 200, 1250],
            duration: 1000
        });
    } else {
        view.fit(combinedExtent, {
            padding: paddingCustom,
            duration: 1000
        });
    }
    // this comment for zoom options.
    // if (viewOptions.zoomLevel !== undefined) {
    //   view.setZoom(viewOptions.zoomLevel);
    // } 
}
  const viewSelectedAoi = async (rule?:string, isRule = false) => {
    let features: Feature<Geometry>[] = vectorAoiLayer.value.getSource().getFeatures();
    let groupedFeatures: { [key: string]: Feature<Geometry>[] } = {};
    const uniqueAoisViewIds = Array.from(new Set(rulesStore.selectedAoisViewIds));

    const originalStyles = new Map<Feature<Geometry>, Style | null>();
    features.forEach((feature:any) => {
        originalStyles.set(feature, feature.getStyle());
    });
    let idComplement = rule? rule :'ruleHistory-'
    let featureCollection = uniqueAoisViewIds
    featureCollection = featureCollection.filter((id: string) => id !== "N/A");
    if(rule){
      featureCollection = rulesStore.itemsSelected.map((it:any) => it.rule_id)
    }
    for (const id of featureCollection) {
      let matchingFeatures = features.filter((f: Feature<Geometry>) => f.get('groupId') === idComplement + id);
      if (matchingFeatures.length > 0) {
        if (!groupedFeatures[id]) {
          groupedFeatures[id] = [];
        }
        groupedFeatures[id].push(...matchingFeatures);
      }
    }
    const getCombinedExtent = (features: Feature<Geometry>[]) => {
      let extent = createEmpty();
      features.forEach((feature: Feature<Geometry>) => {
        const geometry = feature.getGeometry();
        if (geometry) {
          extentExtend(extent, geometry.getExtent());
        }
      });
      return extent;
    };
    const totalGroups = Object.keys(groupedFeatures).length;
    let processedGroups = 0;
    let paddings = [30, isRule ? 310 : 165];
    if(rulesStore.viewRules === 'divide' && isRule){
      paddings = [30, 165];
    }

    for (const id in groupedFeatures) {
      if (groupedFeatures.hasOwnProperty(id)) {
        let group = groupedFeatures[id];
        processedGroups += 1;
        
        let combinedExtent = getCombinedExtent(group);
        const view = map.value.getView();
        
         // hidden features not id
         features.forEach(feature => {
          if (!group.includes(feature)) {
              feature.setStyle(new Style({}));
          }
      });

        for (const [index, padding] of paddings.entries()) {
          view.fit(combinedExtent, {
            padding: [padding,padding,padding,padding],
            duration: 0
          });
          let zoomLevel = map.value.getView().getZoom();
          if (index === 1 && zoomLevel > 6) {
            view.setZoom(zoomLevel-3);
            zoomLevel = zoomLevel-3;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await exportStore.captureMapImage(id,padding,zoomLevel);
        }
        //restore style default
        features.forEach((feature:any) => {
          feature.setStyle(originalStyles.get(feature));
        });
      }
      loadStore.progress = Math.floor((processedGroups / totalGroups) * 100);
    }
  }
  const removeVectorLayer = () => {
    if (vectorAoiLayer.value) {
      map.value.removeLayer(vectorAoiLayer.value);
      vectorAoiLayer.value = undefined
    }
  }
  const restoreZoom =  async() => {
    const currentZoom = map.value.getView().getZoom();
    const minZoom = map.value.getView().getMinZoom();
    if (currentZoom < 3) {
      disableButtonZoom.value.resetZoom = true;
      return;

    }
    disableButtonZoom.value.resetZoom = true;
    if (disableButtonZoom.value.zoomIn) {
      disableButtonZoom.value.zoomIn = false;
    }

    disableButtonZoom.value.zoomOut = true;

    map.value.getView().animate({ zoom: minZoom, duration: 250 });
  }
  const zoomIn = () => {
    const view = map.value.getView();
    const currentZoom = view.getZoom();
    const maxZoom = view.getMaxZoom();

    if (currentZoom < maxZoom && currentZoom < 8) {
      const targetZoom = Math.min(currentZoom + 1, 8);
      view.animate({
        zoom: targetZoom,
        duration: 250
      });
      disableButtonZoom.value.zoomIn = false;
      disableButtonZoom.value.zoomOut = false;
      if (disableButtonZoom.value.resetZoom) {
        disableButtonZoom.value.resetZoom = false;
      }
    } else {
      disableButtonZoom.value.zoomIn = true;

    }
  }


  const zoomOut = () => {
    const view = map.value.getView();
    const currentZoom = view.getZoom();
    const minZoom = view.getMinZoom();

    if (currentZoom > minZoom && currentZoom > 3) {
      const targetZoom = Math.max(currentZoom - 1, 3);
      view.animate({
        zoom: targetZoom,
        duration: 250
      });
      disableButtonZoom.value.zoomOut = true;

      if (disableButtonZoom.value.resetZoom) {
        disableButtonZoom.value.resetZoom = false;
      }
    } else {
      disableButtonZoom.value.zoomOut = true;
      disableButtonZoom.value.resetZoom = true;

    }
  }
  const addZoomEventHandler = () => {
    if (map.value) {
      const view = map.value.getView();

      view.on('change:resolution', () => {
        const listeners = map.value.getListeners();
        const currentZoom = view.getZoom();
        const minZoom = view.getMinZoom();
        const maxZoom = view.getMaxZoom();

        let zoomlevel = 3.3

        if (screenStore.screenHeight > 3780) {
          zoomlevel = 5;
        } else if (screenStore.screenHeight > 1400) {
          zoomlevel = 4;
        } else if (screenStore.screenHeight > 860 && screenStore.screenHeight <= 1000) {
          zoomlevel = 3;
        }

        console.log('screenHeight',screenStore.screenHeight, currentZoom)
        console.log('screenHeight1',currentZoom <= minZoom || currentZoom <= zoomlevel)
        disableButtonZoom.value.zoomIn = currentZoom >= maxZoom || currentZoom >= 14;
        disableButtonZoom.value.zoomOut = currentZoom <= minZoom || currentZoom <= zoomlevel;
        disableButtonZoom.value.resetZoom = currentZoom <= zoomlevel;

        updateMouseWheelZoomState();
      });
    } else {
      setTimeout(addZoomEventHandler, 0);
    }
  };
  
  const updateMouseWheelZoomState = () => {
    const view = map.value.getView();
    const currentZoom = view.getZoom();
    const maxZoom = view.getMaxZoom();
  
    let enable = currentZoom < maxZoom && currentZoom < 14;
  
    if (enable) {
      enableMouseWheelZoom();
    } else {
      disableMouseWheelZoom();
    }
  };
  
  const enableMouseWheelZoom = () => {
    map.value.getInteractions().forEach((interaction:any) => {
      if (interaction instanceof MouseWheelZoom) {
        interaction.setActive(true);
      }
    });
  };
  
  const disableMouseWheelZoom = () => {
    map.value.getInteractions().forEach((interaction:any) => {
      if (interaction instanceof MouseWheelZoom) {
        interaction.setActive(false);
      }
    });
  };

  const addCountryMap = async (nameCountry: string) => {
    let result = countryStore.countryData.find( x => x.value == nameCountry)
    if(result){
      nameCountry = result.label.split(' - ')[1]
    }
    removeCountryMapSelected()
    const apiDocker = await getApiDocker();
    vectorCountryMap.value = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: apiDocker.defaults.baseURL + 'country',
      }),
      style: function (feature, res) {
        if (feature.get("name") === nameCountry) {
          const selectedCountryGeometry = feature.get("geometry");
          const coordinates = selectedCountryGeometry.getCoordinates();
          const wktFormat = new WKT();
          let wkt = wktFormat.writeGeometry(selectedCountryGeometry, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });
          polygonCountryFigureDraw(coordinates, wkt);
          return new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2
            })
          });
        }
      }
    });
    map.value.addLayer(vectorCountryMap.value);
  }
  const removeCountryMapSelected = () => {
    if(vectorCountryMap.value !== undefined){
      map.value.removeLayer(vectorCountryMap.value);
    }
    
  }
  watch(() => mapTheme.value, (newValue) => {
    const layers = map.value.getLayers().getArray();
    const layerExists = layers.find((layer: Layer) => layer === vectorAoiLayer.value);
  
    if (layerExists) {
      const source = vectorAoiLayer.value.getSource();
      if (source) {
        source.forEachFeature((feature: any) => {
          const aoiCustom = feature.get('aoiDrawCustom')
          if(aoiCustom !== undefined) return
          let newStyle;
          const currentStyle = feature.getStyle();
  
          if (feature.getGeometry().getType() === 'Point') {
            newStyle = new Style({
              image: new Circle({
                radius: 5,
                fill: new Fill({
                  color: newValue === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 0, 0.1)'
                }),
                stroke: new Stroke({
                  color: 'rgba(255, 255, 255, 1)',
                  width: 1,
                }),
              })
            });
          } else {
            newStyle = new Style({
              fill: new Fill({
                color: newValue === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 0, 0.1)'
              }),
              stroke: currentStyle.getStroke()
            });
          }
  
          feature.setStyle(newStyle);
        });
      }
    } else {
      console.log('Layer not found');
    }
  });

  onMounted(() => {
    disableButtonZoom.value.zoomOut = true;
    disableButtonZoom.value.resetZoom = true;
  });
  
  return {
    addPolygons,
    tooltipVisibility,
    setTooltipVisibility,
    getTooltipVisibility,
    handleSelectDrawOption,
    selectDrawOption,
    drawFigure,
    map,
    circleFigure,
    polygonFigure,
    polygonCountryFigure,
    circleFigureDraw,
    polygonFigureDraw,
    removeInteraction,
    activateDraw,
    vectorLayer,
    isPolygonValid,
    handleDrawEnd,
    drawPoligon,
    restorePoylgonFigure,
    selectAOIdraw,
    restoreZoom,
    removeModifyInteraction,
    cancelDrawing,
    resetPolygonFigure,
    zoomIn,
    zoomOut,
    disableButtonZoom,
    positionInMap,
    addZoomEventHandler,
    removeVectorLayer,
    addCountryMap,
    polygonCountryFigureDraw,
    restoreCountryPoylgonFigure,
    removeLayerCountryPolygon,

    drawFigureLayerCreation,
    clearDraw,
    resetCircleFigure,
    drawCircle,
    drawPoint,
    vectorSource,
    removeCountryMapSelected,
    mapTheme,
    handleMapTheme,
    positionModalContext,
    showMenuContextual,
    disabledClustersAndPolygons,
    viewLayers,
    selectAOIdrawCustom,
    vectorAoiLayer,
    viewSelectedAoi,
    isDrawActive,
    handleDrawActive
    
  }
})
