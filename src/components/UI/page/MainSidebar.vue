<template>
  <div
    class="main-sidebar"
    :class="{
      'main-sidebar--reverse': directionReverse,
      'main-sidebar--not-mobile-reverse': notMobileReverse,
    }"
  >
    <div class="main-sidebar__main"><slot name="main"></slot></div>
    <div class="main-sidebar__sidebar"><slot name="sidebar"></slot></div>
  </div>
</template>

<script>
export default {
  name: "MainSidebar",

  components: {},

  props: {
    directionReverse: {
      type: Boolean,
      required: false,
      default: false,
    },

    notMobileReverse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.main-sidebar {
  display: flex;
  justify-content: space-between;

  &--reverse {
    flex-direction: row-reverse;
  }

  &__main {
    width: calc(1024 * 100% / 1376);
  }

  &__sidebar {
    width: calc(320 * 100% / 1376);

    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: var(--v-rhythm-4);
  }

  @include laptop {
    flex-direction: column-reverse;
    gap: var(--v-rhythm-6);

    &--not-mobile-reverse {
      flex-direction: column;
    }

    &__main {
      width: 100%;
    }

    &__sidebar {
      width: 100%;
    }
  }
}
</style>