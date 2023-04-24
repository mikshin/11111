<template>
  <div class="timeline-header">
    <div
      class="timeline-header__item"
      v-for="(hour, i) in 24"
      :key="i"
      :id="`hour-${i}`"
    >
      <span class="timeline-header__item-whole">{{ getTimeWhole(i) }}</span>
      <span class="timeline-header__item-half">{{ getTimeHalf(i) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimelineHeader",

  components: {},

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    getTimeWhole(counter) {
      return counter < 10 ? `0${counter}:00` : `${counter}:00`;
    },
    getTimeHalf(counter) {
      return counter < 10 ? `0${counter}:30` : `${counter}:30`;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.timeline-header {
  &__hour {
  }
}

.timeline-header {
  display: flex;

  &__item {
    position: relative;

    width: 120px;
    flex-shrink: 0;

    display: flex;
    justify-content: center;

    @extend .caption-1;
    color: var(--gray900);
  }

  &__item-whole {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-50%);
  }

  &__item-half {
  }
}
</style>