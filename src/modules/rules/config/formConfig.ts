import { ref } from "vue";

export const defaultFormConfigRules = [
    {
        title: 'Name & Type',
        numberColumn: 1,
        allOneColumn: true,
        fields: [
            {
                id:1,
                type:'twoColumn',
                title:'Add a rule name, typology and a description to your new rule.',
                valueForm:'',
                value:'',
                fields:[
                    {
                        name: 'rule_name',
                        title: '',
                        label: 'Rule name',
                        rightIcon: '',
                        leftIcon: '',
                        required: true,
                        disabled: false,
                        value:'',
                        valueForm:'rule_name',
                        type: 'text',
                        placeholder: 'Name',
                        extraClass:'custom-witch-input-input'
                    },
                    {
                        name: 'rule_type',
                        title: '',
                        label: 'Typology',
                        type: 'select',
                        value:'',
                        valueForm:'rule_type',
                        required: true,
                        disabled: false,
                        placeholder: 'Select option',
                        options: [
                            { label: 'Permissive', value: 'permissive' },
                            { label: 'Blocking', value: 'prohibitive' },
                            { label: 'Tracking', value: 'tracking' },
                        ],
                        extraClass : 'custom-witch-select-input'
                    }
                ],
               
            },
            {
                name: 'comments',
                title:'',
                label: 'Description',
                rightIcon:'share',
                required:true,
                disabled: false,
                leftIcon:'',
                value:'',
                type: 'textArea',
                placeholder: 'Description',
                extraClass:'custom-witch-text-area-input'
            }
           
        ]
    },
    {
        title: 'Groups',
        numberColumn: 1,
        allOneColumn: false,
        fields: [
        ]
    },
    {
        title: 'Users',
        numberColumn: 1,
        fields: [
        ]
    },
    { 
        title: 'Time & Mode',
        numberColumn: 1,
        allOneColumn: true,
        extraClass:'',
        fields: [
            {
                id:1,
                type:'twoColumn',
                title:'Define the mission details.',
                containerClass: 'container-type-mode',
                valueForm:'',
                value:'',
                fields:[
                    {
                        id:1,
                        name: 'mission_id',
                        title: '',
                        label: 'Mission',
                        disabled: false,
                        required:true,
                        type: 'multi-select',
                        containerSelectClass: 'container-select-type-mode',
                        value:'',
                        getData: true,
                        options: [
                            // { label: 'Platino 1', value: 'PLT1' },
                            // { label: 'Platino 2', value: 'PLT2' },
                        ],
                    },
                    {
                        id:2,
                        name: 'satellite_id',
                        title: '',
                        label: 'Satellite ID',
                        disabled: false,
                        type: 'multi-select',
                        containerSelectClass: 'container-select-type-mode',
                        required:true,
                        value:'',
                        getData: true,
                        options: [
                            // { label: '34567-aa', value: '34567-aa' },
                        ],
                    },
                ]
            },
            {
                id:2,
                type:'twoColumn',
                title:'',
                containerClass: 'container-type-mode',
                valueForm:'',
                value:'',
                fields: [
                    {
                        id:1,
                        name: 'sensor_type_id',
                        title: '',
                        label: 'Sensor type',
                        disabled: false,
                        required:true,
                        type: 'multi-select',
                        containerSelectClass: 'container-select-type-mode',
                        value:'',
                        getData: true,
                        options: [
                            // { label: 'SAR', value: 'SAR' },
                        ],
                    },
                    {
                        id:2,
                        name: 'acquisition_mode_id',
                        title: '',
                        label: 'Acquisition mode',
                        disabled: false,
                        type: 'multi-select',
                        containerSelectClass: 'container-select-type-mode',
                        required:true,
                        value:'',
                        getData: true,
                        options: [
                            // { label: 'Spotlight', value: 'spotlight' },
                            // { label: 'Stripmap', value: 'stripmap' },
                        ],
                    },
                ]
            },
            {
                id:3,
                type:'twoColumn',
                title:'',
                containerClass: 'container-type-mode flex-column',
                valueForm:'',
                value:'',
                
                fields:[
                    {
                        id:1,
                        type:'dateFromTo',
                        title:'Validity time <span class="text-danger">*<span>',
                        required:false,
                        valueForm:'',
                        value:'',
                        dateOptions:[
                            {
                                id:1,
                                title:'',
                                label:'From',
                                value:'',
                                valueForm:'validity_start_time',
                                name:'validity_start_time',
                                isValidAlertForm:true,
                                isValidAlertIntervalForm:true,
                                intervalGroup: 'validity',
                                intervalOption: 'start',
                                extraClass:'qtm-dropdown qtm-dropdown-select',
                                disabled: false,
                                required:false,
                                minDate: true,
                            },
                            {
                                id:2,
                                title:'',
                                label:'To',
                                value:'',
                                valueForm:'validity_end_time',
                                name:'validity_end_time',
                                isValidAlertForm:true,
                                isValidAlertIntervalForm:true,
                                intervalGroup: 'validity',
                                intervalOption: 'end',
                                extraClass:'qtm-dropdown qtm-dropdown-select',
                                disabled: false,
                                required:false,
                                minDate: true,
                            }
                        ],
                    },
                    {
                        id:2,
                        type:'dateFromTo',
                        title:'Sensing time <span class="text-danger">*<span>',
                        required:false,
                        valueForm:'',
                        value:'',
                        
                        dateOptions:[
                            {
                                id:1,
                                title:'',
                                label:'From',
                                value:'',
                                valueForm:'sensing_start_time',
                                name:'sensing_start_time',
                                isValidAlertForm:true,
                                isValidAlertIntervalForm:true,
                                intervalGroup: 'sensing',
                                intervalOption: 'start',
                                extraClass:'qtm-dropdown qtm-dropdown-select',
                                disabled: false,
                                required:false,
                                minDate: false,

                            },
                            {
                                id:2,
                                title:'',
                                label:'To',
                                value:'',
                                valueForm:'sensing_end_time',
                                name:'sensing_end_time',
                                isValidAlertForm:true,
                                isValidAlertIntervalForm:true,
                                intervalGroup: 'sensing',
                                intervalOption: 'end',
                                extraClass:'qtm-dropdown qtm-dropdown-select',
                                disabled: false,
                                required:false,
                                minDate: true,
                            }
                        ],
                    }
                ],
               
            }
        ]
    },
    {
    
        title: 'Geometry',
        numberColumn: 1,
        fields: [ 
          
           ]
    },
    {
        title: 'Recap',
        numberColumn: 1,
        fields: [ 
          
           ]
    }
]

