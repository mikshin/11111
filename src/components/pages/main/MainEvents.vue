<template>
  <div class="main-events" :class="{ loading: isLoading }">
    <div class="main-events__title">{{ name }}</div>
    <ul class="main-events__list" v-if="events.length > 0">
      <li class="main-events__item" v-for="event in events" :key="event.id">
        <EventCard
          class="main-events__event"
          :id="event.id"
          :dateTime="{
            day: event.day,
            month: event.month,
            timeList: [event.start, event.end],
          }"
          :title="event.name"
          :officeNumber="event.office"
          :meetingRoomNumber="event.room"
          :otherPlace="event.otherPlace"
          @eventClick="openEventModal"
        />
      </li>
    </ul>

    <span class="main-events__text-default" v-else
      >Нет доступных мероприятий</span
    >

    <router-link class="main-events__link primary-btn" :to="'/calendar'"
      >Все мероприятия</router-link
    >

    <transition name="fade">
      <EventModal
        class="main-events__modal"
        :isVisible="eventModalIsOpen"
        :eventId="currentEvent.id || ''"
        @onClose="eventModalIsOpen = false"
        @updataEventList="updateEvents"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import EventCard from "@/components/UI/EventCard.vue";
import EventModal from "@/components/calendar/event-modal/EventModal.vue";

export default {
  name: "MainEvents",

  components: {
    EventCard,
    EventModal,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      events: [],

      eventModalIsOpen: false,
      currentEvent: {},
    };
  },

  computed: {},

  methods: {
    async getEvents() {
      try {
        this.isLoading = true;
        this.events = [];
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventListMainVidget`,
        });

        this.events = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    openEventModal(event) {
      this.currentEvent = event;
      this.eventModalIsOpen = true;
    },

    updateEvents() {
      this.getEvents();
      this.eventModalIsOpen = false;
    },
  },

  watch: {},

  mounted() {
    this.getEvents();
  },
};
</script>

<style scoped lang="scss">
.main-events {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--v-rhythm-6);

  &__title {
    @extend .h1;
    color: var(--gray500);
  }

  &__list {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--v-rhythm-4);

    padding: var(--v-rhythm-4);

    background-color: var(--white900);
    box-shadow: var(--boxShadowList);
  }

  &__item {
  }

  &__event {
  }

  &__text-default {
    @extend .h3;
    color: var(--gray300);
  }

  &__link {
  }

  @include phones {
    &__list {
      grid-template-columns: 1fr;
    }
  }
}
</style>