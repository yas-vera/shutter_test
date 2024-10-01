import { useLayerStore } from "@/stores/layerStore"


export const defaultLayer = [
    {
        id: 'CustomLayerCapitalCities',
        label: 'Capital cities',
        icon: new URL('@/assets/icons/flag_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerCapitalCities');
          }
    },
    {
        id: 'CustomLayerCities',
        label: 'Cities',
        icon: new URL('@/assets/icons/flag_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerCities');
          }
    },
    {
        id: 'CustomLayerAiports',
        label: 'Airports',
        icon: new URL('@/assets/icons/airpot_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerAiports')
        }
    },
    {
        id: 'CustomLayerPorts',
        label: 'Ports',
        icon: new URL('@/assets/icons/port_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerPorts')
        }
    },
    {
        id: 'CustomLayerOilPlatforms',
        label: 'Oil platforms',
        icon: new URL('@/assets/icons/oil_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerOilPlatforms')
        }
    },
    {
        id: 'CustomLayerPumpingInfraestructures',
        label: 'Pumping infrastructures',
        icon: new URL('@/assets/icons/gas_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerPumpingInfraestructures')
        }
    },
    {
        id: 'CustomLayerMiningSites',
        label: 'Mining sites',
        icon: new URL('@/assets/icons/diamond_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerMiningSites')
        }
    },
    {
        id: 'CustomLayerNuclearPowerPlants',
        label: 'Nuclear power plants',
        icon: new URL('@/assets/icons/bolt_icon.svg', import.meta.url).href,
        action: () => {
            const layerStore = useLayerStore();
            layerStore.handleListLayers('CustomLayerNuclearPowerPlants')
        }
    }
]

export const rulesStatus = [
    {
        id:'saved_rule_status',
        label:'Saved',
        icon: new URL('@/assets/icons/rule_saved.png', import.meta.url).href
    },
    {
        id:'suspended_rule_status',
        label:'Suspended',
        icon: new URL('@/assets/icons/rule_suspended.png', import.meta.url).href
    },
    {
        id:'expired_rule_status',
        label:'Expired',
        icon: new URL('@/assets/icons/rule_expired.png', import.meta.url).href
    }
]
