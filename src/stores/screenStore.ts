import { defineStore } from 'pinia';

export const useScreenStore = defineStore('screen', {
  state: () => ({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  }),
  actions: {
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
    },
    updateScreenHeight() {
      this.screenHeight = window.innerHeight;
    },
    dimanicScreenHeight(value: number) {
      return this.screenHeight - value
    },
    dimanicScreenWidth(value: number) {
      return this.screenWidth - value
    },
    widthResponsive(value: number) {
      return this.screenWidth > value
    }
  },
});
