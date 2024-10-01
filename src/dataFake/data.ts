interface IuserFake {
    id:number
    roleId:number,
    rol:string,
    Name : string,
    LastName: string,
    userName: string,
    password: string,
    token: null | string
}
import {ref} from 'vue'
import type { Item } from 'vue3-easy-data-table'
 export const usersFake =[
    {
        id:1,
        roleId:1,
        rol:'operator',
        Name : 'pedro',
        LastName: 'suarez',
        userName: 'pedro',
        password: '123456',
        token: null
    },
    {
        id:2,
        roleId:2,
        rol:'maintainer',
        Name : 'fernando',
        LastName: 'sanchez',
        userName: 'fernando',
        password: '123456',
        token: null
    },
    {
        id:3,
        roleId:1,
        rol:'operator',
        Name : 'juan',
        LastName: 'perez',
        userName: 'juan',
        password: '123456',
        token: null
    },
    {
        id:4,
        roleId:2,
        rol:'maintainer',
        Name : 'pablo',
        LastName: 'ramirez',
        userName: 'pablo',
        password: '123456',
        token: null
    },
    {
        id:5,
        roleId:1,
        rol:'operator',
        Name : 'Operator',
        LastName: 'ramirez',
        userName: 'operator_user',
        password: '123456',
        token: null
    },
    {
        id:6,
        roleId:2,
        rol:'maintainer',
        Name : 'pablo',
        LastName: 'ramirez',
        userName: 'maintainer_user',
        password: '123456',
        token: null
    }
]

export const formContent = ref([
    {
        id:1,
        type:'select',
        title:'',
        Label:'Typology',
        valueForm:'tipology',
        options:[
            {
                label:'Option 1',
                value:'option-1'
            },
            {
                label:'Option 2',
                value:'option-2'
            },
            {
                label:'Option 3',
                value:'option-3'
            },
        ]
    },
    {
        id:2,
        type:'select',
        title:'',
        Label:'Mission & Sensor',
        valueForm:'missionAndSensor',
        options:[
            {
                label:'Option 1',
                value:'option-1'
            },
            {
                label:'Option 2',
                value:'option-2'
            },
            {
                label:'Option 3',
                value:'option-3'
            },
        ]
    },
    {
        id:3,
        type:'input',
        title:'',
        Label:'Acquisition area',
        valueForm:'acquisitionArea',
        options:[]
    },
    {
        id:4,
        type:'select',
        title:'',
        Label:'Acquisition mode',
        valueForm:'acquisitionMode',
        options:[
            {
                label:'Option 1',
                value:'option-1'
            },
            {
                label:'Option 2',
                value:'option-2'
            },
            {
                label:'Option 3',
                value:'option-3'
            },
        ]
    },
    {
        id:5,
        type:'dateFromTo',
        title:'Rank range',
        valueForm:'',
        dateOptions:[
            {
                id:1,
                title:'',
                label:'From',
                valueForm:'rankRangeFrom'
            },
            {
                id:2,
                title:'',
                label:'To',
                valueForm:'rankRangeTo'
            }
        ],
       
    },
    {
        id:6,
        type:'dateFromTo',
        title:'Time window validity',
        valueForm:'',
        dateOptions:[
            {
                id:1,
                title:'',
                label:'From',
                valueForm:'timeWindowValidityFrom'
            },
            {
                id:2,
                title:'',
                label:'To',
                valueForm:'timeWindowValidityTo'
            }
        ],
       
    },
    {
        id:7,
        type:'select',
        title:'',
        Label:'Application to users',
        valueForm:'applicationToUserGroups',
        options:[
            {
                label:'Option 1',
                value:'option-1'
            },
            {
                label:'Option 2',
                value:'option-2'
            },
            {
                label:'Option 3',
                value:'option-3'
            },
        ]
    },
    {
        id:8,
        type:'select',
        title:'',
        Label:'Users',
        valueForm:'users',
        options:[
            {
                label:'Option 1',
                value:'option-1'
            },
            {
                label:'Option 2',
                value:'option-2'
            },
            {
                label:'Option 3',
                value:'option-3'
            },
        ]
    }
]) 




