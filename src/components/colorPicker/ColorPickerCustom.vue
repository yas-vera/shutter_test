<script setup lang="ts">
import { ref, computed  } from "vue";
import { QtmIcon,QtmButton } from "@qtm/vue";
const props = defineProps<{
  label: string;
  color?: string;
  positionTooltipTop?: string; 
  positionTooltipLeft?: string;
}>();
const emits = defineEmits<{
  (e: "update", option: string): void;
}>();
const showTooltip = ref<boolean>(false);
const selectedColor = ref<string | undefined>(props.color);
const selectedColorIndex = ref<number | null | undefined>(null);
const colorLines = ref<any>([
  ["#77172e", "#692b17", "#7c4a03", "#41301d"],
  ["#0c625d", "#256377", "#1e3a5f", "#345920"],
  ["#472e5b", "#6c394f", "#532541", "#4b443a"],
]);
const toggleTooltip = (event: MouseEvent) => {
  showTooltip.value = !showTooltip.value;
  event.stopPropagation();
};
const selectColor = (color: any, index: number | undefined, event: MouseEvent) => {
  selectedColor.value = color;
  selectedColorIndex.value = index;
  showTooltip.value = false;
  emits("update", color );
  event.stopPropagation();
};

const colorPickerParent = ref<HTMLElement | null>(null);

const tooltipStyle = computed(() => {
  if (showTooltip.value && colorPickerParent.value) {
    const parentPosition = colorPickerParent.value.getBoundingClientRect();
    const topPosition = -250;
    return {
      top: `${topPosition}px`,
      left: props.positionTooltipLeft ? props.positionTooltipLeft : '-158px',
    };
  } else {
    return {
      top: '-250px',
      left: props.positionTooltipLeft ? props.positionTooltipLeft : '-158px',
    };
  }
});


</script>
<template>
  <div class="color-picker" ref="colorPickerParent">
    <div @click="toggleTooltip" ref="buttonRef"  style="margin-top: -7px;">
      <qtm-button
        variant="ghost"
        size="small"
        color="primary"
      >
        <qtm-icon icon="palette" size="medium" classes="text-primary-200"></qtm-icon>
      </qtm-button>
    </div> 
      <div
        v-if="showTooltip"
        class="color-tooltip"
        :style="tooltipStyle"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          "
        >
          <label for="" style="color: white">Select a color </label>
          <qtm-icon
            v-if="props.color"
            icon="block"
            size="medium"
            variant="outlined"
            style="color: white; padding-left: 40px;"
            @click.stop="toggleTooltip"
            @click="selectColor(undefined, undefined, $event)"
          ></qtm-icon>
          <qtm-icon
            icon="close"
            size="medium"
            variant="outlined"
            style="color: white"
            @click.stop="toggleTooltip"
          ></qtm-icon>
        </div>
          
        <div
          v-for="(line, lineIndex) in colorLines"
          :key="lineIndex"
          class="color-line"
        >
          <div
            v-for="(color, colorIndex) in line"
            :key="colorIndex"
            class="color-circle"
            @click="selectColor(color, colorIndex, $event)"
            :style="{
              backgroundColor: color,
              border:
                selectedColor === color && props.color !== undefined
                  ? '2px solid #fff'
                  : 'none',
            }"
          >
            <qtm-icon
              v-if="selectedColor === color && props.color !== undefined"
              icon="check"
              size="medium"
              classes="text-white-100"
            />
          </div>
        </div>
      </div>
  </div>
</template>
<style scoped>
.input-color-container {
  width: 25px;
  height: 25px;
  border: solid 2px #ddd;
  border-radius: 40px;
}
.color-picker {
  position: relative;
  display: inline-block;
}

.input-container {
  cursor: pointer;
}

.color-tooltip {
  position: absolute;
  width: 195px;
  height: 173px;
  display: flex;
  flex-direction: column;
  background-color: #000000;
  border: 1px solid #3a3c4f;
  padding: 10px;
  border-radius: 5px;
  z-index: 100;
}

.color-line {
  display: flex;
  justify-content: center;
}

.color-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
  align-items: center;
  display: flex;
  justify-content: center;
}


</style>
