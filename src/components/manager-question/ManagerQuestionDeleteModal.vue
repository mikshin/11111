<template>
  <AppModal class="delete-modal" @onClose="close" :maxWidth="'600'">
    <div class="delete-modal__content" :class="{ loading: isLoading }">
      <div class="delete-modal__title">{{ modalTitle }}</div>
      <div class="delete-modal__text" v-html="modalText"></div>
      <div class="delete-modal__btns" v-if="showBtn">
        <button class="delete-modal__btn primary-btn" @click="deleteEvent">
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

export default {
  name: "ManagerQuestionDeleteModal",

  components: {
    AppModal,
  },

  props: {
    questionId: {
      type: String,
      required: true,
    },

    questionName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      modalTitle: "Удаление вопроса",
      modalText: `<p>Вы уверены, что хотите удалить вопрос <span class="delete-modal__text-warning">"${this.questionName}"</span>?</p>`,
      showBtn: true,
    };
  },

  computed: {},

  methods: {
    close() {
      this.$emit("onClose");
    },

    async deleteEvent() {
      try {
        this.isLoading = true;
        this.showBtn = false;

        await axios({
          method: "post",
          url: `/mobileapp/api/question/delete`,
          data: {
            questionId: this.questionId,
          },
        });

        this.close();
        this.$emit("onDelete");
      } catch (error) {
        this.modalTitle = "Внимание!";
        this.modalText = `<p>Ошибка при удалении вопроса <span class="delete-modal__text-warning">"${this.questionName}"</span>!</p>
        <p>Попробуйте повторить удаление через несколько минут.</p>
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