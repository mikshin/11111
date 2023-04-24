<template>
  <header class="app-header" :ref="'appHeader'">
    <div class="app-header__container container">
      <div class="app-header__left-col">
        <AppLogo class="app-header__logo" />

        <HeaderNav
          v-if="isAuth"
          class="app-header__nav"
          :navList="navigationList"
        />
      </div>

      <HeaderUserNav
        v-if="isAuth"
        class="app-header__user-nav"
        :lkCounter="lkCounter"
      />
    </div>
  </header>
</template>

<script>
import axios from "axios";
import HeaderNav from "./HeaderNav.vue";
import HeaderUserNav from "./HeaderUserNav.vue";
import AppLogo from "@/components/UI/AppLogo.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "AppHeader",

  components: {
    HeaderNav,
    HeaderUserNav,
    AppLogo,
  },

  data() {
    return {
      navigationList: [],
      lkCounter: 0,
      active: "",
    };
  },

  computed: mapGetters(["isAuth"]),

  methods: {
    ...mapMutations(["updateHeaderHeight"]),

    getHeaderHeight() {
      const headerHeight = this.$refs.appHeader.offsetHeight;
      this.updateHeaderHeight(headerHeight);
    },
    init() {
      axios.get("/mobileapp/api/footerheader/headerMenu/").then((response) => {
        this.navigationList = response.data;

        this.$nextTick(() => this.getHeaderHeight());
      });

      window.addEventListener("resize", this.getHeaderHeight);
    },
  },

  mounted() {},

  destroyed() {
    window.removeEventListener("resize", this.getHeaderHeight);
  },

  beforeUpdate() {
    if (this.navigationList.length === 0) {
      this.$emit("loading", true);
      axios
        .get("/mobileapp/api/footerheader/headerMenu/")
        .then((response) => {
          this.isLoading = true;
          this.navigationList = response.data;
        })
        .finally(() => {
          this.$emit("loading", false);
        });
      this.$emit("loading", false);
    }
  },
  watch: {
    isAuth() {
      if (this.isAuth) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  background-color: var(--gray700);

  &__container {
    // Не удалять! Нужен для корректной работы компонента HeaderSearch.vue
    position: relative;

    display: flex;
    align-items: center;
    gap: var(--v-rhythm-8);
    padding-top: var(--v-rhythm-3);
    padding-bottom: var(--v-rhythm-3);
  }

  &__left-col {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0 var(--v-rhythm-4);
    width: 100%;
  }

  &__logo {
    width: 162px;
    // flex-shrink: 0;
  }

  &__nav {
    flex-shrink: 0;
  }

  &__user-nav {
  }

  @include desktop {
    &__container {
      gap: var(--v-rhythm-4);
    }

    &__left-col {
      gap: 0 var(--v-rhythm-4);
    }

    &__logo {
      width: 142px;
    }
  }

  @include laptop {
    &__nav {
      display: none !important;
    }
  }
}
</style>
