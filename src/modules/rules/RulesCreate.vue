<script setup lang="ts">
import MultiStepForm from '@/components/stepperForm/MultiStepForm.vue';
import useRules from './hooks/useRules';
import ModalConfirm from '@/components/modal/ModalConfirm.vue';
import { Teleport, computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useGroupStore } from '@/stores/groupStore';
import { useScreenStore } from '@/stores/screenStore';
import ClickOutSide from '@/components/clickoutside/ClickOutSide.vue';
import useUserTable from '../userAndGroup/users/hooks/useUserTable';
import { formConfigRules } from "./config/formConfig";
import {
  headersUserFormRules,
  headersGeometry,
  headersGeometryCircle,
} from "./config/headersTable";
import {
  convertFormatDate,
  convertFormatDateSimple,
  getFormattedDateTime,
  convertFormatDateDDmmyyHHmm,
  convertFormatDateAndValidDate,
  convertFormatFilterShcDate,
} from "@/helpers/convertDateTime";
import LatLonSexagInput from "./components/LatLonSexagInput.vue";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { WKT } from "ol/format";
import { Polygon as PolygonGeom,MultiPolygon as MultiPolygonGeom } from "ol/geom.js";
import { Circle as CircleGeom } from "ol/geom.js";
import VueMultiselect from "vue-multiselect";
import * as olCoordinate from "ol/coordinate";
import * as olProj from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import {
  bodyRowClassNameFunction,
  capitalizeFirstLetter,
  colorButton,
  colorButtonClass,
  colorTagClass,
  countItem,
  countItems,
  getValuesAndIds,
  getValuesAndIdsExpanded,
  isExpanded,
  sortBy,
  sortType,
  groupRuleset,
  validateLargeText,
  handleLabelMultiselectFilter,
  getValues,
} from "@/helpers/tableHelpers";
import {
  QtmButton,
  QtmDivider,
  QtmTextInput,
  QtmTypography,
  QtmIcon,
  QtmCheckbox,
  QtmFormLabel,
  QtmDropdownSelect,
  QtmDropdownSelectOption,
  QtmTag,
  QtmTabs,
  QtmTooltip,
  QtmTab,
  QtmRadioButton,
  QtmModal,
  QtmModalFooter,
  QtmModalHeader,
  QtmModalTitle,
  QtmModalSubtitle,
  QtmModalBody,
  QtmModalDivider,
  QtmTextarea,
  QtmFormField,
  QtmFormCaption,
  QtmToggleSwitch,
  QtmDropdown,
  QtmDropdownTrigger,
  QtmMenuItemList,
  QtmMenuItemLabel,
  QtmMenuItem,
  QtmDropdownOverlay,
  QtmGrid
} from "@qtm/vue";
import PaginationCustom from "@/components/tableCustom/PaginationCustom.vue";
import type { Item } from "vue3-easy-data-table";
import SearchPicker from "@/components/searchPicker/SearchPicker.vue";
import { usePopupAlertStore } from "@/stores/popupAlertStore";
import { Draw, Modify, Select } from "ol/interaction";
import { Collection, Feature } from "ol";
import { convertTextTruncate } from "../../helpers/convertDateTime";
import { states, statesUsers } from "@/data/selectOptions";
import MenuContextual from "../map/MenuContextual.vue";
import { useRulesStore } from "@/stores/rulesStore";
import type { IAoiDraw } from "@/interfaces/IDraw";
import { useMapViewStore } from "@/stores/mapViewStore";
import {
  formatearDMSWithDirection,
  radiusSexagesimalToDecimalCircle,
  sexagesimalToDecimalCircle,
} from "@/helpers/CoordinatesHelper";
import { limitDecimals, validateInputDecimals } from "@/helpers/validateInput";
import { convertToWKT } from '@/helpers/convertWKT';
import { Geometry } from 'ol/geom';
import Circle from 'ol/geom/Circle';
import { fromCircle } from 'ol/geom/Polygon';
import Polygon from 'ol/geom/Polygon';
import { getCenter, getWidth } from 'ol/extent';
import { transform } from 'ol/proj';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { filterOptions as filterOptionsList } from "@/data/filterOptions";
const props = defineProps<{
  show: boolean;
  indexPosition: number;
}>();
interface InearsetPoint {
  found: boolean;
  ringIndex: number | null;
  pointIndex: number | null;
}
const {
  shcGroupsStore,
  loaderStore,
  mapStore,
  userStore,
  rulesStore,
  selectedGroup,
  unSelectGroups,
  isUnSelectGroups,
  unSelectUsers,
  isUnSelectUsers,
  filterForName,
  importFromFile,
  importFromFileShp,
  dataImportShp,
  dataNameImportShp,
  toggleSelectGroup,
  isSelected,
  handlePageChange,
  handleLimitChange,
  formDataSubmit,
  resetForm,
  searchGroup,
  handleSubmitFilterRules,
  hasNonEmptyValues,
  requiredInput,
  cardMinHeight,
  closeFormNewRule,
  currentStepNumber,
  handleCurrentStepNumber,
  showModalClose,
  modalConfirmClose,
  handleMenuShape,
  handleMenuGeometry,
  menuShape,
  menuGeometry,
  selectedDataStagna,
  selectOptionPolygon,
  activeRuleNew,
  isImportedGeometry,
  isMultipolygon,
  clearPolygon,
  restorePolygon,
  restoreImportShp,
  vectorWktGeometry,
  sourceWKTGeometry
} = useRules();
const {
  user_idCriteria,
  user_idCriteria_temp,
  stanag_idCriteria,
  status_criteria,
  status_criteria_temp,
  udsGroup_Criteria,
  group_shcs_Criteria,
  missions_Criteria,
  insertion_date_start_Criteria,
  insertion_date_start_Criteria_temp,
  insertion_date_end_Criteria,
  insertion_date_end_Criteria_temp,
  license_expiration_date_start_Criteria,
  license_expiration_date_end_Criteria,
  license_expiration_date_start_Criteria_temp,
  license_expiration_date_end_Criteria_temp,
  user_rules_Criteria,
  user_rules_Criteria_temp,
  showUser_idFilter,
  showStanag_idFilter,
  showStatus_header,
  udsGroup_header,
  group_shcs_header,
  missions_header,
  insertion_date_date_header,
  license_expiration_date_header,
  user_rules_header,
  toggleRowExpansion,
  isRowExpanded,
  expandedRows,
  filterOptions,
  selectedStanagIdsTemp,
  stanagSearchTerm,
  handleStanagIdCheckboxChange,
  resetFilters,
  applyFilters,
  mappedDataStanagCountrys,
  filteredMappedDataStanag,
  serverOptions,
  serverItemsLength,

  resetUdsGroupFilters,
  applyUdsGroupFilters,
  udsGroupSearchTerm,
  handleUdsGroupCheckboxChange,
  selectedUdsGroupIdsTemp,
  filteredMappedDataUdsGroup,

  applyShcGroupFilters,
  resetShcGroupFilters,
  shcGroupSearchTerm,
  handleShcGroupCheckboxChange,
  selectedShcGroupIdsTemp,
  filteredMappedDataShcGroup,

  missionGroupSearchTerm,
  filteredMappedDataMissionGroup,
  applyMissionGroupFilters,
  resetMissionGroupFilters,
  handleMissionGroupCheckboxChange,
  selectedMissionGroupIdsTemp,

  offsetValue,
  pagProperty,
  loadFromServer,
  filterState,
  handleFilterState,
  elementPosition,
  rangePagesUser,
  getDataSelect
} = useUserTable();

const showActions = ref(false);
const hoveredRowIndex = ref<number | null>(null);
const resultAction = ref<InearsetPoint>();
const removewithDeleteKey = ref();
const showModalConfirm = ref(false);
const showModalWktGeometry = ref(false);
const showModalWktGeometryCircle = ref(false);
const showDropdownImportPolygon = ref(false);
const showDropdownImportCircle = ref(false);
const valueWKTGeometry = ref<string>("");
const valueWKTGeometryCircle = ref<string>("");
const coordinateGeometry = ref<string>("Sexageximal");
const coordinateGeometryCircle = ref<string>("Sexageximal");
const groupsStore = useGroupStore();
const screenStore = useScreenStore();
const isLonInvalid = ref<boolean>(false)
const isLatInvalid = ref<boolean>(false)
const selectedCircleItem = ref<any>({
  key: 0,
  id: 1,
  center_lon: '',
  center_lat: '',
  radius: '',
})

const selectedPolygonItem = ref<any>({
  key: 0,
  id: 1,
  lon: '',
  lat: '',
})
let limitRowCostum:any=ref(10000);

const ruleStore = useRulesStore();
const mapViewStore = useMapViewStore();
const popupAlertStore = usePopupAlertStore();
const isTooltipVisible = ref<{ [key: number]: boolean }>({});

const toggleTooltip = (index: number, result: boolean) => {
  isTooltipVisible.value[index] = result;
};


const sourceWKTGeometryCircle = new VectorSource({ wrapX: false });

const vectorWktGeometryCircle = new VectorLayer({
  source: sourceWKTGeometryCircle,
});

const clearValidationsInputs = () => {
  invalidGeometry.value = false
  invalidInputLat.value = []
  invalidInputLon.value = []
  invalidInputRad.value = []
}

const handleCoordinateGeometry = (option = "polygon") => {
  clearHoveredRow();
  clearValidationsInputs();

  if (option === "polygon") {
    if (coordinateGeometry.value == "Decimal") {
      coordinateGeometry.value = "Sexageximal";
    } else {
      coordinateGeometry.value = "Decimal";
    }
    
    if(!Array.isArray(mapStore.polygonFigure.wkt)) {
      const wktFigure = mapStore.polygonFigure.wkt;
      mapStore.polygonFigure.wktFigure = wktFigure;
    }
    mapStore.polygonFigure.wkt = formatDataCustom();
  } else {
    if (coordinateGeometryCircle.value == "Decimal") {
      coordinateGeometryCircle.value = "Sexageximal";
    } else {
      coordinateGeometryCircle.value = "Decimal";
    }
    mapStore.circleFigure.wkt = formatDataCircleCustom();
  }
};

const handleShowModalWktGeometry = () => {
  showModalWktGeometry.value = !showModalWktGeometry.value;
};
const handleShowModalWktGeometryCircle = () => {
  showModalWktGeometryCircle.value = !showModalWktGeometryCircle.value;
};
const createPolygon = () => {
  clearPolygon();
  clearCircle();
  restoreImportShp()
  showModalConfirm.value = false;
  mapStore.drawPoligon();
  mapStore.handleSelectDrawOption("Polygon");
};
const createCircle = () => {
  clearPolygon();
  clearCircle();
  showModalConfirm.value = false;
  mapStore.drawCircle();
  mapStore.handleSelectDrawOption("Circle");
};

const clearCircle = () => {
  mapStore.resetCircleFigure();
  //vectorWktGeometry.getSource()?.clear();
  mapStore.clearDraw();
  const figure = mapStore.circleFigure;
  figure.center_lon = 0;
  figure.center_lat = 0;
  figure.radius = 0;
  if ("id" in figure) {
    delete figure.id;
  }
  clearHoveredRow()
};
const handleEventConfirm = (option: boolean) => {
  if (option) {
    if (menuShape.value === "Polygon") {
      createPolygon();
      clearHoveredRow();
    }
    if (menuShape.value === "Circle") {
      createCircle();
      clearHoveredRow();
    }
  } else {
    showModalConfirm.value = false;
  }
};

function decimalToSexagesimal(decimal: any) {
  var coordsFormat = olProj.transform(
    [decimal[0], decimal[1]],
    "EPSG:3857",
    "EPSG:4326"
  );
  const lon = coordsFormat[0];
  const lat = coordsFormat[1];

  const coordinateSexagesimal = olCoordinate.toStringHDMS(coordsFormat);
  return coordinateSexagesimal;
}

function sexagesimalToDecimal(sexagesimal: any) {
  const parts = sexagesimal
    .split(/[°′″NSEW]/)
    .filter((part: any) => part.trim() !== "");
  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1] || 0);
  const seconds = parseFloat(parts[2] || 0);
  const direction = sexagesimal.slice(-1);

  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === "S" || direction === "W") {
    decimal *= -1;
  }
  return decimal;
}

function splitCoordinates(coordString: string) {
  const match = coordString.match(/.*?[NSWE]/i);

  if (match !== null) {
    const index = match.index !== undefined ? match.index + match[0].length : 0;
    const part1 = coordString.substring(0, index).trim();
    const part2 = coordString.substring(index).trim();

    return [part1, part2];
  } else {
    return [coordString.trim()];
  }
}

const handleDecimalPolygon = (l: any, t: any) => {
  const lon = Number(l);
  const lat = Number(t);

  if (isNaN(lon) || isNaN(lat)) {
    return [l, t];
  }

  if (l === "" || t === "") {
    return [l, t];
  }

  const [x, y] = olProj.transform([l, t], "EPSG:3857", "EPSG:4326");

  // const roundedX = Math.round(x * 1e6) / 1e6;
  // const roundedY = Math.round(y * 1e6) / 1e6;
  const roundedX = parseFloat(x.toFixed(5));
  const roundedY = parseFloat(y.toFixed(5));

  return [roundedX, roundedY];
};

const handleMercatorPolygon = (l: any, t: any) => {
  const lon = Number(l);
  const lat = Number(t);

  if (l === "" || t === "") {
    return [l, t];
  }

  if (isNaN(lon) || isNaN(lat)) {
    return [l, t];
  }

  if (lon < -180 || lon > 180) {
    return [l, t];
  }

  if (lat < -90 || lat > 90) {
    return [l, t];
  }

  try {
    const [x, y] = olProj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    return [x, y];
  } catch (error) {
    return [l, t];
  }
};

const formatDataCustom = () => {
  let option = coordinateGeometry.value;
  const figure = mapStore.polygonFigure.cordinates;
  const figureConvert = [];
  if (figure.length > 0) {
    const cordinates = figure[0];
    for (let index = 0; index < cordinates.length; index++) {
      let element: any;
      if (option == "Sexageximal") {
        const lonSexagesimal = decimalToSexagesimal(cordinates[index]);
        
        if(lonSexagesimal.toLowerCase().includes('nan')) {
          element = {
            id: index + 1,
            lon: '',
            lat: '',
          };
        }else {
          const [part1, part2] = splitCoordinates(lonSexagesimal);

          element = {
            id: index + 1,
            lon: part2,
            lat: part1,
          };
        }
      } else {
        
        if (cordinates[index].notupdate) {
          element = {
            id: index + 1,
            lon: cordinates[index][0] == 0 || cordinates[index][0] == '' ? '' : parseFloat(cordinates[index][0]).toFixed(5),
            lat: cordinates[index][1] == 0 || cordinates[index][1] == '' ? '' : parseFloat(cordinates[index][1]).toFixed(5),
          };
        }else {
          let [l, t] = handleDecimalPolygon(
            cordinates[index][0],
            cordinates[index][1]
          );
          element = {
            id: index + 1,
            lon: l == 0 || l == '' ? '' : parseFloat(l).toFixed(5),
            lat: t == 0 || t == '' ? '' : parseFloat(t).toFixed(5),
          }
        }
      }
      
      limitRowCostum=element.id;
      figureConvert.push(element);
    }
  }
  
  let exist = figureConvert.filter(
    (x) =>
      x.lon == undefined || x.lat == undefined || (x.lon == 0 && x.lat == 0)
  );
  if (exist) {
    exist.forEach((element: any) => {
      element.lon = "";
      element.lat = "";
    });
  }
  figureConvert.pop();

  return figureConvert;
};

const disableAddCoordinates = () => {
  let state = false;
  if (ruleStore.isEditRule) {
    return true;
  }
  if (mapStore.polygonFigure.cordinates[0]) {
    const coordinate = mapStore.polygonFigure.cordinates[0];
    let first = coordinate[0];
    let last = coordinate[coordinate.length - 1];
    last[0] = first[0];
    last[1] = first[1];
    state = hasInvalidValues(coordinate);
  }
  return state;
};
const disableCircleAddCoordinates = () => {
  let state = false;
  if (ruleStore.isEditRule) {
    return true;
  }
  const figure = mapStore.circleFigure;
  if (figure?.id || formatDataCircleCustom().length > 0) {
    state = true;
  }
  return state;
};
function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number {
  // Convert DMS to decimal
  let decimal = degrees + minutes / 60 + seconds / 3600;

  // Adjust for the direction
  if (direction === "S" || direction === "W") {
    decimal *= -1;
  }

  return decimal;
}
function checkIfCoordinatesValid(
  latDMS: string,
  lonDMS: string
): boolean {
  const latParts = latDMS.match(/(\d+)[°\s]+(\d+)[′\s]+([\d.]+)[″\s]+([NS])/);
  const lonParts = lonDMS.match(/(\d+)[°\s]+(\d+)[′\s]+([\d.]+)[″\s]+([EW])/);

  

  return (!latParts || !lonParts)
}