export const exampleStep = [
    {
      title:'information',
      numberColumn:2,
      allOneColumn:true,
      fields: [
              {
                name: 'optionName',
                title:'Add an identifier and a description to your custom group.',
                label: 'Group identifier',
                type: 'select',
                options: [
                { label: 'Opción 1', value: 'option1' },
                { label: 'Opción 2', value: 'option2' },
              ]},
              {
                name: 'direction',
                title:'',
                label: 'Description',
                rightIcon:'share',
                leftIcon:'',
                type: 'textArea',
                placeholder: 'example text'
            },
             
             
              
              
      ]
    },
    {
      title:'Users',
      numberColumn:1,
      fields: [
              {
                name: 'name',
                title:'',
                label: 'Name',
                rightIcon:'',
                leftIcon:'',
                type: 'text',
                placeholder: 'example name'
            },
              {
                name: 'lastName',
                title:'',
                label: 'Last Name',
                rightIcon:'',
                leftIcon:'',
                type: 'text',
                placeholder: 'example name'
            },
              {
                name: 'optionName',
                title:'',
                label: 'Options Name',
                type: 'select',
                options: [
                { label: 'Opción 1', value: 'option1' },
                { label: 'Opción 2', value: 'option2' },
              ]},
              
              
      ]
    },
    {
      title:'Rules',
      numberColumn:1,
      fields: [
              {
                name: 'contact',
                title:'',
                label: 'Phone',
                rightIcon:'',
                leftIcon:'',
                type: 'text',
                placeholder: '3434343'
            },
  
              {
                name: 'typeContact',
                title:'',
                label: 'Type Contact',
                type: 'select',
                options: [
                { label: 'Opción 1', value: 'option1' },
                { label: 'Opción 2', value: 'option2' },
              ]},
              { name: 'email', title:'', label: 'Email', type: 'text', placeholder: 'example email' },
              
      ]
    },
    {
      title:'Recap',
      numberColumn:1,
      fields: [
              {
                name: 'contact',
                title:'',
                label: 'Phone',
                rightIcon:'',
                leftIcon:'',
                type: 'text',
                placeholder: '3434343'
            },
  
              {
                name: 'typeContact',
                title:'',
                label: 'Type Contact',
                type: 'select',
                options: [
                { label: 'Opción 1', value: 'option1' },
                { label: 'Opción 2', value: 'option2' },
              ]},
              {
                name: 'email',
                title:'',
                label: 'Email',
                type: 'text',
                placeholder: 'example email'
            },
              
      ]
    }
  ]
