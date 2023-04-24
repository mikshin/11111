<template>
  <div class="search-contests" v-if="contests.length > 0">
    <ContestCard
      class="search-contests__contest"
      v-for="contest in contests"
      :key="contest.ID"
      :dataContest="contest"
    />
  </div>
</template>

<script>
import ContestCard from "@/components/photo-contests-list/ContestCard.vue";

export default {
  name: "SearchContests",

  components: {
    ContestCard,
  },

  props: {
    contests: {
      type: Array,
      required: true,
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
.search-contests {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-3);

  &__contest {
    width: 100%;
  }
}
</style>