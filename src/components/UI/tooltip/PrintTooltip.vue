<template>
  <tippy class="print-tooltip" animation="fade" arrow theme="light">
    <template v-slot:trigger>
      <button class="print-tooltip__btn" @click="$emit('eventClick')">
        <UserIcons class="print-tooltip__icon" :iconName="'print'" />
      </button>
    </template>

    <div class="print-tooltip__content">{{ content }}</div>
  </tippy>
</template>

<script>
export default {
  name: "PrintTooltip",

  components: {},

  props: {
    content: {
      type: String,
      required: false,
      default: "Распечатать",
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
.print-tooltip {
  line-height: 1;
  font-size: 0;

  &__btn {
    cursor: pointer;
    @include transition();

    @include hover {
      .print-tooltip__icon {
        fill: var(--red900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__icon {
    width: 24px;
    height: 24px;

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