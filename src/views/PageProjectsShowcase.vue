<template>
  <AppPage class="page-projects-showcase"
    ><MainSidebar class="page-projects-showcase__main-sidebar">
      <template #main>
        <div class="projects-list" v-if="projectList">
          <SingleProjectShowcase
            v-for="project in projectList"
            :key="project.ID"
            :projectObj="project"
          />
        </div>
        <div class="no-projects" v-else>Проекты отсутствуют</div>
        <infinite-loading @infinite="infiniteHandler" ref="InfiniteLoading">
          <div slot="spinner" class="loading"></div>
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </template>

      <template #sidebar>
        <div class="page-projects-showcase__sidebar">
          <button
            class="page-projects-showcase__sidebar-btn primary-btn add-project"
            @click="addModalIsOpen = true"
            v-if="canAddProject"
          >
            Добавить проект
          </button>

          <div class="page-projects-showcase__filters">
            <FilterTemplate
              class="page-my-tasks__filter"
              @onUpdate="updateFilter"
              :filter="filterFields"
            />
          </div>
        </div>
      </template>
    </MainSidebar>

    <transition name="fade">
      <AddProject
        class="page-my-tasks__add-task"
        :isVisible="addModalIsOpen"
        @onClose="addModalIsOpen = false"
        @updataProjectList="updataProjectList"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import SingleProjectShowcase from "@/components/pages/projects-showcase/SingleProject.vue";
import InfiniteLoading from "vue-infinite-loading";
import AddProject from "@/components/pages/projects-showcase/AddProject.vue";
import FilterTemplate from "@/components/UI/filter/FilterTemplate.vue";

export default {
  name: "PageProjectsShowcase",
  components: {
    AppPage,
    MainSidebar,
    SingleProjectShowcase,
    InfiniteLoading,
    AddProject,
    FilterTemplate,
  },
  data() {
    return {
      userRight: null,
      projectList: [],
      addModalIsOpen: false,
      filterFields: [],
      filter: {
        filter: { YEAR: "", ARCHIVE: "", COMPANY: "", DEPARTMENT: "" },
      },
    };
  },
  mounted() {
    this.infiniteHandler();
    this.createFilter();
    axios
      .get("/mobileapp/api/project/projectRight")
      .then((response) => {
        this.userRight = response.data;
      })
      .catch((error) => {
        this.userRight = null;
        console.log(error);
      });
  },

  methods: {
    createFilter() {
      axios.get("/mobileapp/api/project/filterField").then((response) => {
        this.filterFields = response.data;
      });
    },

    updateFilter(data) {
      this.filter.filter = {
        YEAR: "",
        ARCHIVE: "",
        COMPANY: "",
        DEPARTMENT: "",
      };

      for (const [key, value] of Object.entries(data.data)) {
        this.filter.filter[key] = value;
      }

      this.updateProjects();
    },

    updateProjects() {
      axios
        .post(`/mobileapp/api/project/list/?startFrom=0&count=10`, this.filter)
        .then((response) => {
          this.projectList = response.data.project;

          if (!this.projectList) {
            this.$refs.InfiniteLoading.stateChanger.complete();
          } else {
            this.$refs.InfiniteLoading.stateChanger.reset();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updataProjectList() {
      this.infiniteHandler();
    },

    infiniteHandler($state) {
      // Вместо предзагрузки в mounted
      if (this.projectList.length < 10) {
        axios
          .post(
            `/mobileapp/api/project/list/?startFrom=0&count=10`,
            this.filter
          )
          .then((response) => {
            this.isLoaded = true;
            this.projectList = Object.values({ ...response.data.project });

            if (response.data.end != true) {
              this.$refs.InfiniteLoading.stateChanger.loaded();
            } else {
              this.$refs.InfiniteLoading.stateChanger.complete();
            }

            if (response.data.project === false) {
              this.projectList = "История отсутствует";
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.projectList = undefined;
            }
            this.isLoaded = true;
          });
      } else {
        axios
          .post(
            `/mobileapp/api/project/list/?startFrom=${this.projectList.length}&count=10`,
            this.filter
          )
          .then((response) => {
            this.projectList.push(
              ...Object.values({ ...response.data.project })
            );

            if (response.data.end != true) {
              $state.loaded();
            } else {
              $state.complete();
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.projectList = undefined;
            }
            this.isLoaded = true;
          });
      }
    },
  },

  computed: {
    canAddProject() {
      if (this.userRight) {
        return this.userRight.includes("add");
      } else {
        return false;
      }
    },
  },

  created() {
    if (this.$refs.InfiniteLoading) {
      this.$refs.InfiniteLoading.stateChanger.reset();
    }
  },
};
</script>

<style lang="scss" scoped>
.projects-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: -16px;

  @include phones {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 16px;
    margin: 0;
  }
}

.no-projects {
  @extend .h2;
  color: var(--gray500);
}

.loading::before {
  background-color: transparent;
}

.add-project {
  width: 100%;
}

.page-projects-showcase__sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);
}
</style>