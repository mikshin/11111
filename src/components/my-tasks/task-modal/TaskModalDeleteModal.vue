<template>
  <AppModal class="delete-modal" @onClose="close" :maxWidth="'600'">
    <div class="delete-modal__content" :class="{ loading: isLoading }">
      <div class="delete-modal__title">{{ modalTitle }}</div>
      <div class="delete-modal__text" v-html="modalText"></div>
      <div class="delete-modal__btns" v-if="showBtn">
        <button class="delete-modal__btn primary-btn" @click="deleteTask">
          Да, удалить
        </button>
        <button class="delete-modal__btn secondary-btn" @click="close">
          Нет
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";
import { createFormData } from "@/assets/scripts/scripts.js";

export default {
  name: "TaskModalDeleteModal",

  components: {
    AppModal,
  },

  props: {
    taskId: {
      type: String,
      required: true,
    },

    taskName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      modalTitle: "Удаление задачи",
      modalText: `<p>Вы уверены, что хотите удалить задачу №${this.taskId} <span class="delete-modal__text-warning">${this.taskName}</span>?</p>`,
      showBtn: true,
    };
  },

  computed: {},

  methods: {
    close() {
      this.$emit("onClose");
    },

    async deleteTask() {
      try {
        this.isLoading = true;
        this.showBtn = false;

        const obj = {
          ID: this.taskId,
        };

        const formData = createFormData(obj);

        await axios({
          method: "post",
          url: `/mobileapp/api/task/delete`,
          data: formData,
        });

        this.close();
        this.$emit("deleteTask");
      } catch (error) {
        this.modalTitle = "Внимание!";
        this.modalText = `<p>Ошибка при удалении задачи №${this.taskId} <span class="delete-modal__text-warning">"${this.taskName}"</span>!</p>
        <p>Попробуйте повторить удаление задачи через несколько минут.</p>
        <p>Если ошибка повторится, обратитесь к Администратору сети</p>`;
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.delete-modal {
  &__content {
  }

  &__title {
    margin-bottom: var(--v-rhythm-4);

    @extend .h3;
    color: var(--gray900);
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);

    @extend .body-2;
    color: var(--gray900);
  }

  ::v-deep {
    .delete-modal__text-warning {
      color: var(--red900);
    }
  }

  &__btns {
    display: flex;
    gap: var(--v-rhythm-4);

    margin-top: var(--v-rhythm-8);
  }

  &__btn {
  }
}
</style>