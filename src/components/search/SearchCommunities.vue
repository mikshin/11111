<template>
  <div class="search-communities" v-if="communities.length > 0">
    <CommunityCard
      class="search-communities__community"
      v-for="community in communities"
      :key="community.ID"
      :communityData="community"
    />
  </div>
</template>

<script>
import CommunityCard from "@/components/communities/CommunityCard.vue";

export default {
  name: "SearchCommunities",

  components: {
    CommunityCard,
  },

  props: {
    communities: {
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
.search-communities {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--v-rhythm-5) var(--v-rhythm-8);

  &__community {
  }

  @include phones {
    grid-template-columns: 1fr;
  }
}
</style>