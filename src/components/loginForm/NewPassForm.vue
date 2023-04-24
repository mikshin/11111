<template>
  <form
    class="form-authorization"
    @submit.prevent="setNewPass"
    :class="{ loading: isLoading }"
  >
    <Input
      v-for="(input, key) in inputs"
      :key="key"
      :input="input"
      @onChange="update"
    />
    <span class="form-authorization__error" v-html="errors"></span>

    <button class="primary-btn" type="submit" :disabled="!isActive">
      Сохранить
    </button>
  </form>
</template>

<script>
import Input from "../UI/inputTemplate.vue";
import { loginFormMixin } from "./loginFormMixin.js";

import axios from "axios";

export default {
  name: "NewPassForm",

  mixins: [loginFormMixin],

  components: {
    Input,
  },

  props: {
    login: String,
    tempPass: String,
  },

  data() {
    return {
      repeatPass: "",
      inputs: [
        {
          type: "password",
          placeholder: "Новый пароль",
          required: "required",
          name: "pass",
          autocomplete: "current-password",
        },
        {
          type: "password",
          placeholder: "Повтор нового пароля",
          required: "required",
          name: "repeatPass",
          autocomplete: "current-password",
        },
      ],
    };
  },

  methods: {
    async setNewPassRequest() {
      const response = await axios({
        method: "post",
        url: "/mobileapp/api/user/changeUserPass",
        data: {
          link: this.$route.fullPath,
          login: this.login,
          tempPass: this.tempPass,
          constPass: this.pass,
        },
      });

      return response;
    },

    async setNewPass() {
      if (this.validNewPass(this.pass, this.repeatPass)) {
        try {
          this.isLoading = true;
          const response = await this.setNewPassRequest();
          if (response.data.status === "error") {
            console.log("response.data error", response.data);
          } else {
            this.$emit("submit", {
              showModal: "newPassOk",
            });
          }
        } catch (err) {
          console.log("err", err);
        } finally {
          this.isLoading = false;
        }
      }
    },

    validNewPass(pass, repeatPass) {
      const regExTestPass = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;
      const errorSpan = document.querySelector(".form-authorization__error");
      if (errorSpan) {
        errorSpan.classList.remove("form-authorization__error_wide");
      }
      if (regExTestPass.test(pass)) {
        if (!(pass !== repeatPass || pass === this.tempPass)) {
          return true;
        } else {
          this.errors =
            pass !== repeatPass
              ? "Пароли не совпадают"
              : "Пароль совпадает с временным паролем. Введите другой пароль";
          return false;
        }
      } else {
        if (errorSpan) {
          errorSpan.classList.add("form-authorization__error_wide");
        }
        this.errors = `Пароль должен быть не менее 8 символов длиной.<br />
Пароль должен содержать цифры (0-9).<br />
Пароль должен содержать латинские символы верхнего регистра (A-Z).<br />
Пароль должен содержать латинские символы нижнего регистра (a-z).<br />`;
        return false;
      }
    },

    update({ data }) {
      this.validForm(data);

      if (data.input.name === "pass") {
        this.pass = data.newValue;
      } else {
        this.repeatPass = data.newValue;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.form-authorization {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__error {
    @extend .caption-2;
    margin-bottom: var(--v-rhythm-8);
    color: var(--red900);
    max-width: 285px;
    width: 100%;
    &_wide {
      max-width: unset;
      text-align: center;
      @media (max-width: 400px) {
        font-size: 8px;
      }
    }
  }

  &.loading:before {
    background: none;
  }
}
.input_container {
  width: 100%;
  max-width: 300px;

  &:last-of-type {
    margin-bottom: var(--v-rhythm-8);
  }
}
button {
  margin-bottom: var(--v-rhythm-6);
  width: 100%;
  max-width: 300px;
}
</style>