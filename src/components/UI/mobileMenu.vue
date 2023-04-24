<template>
  <footer>
    <nav class="navigation">
      <ul class="footer_links">
        <li class="footer_link">
          <router-link
            class="footer_link__wrapper"
            :to="navigationList[0].path"
            :class="{
              disabled: navigationList[0].disabled,
              chatOpen: isChatOpen,
            }"
          >
            <UserIcons :iconName="navigationList[0].img" />
            <span class="footer_link__name">{{ navigationList[0].name }}</span>
          </router-link>
        </li>
        <li class="footer_link">
          <router-link
            class="footer_link__wrapper"
            :to="navigationList[1].path"
            :class="{
              disabled: navigationList[1].disabled,
              chatOpen: isChatOpen,
            }"
          >
            <UserIcons :iconName="navigationList[1].img" />
            <span class="footer_link__name">{{ navigationList[1].name }}</span>
          </router-link>
        </li>
        <li class="footer_link">
          <div
            :class="{
              disabled: navigationList[2].disabled,
              'router-link-exact-active': isChatOpen,
            }"
            @click="onClickChat"
            class="footer_link__wrapper"
          >
            <UserIcons :iconName="navigationList[2].img" />
            <span class="footer_link__name">{{ navigationList[2].name }}</span>
            <span
              class="footer_link__item-indicator"
              v-show="allUnreadCount > 0"
            ></span>
          </div>
        </li>
        <li class="footer_link">
          <router-link
            class="footer_link__wrapper"
            :to="navigationList[3].path"
            :class="{
              disabled: navigationList[3].disabled,
              chatOpen: isChatOpen,
            }"
          >
            <UserIcons :iconName="navigationList[3].img" />
            <span class="footer_link__name">{{ navigationList[3].name }}</span>
          </router-link>
        </li>
        <li class="footer_link">
          <a @click="openMoreMenu" class="footer_link__wrapper">
            <UserIcons :iconName="'menu'" />
            <span class="footer_link__name">Ещё</span>
          </a>
        </li>
      </ul>

      <DarkLayer
        class="dark-layer"
        v-if="moreMenuIsOpen"
        :style="{ top: `${headerHeight}px` }"
        v-click-outside="closeMoreMenu"
      >
        <div class="show-more">
          <ul>
            <li v-for="(parent, i) in showMoreList" :key="i">
              <span class="parent">{{ parent.NAME }}</span>
              <ul class="children">
                <li v-for="(child, j) in parent.SUBMENU" :key="j">
                  <a :class="{ disabled: child.DISABLE }" target="_blank" :href="child.LINK" v-if="child.EXTERNAL" >{{
                    child.NAME
                  }}</a>
                  <router-link
                  v-else
                    :to="child.LINK"
                    :class="{ disabled: child.DISABLE }"
                  >
                    <span>{{ child.NAME }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </DarkLayer>
    </nav>
  </footer>
</template>

<script>
import axios from "axios";
import DarkLayer from "@/components/modals/DarkLayer.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    DarkLayer,
  },

  data() {
    return {
      moreMenuIsOpen: false,
      navigationList: [
        {
          name: "Главная",
          path: "/",
          img: "home",
        },
        {
          name: "Стоп-карта",
          path: "/stop_cards",
          img: "stop",
        },
        {
          name: "Чат",
          path: "/chat",
          img: "chat",
        },
        {
          name: "Мои сервисы",
          path: "/my_services",
          img: "services",
          disabled: false,
        },
      ],
      showMoreList: [],
    };
  },

  computed: {
    ...mapGetters(["allUnreadCount", "headerHeight", "isChatOpen"]),
  },

  methods: {
    ...mapActions(["toggleChat", "updateAllUnreadCount"]),

    onClickChat() {
      this.toggleChat();
    },

    openMoreMenu() {
      this.moreMenuIsOpen = true;
    },

    closeMoreMenu() {
      this.moreMenuIsOpen = false;
    },
  },

  watch: {
    $route() {
      this.closeMoreMenu();
    },
  },

  mounted() {
    axios.get("/mobileapp/api/footerheader/headerMenu/").then((response) => {
      this.showMoreList = response.data;
    });
  },
};
</script>

<style lang="scss" scoped>
footer {
  position: sticky;
  bottom: 0;
  left: 0;

  width: 100%;

  z-index: var(--header);

  background-color: var(--gray700);
}

.navigation {
  height: 100%;
}

.footer_links {
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.footer_link {
  width: 25%;
  padding: var(--mainPadding);

  display: flex;
  align-items: center;
  justify-content: center;

  &__wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    color: var(--gray300);
    fill: var(--gray300);
    position: relative;
    &.router-link-exact-active:not(.chatOpen) {
      fill: var(--red700);
      color: var(--red700);
    }
    &.disabled {
      pointer-events: none;
    }
    span {
      color: inherit;
    }
  }

  img {
    width: 24px;
    height: 24px;
  }

  &__name {
    white-space: nowrap;
    font-weight: 500;
    font-size: 12px;
    line-height: 13px;
    color: #fff;
    padding-top: 6px;
  }

  &__item-indicator {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(50%);

    width: 8px;
    height: 8px;

    border-radius: 50%;
    background-color: var(--red700);
    box-shadow: 0 0 0 3px var(--gray700);
  }
}
.show-more {
  height: 100%;
  width: 100%;
  background-color: #fff;
  overflow-y: auto;
}
.parent {
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  color: var(--gray700);
  padding: 12px;
  display: block;
}
.children {
  li {
    background-color: var(--gray100);
    display: block;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: var(--gray900);

    a {
      display: block;
      font-size: 14px;
      line-height: 24px;
      padding: 12px;
      padding-left: 24px;
      &.disabled {
        color: var(--gray300);
        pointer-events: none;
      }
    }
  }
}

.dark-layer {
  @include phones {
    // высота мобильного меню
    bottom: 63px;
  }
}
</style>