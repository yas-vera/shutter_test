import { ref } from "vue";

export const formContentUser = ref([
    {
        id:1,
        type:'input',
        title:'',
        inputType:'number',
        Label:'User id',
        valueForm:'user_id',
        placeholder:'user id',
        options:[]
    },
    {
        id:2,
        type:'input',
        title:'',
        inputType:'text',
        Label:'UserName',
        valueForm:'username',
        placeholder:'username',
        options:[]
    },
    {
        id:3,
        type:'input',
        title:'',
        inputType:'number',
        Label:'Group name or id',
        valueForm:'group_uds_id',
        placeholder:'group name or id',
        options:[]
    },
    {
        id:4,
        type:'input',
        title:'',
        inputType:'text',
        Label:'Stanag id',
        valueForm:'stanag',
        placeholder:'stanag',
        options:[]
    },
    {
        id:5,
        type:'select',
        title:'',
        Label:'sort',
        valueForm:'sort',
        options:[
            {
                label:'Descending',
                value:'descending'
            },
            {
                label:'Ascending',
                value:'ascending'
            }
        ]
    },
    {
        id:6,
        type:'dateFromTo',
        title:'Insertion date',
        valueForm:'',
        dateOptions:[
            {
                id:1,
                title:'',
                label:'From',
                valueForm:'insertion_date_start'
            },
            {
                id:2,
                title:'',
                label:'To',
                valueForm:'insertion_date_end'
            }
        ],
       
    }
]) 