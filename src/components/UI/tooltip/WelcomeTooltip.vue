<template>
  <tippy class="welcome-tooltip" animation="fade" arrow theme="light">
    <template v-slot:trigger>
      <button class="welcome-tooltip__btn" @click="$emit('eventClick')">
        <UserIcons class="welcome-tooltip__icon" :iconName="'emoji-people'" />
      </button>
    </template>

    <div class="welcome-tooltip__content">{{ content }}</div>
  </tippy>
</template>

<script>
export default {
  name: "WelcomeTooltip",

  components: {},

  props: {
    content: {
      type: String,
      required: false,
      default: "Приветствовать",
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
.welcome-tooltip {
  line-height: 1;
  font-size: 0;

  &__btn {
    cursor: pointer;
    @include transition();

    @include hover {
      .welcome-tooltip__icon {
        fill: var(--red700);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__icon {
    width: 26px;
    height: 26px;

    fill: var(--gray300);

    @include transition();
  }

  &__content {
    padding: var(--v-rhythm-1) var(--v-rhythm-2);

    @extend .caption-1;
    color: var(--gray700);
  }
}
</style>