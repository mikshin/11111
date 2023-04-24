<template>
  <AppModal class="success-modal" @onClose="closePopup" :maxWidth="'600'">
    <div class="success-modal__content">
      <div class="success-modal__title">
        {{ successText }}
      </div>

      <div class="success-modal__btns">
        <button class="secondary-btn" @click="closePopup">
          {{ successBtnText }}
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";

export default {
  name: "SuccessModal",

  components: {
    AppModal,
  },

  props: {
    successText: {
      type: String,
      required: true,
    },
    successBtnText: {
      type: String,
      default: "Ок",
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit("onClose");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.success-modal {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__title {
    @extend .h3;
    color: var(--gray900);
  }

  &__btns {
  }
}
</style>