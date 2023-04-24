<template>
  <form
    class="reset"
    @submit.prevent="checkMail"
    :class="{ loading: isLoading }"
  >
    <template v-if="!isSended">
      <span class="reset__text">Введите рабочую почту</span>
      <Input :input="input" @onChange="update" />
      <span v-html="error"></span>
      <button
        class="reset__button primary-btn"
        type="submit"
        :disabled="!isDisabled"
      >
        Отправить
      </button>
    </template>
    <template v-else>
      <span class="reset__text"
        >На почту <i>{{ email }}</i> было направлено письмо с дальнейшими
        инструкциями по восстановлению пароля</span
      >
    </template>
  </form>
</template>

<script>
import Input from "@/components/UI/inputTemplate.vue";
import axios from "axios";

export default {
  name: "ResetPassword",

  components: {
    Input,
  },

  props: {},

  data() {
    return {
      input: {
        type: "email",
        placeholder: "Почта",
        required: "required",
        name: "email",
        autocomplete: "mail",
      },
      isLoading: false,
      isDisabled: false,
      email: "",
      isSended: false,
      error: "",
    };
  },
  methods: {
    checkMail() {
      if (this.isDisabled) {
        this.isLoading = true;
        axios
          .post("/mobileapp/api/user/sendRecoverPass", {
            email: this.email,
            link: "/sendRecoverPass",
          })
          .then((response) => {
            if (response.data === true) this.isSended = true;
          })
          .catch((error) => {
            this.error = error.response.data.error;
          })
          .finally((this.isLoading = false));
      }
    },
    update(e) {
      this.email = e.data.newValue;
      this.isDisabled = e.data.isValid;
    },
  },
};
</script>

<style scoped lang="scss">
.reset {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  width: 100%;
  &__text {
    @extend .subtitle-2;
    margin-bottom: var(--v-rhythm-6);
    display: block;
    i {
      color: var(--red900);
    }
  }
  .input_container {
    width: 100%;
    margin-bottom: var(--v-rhythm-4);
  }
  &__button {
    margin-top: var(--v-rhythm-4);
  }
}
</style>