<template>
  <div
    class="poll-label"
    :class="{
      'poll-label--important': statusLow === 'важное',
      'poll-label--passed': statusLow === 'пройден',
      'poll-label--not-passed':
        statusLow === 'не пройден' || statusLow === 'завершен',
    }"
  >
    <UserIcons
      class="poll-label__icon"
      v-if="iconName"
      :iconName="iconName"
    />{{ status }}
  </div>
</template>

<script>
export default {
  name: "PollLabel",

  components: {},

  props: {
    status: {
      type: String,
      required: true,
    },

    iconName: {
      type: String,
      required: false,
      default: "",
    },
  },

  data() {
    return {};
  },

  computed: {
    statusLow() {
      return this.status.toLowerCase();
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.poll-label {
  height: 24px;
  padding: var(--v-rhythm-1) var(--v-rhythm-2);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--v-rhythm-1);

  @extend .overline;
  color: var(--white900);

  background-color: var(--gray900);
  border-radius: 40px;

  &--important {
    background-color: var(--red900);
  }

  &--passed {
    background-color: var(--green900);
  }

  &--not-passed {
    background-color: var(--gray700);
  }

  &__icon {
    width: 16px;
    height: 16px;

    fill: var(--white900);
  }
}
</style>