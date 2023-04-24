<template>
  <nav class="header-nav">
    <ul class="header-nav__list">
      <li class="header-nav__item" v-for="(navItem, i) of navList" :key="i">
        <router-link
          class="header-nav__link"
          :to="navItem.LINK"
          v-if="navItem.LINK"
          :disabled="navItem.DISABLE"
          >{{ navItem.NAME }}</router-link
        >
        <a v-else class="header-nav__link"
          >{{ navItem.NAME }}
          <user-icons class="header-nav__link-arrow" :iconName="'arrow-down'" />
        </a>
        <ul class="header-nav__submenu" v-if="navItem.SUBMENU">
          <li
            class="header-nav__submenu-item"
            v-for="(child, j) of navItem.SUBMENU"
            :key="j"
            v-bind:class="{ disabled: child.DISABLE }"
          >
          <a class="header-nav__submenu-link" target="_blank" :href="child.LINK" v-if="child.EXTERNAL" >{{
              child.NAME
            }}</a>
            <router-link class="header-nav__submenu-link" :to="child.LINK" v-else>{{
              child.NAME
            }}</router-link>
          </li>
        </ul>
      </li>
      <li class="header-nav__item">
        <router-link class="header-nav__link" to="/kit" v-if="isProd"
          >UI Kit</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "HeaderNav",

  data() {
    return {};
  },

  props: {
    navList: {
      type: Array,
      required: true,
    },
  },

  computed: {
    isProd() {
      return process.env.NODE_ENV === "development";
    },
  },

  methods: {},

  mounted() {},
};
</script>

<style lang="scss" scoped>
.header-nav {
  display: flex;
  justify-content: center;

  &__list {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-4);
  }

  &__item {
    --link-color: var(--white900);

    position: relative;

    @include hover {
      --link-color: #ffbfbf;

      .header-nav__link-arrow {
        transform: scaleY(-1);
      }

      .header-nav__submenu {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__link {
    @extend .body-1;
    @include transition();

    display: flex;
    align-items: center;
    gap: var(--v-rhythm-1);
    padding: 6px 0;

    color: var(--link-color);

    user-select: none;

    &-arrow {
      @include transition();

      width: 20px;
      height: 20px;

      fill: var(--link-color);
    }
  }

  &__submenu {
    @include transition();

    position: absolute;
    bottom: 1px;
    left: -40px;
    transform: translateY(100%);
    z-index: calc(var(--header) + 2);

    padding: var(--v-rhythm-5) 0 var(--v-rhythm-4);

    background-color: var(--gray700);

    opacity: 0;
    visibility: hidden;

    &-item {
      &.disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    &-link {
      @extend .body-2;
      @include transition();

      padding: var(--v-rhythm-3) var(--v-rhythm-10);
      display: block;

      color: var(--white900);
      white-space: nowrap;

      @include hover {
        background-color: var(--gray900);
      }
      .disabled & {
        pointer-events: none;
      }
    }
  }

  @include desktop {
    &__list {
      gap: var(--v-rhythm-1);
    }

    &__link {
      gap: unset;
      padding: 0;
    }

    &__link-arrow {
      width: 16px;
      height: 16px;
    }

    &__submenu {
      left: -16px;

      padding: var(--v-rhythm-2) 0 var(--v-rhythm-2);
    }

    &__submenu-link {
      padding: var(--v-rhythm-2) var(--v-rhythm-4);
    }
  }
}
</style>