function convertDMS(
  latDMS: string,
  lonDMS: string
): { latitude: number; longitude: number } | null {
  const latParts = latDMS.match(/(\d*)[°\s]+(\d*)[′\s]*(\d*(?:\.\d*)?)[″\s]*([NS])+/);
  
  if (!latParts) {
    popupAlertStore.showPopupAlert("Error", "Invalid latitude DMS format");
    return null;
  }

  const latDegrees = parseInt(latParts[1], 10);
  const latMinutes = parseInt(latParts[2], 10);
  const latSeconds = parseFloat(latParts[3]);
  const latDirection = latParts[4];
  const latitude = dmsToDecimal(
    !latDegrees ? 0 : latDegrees,
    !latMinutes ? 0 : latMinutes,
    !latSeconds ? 0 : latSeconds,
    latDirection
  );

  const lonParts = lonDMS.match(/(\d*)[°\s]+(\d*)[′\s]*(\d*(?:\.\d*)?)[″\s]*([EW])+/);
  

  if (!lonParts) {
    popupAlertStore.showPopupAlert("Error", "Invalid longitude DMS format");
    return null;
  }

  const lonDegrees = parseInt(lonParts[1], 10);
  const lonMinutes = parseInt(lonParts[2], 10);
  const lonSeconds = parseFloat(lonParts[3]);
  const lonDirection = lonParts[4];
  const longitude = dmsToDecimal(
    !lonDegrees ? 0 : lonDegrees,
    !lonMinutes ? 0 : lonMinutes,
    !lonSeconds ? 0 : lonSeconds,
    lonDirection
  );

  

  return { latitude, longitude };
}

const invalidInputLat = ref<any[]>([])
const invalidInputLon = ref<any[]>([])
const invalidInputRad = ref<any[]>([])
const invalidGeometry = ref<boolean>(false)

const updateCoordinates = (index: number, lat: any, lon: any) => {
  let latValue = lat;
  let lonValue = lon;
  const validLat = latValue > 90
  const validLon = lonValue > 180
 

  if (validLat || validLon) {
    invalidGeometry.value = true
    return
  }

  invalidGeometry.value = false

  if (coordinateGeometry.value === "Sexageximal") {
    const coordinate = mapStore.polygonFigure.cordinates[0];
    

    let newCoordinate = coordinate.map((coord: any) => {
      const lonSexagesimal = decimalToSexagesimal(coord);
      const [part1, part2] = splitCoordinates(lonSexagesimal);
      return [part1, part2];
    });
    let located = false;
    let index = -1;
    let matchedCoordinate = null;

    for (let i = 0; i < newCoordinate.length; i++) {
      const [lat, lon] = newCoordinate[i];
      if (lat === latValue && lon === lonValue) {
        located = true;
        index = i;
        matchedCoordinate = newCoordinate[i];
        break;
      }
    }

    if (located) {
      const [latSexagesimal, lonSexagesimal] = matchedCoordinate;
      const decimalCoords = convertDMS(latValue, lonValue);
      if(!decimalCoords) return
      // if(coordinate.length < 5) {
      //   addPointToPolygon(Number(decimalCoords?.longitude), Number(decimalCoords?.latitude), index);
      // }else {
      //   updatePointDataCustom(
      //     index + 1,
      //     Number(decimalCoords?.longitude),
      //     Number(decimalCoords?.latitude)
      //   );
      // }

      updatePointDataCustom(
          index + 1,
          Number(decimalCoords?.longitude),
          Number(decimalCoords?.latitude)
        );
    }
  } else {
    const coordinate = mapStore.polygonFigure.cordinates[0];
    

    let newCoordinate = coordinate.map((coord: any) => {
      let [x, y] = handleDecimalPolygon(coord[0], coord[1]);
      return [x, y, coord[0], coord[1]];
    });
    let result = null;

    let newResultLong = newCoordinate.find(
      (coord: any) => coord[0] == lonValue || coord[2] == lonValue
    );
    if(newResultLong) {
      result = coordinate.find(
        (coord: any) => coord[0] == newResultLong[2] || coord[0] == lonValue
      );
    }

    let newResultLat = newCoordinate.find(
      (coord: any) => coord[1] == latValue || coord[3] == latValue
    );
    if(newResultLat) {
      result = coordinate.find(
        (coord: any) => coord[1] == newResultLat[3] || coord[1] == latValue
      );
    }
    result.notupdate = true;
    result[0] = lonValue;
    result[1] = latValue;

    //addPointToPolygon(Number(lonValue), Number(latValue), index);

    updatePointDataCustom(
          index,
          Number(lonValue),
          Number(latValue)
        );
    return true

    if (coordinate.length <= 4) {
      addPointToPolygon(Number(lonValue), Number(latValue), index);
    } else {
      if (
        lonValue != "" &&
        lonValue?.toString().length > 1 &&
        latValue != "" &&
        latValue?.toString().length > 1
      ) {
        updatePointDataCustom(index, Number(lonValue), Number(latValue));
      }
    }
  }

  return true;
};

const updateCircleCoordinates = (item: any, option: string = '') => {
  const { center_lon = 0, center_lat = 0, radius = 0 } = item;
  const validLat = center_lat > 90
  const validLon = center_lon > 180

  if (validLat || validLon) {
    invalidGeometry.value = true
    return
  }

  invalidGeometry.value = false
  
  const figure = mapStore.circleFigure;

  let centerLonFloat: any, centerLatFloat: any, radiusFloat: any;
  if (coordinateGeometryCircle.value === "Decimal") {
    centerLonFloat = center_lon;
    centerLatFloat = center_lat;
    radiusFloat = radius;

    figure.centerLongitude = center_lon;
    figure.centerLatidude = center_lat;
    figure.radius = radius;
  } else if (coordinateGeometryCircle.value === "Sexageximal") {
    
    const lonValue = center_lon !== "" ? center_lon : `0° 0' 0" E`;
    centerLonFloat = sexagesimalToDecimalCircle(
      formatearDMSWithDirection(lonValue)
    );
    figure.centerLongitude = centerLonFloat;

    const latValue = center_lat !== "" ? center_lat : `0° 0' 0" N`;
    centerLatFloat = sexagesimalToDecimalCircle(
      formatearDMSWithDirection(latValue)
    );
    figure.centerLatidude = centerLatFloat;
    radiusFloat = radius;

    figure.radius = radius;
  }

 

  if ( !!centerLonFloat && !!centerLatFloat && !!radiusFloat ) {
    let features = mapStore.vectorSource.getFeatureById("feature-circle-table");

    const center = olProj.transform(
      [centerLonFloat, centerLatFloat],
      "EPSG:4326",
      "EPSG:3857"
    );
    const rad = radiusFloat * 1000; // Convert radius to meters

    if (!features) {
      mapStore.handleSelectDrawOption("Circle");
      const circleGeometry = new CircleGeom(center, rad);

      const wktFormat = new WKT();
      const numSegments = 64;
      let polygonPoints = [];
      for (let i = 0; i < numSegments; i++) {
        const angle = ((2 * Math.PI) / numSegments) * i;
        const x = center[0] + rad * Math.cos(angle);
        const y = center[1] + rad * Math.sin(angle);
        polygonPoints.push([x, y]);
      }
      polygonPoints.push(polygonPoints[0]);
      const polygonGeometry = new PolygonGeom([polygonPoints]);
      let wktCircle = wktFormat.writeGeometry(polygonGeometry, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });

      const feature = new Feature(circleGeometry);
      feature.setId("feature-circle-table");
      mapStore.vectorSource.addFeature(feature);

      const modifyInteraction = new Modify({
        features: new Collection([feature]),
      });

      modifyInteraction.on("modifyend", (event) => {
        const geometry = event.features.item(0).getGeometry();
        if (geometry instanceof CircleGeom) {
          const centerModify = olProj.transform(
            geometry.getCenter(),
            "EPSG:3857",
            "EPSG:4326"
          );
          const center = olProj.transform(
            [centerModify[0], centerModify[1]],
            "EPSG:4326",
            "EPSG:3857"
          );
          const radiusModify = geometry.getRadius();

          let polygonPointsModify = [];
          for (let i = 0; i < numSegments; i++) {
            const angle = ((2 * Math.PI) / numSegments) * i;
            const x =
              geometry.getCenter()[0] + geometry.getRadius() * Math.cos(angle);
            const y =
              geometry.getCenter()[1] + geometry.getRadius() * Math.sin(angle);
            polygonPointsModify.push([x, y]);
          }
          polygonPointsModify.push(polygonPointsModify[0]);
          const polygonGeometryModify = new PolygonGeom([polygonPointsModify]);
          wktCircle = wktFormat.writeGeometry(polygonGeometryModify, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
          mapStore.circleFigureDraw(center, radiusModify, wktCircle);
        }
      });
      mapStore.map.addInteraction(modifyInteraction);
    } else {
      const circleGeometry = new CircleGeom(center, rad);
      features.setGeometry(circleGeometry);

      const wktFormat = new WKT();
      const numSegments = 64;
      let polygonPoints = [];
      for (let i = 0; i < numSegments; i++) {
        const angle = ((2 * Math.PI) / numSegments) * i;
        const x = center[0] + rad * Math.cos(angle);
        const y = center[1] + rad * Math.sin(angle);
        polygonPoints.push([x, y]);
      }
      polygonPoints.push(polygonPoints[0]);
      const polygonGeometry = new PolygonGeom([polygonPoints]);
      let wktCircle = wktFormat.writeGeometry(polygonGeometry, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });

      mapStore.circleFigureDraw(center, rad, wktCircle);
    }
  }

  return true;
};

const addCoordinates = (option: string) => {
  isEditFigure.value = false
  invalidGeometry.value = true
  if (option == "polygon") {
    selectedPolygonItem.value = {
      key: 0,
      id: 1,
      lon: '',
      lat: '',
    }

    //clearCircle();
    const coordinate = mapStore.polygonFigure.cordinates[0];

    if (mapStore.polygonFigure.cordinates.length == 0) {
      mapStore.polygonFigure.cordinates = [
        [
          ["", ""],
          ["", ""],
        ],
      ];
    } else {
      const count = mapStore.polygonFigure.cordinates[0].filter(
        (x: any) => x[0] == "" && x[1] == ""
      ).length;
      if (count > 1) return;
      coordinate.splice(coordinate.length - 1, 0, ['', '']);

    }
    
    if(!Array.isArray(mapStore.polygonFigure.wkt)) {
      const wktFigure = mapStore.polygonFigure.wkt;
      mapStore.polygonFigure.wktFigure = wktFigure;
    }

    mapStore.polygonFigure.wkt = formatDataCustom();
    
    updateHoveredRow(coordinate ? coordinate.length - 1 : 1);
  }

  if (option == "circle") {
    selectedCircleItem.value = {
      key: 0,
      id: 1,
      lon: '',
      lat: '',
    }

    clearPolygon();
    const figure = mapStore.circleFigure;
    if (!figure?.id) {
      figure.id = 1;
      figure.centerLongitude = "";
      figure.radius = "";
      figure.radius = "";
      mapStore.circleFigure.wkt = formatDataCircleCustom();
    }

    updateHoveredRow(1);
  }

  setTimeout(() => {
    const tableElement = document.querySelector('.vue3-easy-data-table__main');
    const lastRow = tableElement?.querySelector('table tbody tr:last-child');
    lastRow?.scrollIntoView({behavior: 'smooth'});
  }, 25);
};

