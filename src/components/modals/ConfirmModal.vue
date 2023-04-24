<template>
  <AppModal
    class="сonfirm-modal"
    v-if="isVisible"
    @onClose="closeConfirmModal"
    :maxWidth="'600'"
  >
    <div class="сonfirm-modal__content" :class="{ loading: isLoading }">
      <div class="сonfirm-modal__title">Подтвердите действие</div>
      <div class="сonfirm-modal__text">{{ confirmText }}</div>
      <div class="сonfirm-modal__btns">
        <button class="сonfirm-modal__btn primary-btn" @click="submit">
          {{ confirmTextBtn }}
        </button>
        <button
          class="сonfirm-modal__btn secondary-btn"
          @click="closeConfirmModal"
        >
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
  name: "ConfirmModal",

  components: {
    AppModal,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },

    requestParameters: {
      type: Object,
      required: true,
    },

    confirmText: {
      type: String,
      required: true,
    },

    confirmTextBtn: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
    };
  },

  computed: {},

  methods: {
    closeConfirmModal() {
      this.$emit("closeConfirmModal");
    },

    async submit() {
      try {
        this.isLoading = true;
        await axios(this.requestParameters);
        this.$emit("confirmSuccess");
      } catch (error) {
        this.$emit("confirmError", error);
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
.сonfirm-modal {
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