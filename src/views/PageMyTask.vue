<template>
  <AppPage
    class="page-my-task"
    :breadcrumbsDopName="` №${this.$route.params.id}`"
  >
    <div
      class="page-my-task__conent"
      id="modal-conent"
      :class="{ loading: isLoading }"
    >
      <template v-if="taskData">
        <transition name="fade" v-if="isEditMode">
          <TaskEditing
            class="add-task__task-editing"
            @sendForm="sendForm"
            @cancel="isEditMode = false"
            :modalTitle="`Редактировать задачу №${taskId}`"
            :defaultTitle="taskData.TITLE"
            :defaultDescription="taskData.DESCRIPTION"
            :defaultAccomplices="taskData.ACCOMPLICES"
            :defaultDate="taskData.DEADLINE"
            :defaultFiles="taskData.FILES"
          />
        </transition>

        <transition name="fade" v-else>
          <div class="page-my-task__inner">
            <div class="page-my-task__top">
              <span class="page-my-task__top-id">№{{ taskId }}</span>
              <div
                class="page-my-task__top-btns"
                v-if="this.currentUser.ID === taskData.CREATED_BY.ID"
              >
                <FunctionBtn
                  class="page-my-task__top-btn"
                  :iconName="'pen'"
                  @clickBtn="enableEditing"
                />

                <TaskModalMoreTooltip
                  :activitiesList="activitiesList.created"
                  @actions="actions"
                  :appendToId="'modal-conent'"
                >
                  <FunctionBtn
                    class="page-my-task__top-btn"
                    :iconName="'more'"
                  />
                </TaskModalMoreTooltip>
              </div>
            </div>

            <div class="page-my-task__header">
              <span class="page-my-task__header-title">{{
                taskData.TITLE
              }}</span>
              <div class="page-my-task__header-labels">
                <TaskStatus
                  class="page-my-task__header-label"
                  :status="taskData.STATUS"
                />
              </div>
            </div>

            <div class="page-my-task__info page-my-task-info">
              <div class="page-my-task-info__item">
                <span class="page-my-task-info__item-title">Описание</span>
                <div
                  class="page-my-task-info__item-content"
                  v-html="taskData.DESCRIPTION ? taskData.DESCRIPTION : '-'"
                ></div>
              </div>

              <div class="page-my-task-info__item">
                <span class="page-my-task-info__item-title"
                  >Срок выполнения</span
                >
                <div class="page-my-task-info__item-content">
                  {{ taskData.DEADLINE ? taskData.DEADLINE : "-" }}
                </div>
              </div>

              <div class="page-my-task-info__item">
                <span class="page-my-task-info__item-title">Постановщик</span>
                <div class="page-my-task-info__item-content">
                  <SimplePersonCard
                    class="page-my-task-info__item-person"
                    :avatar="{
                      alt: taskData.CREATED_BY.FULL_NAME,
                      src: taskData.CREATED_BY.USER_PHOTO,
                    }"
                    :fullName="taskData.CREATED_BY.FULL_NAME"
                    :isMiniSize="true"
                    :link="true"
                    :id="taskData.CREATED_BY.ID"
                    :vacation="taskData.CREATED_BY.VACATION"
                    :fired="taskData.CREATED_BY.FIRED"
                  />
                </div>
              </div>

              <div class="page-my-task-info__item">
                <span class="page-my-task-info__item-title">Ответственный</span>
                <div
                  class="
                    page-my-task-info__item-content
                    page-my-task-info__item-content--list
                  "
                >
                  <SimplePersonCard
                    class="page-my-task-info__item-person"
                    v-for="person in taskData.ACCOMPLICES"
                    :key="person.ID"
                    :avatar="{
                      alt: person.FULL_NAME,
                      src: person.USER_PHOTO,
                    }"
                    :fullName="person.FULL_NAME"
                    :isMiniSize="true"
                    :link="true"
                    :id="person.ID"
                    :vacation="person.VACATION"
                    :fired="person.FIRED"
                  />
                </div>
              </div>

              <div class="page-my-task-info__item">
                <span class="page-my-task-info__item-title"
                  >Прикрепленные файлы</span
                >
                <div
                  class="
                    page-my-task-info__item-content
                    page-my-task-info__item-content--list
                  "
                >
                  <template v-if="taskData.FILES">
                    <AppDocument
                      v-for="file in taskData.FILES"
                      :key="file.fileId"
                      :fileTitle="file.originalName"
                      :fileSize="file.fileSize"
                      :fileExtension="file.extension"
                      :fileLink="file.fileLink"
                    />
                  </template>
                  <template v-else>-</template>
                </div>
              </div>

              <div class="page-my-task-info__item" v-if="taskData.action">
                <span class="page-my-task-info__item-title radio-title">{{
                  taskData.action[0].placeholder
                }}</span>
                <div
                  class="
                    page-my-task-info__item-content
                    page-my-task-info__item-content--list
                  "
                >
                  <Input
                    :input="{
                      ...taskData.action[0],
                      defaultValue: taskData.UF_ACTION_TASK,
                    }"
                    @onChange="handleRadio"
                  />
                </div>
              </div>
            </div>

            <TabsNav
              :tabs="tabs"
              v-if="tabs"
              :activeTabObj="tabsActive"
              @changeTab="(e) => (tabsActive = e)"
            />
            <div class="tasks-tabs">
              <template v-if="tabsActive.name === 'Комментарии'">
                <Comments
                  :entryId="taskId"
                  recordType="tasks"
                  :addFile="true"
                  :isWhiteBg="true"
                  :requestGetComments="requestGetComments"
                />
              </template>
              <template v-if="tabsActive.name === 'История изменений'">
                <TaskModalHistory :taskId="taskId" />
              </template>
            </div>

            <div class="page-my-task__actions-btns" v-if="checkPerformers > -1">
              <template v-for="(btn, i) in activitiesList.accomplices">
                <button
                  class="page-my-task__actions-btn"
                  :class="{
                    'secondary-btn': btn.name === 'Завершить задачу',
                    'primary-btn': btn.name != 'Завершить задачу',
                    'secondary-btn secondary-btn--disabled':
                      btn.name === 'Завершить задачу' && !radioValue,
                  }"
                  v-if="btn.action"
                  :key="i"
                  @click="changeTaskStatus(btn.stage_id_new)"
                >
                  {{ btn.name }}
                </button>
              </template>
            </div>
          </div>
        </transition>
      </template>

      <span class="page-my-task__text-default" v-else
        >Нет доступа к просмотру задачи</span
      >
    </div>

    <transition name="fade">
      <TaskModalDeleteModal
        class="page-my-task__delete-modal"
        v-if="deleteModalIsVisible"
        :taskId="taskId"
        :taskName="taskData.TITLE"
        @onClose="deleteModalIsVisible = false"
        @deleteTask="deleteTask"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
