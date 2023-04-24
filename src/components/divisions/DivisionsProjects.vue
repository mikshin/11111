<template>
  <div class="divisions-projects" :class="{ loading: isLoading }">
    <ul class="divisions-projects__list" v-if="projects.length > 0">
      <li
        class="divisions-projects__item"
        v-for="(project, i) in projects"
        :key="i"
      >
        <SingleProjectShowcase
          class="divisions-projects__project"
          :projectObj="project"
        />
      </li>
    </ul>

    <router-link class="divisions-projects__link primary-btn" :to="'/projects'"
      >Все проекты</router-link
    >
  </div>
</template>

<script>
import axios from "axios";
import SingleProjectShowcase from "@/components/pages/projects-showcase/SingleProject.vue";

export default {
  name: "DivisionsProjects",

  components: {
    SingleProjectShowcase,
  },

  props: {
    depId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      projects: [],
    };
  },

  computed: {},

  methods: {
    async getProjects() {
      try {
        this.isLoading = true;
        this.projects = [];
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/project/shortList?depId=${this.depId}`,
        });
        if (response) this.projects = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {},

  mounted() {
    this.getProjects();
  },
};
</script>

<style scoped lang="scss">
.divisions-projects {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);
  align-items: flex-start;

  &__list {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__item {
  }

  &__project {
    width: 100%;
    flex-basis: unset;
    padding: 0;
  }

  &__link {
  }

  @include phones {
    &__list {
      grid-template-columns: 1fr;
    }

    &__link {
      display: none;
    }
  }
}
</style>