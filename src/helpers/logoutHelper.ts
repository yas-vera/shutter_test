import { useRulesStore } from "@/stores/rulesStore";
import { useShcGroupsStore } from "@/stores/shcGroupsStore";
import { useUdsGroupsStore } from "@/stores/udsGroupsStore";
import { useUserStore } from "@/stores/userStore";
import { getActivePinia, type Pinia, type Store } from "pinia";
interface ExtendedPinia extends Pinia {
    _s: Map<string, Store>;
  }
  export const helperClearStores = (): Record<string | "all", () => void> => {
    const pinia = getActivePinia() as ExtendedPinia;
  
    if (!pinia) {
      throw new Error("There is no stores");
    }
  
    const resetStores: Record<string, () => void> = {};
  
    pinia._s.forEach((store, name) => {
      resetStores[name] = () => store.$reset();
    });
  
    resetStores.all = () => pinia._s.forEach((store) => store.$reset());
    return resetStores;
  };
  export const helperClearStoreLogout = () => {
    const shcGroupsStore = useShcGroupsStore()
    const udsGroupsStore = useUdsGroupsStore()
    const userStore = useUserStore()
    const ruleStore = useRulesStore()
    shcGroupsStore.restoreStates()
    udsGroupsStore.restoreStates()
    userStore.restoreStates()
    ruleStore.restoreStates()
  } 