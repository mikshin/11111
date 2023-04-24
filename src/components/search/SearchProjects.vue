<template>
  <ul class="search-projects" v-if="projects.length > 0">
    <li
      class="search-projects__item"
      v-for="project in projects"
      :key="project.ID"
    >
      <SingleProjectShowcase
        class="search-projects__project"
        :projectObj="project"
      />
    </li>
  </ul>
</template>

<script>
import SingleProjectShowcase from "@/components/pages/projects-showcase/SingleProject.vue";

export default {
  name: "SearchProjects",

  components: {
    SingleProjectShowcase,
  },

  props: {
    projects: {
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
.search-projects {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--v-rhythm-8);

  &__item {
  }

  &__project {
    width: 100%;
    height: 100%;
    flex-basis: unset;
    padding: 0;
  }

  @include phones {
    grid-template-columns: 1fr;
  }
}
</style>