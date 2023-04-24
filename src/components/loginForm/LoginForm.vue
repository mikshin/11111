<template>
  <form
    ref="form"
    class="form-authorization"
    @submit.prevent="send"
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
      {{ !isChangePass ? "Авторизация" : step === 1 ? "Далее" : "Сохранить" }}
    </button>
  </form>
</template>

<script>
import Input from "../UI/inputTemplate.vue";
import { loginFormMixin } from "./loginFormMixin.js";
import axios from "axios";
import { mapActions } from "vuex";
import { db } from "../../db";

export default {
  name: "LoginForm",

  mixins: [loginFormMixin],

  components: {
    Input,
  },

  props: {
    isChangePass: Boolean,
    step: Number,
  },

  data() {
    return {
      userName: "",
      userLogin: "",
      inputs: [
        {
          type: "text",
          placeholder: "Логин",
          required: "required",
          name: "login",
          autocomplete: "username",
        },
        {
          type: "password",
          placeholder: !this.isChangePass ? "Пароль" : "Временный пароль",
          required: "required",
          name: "pass",
          autocomplete: "current-password",
        },
      ],
    };
  },

  methods: {
    ...mapActions(["fetchAuth"]),

    async login(data) {
      try {
        const response = await axios({
          method: "post",
          url: "/mobileapp/api/signin",
          data,
        });

        axios.defaults.headers.get["token"] = response.data.token;
        axios.defaults.headers.post["token"] = response.data.token;

        localStorage.setItem("dbVersion", db.verno);
        return response;
      } catch (err) {
        console.log("error", err);
      }
    },

    async authorization() {
      console.log("123");
      try {
        this.isLoading = true;
        const response = await this.login({
          login: this.userName,
          pass: this.pass,
        });
        if (response.data.status === "error") {
          this.errors =
            "Логин или пароль введены неверно. Проверьте правильность данных";
        } else {
          await this.getCurrentUser();
          db.user
            .where("id")
            .equals(JSON.parse(localStorage.currentUser).ID)
            .delete();
          db.user.add(response.data);
          this.errors = "";
        }
      } catch (err) {
        console.log("error", err);
        this.errors =
          "Попробуйте повторить вход через несколько минут. Если ошибка повторится, обратитесь к Администратору сети";
      } finally {
        this.isLoading = false;
      }
    },

    async checkTempPass() {
      this.isLoading = true;
      try {
        const response = await axios({
          method: "post",
          url: "/mobileapp/api/user/changeUserPass",
          data: {
            link: this.$route.fullPath,
            login: this.userName,
            tempPass: this.pass,
            constPass: "asdasdqwe123313",
            confirmUser: "Y",
          },
        });

        if (response.data.status === "error") {
          this.errors = response.data.errorMessage;
        } else {
          this.$emit("submit", {
            showModal: "tempPassOk",
            login: this.userName,
            tempPass: this.pass,
          });
        }
      } catch (err) {
        this.$emit("submit", {
          showModal: "tempPassError",
        });
        console.log("error1", err);
      } finally {
        this.isLoading = false;
      }
    },

    send() {
      if (!this.isChangePass) {
        this.authorization();
      } else if (this.isChangePass && this.step === 1) {
        this.checkTempPass();
      }
    },

    update({ data }) {
      this.validForm(data);

      if (data.input.name === "login") {
        this.userName = data.newValue;
      } else {
        this.pass = data.newValue;
      }
    },

    async getCurrentUser() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/footerheader/`,
        });

        const currentUser = Object.values(response.data)[0];

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        this.fetchAuth(true);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
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