<template>
  <footer class="app-footer">
    <div class="app-footer__container container">
      <app-logo class="app-footer__logo" />
      <div class="app-footer__content">
        <div class="app-footer__content-main">
          <ul class="app-footer__nav">
            <li
              class="app-footer__nav-item"
              v-for="(navItem, i) of navList"
              :key="i"
            >
              <router-link
                v-if="navItem.LINK"
                class="app-footer__nav-link"
                :to="navItem.LINK"
                >{{ navItem.NAME }}</router-link
              >
            </li>
          </ul>
          <div class="app-footer__contacts">
            <div class="app-footer__contacts-col">
              <div class="app-footer__contacts-title">Приёмные</div>
              <ul class="app-footer__contacts-list">
                <li
                  class="app-footer__contacts-item"
                  v-for="(receptionItem, i) of receptionlList"
                  :key="i"
                >
                  <span class="app-footer__contacts-name">{{
                    receptionItem.UL_NAME
                  }}</span>
                  <a
                    class="app-footer__contacts-link"
                    :href="`tel:${receptionItem.PHONE}`"
                    >{{ receptionItem.PHONE }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="app-footer__contacts-col">
              <div class="app-footer__contacts-title">Тех. поддержка</div>
              <ul class="app-footer__contacts-list">
                <li class="app-footer__contacts-item">
                  <span class="app-footer__contacts-name">Телефон</span>
                  <ul class="app-footer__contacts-inner-list">
                    <li
                      class="app-footer__contacts-inner-item"
                      v-for="(supportItem, i) of supportlList"
                      :key="i"
                    >
                      <a
                        class="app-footer__contacts-link"
                        :href="`tel:${supportItem.PHONE}`"
                        >{{ supportItem.PHONE }}</a
                      >
                    </li>
                  </ul>
                </li>
                <li class="app-footer__contacts-item">
                  <span class="app-footer__contacts-name">Почта</span>
                  <ul class="app-footer__contacts-inner-list">
                    <li
                      class="app-footer__contacts-inner-item"
                      v-for="(supportItem, i) of supportlList"
                      :key="i"
                    >
                      <a
                        class="app-footer__contacts-link"
                        :href="`mailto:${supportItem.EMAIL}`"
                        >{{ supportItem.EMAIL }}</a
                      >
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <social-media
          class="app-footer__social"
          :socialMediaData="socialListFiltered"
          :iconSize="40"
        />
        <div class="app-footer__copyright">© АО «НафтаГаз», 2022</div>
      </div>
    </div>
  </footer>
</template>

<script>
import axios from "axios";
import AppLogo from "@/components/UI/AppLogo.vue";
import SocialMedia from "@/components/UI/social-media/SocialMedia.vue";
import resize from "vue-resize-directive";

export default {
  name: "AppFooter",
  components: {
    AppLogo,
    SocialMedia,
  },

  directives: {
    resize,
  },

  data() {
    return {
      navList: [],
      receptionlList: [],
      supportlList: [],
      socialList: [],
    };
  },

  mounted() {
    axios
      .get("/mobileapp/api/footerheader/footerInfo")
      .then((response) => {
        this.navList = response.data.MENU;
        this.receptionlList = response.data.RECEPTION_PHONE;
        this.supportlList = response.data.STP_CONTACT;
        this.socialList = response.data.SOCIAL_ACCAUNTS;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  computed: {
    socialListFiltered() {
      return this.socialList.filter((item) => item.LINK);
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.app-footer {
  padding: var(--v-rhythm-20) 0 var(--v-rhythm-10);

  background-color: var(--gray700);

  &__container {
  }

  &__logo {
    width: 320px;
    height: 41px;
    margin-bottom: var(--v-rhythm-12);
  }

  &__content {
    padding: 0 117px;
  }

  &__content-main {
    display: flex;
    justify-content: space-between;
    gap: var(--v-rhythm-20);
    margin-bottom: var(--v-rhythm-16);
  }

  &__nav {
    display: flex;
    flex-direction: column;
    flex-basis: 433px;
  }

  &__nav-item {
  }

  &__nav-link {
    @include font(24px, 28px, 400);

    position: relative;

    display: block;
    padding: var(--v-rhythm-4) 0;

    color: var(--white900);

    @include transition(all, 0);

    &::before {
      content: "";

      position: absolute;
      left: 0;
      bottom: 0;

      display: block;
      width: 100%;
      height: 2px;

      background-color: var(--gray500);
      opacity: 0.3;
    }

    @include hover {
      color: var(--gray900);

      background-color: var(--gray100);
    }
  }

  &__contacts {
    display: flex;
    flex-basis: 555px;
    gap: var(--v-rhythm-4);
    padding-top: var(--v-rhythm-4);
  }

  &__contacts-col {
    width: 50%;
  }

  &__contacts-title {
    @include font(24px, 28px, 400);

    margin-bottom: var(--v-rhythm-8);

    color: var(--gray500);
  }

  &__contacts-list {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
  }

  &__contacts-item {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__contacts-name {
    @extend .caption-2;

    color: var(--gray500);
  }

  &__contacts-link {
    @include font(18px, 26px, 400);
    @include transition();

    color: var(--white900);
  }

  &__contacts-inner-list {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__contacts-inner-item {
  }

  &__social {
    margin-bottom: var(--v-rhythm-10);
  }

  &__copyright {
    @extend .caption-1;

    color: var(--gray100);
  }

  &__nav-link,
  &__contacts-link {
    &:active {
      opacity: var(--active-opacity);
    }
  }

  @include desktop {
    &__content {
      padding: 0;
    }
  }

  @include laptop {
    padding-top: var(--v-rhythm-10);

    &__content {
      padding: 0 117px;
    }

    &__content-main {
      gap: var(--v-rhythm-16);
      flex-wrap: wrap;
    }

    &__nav {
      flex-basis: 100%;
    }

    &__contacts {
      padding-top: 0;
      flex-basis: 100%;
      gap: var(--v-rhythm-16);
    }
  }
}
</style>
