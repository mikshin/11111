<template>
  <AppModal
    class="task-modal"
    v-if="isVisible && !isLoading"
    @onClose="$emit('onClose')"
    :maxWidth="'900'"
  >
    <div
      class="task-modal__conent"
      id="modal-conent"
      :class="{ loading: isUpdata }"
    >
      <template v-if="taskData">
        <transition name="fade" v-if="isEditMode">
          <TaskEditing
            class="add-task__task-editing"
            @sendForm="sendForm"
            @cancel="isEditMode = false"
            :modalTitle="`Редактировать задачу №${taskData.ID}`"
            :defaultTitle="taskData.TITLE"
            :defaultDescription="taskData.DESCRIPTION"
            :defaultAccomplices="taskData.ACCOMPLICES"
            :defaultDate="taskData.DEADLINE"
            :defaultFiles="taskData.FILES"
          />
        </transition>
        <transition name="fade" v-else>
          <div class="task-modal__inner">
            <div class="task-modal__top">
              <span class="task-modal__top-id">№{{ taskData.ID }}</span>
              <div
                class="task-modal__top-btns"
                v-if="this.currentUser.ID === taskData.CREATED_BY.ID"
              >
                <FunctionBtn
                  class="task-modal__top-btn"
                  :iconName="'pen'"
                  @clickBtn="enableEditing"
                />

                <TaskModalMoreTooltip
                  :activitiesList="activitiesList.created"
                  @actions="actions"
                  :appendToId="'modal-conent'"
                >
                  <FunctionBtn class="task-modal__top-btn" :iconName="'more'" />
                </TaskModalMoreTooltip>
              </div>
            </div>

            <div class="task-modal__header">
              <span class="task-modal__header-title">{{ taskData.TITLE }}</span>
              <div class="task-modal__header-labels">
                <TaskStatus
                  class="task-modal__header-label"
                  :status="taskData.STATUS"
                />
              </div>
            </div>

            <div class="task-modal__info task-modal-info">
              <div class="task-modal-info__item">
                <span class="task-modal-info__item-title">Описание</span>
                <div
                  class="task-modal-info__item-content v-html"
                  v-html="taskData.DESCRIPTION ? taskData.DESCRIPTION : '-'"
                ></div>
              </div>

              <div class="task-modal-info__item">
                <span class="task-modal-info__item-title">Срок выполнения</span>
                <div class="task-modal-info__item-content">
                  {{ taskData.DEADLINE ? taskData.DEADLINE : "-" }}
                </div>
              </div>

              <div class="task-modal-info__item">
                <span class="task-modal-info__item-title">Постановщик</span>
                <div class="task-modal-info__item-content">
                  <SimplePersonCard
                    class="task-modal-info__item-person"
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

              <div class="task-modal-info__item">
                <span class="task-modal-info__item-title">Ответственный</span>
                <div
                  class="
                    task-modal-info__item-content
                    task-modal-info__item-content--list
                  "
                >
                  <SimplePersonCard
                    class="task-modal-info__item-person"
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

              <div class="task-modal-info__item">
                <span class="task-modal-info__item-title"
                  >Прикрепленные файлы</span
                >
                <div
                  class="
                    task-modal-info__item-content
                    task-modal-info__item-content--list
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

              <div class="task-modal-info__item" v-if="taskData.action">
                <span class="task-modal-info__item-title radio-title">{{
                  taskData.action[0].placeholder
                }}</span>
                <div
                  class="
                    task-modal-info__item-content
                    task-modal-info__item-content--list
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
                  :addFile="true"
                  :isRequiredCommentText="true"
                  recordType="tasks"
                  :requestGetComments="requestGetComments"
                />
              </template>
              <template v-if="tabsActive.name === 'История изменений'">
                <TaskModalHistory :taskId="taskId" />
              </template>
            </div>

            <div class="task-modal__actions-btns" v-if="checkPerformers > -1">
              <template v-for="(btn, i) in activitiesList.accomplices">
                <button
                  class="task-modal__actions-btn"
                  :class="{
                    'secondary-btn': btn.name === 'Завершить задачу',
                    'primary-btn': btn.name != 'Завершить задачу',
                    'secondary-btn secondary-btn--disabled':
                      btn.name === 'Завершить задачу' && !btn.action,
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

      <span class="task-modal__text-default" v-else
        >Нет доступа к просмотру задачи</span
      >
    </div>

    <transition name="fade">
      <TaskModalDeleteModal
        class="task-modal__delete-modal"
        v-if="deleteModalIsVisible"
        :taskId="taskId"
        :taskName="taskData.TITLE"
        @onClose="deleteModalIsVisible = false"
        @deleteTask="$emit('deleteTask')"
      />
    </transition>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";
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
  name: "TaskModal",

  components: {
    AppModal,
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
    isVisible: {
      type: Boolean,
      required: true,
    },

    taskId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      isUpdata: false,
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
        this.isUpdata = true;

        const response = await this.sendNewStatus(newStatusId);

        if (response) {
          await this.writeData();
          this.$emit("updateTask", this.taskData.STATUS);
        }
      } finally {
        this.isUpdata = false;
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
        this.isUpdata = true;
        dataForm.append(`ID`, this.taskData.ID);
        const response = await this.updateData(dataForm);

        if (response) {
          await this.writeData();
          this.$emit("updataTaskList");
          this.isEditMode = false;
        }
      } finally {
        this.isUpdata = false;
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

  watch: {
    taskId() {
      this.downloadData();
    },

    isVisible() {
      this.isEditMode = false;
      this.radioValue = null;
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
.task-modal {
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

.task-modal-info {
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