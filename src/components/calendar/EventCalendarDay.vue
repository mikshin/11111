<template>
  <div class="event-calendar-day" :class="{ loading: !loadingDayIsDone }">
    <div
      class="event-calendar-day__item event-calendar-day__item--events"
      v-if="data.eventList"
    >
      <span class="event-calendar-day__item-title"
        >События
        <span class="event-calendar-day__item-title-count">{{
          `(${data.eventList.length})`
        }}</span></span
      >

      <EventsTimeline
        class="event-calendar-day__events"
        :eventsList="data.eventList"
        :date="date.setHours(0, 0, 0, 0)"
        @clickEvent="clickEvent"
      />
    </div>

    <div
      class="event-calendar-day__item event-calendar-day__item--tasks"
      v-if="data.taskList"
    >
      <span class="event-calendar-day__item-title"
        >Задачи
        <span class="event-calendar-day__item-title-count">{{
          `(${data.taskList.length})`
        }}</span></span
      >
      <DayCalendarTasks
        class="event-calendar-day__tasks"
        :listTasks="data.taskList"
        @updateTask="updateTask"
        @updataTaskList="updataTaskList"
      />
    </div>

    <div
      class="event-calendar-day__item event-calendar-day__item--birthdays"
      v-if="data.birthdayList"
    >
      <span class="event-calendar-day__item-title"
        >Дни рождения
        <span class="event-calendar-day__item-title-count">{{
          `(${data.birthdayList.length})`
        }}</span></span
      >
      <DayCalendarBDays
        class="event-calendar-day__birthdays"
        :bdays="data.birthdayList"
      />
    </div>

    <span
      class="event-calendar-day__text-default page-text-default"
      v-if="!data.eventList && !data.taskList && !data.birthdayList"
      >На текущий день событий нет</span
    >
  </div>
</template>

<script>
import EventsTimeline from "@/components/calendar/events-timeline/EventsTimeline.vue";
import DayCalendarTasks from "./dayCalendarTasks.vue";
import DayCalendarBDays from "./dayCalendarBDays.vue";

export default {
  name: "EventCalendarDay",

  components: {
    EventsTimeline,
    DayCalendarTasks,
    DayCalendarBDays,
  },

  props: {
    data: [Array, Object],
    loadingDayIsDone: Boolean,
    date: {
      type: Date,
      required: true,
    },
  },

  data() {
    return {};
  },

  methods: {
    clickEvent(e) {
      this.$emit("emmitEventClick", e);
    },

    updateTask(obj) {
      this.$emit("updateTask", obj);
    },

    updataTaskList() {
      this.$emit("updataTaskList");
    },
  },
};
</script>

<style lang="scss" scoped>
.event-calendar-day {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-rhythm-8);

  &__item {
    &--events {
      width: 100%;
    }
    &--tasks,
    &--birthdays {
      width: calc((100% - var(--v-rhythm-8)) / 2);
    }
  }

  &__item-title {
    display: block;
    margin-bottom: var(--v-rhythm-5);

    @extend .h3;
    color: var(--gray700);
  }

  &__item-title-count {
    color: var(--gray500);
  }

  &__events {
  }

  &__tasks {
  }

  &__birthdays {
  }

  &__text-default {
  }

  @include phones {
    &__item {
      &--tasks,
      &--birthdays {
        width: 100%;
      }
    }
  }
}
</style>