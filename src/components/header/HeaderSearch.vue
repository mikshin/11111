<template>
  <!-- !Имя класс используется в checkClickZone -->
  <div
    class="header-search"
    :class="{ 'header-search--open': isOpen }"
    @click="open"
    v-click-outside="clickOutside"
  >
    <slot></slot>
    <form
      class="header-search__form"
      :class="{ 'header-search__form--open': isOpen }"
      @submit.prevent="sendRequest"
      ref="form"
    >
      <input
        class="header-search__form-input"
        type="search"
        v-model="searchQuery"
        ref="search"
        placeholder="Поиск по контенту"
        @keyup.esc="close"
      />
      <button
        class="header-search__form-button primary-btn primary-btn--invert"
        type="submit"
      >
        <span>Найти</span>
        <user-icons :iconName="'search'" />
      </button>
    </form>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "HeaderSearch",

  data() {
    return {
      searchQuery: "",
      isOpen: false,
      // расстояние по макету между логотипом и формой поиска
      gap: 73,
      formWidth: 0,
      isClickedInto: false,
    };
  },

  computed: {
    formWidthPx() {
      return `${this.formWidth}px`;
    },

    ...mapGetters(["browserWindowWidth"]),
  },

  methods: {
    // Нужно для того, что бы поиск не закрывался, когда пользователь выделил текс и отпустил кнопку мыши за пределами поля ввода
    checkClickZone(e) {
      if (e.target.closest(".header-search")) {
        this.isClickedInto = true;
      } else {
        this.isClickedInto = false;
      }
    },

    clickOutside() {
      if (!this.isClickedInto) {
        this.close();
      }
    },

    open() {
      if (!this.isOpen) {
        this.isOpen = true;
        this.$refs.form.style.width = this.formWidthPx;

        setTimeout(() => {
          this.$refs.search.focus();
        }, 200);
      }
    },

    close() {
      if (this.isOpen) {
        this.isOpen = false;
        this.$refs.form.style.width = null;
        this.searchQuery = "";
      }
    },

    sendRequest() {
      this.updateUserSearchQuery(this.searchQuery);

      if (this.searchQuery && this.$route.path != "/page-search") {
        this.$router.push("/page-search");
      }

      this.close();
    },

    getFormWidth() {
      const logo = document.querySelector(".app-header__logo");
      const headerSearch = document.querySelector(".header-search");

      if (logo && headerSearch) {
        if (this.browserWindowWidth > 767) {
          const coordinatesRightSideLogo = logo.offsetLeft + logo.offsetWidth;
          const coordinatesFormSearch =
            headerSearch.offsetLeft + headerSearch.offsetWidth;

          const formWidth =
            coordinatesFormSearch - coordinatesRightSideLogo - this.gap;

          this.formWidth = formWidth;
        } else {
          this.formWidth = this.browserWindowWidth - 10 * 2;
        }
      } else {
        !logo
          ? console.log("Не найден элемент .app-header__logo")
          : console.log("Не найден элемент .header-search");
      }
      // TODO: удалить это
      this.formWidth = this.formWidth - 46;
    },

    ...mapMutations(["updateUserSearchQuery"]),
  },

  mounted() {
    this.getFormWidth();

    window.addEventListener("resize", this.getFormWidth);
    window.addEventListener("mousedown", this.checkClickZone);
  },

  destroyed() {
    window.removeEventListener("resize", this.getFormWidth);
    window.removeEventListener("mousedown", this.checkClickZone);
  },
};
</script>

<style lang="scss" scoped>
.header-search {
  position: relative;

  &--open {
    @include hover {
      box-shadow: none !important;
    }
  }

  &__form {
    @include transition();

    position: absolute;
    top: 0;
    right: 0;

    display: flex;
    width: 0;
    height: 100%;

    background-color: var(--gray900);
    border-radius: 40px;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;

    &--open {
      opacity: 1;
      visibility: visible;
    }
  }

  &__form-input {
    @extend .body-2;

    width: 100%;
    height: 100%;

    color: var(--white900);

    border: none;
    background-color: unset;

    padding: 11px 26px;

    &::placeholder {
      color: var(--gray500);
    }
  }

  &__form-button {
  }
}
</style>