export const exampleStep2 = [
    {
        title: 'Type&users',
        numberColumn: 1,
        allOneColumn: false,
        fields: [
            {
                name: 'ruleTypology',
                title: '',
                label: 'Rule typology/Logic',
                required: false,
                type: 'select',
                options: [
                    { label: 'Opción 1', value: 'option1' },
                    { label: 'Opción 2', value: 'option2' },
                ]
            },
            {
                name: 'ApplicationToUsers',
                title: 'Application to users',
                label: 'UDS groups',
                required: false,
                type: 'select',
                options: [
                    { label: 'Opción 1', value: 'option1' },
                    { label: 'Opción 2', value: 'option2' },
                ]
            },
            {
                name: 'shcGroups',
                title: '',
                label: 'SHC groups',
                required: false,
                type: 'select',
                options: [
                    { label: 'Opción 1', value: 'option1' },
                    { label: 'Opción 2', value: 'option2' },
                ]
            },
            {
                name: 'users',
                title: '',
                label: 'Users',
                required: false,
                type: 'select',
                options: [
                    { label: 'Opción 1', value: 'option1' },
                    { label: 'Opción 2', value: 'option2' },
                ]
            },
            {
                name: '',
                title: 'Validity time window',
                type: 'dateFromTo',
                dateOptions: [
                    { name: 'validTimeWindowFrom', title: '', label: 'From', required: false },
                    { name: 'validTimeWindowTo', title: '', label: 'To', required: false }
                ]
            }



        ]
    },
    {
        title: 'Mission',
        numberColumn: 1,
        fields: [
            {
                name: 'ruleName',
                title: '',
                label: 'Rule Name',
                rightIcon: '',
                leftIcon: '',
                type: 'text',
                placeholder: 'Placeholder'
            },
            {
                name: 'missionSensor',
                title: '',
                label: 'Mission-Sensor',
                type: 'select',
                options: [
                    { label: 'Opción 1', value: 'option1' },
                    { label: 'Opción 2', value: 'option2' },
                ]
            },
            {
                name: 'acquisitionMode',
                title: '',
                label: 'Acquisition mode',
                type: 'select',
                options: [
                    { label: 'Opción 1', value: 'option1' },
                    { label: 'Opción 2', value: 'option2' },
                ]
            },
            {
                name: 'comments',
                title:'',
                label: 'Comments',
                rightIcon:'share',
                leftIcon:'',
                type: 'textArea',
                placeholder: 'Placeholder Value'
            }

        ]
    },
    {
        title: 'Geometry',
        numberColumn: 1,
        fields: [
            {
                name: 'contact',
                title: '',
                label: 'Phone',
                rightIcon: '',
                leftIcon: '',
                required: true,
                type: 'text',
                placeholder: '3434343'
            },

            {
                name: 'typeContact',
                title: '',
                label: 'Type Contact',
                required: true,
                type: 'select',
                options: [
                    { label: 'Opción 1', value: 'option1' },
                    { label: 'Opción 2', value: 'option2' },
                ]
            },
            {
                name: 'email',
                title: '',
                label: 'Email',
                type: 'text',
                placeholder: 'example email'
            },

        ]
    }
]

