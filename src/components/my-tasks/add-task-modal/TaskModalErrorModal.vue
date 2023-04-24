<template>
  <AppModal class="error-modal" @onClose="close" :maxWidth="'600'">
    <div class="error-modal__content">
      <div class="error-modal__title">Внимание!</div>
      <div class="error-modal__text">
        <p>Ошибка при создании задачи!</p>
        <p>Попробуйте повторить сохранение задачи через несколько минут.</p>
        <p>Если ошибка повторится, обратитесь к Администратору сети</p>
      </div>
      <div class="error-modal__btns">
        <button
          class="error-modal__btn primary-btn"
          @click="repeatSave"
          :disabled="countDown > 0"
        >
          {{ repeatText }}
        </button>
        <button class="error-modal__btn secondary-btn" @click="close">
          Вернуться к задаче
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";

export default {
  name: "TaskModalErrorModal",

  components: {
    AppModal,
  },

  props: {},

  data() {
    return {
      countDown: 120,
    };
  },

  computed: {
    repeatText() {
      return this.countDown > 0
        ? `Повторить (через ${this.countDown} сек.)`
        : "Повторить";
    },
  },

  methods: {
    close() {
      this.$emit("onClose");
    },

    repeatSave() {
      this.$emit("repeatSave");

      this.close();
    },

    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
  },

  watch: {},

  mounted() {
    this.countDownTimer();
  },
};
</script>

<style scoped lang="scss">
.error-modal {
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

  &__btns {
    display: flex;
    gap: var(--v-rhythm-4);

    margin-top: var(--v-rhythm-8);
  }

  &__btn {
  }
}
</style>