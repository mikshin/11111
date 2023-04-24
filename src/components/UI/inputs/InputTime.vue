<template>
  <InputLabelWrapper
    class="time"
    :input="input"
    :isValid="isValid"
    v-click-outside="closeDatePicker"
  >
    <div class="time__input-wrapper" @click="openDatePicker">
      <input
        class="time__input"
        type="text"
        v-model="newValue"
        placeholder=" "
        disabled
      />
    </div>
    <date-picker
      v-model="newValue"
      format="HH:mm"
      value-type="format"
      type="time"
      :open="datePickerIsOpen"
      :append-to-body="false"
      :disabled="disabled"
      :disabled-time="notBeforeTodayTwelveOClock"
      @input="validate"
    ></date-picker>
    <button
      type="button"
      class="clear_button"
      v-show="newValue"
      @click="clearData"
    >
      x
    </button>

    <InputPlaceholder
      class="time__placeholder"
      :class="{ 'time__placeholder--active': newValue }"
      :input="input"
    />
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
  name: "InputTime",

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
      newValue: this.input.defaultValue,
      datePickerIsOpen: false,
    };
  },

  computed: {
    limiter() {
      return this.input.limiter;
    },

    disabled() {
      return this.input.disabled;
    },

    minHours() {
      if (this.limiter) {
        let hours = +this.limiter.slice(0, 2);
        let minuts = +this.limiter.slice(-2);

        if (minuts + 1 === 59) {
          return ++hours;
        }
        return hours;
      }
      return 0;
    },

    minMinuts() {
      if (this.limiter) {
        let minuts = +this.limiter.slice(-2);
        if (minuts + 1 === 59) {
          return 0;
        }
        return minuts + 1;
      }
      return 0;
    },
  },

  methods: {
    clearData() {
      this.newValue = "";
      this.$emit("onChange", { data: "" });
      this.validate();
    },

    closeDatePicker() {
      this.datePickerIsOpen = false;
    },

    openDatePicker() {
      this.datePickerIsOpen = true;
    },

    notBeforeTodayTwelveOClock(date) {
      return (
        date <
        new Date(new Date().setHours(this.minHours, this.minMinuts, 0, 0))
      );
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";

.time {
  &__input-wrapper {
    position: relative;
    cursor: pointer;
  }
  &__input {
    &:disabled {
      color: var(--gray900);
      background-color: var(--white900);
    }
  }

  &__placeholder--active {
    top: 1px;
    left: 1px;
    width: 100%;
    height: 27px;
    padding-top: 8px;
    @extend .caption-1;
  }
}

// Нужно,т.к. в мозиле на заблокированном инпуте не работают события клика
@-moz-document url-prefix() {
  input:disabled {
    pointer-events: none;
  }
}

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
  .mx-datepicker-popup {
    width: 100%;
  }
  .mx-time {
    width: 100%;
  }
}
</style>