<template>
  <div class="tasks-gantt">
    <VueDjGantt
      class="tasks-gantt__table"
      :from="maxMinDate.minDate"
      :to="maxMinDate.maxDate"
      :list="list"
      :rows="ganttData.rows"
      :items="ganttData.items"
      locale="ru"
      @row="openTaskModal"
    />
    <div :key="'table'" v-if="!end" v-intersection="$emit('updata')"></div>
  </div>
</template>

<script>
import VueDjGantt from "vue-dj-gantt";
import { mapGetters } from "vuex";

export default {
  name: "TasksGantt",

  components: {
    VueDjGantt,
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
  },

  data() {
    return {};
  },

  computed: {
    ganttData() {
      const data = {
        rows: [],
        items: [],
      };

      this.tasks.forEach((i) => {
        const row = {};
        (row.id = i.ID),
          (row.internalId = `#${i.ID}`),
          (row.name = i.TITLE),
          data.rows.push(row);

        const item = {};
        item.rowId = i.ID;
        item.style = { background: this.getColorStatus(i.STATUS) };
        item.time = {
          start: this.modifDate(i.CREATED_DATE),
          end: this.modifDate(i.DEADLINE),
        };
        data.items.push(item);
      });

      return data;
    },

    maxMinDate() {
      const maxMin = {};
      const minArr = [];
      const maxArr = [];

      this.tasks.forEach((item) => {
        minArr.push(this.modifDate(item.CREATED_DATE));
        item.DEADLINE ? maxArr.push(this.modifDate(item.DEADLINE)) : null;
      });

      maxMin.minDate = Math.min(...minArr);

      const max = Math.max(...maxArr);
      maxMin.maxDate =
        (max >= Date.now() ? max : Date.now()) + 2 * 24 * 60 * 60 * 1000;

      return maxMin;
    },

    ...mapGetters(["browserWindowWidth"]),

    widthTaskName() {
      return this.browserWindowWidth > 767 ? 200 : 100;
    },

    list() {
      return [
        {
          id: "name",
          width: this.browserWindowWidth > 767 ? 200 : 100,
          header: {
            // content: "Задачи",
          },
        },
      ];
    },
  },

  methods: {
    modifDate(dateString) {
      if (dateString) {
        const dateObj = dateString.split(" ");
        dateObj[0] = dateObj[0].split(".").reverse().join("-");
        dateString = dateObj.join(" ");
        return new Date(dateString).getTime();
      } else {
        // Получаем текущую дату и добавляем время на конец дня
        const currentDate = new Date().toISOString().split("T")[0];
        const currentDateEnd = `${currentDate} 23:59:59`;
        return new Date(currentDateEnd).getTime();
      }
    },

    getColorStatus(status) {
      let color;
      if (status === "Ждет выполнения") {
        color = "#AB052D";
      } else if (status === "Выполняется") {
        color = "#E8505B";
      } else if (status === "Завершена") {
        color = "#05AB83";
      } else if (status === "Отложена") {
        color = "#A5B2BA";
      } else if (status === "Просрочена") {
        color = "#2B3444";
      }
      return color;
    },

    openTaskModal(e) {
      this.$emit("openTaskModal", e.id);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style lang="scss">
.tasks-gantt {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  &__table {
    @include no-hover {
      margin-bottom: 20px;
    }
  }
}

// Переопределяем стили библиотеки
.gantt {
  background: none !important;
}
.gantt-data-header-slot-label {
  div:nth-child(2) {
    display: none;
  }
}
.gantt-data-header-slot {
  border: none !important;
}
.gantt .gantt-data .gantt-data-header {
  background: none !important;
}
.gantt .gantt-data .gantt-data-wrap-with-scroll .gantt-data-cell {
  border: none !important;
}

.gantt .gantt-data .gantt-data-header,
.gantt .gantt-data .gantt-data-wrap-with-scroll .gantt-data-cell,
.gantt .gantt-rows .gantt-row .gantt-row-header {
  background: none !important;
  border: none !important;
}

.gantt .gantt-rows .gantt-row-header-data .gantt-row-header-data-row {
  background: var(--white900) !important;
  border: 1px solid var(--gray300) !important;
  border-radius: 4px;
}

.gantt .gantt-data .gantt-data-wrap-with-scroll .gantt-data-item {
  border-radius: 8px !important;
}

.gantt
  .gantt-data
  .gantt-data-header
  .gantt-data-header-calendar-wrap
  .gantt-data-header-calendar
  .gantt-data-header-calendar-date,
.gantt
  .gantt-data
  .gantt-data-header
  .gantt-data-header-slots-wrap
  .gantt-data-header-slots
  .gantt-data-header-slot {
  background: var(--gray100) !important;
}

.gantt .gantt-data .gantt-data-wrap-with-scroll .gantt-data-y-scroll {
  display: none;
}
.gantt .gantt-data .gantt-data-x-scroll {
  overflow-x: auto !important;
}

@include no-hover {
  .gantt .gantt-data .gantt-data-x-scroll {
    bottom: 0 !important;
    height: 100% !important;
  }
}
</style>