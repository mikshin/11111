<template>
  <AppModal
    class="birthday-reminder-modal"
    v-if="isVisible"
    @onClose="closePopup"
    :maxWidth="'600'"
  >
    <div
      class="birthday-reminder-modal__content"
      :class="{ loading: isLoading }"
    >
      <div class="birthday-reminder-modal__title">
        {{ message }}
      </div>
    </div>
  </AppModal>
</template>

<script>
import axios from "axios";

import AppModal from "@/components/modals/AppModal.vue";
export default {
  name: "BirthdayReminderModal",

  components: {
    AppModal,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },

    user: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      message: "",
      isLoading: false,
    };
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    async sendReminder() {
      try {
        this.message = "";

        this.isLoading = true;
        await axios({
          method: "post",
          url: `/mobileapp/api/birthday/addReminder/`,
          data: {
            birthdayUserId: this.user.ID,
          },
        });
        this.message = "Напоминание добавлено!";

        this.$emit("sended");
      } catch (error) {
        this.message = "Произошла ошибка! Попробуйте позже";
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          this.closePopup();
        }, 3000);
      }
    },
  },

  watch: {
    isVisible() {
      if (this.isVisible) this.sendReminder();
    },
  },

  mounted() {
    this.sendReminder();
  },
};
</script>

<style scoped lang="scss">
.birthday-reminder-modal {
  &__content {
  }

  &__title {
    @extend .h3;
    color: var(--gray900);
  }
}
</style>