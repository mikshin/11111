<template>
  <AppModal
    class="add-task"
    v-if="isVisible"
    @onClose="closePopup"
    :maxWidth="'600'"
  >
    <TaskEditing
      class="add-task__conent"
      :class="{ loading: isLoading }"
      @sendForm="sendForm"
      @cancel="closePopup"
    />

    <transition name="fade">
      <TaskModalErrorModal
        class="task-modal__error-modal"
        v-if="errorModalIsVisible"
        @onClose="errorModalIsVisible = false"
        @repeatSave="sendForm"
      />
    </transition>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";
import TaskModalErrorModal from "@/components/my-tasks/add-task-modal/TaskModalErrorModal.vue";
import TaskEditing from "@/components/my-tasks/task-editing/TaskEditing.vue";

export default {
  name: "AddTask",

  components: {
    AppModal,
    TaskModalErrorModal,
    TaskEditing,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    type: String,
    projectId: null,
  },

  data() {
    return {
      isLoading: false,
      errorModalIsVisible: false,
      isSended: false,
    };
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit("onClose");
    },

    async sendForm(formData) {
      try {
        this.isLoading = true;
        // for (let [name, value] of this.getDataForm()) {
        //   console.log(`${name} = ${value}`);
        // }

        const response = await this.createTask(formData);
        if (response) this.updataTaskList();
      } finally {
        this.isLoading = false;
      }
    },

    async createTask(data) {
      // let request = {};
      if (this.type === "project") {
        data.append("UF_TASK_PROJECT", this.projectId);
      }
      try {
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/task/create`,
          data: data,
        });
        return response.data;
      } catch (error) {
        this.errorModalIsVisible = true;
      }
    },

    updataTaskList() {
      this.closePopup();
      this.$emit("updataTaskList");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.add-task {
  &__conent {
  }
}
</style>