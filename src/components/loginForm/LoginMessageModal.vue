<template>
  <transition name="fade">
    <AppModal
      class="message-login-popup"
      @onClose="closePopup"
      :maxWidth="'600'"
    >
      <span class="message-login-popup__title">{{ title }}</span>
      <p class="message-login-popup__paragraph" v-html="text"></p>
      <template v-if="type === 'fogotPass'">
        <p
          class="message-login-popup__contact-label message-login-popup__contact-label_first"
        >
          E-mail
        </p>
        <a href="mailto:111.com" class="message-login-popup__contact"
          >111.com</a
        >
        <p class="message-login-popup__contact-label">Внутренний телефон</p>
        <a href="tel:+74955891200" class="message-login-popup__contact"
          >+7 495 589 12 00(доб. 2031)</a
        >
      </template>
    </AppModal>
  </transition>
</template>

<script>
import AppModal from "../modals/AppModal.vue";

export default {
  name: "LoginMessageModal",

  components: {
    AppModal,
  },

  props: {
    type: String,
  },

  data() {
    return {
      title: "",
      text: "",
    };
  },

  methods: {
    closePopup() {
      this.$emit("close");
    },
  },

  mounted() {
    switch (this.type) {
      case "tempPassOk":
        this.title = "Временный пароль принят";
        this.text = `Вы успешно авторизовались на портале! <br /><br />
        Необходимо задать новый пароль`;
        break;
      case "tempPassError":
        this.title = "Внимание!";
        this.text = `Ошибка авторизации! <br /><br />
        Попробуйте повторить вход через несколько минут.<br /><br />
        Если ошибка повторится, обратитесь к Администратору сети`;
        break;
      case "newPassOk":
        this.title = "Новый пароль успешно сохранен";
        this.text = `Авторизуйтесь на Портале с новым паролем`;
        break;
      case "fogotPass":
        this.title = "Забыли пароль?";
        this.text = `Для восстановления пароля обратитесь к администратору портала`;
        break;
    }
  },
};
</script>

<style scoped lang="scss">
.message-login-popup {
  &__title {
    display: block;

    margin-bottom: var(--v-rhythm-4);

    @extend .h3;
  }

  &__paragraph {
    @extend .body-2;
  }

  &__contact-label {
    display: block;

    @extend .caption-2;
    color: var(--gray500);

    &_first {
      margin-top: var(--v-rhythm-8);
    }
  }

  &__contact {
    display: block;

    @extend .body-1;
    color: var(--gray900);

    margin-bottom: var(--v-rhythm-2);
  }
}
</style>
