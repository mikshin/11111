<template>
  <!-- !TODO Логика взята из календаря событий. Переписать и там и тут. -->
  <div class="my-calendar-widget-events">
    <ul class="my-calendar-widget-events__list" v-if="listEvents.length > 0">
      <li
        class="my-calendar-widget-events__event my-calendar-widget-event"
        v-for="item in listEvents"
        :key="item.id"
        @click="openEventModal(item)"
      >
        <div class="my-calendar-widget-event__time">
          {{ item.start ? item.start : "--:--" }} -
          {{ item.end ? item.end : "--:--" }}
        </div>
        <div class="my-calendar-widget-event__info">
          <span class="my-calendar-widget-event__title" v-if="item.name">{{
            item.name
          }}</span>
          <span class="my-calendar-widget-event__place" v-if="item.room">{{
            item.room
          }}</span>
        </div>
      </li>
    </ul>

    <span class="my-calendar-widget-events__text-default" v-else
      >На выбранную дату событий нет</span
    >

    <button
      class="my-calendar-widget-events__add-btn primary-btn"
      @click="addModalIsOpen = true"
    >
      Создать событие
    </button>

    <transition name="fade">
      <EventModal
        class="my-calendar-widget-events__modal"
        :isVisible="eventModalIsOpen"
        :eventId="currentEvent.id || ''"
        @onClose="eventModalIsOpen = false"
        @updataEventList="updataEventList"
      />
    </transition>

    <transition name="fade">
      <AddEvent
        class="my-calendar-widget-events__add-event"
        :isVisible="addModalIsOpen"
        @onClose="addModalIsOpen = false"
        @updataEventList="updataEventList"
      />
    </transition>
  </div>
</template>

<script>
import EventModal from "@/components/calendar/event-modal/EventModal.vue";
import AddEvent from "@/components/calendar/add-event-modal/AddEvent.vue";

export default {
  name: "MyCalendarWidgetEvents",

  components: {
    EventModal,
    AddEvent,
  },

  props: {
    listEvents: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      eventModalIsOpen: false,
      currentEvent: "",
      addModalIsOpen: false,
    };
  },

  computed: {},

  methods: {
    openEventModal(event) {
      this.currentEvent = event;
      this.eventModalIsOpen = true;
    },

    updataEventList() {
      this.$emit("updateEventsList");
      this.eventModalIsOpen = false;
      this.addModalIsOpen = false;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.my-calendar-widget-events {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--v-rhythm-8);

  &__list {
    width: 100%;
    height: 292px;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
  }

  &__event {
  }

  &__text-default {
    @extend .body-1;
    color: var(--gray900);
  }

  &__add-btn {
    width: 100%;
  }
}
.my-calendar-widget-event {
  display: flex;
  gap: var(--v-rhythm-3);

  cursor: pointer;
  @include transition(opacity);

  @include hover {
    .my-calendar-widget-event__title {
      color: var(--red900);
    }
  }

  &:active {
    opacity: var(--active-opacity);
  }

  &__time {
    flex-shrink: 0;

    @extend .body-1;
    color: var(--gray500);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__title {
    @extend .body-1;
    color: var(--gray900);
  }

  &__place {
    @extend .caption-1;
    color: var(--gray500);
  }
}
</style>