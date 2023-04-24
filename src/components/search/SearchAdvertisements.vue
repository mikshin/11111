<template>
  <div class="search-advertisements" v-if="advertisements.length > 0">
    <AdvertisementCard
      class="search-advertisements__advertisement"
      v-for="advertisement in advertisements"
      :key="advertisement.ID"
      :cardInfo="advertisement"
    />
  </div>
</template>

<script>
import AdvertisementCard from "@/components/pages/Advertisements/AdvertisementCard.vue";

export default {
  name: "SearchAdvertisements",

  components: {
    AdvertisementCard,
  },

  props: {
    advertisements: {
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
.search-advertisements {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--v-rhythm-3);

  &__advertisement {
  }

  @include phones {
    grid-template-columns: 1fr;
  }
}
</style>