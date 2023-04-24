<template>
  <div class="page-search-categories">
    <FilterChip
      class="page-search-categories__chip"
      :isActive="!activeCategory"
      @changeCategory="changeCategory('')"
    >
      Все
    </FilterChip>

    <FilterChip
      class="page-search-categories__chip"
      v-for="category in categories"
      :key="category"
      :isActive="activeCategory === category"
      @changeCategory="changeCategory(category)"
    >
      {{ category }}
    </FilterChip>
  </div>
</template>

<script>
import FilterChip from "@/components/UI/chips/FilterChip.vue";

export default {
  name: "PageSearchCategories",

  components: {
    FilterChip,
  },

  props: {
    categories: {
      type: Array,
      required: true,
    },

    activeCategory: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    changeCategory(category) {
      this.$emit("changeCategory", category);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.page-search-categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-rhythm-3);

  &__chip {
  }
}
</style>