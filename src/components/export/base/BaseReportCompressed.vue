<script setup lang="ts">
import HeaderCompressed from './HeaderCompressed.vue';
import FooterCompressed from './FooterCompressed.vue'
import HeaderReport from './HeaderReport.vue';

const props = withDefaults(defineProps<{
    title: string;
    customizableTitle: string;
    currentPage: number;
    totalPages: number;
    clasification:string;
    firstPage:boolean;
    disableLineFooter:boolean;
}>(), {
    title: 'Rules Report',
    customizableTitle: '[Customizable export title]',
    currentPage: 1,
    totalPages: 1,
    clasification:'UNCLASSIFIED',
    firstPage:false,
    disableLineFooter: false
});

</script>

<template>
    <div class="report-base">
        <HeaderCompressed :title="title" :customizable-title="customizableTitle" :first-page="firstPage" />
        <slot name="content"></slot>

        <FooterCompressed :current-page="currentPage" :total-pages="totalPages" :clasifitacion-lvl="clasification"  :disable-line-footer="disableLineFooter" />
    </div>
</template>

<style scoped>
.report-base {
    width: 1052px;
    height: 793px;
    position: relative;
    background: white;
}
</style>
