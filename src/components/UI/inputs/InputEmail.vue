<template>
  <InputLabelWrapper :input="input" :isValid="isValid">
    <input
      type="email"
      placeholder=" "
      :name="input.name"
      :required="input.required"
      @input="validate"
      v-model="newValue"
      :autocomplete="input.autocomplete"
    />

    <InputPlaceholder :input="input" />
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import { inputMixin } from "./assets/inputMixin";
export default {
  name: "inputEmail",

  mixins: [inputMixin],

  props: {
    input: Object,
  },

  components: {
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },

  data() {
    return {
      newValue: null,
      reg: {
        tel: /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/,
        email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        date: /^\d{2}[./-]\d{2}[./-]\d{4}$/,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";
</style>
