<template>
  <div class="widget-newsblog widget_container" v-if="projectList">
    <div class="widget-newsblog__title main-title">{{ name }}</div>
    <div class="projects-list">
      <SingleProjectShowcase
        v-for="project in projectList"
        :key="project.ID"
        :projectObj="project"
        class="project-wrapper"
        type="lkWidget"
      />
    </div>

    <div class="actions">
      <router-link to="/projects" class="primary-btn">Все проекты</router-link>
    </div>
  </div>
</template>

<script>
import SingleProjectShowcase from "@/components/pages/projects-showcase/SingleProject.vue";
import axios from "axios";
export default {
  name: "ProjectsWidgetLk",

  props: {
    name: null,
  },

  components: {
    SingleProjectShowcase,
  },

  data() {
    return {
      projectList: undefined,
    };
  },

  methods: {
    async getMainProjectList() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/project/mainList`,
        });
        this.projectList = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.getMainProjectList();
  },

  computed: {
    currentUserId() {
      return JSON.parse(localStorage.currentUser).ID;
    },
  },
};
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
}

.projects-list {
  display: flex;
  gap: var(--v-rhythm-8);
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0;
  margin-bottom: var(--v-rhythm-8);

  @include laptop {
    flex-basis: 100%;
    margin: 0 0 16px 0;
  }
}

.project-wrapper {
  flex-basis: calc(33.33333% - 24px);
  padding: 0;

  &::v-deep .project {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 !important;
  }

  @include desktop {
    flex-basis: 100%;
  }

  @include laptop {
    flex-basis: 100%;
  }
}
</style>