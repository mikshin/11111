<template>
  <ul class="booking-list">
    <li class="booking-list__item" v-for="(item, i) in bookingList" :key="i">
      <span class="booking-list__item-title">{{ item.name }}</span>
      <span class="booking-list__item-capacity" v-if="item.capacity">{{
        capacity(item.capacity)
      }}</span>
    </li>
  </ul>
</template>

<script>
import { sklonenie } from "@/assets/scripts/scripts.js";

export default {
  name: "BookingList",

  components: {},

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
    capacity(number) {
      return `${number} ${sklonenie(number, [
        "человек",
        "человека",
        "человек",
      ])}`;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.booking-list {
  padding-top: var(--v-rhythm-8);

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-5);

  &__item {
    padding: 23px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-1);

    background-color: var(--white900);
    border: 1px solid var(--gray300);
    border-radius: 4px;
  }

  &__item-title {
    @extend .body-2;
    color: var(--gray900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-capacity {
    min-width: 65px;

    @extend .subtitle-2;
    color: var(--gray500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @include phones {
    padding-top: unset;

    gap: 76px;

    &__item {
      padding: unset;

      justify-content: center;
      gap: var(--v-rhythm-2);

      background-color: unset;
      border: unset;
    }
  }
}
</style>