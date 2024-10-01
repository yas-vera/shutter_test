import { useLayerStore } from "@/stores/layerStore";
import { ref } from "vue";
 
export const formContentRules = ref([
    {
        id:1,
        type:'input',
        title:'Rule',
        inputType:'text',
        Label:'Rule name',
        valueForm:'rule_name',
        placeholder:'Name of the rule',
        width:'336px',
        right: '30px',
        options:[],
        column: 1
    },
    {
        id:2,
        type:'select',
        title:'',
        Label:'Status',
        valueForm:'status',
        placeholder:'Select option',
        width:'160px',
        right: '16px',
        column: 1,
        options:[
            {
                label:'Active',
                value:'active'
            },
            {
                label:'Saved',
                value:'saved'
            },
            {
                label:'Cancelled',
                value:'cancelled'
            },
            {
                label:'Expired',
                value:'expired'
            },
            {
                label:'Suspended',
                value:'suspended'
            }
        ]
    },
    {
        id:3,
        type:'select',
        title:'',
        Label:'Typology',
        valueForm:'rule_type',
        placeholder:'Select option',
        width:'160px',
        right: '60px',
        column: 1,
        options:[
            {
            label:'Permissive',
            value:'permissive'
            },
            { 
            label:'Blocking',
            value:'prohibitive'
            },
            {
                label:'Tracking',
                value:'tracking'
                }]
    },
    {
        id:4,
        type:'multi-select',
        title:'Mission',
        Label:'Mission & Sensor',
        valueForm:'mission_id',
        placeholder:'Select option',
        width:'336px',
        column: 1,
        right: '16px',
        getData: true,
        options:[ 
            
        ]
    },
    {
        id:5,
        type:'multi-select',
        title:'',
        Label:'Acquisition mode',
        valueForm:'acquisition_mode_id',
        placeholder:'Select option',
        width:'165px',
        right: '16px',
        column: 1,
        getData: true,
        options:[
        ]
    },
    {
        id:11,
        type:'select-custom-area',
        title:'',
        Label:'Acquisition area',
        placeholder:'Select option',
        valueForm:'area',
        width:'336px',
        column: 1,
        options:[]
    },
    // {
    //     id:12,
    //     type:'checkbox',
    //     title:'',
    //     Label:'Show only applied rules',
    //     valueForm:'',
    //     width:'160px',
    //     left: '366px',
    //     column: 2,
    //     options:[]
    // },
    {
        id:6,
        type:'dateFromTo',
        title:'Time validity',
        valueForm:'',
        width:'336px',
        column: 3,
        right: '30px',
        dateOptions:[
            {
                id:1,
                title:'',
                label:'From',
                valueForm:'validity_start_time',
                placeholder:'yyyy/mm/dd',
                width:'160px',
            },
            {
                id:2,
                title:'',
                label:'To',
                valueForm:'validity_end_time',
                placeholder:'yyyy/mm/dd',
                width:'160px',
            }
        ],
       
    },
    {
        id:7,
        type:'dateFromTo',
        title:'Sensing time',
        valueForm:'',
        width:'336px',
        right: '60px',
        column: 3,
        dateOptions:[
            {
                id:1,
                title:'',
                label:'From',
                valueForm:'sensing_start_time',
                placeholder:'yyyy/mm/dd',
                width:'160px',
            },
            {
                id:2,
                title:'',
                label:'To',
                valueForm:'sensing_end_time',
                placeholder:'yyyy/mm/dd',
                width:'160px',
            }
        ],
       
    },
    {
        id:8,
        type:'multi-select',
        title:'Application to users',
        Label:'UDS Groups',
        valueForm:'group_uds',
        placeholder:'Select option',
        width:'160px',
        right: '16px',
        getData: true,
        column: 3,
        options:[]
    },
    {
        id:9,
        type:'multi-select',
        title:'',
        Label:'SHC Groups',
        valueForm:'group_shc',
        placeholder:'Select option',
        width:'160px',
        right: '16px',
        getData: true,
        column: 3,
        options:[
        ]
    },
    {
        id:10,
        type:'multi-select',
        title:'',
        Label:'Users',
        valueForm:'user',
        placeholder:'Select option',
        width:'160px',
        getData: true,
        column: 3,
        options:[
        ]
    }
])  