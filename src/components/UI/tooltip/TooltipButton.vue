<template>
  <div @click="clickEvent">
    <tippy
      class="info-tooltip"
      animation="fade"
      arrow
      theme="light"
      :touch="false"
      :flipOnUpdate="true"
    >
      <template v-slot:trigger>
        <button class="info-tooltip__btn">
          <UserIcons
            class="info-tooltip__icon"
            :iconName="iconName"
            :class="{ 'info-tooltip__icon_red': isRed }"
          />
        </button>
      </template>

      <div class="info-tooltip__content">{{ content }}</div>
    </tippy>
  </div>
</template>

<script>
export default {
  name: "TooltipButton",

  components: {},

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
    isRed: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    clickEvent() {
      this.$emit("clickEvent");
    },
  },

  watch: {},

  mounted() {},
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

  &__icon_red {
    fill: var(--red900);
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