<template>
  <div class="login main__login">
    <div class="login__container container" v-if="!resetPassword">
      <h2 class="login__title" :class="{ login__title_change: isChangePass }">
        {{
          isChangePass && step === 2 ? "Задайте новый пароль" : "Авторизация"
        }}
      </h2>
      <span class="login__step" v-if="isChangePass">Этап {{ step }}/2</span>
      <span class="login__text" v-if="isChangePass && step === 1"
        >Введите данные из письма</span
      >
      <p class="login__rules" v-if="isChangePass && step === 2">
        Пароль должен быть не менее 8 символов длиной. <br />
        Пароль должен содержать цифры (0-9). <br />
        Пароль должен содержать латинские символы верхнего регистра (A-Z).<br />
        Пароль должен содержать латинские символы нижнего регистра (a-z).<br />
      </p>
      <LoginForm
        @submit="sendForm"
        :isChangePass="isChangePass"
        :step="step"
        v-if="(isChangePass && step === 1) || !isChangePass"
      />
      <NewPassForm
        @submit="sendForm"
        v-else
        :login="login"
        :tempPass="tempPass"
      />
      <span
        @click="resetPassword = true"
        class="login__forgot-password"
        v-if="!isChangePass"
      >
        Забыли пароль?
      </span>
    </div>

    <div class="login__container container" v-else>
      <h2 class="login__title">Восстановление пароля</h2>
      <ResetPassword />
    </div>

    <LoginMessageModal
      v-if="isVisiblePopup"
      :type="typeModal"
      @close="closePopup"
    />
  </div>
</template>
<script>
import LoginMessageModal from "../components/loginForm/LoginMessageModal.vue";
import LoginForm from "../components/loginForm/LoginForm.vue";
import NewPassForm from "../components/loginForm/NewPassForm.vue";
import ResetPassword from "@/components/loginForm/ResetPassword.vue";

export default {
  components: {
    LoginMessageModal,
    LoginForm,
    NewPassForm,
    ResetPassword,
  },
  data() {
    return {
      isVisiblePopup: false,
      typeModal: "",
      isChangePass: this.$route.path === "/changePassword",
      step: 1,
      login: "",
      tempPass: "",
      errors: "",
      resetPassword: false,
    };
  },
  methods: {
    closePopup() {
      this.isVisiblePopup = false;
    },

    sendForm(data) {
      if (data) {
        switch (data.showModal) {
          case "tempPassOk":
            this.typeModal = data.showModal;
            this.isVisiblePopup = true;
            this.step = 2;
            this.login = data.login;
            this.tempPass = data.tempPass;
            break;
          case "newPassOk":
            this.typeModal = data.showModal;
            this.isVisiblePopup = true;
            this.$router.push("/");
            break;
          case "tempPassError":
            this.typeModal = data.showModal;
            this.isVisiblePopup = true;
            break;
          case "fogotPass":
            this.typeModal = data.showModal;
            this.isVisiblePopup = true;
        }
      }
    },
  },

  watch: {
    $route() {
      this.isChangePass = this.$route.path === "/changePassword";
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  &__login {
    display: flex;
    align-items: center;
  }
}
.login {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__title {
    @extend .h1;
    color: var(--gray500);
    margin-bottom: var(--v-rhythm-10);
    padding-bottom: 0;

    &_change {
      margin-bottom: var(--v-rhythm-2);
    }
  }

  &__step {
    @extend .subtitle-1;
    color: var(--gray500);
    margin-bottom: var(--v-rhythm-10);
  }

  &__text {
    @extend .h3;
    margin-bottom: var(--v-rhythm-9);
  }

  &__forgot-password {
    @extend .button;
    cursor: pointer;
    color: var(--red900);
  }

  &__rules {
    @extend .caption-1;
    max-width: 432px;
    text-align: center;
    margin-bottom: var(--v-rhythm-10);
    color: var(--gray700);
    @media (max-width: 400px) {
      font-size: 8px;
    }
  }
}
</style>