<template>
  <div class="divisions-events" :class="{ loading: isLoading }">
    <ul class="divisions-events__list" v-if="events.length > 0">
      <li
        class="divisions-events__item"
        v-for="event in events"
        :key="event.id"
      >
        <EventCard
          class="divisions-events__event"
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
    <router-link class="divisions-events__link primary-btn" :to="'/calendar'"
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
  name: "DivisionsEvents",

  components: {
    EventCard,
    EventModal,
  },

  props: {
    depId: {
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
          url: `/mobileapp/api/calendar/eventListDepartment?depId=${this.depId}`,
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
.divisions-events {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);

  &__list {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--v-rhythm-4);

    padding: var(--v-rhythm-4);

    background-color: var(--white900);
  }

  &__item {
  }

  &__event {
  }

  &__link {
    width: max-content;
  }

  @include phones {
    &__list {
      grid-template-columns: 1fr;
    }
  }
}
</style>