<template>
  <AppModal
    v-if="dataObj.isOpen"
    @onClose="onClose"
    :isOpen="dataObj.isOpen"
    :maxWidth="'600'"
  >
    <div class="thanks-modal">
      <template v-if="!isSent">
        <span class="thanks-modal__title"> Поблагодарить пользователя </span>
        <span class="thanks-modal__subtitle"
          >{{ dataObj.fullName }} получит ваше сообщение</span
        >

        <form @submit.prevent="sendThanks" class="thanks-modal__form">
          <Input
            class="thanks-modal__input"
            :input="{ type: 'textarea', maxLength: 150, name: 'text' }"
            @onChange="(data) => (thanksText = data.data.newValue)"
          />
          <div class="thanks-modal__btns">
            <button class="primary-btn" type="submit">Поблагодарить</button
            ><button class="secondary-btn" @click="onClose" type="reset">
              Отменить
            </button>
          </div>
        </form>
      </template>

      <span class="thanks-modal__title" v-else
        >Ваша благодарность успешно отправлена.</span
      >
    </div>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";
import Input from "../UI/inputTemplate.vue";

export default {
  name: "ThanksModal",

  components: {
    AppModal,
    Input,
  },

  props: {
    dataObj: {
      type: Object,
      required: true,
      default: () => {
        return {
          isOpen: false,
          id: "",
          fullName: "",
        };
      },
    },
  },

  data() {
    return {
      thanksText: "",
      isSent: false,
    };
  },

  methods: {
    sendThanks() {
      axios
        .post("/mobileapp/api/gratitude/add/", {
          recipientId: this.dataObj.id,
          text: this.thanksText,
        })
        .then(() => {
          this.isSent = true;
          setTimeout(() => {
            this.onClose();
            this.isSent = false;
          }, 1000);
        });
    },

    onClose() {
      this.$emit("onClose");
    },
  },
};
</script>

<style lang="scss" scoped>
.thanks-modal {
  color: var(--gray900);

  &__title {
    display: block;

    margin-bottom: var(--v-rhythm-4);

    @extend .h3;
  }

  &__subtitle {
    display: block;

    margin-bottom: var(--v-rhythm-8);

    @extend .body-2;
  }

  &__form {
  }

  &__input {
    width: 100%;
    margin-bottom: var(--v-rhythm-8);
  }

  &__btns {
    width: 100%;

    display: flex;
    gap: var(--v-rhythm-4);
  }
}
</style>