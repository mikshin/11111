<template>
  <div class="app-booking">
    <BookingList class="app-booking__list" :bookingList="bookingList" />

    <div class="app-booking__timeline-wrapper" id="timeline-wrapper">
      <BookingTimeline
        class="app-booking__timeline"
        :bookingList="bookingList"
        @onDelete="onDelete"
        @onEdit="onEdit"
      />
    </div>
  </div>
</template>

<script>
import BookingList from "@components/booking/app-booking/BookingList.vue";
import BookingTimeline from "@components/booking/app-booking/BookingTimeline.vue";
import VueScrollTo from "vue-scrollto";

export default {
  name: "AppBooking",

  components: {
    BookingList,
    BookingTimeline,
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

  mounted() {
    VueScrollTo.scrollTo(`#hour-8`, {
      container: "#timeline-wrapper",
      offset: -16,
      x: true,
    });
  },
};
</script>

<style scoped lang="scss">
.app-booking {
  display: flex;
  gap: var(--v-rhythm-8);

  &__list {
    width: calc(320 * 100% / 1024);
  }

  &__timeline-wrapper {
    width: calc(672 * 100% / 1024);

    overflow-x: auto;
  }

  &__timeline {
  }

  @include phones {
    position: relative;

    &__list {
      position: absolute;
      top: 30px;
      left: 0;

      width: 100%;
    }

    &__timeline-wrapper {
      position: relative;

      width: 100%;
    }
  }
}
</style>