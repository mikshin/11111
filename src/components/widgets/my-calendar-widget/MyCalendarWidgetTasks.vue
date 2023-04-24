<template>
  <div class="my-calendar-widget-tasks">
    <ul class="my-calendar-widget-tasks__list" v-if="listTasks.length > 0">
      <li
        class="my-calendar-widget-tasks__task my-calendar-widget-task"
        v-for="item in listTasks"
        :key="item.id"
        @click="openTaskModal(item.id)"
      >
        <TaskStatus
          class="my-calendar-widget-task__label"
          :status="item.status"
        />

        <span class="my-calendar-widget-task__title">{{ item.name }}</span>

        <span class="my-calendar-widget-task__deadline"
          >Срок выполнения {{ item.deadline.slice(0, -9) }}</span
        >
      </li>
    </ul>

    <span class="my-calendar-widget-tasks__text-default" v-else
      >На выбранную дату задач нет</span
    >

    <button
      class="my-calendar-widget-tasks__add-btn primary-btn"
      @click="addModalIsOpen = true"
    >
      Создать задачу
    </button>

    <transition name="fade">
      <TaskModal
        class="my-calendar-widget-tasks__task-modal"
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
        class="my-calendar-widget-tasks__add-task"
        :isVisible="addModalIsOpen"
        @onClose="addModalIsOpen = false"
        @updataTaskList="updataTaskList"
      />
    </transition>
  </div>
</template>

<script>
import TaskStatus from "@/components/UI/labels/TaskStatus.vue";
import TaskModal from "@/components/my-tasks/task-modal/TaskModal.vue";
import AddTask from "@/components/my-tasks/add-task-modal/AddTask.vue";

export default {
  name: "MyCalendarWidgetTasks",

  components: {
    TaskStatus,
    TaskModal,
    AddTask,
  },

  props: {
    listTasks: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      addModalIsOpen: false,

      taskModalIsOpen: false,
      taskModalId: "",
    };
  },

  computed: {},

  methods: {
    openTaskModal(taskId) {
      this.taskModalId = taskId;
      this.taskModalIsOpen = true;
    },

    updateTask(newStatus) {
      this.$emit("updateTask", { taskId: this.taskModalId, status: newStatus });
    },

    deleteTask() {
      this.updataTaskList();
      this.taskModalIsOpen = false;
    },

    updataTaskList() {
      this.$emit("updataTaskList");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.my-calendar-widget-tasks {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--v-rhythm-8);

  &__list {
    width: 100%;
    height: 292px;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__task {
  }

  &__text-default {
    @extend .body-1;
    color: var(--gray900);
  }

  &__add-btn {
    width: 100%;
  }
}
.my-calendar-widget-task {
  display: flex;
  flex-direction: column;

  cursor: pointer;
  @include transition(opacity);

  @include hover {
    .my-calendar-widget-task__title {
      color: var(--red900);
    }
  }

  &:active {
    opacity: var(--active-opacity);
  }

  &__label {
    margin-bottom: var(--v-rhythm-3);
  }

  &__title {
    margin-bottom: var(--v-rhythm-2);

    @extend .body-1;
    color: var(--gray900);

    @include transition(color);
  }

  &__deadline {
    @extend .caption-1;
    color: var(--gray500);
  }
}
</style>