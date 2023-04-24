<template>
  <AppPage
    class="page-project"
    :class="{ loading: isLoading }"
    :breadcrumbsAnotherName="data && data.NAME ? data.NAME : ''"
    :noTitle="true"
  >
    <template v-if="data">
      <div class="page-project__top">
        <div class="page-project__top-left">
          <SimplePicture
            class="page-project__top-left-picture"
            v-if="data.PREVIEW_PICTURE"
            :alt="data.PREVIEW_PICTURE[0].originalName"
            :src="data.PREVIEW_PICTURE[0].fileLink"
          />
        </div>
        <div class="page-project__top-right">
          <div class="page-project__top-right-header">
            <div class="page-project__title">
              {{ data.NAME }}
            </div>
            <!-- Сделать на компоненте, который есть на других страницах -->
            <div class="edit-btn-wrapper" v-if="canEdit != -1">
              <button
                @click="openEdit()"
                v-closable="{ exclude: [], handler: 'closeEdit' }"
              >
                <user-icons :iconName="'more'" />
              </button>
              <transition name="fade">
                <ul class="edit-list" v-if="editList">
                  <li
                    class="edit-item"
                    @click="openEditModal"
                    v-if="!isLoading"
                  >
                    Редактировать
                  </li>
                  <li class="edit-item" @click="openDeleteModal">Удалить</li>
                </ul>
              </transition>
            </div>
          </div>
          <div class="page-project__top-right-main">
            <ul class="page-project__top-info">
              <li class="page-project__top-info-item">
                <div class="page-project__top-info-title">Компания</div>
                <div class="page-project__top-dep">
                  <span class="page-project__top-dep-title">{{
                    data.COMPANY
                  }}</span>
                  <!-- В макетах есть в апи нет -->
                  <!-- <span class="page-project__top-dep-head"></span> -->
                </div>
              </li>
              <li class="page-project__top-info-item">
                <div class="page-project__top-info-title">
                  Подразделение, ответственное за проект
                </div>
                <div class="page-project__top-dep">
                  <span class="page-project__top-dep-title">{{
                    data.DEPARTMENT
                  }}</span>
                  <!-- В макетах есть в апи нет -->
                  <!-- <span class="page-project__top-dep-head"></span> -->
                </div>
              </li>
            </ul>

            <div class="page-project__stage">
              <div class="page-project__stage-number">{{ stageName }}</div>
              <div class="page-project__stage-title">Этап</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Середина -->
      <MainSidebar class="project__secondary-sidebar">
        <template #main>
          <div class="project__description">
            <h4 class="project__description-title">Описание проекта</h4>
            <div
              v-html="data.PREVIEW_TEXT"
              class="project__description-content"
            ></div>
          </div>
          <div class="project__members">
            <h4 class="project__members-title">Участники проекта</h4>
            <div class="project__members-content">
              <div
                class="project__single-member"
                v-for="user in members"
                :key="user.USER.ID"
              >
                <div class="project__role">{{ user.ROLE.NAME }}</div>
                <div class="project__person">
                  <SimplePersonCard
                    :avatar="{
                      src: user.USER.USER_PHOTO,
                      alt: user.USER.FULL_NAME,
                    }"
                    :fullName="user.USER.FULL_NAME"
                    :profession="user.USER.UF_WORK_POSITION"
                    :link="true"
                    :id="user.USER.ID"
                    :vacation="user.USER.VACATION"
                    :fired="user.USER.FIRED"
                  />
                </div>
              </div>

              <infinite-loading
                @infinite="infiniteHandler"
                ref="InfiniteLoading"
              >
                <!-- <div slot="spinner" class="loading"></div> -->
                <div slot="spinner"></div>
                <div slot="no-more"></div>
                <div slot="no-results"></div>
              </infinite-loading>
            </div>
          </div>

          <div class="project__tasks">
            <div class="project__tasks-header">
              <h4 class="project__tasks-title">Задачи проекта</h4>
              <button
                v-if="canAddTasks"
                class="page-my-tasks__sidebar-btn primary-btn"
                @click="addModalIsOpen = true"
              >
                Добавить задачу
              </button>
            </div>

            <!-- <div class="page-my-tasks__main" :class="{ loading: isLoading }"> -->
            <div class="page-my-tasks__main">
              <template v-if="tasks.length > 0">
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
                    :end="taskEnd"
                    @openTaskModal="openTaskModal"
                  />

                  <TasksGantt
                    class="page-my-tasks__gantt"
                    v-else-if="activeTab.name === 'Гант'"
                    :tasks="tasks"
                    :end="taskEnd"
                    @openTaskModal="openTaskModal"
                  />
                </transition>
              </template>
              <div class="page-my-tasks__text-default" v-else>
                У вас нет задач
              </div>
              <button class="primary-btn" v-if="!taskEnd" @click="writeData()">
                Загрузить ещё
              </button>
            </div>
          </div>
        </template>

        <template #sidebar>
          <div class="check-point">
            <span class="check-point__title">Сроки проекта</span>
            <ul class="check-point__content">
              <li
                class="check-point__item"
                v-for="(item, i) in controlPoints"
                :key="item.value + i"
                :class="{ active: i <= closestIndex }"
              >
                <div class="check-point__progress">
                  <div class="check-point__circle"></div>
                  <div
                    class="check-point__line"
                    :class="{ active: i < closestIndex }"
                  ></div>
                </div>

                <div class="check-point__text-content">
                  <div class="check-point__date">{{ item.value }}</div>
                  <div class="check-point__name">{{ item.description }}</div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </MainSidebar>
    </template>

    <h3 class="page-text-default project__text-default" v-else>
      Нет доступа к просмотру элемента
    </h3>

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
        type="project"
        :projectId="this.id"
        @onClose="addModalIsOpen = false"
        @updataTaskList="updataTaskList"
      />
    </transition>

    <transition name="fade">
      <DeleteProject
        class="project__delete-modal"
        v-if="deleteModalOpen"
        :projectId="id"
        :projectName="data.NAME"
        @onClose="deleteModalOpen = false"
        @deleteProject="deletedProject"
      />
    </transition>

    <transition name="fade">
      <EditProject
        class="page-my-tasks__add-task"
        v-if="editModalOpen"
        :data="data"
        :members="members"
        @onClose="editModalOpen = false"
        @updateProject="updateProject"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";

