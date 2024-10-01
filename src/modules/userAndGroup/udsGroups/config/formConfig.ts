import { ref } from "vue";

export const formConfigSHC = ref<any>([
    {
        title: 'Information',
        numberColumn: 1,
        allOneColumn: true,
        fields: [
            {
                name: 'group_name',
                title: 'Add an identifier and a description to your custom SHC group.',
                label: 'Group name',
                rightIcon: '',
                value: '',
                leftIcon: '',
                required: true,
                type: 'text',
                placeholder: 'Name'
            },
            {
                name: 'description',
                title: '',
                label: 'Description',
                rightIcon: '',
                value: '',
                leftIcon: '',
                required: true,
                type: 'textArea',
                placeholder: 'Description'
            }
        ]
    },
    {
        title: 'Select dynamic users',
        numberColumn: 1,
        fields: []
    },
    {
        title: 'Select static users',
        numberColumn: 1,
        fields: []
    },
    {
        title: 'Select rules',
        numberColumn: 1,
        fields: []
    }
])
