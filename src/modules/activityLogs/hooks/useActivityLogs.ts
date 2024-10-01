import { capitalizeRowsLetter } from "@/helpers/tableHelpers";
import { useLoadStore } from "@/stores/loadStore";
import { useScreenStore } from "@/stores/screenStore";
import { useSystemStore, type LogItem } from "@/stores/systemStore";
import { computed, onMounted, ref } from "vue";
import type { ClickRowArgument, Item } from "vue3-easy-data-table";

export default function useActivityLogs() {
    const systemStore = useSystemStore();
    const screenStore = useScreenStore();
    const itemsSelected = ref<Item[]>([]);
    const singleSelected = ref<any>();
    const searchLogValue = ref<string>('');
    const loaderStore = useLoadStore();

    const cleanFileContent = (content:any) => {
       // return content.replace(/\\/g, '').replace(/\\n/g, '');
       
       return content.replace(/[^a-zA-Z0-9\s.,:;?!@#%&()\-_"'{}\[\]]+/g, '');
    };

    onMounted(async () => {
        await systemStore.getPeticion();
        await systemStore.formattedLogs();
        capitalizeRowsLetter()
    });
    const calculateMaxHeight = computed(() => {
        const maxHeight = screenStore.dimanicScreenHeight(215);
        return {
            maxHeight: `${maxHeight}px`
        };
    });

    const showRow = async (item: ClickRowArgument) => {
        singleSelected.value = item;
        await systemStore.getPeticionById(item.log_id);
        capitalizeRowsLetter()
    };

    const downloadFileLogs = async () => {
        for (const item of itemsSelected.value) {
            try {
                const response = await systemStore.downlandLogById(item.log_id);
                const cleanedResponse = cleanFileContent(response); // Limpiar el contenido
                const filename = item.log_id;
                const blob = new Blob([cleanedResponse], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error(`Error downloading log with id ${item.log_id}:`, error);
            }
        }
    };

    const searchLog = async (value:string) =>{
        searchLogValue.value = value
        loaderStore.setLoadingSearch(true);
        loaderStore.setLoadingSearch(false);
    }

    const filteredLogs = computed(() => {
        return systemStore.formattedLogsData.filter((log) => {
            return log.log_id.toLowerCase().includes(searchLogValue.value.toLowerCase());
        });
    });

    return {
        itemsSelected,
        singleSelected,
        calculateMaxHeight,
        showRow,
        downloadFileLogs,
        searchLogValue,
        searchLog,
        filteredLogs
    };
}
