import { useRulesStore } from "@/stores/rulesStore";
import { ref, watch } from "vue";

export const usePosition = (componentName: string) => {
    const store = useRulesStore();
    
    const componentWidth = 225; 
    const horizontalGap = 35; 
    
    const leftSize = ref<string>('0px');
    
    const calculateLeftPosition = () => {
      const currentPosition = store.minimizeItems.indexOf(componentName) + 1;
      const totalComponents = store.minimizeItems.length;
  
      const totalWidth = totalComponents * (componentWidth + horizontalGap) - horizontalGap;
      const windowWidth = window.innerWidth;
  
      const centerOffset = (windowWidth - totalWidth) / 2;
      const leftPosition = centerOffset + (currentPosition - 1) * (componentWidth + horizontalGap);
      return `${leftPosition}px`;
    };
  
    const updateLeftPosition = () => {
      leftSize.value = calculateLeftPosition();
    };
  
    watch(() => store.minimizeItems, () => {
      updateLeftPosition();
    }, { deep: true });
  
    return {
      leftSize,
      updateLeftPosition,
    };
  };
