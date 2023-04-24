<template>
  <div class="date-time">
    <div class="date-time__date">
      <span class="date-time__date-day">{{ day }}</span>
      <span class="date-time__date-month" v-html="month"></span>
      <span class="date-time__date-year" v-if="year" v-html="year"></span>
    </div>
    <ul class="date-time__times" v-if="timeList">
      <li class="date-time__times-item" v-for="(item, i) in timeList" :key="i">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DateTime",

  components: {},

  props: {
    day: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: false,
    },
    timeList: {
      type: Array,
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
.date-time {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-3);

  color: var(--red900);

  &__date {
    display: flex;
    flex-direction: column;
  }

  &__date-day {
    margin-top: calc(-1 * var(--v-rhythm-2));

    @extend .h1;
  }

  &__date-month {
    @extend .subtitle-2;
  }

  &__date-year {
    margin-top: calc(-1 * var(--v-rhythm-1));
    @extend .subtitle-2;
  }

  &__times {
    display: flex;
    flex-direction: column;
  }

  &__times-item {
    @extend .body-1;
  }
}
</style>