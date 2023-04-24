<template>
  <div class="search-events" v-if="events.length > 0">
    <div class="search-events__item" v-for="event in events" :key="event.id">
      <EventCard
        class="search-events__event"
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
    </div>

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
import EventCard from "@/components/UI/EventCard.vue";
import EventModal from "@/components/calendar/event-modal/EventModal.vue";

export default {
  name: "SearchEvents",

  components: {
    EventCard,
    EventModal,
  },

  props: {
    events: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      eventModalIsOpen: false,
      currentEvent: {},
    };
  },

  computed: {},

  methods: {
    openEventModal(event) {
      this.currentEvent = event;
      this.eventModalIsOpen = true;
    },

    updateEvents() {
      this.$emit("updateEventsList");
      this.eventModalIsOpen = false;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.search-events {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  &__item {
  }

  &__event {
    ::v-deep {
      .event-card__wrapper {
        height: 100%;
        padding: var(--v-rhythm-8);
      }
    }
  }

  @include phones {
    grid-template-columns: repeat(2, 1fr);

    &__event {
      ::v-deep {
        .event-card__wrapper {
          padding: var(--v-rhythm-4);
        }
      }
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
}
</style>