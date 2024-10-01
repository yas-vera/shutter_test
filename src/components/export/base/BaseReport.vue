<script setup lang="ts">
import HeaderReport from './HeaderReport.vue'
import FooterReport from './FooterReport.vue'

const props = withDefaults(defineProps<{
    title: string;
    customizableTitle: string;
    currentPage: number;
    totalPages: number;
    clasification:string;
    firstPage:boolean;
}>(), {
    title: 'Rules Report',
    customizableTitle: '[Customizable export title]',
    currentPage: 1,
    totalPages: 1,
    clasification:'UNCLASSIFIED',
    firstPage:false
});
</script>

<template>
    <div class="report-base">
        <HeaderReport :title="title" :customizable-title="customizableTitle" :first-page="firstPage" />

        <slot name="content"></slot>

        <FooterReport :current-page="currentPage" :total-pages="totalPages" :clasifitacion-lvl="clasification" />
    </div>
</template>

<style scoped>
.report-base {
    width: 795px;
    height: 1036px;
    position: relative;
    background: white
}
</style>
