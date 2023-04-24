<template>
  <div class="app" id="app" v-if="isReady" :class="{ loading: isLoading }">
    <template v-if="isTechWorks">
      <main class="app__main app__main_login">
        <TechWorks />
      </main>
    </template>
    <template v-else>
      <template v-if="isAuth">
        <AppHeader class="app__header" @loading="load" />
        <main class="app__main">
          <transition name="fade">
            <router-view />
          </transition>
        </main>
        <AppFooter class="app__footer" v-if="!small" />
        <MobileMenu v-else />
        <Chat />
      </template>
      <template v-else>
        <AppHeader class="app__header" />
        <main class="app__main app__main_login">
          <Login />
        </main>
      </template>
    </template>
  </div>
</template>

<script>
import AppHeader from "@components/header/AppHeader.vue";
import AppFooter from "@components/footer/AppFooter.vue";
import MobileMenu from "@UI/mobileMenu.vue";
import Login from "@views/PageАuthorization.vue";
import Chat from "@components/pages/chat/chat.vue";
import axios from "axios";
import { db } from "./db";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { isMobileDevice, osMobileDevice } from "@utils";

export default {
  name: "App",

  components: {
    AppHeader,
    AppFooter,
    MobileMenu,
    Login,
    Chat,
  },

  data() {
    return {
      small: 0,
      userToken: "",
      isReady: false,
      isLoading: false,
      isTechWorks: false,
      deviceType: isMobileDevice() ? "mobile" : "desktop",
      osMobileDevice: osMobileDevice(),
    };
  },

  async created() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
    this.resetDb();

    let user = await db.user.toArray();
    user = user[0];

    if (!user || !user.token || !localStorage.currentUser) {
      this.fetchAuth(false);
    } else {
      this.userToken = user.token;
      this.checkAuth();
    }

    this.isReady = true;
  },

  computed: mapGetters(["isAuth", "isChatOpen"]),

  methods: {
    ...mapActions(["fetchNotification", "fetchPushNotification", "fetchAuth"]),

    ...mapMutations(["updateBrowserWindowWidth", "closeChat"]),

    logout() {
      this.$router.push("/");
      db.user.where("id").equals(localStorage.currentUser.ID).delete();
      this.fetchAuth(false);

      localStorage.removeItem("currentUser");
    },

    getBrowserWindowWidth() {
      const browserWindowWidth = document.body.clientWidth;
      this.updateBrowserWindowWidth(browserWindowWidth);
    },

    onResize() {
      this.small = window.innerWidth < 768;
    },

    loadStopCardObjects() {
      // загрузка данных для стопкарт после авторизации пользователя
      axios.get("/mobileapp/api/stopCardsDetail/fields").then((response) => {
        db.stopCardFields.toArray((stopCardFields) => {
          if (stopCardFields.length > 0) {
            db.stopCardFields.where("id").equals(1).delete();
            db.stopCardFields.add({ id: 1, data: response.data });
          } else {
            db.stopCardFields.add({ id: 1, data: response.data });
          }
        });
      });
    },
    async updateStop() {
      let data = await db.stop.toArray();
      if (data.length === 0) return; //Если есть данные в таблице, то прерываем выполнение функции

      for (let item of data) {
        let objects = item.data;
        let files = item.files;
        let formData = new FormData();
        for (let obj in objects) {
          if (Object.keys(objects[obj])[0] != "FILE[]") {
            formData.append(
              Object.keys(objects[obj])[0],
              objects[obj][Object.keys(objects[obj])[0]]
            );
          }
        }
        for (let file in files) {
          formData.append("FILE[]", files[file]);
        }
        axios
          .post("/mobileapp/api/stopCardsDetail/", formData)
          .then(() => {
            db.stop
              .where("id")
              .equals(item.id)
              .delete()
              .then(() => {
                console.log("Стоп карта " + item.id + " синхронизирована");
              });
          })
          .catch(() => {
            console.log();
          });
      }
    },

    checkAuth() {
      this.isLoading = true;
      axios.defaults.headers.common["token"] = this.userToken;
      axios.defaults.headers.common["deviceType"] = this.deviceType;

      if (this.osMobileDevice)
        axios.defaults.headers.common["os"] = this.osMobileDevice;

      axios
        .post("/mobileapp/api/checkauth")
        .then((response) => {
          this.fetchAuth(response.data.success);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.fetchAuth(false);
          }
        })
        .finally(() => {
          this.isLoading = false;

          // Определение смещения временной зоны пользователя
          const currentTime = new Date();
          const timeZoneOffset = currentTime.getTimezoneOffset();
          const cookieTimeZoneOffset = this.$cookies.get("BITRIX_SM_TIME_ZONE");

          if (Number(cookieTimeZoneOffset) !== Number(timeZoneOffset)) {
            axios.post("/mobileapp/api/user/changeUserTimeZone", {
              timeZoneOffset: timeZoneOffset,
            });
          }

          this.$cookies.set("BITRIX_SM_TIME_ZONE", timeZoneOffset, "1y");
        });
      this.getCurrentUser();
      this.loadStopCardObjects();
    },

    async getCurrentUser() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/footerheader/`,
        });

        const currentUser = Object.values(response.data)[0];

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } catch (error) {
        console.log(error);
      }
    },

    load(state) {
      this.isLoading = state;
    },

    resetDb() {
      if (
        !(
          localStorage.getItem("dbVersion") &&
          db.verno == localStorage.getItem("dbVersion")
        )
      ) {
        if (localStorage.currentUser) {
          this.logout();
          localStorage.setItem("dbVersion", db.verno);
        }
      }
    },
  },

  mounted() {
    this.updateStop();

    // функции для синхронизации приложения с сервером
    setInterval(() => {
      this.updateStop();
    }, 30000);
    // Уведомления
    // Чат
    // setTimeout(() => {
    //   this.loadStopCardObjects();
    // }, 1000);
    window.addEventListener("resize", this.getBrowserWindowWidth);
  },

  watch: {
    "$route.path"() {
      this.closeChat();
    },
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("resize", this.getBrowserWindowWidth);
  },
};
</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 320px;

  &.loading {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    &:before {
      z-index: 71;
    }
    &:after {
      z-index: 72;
    }
  }

  &__header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: var(--header);

    width: 100%;
  }

  &__main {
    flex-grow: 1;
    // отступы указаны в макете на странице header, footer
    padding: var(--v-rhythm-8) 0 var(--v-rhythm-20);

    &_login {
      display: flex;
      justify-content: center;
    }
  }

  &__footer {
    margin-top: auto;
  }

  @include laptop {
    &__main {
      padding-bottom: var(--v-rhythm-10);
    }
  }

  @include phones {
    &__main {
      padding-top: var(--v-rhythm-4);
    }
  }
}
</style>
