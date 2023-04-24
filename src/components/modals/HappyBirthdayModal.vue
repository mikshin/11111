<template>
  <AppModal
    class="happy-birthday-modal"
    v-if="isVisible"
    @onClose="closePopup"
    :maxWidth="'600'"
  >
    <div class="happy-birthday-modal__content" :class="{ loading: isLoading }">
      <div class="happy-birthday-modal__title">
        <template v-if="!success">Поздравление с днем рождения</template>
        <template v-else>Поздравление отправлено!</template>
      </div>

      <div class="happy-birthday-modal__subtitle">
        <template v-if="!success"
          >{{ user.FULL_NAME }} получит ваше сообщение</template
        >
        <template v-else
          >Просмотреть отправленные и полученные поздравления можно в личном
          кабинете</template
        >
      </div>

      <form class="happy-birthday-modal__form" v-if="!success" @submit.prevent>
        <Input
          class="happy-birthday-modal__input"
          :input="{
            type: 'textarea',
            name: 'text',
            autoResize: isResizeable,
            placeholder: 'Текст поздравления',
            required: true,
            maxLength: 500,
            autocomplete: 'off',
            defaultValue: message,
          }"
          @onChange="change"
        />
        <div class="happy-birthday-modal__actions">
          <button
            class="primary-btn"
            :disabled="!message"
            @click="sendCongratulations"
          >
            Подтвердить
          </button>
          <button class="secondary-btn" @click="closePopup">Отменить</button>
        </div>
      </form>

      <button v-else class="primary-btn" @click="closePopup">Отлично</button>
    </div>
  </AppModal>
</template>

<script>
import axios from "axios";

import AppModal from "@/components/modals/AppModal.vue";
import Input from "@/components/UI/inputTemplate.vue";
export default {
  name: "HappyBirthdayModal",

  components: {
    AppModal,
    Input,
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

    isResizeable: {
      type: Boolean,
      requires: false,
    },
  },

  data() {
    return {
      isLoading: false,
      message: "",
      success: false,
    };
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    change(data) {
      this.message = data.data.newValue;
    },

    async sendCongratulations() {
      try {
        this.isLoading = true;
        await axios({
          method: "post",
          url: `/mobileapp/api/birthday/add`,
          data: {
            recipientId: this.user.ID,
            text: this.message,
          },
        });

        this.success = true;
        this.message = "";
      } catch (error) {
        alert("Произошла ошибка! Попробуйте повторить через несколько минут");
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {
    isVisible() {
      this.success = false;
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
.happy-birthday-modal {
  &__content {
  }

  &__title {
    margin-bottom: var(--v-rhythm-4);

    @extend .h3;
    color: var(--gray900);
  }

  &__subtitle {
    margin-bottom: var(--v-rhythm-8);

    @extend .body-2;
    color: var(--gray900);
  }

  &__form {
    width: 100%;
  }

  &__input {
    margin-bottom: var(--v-rhythm-8);
  }

  &__actions {
    display: flex;
    gap: var(--v-rhythm-4);
  }
}
</style>