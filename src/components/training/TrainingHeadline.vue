<template>
  <div class="training-headline">
    <div
      class="training-headline__text"
      :class="{
        gray: isGrayText,
      }"
    >
      <slot></slot>
    </div>
    <div class="training-headline__right" v-if="$slots['after-text']">
      <slot name="after-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainingHeadline",

  components: {},

  props: {
    isGrayText: {
      type: Boolean,
      required: false,
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
.training-headline {
  display: flex;
  justify-content: space-between;
  gap: var(--v-rhythm-8);
  padding-bottom: var(--v-rhythm-8);
  margin-bottom: var(--v-rhythm-2);

  border-bottom: 1px solid var(--gray300);

  &__text {
    flex-basis: calc((417 / 672) * 100%);
    flex-grow: 1;

    @extend .h2;

    &.gray {
      color: var(--gray500);
    }
  }

  &__right {
    flex-shrink: 0;
  }

  @include desktop {
    flex-wrap: wrap;
  }
}
</style>