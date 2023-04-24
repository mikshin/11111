<template>
  <div class="event-calendar-tasks">
    <div class="event-calendar-tasks__list">
      <div
        class="event-calendar-tasks__item event-calendar-task"
        v-for="task in listTasks"
        :key="task.id"
        @click="openTaskModal(task.id)"
      >
        <TaskStatus class="event-calendar-task__label" :status="task.status" />

        <div class="event-calendar-task__info">
          <div class="event-calendar-task__title">
            {{ task.name }}
          </div>
          <div class="event-calendar-task__deadline">
            {{ setDeadline(task.deadline) }}
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <TaskModal
        class="event-calendar-tasks__modal"
        :isVisible="taskModalIsOpen"
        :taskId="taskModalId"
        @onClose="taskModalIsOpen = false"
        @updateTask="updateTask"
        @deleteTask="deleteTask"
        @updataTaskList="updataTaskList"
      />
    </transition>
  </div>
</template>

<script>
import TaskStatus from "@/components/UI/labels/TaskStatus.vue";
import TaskModal from "@/components/my-tasks/task-modal/TaskModal.vue";

export default {
  name: "DayCalendarTasks",

  components: {
    TaskStatus,
    TaskModal,
  },

  props: {
    listTasks: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      taskModalIsOpen: false,
      taskModalId: "",
    };
  },

  methods: {
    openTaskModal(taskId) {
      this.taskModalId = taskId;
      this.taskModalIsOpen = true;
    },

    deleteTask() {
      this.updataTaskList();
      this.taskModalIsOpen = false;
    },

    updateTask(newStatus) {
      this.$emit("updateTask", { taskId: this.taskModalId, status: newStatus });
    },

    updataTaskList() {
      this.$emit("updataTaskList");
    },
  },

  computed: {
    setDeadline() {
      return (e) => {
        return `Срок выполнения ${e.split(" ")[0]}`;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.event-calendar-tasks {
  &__list {
    padding: var(--v-rhythm-1) var(--v-rhythm-4);

    display: flex;
    flex-direction: column;

    background-color: var(--white900);
  }

  &__item {
    &:not(:last-child) {
      border-bottom: 1px solid var(--gray300);
    }
  }

  &__modal {
  }
}

.event-calendar-task {
  padding: var(--v-rhythm-3) 0;

  cursor: pointer;
  @include transition(opacity);

  @include hover {
    .event-calendar-task__title {
      color: var(--red900);
    }
  }

  &:active {
    opacity: var(--active-opacity);
  }

  &__label {
    margin-bottom: var(--v-rhythm-3);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-3);
  }

  &__title {
    color: var(--gray900);
    @extend .body-2;

    @include transition(color);
  }

  &__deadline {
    @extend .caption-1;
    color: var(--gray500);
  }
}
</style>