import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import TasksTable from "@/components/my-tasks/task-table/TasksTable.vue";
import TasksGantt from "@/components/my-tasks/task-gantt/TasksGantt.vue";
import AddTask from "@/components/my-tasks/add-task-modal/AddTask.vue";
import TaskModal from "@/components/my-tasks/task-modal/TaskModal.vue";
import DeleteProject from "@/components/pages/projects-showcase/DeleteProject.vue";
import EditProject from "@/components/pages/projects-showcase/EditProject.vue";

import InfiniteLoading from "vue-infinite-loading";

import Vue from "vue";

let handleOutsideClick;
Vue.directive("closable", {
  bind(el, binding, vnode) {
    handleOutsideClick = (e) => {
      e.stopPropagation();
      const { handler, exclude } = binding.value;
      let clickedOnExcludedEl = false;
      exclude.forEach((refName) => {
        if (!clickedOnExcludedEl) {
          const excludedEl = vnode.context.$refs[refName];
          clickedOnExcludedEl = excludedEl.contains(e.target);
        }
      });
      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        vnode.context[handler]();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
  },
  unbind() {
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("touchstart", handleOutsideClick);
  },
});

export default {
  name: "PageProject",

  components: {
    AppPage,
    MainSidebar,
    SimplePersonCard,
    InfiniteLoading,
    TabsNav,
    TasksTable,
    TasksGantt,
    AddTask,
    TaskModal,
    DeleteProject,
    EditProject,
    SimplePicture,
  },

  data() {
    return {
      data: null,
      members: [],
      pinnedMembers: [],
      controlPoints: [],
      closestIndex: null,
      editList: false,

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

      isLoading: false,

      tasks: [],
      taskEnd: true,

      startFrom: 0,

      taskModalIsOpen: false,
      taskModalId: "",

      addModalIsOpen: false,
      id: null,

      editModalOpen: false,
      deleteModalOpen: false,
    };
  },

  computed: {
    breadcrumbsAnotherName() {
      return this.data.NAME ? this.data.NAME : "Проект";
    },

    canAddTasks() {
      return this.data.ACCESS_TASK_ADD;
    },
    canEdit() {
      if (this.data.ACCESS) {
        return this.data.ACCESS.indexOf("edit");
      } else {
        return false;
      }
    },
    stageName() {
      if (this.data.STAGE) {
        return this.data.STAGE.substring(this.data.STAGE.indexOf(" ") + 1);
      } else {
        return 0;
      }
    },
  },

  methods: {
    openEdit() {
      this.editList = !this.editList;
    },
    closeEdit() {
      this.editList = false;
    },

    openEditModal() {
      this.editModalOpen = true;
    },

    openDeleteModal() {
      this.deleteModalOpen = true;
    },

    deletedProject() {
      this.$router.push("/projects");
    },

    updateProject() {
      this.loadProject();
      setTimeout(() => {
        this.$refs.InfiniteLoading.stateChanger.reset();
      });
    },

    infiniteHandler() {
      let id = this.$route.path.split("/")[2];
      this.isLoading = true;

      if (this.members.length === 0) {
        axios
          .get(`/mobileapp/api/project/member/list?projectId=${id}`)
          .then((response) => {
            this.members.push(...response.data.members);

            if (response.data.end != true) {
              //$state.loaded();
              this.infiniteHandler();
            } else {
              this.isLoading = false;
              this.$refs.InfiniteLoading.stateChanger.complete();
            }

            if (response.data.members === false) {
              this.members = "Участников нет";
            }
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              this.members = undefined;
            }
          });
      } else {
        axios
          .get(
            `/mobileapp/api/project/member/list?projectId=${id}&startFrom=${
              this.members.length - this.pinnedMembers.length
            }&count=10`
          )
          .then((response) => {
            this.members.push(...response.data.members);

            if (response.data.end != true) {
              this.infiniteHandler();
            } else {
              this.$refs.InfiniteLoading.stateChanger.complete();
              this.isLoading = false;
            }
          })
          .catch((error) => {
            console.log("error", error);
            this.isLoading = false;
            if (error.response.status === 404) {
              this.members = undefined;
            }
          });
      }
    },

    calcControlPoint() {
      this.controlPoints.push({
        value: this.data.ACTIVE_FROM,
        description: "Начало проекта",
      });
      this.controlPoints.push(...this.data.KEY_POINT);
      this.controlPoints.push({
        value: this.data.ACTIVE_TO,
        description: "Конец проекта",
      });

      let controlPoints = [];

      const dateObj = new Date();
      let month = dateObj.getUTCMonth() + 1; //months from 1-12
      month < 10 ? (month = "0" + month) : null;
      let day = dateObj.getUTCDate();
      day < 10 ? (day = "0" + day) : null;
      const year = dateObj.getUTCFullYear();

      const currentDate = "" + year + month + day;

      for (let i = 0; i < this.controlPoints.length; i++) {
        const element = this.controlPoints[i].value.split(".");
        controlPoints.push(element[2] + element[1] + element[0]);
      }

      // Ближайшая дата
      // let closest = controlPoints.reduce(function (prev, curr) {
      //   return Math.abs(curr - currentDate) < Math.abs(prev - currentDate)
      //     ? curr
      //     : prev;
      // });

      // Пройденная дата
      let closest = controlPoints.length;
      controlPoints.every((item, i) => {
        if (currentDate - item < 0) {
          closest = i - 1;
          return false;
        }
        return true;
      });

      //this.closestIndex = controlPoints.indexOf(closest);
      this.closestIndex = closest;
    },
    async fetchData() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/project/taskList`,
          params: {
            projectId: this.id,
            count: 10,
            startFrom: this.startFrom,
          },
        });
        this.startFrom += 10;
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    async writeData() {
      try {
        this.isLoading = true;
        this.taskEnd = true;
        const response = await this.fetchData();
        if (response.data != null) {
          this.tasks = [...this.tasks, ...response.data];
          this.taskEnd = response.end;
        }
      } finally {
        this.isLoading = false;
      }
    },

    updata() {
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

    loadProject() {
      this.id = this.$route.path.split("/")[2];
      this.data = null;
      this.members = [];
      this.pinnedMembers = [];
      this.controlPoints = [];
      this.tasks = [];

      axios
        .get("/mobileapp/api/project/", {
          params: {
            projectId: this.id,
          },
        })
        .then((response) => {
          this.data = response.data;
          if (response.data) {
            this.calcControlPoint();
          }
        });
      this.writeData();

      axios
        .get(`/mobileapp/api/project/member/listPined`, {
          params: {
            projectId: this.id,
            startFrom: 0,
            count: 100,
          },
        })
        .then((response) => {
          this.members.push(...response.data.members);
          this.pinnedMembers.push(...response.data.members);
        });
    },
  },

  mounted() {
    this.loadProject();
  },

  created() {
    if (this.$refs.InfiniteLoading) {
      this.$refs.InfiniteLoading.stateChanger.reset();
    }
  },
};
</script>

<style lang="scss" scoped>
.page-project {
  &__top {
    margin-bottom: var(--v-rhythm-8);

    display: flex;
    gap: var(--v-rhythm-8);
  }

  &__top-left {
    position: relative;
    width: calc(672 * 100% / 1376);
    padding-top: calc(450 * 100% / 1376);
    flex-shrink: 0;

    background-color: var(--gray500);
  }

  &__top-left-picture {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;
  }

  &__top-right {
    flex-grow: 1;
  }

  &__top-right-header {
    margin-bottom: var(--v-rhythm-8);

    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--v-rhythm-8);
  }

  &__title {
    color: var(--gray900);
    @extend .h2;
  }

  &__top-right-main {
    display: flex;
    gap: var(--v-rhythm-8);
  }

  &__top-info {
    width: calc(317 * 100% / 672);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__top-info-item {
    padding-top: var(--v-rhythm-1);

    border-top: 1px solid var(--gray300);
  }

  &__top-info-title {
    margin-bottom: var(--v-rhythm-5);

    color: var(--gray500);
    @extend .caption-2;
  }

  &__top-dep {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-1);
  }

  &__top-dep-title {
    color: var(--gray900);
    @extend .subtitle-2;
  }

  &__top-dep-head {
    color: var(--gray700);
    @include font(14px, 20px);
    font-style: italic;
  }

  &__stage {
    padding: 0 var(--v-rhythm-4);

    display: flex;
    gap: var(--v-rhythm-1);
  }

  &__stage-number {
    @include font(100px, 80%, 700);
    color: var(--red900);
  }

  &__stage-title {
    color: var(--gray500);
    @extend .subtitle-2;
  }

  @include laptop {
    &__stage-number {
      font-size: 80px;
    }
  }

  @include phones {
    &__top {
      flex-direction: column-reverse;
    }

    &__top-left {
      width: 100%;
      padding-top: calc(700 * 100% / 1376);
    }
  }

  @media screen and (max-width: 500px) {
    &__top-right-main {
      flex-direction: column-reverse;
    }

    &__top-info {
      width: 100%;
    }

    &__stage-number {
      font-size: 70px;
    }
  }
}

.check-point {
  &__title {
    @extend .subtitle-1;
    margin-bottom: var(--v-rhythm-5);
    display: block;
  }

  &__item {
    display: flex;
  }

  &__item:last-child().active &__circle {
    border: 2px solid var(--red700) !important;
    background-color: var(--red700) !important;
  }

  &__item:last-child() &__line {
    display: none;
  }

  &__item:last-child() &__circle {
    border: 2px solid var(--gray300);
    background-color: var(--gray300);
  }

  &__item:first-child() &__circle {
    border: 2px solid var(--red700) !important;
    background-color: var(--red700) !important;
  }

  &__item.active {
    .check-point__circle {
      border: 2px solid var(--red700);
      background-color: var(--white900);
    }
    .check-point__line.active {
      background-color: var(--red700);
    }
  }

  &__date {
    @extend .subtitle-1;
    color: var(--gray700);
    margin-bottom: var(--v-rhythm-1);
  }

  &__text-content {
    margin-left: var(--v-rhythm-3);
    padding-bottom: 20px;
  }

  &__progress {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__circle {
    width: 18px;
    height: 18px;
    border-radius: 100%;
    border: 2px solid var(--gray300);
    background-color: var(--white900);
    flex-shrink: 0;
  }

  &__line {
    height: 100%;
    width: 4px;
    background-color: var(--gray300);
    border-top: 4px solid var(--gray100);
    border-bottom: 4px solid var(--gray100);
  }
}

.edit-btn-wrapper {
  position: relative;
  display: flex;

  button {
    margin-left: auto;
    padding: var(--v-rhythm-2);
    border: 2px solid var(--gray700);
    fill: var(--gray700);
    border-radius: 8px;
  }
}

.edit-list {
  padding: var(--v-rhythm-2) 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray500);
  position: absolute;
  top: 50px;
  right: 0;
  background-color: var(--white900);

  .edit-item {
    width: 100%;
    padding: var(--v-rhythm-3);
    color: var(--gray900);
    text-align: left;
    transition-property: all;
    //transition-duration: 0.2s;
    transition-timing-function: ease;
    transition-delay: 0s;
    cursor: pointer;

    &:hover {
      background-color: var(--gray100);
    }
  }
}

.project {
  // центр
  &__description {
    display: flex;
    gap: var(--v-rhythm-8);
  }

  &__description-title {
    width: 203px;
    flex-shrink: 0;
  }

  &__description,
  &__members {
    position: relative;
    padding: var(--v-rhythm-3) 0;
    border-bottom: 1px solid var(--gray300);
  }

  &__members {
    margin-bottom: var(--v-rhythm-8);
  }

  &__description-title,
  &__members-title {
    @extend .subtitle-1;
    color: var(--gray700);
  }

  &__description-content {
    @extend .v-html;
  }

  &__members-title {
    margin-bottom: var(--v-rhythm-8);
  }

  &__single-member {
    display: flex;
    position: relative;

    &:not(:last-child) {
      margin-bottom: var(--v-rhythm-5);
    }
    @include phones {
      flex-direction: column;
    }
  }

  &__role {
    // position: absolute;
    // left: var(--v-rhythm-4);
    // top: 0;
    width: 25%;
    min-width: 120px;
    @extend .body-2;
    @include phones {
      width: 100%;
      padding-bottom: var(--v-rhythm-2);
    }
  }

  &__person {
    // margin-left: 25%;
  }

  // Задачи
  &__tasks-header {
    display: flex;
    justify-content: space-between;
  }

  &__tasks-title {
    @extend .subtitle-1;
    margin-bottom: var(--v-rhythm-5);
  }

  @include phones {
    &__description {
      flex-direction: column;
    }

    &__description-title {
      width: 100%;
    }
  }
}

.page-my-tasks {
  &__table {
    margin-bottom: var(--v-rhythm-4);
  }
}
</style>