<template>
  <WidgetWrapper
    class="my-calendar-widget"
    :iconName="'calendar'"
    :title="name"
    id="my_calendar"
  >
    <div
      class="my-calendar-widget__content"
      :class="{ loading: isLoading }"
      ref="my_calendar"
    >
      <SliderCalendar
        class="my-calendar-widget__slider-calendar"
        @emitDate="changeDate"
      />
      <TabsNav
        class="my-calendar-widget__tabs-nav"
        :tabs="tabs"
        @changeTab="
          (e) => {
            tabsActive = e;
          }
        "
      />

      <div class="my-calendar-widget__main">
        <template v-if="tabsActive.name === 'События'">
          <MyCalendarWidgetEvents
            class="my-calendar-widget__events"
            :listEvents="events"
            @updateEventsList="update"
          />
        </template>

        <template v-else-if="tabsActive.name === 'Задачи'">
          <MyCalendarWidgetTasks
            class="my-calendar-widget__tasks"
            :listTasks="tasks"
            @updateTask="updateTask"
            @updataTaskList="update"
          />
        </template>

        <template v-else-if="tabsActive.name === 'Дни рождения'">
          <MyCalendarWidgetBirthdays
            class="my-calendar-widget__birthdays"
            :listBirthdays="birthdays"
          />
        </template>
      </div>
    </div>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import SliderCalendar from "@/components/UI/SliderCalendar.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import MyCalendarWidgetEvents from "@/components/widgets/my-calendar-widget/MyCalendarWidgetEvents.vue";
import MyCalendarWidgetTasks from "@/components/widgets/my-calendar-widget/MyCalendarWidgetTasks.vue";
import MyCalendarWidgetBirthdays from "@/components/widgets/my-calendar-widget/MyCalendarWidgetBirthdays.vue";

import { eventBus } from "@/assets/scripts/scripts.js";

export default {
  name: "MyCalendarWidget",

  components: {
    WidgetWrapper,
    SliderCalendar,
    TabsNav,
    MyCalendarWidgetEvents,
    MyCalendarWidgetTasks,
    MyCalendarWidgetBirthdays,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Мой календарь",
    },
  },

  data() {
    return {
      isLoading: false,

      dataDay: null,

      events: [],
      tasks: [],
      birthdays: [],

      date: null,

      tabsActive: {
        name: "События",
      },
    };
  },

  computed: {
    tabs() {
      return [
        {
          name: "События",
          counter: this.events.length,
        },
        {
          name: "Задачи",
          counter: this.tasks.length,
        },
        {
          name: "Дни рождения",
          counter: this.birthdays.length,
        },
      ];
    },
  },

  methods: {
    changeDate(date) {
      this.date = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    },

    async fetchDataDay() {
      try {
        this.isLoading = true;
        this.clearData();
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/calendar/eventListDay`,
          data: {
            birthdayShow: "Y",
            day: this.date.day,
            month: this.date.month,
            year: this.date.year,
          },
        });

        return response.data;
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          eventBus.$emit("#my_calendar-mounted");
        });
      }
    },

    async getDataDay() {
      const response = await this.fetchDataDay();
      if (response.eventList) this.events = response.eventList;
      if (response.taskList) this.tasks = response.taskList;
      if (response.birthdayList) this.birthdays = response.birthdayList;
    },

    updateTask(obj) {
      let task = this.tasks.find((item) => item.id === obj.taskId);

      task.status = obj.status;
    },

    clearData() {
      this.events = [];
      this.tasks = [];
      this.birthdays = [];
    },

    update() {
      this.getDataDay();
    },
  },

  watch: {
    date() {
      this.getDataDay();
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
.my-calendar-widget {
  &__content {
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);

    padding: var(--v-rhythm-6) 10px var(--v-rhythm-8);
  }

  &__slider-calendar {
    margin: 0 auto;
  }

  &__tabs-nav {
    width: 100%;
    overflow-x: auto;
    flex-shrink: 0;

    ::v-deep {
      .tabs-nav__item {
        flex-shrink: 0;
      }
    }
  }

  &__main {
    flex-basis: 100%;
    min-height: 368px;
  }

  &__events {
    height: 100%;
  }

  &__tasks {
    height: 100%;
  }

  &__birthdays {
    height: 100%;
    max-height: 368px;
    overflow-y: auto;
  }
}
</style>