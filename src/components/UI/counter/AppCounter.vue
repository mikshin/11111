<template>
  <div
    class="app-counter"
    :class="{
      'app-counter--active': isActive,
      'app-counter--disabled': isDisabled,
    }"
    @click="click"
  >
    <user-icons class="app-counter__icon" :iconName="counterIcon"></user-icons>
    <span class="app-counter__number" v-if="counterNumber">{{
      counterNumber
    }}</span>
  </div>
</template>

<script>
export default {
  name: "AppCounter",

  components: {},

  props: {
    counterIcon: {
      type: String,
      required: true,
    },

    counterNumber: {
      type: Number,
    },

    isActive: {
      type: Boolean,
      required: false,
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

  methods: {
    click() {
      if (!this.isDisabled) this.$emit("click");
    },
  },

  computed: {},
};
</script>

<style scoped lang="scss">
.app-counter {
  @extend .button;
  @include transition();
  --app-counter-color: var(--gray500);

  display: flex;
  align-items: center;
  gap: var(--v-rhythm-2);
  padding: var(--v-rhythm-1) var(--v-rhythm-2);

  color: var(--app-counter-color);
  fill: var(--app-counter-color);

  border-radius: 16px;

  &--active {
    --app-counter-color: var(--red900);
  }

  &:not(.app-counter--disabled) {
    @include hover {
      --app-counter-color: var(--red700);

      background: #feecf0;
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__number {
  }

  @include phones {
    &__icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
