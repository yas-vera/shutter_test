<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
const props = defineProps<{ excludeClass?: string | null  }>();
const containerRefClickourSide = ref<HTMLElement | null>(null);
const emit = defineEmits();
const handleClickOutside = (event: MouseEvent) => {
    let target = event.target as HTMLElement;
    while (target) {
        if (props.excludeClass && target.classList && target.classList.contains(props.excludeClass)) {
            return;
        }
        target = target.parentElement as HTMLElement;
    }
    if (containerRefClickourSide.value && !containerRefClickourSide.value.contains(event.target as Node)) {
        emit('clickoutside');
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
    <span  ref="containerRefClickourSide">
        <slot></slot>
    </span >
</template>
