<template>
  <InputLabelWrapper
    class="time-interval"
    :input="input"
    :isValid="isValid"
    v-click-outside="closeDatePicker"
  >
    <div class="time-interval__input-wrapper" @click="openDatePicker">
      <input
        class="time-interval__input"
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
      :minute-step="30"
      :hour-options="hours"
      :open="datePickerIsOpen"
      :append-to-body="false"
      :disabled="disabled"
      @input="validate"
    ></date-picker>
    <button
      type="button"
      class="clear_button"
      v-show="newValue && input.limiter !== '24:00'"
      @click="clearData"
    >
      x
    </button>

    <InputPlaceholder
      class="time-interval__placeholder"
      :class="{ 'time-interval__placeholder--active': newValue }"
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
  name: "InputTimeInterval",

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

        if (this.minMinuts > 30) {
          return ++hours;
        }
        return hours;
      }
      return 0;
    },

    minMinuts() {
      if (this.limiter) {
        return +this.limiter.slice(-2);
      }
      return 0;
    },

    hours() {
      return Array.from({ length: 24 - this.minHours }).map(
        (_, i) => i + this.minHours
      );
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
      if (this.input.limiter !== "24:00") {
        this.datePickerIsOpen = true;
      }
    },
  },

  watch: {
    newValue() {
      if (this.newValue) {
        const valueHours = this.newValue.slice(0, 2);
        const valueMinuts = this.newValue.slice(-2);

        // Что бы пользователь не смог выбрать 00 мину, если есть ограничение по времени
        if (
          +valueHours === this.minHours &&
          this.minMinuts &&
          this.minMinuts <= 30
        ) {
          this.newValue = `${valueHours}:30`;
        }

        // Решается проблема, когда сначала пользователь выбрал минуты
        if (+valueHours < this.minHours) {
          this.newValue =
            this.minHours < 10
              ? `0${this.minHours}:${valueMinuts}`
              : `${this.minHours}:${valueMinuts}`;
        }
      }
    },
  },

  mounted() {
    if (this.input.limiter === "24:00") {
      this.newValue = this.input.limiter;
      this.$emit("onChange", { data: this });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/inputTemplate.scss";

.time-interval {
  &__input-wrapper {
    position: relative;

    cursor: pointer;
  }

  &__input {
    pointer-events: none;

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
