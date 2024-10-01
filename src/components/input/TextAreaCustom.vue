<template>
  <textarea
    :id="inputId"
    :class="extraClass"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue"
    @input="handleInput"
    ref="textareaRef"
    :style="{ minHeight: minHeigth, maxHeight: maxHeigth }"
  ></textarea>
</template>

<script lang="ts">
export default {
  name: 'TextAreaCustom',
  props: {
    inputId: {
      type: String,
      required: true,
    },
    extraClass: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: '',
    },
    minHeigth: {
      type: String,
      default: '170px',
    },
    maxHeigth: {
      type: String,
      default: '170px',
    },
  },
  methods: {
    handleInput(event:any) {
      this.$emit('update:modelValue', event.target.value);
      this.adjustTextareaHeight();
    },
    adjustTextareaHeight() {
      const textarea :any = this.$refs.textareaRef;
      textarea.style.height = 'auto';
      let newHeight = textarea.scrollHeight;
      const minHeight = this.minHeigth;  
      const maxHeight = this.maxHeigth;
      if (newHeight < minHeight) {
        newHeight = minHeight;
      } else if (newHeight > maxHeight) {
        newHeight = maxHeight;
      }
      textarea.style.height = newHeight + 'px';
    }
  },
  mounted() {
    this.adjustTextareaHeight();
  }
};
</script>

<style scoped>
textarea {
  width: 100%;
  box-sizing: border-box;
  resize: none;
  overflow-y: auto;
  scrollbar-width: thin !important;
  scrollbar-color: #3b3d50 #1c1d26 !important;
  background-color: #000;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  padding: 15px 8px;
  border: 1px solid #797d9c;
  color: #f7f7f9;
}

textarea::placeholder {
  color: #797D9C !important;
}

textarea:disabled {
  background-color: #252733;
  color: #797d9c;
  cursor: not-allowed;
}

textarea:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

textarea:focus {
  border: 1px solid #4c5dff !important; 
  outline: none; 
}
</style>
