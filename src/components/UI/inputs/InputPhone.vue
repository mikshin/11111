<template>
  <InputLabelWrapper :input="input" :isValid="isValid">
    <imask-input
      type="tel"
      placeholder=" "
      :name="input.name"
      :required="input.required"
      @input="validate"
      mask="+{7}(000)000-00-00"
      v-model="newValue"
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
import { IMaskComponent } from "vue-imask";
export default {
  name: "inputPhone",

  mixins: [inputMixin],

  props: {
    input: Object,
  },

  components: {
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
    "imask-input": IMaskComponent,
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
