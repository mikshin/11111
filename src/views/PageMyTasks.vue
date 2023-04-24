<template>
  <AppPage class="page-my-tasks">
    <MainSidebar class="page-my-tasks__main-sidebar">
      <template #main>
        <div class="page-my-tasks__main" :class="{ loading: isLoading }">
          <template v-if="tasks">
            <TabsNav
              class="page-my-tasks__tabs-nav"
              :tabs="tabsNav"
              :activeTabObj="activeTab"
              @changeTab="(e) => (activeTab = e)"
            />

            <transition name="fade">
              <TasksTable
                class="page-my-tasks__table"
                v-if="activeTab.name === 'Список'"
                :tasks="tasks"
                :startFrom="startFrom"
                :end="end"
                @updata="updata"
                @openTaskModal="openTaskModal"
              />

              <TasksGantt
                class="page-my-tasks__gantt"
                v-else-if="activeTab.name === 'Гант'"
                :tasks="tasks"
                :end="end"
                @openTaskModal="openTaskModal"
              />
            </transition>
          </template>
          <div class="page-my-tasks__text-default" v-else>Задач не найдено</div>
        </div>
      </template>

      <template #sidebar>
        <div class="page-my-tasks__sidebar">
          <button
            class="page-my-tasks__sidebar-btn primary-btn"
            @click="addModalIsOpen = true"
          >
            Добавить задачу
          </button>

          <div class="page-my-tasks__filters">
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
      <TaskModal
        class="tasks-table-tr__modal"
        :isVisible="taskModalIsOpen"
        :taskId="taskModalId"
        @onClose="taskModalIsOpen = false"
        @updateTask="updateTask"
        @deleteTask="deleteTask"
        @updataTaskList="updataTaskList"
      />
    </transition>

    <transition name="fade">
      <AddTask
        class="page-my-tasks__add-task"
        :isVisible="addModalIsOpen"
        @onClose="addModalIsOpen = false"
        @updataTaskList="updataTaskList"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import TasksTable from "@/components/my-tasks/task-table/TasksTable.vue";
import TasksGantt from "@/components/my-tasks/task-gantt/TasksGantt.vue";
import AddTask from "@/components/my-tasks/add-task-modal/AddTask.vue";
import TaskModal from "@/components/my-tasks/task-modal/TaskModal.vue";
import FilterTemplate from "@/components/UI/filter/FilterTemplate.vue";

export default {
  name: "PageMyTasks",

  components: {
    AppPage,
    MainSidebar,
    TabsNav,
    TasksTable,
    TasksGantt,
    AddTask,
    TaskModal,
    FilterTemplate,
  },

  props: {},

  data() {
    return {
      isLoading: false,

      tabsNav: [
        {
          name: "Список",
        },
        {
          name: "Гант",
        },
      ],

      activeTab: {
        name: "Список",
      },

      tasks: [],
      end: true,

      startFrom: 0,

      taskModalIsOpen: false,
      taskModalId: "",

      addModalIsOpen: false,
      filterFields: [],
      filter: {
        filter: {
          accomplice: [],
          // eslint-disable-next-line
          created_by: [],
        },
      },
    };
  },

  computed: {},

  methods: {
    createFilter() {
      axios.get("/mobileapp/api/task/filter/").then((response) => {
        this.filterFields = response.data;
      });
    },

    updateFilter(data) {
      this.filter.filter = {
        accomplice: [],
        // eslint-disable-next-line
        created_by: [],
      };

      for (const [key, value] of Object.entries(data.data)) {
        if (key === "accomplice" || key === "created_by") {
          value.forEach((el) => {
            this.filter.filter[key].push(el.ID);
          });
        } else {
          this.filter.filter[key] = value;
        }
      }

      this.updataTaskList();
    },

    async fetchData() {
      try {
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/task/?startFrom=${this.startFrom}`,
          data: this.filter,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    async writeData() {
      try {
        // this.isLoading = true;
        this.end = true;
        const response = await this.fetchData();
        this.tasks = [...this.tasks, ...response.data];
        this.end = response.end;
      } finally {
        // this.isLoading = false;
      }
    },

    updata() {
      this.startFrom++;
      this.writeData();
    },

    openTaskModal(taskId) {
      this.taskModalId = taskId;
      this.taskModalIsOpen = true;
    },

    updateTask(newStatus) {
      let task = this.tasks.find((item) => item.ID === this.taskModalId);
      task.STATUS = newStatus;
    },

    updataTaskList() {
      this.startFrom = 0;
      this.tasks = [];
      this.writeData();
    },

    deleteTask() {
      this.updataTaskList();
      this.taskModalIsOpen = false;
    },
  },

  watch: {},

  mounted() {
    this.writeData();

    this.createFilter();
  },
};
</script>

<style scoped lang="scss">
.page-my-tasks {
  &__main-sidebar {
  }

  &__main {
  }

  &__text-default {
    @extend .h3;
    color: var(--gray500);
  }

  &__tabs-nav {
  }

  &__table {
    width: 100%;
    margin-top: var(--v-rhythm-8);
  }

  &__gantt {
    width: 100%;
    margin-top: var(--v-rhythm-4);
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
  }

  &__add-task {
    width: 100%;
  }

  &__filters {
    width: 100%;
  }
}
</style>
