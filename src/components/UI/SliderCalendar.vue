<template>
  <div class="slider-calendar">
    <button
      class="slider-calendar__btn slider-calendar__btn-prev"
      @click="changeDate(-1)"
    >
      <UserIcons class="slider-calendar__btn-icon" :iconName="'arrow-left'" />
    </button>

    <div class="slider-calendar__date" v-click-outside="closeDatePicker">
      <button
        class="slider-calendar__date-btn text-btn"
        @click="openDatePicker = true"
      >
        {{ dateLocal }}
        <span
          class="slider-calendar__date-btn-label"
          v-if="
            showLabelToday &&
            this.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
          "
          >(сегодня)</span
        >
      </button>

      <DatePicker
        class="slider-calendar__date-picker"
        :open="openDatePicker"
        @change="closeDatePicker"
        v-model="date"
        type="date"
        :append-to-body="false"
        :default-value="date"
      />
    </div>

    <button
      class="slider-calendar__btn slider-calendar__btn-next"
      @click="changeDate(1)"
    >
      <UserIcons class="slider-calendar__btn-icon" :iconName="'arrow-right'" />
    </button>
  </div>
</template>

<script>
import "@/assets/styles/plugins/datepicker/index.scss";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
export default {
  name: "SliderCalendar",

  components: {
    DatePicker,
  },

  props: {
    showLabelToday: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      count: 0,

      date: null,

      openDatePicker: false,
    };
  },

  computed: {
    dateLocal() {
      const ddMonthYear = this.date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return ddMonthYear.slice(0, -3);
    },
  },

  methods: {
    closeDatePicker() {
      this.openDatePicker = false;
    },

    changeDate(day) {
      this.date = new Date(this.date.setDate(this.date.getDate() + day));
    },

    emitDate() {
      this.$emit("emitDate", this.date);
    },
  },

  watch: {
    date() {
      this.emitDate();
    },
  },

  mounted() {},

  created() {
    this.date = new Date();
  },
};
</script>

<style scoped lang="scss">
.slider-calendar {
  position: relative;

  display: flex;
  align-items: center;
  gap: var(--v-rhythm-1);

  &__btn {
    width: 24px;
    height: 24px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    border-radius: 50%;
    border: 1px solid var(--red900);
    @include transition();

    @include hover {
      background-color: var(--red900);

      .slider-calendar__btn-icon {
        fill: var(--white900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__btn-prev {
  }

  &__btn-icon {
    width: 12px;
    height: 12px;

    fill: var(--red900);
    @include transition(fill);
  }

  &__btn-next {
  }

  &__date-btn {
    flex-wrap: wrap;
    gap: 0 var(--v-rhythm-2);
  }

  &__date-btn-label {
    color: var(--gray700);
  }

  ::v-deep {
    .mx-datepicker {
      display: block;
    }
    .mx-icon-calendar {
      display: none;
    }

    .mx-calendar-panel-month .mx-btn-icon-double-left {
      right: unset;
      left: 15px;
    }

    .mx-calendar-panel-month .mx-btn-icon-double-right {
      right: 15px;
    }

    .mx-calendar-panel-year .mx-btn-icon-double-left {
      right: unset;
      left: 15px;
    }

    .mx-calendar-panel-year .mx-btn-icon-double-right {
      right: 15px;
    }
  }
}
</style>