<template>
  <div class="people-tooltip" :class="{ loading: isLoading }">
    <ul class="people-tooltip__list">
      <PersonTooltip
        class="people-tooltip__item"
        v-for="(person, i) in people"
        :key="i"
        :person="person"
      />
      <div class="observe" v-intersection="getPeople" v-if="!isEnd"></div>
    </ul>
  </div>
</template>

<script>
import PersonTooltip from "./PersonTooltip.vue";

export default {
  name: "PeopleTooltip",

  components: { PersonTooltip },

  data() {
    return {};
  },

  props: {
    people: {
      type: Array,
      required: false,
    },
    isEnd: {
      type: Boolean,
      required: false,
      default: true,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  methods: {
    getPeople() {
      this.$emit("getPeople");
    },
  },

  computed: {},
};
</script>

<style scoped lang="scss">
.people-tooltip {
  --peopleTooltipPadding: var(--v-rhythm-4);
  min-height: 60px;

  width: 308px;
  max-height: 320px;
  padding: 0 var(--peopleTooltipPadding);

  background-color: var(--white900);

  overflow-y: auto;
  overflow-x: hidden;

  &__list {
    margin: 0;
    padding: var(--peopleTooltipPadding) 0;
  }

  @include phones {
    --peopleTooltipPadding: var(--v-rhythm-2);

    width: 300px;
    max-height: 290px;
  }
}
</style>
