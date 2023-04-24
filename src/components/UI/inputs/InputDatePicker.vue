<template>
  <InputLabelWrapper :input="input" :isValid="isValid">
    <imask-input
      placeholder=" "
      :name="input.name"
      :required="input.required"
      :mask="Date"
      :autocomplete="input.autocomplete || 'off'"
      :min="input.fromDate || new Date(1900, 0, 1)"
      :max="input.toDate || null"
      v-model="newValue"
      @input="validate"
    />
    <!-- :lazy="false" - для ввода по маске -->
    <date-picker
      v-model="newValue"
      width="500"
      format="DD.MM.YYYY"
      valueType="format"
      :append-to-body="false"
      :inputAttr="{ name: '' }"
      @input="validate"
      :default-value="new Date()"
      :disabled-date="disabledDate"
    ></date-picker>
    <button
      type="button"
      class="clear_button"
      v-show="newValue"
      @click="clearData"
    >
      x
    </button>

    <InputPlaceholder :input="input" />
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import "../../../assets/styles/plugins/datepicker/index.scss";
import { IMaskComponent } from "vue-imask";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
import { inputMixin } from "./assets/inputMixin";
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";

export default {
  name: "InputDatePicker",
  mixins: [inputMixin],
  props: {
    input: Object,
  },
  components: {
    DatePicker,
    "imask-input": IMaskComponent,
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },
  data() {
    return {
      newValue: this.input.defaultValue,
      reg: {
        tel: /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/,
        email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        date: /^\d{2}[./-]\d{2}[./-]\d{4}$/,
      },
    };
  },
  methods: {
    disabledDate(date) {
      if (this.input.fromDate) {
        const today = this.input.fromDate;
        today.setHours(0, 0, 0, 0);

        return date < today;
      } else if (this.input.toDate) {
        const today = this.input.toDate;
        today.setHours(0, 0, 0, 0);

        return date > today;
      } else {
        return false;
      }
    },

    clearData() {
      this.newValue = "";
      this.$emit("onChange", { data: "" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";

// дата
.clear_button {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 24px;
  height: 24px;
  border: none;
  background-color: #fff;
  opacity: 0;
  transition: 0.3s opacity ease;
  cursor: pointer;

  .input_container:hover & {
    opacity: 1;
  }
}

::v-deep {
  .mx-calendar {
    width: 100%;
  }
}
</style>