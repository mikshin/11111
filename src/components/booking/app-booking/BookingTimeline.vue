<template>
  <div class="booking-timeline">
    <TimelineHeader class="booking-timeline__header" />
    <div class="booking-timeline__main">
      <BookingTimelineLine
        class="booking-timeline__line"
        v-for="(item, i) in bookingList"
        :key="i"
        :eventsList="item.eventList || []"
        @onDelete="onDelete"
        @onEdit="onEdit"
      />
    </div>
  </div>
</template>

<script>
import TimelineHeader from "@/components/timelines/TimelineHeader.vue";
import BookingTimelineLine from "@components/booking/app-booking/BookingTimelineLine.vue";

export default {
  name: "BookingTimeline",

  components: {
    TimelineHeader,
    BookingTimelineLine,
  },

  props: {
    bookingList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    onDelete(id) {
      this.$emit("onDelete", id);
    },

    onEdit(id) {
      this.$emit("onEdit", id);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.booking-timeline {
  padding-left: var(--v-rhythm-4);

  &__header {
    margin-bottom: var(--v-rhythm-4);
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-5);
  }

  &__line {
  }

  @include phones {
    &__header {
      margin-bottom: var(--v-rhythm-10);
    }

    &__main {
      gap: var(--v-rhythm-9);
    }
  }
}
</style>