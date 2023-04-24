<template>
  <div class="event-status" :class="colorModifier">{{ status }}</div>
</template>

<script>
export default {
  name: "EventStatus",

  components: {},

  props: {
    status: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    colorModifier() {
      return `event-status--${this.collorClass}`;
    },

    collorClass() {
      const status = this.status.toLowerCase();
      let collorClass;
      if (status === "подтверждено") {
        collorClass = "confirmed";
      } else if (status === "ожидается") {
        collorClass = "expected";
      } else if (status === "отклонено") {
        collorClass = "rejected";
      }
      return collorClass;
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.event-status {
  width: max-content;
  padding: calc(var(--v-rhythm-1) - 1px) calc(var(--v-rhythm-2) - 1px);

  @extend .overline;

  border-radius: 40px;
  border: 1px solid;
  background-color: var(--white900);

  &--confirmed {
    color: var(--green900);
    border-color: var(--green900);
  }

  &--expected {
    color: var(--white900);
    border-color: var(--red700);
    background-color: var(--red700);
  }

  &--rejected {
    color: var(--gray500);
    border-color: var(--gray500);
  }
}
</style>