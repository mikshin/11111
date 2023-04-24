<template>
  <div class="booking-timeline-line">
    <BookingTimelineItem
      class="booking-timeline-line__item"
      v-for="(item, i) in eventsList"
      :key="i"
      :info="item"
      :style="getPosition(item.timeStart, item.timeEnd)"
      @onDelete="onDelete"
      @onEdit="onEdit"
    />
  </div>
</template>

<script>
import BookingTimelineItem from "@components/booking/app-booking/BookingTimelineItem.vue";

export default {
  name: "BookingTimelineLine",

  components: {
    BookingTimelineItem,
  },

  props: {
    eventsList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    getPosition(startTime, endTime) {
      return `width: ${this.getWidth(
        startTime,
        endTime
      )}px; left: ${this.getMinuts(startTime)}px`;
    },

    getMinuts(time) {
      const hoursMinuts = time.split(":");
      const hours = +hoursMinuts[0];
      const minuts = +hoursMinuts[1];
      return hours * 120 + minuts * 2;
    },

    getWidth(startTime, endTime) {
      const startMinut = this.getMinuts(startTime);
      const endMinut = this.getMinuts(endTime);
      return endMinut - startMinut;
    },

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
.booking-timeline-line {
  position: relative;

  width: calc(120px * 24);
  height: 72px;

  background-color: var(--gray200);

  &__item {
    position: absolute;
    top: 50%;

    transform: translateY(-50%);
  }

  @include phones {
    height: 60px;
  }
}
</style>