export const userItems = ref<Item[]>([
    {
      "user_id": 1,
      "username": "bob",
      "stanag_id": "FRA",
      "user_rules": [
        {
          "rule_id": 1,
          "rule_name": "My first rule",
          "rule_type": "prohibitive",
          "start_time": "2023-12-22T11:12:16.95398",
          "end_time": "2029-10-10T00:00:00",
          "area_wkt": "POLYGON ((-71.1776585052917 42.3902909739571, -71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754, -71.1775826583081 42.3903033653531, -71.1776585052917 42.3902909739571))",
          "status": "active"
        },
        {
          "rule_id": 2,
          "rule_name": "My first rule",
          "rule_type": "prohibitive",
          "start_time": "2023-12-22T11:12:16.95398",
          "end_time": "2029-10-10T00:00:00",
          "area_wkt": "POLYGON ((-71.1776585052917 42.3902909739571, -71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754, -71.1775826583081 42.3903033653531, -71.1776585052917 42.3902909739571))",
          "status": "suspended"
        },
        {
          "rule_id": 3,
          "rule_name": "My first rule",
          "rule_type": "prohibitive",
          "start_time": "2023-12-22T11:12:16.95398",
          "end_time": "2029-10-10T00:00:00",
          "area_wkt": "POLYGON ((-71.1776585052917 42.3902909739571, -71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754, -71.1775826583081 42.3903033653531, -71.1776585052917 42.3902909739571))",
          "status": "expired"
        }
      ],
      "group_uds": {
        "group_id": 3,
        "group_type": "uds",
        "group_name": "sheeps_group",
        "creation_date": "2023-11-21T17:24:20.789231",
        "stanag_id": "FRA"
      },
      "group_shcs": [],
      "group_uds_id": 3,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        },
        {
          "mission_id": "PLT2",
          "mission_name": "Platino 2"
        }
      ],
      "creation_date": "2023-11-21T17:30:21.865903"
    },
    {
      "user_id": 2,
      "username": "eric",
      "stanag_id": "BEL",
      "user_rules": [{
          "rule_id": 1,
          "rule_name": "My first rule",
          "rule_type": "prohibitive",
          "start_time": "2023-12-22T11:12:16.95398",
          "end_time": "2029-10-10T00:00:00",
          "area_wkt": "POLYGON ((-71.1776585052917 42.3902909739571, -71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754, -71.1775826583081 42.3903033653531, -71.1776585052917 42.3902909739571))",
          "status": "active"
        },
        {
          "rule_id": 2,
          "rule_name": "My first rule",
          "rule_type": "prohibitive",
          "start_time": "2023-12-22T11:12:16.95398",
          "end_time": "2029-10-10T00:00:00",
          "area_wkt": "POLYGON ((-71.1776585052917 42.3902909739571, -71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754, -71.1775826583081 42.3903033653531, -71.1776585052917 42.3902909739571))",
          "status": "active"
        },
        {
          "rule_id": 3,
          "rule_name": "My first rule",
          "rule_type": "prohibitive",
          "start_time": "2023-12-22T11:12:16.95398",
          "end_time": "2029-10-10T00:00:00",
          "area_wkt": "POLYGON ((-71.1776585052917 42.3902909739571, -71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754, -71.1775826583081 42.3903033653531, -71.1776585052917 42.3902909739571))",
          "status": "active"
        }],
      "group_uds": {
        "group_id": 5,
        "group_type": "uds",
        "group_name": "cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "BEL"
      },
      "group_shcs": [],
      "group_uds_id": 5,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        }
      ],
      "creation_date": "2023-11-21T17:32:03.694009"
    },
    {
      "user_id": 3,
      "username": "mario",
      "stanag_id": "ITA",
      "user_rules": [],
      "group_uds": {
        "group_id": 1,
        "group_type": "uds",
        "group_name": "lions_group",
        "creation_date": "2023-11-21T17:22:14.448783",
        "stanag_id": "ITA"
      },
      "group_shcs": [],
      "group_uds_id": 1,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        }
      ],
      "creation_date": "2023-11-21T17:32:55.832515"
    },
    {
      "user_id": 4,
      "username": "fabio",
      "stanag_id": "ITA",
      "user_rules": [],
      "group_uds": {
        "group_id": 1,
        "group_type": "uds",
        "group_name": "lions_group",
        "creation_date": "2023-11-21T17:22:14.448783",
        "stanag_id": "ITA"
      },
      "group_shcs": [],
      "group_uds_id": 1,
      "missions": [
        {
          "mission_id": "PLT2",
          "mission_name": "Platino 2"
        }
      ],
      "creation_date": "2023-11-21T17:33:48.582097"
    },
    {
      "user_id": 5,
      "username": "john",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [
        {
          "group_id": 6,
          "group_type": "custom",
          "group_name": "mice_group",
          "creation_date": "2023-11-21T17:25:55.517083",
          "stanag_id": "ENG"
        }
      ],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT2",
          "mission_name": "Platino 2"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    },
    {
      "user_id": 6,
      "username": "alice",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [
        {
          "group_id": 6,
          "group_type": "custom",
          "group_name": "mice_group",
          "creation_date": "2023-11-21T17:25:55.517083",
          "stanag_id": "ENG"
        },
        {
          "group_id": 7,
          "group_type": "custom",
          "group_name": "rats_group",
          "creation_date": "2023-11-21T17:37:42.668412",
          "stanag_id": "ENG"
        }
      ],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    },
    {
      "user_id": 7,
      "username": "jane",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [
        {
          "group_id": 7,
          "group_type": "custom",
          "group_name": "rats_group",
          "creation_date": "2023-11-21T17:37:42.668412",
          "stanag_id": "ENG"
        }
      ],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        },
        {
          "mission_id": "PLT2",
          "mission_name": "Platino 2"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    },
    {
      "user_id": 8,
      "username": "joe",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [
        {
          "group_id": 7,
          "group_type": "custom",
          "group_name": "rats_group",
          "creation_date": "2023-11-21T17:37:42.668412",
          "stanag_id": "ENG"
        }
      ],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    },
    {
      "user_id": 9,
      "username": "jim",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [
        {
          "group_id": 7,
          "group_type": "custom",
          "group_name": "rats_group",
          "creation_date": "2023-11-21T17:37:42.668412",
          "stanag_id": "ENG"
        }
      ],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT2",
          "mission_name": "Platino 2"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    },
    {
      "user_id": 10,
      "username": "james",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [
        {
          "group_id": 3,
          "group_type": "uds",
          "group_name": "sheeps_group",
          "creation_date": "2023-11-21T17:24:20.789231",
          "stanag_id": "FRA"
        }
      ],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    },
    {
      "user_id": 11,
      "username": "jimmy",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [
        {
          "group_id": 2,
          "group_type": "uds",
          "group_name": "tigers_group",
          "creation_date": "2023-11-21T17:24:20.789231",
          "stanag_id": "ITA"
        }
      ],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT1",
          "mission_name": "Platino 1"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    },
    {
      "user_id": 12,
      "username": "jimbo",
      "stanag_id": "ENG",
      "user_rules": [],
      "group_uds": {
        "group_id": 8,
        "group_type": "uds",
        "group_name": "english_cats_group",
        "creation_date": "2023-11-21T17:25:55.517083",
        "stanag_id": "ENG"
      },
      "group_shcs": [],
      "group_uds_id": 8,
      "missions": [
        {
          "mission_id": "PLT2",
          "mission_name": "Platino 2"
        }
      ],
      "creation_date": "2023-11-21T17:35:21.46713"
    }
  ]) 



