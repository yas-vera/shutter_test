import { _ACTIVE, _SAVED, _SUSPENDED } from "@/constants/constants";
import { useMapViewStore } from "@/stores/mapViewStore";
import { Style, Fill, Stroke } from "ol/style.js";
export const colorPolygonForTypeRules = (value: string | undefined)  => {
    const mapViewStore = useMapViewStore()
    if (value === undefined) return mapViewStore.mapTheme === 'light'?'rgba(0, 0, 0, 0.4)':'rgba(255, 255, 255, 0.2)'; //'rgba(255, 255, 0,0.1)'; 
    if (value === 'tracking') return 'rgba(255, 200, 0, 0.3)'; //'rgba(255, 255, 0,0.1)'; #FFC800
    if (value === 'permissive') return 'rgba(32, 182, 95, 0.3)'; //'rgba(0, 128, 0,0.1)'; #20B65F
    if (value === 'prohibitive') return 'rgba(255, 11, 11, 0.3)'; //'rgba(255, 0, 0,0.1)'; #FF0B0B
    if (value === 'white') return 'rgba(188, 190, 206, 0.5)';
    if(value === 'aoi') return 'rgba(208, 225, 255, 0.5)'; // #D0E1FF with opacity 50%
  };
export const colorPolygonForTypeRulesStroke = (value: string | undefined)  => {
  if (value === undefined) return '#FFFFFF'; 
  if (value === 'tracking') return '#FFC800';
  if (value === 'permissive') return '#20B65F'; 
  if (value === 'prohibitive') return '#FF0B0B'; 
  if (value === 'white') return '#FFFFFF';
};
  export const colorClusterForTypeRules = (value: string | undefined)  => {
    if (value === undefined) return '#4D96CE';
    if (value === 'tracking') return '#988316';
    if (value === 'permissive') return '#136D39';
    if (value === 'prohibitive') return '#991019';
  };

  export interface StylesConfig {
    landWater: {
      darkFill: string;
      lightFill: string;
    };
    land: {
      darkFill: string;
      lightFill: string;
    };
    park: {
      darkFill: string;
      lightFill: string;
    };
    landcover: {
      darkFill: string;
      lightFill: string;
    };
    boundary_state: {
      darkStroke: string;
      lightStroke: string;
    };
    borderLine: {
      darkStroke: string;
      lightStroke: string;
    };
    borderMultiLine: {
      darkStroke: string;
      lightStroke: string;
    };
    borderMultiLineTransportation: {
      darkStroke: string;
      lightStroke: string;
    };
    transportationName: {
      darkStroke: string;
      lightStroke: string;
    };
  }
export const stylesConfig :StylesConfig = {
  landWater: {
    darkFill: 'rgb(27 ,27 ,29)',
    lightFill: 'rgb(194, 200, 202)',
  },
  land: {
    darkFill: 'rgba(30, 30, 30, 0.6)',
    lightFill: 'rgb(242,243,240)',
  },
  park: {
    darkFill: 'rgba(30, 30, 30, 0.6)',
    lightFill: 'rgb(230, 233, 229)',
  },
  landcover: {
    darkFill: 'rgba(40, 40, 40, 0.6)',
    lightFill: 'rgb(220,224,220)',
  },
  boundary_state: {
    darkStroke: 'rgba(70, 70, 70, 1)',
    lightStroke: 'rgb(230, 204, 207)',
  },
  borderLine: {
    darkStroke: 'rgba(9, 9, 9, 0.6)',
    lightStroke: 'rgba(180, 180, 180, 0.6)',
  },
  borderMultiLine: {
    darkStroke: 'rgba(9, 9, 9, 0.6)',
    lightStroke: 'rgba(180, 180, 180, 0.6)',
  },
  borderMultiLineTransportation: {
    darkStroke: 'rgba(27,27,29,255)',
    lightStroke: '#fff',
  },
  transportationName: {
    darkStroke: 'rgba(27,27,29,255)',
    lightStroke: '#fff',
  },
};
export const getStyleMapVector = (feature:any, currentState :string) => {
  if (!feature) return undefined;
  const featureType = feature.getGeometry();
  
  const layerWater = featureType.getProperties();
  const landWater = stylesConfig.landWater
  const land = stylesConfig.land
  const park = stylesConfig.park
  const landCover = stylesConfig.landcover
  const boundary_state = stylesConfig.boundary_state
  const LineTransportation = stylesConfig.borderMultiLineTransportation
  const transportationName = stylesConfig.transportationName
  const borderMultiLine = stylesConfig.borderMultiLine
  switch (featureType.getType()) { //landcover
    case 'Polygon': 
      if (layerWater.layer === 'water') {
        return new Style({ fill: new Fill({ color: currentState === 'light' ? landWater.lightFill : landWater.darkFill }) });
      } else if (layerWater.layer === 'park') {
        return new Style({ fill: new Fill({ color: currentState === 'light' ? park.lightFill : park.darkFill }) });
      }else if (layerWater.layer === 'landcover') {
        return new Style({ fill: new Fill({ color: currentState === 'light' ? landCover.lightFill : landCover.darkFill }) });
      }
       else {
        return new Style({ fill: new Fill({ color: currentState === 'light' ? land.lightFill : land.darkFill }) });
      }
     
    case 'LineString':
      if(layerWater.layer === 'transportation'){
        new Style({ stroke: new Stroke({ color: currentState === 'light' ? LineTransportation.lightStroke : LineTransportation.darkStroke, width: 1 }) })
      }else if(layerWater.layer === 'boundary'){
        new Style({ stroke: new Stroke({ color: currentState === 'light' ? boundary_state.lightStroke : boundary_state.darkStroke, width: 1 }) })
      }
      else{
        new Style({ stroke: new Stroke({ color: currentState === 'light' ? LineTransportation.lightStroke : LineTransportation.darkStroke, width: 1 }) })
      }
//
    case 'MultiLineString':
      if(layerWater.layer === 'transportation'){
        return new Style({ stroke: new Stroke({ color: currentState === 'light' ? LineTransportation.lightStroke : LineTransportation.darkStroke, width: 1 }) });
      }else if(layerWater.layer === 'transportation_name'){
        return new Style({ stroke: new Stroke({ color: currentState === 'light' ? transportationName.lightStroke : transportationName.darkStroke, width: 3 }) });
      }
      else{
        return new Style({ stroke: new Stroke({ color: currentState === 'light' ? borderMultiLine.lightStroke : borderMultiLine.darkStroke, width: 1 }) });
      }
      

    default:
      return undefined;
  }
};

export const texturePolygon = (status: string, color: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  const context = canvas.getContext('2d');
  let pattern: CanvasPattern | null = null;

  if (context !== null) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    switch (status) {
      case _SUSPENDED:
        context.strokeStyle = 'rgba(188, 190, 206, 0.5)';  
        context.lineWidth = 1;  
        context.beginPath();
        context.moveTo(0, 10);
        context.lineTo(10, 0);
        context.stroke();
        pattern = context.createPattern(canvas, 'repeat');
        break;

      case _SAVED:
        context.fillStyle = 'rgba(188, 190, 206, 0.5)';
        context.beginPath();
        context.arc(4, 4, 2, 0, 2 * Math.PI);
        context.fill();
        pattern = context.createPattern(canvas, 'repeat');
        break;

      case _ACTIVE:
        pattern = context.createPattern(canvas, 'repeat');
        break;

      default:
        pattern = context.createPattern(canvas, 'repeat');
        break;
    }
  }

  return pattern;
};
