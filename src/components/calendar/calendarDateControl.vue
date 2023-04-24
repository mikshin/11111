<template>
  <div
    class="calendar__control"
    :class="{ calendar__control__forday: activeTab.name !== 'Месяц' }"
  >
    <template v-if="activeTab.name === 'Месяц'">
      <div
        @click="goToMonth('prev')"
        class="icon icon__control icon__control_prev"
      ></div>
      <span class="calendar__control__date">{{ parseDate }}</span>
      <div
        @click="goToMonth('next')"
        class="icon icon__control icon__control_next"
      ></div>
    </template>
    <template v-else>
      <div
        @click="goToDay('prev')"
        class="icon icon__control icon__control_prev"
      ></div>
      <span class="calendar__control__date"
        >{{ parseDate }}<span>{{ ifPickedDayIsToday }}</span></span
      >
      <div
        @click="goToDay('next')"
        class="icon icon__control icon__control_next"
      ></div>
    </template>
  </div>
</template>

<script>
export default {
  name: "CalendarDateControl",
  props: {
    activeTab: Object,
    todayFullDate: Date,
  },
  methods: {
    goToMonth(direction) {
      this.$emit("emitToggleDateByMonth", direction);
    },
    goToDay(direction) {
      this.$emit("emitToggleDateByDay", direction);
    },
  },
  computed: {
    parseDate() {
      if (this.activeTab.name === "Месяц") {
        return `${this.todayFullDate.toLocaleString("ru-RU", {
          month: "long",
        })} ${this.todayFullDate.getFullYear()}`;
      } else {
        return this.todayFullDate.toLocaleString("ru-RU", {
          day: "numeric",
          month: "long",
        });
      }
    },
    ifPickedDayIsToday() {
      const today = new Date();
      const todayLocale = today.toLocaleDateString("ru-RU");
      const pickedDateLocale = this.todayFullDate.toLocaleDateString("ru-RU");
      return todayLocale == pickedDateLocale ? "(Сегодня)" : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar__control {
  display: flex;
  gap: var(--v-rhythm-3);
  align-items: center;

  &__date {
    @extend .subtitle-1;
    color: var(--red900);
    display: inline-flex;
    justify-content: center;
    text-align: center;
    > span {
      display: inline-flex;
      color: var(--gray700);
      font-weight: 400;
      background-color: transparent;
    }
  }
}
.icon {
  &__control {
    &_prev,
    &_next {
      width: 24px;
      height: 24px;
      border: 1px solid var(--red900);
      border-radius: 50%;
      background-size: 4px 7px;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    &_prev {
      background-image: url("data:image/svg+xml,%3Csvg width='4' height='7' viewBox='0 0 4 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.63246 1.50879L0.832031 3.70177L2.63246 5.89475' stroke='%23AB052D' stroke-width='1.42534' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    }
    &_next {
      background-image: url("data:image/svg+xml,%3Csvg width='4' height='7' viewBox='0 0 4 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.36754 5.49121L3.16797 3.29823L1.36754 1.10525' stroke='%23AB052D' stroke-width='1.42534' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    }
  }
}
</style>