export const udsGroupItems = ref([
    {
      "group_id": 8,
      "group_type": "uds",
      "group_name": "english_cats_group",
      "creation_date": "2023-11-21T17:25:55.517083",
      "stanag_id": "ENG",
      "users": [
        {
          "user_id": 5,
          "username": "john",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT2",
              "mission_name": "Platino 2"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        },
        {
          "user_id": 6,
          "username": "alice",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        },
        {
          "user_id": 7,
          "username": "jane",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            },
            {
              "mission_id": "PLT2",
              "mission_name": "Platino 2"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        },
        {
          "user_id": 8,
          "username": "joe",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        },
        {
          "user_id": 9,
          "username": "jim",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT2",
              "mission_name": "Platino 2"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        },
        {
          "user_id": 10,
          "username": "james",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        },
        {
          "user_id": 11,
          "username": "jimmy",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        },
        {
          "user_id": 12,
          "username": "jimbo",
          "stanag_id": "ENG",
          "missions": [
            {
              "mission_id": "PLT2",
              "mission_name": "Platino 2"
            }
          ],
          "creation_date": "2023-11-21T17:35:21.46713"
        }
      ],
      "rules": []
    },
    {
      "group_id": 7,
      "group_type": "custom",
      "group_name": "rats_group",
      "creation_date": "2023-11-21T17:37:42.668412",
      "stanag_id": "ENG",
      "users": [],
      "rules": []
    },
    {
      "group_id": 6,
      "group_type": "custom",
      "group_name": "mice_group",
      "creation_date": "2023-11-21T17:25:55.517083",
      "stanag_id": "ENG",
      "users": [],
      "rules": []
    },
    {
      "group_id": 5,
      "group_type": "uds",
      "group_name": "cats_group",
      "creation_date": "2023-11-21T17:25:55.517083",
      "stanag_id": "BEL",
      "users": [
        {
          "user_id": 2,
          "username": "eric",
          "stanag_id": "BEL",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            }
          ],
          "creation_date": "2023-11-21T17:32:03.694009"
        }
      ],
      "rules": []
    },
    {
      "group_id": 4,
      "group_type": "uds",
      "group_name": "dogs_group",
      "creation_date": "2023-11-21T17:24:20.789231",
      "stanag_id": "GER",
      "users": [],
      "rules": []
    },
    {
      "group_id": 3,
      "group_type": "uds",
      "group_name": "sheeps_group",
      "creation_date": "2023-11-21T17:24:20.789231",
      "stanag_id": "FRA",
      "users": [
        {
          "user_id": 1,
          "username": "bob",
          "stanag_id": "FRA",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            },
            {
              "mission_id": "PLT2",
              "mission_name": "Platino 2"
            }
          ],
          "creation_date": "2023-11-21T17:30:21.865903"
        }
      ],
      "rules": []
    },
    {
      "group_id": 2,
      "group_type": "uds",
      "group_name": "tigers_group",
      "creation_date": "2023-11-21T17:24:20.789231",
      "stanag_id": "ITA",
      "users": [],
      "rules": []
    },
    {
      "group_id": 1,
      "group_type": "uds",
      "group_name": "lions_group",
      "creation_date": "2023-11-21T17:22:14.448783",
      "stanag_id": "ITA",
      "users": [
        {
          "user_id": 3,
          "username": "mario",
          "stanag_id": "ITA",
          "missions": [
            {
              "mission_id": "PLT1",
              "mission_name": "Platino 1"
            }
          ],
          "creation_date": "2023-11-21T17:32:55.832515"
        },
        {
          "user_id": 4,
          "username": "fabio",
          "stanag_id": "ITA",
          "missions": [
            {
              "mission_id": "PLT2",
              "mission_name": "Platino 2"
            }
          ],
          "creation_date": "2023-11-21T17:33:48.582097"
        }
      ],
      "rules": [
        {
          "rule_id": 1,
          "rule_name": "My first rule",
          "rule_type": "prohibitive",
          "start_time": "2023-12-22T11:12:16.95398",
          "end_time": "2029-10-10T00:00:00",
          "area_wkt": "POLYGON ((-71.1776585052917 42.3902909739571, -71.1776820268866 42.3903701743239, -71.1776063012595 42.3903825660754, -71.1775826583081 42.3903033653531, -71.1776585052917 42.3902909739571))",
          "status": "active"
        }
      ]
    }
  ])

