<template>
  <div class="header-user-nav">
    <!-- !TODO переделать header-notifications -->
    <HeaderNotifications class="header-user-nav__item" />

    <button
      class="header-user-nav__item header-user-nav__chat"
      @click="toggleChat"
    >
      <user-icons class="header-user-nav__item-icon" :iconName="'chat'" />
      <span class="header-user-nav__item-indicator" v-show="allUnreadCount > 0">
        {{ allUnreadCount }}
      </span>
    </button>

    <HeaderSearch class="header-user-nav__item">
      <user-icons class="header-user-nav__item-icon" :iconName="'search'" />
    </HeaderSearch>

    <router-link
      class="header-user-nav__item header-user-nav__lk"
      :to="`/lk?=${currentUser.ID}`"
    >
      <img
        class="header-user-nav__item-img"
        :src="lkImgUrl"
        :alt="currentUser.FULL_NAME"
      />
      <UserNavCounter
        class="header-user-nav__item-counter"
        v-show="lkCounter > 0"
        :counter="lkCounter"
      />
    </router-link>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import HeaderNotifications from "./HeaderNotifications.vue";
import HeaderSearch from "./HeaderSearch.vue";
import UserNavCounter from "./UserNavCounter.vue";

export default {
  name: "HeaderUserNav",

  components: {
    HeaderNotifications,
    HeaderSearch,
    UserNavCounter,
  },

  data() {
    return {};
  },

  props: {
    lkCounter: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },

    chatCounter() {
      return this.allUnreadCount > 99 ? "99+" : this.allUnreadCount;
    },

    lkImgUrl() {
      return this.currentUser.USER_PHOTO
        ? this.currentUser.USER_PHOTO
        : `/img/icons/avatar-plug.svg`;
    },
    ...mapGetters(["allUnreadCount"]),
  },

  methods: {
    ...mapActions(["toggleChat", "updateAllUnreadCount"]),
    // TODO: думаю стоит убрать отсюда, пока не знаю куда
    getAllUnreadCount() {
      axios.get("/mobileapp/api/chat/message/unreadCount").then((response) => {
        this.updateAllUnreadCount(response.data.count);
      });
    },
  },
  mounted() {
    this.getAllUnreadCount();
  },
};
</script>

<style lang="scss" scoped>
.header-user-nav {
  flex-shrink: 0;
  display: flex;
  gap: var(--v-rhythm-4);

  &__item {
    position: relative;

    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: var(--gray900);
    border-radius: 50px;

    cursor: pointer;
    @include transition();

    @include hover {
      box-shadow: 0 0 0 2px var(--red700);
    }
    &.chat {
      @include phones {
        display: none;
      }
    }
  }

  &__item-icon {
    width: 24px;
    height: 24px;

    fill: var(--gray300);
  }
  &__item-indicator {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(50%);

    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background-color: var(--red700);
    box-shadow: 0 0 0 3px var(--gray700);

    @extend .overline;
    color: var(--white900);
  }

  &__item-img {
    width: 100px;
    height: 100px;
    max-width: 100%;
    max-height: 100%;

    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
    object-position: center;
  }

  &__item-counter {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(50%);
  }

  &__lk {
    @include phones {
      // display: none;
    }
  }
  &__chat {
    @include phones {
      display: none;
    }
  }

  @include desktop {
    gap: var(--v-rhythm-3);

    &__item {
      width: 36px;
      height: 36px;
    }
  }
}
</style>