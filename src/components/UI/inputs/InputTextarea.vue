<template>
  <InputLabelWrapper :input="input" :isValid="isValid">
    <textarea
      :class="{ 'textarea-resizable': input.autoResize }"
      :style="{
        height: textareaHeight,
      }"
      :ref="randomId"
      placeholder=" "
      :name="input.name"
      :required="input.required"
      @input="inputHandler"
      v-model="newValue"
      :maxlength="input.maxLength"
    ></textarea>

    <InputCounter :maxLength="input.maxLength" :newValue="inputLength" />

    <InputPlaceholder :input="input" />
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputCounter from "./assets/InputCounter.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import { inputMixin } from "./assets/inputMixin";
export default {
  name: "inputTextarea",

  mixins: [inputMixin],

  props: {
    input: Object,
  },

  components: {
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
    InputCounter,
  },

  data() {
    return {
      newValue: this.getDefaultValue(),
      scrollHeight: 0,
      elementBorderSize: 0,
      textareaHeight: "auto",
    };
  },

  methods: {
    inputHandler() {
      this.validate();
    },

    updateSizes() {
      this.textareaHeight = "auto";

      this.$nextTick(() => {
        this.scrollHeight = this.textareaElement.scrollHeight;

        // Так как рамки равны, беру только верхнюю
        this.elementBorderSize = window.getComputedStyle(
          this.textareaElement
        ).borderTopWidth;

        this.updateTextareaHeight();
      });
    },

    updateTextareaHeight() {
      this.textareaHeight = `calc(${this.scrollHeight}px + (${this.elementBorderSize} * 2))`;
    },

    getDefaultValue() {
      // С бэка строки, установленные с переносом на следующу строку, приходят с символом \r - в девтулзаъ vue он не отображается. Но при изменении значений, остается только символ \n
      // Этот скрипт сразу убирает символ, чтобы он не учитывался при подсчете количества строк при наличии defaultValue
      return this.input.defaultValue
        ? this.input.defaultValue.split("\r").join("")
        : this.input.defaultValue;
    },
  },

  computed: {
    randomId() {
      return Math.random().toString(36).substr(2, 19);
    },

    textareaElement() {
      return this.$refs[this.randomId];
    },

    inputLength() {
      if (this.newValue) {
        return this.newValue.length;
      }
      return 0;
    },
    isEmpty() {
      if (this.newValue == null) {
        return false;
      } else if (Array.isArray(this.newValue)) {
        if (this.newValue.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },

  watch: {
    newValue() {
      this.updateSizes();
    },
  },

  mounted() {
    this.updateSizes();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";

textarea {
  @extend .body-2;
  transition: 0.3s border ease;
  width: 100%;
  min-height: $inputHeight;
  overflow: hidden;
  padding: 24px;
  padding-bottom: 8px;
  resize: none;
  box-sizing: border-box;
  border: 1px solid var(--gray500);
  color: var(--gray900);
  order: 3;
  height: unset;

  &:not(:placeholder-shown) {
    @include placeholderTop();
  }

  &:focus {
    @include placeholderTop();
    outline: none;
    border-color: var(--red500);
    background-color: var(--white900);
  }

  &:disabled {
    color: var(--gray500);
  }
}
</style>
