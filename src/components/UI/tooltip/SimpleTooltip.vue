<template>
  <tippy
    class="info-tooltip"
    animation="fade"
    arrow
    theme="light"
    :touch="true"
    :flipOnUpdate="true"
    :boundary="'viewport'"
  >
    <template v-slot:trigger>
      <button class="info-tooltip__btn">
        <UserIcons class="info-tooltip__icon" :iconName="iconName" />
      </button>
    </template>

    <div class="info-tooltip__content">{{ content }}</div>
  </tippy>
</template>

<script>
export default {
  name: "SimpleTooltip",

  components: {},

  data() {
    return {};
  },

  props: {
    content: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      required: false,
      default: "info",
    },
  },

  methods: {},

  computed: {},
};
</script>

<style scoped lang="scss">
.info-tooltip {
  @include font(0, 1);
  &__btn {
    cursor: pointer;

    @include hover {
      .info-tooltip__icon {
        fill: var(--red900);
      }
    }
  }

  &__icon {
    width: 20px;
    height: 20px;

    fill: var(--gray500);

    @include transition();
  }

  &__content {
    padding: {
      top: var(--v-rhythm-3);
      right: var(--v-rhythm-2);
      bottom: var(--v-rhythm-3);
      left: var(--v-rhythm-4);
    }

    @extend .caption-1;
    color: var(--gray900);
  }
}
</style>
