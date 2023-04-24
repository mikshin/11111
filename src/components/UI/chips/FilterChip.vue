<template>
  <button
    class="filter-chip"
    :class="{
      'filter-chip--active': isActive,
      'filter-chip--disabled': isDisabled,
    }"
    @click="$emit('changeCategory')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "FilterChip",

  components: {},

  props: {
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {};
  },

  methods: {},

  computed: {},
};
</script>

<style scoped lang="scss">
.filter-chip {
  width: max-content;
  padding: 5px 11px;

  @extend .subtitle-1;
  color: var(--red900);
  white-space: nowrap;

  background-color: var(--red300);
  border: 1px solid var(--red300);
  border-radius: 32px;

  cursor: pointer;
  @include transition();

  &:first-letter {
    text-transform: uppercase;
  }

  &--active {
    color: var(--white900);

    background-color: var(--red900);

    cursor: default;
  }

  @include hover {
    &:not(.filter-chip--disabled):not(.filter-chip--active) {
      color: var(--white900);

      background-color: var(--red900);
    }
  }

  &:active {
    &:not(.filter-chip--disabled):not(.filter-chip--active) {
      opacity: var(--active-opacity);
    }
  }

  &--disabled {
    color: var(--gray700);

    background-color: var(--gray300);
    border-color: var(--gray300);

    cursor: not-allowed;
  }

  @include phones {
    padding: 3px 11px;
  }
}
</style>