export const validEditFormConfigRules = (clear=false)  => {
    // Name & Type
    let nameAndTypeConfig = formConfigRules.value.find((x:any) => x.title === 'Name & Type')?.fields;
    nameAndTypeConfig?.forEach((element:any) => {
        let twoColumnField:any = element.fields
        if(twoColumnField){
            twoColumnField.forEach((option:any) => {
                if(clear){
                    option.disabled = false
                }else{                  
                    option.disabled = true                 
                }
            });
        }else{
            //  if(clear){
            //      element.disabled = false
            //  }else{
            //      element.disabled = true
            //  }
        }

    })
    // Time & Mode
    let timeAndModeConfig = formConfigRules.value.find((x:any) => x.title === 'Time & Mode')?.fields;

    if (timeAndModeConfig) {
        
        timeAndModeConfig?.forEach((element:any) => {
            
            let twoColumnField:any = element.fields
            if(twoColumnField){
                
                twoColumnField?.forEach((option:any) => {
                    if(clear){
                        option.disabled = false
                    }else{
                        if(option.valueForm != 'validity_end_time' ){
                            option.disabled = true
                        }
                        if(option.name == 'satellite_id' || option.name == 'sensor_type_id' || option.name == 'acquisition_mode_id'){
                            option.disabled = true
                        }
                    }
                    option.dateOptions?.forEach((op:any) => {
                        if(clear){
                            op.disabled = false
                        }else{
                            if(op.valueForm != 'validity_end_time' && op.valueForm != 'sensing_end_time'){
                                op.disabled = true
                            }
                        }
                    });
                })
            }else{
                
                if(clear){
                    element.disabled = false
                }else{
                    element.disabled = true
                }
            }
        })
        // let twoColumnField:any = timeAndModeConfig.fields.find((field:any) => field.type === 'twoColumn')?.fields;
        // twoColumnField.forEach((element:any) => {
        //     element.dateOptions.forEach((option:any) => {
        //         if(clear){
        //             option.disabled = false
        //         }else{
        //             if(option.valueForm != 'validity_end_time'){
        //                 option.disabled = true
        //             }
        //         }
        //     });
        // });
    }
}

export const formConfigRules = ref([...defaultFormConfigRules]) 