import TaskModalMoreTooltip from "@/components/my-tasks/task-modal/TaskModalMoreTooltip.vue";
import TaskModalDeleteModal from "@/components/my-tasks/task-modal/TaskModalDeleteModal.vue";
import TaskModalHistory from "@/components/my-tasks/task-modal/TaskModalHistory.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import Comments from "@/components/pages/news/comments.vue";
import TaskEditing from "@/components/my-tasks/task-editing/TaskEditing.vue";
import Input from "@/components/UI/inputTemplate.vue";
import TaskStatus from "@/components/UI/labels/TaskStatus.vue";
import { dateConverter } from "@/assets/scripts/scripts.js";
import FunctionBtn from "@/components/UI/FunctionBtn.vue";

import { createFormData } from "@/assets/scripts/scripts.js";
export default {
  name: "PageMyTask",

  components: {
    AppPage,
    SimplePersonCard,
    AppDocument,
    TaskModalMoreTooltip,
    TaskModalDeleteModal,
    TabsNav,
    TaskModalHistory,
    Comments,
    TaskEditing,
    Input,
    TaskStatus,
    FunctionBtn,
  },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      taskId: this.$route.params.id,
      isLoading: false,
      taskData: null,
      activitiesList: null,
      deleteModalIsVisible: false,
      tabsActive: {
        name: "Комментарии",
      },
      isEditMode: false,
      radioValue: null,
    };
  },

  computed: {
    requestGetComments() {
      return {
        url: "/mobileapp/api/task/comment",
        params: { taskId: this.taskId },
      };
    },

    tabs() {
      return [
        {
          name: "Комментарии",
        },
        {
          name: "История изменений",
        },
      ];
    },

    checkPerformers() {
      return this.taskData?.ACCOMPLICES.findIndex(
        (item) => item.ID === this.currentUser.ID
      );
    },

    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    deleteTask() {
      this.$router.push("/my_tasks");
    },

    getDataModal() {
      let form = new FormData();

      form.append("DEADLINE", dateConverter(this.taskData.DEADLINE, true));
      form.append("UF_ACTION_TASK", this.taskData.UF_ACTION_TASK);
      if (this.taskData.FILE_ID.length > 0) {
        for (let val in this.taskData.FILE_ID) {
          form.append(`FILES_OLD[]`, this.taskData.FILE_ID[val]);
        }
      }

      return form;
    },

    handleRadio(data) {
      this.radioValue = data.data.newValue.code;
      this.taskData.UF_ACTION_TASK = this.radioValue;
      this.sendForm(this.getDataModal());
    },

    enableEditing() {
      this.isEditMode = true;
    },

    // Получаем данные
    async downloadData() {
      try {
        this.isLoading = true;
        await this.writeData();
      } finally {
        this.isLoading = false;
        if (!this.taskData.action) {
          this.radioValue = true;
        }
      }
    },

    async writeData() {
      const responseActivities = await this.getActivitiesList();
      if (responseActivities) {
        this.activitiesList = responseActivities;

        const responseData = await this.getData();
        this.taskData = responseData;
      } else {
        this.taskData = null;
        this.activitiesList = null;
      }
    },

    async getData() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/task/showTask?ID=${this.taskId}`,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    // Получаем кнопки доступные пользователю
    async getActivitiesList() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/task/checkUserTaskRight?ID=${this.taskId}`,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    // Меняем статус задачи
    async changeTaskStatus(newStatusId) {
      try {
        this.isLoading = true;

        const response = await this.sendNewStatus(newStatusId);

        if (response) await this.writeData();
      } finally {
        this.isLoading = false;
      }
    },

    async sendNewStatus(newStatusId) {
      try {
        const obj = {
          TASK_ID: this.taskId,
          STATUS_ID: newStatusId,
        };

        const formData = createFormData(obj);

        const response = await axios({
          method: "post",
          url: `/mobileapp/api/task/changeStatus`,
          data: formData,
        });
        return response.data;
      } catch (error) {
        alert("Произошла ошибка, попробуйте позже");
        return null;
      }
    },

    // Обновляем задачу
    async sendForm(dataForm) {
      try {
        this.isLoading = true;
        dataForm.append(`ID`, this.taskId);
        const response = await this.updateData(dataForm);

        if (response) {
          await this.writeData();
          this.isEditMode = false;
        }
      } finally {
        this.isLoading = false;
      }
    },

    async updateData(dataForm) {
      try {
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/task/update`,
          data: dataForm,
        });
        return response.data;
      } catch (error) {
        alert("Произошла ошибка! Попробуйте еще раз");
        return null;
      }
    },

    actions(btn) {
      if (btn.name === "Удалить") {
        this.deleteModalIsVisible = true;
      } else {
        this.changeTaskStatus(btn.stage_id_new);
      }
    },
  },

  watch: {},

  mounted() {
    this.downloadData();
  },
};
</script>

<style scoped lang="scss">
.page-my-task {
  &__conent {
  }

  &__inner {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-4);
  }

  &__top-id {
    @extend .body-2;
    color: var(--gray900);
  }

  &__top-btns {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-4);
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__header-title {
    @extend .h3;
    color: var(--gray900);
  }

  &__header-labels {
  }

  &__info {
    width: 100%;
  }

  &__tabs {
  }

  &__actions-btns {
    display: flex;
    gap: var(--v-rhythm-4);
  }

  &__text-default {
    @extend .body-2;
    color: var(--gray900);
  }

  @include phones {
    &__actions-btns {
      flex-direction: column;
    }
  }
}

.radio-title:after {
  content: " *";
  color: var(--red900);
}

.page-my-task-info {
  &__item {
    width: 100%;
    padding: var(--v-rhythm-3) 0;

    display: flex;
    gap: var(--v-rhythm-8);

    border-bottom: 2px solid var(--gray200);
  }

  &__item-title {
    width: calc(203 * 100% / 764);

    @extend .subtitle-1;
    color: var(--gray700);
    word-break: break-word;
  }

  &__item-content {
    width: calc(529 * 100% / 764);

    @extend .body-2;
    color: var(--gray900);
    word-break: break-word;

    // Подключаем дефолтные стили
    @extend .v-html;

    &--list {
      display: flex;
      flex-direction: column;
      gap: var(--v-rhythm-2);
    }
  }

  &__item-person {
  }

  @include phones {
    &__item {
      flex-direction: column;
      gap: var(--v-rhythm-2);
    }

    &__item-title {
      width: 100%;
    }

    &__item-content {
      width: 100%;
    }
  }
}
</style>