const addPointToPolygon = (lon: any, lat: any, index: number) => {
  let coordinate = mapStore.polygonFigure.cordinates[0];
  if (coordinate.length >= 4) {
    let features = mapStore.vectorSource.getFeatures();
    if (features.length === 0) {
      let first = coordinate[0];
      let last = coordinate[coordinate.length - 1];

      last[0] = first[0];
      last[1] = first[1];

      const invalid = hasInvalidValues(coordinate);

      if (!invalid) {
        const wktFormat = new WKT();
        const wktPolygon = convertToWKT(coordinate);
        
        let feature = wktFormat.readFeature(wktPolygon, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        handleImportWkt(feature);
      }
    } else {
      if (
        lon != "" &&
        lon?.toString().length > 1 &&
        lat != "" &&
        lat?.toString().length > 1
      ) {
        updatePointDataCustom(index, Number(lon), Number(lat));
      }
    }
  }
};

const isEditFigure = ref<boolean>(false)
const hasInvalidValues = (coords: any) => {
  return coords.some((coord: any) => {
    const lon = coord[0];
    const lat = coord[1];
    return lon === "" || lat === "" || lon.length < 2 || lat.length < 2;
  });
};

const updatePointDataCustom = (
  id: string | number | number,
  lon: number,
  lat: number
) => {
  const dataFormat = formatDataCustom();
  const indexToUpdate = dataFormat.findIndex((point) => point.id === id);

  if (indexToUpdate !== -1) {
    let [x, y] = handleMercatorPolygon(lon, lat);
    mapStore.polygonFigure.cordinates[0][indexToUpdate] = [x, y];

    formatDataCustom()
    let features = mapStore.vectorSource.getFeatures();
    if (features.length === 0) {
      features = sourceWKTGeometry.getFeatures();
    }
    if (features.length > 0 && !(features[0].getGeometry() instanceof LineString)) {
     
      const primeraCaracteristica = features[0];
      const geometria = primeraCaracteristica.getGeometry();
      if (geometria instanceof Point) {
          const coordinates = mapStore.polygonFigure.cordinates[0];
          handleLine(coordinates);
          return;
        }
      if (geometria instanceof PolygonGeom) {
        const coordinates = geometria.getCoordinates()[0];
        coordinates[indexToUpdate] = [x, y];
        geometria.setCoordinates([coordinates]);
        const wktFormat = new WKT();
        let wkt = wktFormat.writeGeometry(geometria, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        mapStore.polygonFigure.wkt = wkt;
        mapStore.polygonFigure.wktFigure = wkt;
        //mapStore.polygonFigure.cordinates[0] = coordinates;
      }
      // else if (geometria instanceof LineString) {
      //     //const coordinates = geometria.getCoordinates();
      //     let coordinates = mapStore.polygonFigure.cordinates[0];
      //     let geometry = new PolygonGeom([coordinates]);
      //     let feature = new Feature(geometry);
      //     handleImportWkt(feature)
      //   }
    } else {
      let coordinates = mapStore.polygonFigure.cordinates[0];
         if (coordinates.length === 2) {
           handlePoint(coordinates);
         } else if (coordinates.length === 3) {
           handleLine(coordinates);
         } else 
         if (coordinates.length >= 4) { 
        let geometry = new PolygonGeom([coordinates]);
        let feature = new Feature(geometry);
        handleImportWkt(feature)
      }
    }
  }
};

const deletePointDataCustom = (id: string | number, type = 'polygon') => {
  const dataFormat = type === 'polygon' ? formatDataCustom() : formatDataCircleCustom();
  const indexToDelete = dataFormat.findIndex((point:any) => point.id === id);

  if (indexToDelete !== -1) {
    const updatedCoordinates = mapStore.polygonFigure.cordinates[0].filter(
      (_: any, index: number) => index !== indexToDelete
    );
    if (indexToDelete === 0) {
      updatedCoordinates.pop();
      const nextIndex = 0;
      updatedCoordinates.push(updatedCoordinates[nextIndex]);
    }
    mapStore.polygonFigure.cordinates[0] =
      updatedCoordinates.length > 0
        ? updatedCoordinates
        : mapStore.resetPolygonFigure();

    let features = mapStore.vectorSource.getFeatures();
    if (updatedCoordinates.length > 0 && features.length === 0) {
      features = sourceWKTGeometry.getFeatures();
    }
    if (features.length > 0) {
      const primeraCaracteristica = features[0];
      const geometria = primeraCaracteristica.getGeometry();
      if (geometria instanceof PolygonGeom) {
        const coordinates = geometria.getCoordinates()[0];
        const updatedCoordinates = coordinates.filter(
          (_: any, index: number) => index !== indexToDelete
        );
        if (indexToDelete === 0) {
          updatedCoordinates.pop();
          const nextIndex = 0;
          updatedCoordinates.push(updatedCoordinates[nextIndex]);
        }
        geometria.setCoordinates([updatedCoordinates]);
        const wktFormat = new WKT();
        let wkt = wktFormat.writeGeometry(geometria, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        wkt = wktFormat.writeGeometry(geometria, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        mapStore.polygonFigure.wkt = wkt;
        mapStore.polygonFigure.wktFigure = wkt;
      }
        let coordinates = mapStore.polygonFigure.cordinates[0];
         if (coordinates.length === 2) {
           handlePoint(coordinates);
         } else if (coordinates.length === 3) {
           handleLine(coordinates);
         }
    }else{
      if (updatedCoordinates.length > 0) { 
          let geometry = new PolygonGeom([updatedCoordinates]);
          let feature = new Feature(geometry);
          handleImportWkt(feature)
        }
    }
  }
};

const decimalToSexagesimalCircle = (decimal: number, isLongitude: boolean) => {
  const maxDegrees = isLongitude ? 180 : 90;
  const minDegrees = isLongitude ? -180 : -90;
  const adjustedDecimal = Math.min(Math.max(decimal, minDegrees), maxDegrees);
  const sexagesimalDegrees = Math.abs(adjustedDecimal);
  const minutesFloat =
    (sexagesimalDegrees - Math.floor(sexagesimalDegrees)) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  const direction = isLongitude
    ? adjustedDecimal >= 0
      ? "E"
      : "W"
    : adjustedDecimal >= 0
    ? "N"
    : "S";
  return `${Math.floor(
    sexagesimalDegrees
  )}° ${minutes}' ${seconds}" ${direction}`;
};

const radiusToSexagesimalCircle = (radius: number) => {
  const degrees = radius / 111.32;
  const adjustedDegrees = Math.min(Math.abs(degrees), 90);
  const sexagesimalDegrees = Math.floor(adjustedDegrees);
  const remainingMinutes = (adjustedDegrees - sexagesimalDegrees) * 60;
  const minutes = Math.floor(remainingMinutes);
  const seconds = Math.round((remainingMinutes - minutes) * 60);
  return `${sexagesimalDegrees}° ${minutes}' ${seconds}"`;
};

const formatDataCircleCustom = () => {
  const figure = mapStore.circleFigure;
  let option = coordinateGeometryCircle.value;
  const figureConvert: any = [];
  let element = {};
  if (figure.radius !== 0 || figure?.id) {
    const radius = figure.radius;
    

    const roundedRadius = radius == '' || radius == 0 || radius == undefined ? '' : parseFloat(radius).toFixed(5);
    if (option == "Sexageximal") {
      element = {
        id: 1,
        center_lon: decimalToSexagesimalCircle(figure.centerLongitude, true),
        center_lat: decimalToSexagesimalCircle(figure.centerLatidude, false),
        radius: roundedRadius,
      };
    } else {
      element = {
        id: 1,
        center_lon: figure.centerLongitude == 0 || figure.centerLongitude == '' ? '' : parseFloat(figure.centerLongitude).toFixed(5),
        center_lat: figure.centerLatidude == 0 || figure.centerLatidude == '' ? '' : parseFloat(figure.centerLatidude).toFixed(5),
        radius: roundedRadius,
      };
    }

    figureConvert.push(element);
    let exist = figureConvert.filter(
      (x: any) =>
        (x.id == 1 &&
          x.center_lon == "" &&
          (x.center_lat == "" || x.center_lat == 0) &&
          x.radius == "") ||
        (x.id == 1 &&
          x.center_lon == "0° 0' 0\" E" &&
          x.center_lat == "0° 0' 0\" N" &&
          x.radius == "0° 0' 0\"")
    );
    let clear = figureConvert.find(
      (x: any) =>
        x.id == 1 &&
        (x.center_lon == "0° 0' 0\" E" ||
          x.center_lat == "0° 0' 0\" N" ||
          x.radius == "0° 0' 0\"")
    );
    if (clear) {
      if (clear.center_lon == "0° 0' 0\" E") {
        clear.center_lon = "";
      }
      if (clear.center_lat == "0° 0' 0\" N") {
        clear.center_lat = "";
      }
      if (clear.radius == "0° 0' 0\"") {
        clear.radius = "";
      }
    }
    if (exist) {
      exist.forEach((ele: any) => {
        ele.center_lon = "";
        ele.center_lat = "";
        ele.radius = "";
      });
    }
  }

  selectedCircleItem.value = figureConvert[0];

  return figureConvert;
};

const showModal = () => {
  //clearCircle();
  if (mapStore.polygonFigure.cordinates.length > 0 || mapStore.circleFigure.radius !== 0) {
    showModalConfirm.value = true;
    return true
  } else {
    
    createPolygon();
    return false
  }
};
const showModalCircle = () => {
  //clearPolygon();
  if (mapStore.circleFigure.radius !== 0 || mapStore.polygonFigure.cordinates.length > 0) {
    showModalConfirm.value = true;
  } else {
    createCircle();
  }
};

const updateSelectWktPoligon = (event: any) => {
  selectOptionPolygon.value = event.detail.valueChanged;
};
const updateSelectWktPoligonDropdown = (event: any) => {
  selectOptionPolygon.value = event.detail;
};

const handleImportWkt = (input: any,valueWKTimport?:string) => {
  if (!input) {
    console.error('The geometry is not valid.');
    return;
  }
  let geometry: Geometry;
  let coordinates: any[] = [];
  let isValid = false;
  if (input instanceof Feature) {
    geometry = input.getGeometry();
  } else if (input instanceof Geometry) {
    geometry = input;
  } else {
    console.error('The input type is neither Geometry nor Feature.');
    return;
  }
  // Verify POLYGON on MULTIPOLYGON
  if (geometry instanceof PolygonGeom) {
    coordinates = geometry.getCoordinates();
    isValid = mapStore.isPolygonValid(coordinates);
  } else if (geometry instanceof MultiPolygonGeom) {
    coordinates = geometry.getCoordinates();
    isValid = coordinates.every((polygon: any) => mapStore.isPolygonValid(polygon));
  } else {
    popupAlertStore.showPopupAlert("Error", "Geometry is neither a POLYGON nor a MULTIPOLYGON.");
    return;
  }
  if (!isValid) {
    popupAlertStore.showPopupAlert("Error", "The polygon is invalid.");
    return;
  }
  const wktFormat = new WKT();
  const wkt = wktFormat.writeGeometry(geometry, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });
 
  const valueWKT = valueWKTimport?valueWKTimport:wkt
  mapStore.polygonFigureDraw(coordinates, valueWKT,geometry instanceof MultiPolygonGeom);
  if (input instanceof Feature) {
    vectorWktGeometry.getSource()?.clear()
    vectorWktGeometry.getSource()?.addFeature(input);
   
  } else {
    vectorWktGeometry.getSource()?.clear()
    vectorWktGeometry.getSource()?.addFeature(new Feature(geometry));
  }
  vectorWktGeometry.set('createRule', 'createRule');
  mapStore.map.addLayer(vectorWktGeometry);
  mapStore.polygonFigure.cordinates = coordinates;
  if(valueWKTimport === undefined){
    const modifyInteraction = new Modify({
    features: new Collection<Feature<Geometry>>([new Feature(geometry)]),
  });
    modifyInteraction.on("modifyend", function (event) {
      const feature = event.features.item(0);
      const geometry = feature.getGeometry() as PolygonGeom;
      const coordinatesCustom = geometry.getCoordinates();
      if (!mapStore.isPolygonValid(coordinatesCustom)) {
        popupAlertStore.showPopupAlert("Error", "Invalid polygon");
        return;
      }
        mapStore.polygonFigure.cordinates = coordinatesCustom;
        const wktFormat = new WKT();
        let wkt = wktFormat.writeGeometry(geometry, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        mapStore.polygonFigure.wkt = wkt
        mapStore.polygonFigure.wktFigure = wkt
      }); 
    mapStore.map.addInteraction(modifyInteraction);
    mapStore.map.removeInteraction(modifyInteraction);
  }
  
};

const handlePoint = (coordinate: any) => {
  const pointGeom = new Point(coordinate[0]);
  const feature = new Feature(pointGeom);
  vectorWktGeometry.getSource()?.clear()
  vectorWktGeometry.getSource()?.addFeature(feature);
  vectorWktGeometry.set('createRule', 'createRule');
  mapStore.map.addLayer(vectorWktGeometry);
  mapStore.polygonFigure.cordinates = [coordinate];

  const view = mapStore.map.getView();
  const mapSize = mapStore.map.getSize();
  const resolution = view.getResolution();
  const newCenter = [
    coordinate[0][0] - (mapSize[0] / 4) * resolution,
    coordinate[0][1]
  ];
  view.setCenter(newCenter);
};

const handleLine = (coordinates: any) => {
  const lineGeom = new LineString(coordinates);
  const feature = new Feature(lineGeom);
  vectorWktGeometry.getSource()?.clear()
  vectorWktGeometry.getSource()?.addFeature(feature);
  vectorWktGeometry.set('createRule', 'createRule');
  mapStore.map.addLayer(vectorWktGeometry);
  mapStore.polygonFigure.cordinates = [coordinates];
};
const handleImportWktCircle = (feature: any,valueWKTimport:string='') => {
  const geometryFeature = feature.getGeometry() as PolygonGeom;
  let coordinates = geometryFeature.getCoordinates();
  
  if (coordinates.length > 1) {
    console.log('Invalid circle geometry');
    return;
  }
  const center1 = getCenter(geometryFeature.getExtent());
  const radius1 = getWidth(geometryFeature.getExtent())/2;

  const circleGeom = new Circle(center1, radius1);

  const polygonGeom = fromCircle(circleGeom);
  try {
    const valid = mapStore.isPolygonValid(polygonGeom.getCoordinates());
    if (!valid) {
      alert('The polygon is not valid.');
      return;
    }
  } catch {
    alert('The polygon is not valid.');
    return;
  }
  mapStore.circleFigureDraw(center1,radius1,valueWKTimport)
  let item 
  if(coordinateGeometryCircle.value === "Decimal"){
    const coordinatesEPSG3857 = center1;
    const coordinatesEPSG4326 = transform(coordinatesEPSG3857, 'EPSG:3857', 'EPSG:4326');
      item = {
        center_lon:coordinatesEPSG4326[0],
        center_lat:coordinatesEPSG4326[1],
        radius:radius1 / 1000,
      }
  }else if(coordinateGeometryCircle.value === "Sexageximal"){
    const coordinatesEPSG3857 = center1;
    const coordinatesEPSG4326 = transform(coordinatesEPSG3857, 'EPSG:3857', 'EPSG:4326');
    item = {
        center_lon:decimalToSexagesimalCircle(coordinatesEPSG4326[0], true),
        center_lat:decimalToSexagesimalCircle(coordinatesEPSG4326[1], false),
        radius:radius1 / 1000,
      }
  }
  updateCircleCoordinates(item)
  const circleFeature = new Feature({
    geometry: circleGeom
  });
  vectorWktGeometryCircle.getSource()?.addFeature(circleFeature);
  vectorWktGeometryCircle.set('createRule', 'createRule');
};

const applyWktFormated = async () => {
  const wktPattern =
    /^\s*POLYGON\s*\(\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*(,\s*-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s*)*\)\)$/;
  if (!wktPattern.test(valueWKTGeometry.value)) {
    handleShowModalWktGeometry();
    await popupAlertStore.showPopupAlert(
      "Warning",
      " Wrong coordinates format.\nPlease use the format POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10)) to continue."
    );
    handleShowModalWktGeometry();
    return;
  }

  try {
    handleShowModalWktGeometry();
    vectorWktGeometry.getSource()?.clear();
    if (valueWKTGeometry.value.length > 0) {
      const wktFormat = new WKT();
      let feature = wktFormat.readFeature(valueWKTGeometry.value, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
      handleImportWkt(feature);
      valueWKTGeometry.value = "";
    }
  } catch (error) {
    showModalWktGeometry.value = false;
    await popupAlertStore.showPopupAlert(
      "Error",
      "Invalid polygon must have 4 or more positions"
    );
    handleShowModalWktGeometry();
  }
};
const applyWktFormatedCircle = async () => {
  const wktPattern =
    /^\s*POLYGON\s*\(\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*(,\s*-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s*)*\)\)$/;
  if (!wktPattern.test(valueWKTGeometryCircle.value)) {
    handleShowModalWktGeometryCircle();
    await popupAlertStore.showPopupAlert(
      "Warning",
      " Wrong coordinates format.\nPlease use the format POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10)) to continue."
    );
    handleShowModalWktGeometryCircle();
    return;
  }

  try {
  
    handleShowModalWktGeometryCircle();
    vectorWktGeometryCircle.getSource()?.clear();
    if (valueWKTGeometryCircle.value.length > 0) {
      const wktFormat = new WKT();
      let feature = wktFormat.readFeature(valueWKTGeometryCircle.value, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
      handleImportWktCircle(feature,valueWKTGeometryCircle.value);
      valueWKTGeometryCircle.value = "";
    }
  } catch (error) {
    showModalWktGeometryCircle.value = false;
    await popupAlertStore.showPopupAlert(
      "Error",
      "Invalid polygon must have 4 or more positions"
    );
    handleShowModalWktGeometryCircle();
  }
};

const convertPolygonStringToCoordinates = (
  polygonString: string
): number[][][] => {
  const coordsString = polygonString
    .replace("POLYGON ((", "")
    .replace("))", "");

  const pairs = coordsString.split(", ");

  const coordinates = pairs.map((pair) => {
    const [lon, lat] = pair.split(" ").map(parseFloat);

    return [lon, lat];
  });

  coordinates.push(coordinates[0]);

  return [coordinates];
};
const widthMaximise = ref("75%");
const maximiseForm = () => {
  widthMaximise.value = widthMaximise.value === "75%" ? "100%" : "75%";
};
const closeMaximiseForm = () => {
  widthMaximise.value = "75%";
};
const handleModalClose = (e: boolean) => {
  if (e) {
    closeFormNewRule();
    closeMaximiseForm();
    ruleStore.formData = {};
    showModalClose.value = false;
  } else {
    showModalClose.value = false;
  }
};
const handleHeightTable = () => {
  
  if (widthMaximise.value === "75%") {
    return screenStore.dimanicScreenHeight(630);
  }
  return screenStore.dimanicScreenHeight(510);
  
};
const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
const handleSelectCountry = async () => {
  disableSend();
};
const disableSend = () => {
  if (menuGeometry.value === "country") {
    return !selectedDataStagna.value?.value;
  }
  if (menuGeometry.value === "shape") {
    if (mapStore.selectDrawOption === "Circle") {
      return mapStore.circleFigure.radius === 0;
    } 
    const coordinates = mapStore.polygonFigure?.cordinates?.[0];
    if(mapStore.polygonFigure?.isMultiPolygon){
      if(mapStore.polygonFigure?.wkt !==''){
        return false
      }
    }
    return !(coordinates && coordinates.length > 3);
  }
  return true
};
mapStore.map.getViewport().addEventListener("contextmenu", function (e: any) {
  const pixel = mapStore.map.getEventPixel(e);
  const coordinate = mapStore.map.getCoordinateFromPixel(pixel);
  const result: InearsetPoint = removePointNearCoordinate(coordinate);
  const valueDisabled = formatDataCustom().length <= 3;
  if (result.found && !valueDisabled) {
    e.preventDefault();
    mapStore.positionModalContext = { x: e.layerX, y: e.layerY };
    mapStore.showMenuContextual = true;
    resultAction.value = result;
  } else {
    mapStore.showMenuContextual = false;
  }
});
const removePointConfirm = () => {
  const valueDisabled = formatDataCustom().length <= 3;
  if (
    resultAction.value &&
    resultAction.value.pointIndex !== null &&
    !valueDisabled
  ) {
    deletePointDataCustom(resultAction.value.pointIndex + 1);
  }
  mapStore.showMenuContextual = false;
  resultAction.value = undefined;
};

function removePointNearCoordinate(clickCoordinate: any) {
  const tolerance = 50000;
  const polygonCoordinates = mapStore.polygonFigure.cordinates;
  let nearestPoint = null;
  let nearestDistance = Infinity;
  let nearestPointRingIndex: number | null = null;
  let nearestPointIndex: number | null = null;

  for (let ringIndex = 0; ringIndex < polygonCoordinates.length; ringIndex++) {
    const ring = polygonCoordinates[ringIndex];
    for (let pointIndex = 0; pointIndex < ring.length; pointIndex++) {
      const point = ring[pointIndex];
      const distance = Math.sqrt(
        Math.pow(point[0] - clickCoordinate[0], 2) +
          Math.pow(point[1] - clickCoordinate[1], 2)
      );
      if (distance < nearestDistance && distance <= tolerance) {
        nearestDistance = distance;
        nearestPoint = point;
        nearestPointRingIndex = ringIndex;
        nearestPointIndex = pointIndex;
      }
    }
  }
  if (nearestPoint) {
    return {
      found: true,
      ringIndex: nearestPointRingIndex,
      pointIndex: nearestPointIndex,
    };
  } else {
    return { found: false, ringIndex: null, pointIndex: null };
  }
}
function handleKeyDown(event: any) {
  if (event?.key === "Delete") {
    if (removewithDeleteKey.value === undefined) return;
    const coordinate = mapStore.map.getCoordinateFromPixel(
      removewithDeleteKey.value
    );
    const result: InearsetPoint = removePointNearCoordinate(coordinate);
    const valueDisabled = formatDataCustom().length <= 3;
    if (result && result.pointIndex !== null && !valueDisabled) {
      deletePointDataCustom(result.pointIndex + 1);
      removewithDeleteKey.value = undefined;
    }
  }
}
function onPointerMove(event: any) {
  const pixel = mapStore.map.getEventPixel(event.originalEvent);
  removewithDeleteKey.value = pixel;
}

const wktToCoordinates = (wkt: string) => {
  const wktFormat = new WKT();
  const feature = wktFormat.readFeature(wkt, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });

  const geometryFeature = feature.getGeometry() as PolygonGeom;
  const coordinates = geometryFeature.getCoordinates();

  return coordinates;
};

const handleSelectionChanged = () => {
  if (rulesStore.initialData && rulesStore.isEditRule == true) {
    if (rulesStore.initialData.users) {
      let usersIds = rulesStore.initialData.users.map(
        (user: any) => user.user_id
      );
      let users = userStore.userData.filter((user) =>
        usersIds.includes(user.user_id)
      );

      users.forEach((user) => {
        const isUserAlreadySelected = userStore.itemsSelectedFormRules.some(
          (selectedUser) => selectedUser.user_id === user.user_id
        );
        if (!isUserAlreadySelected) {
          userStore.itemsSelectedFormRules.push(user);
        }
      });
    }
  }
};

onMounted(async () => {
  resetFiltersInTable();
  await groupsStore.dataGroups();
  //await userStore.dataUser();
  window.addEventListener("keydown", handleKeyDown);
  mapStore.map.on("pointermove", onPointerMove);
  if (rulesStore.initialData) {
    rulesStore.initialData.groups.map((group: any) => {
      group.selected = true
      selectedGroup.value.push(group.group_id);
    });
    const selectedUserIds = rulesStore.initialData.users.map(
      (user: any) => user.user_id
    );
    userStore.itemsSelectedFormRules = userStore.userData.filter((user) =>
      selectedUserIds.includes(user.user_id)
    );
    if(rulesStore.initialData.geometry.geometry_type === "circle"){
        menuGeometry.value = 'shape'
        menuShape.value = 'Circle'
        mapStore.selectDrawOption = 'Circle'
        mapStore.circleFigure.centerLatidude = rulesStore.initialData.geometry.center.latitude
        mapStore.circleFigure.centerLongitude = rulesStore.initialData.geometry.center.longitude
        mapStore.circleFigure.radius = rulesStore.initialData.geometry.radius_km
        mapStore.circleFigure.wkt = rulesStore.initialData.geometry.area_wkt

    }else{
      let coord = wktToCoordinates(rulesStore.initialData.geometry.area_wkt);
      mapStore.polygonFigure.cordinates = coord;
      mapStore.polygonFigure.wkt = rulesStore.initialData.geometry.area_wkt;
      mapStore.polygonFigure.wktFigure = rulesStore.initialData.geometry.area_wkt;
    }
    

    if(rulesStore.initialData.country !== null){
      menuGeometry.value = 'country'
      const data :any = mappedDataStanagCountrys.value
      let valueInitial 
      if (Array.isArray(data)) {
          valueInitial = data.find((item: any) => item.value === rulesStore.initialData.country);
        }
      if(valueInitial) {
        selectedDataStagna.value = valueInitial
      }
      
    }
  }
});

const groupFilterName = () => {
  if (!selectedGroup.value || !groupsStore.groupsData?.response) {
    return "";
  }
  const groupFilter = groupsStore.groupsData.response.filter((x) =>
    selectedGroup.value.includes(x.group_id)
  );
  if (groupFilter.length > 0) {
    return getValuesAndIds(groupFilter, "group_name");
  }
};
const typeGeometryName = () => {
  if (menuGeometry.value === "country") {
    return "Country";
  } else {
    return menuShape.value;
  }
};

const updateInvalidLatValue = (value: boolean) => {
  isLatInvalid.value = value
}

const updateInvalidLonValue = (value: boolean) => {
  isLonInvalid.value = value
}

const updateSexagesimalCircleValue = (value: string, field: string) => {
  value = String(value).replace('′', "'").replace('′′', '"')
  if(field === 'lat') {
    selectedCircleItem.value.center_lat = value;
  }
  if(field === 'lon') {
    selectedCircleItem.value.center_lon = value;
  }
}

const updateSexagesimalPolygonValue = (value: string, field: 'lat'|'lon') => {
  if(field === 'lat') {
    selectedPolygonItem.value.lat = value;
  }
  if(field === 'lon') {
    selectedPolygonItem.value.lon = value;
  }
}

const updateHoveredRow = (id:number) => {
  //ruleStore.isEditRule = true
  hoveredRowIndex.value = id;
};

const clearHoveredRow = () => {
  //ruleStore.isEditRule = false;
  hoveredRowIndex.value = null;
};


//! Manage edit
const handleShowEdit = (item:any, type: 'circle'|'polygon' = 'circle') => {
  updateHoveredRow(item.id);
  isEditFigure.value = true
  if(type === 'circle') {
    selectedCircleItem.value = item;
  }else {
    selectedPolygonItem.value = item;
  }
}
const handleSaveCircle = () => {
  if(!selectedCircleItem.value.center_lat || !selectedCircleItem.value.center_lon) {
      invalidGeometry.value = true
      return
  }

  
  const result = updateCircleCoordinates(selectedCircleItem.value);
  if(result) clearHoveredRow()
}
const handleCancelChanges = () => {
  clearHoveredRow()
}
const handleSavePolygon = () => {
  const { id, lat, lon } = selectedPolygonItem.value;

  if(coordinateGeometry.value === 'Decimal') {
    if(!lat || !lon) {
      invalidGeometry.value = true
      return
    }

    mapStore.polygonFigure.cordinates[0][hoveredRowIndex.value!-1] = [lon, lat]
    formatDataCustom();
    const result = updateCoordinates(hoveredRowIndex.value!, lat, lon);
    if(result) clearHoveredRow()
  }else {
    const lonDecimal = sexagesimalToDecimal(lon)
    const latDecimal = sexagesimalToDecimal(lat)
    let [x, y] = handleMercatorPolygon(lonDecimal, latDecimal);
    mapStore.polygonFigure.cordinates[0][hoveredRowIndex.value!-1] = [x, y]
  
    const lonSexagesimal = decimalToSexagesimal([x, y]);
    const [part1, part2] = splitCoordinates(lonSexagesimal);

    
    if(part1.toLowerCase().includes('nan') || part2.toLowerCase().includes('nan')) {
      invalidGeometry.value = true
      return
    }

    formatDataCustom();
    const result = updateCoordinates(hoveredRowIndex.value!, part1, part2);
    
    if(result) clearHoveredRow()
  }

}

const handleImportShp = async() => {
  dataImportShp.value = {}
  dataNameImportShp.value = ''
  await importFromFileShp()
}

watch(() => selectedPolygonItem.value, (newValue:any) => {
  if(newValue) {
    
    if(newValue.lat == '' || newValue.lon == '') {
      invalidGeometry.value = true
      return
    }

    if(newValue.lat == '.00000' || newValue.lon == '.00000') {
      if(newValue.lat == '.00000') invalidInputLat.value[newValue.id] = true
      if(newValue.lon == '.00000') invalidInputLon.value[newValue.id] = true
      invalidGeometry.value = true
      return
    }

    const isValidLat = Number(newValue.lat) > 90 || Number(newValue.lat) < 0
    invalidInputLat.value[newValue.id] = isValidLat
    
    const isValidLon = Number(newValue.lon) > 180 || Number(newValue.lon) < 0
    invalidInputLon.value[newValue.id] = isValidLon

    invalidGeometry.value = isValidLat || isValidLon
  }
}, {
  deep: true
})

watch(() => selectedCircleItem.value, (newValue:any) => {
  if(newValue) {
    
    invalidInputRad.value[newValue.id] = false

    if(newValue.center_lat == '' || newValue.center_lon == '' || newValue.radius == '') {
      invalidGeometry.value = true
      return
    }

    if(newValue.center_lat == '.00000' || newValue.center_lon == '.00000' || newValue.radius == '.00000') {
      if(newValue.center_lat == '.00000') invalidInputLat.value[newValue.id] = true
      if(newValue.center_lon == '.00000') invalidInputLon.value[newValue.id] = true
      if(newValue.radius == '.00000') invalidInputRad.value[newValue.id] = true
      invalidGeometry.value = true
      return
    }

    const isValidLat = Number(newValue.center_lat) > 90 || Number(newValue.center_lat) < 0
    invalidInputLat.value[newValue.id] = isValidLat
    
    const isValidLon = Number(newValue.center_lon) > 180 || Number(newValue.center_lon) < 0
    invalidInputLon.value[newValue.id] = isValidLon

    invalidGeometry.value = isValidLat || isValidLon
  }
}, {
  deep: true
})

watch(() => dataImportShp.value, (newValue:any) => {
  if (newValue && newValue.geometry) {
    clearPolygon()
    clearCircle()
    try {
      const wktFormat = new WKT();
        const geometry  = wktFormat.readGeometry(newValue.geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
       // Verificar si es un POLYGON o MULTIPOLYGON
        if (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon') {
          
        } else {
          throw new Error('Geometry is neither a POLYGON nor a MULTIPOLYGON.');
        }
        handleImportWkt(geometry,newValue.geometry)
        isImportedGeometry.value = true
        if(geometry.getType() === 'MultiPolygon'){
          isMultipolygon.value = true
        }
    } catch (error) {
      popupAlertStore.showPopupAlert(
          "Warning",
          " Wrong coordinates format.\nPlease use the format POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10)) to continue."
        );
    }
    }else{
      const wktFormat = new WKT();
      let feature = wktFormat.readFeature(newValue.geometry, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
      handleImportWkt(feature)
    }
  }
);
const submitOptionCreateRule = (data:any) => {
  formDataSubmit(data)
  vectorWktGeometry.getSource()?.clear()
}
onUnmounted(() => {
    rulesStore.removeMinimizeItem('rules_create');
})
const handleFilter = (value:any, type: string) => {
  if(type === 'user_id' && value !== 'reset') {
    user_idCriteria.value = value;
    userStore.selectedFilters['user_id'] = value;
  }
  if(type === 'user_id' && value == 'reset') {
    user_idCriteria.value = '';
    user_idCriteria_temp.value = ''
    value = ''
    userStore.selectedFilters['user_id'] = value;
  }

  if(type === 'status' && value !== 'reset') {
    status_criteria.value = value;
    userStore.selectedFilters['status'] = value;
  }
  if(type === 'status' && value == 'reset') {
    status_criteria.value = '';
    value = ''
    userStore.selectedFilters['status'] = value;
  }

  if(type === 'creation_date_criteria' && value !== 'reset'){
    if(insertion_date_start_Criteria_temp.value != ''){
      insertion_date_start_Criteria.value = insertion_date_start_Criteria_temp.value ? insertion_date_start_Criteria_temp.value : '' ;
      value =  insertion_date_start_Criteria_temp.value ? insertion_date_start_Criteria_temp.value : '' 
      userStore.selectedFilters['creation_date_start'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['creation_date_start'] = '';
    }
    if(insertion_date_end_Criteria_temp.value != ''){
      insertion_date_end_Criteria.value = insertion_date_end_Criteria_temp.value ? insertion_date_end_Criteria_temp.value : '' ;
      value =  insertion_date_end_Criteria_temp.value ? insertion_date_end_Criteria_temp.value : '' 
      userStore.selectedFilters['creation_date_end'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['creation_date_end'] = '';
    }
  }
  if(type === 'creation_date_criteria' && value == 'reset'){
    insertion_date_start_Criteria.value = ''
    insertion_date_start_Criteria_temp.value = ''
    insertion_date_end_Criteria.value = ''
    insertion_date_end_Criteria_temp.value = ''

    userStore.selectedFilters['creation_date_start'] = '';
    userStore.selectedFilters['creation_date_end'] = '';
  }

  if(type === 'creation_date_end' && value == 'reset') {
    userStore.selectedFilters['creation_date_end'] = '';
    insertion_date_end_Criteria.value = ''
    insertion_date_end_Criteria_temp.value = ''
  }

  if(type === 'creation_date_start' && value == 'reset') {
    userStore.selectedFilters['creation_date_start'] = '';
    insertion_date_start_Criteria.value = ''
    insertion_date_start_Criteria_temp.value = ''
  }

  if(type === 'country' && value !== 'reset') {
    value = selectedStanagIdsTemp.value
    userStore.selectedFilters['country'] = value;
  }
  if(type === 'country' && value === 'reset') {
    selectedStanagIdsTemp.value = []
    value = []
    userStore.selectedFilters['country'] = '';
    resetFilters();
  }

  if(type === 'udsGroup' && value !== 'reset') {
    value = selectedUdsGroupIdsTemp.value
    userStore.selectedFilters['udsGroup'] = value;
  }
  if(type === 'udsGroup' && value === 'reset') {
    selectedUdsGroupIdsTemp.value = []
    value = []
    userStore.selectedFilters['udsGroup'] = '';
    resetUdsGroupFilters();
  }

  if(type === 'shcGroup' && value !== 'reset') {
    value = selectedShcGroupIdsTemp.value
    userStore.selectedFilters['shcGroup'] = value;
  }
  if(type === 'shcGroup' && value === 'reset') {
    selectedShcGroupIdsTemp.value = []
    value = []
    userStore.selectedFilters['shcGroup'] = '';
    resetShcGroupFilters();
  }

  if(type === 'missionGroup' && value !== 'reset') {
    value = selectedMissionGroupIdsTemp.value
    userStore.selectedFilters['missionGroup'] = value;
  }
  if(type === 'missionGroup' && value === 'reset') {
    selectedMissionGroupIdsTemp.value = []
    value = []
    userStore.selectedFilters['missionGroup'] = '';
    resetMissionGroupFilters();
  }

  if(type === 'license_expiration_date' && value !== 'reset'){
    if(license_expiration_date_start_Criteria_temp.value != ''){
      license_expiration_date_start_Criteria.value = license_expiration_date_start_Criteria_temp.value ? license_expiration_date_start_Criteria_temp.value : '' ;
      value =  license_expiration_date_start_Criteria_temp.value ? license_expiration_date_start_Criteria_temp.value : '' 
      userStore.selectedFilters['license_expiration_date_start'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['license_expiration_date_start'] = '';
    }
    if(license_expiration_date_end_Criteria_temp.value != ''){
      license_expiration_date_end_Criteria.value = license_expiration_date_end_Criteria_temp.value ? license_expiration_date_end_Criteria_temp.value : '' ;
      value =  license_expiration_date_end_Criteria_temp.value ? license_expiration_date_end_Criteria_temp.value : '' 
      userStore.selectedFilters['license_expiration_date_end'] = convertFormatFilterShcDate(value.toString());
    }else {
      userStore.selectedFilters['license_expiration_date_end'] = '';
    }
  }
  if(type === 'license_expiration_date' && value == 'reset'){
    license_expiration_date_start_Criteria.value = ''
    license_expiration_date_start_Criteria_temp.value = ''
    license_expiration_date_end_Criteria.value = ''
    license_expiration_date_end_Criteria_temp.value = ''

    userStore.selectedFilters['license_expiration_date_start'] = '';
    userStore.selectedFilters['license_expiration_date_end'] = '';
  }

  if(type === 'license_expiration_date_end' && value == 'reset') {
    userStore.selectedFilters['license_expiration_date_end'] = '';
    license_expiration_date_end_Criteria.value = ''
    license_expiration_date_end_Criteria_temp.value = ''
  }

  if(type === 'license_expiration_date_start' && value == 'reset') {
    userStore.selectedFilters['license_expiration_date_start'] = '';
    license_expiration_date_start_Criteria.value = ''
    license_expiration_date_start_Criteria_temp.value = ''
  }

  if(type === 'user_rules' && value !== 'reset') {
    user_rules_Criteria.value = value;
    userStore.selectedFilters['user_rules'] = value;
  }
  if(type === 'user_rules' && value == 'reset') {
    user_rules_Criteria.value = '';
    user_rules_Criteria_temp.value = ''
    value = ''
    userStore.selectedFilters['user_rules'] = value;
  }

}
const viewLabelFilter = (option: any,isButton: boolean = false) => {
  const optionKeys = [
        'group_uds',
        'group_shc',
        'udsGroup',
        'shcGroup',
        'user'
    ];

    if (option[0] && !optionKeys.includes(option[0])) {
        let result: any = convertFormatDateAndValidDate(option[1]?.toString())
        result = result?.replace(/,/g, ' , ');

        for (const [key, value] of Object.entries(filterOptionsList)) {
            if (key === option[0]) {
                if (option[0] == 'mission_id' || option[0] == 'acquisition_mode_id') {
                    result = isButton ? `${value}: ${result}` : `<span class='filter-title'>${value}:</span> ${result}`;
                } else {
                    result = isButton ? `${value}: ${option[1] === "prohibitive" ? "blocking" : option[1]}` : `<span class='filter-title'>${value}:</span> ${option[1] === "prohibitive" ? "blocking" : option[1]}`;
                }
                break;
            }
        }
        return result;
    }
    const optionLabel = getDataSelect(option[0])
    if (optionLabel) {
        let labels: any = [];
        option[1].forEach((element: any) => {
            const viewLabel = optionLabel.find(x => x.value == element)
            labels.push(viewLabel?.label)
        });
        const viewLabel = labels.join(' , ')
        let value = handleLabelMultiselectFilter(option[0], isButton) + viewLabel
        return value
    }
    return ''
}

const hasFormDataFilterValues = computed(() => {
    return Object.values(userStore.selectedFilters).some(value => value !== '' && value.length > 0);
});
const resetFiltersInTable = () => {
  for (const [key, value] of Object.entries(userStore.selectedFilters)) {
    handleFilter('reset', key);
  }

  userStore.resetFilters();
}

//! fix selected items
watch(() => userStore.itemsSelectedFormRules, (newValue, lastValue) => {
  if(newValue.length === 0) return
  if (Array.isArray(lastValue) && Array.isArray(newValue)) {
      lastValue.forEach(lastItem => {
        const existsInNew = newValue.some(newItem => newItem.user_id === lastItem.user_id);

        if (!existsInNew) {
          userStore.itemsSelectedFormRules = [
            lastItem,
            ...userStore.itemsSelectedFormRules,
          ]
        }
      });

      if(newValue.length < lastValue.length) {
        const itemsToRemove = userStore.itemsSelectedFormRules.filter(selectedItem => 
          !newValue.some(newItem => newItem.user_id === selectedItem.user_id) ||
          !lastValue.some(lastItem => lastItem.user_id === selectedItem.user_id)
        );
  
        if(itemsToRemove.length !== userStore.itemsSelectedFormRules.length) {
          if(itemsToRemove.length < userStore.userData.length) {
            userStore.itemsSelectedFormRules = userStore.itemsSelectedFormRules.filter(selectedItem =>  selectedItem.user_id !== itemsToRemove[0].user_id);
          }
        }
      }

    }
},{ deep: true });
</script>
<template>
  <Teleport to=".map">
    <MenuContextual
      :show="mapStore.showMenuContextual"
      :context-menu-position="mapStore.positionModalContext"
      @close="mapStore.showMenuContextual = false"
      @remove-point="removePointConfirm()"
    />
  </Teleport>
  <qtm-modal :open="showModalWktGeometry" classes="content-modal-wkt">
    <qtm-modal-header closeIcon @closed-button="handleShowModalWktGeometry">
      <qtm-modal-title>
        <div>
          <qtm-typography :font-size="6">WKT Polygon</qtm-typography>
          <!-- <qtm-modal-subtitle>Caption placeholder</qtm-modal-subtitle> -->
        </div>
      </qtm-modal-title>
    </qtm-modal-header>
    <qtm-modal-divider></qtm-modal-divider>
    <qtm-modal-body>
      <qtm-form-field>
        <qtm-form-label
          for="textarea_wkt_polygon"
          size="small"
          :required="true"
        >
          <span>Write or copy coordinates</span>
        </qtm-form-label>
        <qtm-textarea
          classes="text-scale-7"
          @value-changed="(e) => (valueWKTGeometry = e.detail)"
          :value="valueWKTGeometry"
          placeholder="POLYGON ((LON1 LAT1, LON2 LAT2, LON3 LAT3, LON1 LAT1))"
          size="large"
          input-id="textarea_wkt_polygon"
          :props="{ rows: '6' }"
        ></qtm-textarea>
        <!-- <qtm-form-caption size="small">This is a help text</qtm-form-caption> -->
      </qtm-form-field>
    </qtm-modal-body>

    <qtm-modal-footer style="display: flex; justify-content: end">
      <qtm-button
        variant="filled"
        color="primary"
        classes="w-full justify-center"
        @click-event="() => applyWktFormated()"
        >Save</qtm-button
      >
    </qtm-modal-footer>
  </qtm-modal>
  <qtm-modal :open="showModalWktGeometryCircle" classes="content-modal-wkt">
    <qtm-modal-header closeIcon @closed-button="handleShowModalWktGeometryCircle">
      <qtm-modal-title>
        <div>
          <qtm-typography :font-size="6">WKT polygon</qtm-typography>
          <!-- <qtm-modal-subtitle>Caption placeholder</qtm-modal-subtitle> -->
        </div>
      </qtm-modal-title>
    </qtm-modal-header>
    <qtm-modal-divider></qtm-modal-divider>
    <qtm-modal-body>
      <qtm-form-field>
        <qtm-form-label
          for="textarea_wkt_polygon_circle"
          size="small"
          :required="true"
        >
          <span>Write or copy coordinates</span>
        </qtm-form-label>
        <qtm-textarea
          classes="text-scale-7"
          @value-changed="(e) => (valueWKTGeometryCircle = e.detail)"
          :value="valueWKTGeometryCircle"
          placeholder="POLYGON ((LON1 LAT1, LON2 LAT2, LON3 LAT3, LON1 LAT1))"
          size="large"
          input-id="textarea_wkt_polygon_circle"
          :props="{ rows: '6' }"
        ></qtm-textarea>
        <!-- <qtm-form-caption size="small">This is a help text</qtm-form-caption> -->
      </qtm-form-field>
    </qtm-modal-body>

    <qtm-modal-footer style="display: flex; justify-content: end">
      <qtm-button
        variant="filled"
        color="primary"
        classes="w-full justify-center"
        @click-event="() => applyWktFormatedCircle()"
        >Save</qtm-button
      >
    </qtm-modal-footer>
  </qtm-modal>
  <ModalConfirm
    :is-modal-open="showModalConfirm"
    title="Warning"
    message="Are you sure you want to delete the figure and recreate it?"
    @open-option="showModalConfirm = false"
    @click-event="handleEventConfirm"
    text-confirm="Ok"
  />
  <ModalConfirm
    :is-modal-open="showModalClose"
    title="Warning"
    message="If you close the window, the rule details you've entered will be lost."
    @open-option="showModalClose = false"
    @click-event="handleModalClose"
    text-confirm="Ok"
  />

  <MultiStepForm
    :index-position="props.indexPosition"
    v-if="props.show"
    :Title="ruleStore.isEditRule ? 'Edit Rule' : 'New Rule'"
    :ObjectStepper="formConfigRules"
    :left-body-step="'-8.9px'"
    :content-width="widthMaximise"
    :initial-form-data="rulesStore.initialData ? rulesStore.initialData : null"
    @submit-action="submitOptionCreateRule"
    @submit-edit-action="submitOptionCreateRule"
    :name-prop="ruleStore.isEditRule ? 'Edit Rule' : 'New Rule'"
    @close-form="modalConfirmClose"
    @maximise-form="maximiseForm"
    @number-step="handleCurrentStepNumber"
    :disable-send="disableSend()"
  >
    <template #buttonsHeader>
      <div style="display: flex; gap: 5px;">
        <div v-if="currentStepNumber === 0 && !ruleStore.isEditRule" style="margin-left: 10px;">
          <!-- <qtm-button variant="outline" color="neutral" left-icon="search">
            Fill with search settings
          </qtm-button> -->
          <qtm-button
            variant="outline"
            color="neutral"
            left-icon="upload"
            @click-event="importFromFile"
          >
            Import from file
          </qtm-button>
        </div>
        <div v-else-if="!ruleStore.isEditRule" style="width: 0; height: 40px; overflow: hidden"></div> 
      </div>
      <div v-if="hasNonEmptyValues" @click="resetForm" style="cursor: pointer">
        <QtmTypography classes="text-primary-50 font-bold"
          >Clear All</QtmTypography
        >
      </div>
    </template>
    <template #step2="stepContent">
      <div class="container-ste3-custom">
        <QtmTypography classes="font-title-custom-2"
          >Select the groups you want to apply your rule to.</QtmTypography
        >
        <div style="margin-top: 10px; margin-bottom: 15px; display: flex; gap: 20px">
          <QtmButton
            color="inverted"
            variant="filled"
            size="small"
            :label="`${selectedGroup.length} selected groups`"
            classes="text-scale-7 rounded-full bg-bluegrey-600"
          ></QtmButton>
          <QtmTypography classes="text-primary-50 cursor-pointer" v-if="isUnSelectGroups" @click.stop="unSelectGroups"  style="padding-top: 5px"
            >Clear All</QtmTypography
          >
        </div>
        <SearchPicker
          extraClass="ml-5"
          placeholder="Search group name"
          :value="filterForName"
          icon-left="search"
          input-search-id="searchGroupsInAddRules"
          @update="(event) => (filterForName = event)"
          size="medium"
          :show-loader="filterForName.length > 0 && loaderStore.loadSearch"
        />
      </div>
      <div class="card-container-custom" style="margin-left: -6px">
        <div
          v-for="item in groupsStore.groupsData?.response"
          :key="item.group_id"
          :class="{ 'card-custom': true, selected: isSelected(item.group_id) }"
          :style="{ padding: 0 }"
          @click="toggleSelectGroup(item)"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0px 10px;
            "
            :style="{ 'background-color': item.color_code }"
            @click.stop
          >
            <div style="display: flex; align-items: center; gap: 5px">
              <qtm-typography classes="mt-s mb-s card-title">{{convertTextTruncate(25,item.group_name)}}</qtm-typography>
            </div>
          </div>

          <QtmDivider />

          <div class="card-content">
            <div style="padding: 10px">
              <div
                :style="{
                  display: 'flex',
                  gap: '10px',
                }"
              >
                <QtmIcon
                  icon="calendar_month"
                  variant="outlined"
                  size="medium"
                />
                <qtm-typography component="body-1"
                  >Creation date:</qtm-typography
                >
                <qtm-typography classes="font-bold" component="body-1">{{
                  convertFormatDateSimple(item.creation_date)
                }}</qtm-typography>
              </div>
              <div style="display: flex; gap: 10px; margin-top: 15px">
                <QtmIcon icon="person" variant="outlined" size="medium" />
                <qtm-typography component="body-1"
               
                  >{{ countItems(item.group_type === 'shc'?item.users_shc:item.users_uds) }} Users</qtm-typography
                >
              </div>
              <div style="display: flex; gap: 10px; margin-top: 15px" class="truncate">
                <qtm-typography component="body-1">
                  {{
                    item.description && item.description.length > 78
                      ? item.description.slice(0, 78) + " ..."
                      : item.description
                  }}
                </qtm-typography>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <QtmDivider />
            <div class="mt-s" style="display: flex; justify-content: end">
              <!-- <qtm-button
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right"
              @click.stop
            >
              <qtm-icon icon="edit" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button>

            <ColorPickerCustom 
              label="" 
              :color="item.color_code" 
              :position-tooltip-left="'-133px'"
              @update="(value) => 
              changeColorCard(value, item)" 
            />

            <qtm-button
              variant="ghost"
              size="small"
              color="primary"
              classes="container-icon-right-first"
              @click.stop
            >
              <qtm-icon icon="delete" size="medium" classes="text-primary-200"></qtm-icon>
            </qtm-button> -->
            </div>
          </div>
        </div>
      </div>

      <div
        class="pagination-style-custom"
        :style="{ bottom: widthMaximise === '75%' ? '10px' : '25px' }"
      >
        <PaginationCustom
          :disable-i-p-p="false"
          style="margin-right: 10px"
          :total-items="groupsStore.groupsData?.totalItems"
          :items-per-page="groupsStore.groupsData?.currentPage"
          :offset-value="groupsStore.offset" 
          :total-pages-by-pages="[6, 12, 25, 50]"
          @page-changed="handlePageChange"
          @limit-changed="handleLimitChange"
        />
      </div>
    </template>
    <template #step3="stepContent">
      <div style="overflow: hidden; margin-left: 2px">
        <div class="filters-options">
          <template v-for="value in Object.entries(userStore.selectedFilters)" :key="value[0]">
              <qtm-tag size="medium" classes="color-button-status-active style-custom-tag custom-tag"
                  :dismissible="true" v-if="value[1] !== '' && value[1].length > 0"
                  @clicked-tag-button-event="handleFilter('reset', value[0]);">
                  <span v-html="viewLabelFilter(value)"></span>
              </qtm-tag>
          </template>

          <qtm-typography classes="text-bluegrey-100 custom-clear-all style-custom-tag" :font-size="7"
              font-weight="normal" font-family="roboto" v-show="hasFormDataFilterValues"
              @click="() => { resetFiltersInTable(); }">
              Clear All
          </qtm-typography>
      </div>
        <QtmTypography classes="font-title-custom-4"
          >Select the users you want to apply your rule to.</QtmTypography
        >
        <div style="margin-top: 5px; margin-bottom: 10px; display: flex; gap: 20px">
          <QtmButton
            color="inverted"
            variant="filled"
            size="small"
            :label="`${userStore.itemsSelectedFormRules.length} selected users`"
            classes="text-scale-7 rounded-full bg-bluegrey-600"
          ></QtmButton>
          <QtmTypography classes="text-primary-50 cursor-pointer" v-if="isUnSelectUsers" @click.stop="unSelectUsers"  style="padding-top: 5px"
          >Clear All</QtmTypography>
        </div>
      </div>
      <EasyDataTable
        :body-row-class-name="(item: Item, rowNumber: number) => bodyRowClassNameFunction(item, rowNumber, isRowExpanded(item.user_id))"
        v-model:items-selected="userStore.itemsSelectedFormRules"
        :headers="headersUserFormRules"
        :items="userStore.userData"
        theme-color="#4c5dff"
        table-class-name="customize-table"
        class="rules-user-table table-custom-sortType"
        header-text-direction="left"
        body-text-direction="left"
        :filter-options="filterOptions"
        :sort-type="sortType"
        multi-sort
        :table-height="handleHeightTable()"
        style="z-index: 140"
        :rows-items="[10, 25, 50, 100]"
        :rows-per-page="10"
        alternating
        font-family="Roboto, sans-serif"
        fixed-checkbox
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update-page-items="handleSelectionChanged"
        :checkbox-column-width="47"
      >
      <template #header-user_id="header">
        <ClickOutSide @clickoutside="filterState.showUser_idFilter = false">
          <div class="filter-column">

            <div>
              {{ header.text }}
              <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
            </div>

            <qtm-icon
              icon="filter_list"
              :class="`column-filter ${user_idCriteria.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('showUser_idFilter')"
            ></qtm-icon>

            <div class="filter-menu" v-if="filterState.showUser_idFilter">
              <QtmTextInput
                :value="user_idCriteria"
                @value-changed="(event:any) =>  user_idCriteria_temp = event.detail "
                placeholder="Search"
                size="small"
                left-icon="search"
                @click.stop
              >
              </QtmTextInput>

              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small"
                     @click.stop="handleFilter('reset', 'user_id')"
                  >Reset</QtmButton>
                <QtmButton variant="filled" color="primary" size="small"
                  @click.stop="handleFilter(user_idCriteria_temp, 'user_id'), filterState.showFilter_id = false">Apply</QtmButton>
              </div>

            </div>
          </div>
        </ClickOutSide>
      </template>
      <template #header-country="header">
        <ClickOutSide @clickoutside="filterState.showStanag_idFilter = false">
          <div class="filter-column" >

            <div>
              {{ header.text }}
              <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
            </div>

            <qtm-icon
              icon="filter_list"
               :class="`column-filter ${selectedStanagIdsTemp && selectedStanagIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('showStanag_idFilter')"
            ></qtm-icon>

            <div class="filter-menu" v-if="filterState.showStanag_idFilter">
              <div @click.stop>
                <QtmTextInput
                  :value="stanagSearchTerm"
                  @value-changed="(event:any) => stanagSearchTerm = event.detail "
                  placeholder="Search"
                  size="small"
                  left-icon="search"
                  @click.stop 
                >
                </QtmTextInput>
                <QtmDivider classes="my-m" />
                <div class="filter-menu-list-checkbox" :style="widthMaximise ==='75%'?'max-height: 80px;':''">
                  <ul v-for="itemsCountry in filteredMappedDataStanag">
                    <li>
                      <qtm-checkbox
                        @change="
                          handleStanagIdCheckboxChange(itemsCountry.value)
                        "
                        :value="itemsCountry.value"
                        :checked="
                          selectedStanagIdsTemp.includes(
                            itemsCountry.value ? itemsCountry.value : ''
                          )
                        "
                      >
                        {{ itemsCountry.label }}
                      </qtm-checkbox>
                    </li>
                  </ul>
                </div>
                <QtmDivider classes="my-m" />
                <div class="buttom-div">
                  <QtmButton
                    variant="outline"
                    color="primary"
                    size="small"
                    @click.stop="resetFilters(),handleFilter('reset','country')"
                    >Reset</QtmButton
                  >
                  <QtmButton
                    variant="filled"
                    color="primary"
                    size="small"
                    @click.stop="applyFilters(), handleFilter('','country'),filterState.showStanag_idFilter = false"
                    >Apply</QtmButton
                  >
                </div>
              </div>
            </div>
          </div>
        </ClickOutSide>
      </template>
      <template #header-status="header">
        <ClickOutSide @clickoutside="filterState.showStatus_header = false">
          <div class="filter-column">

            <div>
              {{ header.text }}
              <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
            </div>

            <qtm-icon
              icon="filter_list"
              :class="`column-filter ${status_criteria.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('showStatus_header')"
            ></qtm-icon>

            <div
              class="filter-menu"
              v-if="filterState.showStatus_header"
              @click.stop
            >
              <qtm-dropdown-select
                size="small"
                @value-changed="(event:any) => status_criteria_temp = event.detail.valueChanged"
                :value="status_criteria"
              >
                <template v-for="(optionsSelect, index) in statesUsers" :key="index">
                  <qtm-dropdown-select-option :value="optionsSelect.value">
                    {{ optionsSelect.label }}
                  </qtm-dropdown-select-option>
                </template>
              </qtm-dropdown-select>
              <QtmDivider classes="my-m" />
              <div class="buttom-div">
                <QtmButton variant="outline" color="primary" size="small" @click="handleFilter('reset','status')" >Reset</QtmButton>
                <QtmButton
                  variant="filled"
                  color="primary"
                  size="small"
                  @click.stop="handleFilter(status_criteria_temp, 'status'),filterState.showStatus_header = false"
                  >Apply</QtmButton>
              </div>
            </div>
          </div>
        </ClickOutSide>
      </template>
      <template #header-group_uds.group_name="header">
        <ClickOutSide @clickoutside="filterState.udsGroup_header = false">
          <div class="filter-column">

            <div @click.stop class="filter-column-no-sort-by-header">
              {{ header.text }}
            </div>

            <qtm-icon
              icon="filter_list"
              :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedUdsGroupIdsTemp && selectedUdsGroupIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              size="medium"
              @click.stop="handleFilterState('udsGroup_header')"
            ></qtm-icon>
            
            <div class="filter-menu"  v-if="filterState.udsGroup_header">
              
              <div @click.stop>
                <QtmTextInput
                  :value="udsGroupSearchTerm"
                  @value-changed="(event:any) => udsGroupSearchTerm = event.detail "
                  placeholder="Search"
                  size="small"
                  left-icon="search"
                  @click.stop
                >
                </QtmTextInput>
                <QtmDivider classes="my-m" />
                <div class="filter-menu-list-checkbox" :style="widthMaximise ==='75%'?'max-height: 80px;':''">
                  <ul v-for="group in filteredMappedDataUdsGroup">
                    <li>
                      <qtm-checkbox
                        @change="
                          handleUdsGroupCheckboxChange(group.id)
                        "
                        :value="group.id"
                        :checked="
                          selectedUdsGroupIdsTemp.includes(
                            group.id ? group.id : ''
                          )
                        "
                      >
                        {{ group.name }}
                      </qtm-checkbox>
                    </li>
                  </ul>
                </div>
                <QtmDivider classes="my-m" />
                <div class="buttom-div">
                  <QtmButton
                        variant="outline"
                        color="primary"
                        size="small"
                        @click.stop="resetUdsGroupFilters(),handleFilter('reset','udsGroup')"
                        >Reset</QtmButton
                      >
                      <QtmButton
                        variant="filled"
                        color="primary"
                        size="small"
                        @click.stop="applyUdsGroupFilters(), handleFilter('','udsGroup'),filterState.udsGroup_header = false"
                        >Apply</QtmButton
                      >
                </div>
              </div>

            </div>
            
          </div>
        </ClickOutSide>
      </template>
      <template #header-group_shcs="header">
        <ClickOutSide @clickoutside="filterState.group_shcs_header = false">
          <div class="filter-column">

            <div @click.stop class="filter-column-no-sort-by-header">
              {{ header.text }}
            </div>

            <qtm-icon
              icon="filter_list"
              size="medium"
              :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedShcGroupIdsTemp && selectedShcGroupIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('group_shcs_header')"
            ></qtm-icon>
            
              <div class="filter-menu" v-if="filterState.group_shcs_header">
                
                <div @click.stop>
                  <QtmTextInput
                    :value="shcGroupSearchTerm"
                    @value-changed="(event:any) => shcGroupSearchTerm = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop
                  >
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="filter-menu-list-checkbox" :style="widthMaximise ==='75%'?'max-height: 80px;':''">
                    <ul v-for="group in filteredMappedDataShcGroup">
                      <li>
                        <qtm-checkbox
                          @change="
                            handleShcGroupCheckboxChange(group.id)
                          "
                          :value="group.id"
                          :checked="
                            selectedShcGroupIdsTemp.includes(
                              group.id ? group.id : ''
                            )
                          "
                        >
                          {{ group.name }}
                        </qtm-checkbox>
                      </li>
                    </ul>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                        variant="outline"
                        color="primary"
                        size="small"
                        @click.stop="resetShcGroupFilters(),handleFilter('reset','shcGroup'),filterState.group_shcs_header = false"
                        >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="applyShcGroupFilters(), handleFilter('','shcGroup'),filterState.group_shcs_header = false"
                      >Apply</QtmButton
                    >
                  </div>
                </div>

              </div>
           
          </div>
        </ClickOutSide>
      </template>
      <template #header-missions="header">
        <ClickOutSide @clickoutside="filterState.missions_header = false">
          <div class="filter-column">

            <div @click.stop class="filter-column-no-sort-by-header">
              {{ header.text }}
            </div>
            <qtm-icon
              icon="filter_list"
              size="medium"
               :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${selectedMissionGroupIdsTemp && selectedMissionGroupIdsTemp.length > 0 ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('missions_header')"
            ></qtm-icon>
           
              <div class="filter-menu" v-if="filterState.missions_header">
              
                <div @click.stop>
                  <QtmTextInput
                    :value="missionGroupSearchTerm"
                    @value-changed="(event:any) => missionGroupSearchTerm = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop
                  >
                  </QtmTextInput>
                  <QtmDivider classes="my-m" />
                  <div class="filter-menu-list-checkbox" :style="widthMaximise ==='75%'?'max-height: 80px;':''">
                    <ul v-for="mission in filteredMappedDataMissionGroup">
                      <li>
                        <qtm-checkbox
                          @change="
                            handleMissionGroupCheckboxChange(mission.id)
                          "
                          :value="mission.id"
                          :checked="
                            selectedMissionGroupIdsTemp.includes(
                              mission.id ? mission.id : ''
                            )
                          "
                        >
                          {{ mission.id }}
                        </qtm-checkbox>
                      </li>
                    </ul>
                  </div>
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                        variant="outline"
                        color="primary"
                        size="small"
                        @click.stop="resetMissionGroupFilters(),handleFilter('reset','missionGroup'),filterState.missions_header = false"
                        >Reset</QtmButton
                      >
                      <QtmButton
                        variant="filled"
                        color="primary"
                        size="small"
                        @click.stop="applyMissionGroupFilters(), handleFilter('','missionGroup'),filterState.missions_header = false"
                        >Apply</QtmButton
                      >
                  </div>
                </div>
                
              </div>
            
          </div>
        </ClickOutSide>
      </template>
      <template #header-creation_date="header">
        <ClickOutSide
          @clickoutside="filterState.insertion_date_date_header = false"
        >
          <div class="filter-column">
            <div>
              {{ header.text }}
              <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
            </div>

            <qtm-icon
              icon="filter_list"
              size="medium"
              :class="`column-filter ${((insertion_date_start_Criteria && insertion_date_start_Criteria.toString().length > 0) || (insertion_date_end_Criteria && insertion_date_end_Criteria.toString().length > 0)) ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('insertion_date_date_header')"
            ></qtm-icon>

            <div
              class="filter-menu"
              style="width: 420px !important"
              v-if="filterState.insertion_date_date_header"
            >
             
              <div class="flex align-center gap-2">

                <div>
                    <p class="text-left">Subscription date start</p>
                    <VueDatePicker                    
                      v-model="insertion_date_start_Criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime">
                    </VueDatePicker>
                  </div>

                  <div>
                    <p class="text-left">Subscription date end</p>
                    <VueDatePicker                   
                      v-model="insertion_date_end_Criteria_temp"
                      :dark="true" 
                      :teleport="true"
                      time-picker-inline
                      :format="getFormattedDateTime"
                      >
                    </VueDatePicker>
                  </div>

              </div>

              <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter('reset', 'creation_date_criteria')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter(insertion_date_start_Criteria_temp, 'creation_date_criteria'),filterState.insertion_date_date_header = false"
                      >Apply</QtmButton
                    >
                  </div>

            </div>
          </div>
        </ClickOutSide>
      </template>
      <template #header-license_expiration_date="header">
        <ClickOutSide
          @clickoutside="filterState.license_expiration_date_header = false"
        >
          <div class="filter-column">
            <div>
              {{ header.text }}
              <qtm-icon v-if="header.sortType === 'desc'" icon="arrow_downward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'asc'" icon="arrow_upward" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
              <qtm-icon v-if="header.sortType === 'none'" icon="swap_vert" size="medium"
                classes="text-primary-200 filter-icon"></qtm-icon>
            </div>

            <qtm-icon
              icon="filter_list"
              size="medium"
              :class="`column-filter ${((license_expiration_date_start_Criteria && license_expiration_date_start_Criteria.toString().length > 0) || (license_expiration_date_end_Criteria && license_expiration_date_end_Criteria.toString().length > 0)) ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('license_expiration_date_header')"
            ></qtm-icon>

            <div
              class="filter-menu"
              style="width: 438px !important"
              v-if="filterState.license_expiration_date_header"
            >
            
            <div class="flex align-center gap-2">
              <div>
                <p class="text-left">License expiration date start</p>
                <VueDatePicker 
                  v-model="license_expiration_date_start_Criteria_temp"
                  :dark="true" 
                  :teleport="true"
                  time-picker-inline
                  :format="getFormattedDateTime">
                </VueDatePicker>
              </div>

              <div>
                <p class="text-left">License expiration date end</p>
                <VueDatePicker 
                  v-model="license_expiration_date_end_Criteria_temp"
                  :dark="true" 
                  :teleport="true"
                  time-picker-inline
                  :format="getFormattedDateTime">
                </VueDatePicker>
              </div>
            </div>

            <QtmDivider classes="my-m" />
            <div class="buttom-div">
              <QtmButton
                variant="outline"
                color="primary"
                size="small"
                @click.stop="handleFilter('reset', 'license_expiration_date')"
                >Reset</QtmButton
              >
              <QtmButton
                variant="filled"
                color="primary"
                size="small"
                @click.stop="handleFilter(license_expiration_date_start_Criteria_temp, 'license_expiration_date'),filterState.license_expiration_date_header = false"
                >Apply</QtmButton
              >
            </div>
              
            
            </div>
          </div>
        </ClickOutSide>
      </template>
      <template #header-user_rules="header">
        <ClickOutSide @clickoutside="filterState.user_rules_header = false">
          <div class="filter-column">
            <div @click.stop class="filter-column-no-sort-by-header">
              {{ header.text }}
            </div>

            <qtm-icon
              icon="filter_list"
              size="medium"
               :class="`column-filter filter-column-no-sort-by-body cursor-pointer ${user_rules_Criteria.length > 0 ? 'column-filtered' : ''}`"
              @click.stop="handleFilterState('user_rules_header')"
            ></qtm-icon>

            <div class="filter-menu" v-if="filterState.user_rules_header">
              <QtmTextInput
                    :value="user_rules_Criteria"
                    @value-changed="(event:any) => user_rules_Criteria_temp = event.detail "
                    placeholder="Search"
                    size="small"
                    left-icon="search"
                    @click.stop>
                  </QtmTextInput> 
                  <QtmDivider classes="my-m" />
                  <div class="buttom-div">
                    <QtmButton
                      variant="outline"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter('reset', 'user_rules')"
                      >Reset</QtmButton
                    >
                    <QtmButton
                      variant="filled"
                      color="primary"
                      size="small"
                      @click.stop="handleFilter(user_rules_Criteria_temp, 'user_rules'),filterState.user_rules_header = false"
                      >Apply</QtmButton
                    >
                  </div>
            </div>
          </div>
        </ClickOutSide>
      </template>
        <template #item-user_id="item">
          <div style="display: flex; align-items: center">
            <qtm-tooltip
              size="small"
              orientation="top"
              tip-position="end"
              :content="`Added on ${convertFormatDate(item.creation_date)}.`"
              v-if="countItem(item.user_rules)"
            >
              <div
                style="
                  display: relative;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background-color: #57fc53;
                  margin-right: 55px;
                  margin-left: -75px;
                "
              ></div>
            </qtm-tooltip>
            <QtmIcon
              :icon="
                isRowExpanded(item.user_id) ? 'expand_less' : 'expand_more'
              "
              size="medium"
              variant="outlined"
              @click="toggleRowExpansion(item.user_id)"
              style="cursor: pointer"
            >
            </QtmIcon>
            <span style="margin-left: 3px">{{ item.user_id }} </span>
          </div>
        </template>
        <template #item-status="item">
          <div>
            <qtm-tag
              :label="capitalizeFirstLetter(item?.status)"
              size="small"
              :classes="colorButtonClass(item?.status)"
              :dismissible="false"
            >
            </qtm-tag>
          </div>
        </template>
        <template #item-creation_date="items">
          <div>
            <p>{{ convertFormatDate(items.creation_date) }}</p>
          </div>
        </template>
        <template #item-user_rules="items">
          <div>
            <ul v-if="expandedRows.includes(items.user_id)">
              <li
                v-for="(rule, index) in groupRuleset(
                  items.user_rules,
                  items.shc_group_rules,
                  items.uds_group_rules
                )"
                :key="rule.rule_id"
              >
                <div style="display: flex; gap: 10px; margin-bottom: 7px">
                  <qtm-tooltip
                    :content="
                      groupRuleset(
                        items.user_rules,
                        items.shc_group_rules,
                        items.uds_group_rules
                      )[0].rule_name
                    "
                  >
                    <qtm-tag
                      class="width-custom-tag"
                      :label="validateLargeText(rule.rule_name, 11)"
                      size="small"
                      :classes="`${colorTagClass(rule?.rule_type)}`"
                      :dismissible="false"
                    >
                    </qtm-tag>
                  </qtm-tooltip>
                  <qtm-tag
                    size="small"
                    classes="color-tag-custom-status"
                    :dismissible="false"
                  >
                    <qtm-icon
                      icon="check_circle"
                      variant="outlined"
                      size="small"
                    ></qtm-icon>
                    <qtm-typography classes="text-scale-8">{{
                      capitalizeFirstLetter(rule?.status)
                    }}</qtm-typography>
                  </qtm-tag>
                </div>
              </li>
            </ul>
            <div v-else>
              <div
                v-if="
                  groupRuleset(
                    items.user_rules,
                    items.shc_group_rules,
                    items.uds_group_rules
                  ).length > 0
                "
              >
                <div style="display: flex; gap: 10px">
                  <qtm-tooltip
                    :content="
                      groupRuleset(
                        items.user_rules,
                        items.shc_group_rules,
                        items.uds_group_rules
                      )[0].rule_name
                    "
                  >
                    <qtm-tag
                      class="width-custom-tag"
                      :label="
                        validateLargeText(
                          groupRuleset(
                            items.user_rules,
                            items.shc_group_rules,
                            items.uds_group_rules
                          )[0].rule_name,
                          11
                        )
                      "
                      size="small"
                      :classes="`${colorTagClass(
                        groupRuleset(
                          items.user_rules,
                          items.shc_group_rules,
                          items.uds_group_rules
                        )[0]?.rule_type
                      )}`"
                      :dismissible="false"
                    >
                    </qtm-tag>
                  </qtm-tooltip>
                  <qtm-tag
                    size="small"
                    classes="color-tag-custom-status"
                    :dismissible="false"
                  >
                    <qtm-icon
                      icon="check_circle"
                      variant="outlined"
                      size="small"
                    ></qtm-icon>
                    <qtm-typography classes="text-scale-8">{{
                      capitalizeFirstLetter(
                        groupRuleset(
                          items.user_rules,
                          items.shc_group_rules,
                          items.uds_group_rules
                        )[0]?.status
                      )
                    }}</qtm-typography>
                  </qtm-tag>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #item-user_rules_custom="items">
          <ul>
            <li v-for="(rule, index) in items.user_rules" :key="rule.id">
              <div style="margin-bottom: 3px" v-if="index === 0">
                <qtm-button
                  classes="rounded-full"
                  variant="filled"
                  size="small"
                  color="success"
                  >{{ capitalizeFirstLetter(rule?.status) }}
                </qtm-button>
              </div>
            </li>
            <li v-for="(rule, index) in items.user_rules" :key="rule.id">
              <div
                style="display: flex; gap: 5px; margin-top: 10px"
                v-if="isExpanded(items.user_rules, index)"
              >
                <qtm-button
                  classes="rounded-full"
                  variant="filled"
                  size="small"
                  :color="colorButton(rule?.status)"
                  >{{ capitalizeFirstLetter(rule?.status) }}
                </qtm-button>
              </div>
            </li>
          </ul>
        </template>
        <template #item-missions="items">
          <div
            v-html="
              getValuesAndIdsExpanded(
                items.missions,
                'id',
                isRowExpanded(items.user_id)
              )
            "
          ></div>
        </template>
        <template #item-schedule_acquisition="items">
          <div style="display: flex">
            <qtm-checkbox checked></qtm-checkbox>
            <p>Allowed</p>
          </div>
        </template>
        <template #item-accessCatalogue="items">
          <div style="display: flex; justify-content: space-between">
            <div style="display: flex">
              <qtm-checkbox> </qtm-checkbox>
              <p>Allowed</p>
            </div>
            <qtm-icon size="medium" icon="more_vert"></qtm-icon>
          </div>
        </template>
        <template #item-group_shcs="items">
          <div
            v-html="
              getValuesAndIdsExpanded(
                items.group_shcs,
                'group_name',
                isRowExpanded(items.user_id)
              )
            "
          ></div>
        </template>
        <template #item-license_expiration_date="items">
          <div>
            <p>{{ convertFormatDate(items.license_expiration_date) }}</p>
          </div>
        </template>
        <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
            <div style="margin-right: 10px;">
              {{ rangePagesUser }}
            </div>
          <QtmIcon icon="chevron_left" size="medium"
          :classes="'icon-left-right ' + ( pagProperty.lastPage ? 'cursor-disabled' : 'cursor-pointer')"

              @click=" !pagProperty.lastPage  ? loadFromServer(-serverOptions.rowsPerPage) : ''"></QtmIcon>
            <QtmIcon icon="chevron_right" size="medium"
            :classes="'icon-left-right ' + ((pagProperty.nextPage ) ? 'cursor-disabled' : 'cursor-pointer')"

              @click=" !pagProperty.nextPage ? loadFromServer(serverOptions.rowsPerPage) : ''"></QtmIcon>
          </template>
      </EasyDataTable>
    </template>
    <template #step5="stepContent">
      <div style="margin-top: 28px; height: 100% !important; width:100%; min-width: 620px;">
        <QtmTypography
          classes="text-white-100"
          style="font-size: 16px !important"
          >Define the geometry, you can define a shape or select a country.</QtmTypography
        >
        <div
          style="
            display: flex;
            gap: 40px;
            margin-top: 24px;
            margin-bottom: 30px;
          "
        >
          <qtm-radio-button
            name="geometryOption"
            value="shape"
            size="medium"
            :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
            @clicked="(e) => handleMenuGeometry('shape')"
            :checked="menuGeometry === 'shape'"
            >Define shape</qtm-radio-button
          >
          <qtm-radio-button
            name="geometryOption"
            value="country"
            size="medium"
            :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
            :checked="menuGeometry === 'country'"
            @clicked="(e) => handleMenuGeometry('country')"
            >Select countries</qtm-radio-button
          >
        </div>
        <div
          style="
            height: 100% !important;
            width: 100%;

          "
          v-if="menuGeometry === 'shape'"
        >
          <div style="width: 50%; margin-top: 10px">
            <qtm-tabs full-width fluid >
              <qtm-tab
                @clicked-tab-event="() => handleMenuShape('Circle')"
                :active="menuShape === 'Circle'"
                :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
              >
                <QtmIcon
                  icon="circle"
                  variant="outlined"
                  size="medium"
                ></QtmIcon>
                <QtmTypography classes="text-primary-50">Circle</QtmTypography>
              </qtm-tab>
              <qtm-tab
              :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
                @clicked-tab-event="() => handleMenuShape('Polygon')"
                :active="menuShape === 'Polygon'"
              >
                <QtmIcon
                  icon="polyline"
                  variant="outlined"
                  size="medium"
                ></QtmIcon>
                <QtmTypography classes="text-primary-50">Polygon</QtmTypography>
              </qtm-tab>
            </qtm-tabs>
          </div>
          <div style="width: 100%; padding: 15px; background-color: #1C1D26;" v-if="menuShape === 'Circle'">
            <div
              style="
                display: flex;
                gap: 15px;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="display: flex; gap: 15px; white-space: nowrap;">
                <qtm-dropdown
                @visible-change="showDropdownImportCircle = !showDropdownImportCircle"
                    v-bind="{
                        id: 'id_import_geometry_circle'
                      }"
                >
                  <qtm-dropdown-trigger>
                    <qtm-button
                      variant="outline"
                      color="neutral"
                      left-icon="upload"
                      :right-icon="showDropdownImportCircle?'keyboard_arrow_up':'keyboard_arrow_down'"
                      label="Import geometry"
                      :disabled="(ruleStore.isEditRule && rulesStore.initialData.status) || formatDataCircleCustom().length > 0"
                    ></qtm-button>
                  </qtm-dropdown-trigger>
                  <qtm-dropdown-overlay style="z-index: 101;" classes="min-width-100">
                    <qtm-menu-item-list enable-auto-active  @active-id-changed="(val: any) => updateSelectWktPoligonDropdown(val)">
                      <qtm-menu-item id="shp_format" >
                        <qtm-menu-item-label> SHP format </qtm-menu-item-label>
                      </qtm-menu-item>
                      <qtm-menu-item id="wkt_polygon_circle" @clicked-menu-item="handleShowModalWktGeometryCircle">
                        <qtm-menu-item-label> WKT polygon </qtm-menu-item-label>
                      </qtm-menu-item>
                    </qtm-menu-item-list>
                  </qtm-dropdown-overlay>
                </qtm-dropdown>
                <qtm-button
                  variant="filled"
                  color="primary"
                  @click-event="showModalCircle"
                  :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
                >
                  <qtm-icon icon="draw"></qtm-icon>
                </qtm-button>
              </div>
              <div
                style="
                  display: flex;
                  gap: 15px;
                  justify-content: center;
                  align-items: center;
                  padding-right: 2px;
                "
              >
                <qtm-toggle-switch
                  size="medium"
                  label-position="right"
                  :checked="true"
                  style="margin-right: 30px; width: 120px; margin-left: 122px"
                  @value-changed="handleCoordinateGeometry('circle')"
                  >{{ coordinateGeometryCircle == 'Sexageximal' ? 'Sexagesimal' : coordinateGeometryCircle }}</qtm-toggle-switch
                >

                <qtm-button
                  variant="ghost"
                  color="primary"
                  size="medium"
                  @mouseenter.stop="toggleTooltip(2, true)"
                  @mouseleave.stop="toggleTooltip(2, false)"
                  :disabled="
                    formatDataCircleCustom().length == 0 || (ruleStore.isEditRule && rulesStore.initialData.status)
                  "
                  @click-event="clearCircle"
                >
                  <qtm-icon icon="cleaning_services">
                    <qtm-tooltip
                      size="small"
                      classes="tooltip-layer"
                      title="Clear all"
                      orientation="top"
                      tip-position="center"
                      :visible="
                        isTooltipVisible[2] &&
                        formatDataCircleCustom().length > 0 &&
                        !ruleStore.isEditRule
                      "
                      style="position: absolute; bottom: 38px"
                    >
                    </qtm-tooltip>
                  </qtm-icon>
                </qtm-button>
              </div>
            </div>
            <div
              style="
                display: flex;
                gap: 15px;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="display: flex; gap: 15px"></div>
              <div style="display: flex"></div>
            </div>
            <div style="margin-top: 10px">
              <EasyDataTable
                :body-row-class-name="bodyRowClassNameFunction"
                :headers="headersGeometryCircle"
                :items="formatDataCircleCustom()"
                theme-color="#4c5dff"
                table-class-name="customize-table"
                header-text-direction="left"
                body-text-direction="left"
                :sort-type="sortType"
                multi-sort
                :table-height="
                  widthMaximise === '75%'
                    ? screenStore.dimanicScreenHeight(745)
                    : screenStore.dimanicScreenHeight(622)
                "
                style="z-index: 100"
                :hide-footer="true"
                alternating
              >
              <template #empty-message>
                <div class="mt-xl">
                  <QtmTypography component="body-2" >No geometry details to display.</QtmTypography>
                <QtmTypography component="body-2">Import a geometry or draw on the map to view details.</QtmTypography>
                </div>
              </template>
                <template #header-id="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <template #header-center_lat="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <template #header-center_lon="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <template #header-radius="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <template #header-actions="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <!-- circle -->
                <template #item-center_lon="item">
                  <div v-if="!(hoveredRowIndex === item.id)">
                    {{ convertTextTruncate(14, item.center_lon) }}
                  </div>
                  <div v-else>
                    <div
                      class="qtm-input-edit-table-container"
                    >
                      <div v-if="coordinateGeometryCircle === 'Sexageximal'">
                        <LatLonSexagInput
                          :id="item.id"
                          :isEdit="isEditFigure"
                          :isLat="false"
                          @update-value="(value:any) => updateSexagesimalCircleValue(value, 'lon')"
                          @invalid-lat-lon="(value:boolean) => updateInvalidLonValue(value)"
                          :value="item.center_lon"
                        />
                      </div>

                      <input
                        :class="`qtm-input-edit-table ${invalidInputLon && invalidInputLon[item.id] ? 'input-text-danger' : ''}`"
                        v-if="coordinateGeometryCircle === 'Decimal'"
                        @input="(event:any) => validateInputDecimals(event, 5, () => { selectedCircleItem.center_lon = event.target.value })"
                        @blur="selectedCircleItem.center_lon = limitDecimals(selectedCircleItem.center_lon)"
                        v-model="selectedCircleItem.center_lon"
                        placeholder="000.00000"
                      />
                    </div>
                  </div>
                </template>

                <template #item-center_lat="item">
                  <div v-if="!(hoveredRowIndex === item.id)">
                    {{ convertTextTruncate(14, item.center_lat) }}
                  </div>
                  <div v-else>
                    <div
                      class="qtm-input-edit-table-container"
                    >
                      <div v-if="coordinateGeometryCircle === 'Sexageximal'">
                        <LatLonSexagInput
                          :id="item.id"
                          :isLat="true"
                          :isEdit="isEditFigure"
                          @update-value="(value:any) => updateSexagesimalCircleValue(value, 'lat')"
                          @invalid-lat-lon="(value:boolean) => updateInvalidLatValue(value)"
                          :value="item.center_lat"
                        />
                      </div>

                      <input
                        :class="`qtm-input-edit-table ${invalidInputLat && invalidInputLat[item.id] ? 'input-text-danger' : ''}`"
                        v-if="coordinateGeometryCircle === 'Decimal'"
                        @input="(event:any) => validateInputDecimals(event, 5, () => { selectedCircleItem.center_lat = event.target.value })"
                        @blur="selectedCircleItem.center_lat = limitDecimals(selectedCircleItem.center_lat)"
                        v-model="selectedCircleItem.center_lat"
                        placeholder="000.00000"
                      />
                    </div>
                  </div>
                </template>

                <template #item-radius="item">
                  <div v-if="!(hoveredRowIndex === item.id)">
                    {{ convertTextTruncate(11, item.radius) }} Km
                  </div>
                  <div v-else>
                    <div
                      class="qtm-input-edit-table-container"
                    >
                      <input
                        :class="`qtm-input-edit-table ${invalidInputRad && invalidInputRad[item.id] ? 'input-text-danger' : ''}`"
                        @input="(event:any) => validateInputDecimals(event, 5, () => { selectedCircleItem.radius = event.target.value })"
                        @blur="selectedCircleItem.radius = limitDecimals(selectedCircleItem.radius)"
                        v-model="selectedCircleItem.radius"
                        placeholder="000.00000"
                      />
                    </div>
                  </div>
                </template>

                <template #item-actions="item">
                  <div
                    style="
                      display: flex;
                      justify-content: end;
                      align-items: end;
                      gap: 2px;
                      position: absolute;
                      top: 7%;
                      right: 4px;
                      width: 100%;
                    "
                  >
                    <qtm-button
                      variant="ghost"
                      v-if="!(hoveredRowIndex === item.id)"
                      @click="handleShowEdit(item)"
                      :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
                    >
                      <qtm-icon
                        icon="edit"
                        variant="outlined"
                        size="medium"
                        classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>

                    <qtm-button
                      variant="ghost"
                      v-if="!(hoveredRowIndex === item.id)"
                      @click="clearCircle()"
                      :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
                    >
                      <qtm-icon
                        icon="delete"
                        variant="outlined"
                        size="medium"
                        classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>

                    <qtm-button
                      variant="ghost"
                      :disabled="(isLatInvalid || isLonInvalid) || invalidGeometry"
                      v-if="(hoveredRowIndex === item.id)"
                      @click="handleSaveCircle()"
                    >
                      <qtm-icon
                        icon="save"
                        variant="outlined"
                        size="medium"
                        classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>

                    <qtm-button
                      variant="ghost"
                      v-if="(hoveredRowIndex === item.id)"
                      @click="handleCancelChanges()"
                    >
                      <qtm-icon
                        icon="close"
                        variant="outlined"
                        size="medium"
                        classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>

                  </div>
                </template>

              </EasyDataTable>

              <div
                style="display: flex; justify-content: end; margin-top: 15px"
              >
                <qtm-button
                  variant="filled"
                  color="primary"
                  size="medium"
                  @mouseenter.stop="toggleTooltip(1, true)"
                  :disabled="disableCircleAddCoordinates()"
                  @mouseleave.stop="toggleTooltip(1, false)"
                  @click="addCoordinates('circle')"
                >
                  <qtm-icon icon="add">
                    <qtm-tooltip
                      size="small"
                      classes="tooltip-layer"
                      title="Add item"
                      orientation="top"
                      tip-position="center"
                      :visible="
                        isTooltipVisible[1] &&
                        disableCircleAddCoordinates() == false
                      "
                      style="position: absolute; bottom: 38px"
                    >
                    </qtm-tooltip>
                  </qtm-icon>
                </qtm-button>
              </div>
            </div>
          </div>
          <div style="width: 100%; padding: 15px;background-color: #1C1D26;" v-if="menuShape === 'Polygon'">
            <div
              style="
                display: flex;
                gap: 15px;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="display: flex; gap: 15px; white-space: nowrap;">
                <qtm-dropdown
                    @visible-change="showDropdownImportPolygon = !showDropdownImportPolygon"
                    v-bind="{
                        id: 'id_import_geometry_polygon'
                      }"
                >
                  <qtm-dropdown-trigger>
                    <qtm-button
                      variant="outline"
                      color="neutral"
                      left-icon="upload"
                       :right-icon="showDropdownImportPolygon?'keyboard_arrow_up':'keyboard_arrow_down'"
                      label="Import geometry"
                      :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
                    ></qtm-button>
                  </qtm-dropdown-trigger>
                  <qtm-dropdown-overlay style="z-index: 101;" classes="min-width-100">
                    <qtm-menu-item-list enable-auto-active  @active-id-changed="(val: any) => updateSelectWktPoligonDropdown(val)">
                      <qtm-menu-item id="shp_format" @clicked-menu-item="handleImportShp">
                        <qtm-menu-item-label> SHP format </qtm-menu-item-label>
                      </qtm-menu-item>
                      <qtm-menu-item id="wkt_polygon" @clicked-menu-item="handleShowModalWktGeometry">
                        <qtm-menu-item-label> WKT polygon </qtm-menu-item-label>
                      </qtm-menu-item>
                    </qtm-menu-item-list>
                  </qtm-dropdown-overlay>
                </qtm-dropdown>
                <qtm-button
                  variant="filled"
                  color="primary"
                  size="medium"
                  @mouseenter.stop="toggleTooltip(3, true)"
                  @mouseleave.stop="toggleTooltip(3, false)"
                  @click-event="showModal"
                  :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
                >
                  <qtm-icon icon="draw">
                    <qtm-tooltip
                      size="small"
                      classes="tooltip-layer"
                      title="Draw on map"
                      orientation="top"
                      tip-position="center"
                      :visible="isTooltipVisible[3] && !ruleStore.isEditRule"
                      style="position: absolute; bottom: 38px"
                    >
                    </qtm-tooltip>
                  </qtm-icon>
                </qtm-button>
              </div>
              <div
                style="
                  display: flex;
                  gap: 15px;
                  justify-content: center;
                  align-items: center;
                  padding-right: 2px;
                "
              >
                <qtm-toggle-switch
                  :disabled="isMultipolygon"
                  size="medium"
                  label-position="right"
                  :checked="true"
                  style="margin-right: 30px; width: 120px; margin-left: 122px"
                  @value-changed="handleCoordinateGeometry('polygon')"
                  >{{ coordinateGeometry == 'Sexageximal' ? 'Sexagesimal' : coordinateGeometry }}</qtm-toggle-switch
                >

                <qtm-button
                  :style="{'margin-right':formatDataCustom().length > 3? '10px':''}"
                  variant="ghost"
                  color="primary"
                  size="medium"
                  @mouseenter.stop="toggleTooltip(2, true)"
                  @mouseleave.stop="toggleTooltip(2, false)"
                  :disabled="
                    (isMultipolygon?!isImportedGeometry:formatDataCustom().length == 0) || (ruleStore.isEditRule && rulesStore.initialData.status) 
                  "
                  @click-event="() => {restorePolygon(),clearHoveredRow()}"
                >
                  <qtm-icon icon="cleaning_services" >
                    <qtm-tooltip
                      size="small"
                      classes="tooltip-layer"
                      title="Clear all"
                      orientation="top"
                      tip-position="center"
                      :visible="
                        isTooltipVisible[2] &&
                        formatDataCustom().length > 0 &&
                        !ruleStore.isEditRule
                      "
                      style="position: absolute; bottom: 38px"
                    >
                    </qtm-tooltip>
                  </qtm-icon>
                </qtm-button>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <EasyDataTable
                :body-row-class-name="bodyRowClassNameFunction"
                :headers="headersGeometry"
                :items="formatDataCustom()"
                theme-color="#4c5dff"
                table-class-name="customize-table"
                header-text-direction="left"
                body-text-direction="left"
                :sort-type="sortType"
                multi-sort
                :table-height="
                  widthMaximise === '75%'
                    ? screenStore.dimanicScreenHeight(745)
                    : screenStore.dimanicScreenHeight(622)
                "
                style="z-index: 100; "
                :hide-footer="true"
                :rows-per-page="limitRowCostum"
                alternating
              >
              <template #empty-message>
                <div class="mt-xl" v-if="isMultipolygon">
                  <QtmTypography component="body-2" >The current polygon is a composite polygon and does not have a graphical representation in this table.</QtmTypography>
                  <QtmTypography component="body-2">However, it is visible on the map.</QtmTypography>
                </div>
                <div class="mt-xl" v-else>
                  <QtmTypography component="body-2" >No geometry details to display.</QtmTypography>
                  <QtmTypography component="body-2">Import a geometry or draw on the map to view details.</QtmTypography>
                </div>
              </template>
                <template #header-id="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <template #header-lat="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <template #header-lon="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>
                <template #header-actions="header">
                  <div>
                    {{ header.text }}
                  </div>
                </template>

                <template #item-lat="item">
                  <div v-if="!(hoveredRowIndex === item.id)">
                    {{ convertTextTruncate(14, item.lat) }}
                  </div>
                  <div v-else>
                    <div
                      class="qtm-input-edit-table-container"
                    >
                      <div v-if="coordinateGeometry === 'Sexageximal'">
                        <LatLonSexagInput
                          :id="item.id"
                          :isLat="true"
                          :isEdit="isEditFigure"
                          @update-value="(value:any) => updateSexagesimalPolygonValue(value, 'lat')"
                          @invalid-lat-lon="(value:boolean) => updateInvalidLatValue(value)"
                          :value="item.lat"
                        />                 
                      </div>

                      <input
                          :class="`qtm-input-edit-table ${invalidInputLat && invalidInputLat[item.id] ? 'input-text-danger' : ''}`"
                          v-if="coordinateGeometry === 'Decimal'"
                          @input="(event:any) => validateInputDecimals(event, 5, () => { selectedPolygonItem.lat = event.target.value })"
                          @blur="selectedPolygonItem.lat = limitDecimals(selectedPolygonItem.lat)"
                          v-model="selectedPolygonItem.lat"
                          placeholder="000.00000"
                        />
                    </div>
                  </div>
                </template>

                <template #item-lon="item">
                  <div v-if="!(hoveredRowIndex === item.id)">
                    {{ convertTextTruncate(14, item.lon) }} 
                  </div>
                  <div v-else>
                    <div
                      class="qtm-input-edit-table-container"
                    >
                      <div v-if="coordinateGeometry === 'Sexageximal'">
                        <LatLonSexagInput
                          :id="item.id"
                          :isLat="false"
                          :isEdit="isEditFigure"
                          @update-value="(value:any) => updateSexagesimalPolygonValue(value, 'lon')"
                          @invalid-lat-lon="(value:boolean) => updateInvalidLonValue(value)"
                          :value="item.lon"
                        />
                      </div>

                      <input
                          :class="`qtm-input-edit-table ${invalidInputLon && invalidInputLon[item.id] ? 'input-text-danger' : ''}`"
                          v-if="coordinateGeometry === 'Decimal'"
                          @input="(event:any) => validateInputDecimals(event, 5, () => { selectedPolygonItem.lon = event.target.value })"
                          @blur="selectedPolygonItem.lon = limitDecimals(selectedPolygonItem.lon)"
                          v-model="selectedPolygonItem.lon"
                          placeholder="000.00000"
                        />
                    </div>
                  </div>
                </template>

                <template #item-actions="item">
                  <div>
                    <div
                      style="
                        display: flex;
                        justify-content: end;
                        align-items: end;
                        gap: 2px;
                        position: absolute;
                        top: 7%;
                        right: 4px;
                        width: 100%;
                      "
                    >
                      <qtm-button
                      variant="ghost"
                      :disabled="(isImportedGeometry || (ruleStore.isEditRule && rulesStore.initialData.status))"
                      v-if="!(hoveredRowIndex === item.id)"
                      @click="handleShowEdit(item, 'polygon')"
                    >
                      <qtm-icon
                        icon="edit"
                        variant="outlined"
                        size="medium"
                        classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>

                    
                    <qtm-button
                      variant="ghost"
                      :disabled="(isLatInvalid || isLonInvalid) || invalidGeometry || isImportedGeometry || (ruleStore.isEditRule && rulesStore.initialData.status)"
                      v-if="(hoveredRowIndex === item.id)"
                      @click="handleSavePolygon()"
                    >
                      <qtm-icon
                      icon="save"
                      variant="outlined"
                      size="medium"
                      classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>
                    
                    <qtm-button
                      variant="ghost"
                      :disabled="formatDataCustom().length === 3 || isImportedGeometry || (ruleStore.isEditRule && rulesStore.initialData.status)"
                      v-if="!(hoveredRowIndex === item.id)"
                      @click="formatDataCustom().length === 1?restorePolygon():deletePointDataCustom(item.id)"
                    >
                      <qtm-icon
                        icon="delete"
                        variant="outlined"
                        size="medium"
                        classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>
                      
                    <qtm-button
                      variant="ghost"
                      v-if="(hoveredRowIndex === item.id)"
                      @click="handleCancelChanges()"
                    >
                      <qtm-icon
                        icon="close"
                        variant="outlined"
                        size="medium"
                        classes="text-primary-200 cursor-pointer"
                      ></qtm-icon>
                    </qtm-button>
                    </div>
                  </div>
                </template>
              </EasyDataTable>

              <div
                style="display: flex; justify-content: space-between; margin-top: 15px"
              >
              <div>
                <QtmTypography v-if="dataNameImportShp !== ''"classes="text-primary-50">Imported file name: {{dataNameImportShp}}</QtmTypography>
              </div>
              
                <qtm-button
                :style="{'margin-right':formatDataCustom().length > 3? '10px':''}"
                  variant="filled"
                  color="primary"
                  size="medium"
                  @mouseenter.stop="toggleTooltip(1, true)"
                  :disabled="disableAddCoordinates() || isImportedGeometry"
                  @mouseleave.stop="toggleTooltip(1, false)"
                  @click="addCoordinates('polygon')"
                >
                  <qtm-icon icon="add">
                    <qtm-tooltip
                      size="small"
                      classes="tooltip-layer"
                      title="Add item"
                      orientation="top"
                      tip-position="center"
                      :visible="
                        isTooltipVisible[1] && disableAddCoordinates() == false
                      "
                      style="position: absolute; bottom: 38px"
                    >
                    </qtm-tooltip>
                  </qtm-icon>
                </qtm-button>
              </div>
            </div>
            <!-- <template v-for="(coordinates, index) in mapStore.polygonFigure.cordinates" :key="index">
                <div >
                  <div v-for="(coordinate, subIndex) in coordinates" :key="subIndex" >
                      <div style="display: flex; gap: 10px;">
                          <div>
                            <QtmFormLabel component="body-1" :required="true"><span>Center Longitude</span></QtmFormLabel>
                            <QtmTextInput label="Latitude" :value="coordinate[0].toString()"  required :error="requiredInput" placeholder="Center Latitude" />
                          </div>
                          
                          <div>
                            <QtmFormLabel component="body-1" :required="true"><span>Center Latitude</span></QtmFormLabel>
                            <QtmTextInput label="Latitude" :value="coordinate[1].toString()"  required :error="requiredInput" placeholder="Center Latitude" />
                          </div>
                        </div>
                  </div>
                </div>
              </template> -->
          </div>
        </div>
        <div
          class="container-select-countries"
          v-if="menuGeometry === 'country'"
        >
          <div class="select-country">
            <VueMultiselect
              class="my-multiselect"
              v-model="selectedDataStagna"
              :options="mappedDataStanagCountrys"
              :multiple="false"
              :close-on-select="true"
              id="multiselect_stanag_code_rule_create"
              placeholder="Select country"
              @select="handleSelectCountry()"
              label="label"
              track-by="value"
              :disabled="(ruleStore.isEditRule && rulesStore.initialData.status)"
            >
            </VueMultiselect>
          </div>
        </div>
      </div>
    </template>
    <template #step6="{ stepContent, formData }">
      <div style="padding: 10px">
        <div class="my-s">
          <QtmTypography classes="font-title-custom-3"
            >Review rule settings and activate.</QtmTypography
          >
        </div>
        <qtm-divider />
        <div class="pt-s">
          <QtmTypography classes="font-step-custom">Name & Type</QtmTypography>
        </div>
        <qtm-grid :medium="3" classes="margin-left-custom">
          <div class="my-s">
            <div >
               <QtmTypography  classes="font-step-content-custom"
              >Rule name</QtmTypography
            >
            </div>
           
            <QtmTypography classes="font-step-custom break-word-style">{{
              formData.rule_name
            }}</QtmTypography>
          </div>
          <div class="my-s">
            <QtmTypography classes="font-step-content-custom"
              >Typology</QtmTypography
            >
            <QtmTypography classes="font-step-custom">{{
              formData.rule_type
            }}</QtmTypography>
          </div>
          <div class="my-s">
            <QtmTypography classes="font-step-content-custom"
              >Description</QtmTypography
            >
            <QtmTypography classes="font-step-custom break-word-style">{{
              formData.comments
            }}</QtmTypography>
          </div>
        </qtm-grid>
        <qtm-divider />
        <div class="pt-s">
          <QtmTypography classes="font-step-custom">Users</QtmTypography>
        </div>
        <div class="my-s">
          <QtmTypography classes="font-step-content-custom"
            >{{ getValuesAndIds(userStore.itemsSelectedFormRules, "user_id") }}
          </QtmTypography>
        </div>
        <qtm-divider />
        <div class="pt-s">
          <QtmTypography classes="font-step-custom">Groups</QtmTypography>
        </div>
        <div class="my-s">
          <QtmTypography classes="font-step-content-custom"
            >{{ groupFilterName() }}
          </QtmTypography>
        </div>
        <qtm-divider />
        <div class="pt-s">
          <QtmTypography classes="font-step-custom">Time & Mode</QtmTypography>
        </div>
        <qtm-grid :medium="3" classes="margin-left-custom">
          <div>
            <div class="my-s">
              <QtmTypography classes="font-step-content-custom"
                >Mission</QtmTypography
              >
              <QtmTypography classes="font-step-custom">{{
                getValues(formData.mission_id)
              }}</QtmTypography>
            </div>
            <div class="my-s">
              <QtmTypography classes="font-step-content-custom"
                >Acquisition mode</QtmTypography
              >
              <QtmTypography classes="font-step-custom">{{
                getValues(formData.acquisition_mode_id)
              }}</QtmTypography>
            </div>
          </div>
          <div>
            <div class="my-s">
              <QtmTypography classes="font-step-content-custom"
                >Satellite</QtmTypography
              >
              <QtmTypography classes="font-step-custom">{{
                getValues(formData.satellite_id)
              }}</QtmTypography>
            </div>
            <div class="my-s">
              <QtmTypography classes="font-step-content-custom"
                >Validity time</QtmTypography
              >
              <QtmTypography classes="font-step-custom"
                >{{
                  convertFormatDateDDmmyyHHmm(
                    formData.validity_start_time
                  )
                }} - {{
                  convertFormatDateDDmmyyHHmm(
                    formData.validity_end_time
                  )
                }}</QtmTypography
              >
            </div>
          </div>
          <div>
            <div class="my-s">
              <QtmTypography classes="font-step-content-custom"
                >Sensor Type</QtmTypography
              >
              <QtmTypography classes="font-step-custom">{{
                getValues(formData.sensor_type_id)
              }}</QtmTypography>
            </div>
            <div class="my-s">
              <QtmTypography classes="font-step-content-custom"
                >Sensing time</QtmTypography
              >
              <QtmTypography classes="font-step-custom"
                >{{
                  convertFormatDateDDmmyyHHmm(
                    formData.sensing_start_time
                  )
                }} - {{
                  convertFormatDateDDmmyyHHmm(formData.sensing_end_time)
                }}
              </QtmTypography>
            </div>
          </div>
        </qtm-grid>
        <qtm-divider />
        <div class="pt-s">
          <QtmTypography classes="font-step-custom">Geometry</QtmTypography>
        </div>
        <div class="my-s">
          <QtmTypography classes="font-step-content-custom">{{
            typeGeometryName()
          }}</QtmTypography>
        </div>

        <qtm-divider />

        <div
          class="my-s"
          v-if="
            rulesStore.initialData === null ||
            rulesStore.initialData === undefined ||
            rulesStore.initialData!.isCloning === true
          "
        >
          <qtm-checkbox
            :checked="activeRuleNew"
            @change="(e) => (activeRuleNew = e.target.checked)"
          >
            <div>
              <qtm-typography>Activate rule</qtm-typography>
              <qtm-typography component="caption-1" classes="text-bluegrey-500">
                to make the new rule operational
              </qtm-typography>
            </div>
          </qtm-checkbox>
        </div>
      </div>
    </template>
  </MultiStepForm>
</template>
<style scoped>
.pagination-style-custom {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  right: 170px;
}
.qtm-clear-table-polygon {
  color: white;
  font-size: 10;
  font-family: "Roboto";
}

.qtm-clear-table-polygon-container {
  width: 60px;
  float: right;
  padding-top: 10px;
}

.qtm-clear-table-polygon-text {
  position: relative;
  bottom: 5px;
  right: -4px;
}

.qtm-clear-table-polygon-border {
  border-bottom: 1px solid;
  position: relative;
  bottom: 10px;
  right: -4px;
  width: 53px;
}

.qtm-input-edit-table-container {
  /* display: flex;
  gap: 5px; */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
}

.qtm-input-edit-table {
  min-width: 139px !important;
  max-width: 139px !important;
  height: 19px;
  background-color: #131319;
  font-family: "Roboto";
  font-size: 14px;
  padding-top: 2px;
  padding-bottom: 1px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 2px;
}

.input-text-danger {
  border: 1px solid red;
}
.filter-icon {
  position: absolute !important;
  right: 33px !important;
  font-size: 18px !important;
}

.column-filtered {
  background: #4c5dff !important;
}

.column-filter {
  text-align: center !important;
  display: flex !important;
  margin-right: -8px !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 2px;
  margin-top: -4px;
  width: 26px !important;
  height: 26px !important;
}
.filters-options {
    width: 100%;
    min-width: 100%;
    min-height: 40px;
    margin-top: 5px;
    overflow-x: scroll;
    display: flex;
    gap: 10px;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #3b3d50 #1c1d26;
}
</style>
