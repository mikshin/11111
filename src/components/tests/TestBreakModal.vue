<template>
  <AppModal
    class="test-break-modal"
    v-if="isVisible"
    @onClose="close"
    :maxWidth="'600'"
  >
    <div class="test-break-modal__content">
      <div class="test-break-modal__title">Прервать прохождение теста?</div>
      <div class="test-break-modal__text">
        В этом случае ваш прогресс не сохранится.
      </div>
      <div class="test-break-modal__btns">
        <button class="test-break-modal__btn primary-btn" @click="close">
          Нет
        </button>
        <button class="test-break-modal__btn secondary-btn" @click="breakTest">
          Да
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";

export default {
  name: "TestBreakModal",

  components: {
    AppModal,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    close() {
      this.$emit("close");
    },

    breakTest() {
      this.$emit("breakTest");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.test-break-modal {
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