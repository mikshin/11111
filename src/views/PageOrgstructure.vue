<template>
  <div class="page-orgstructure">
    <div class="page-orgstructure__container container">
      <Breadcrumbs class="page-orgstructure__breadcrumbs" />
      <div class="page-orgstructure__header">
        <div class="page-orgstructure__title main-title">Оргструктура</div>

        <SimpleSearch
          class="page-orgstructure__search"
          @sendSearchRequest="sendSearchRequest"
        />
      </div>

      <TabsNav
        class="page-orgstructure__tabs-nav"
        :tabs="tabsNav"
        :activeTabObj="activeTab"
      />

      <div class="page-orgstructure__main">
        <transition name="fade">
          <router-view />
        </transition>
      </div>
    </div>

    <ToTop />
  </div>
</template>
<script>
import Breadcrumbs from "@/components/UI/breadcrumbs.vue";
import SimpleSearch from "@/components/UI/search/SimpleSearch.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import { mapMutations } from "vuex";
import ToTop from "@/components/UI/ToTop.vue";

export default {
  name: "PageOrgstructure",

  components: {
    Breadcrumbs,
    SimpleSearch,
    TabsNav,
    ToTop,
  },

  data() {
    return {
      tabsNav: [
        {
          name: "Оргструктура",
          route: `/orgstructure`,
        },
        {
          name: "Телефонный справочник",
          route: `/orgstructure/phonebook`,
        },
      ],
    };
  },

  computed: {
    activeTab() {
      return this.tabsNav.find((tab) => tab.route === this.$route.path);
    },
  },

  methods: {
    ...mapMutations(["updateUserSearchQuery"]),

    sendSearchRequest(searchQuery) {
      this.updateUserSearchQuery(searchQuery);

      this.$router.push("/page-search");
    },
  },
};
</script>

<style lang="scss" scoped>
.page-orgstructure {
  &__container {
  }

  &__breadcrumbs {
  }

  &__header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--v-rhythm-8);
    margin-bottom: var(--v-rhythm-8);
  }

  &__title {
    margin-bottom: 0;
  }

  &__search {
    width: 100%;
    max-width: 464px;
  }

  &__tabs-nav {
    margin-bottom: var(--v-rhythm-8);
  }

  &__main {
  }

  @include laptop {
    &__search {
      max-width: unset;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
