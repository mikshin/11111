<template>
  <div class="events-timeline">
    <div class="events-timeline__wrapper" id="events-timeline-wrapper">
      <div class="events-timeline__hours">
        <div
          class="events-timeline__hour"
          :class="{
            'events-timeline__hour--current':
              currentHours === i && datesAreEqual,
          }"
          v-for="(hour, i) in 24"
          :key="i"
          :id="`timeline-hour-${i}`"
        >
          {{ getTimeline(i--) }}
        </div>
      </div>

      <div class="events-timeline__events">
        <div class="events-timeline__columns">
          <div
            class="events-timeline__column"
            :class="{
              'events-timeline__hour--current':
                currentHours === i && datesAreEqual,
            }"
            v-for="(hour, i) in 24"
            :key="i"
          ></div>
        </div>
        <EventsTimelineEvent
          class="events-timeline__event"
          v-for="event in eventsList"
          :key="event.id"
          :id="event.id"
          :title="event.name"
          :start="event.start"
          :end="event.end"
          :office="event.office"
          :room="event.room"
          :otherPlace="event.otherPlace"
          :style="getPosition(event.start, event.end)"
          @clickEvent="clickEvent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VueScrollTo from "vue-scrollto";
import EventsTimelineEvent from "@/components/calendar/events-timeline/EventsTimelineEvent.vue";

export default {
  name: "EventsTimeline",

  components: {
    EventsTimelineEvent,
  },

  props: {
    eventsList: {
      type: Array,
      required: true,
    },

    date: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      currentHours: null,
      todaysDate: new Date().setHours(0, 0, 0, 0),
    };
  },

  computed: {
    datesAreEqual() {
      return this.todaysDate === this.date ? true : false;
    },
  },

  methods: {
    clickEvent(e) {
      this.$emit("clickEvent", e);
    },

    getTimeline(counter) {
      return counter < 10 ? `0${counter}:00` : `${counter}:00`;
    },

    getMinuts(time) {
      const hoursMinuts = time.split(":");
      const hours = +hoursMinuts[0];
      const minuts = +hoursMinuts[1];
      return hours * 60 + minuts;
    },

    getWidth(startTime, endTime) {
      const startMinut = this.getMinuts(startTime);
      const endMinut = this.getMinuts(endTime);
      return endMinut - startMinut;
    },

    getPosition(startTime, endTime) {
      return `width: ${this.getWidth(
        startTime,
        endTime
      )}px; margin-left: ${this.getMinuts(startTime)}px`;
    },

    getCurrentHours() {
      const date = new Date();
      this.currentHours = date.getHours();
    },
  },

  watch: {},

  mounted() {
    this.getCurrentHours();

    VueScrollTo.scrollTo(`#timeline-hour-${this.currentHours}`, {
      container: "#events-timeline-wrapper",
      offset: -120,
      x: true,
    });
  },
};
</script>

<style scoped lang="scss">
.events-timeline {
  width: 100%;
  padding: var(--v-rhythm-4) 0px 2px;

  background-color: var(--white900);

  &__wrapper {
    position: relative;

    max-height: 400px;

    overflow: auto;
  }

  &__hours {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;

    width: calc(24 * 60px);

    display: flex;
  }

  &__hour {
    padding-bottom: var(--v-rhythm-2);
    flex-shrink: 0;
    flex-grow: 1;

    text-align: center;
    @extend .subtitle-1;
    color: var(--gray700);

    background-color: var(--white900);

    &--current {
      color: var(--red900);

      background-color: var(--red100);
    }
  }

  &__events {
    position: relative;

    width: calc(24 * 60px);
    padding: var(--v-rhythm-2) 0;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__columns {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    display: flex;
  }

  &__column {
    position: relative;

    flex-shrink: 0;
    flex-grow: 1;

    &:not(:last-child):before {
      content: "";

      position: absolute;
      top: 0;
      right: -0.5px;
      bottom: 0;

      width: 1px;

      background-color: var(--gray200);
    }
  }

  &__event {
    position: relative;
  }
}
</style>