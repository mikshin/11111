<template>
  <AppModal
    class="ask-question-accruals"
    @onClose="closePopup"
    :maxWidth="'600'"
  >
    <span class="ask-question-accruals__title">Вопрос по начислениям</span>
    <template v-if="!sended">
      <Input
        v-for="(input, i) in inputs"
        :key="i"
        :input="input"
        @onChange="changeInput"
      />
    </template>
    <template v-else>
      <p class="ask-question-accruals__paragraph">Вопрос успешно отправлен</p>
    </template>
    <p class="ask-question-accruals__error">
      {{ errorMessage }}
    </p>
    <div class="ask-question-accruals__button-wrapper">
      <button
        v-if="!sended"
        @click="send"
        class="primary-btn"
        :disabled="!this.formData.questionText || isSending"
        :class="{ loading: isSending }"
      >
        Отправить
      </button>
      <button
        @click="closePopup"
        :class="{ 'secondary-btn': !sended, 'primary-btn': sended }"
      >
        {{ !sended ? "Отменить" : "Закрыть" }}
      </button>
    </div>
  </AppModal>
</template>

<script>
import AppModal from "./AppModal.vue";
import Input from "@/components/UI/inputTemplate.vue";
import axios from "axios";
export default {
  name: "AskQuestionAccruals",

  components: {
    AppModal,
    Input,
  },

  data() {
    return {
      inputs: [
        {
          type: "textarea",
          maxLength: 300,
          placeholder: "Введите свой вопрос",
          required: true,
          name: "questionText",
        },
      ],
      isSending: false,
      sended: false,
      errorMessage: "",
      formData: {
        questionText: "",
      },
    };
  },

  methods: {
    changeInput(data) {
      this.formData[data.data.input.name] = data.data.newValue;
    },
    closePopup() {
      this.$emit("close");
    },
    async send() {
      try {
        this.isSending = true;
        await axios({
          method: "post",
          url: "/mobileapp/api/user/addPaysleepQuestion",
          data: this.formData,
        });
        this.error = "";
        setTimeout(() => {
          this.$emit("close");
        }, 3000);
        this.sended = true;
      } catch (error) {
        this.errorMessage = error.response.data.errorMessage;
      } finally {
        this.isSending = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.ask-question-accruals {
  &__button-wrapper {
    display: flex;
    column-gap: var(--v-rhythm-4);
    margin-top: var(--v-rhythm-9);
  }
  &__title {
    @extend .h3;
    display: block;
    margin-bottom: var(--v-rhythm-4);
  }

  &__paragraph {
    @extend .body-2;
    margin-bottom: var(--v-rhythm-8);
  }
  &__error {
    @extend .caption-2;
    color: var(--red900);
    margin-bottom: var(--v-rhythm-8);
  }

  input {
    margin-bottom: var(--v-rhythm-9);
  }
}

.input_container {
  margin-bottom: var(--v-rhythm-2);
}
</style>