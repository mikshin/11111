<template>
  <InputLabelWrapper :input="input" :isValid="isValid">
    <input
      placeholder=" "
      :name="input.name"
      :required="input.required"
      type="text"
      @input="validate"
      v-model="newValue"
      :autocomplete="input.autocomplete"
      :maxlength="input.maxLength"
    />
    <InputCounter :maxLength="input.maxLength" :newValue="newValue" />

    <InputPlaceholder :input="input" />
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import InputCounter from "./assets/InputCounter.vue";
import { inputMixin } from "./assets/inputMixin";
export default {
  name: "inputText",

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
      newValue: this.input.defaultValue,
    };
  },

  computed: {
    inputLength() {
      if (this.newValue) {
        return this.newValue.length;
      }
      return 0;
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";
</style>
