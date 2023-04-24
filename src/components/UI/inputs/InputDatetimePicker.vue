<template>
  <InputLabelWrapper
    :input="input"
    :isValid="isValid"
    v-click-outside="closeDatePicker"
  >
    <input
      placeholder=" "
      :name="input.name"
      :required="input.required"
      v-model="status"
      :autocomplete="'off'"
      @input="validate"
      @focus="onfocus"
    />
    <!-- :lazy="false" - для ввода по маске -->
    <date-picker
      v-model="newValue"
      type="datetime"
      format="DD.MM.YYYY HH:mm"
      :lang="lang"
      :append-to-body="false"
      @input="validate"
      :default-value="this.input.defaultValue"
      :disabled-date="disabledDate"
      :disabled-time="disabledTime"
      :open="openDatePicker"
    ></date-picker>
    <!-- :disabled-time="disabledTime" -->
    <button
      type="button"
      class="clear_button"
      v-show="newValue"
      @click="
        clearData();
        validate();
      "
    >
      x
    </button>

    <InputPlaceholder :input="input" />
    <InputErrors :errors="this.errors" />
  </InputLabelWrapper>
</template>

<script>
import "../../../assets/styles/plugins/datepicker/index.scss";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
import { inputMixin } from "./assets/inputMixin";
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";

export default {
  name: "InputDateTimePicker",
  mixins: [inputMixin],
  props: {
    input: Object,
  },
  components: {
    DatePicker,
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },
  data() {
    return {
      openDatePicker: false,
      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      statusProxy: null,
      newValue: this.input.defaultValue,
      reg: {
        tel: /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/,
        email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        date: /^\d{2}[./-]\d{2}[./-]\d{4}$/,
      },
    };
  },
  methods: {
    onfocus() {
      this.openDatePicker = true;
    },
    disableAfterToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    clearData() {
      this.newValue = "";
    },
    disabledDate(date) {
      this.input.name == "INCIDENT_DATE"
        ? this.disableAfterToday()
        : () => false;

      if (this.input.fromDate) {
        let newDate = new Date(this.input.fromDate);
        newDate.setHours(0, 0, 0, 0);

        return date < newDate;
      } else {
        return false;
      }
    },
    disabledTime(date) {
      if (this.input.fromDate) {
        return date.getTime() < this.input.fromDate.getTime();
      } else {
        return false;
      }
    },

    closeDatePicker() {
      this.openDatePicker = false;
    },
  },
  computed: {
    status: {
      get() {
        if (!this.newValue) return "";
        const dat = new Date(this.newValue);
        const date = dat.toLocaleDateString("ru-RU");
        const time = dat.toLocaleTimeString("ru-RU", {
          hour: "numeric",
          minute: "numeric",
        });
        return `${date} ${time}`;
      },
      set(val) {
        this.statusProxy = val;
      },
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
</style>