export const dataUserDetailFake = ref([
  {
    user_id:1,
    children:
    [{
      AoIID:'AoI 07',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 08',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 09',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 10',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 11',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 12',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 13',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 14',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 15',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 16',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 17',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 18',
      UserRequestID:'SR 07',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    
    ]
  },
  {
    user_id:2,
    children:
    [{
      AoIID:'AoI 22',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 23',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 24',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 25',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 26',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 27',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 28',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 29',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 30',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 31',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 32',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 33',
      UserRequestID:'SR 10',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    
    ]
  },
  {
    user_id:3,
    children:
    [{
      AoIID:'AoI 40',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 41',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 42',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 43',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 44',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 45',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 46',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 47',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 48',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 49',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 50',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 51',
      UserRequestID:'SR 11',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    
    ]
  },{
    user_id:4,
    children:
    [{
      AoIID:'AoI 61',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 62',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 63',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 64',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 65',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 66',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 67',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 68',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 69',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 71',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 72',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 73',
      UserRequestID:'SR 15',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    
    ]
  },{
    user_id:5,
    children:
    [{
      AoIID:'AoI 90',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 91',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 92',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 93',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 94',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Blocking'
    },
    {
      AoIID:'AoI 95',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 96',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 97',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 98',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 99',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 100',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    {
      AoIID:'AoI 101',
      UserRequestID:'SR 18',
      rule_id:'RID 98',
      sensing_time_start:"2024-01-18T19:15:00.000Z",
      sensing_time_end:"2024-01-18T19:15:00.000Z",
      event_time_start:"2024-01-18T19:15:00.000Z",
      event_time_end:"2024-01-18T19:15:00.000Z",
      event_type:'Tracking'
    },
    
    ]
  }
])