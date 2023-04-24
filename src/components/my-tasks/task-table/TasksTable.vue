<template>
  <div class="tasks-table">
    <table class="tasks-table__table">
      <thead class="tasks-table__thead">
        <tr class="tasks-table__thead-tr">
          <th class="tasks-table__th" v-for="(th, i) in tableHead" :key="i">
            {{ th }}
          </th>
        </tr>
      </thead>
      <tbody class="tasks-table__tbody">
        <TasksTableTr
          class="tasks-table__tbody-tr"
          v-for="task in tasks"
          :key="task.ID"
          :task="task"
          @openTaskModal="openTaskModal"
        />
      </tbody>
      <div :key="'table'" v-if="!end" v-intersection="update"></div>
    </table>
  </div>
</template>

<script>
import TasksTableTr from "@/components/my-tasks/task-table/TasksTableTr.vue";

export default {
  name: "TasksTable",

  components: {
    TasksTableTr,
  },

  props: {
    tasks: {
      type: Array,
      required: true,
    },

    end: {
      type: Boolean,
      required: true,
    },

    startFrom: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      tableHead: [
        "Название задачи",
        "Активность",
        "Срок выполнения",
        "Постановщик",
        "Ответственный",
        "Статус",
      ],
    };
  },

  computed: {},

  methods: {
    update() {
      this.$emit("updata");
    },
    openTaskModal(taskId) {
      this.$emit("openTaskModal", taskId);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.tasks-table {
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  &__table {
    width: 100%;

    border: 1px solid var(--gray300);
    border-collapse: collapse;
  }

  &__thead {
    background-color: var(--gray100);
  }

  &__thead-tr {
  }

  &__th {
    padding: var(--v-rhythm-4);

    @extend .caption-2;
    color: var(--gray700);
    text-align: left;

    &:not(:last-child) {
      border-right: 1px solid var(--gray300);
    }
  }

  &__tbody {
    background-color: var(--white900);
  }

  &__tbody-tr {
    border-top: 1px solid var(--gray300);
  }
}
</style>