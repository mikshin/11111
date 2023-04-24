<template>
  <WidgetWrapper
    class="communities-widget-tabs"
    :iconName="'group'"
    :title="name"
    :textBtn="'Все сообщества'"
    @clickWidgetBtn="goToAll"
  >
    <div
      class="communities-widget-tabs__content"
      :class="{ loading: isLoading }"
    >
      <TabsNav
        class="communities-widget-tabs__tabs-nav"
        :tabs="tabs"
        :activeTabObj="tabsActive"
        @changeTab="
          (e) => {
            tabsActive = e;
          }
        "
      />

      <div class="communities-widget-tabs__main">
        <template v-if="communities.length > 0">
          <CommunityCardMini
            class="communities-widget-tabs__card"
            v-for="community in communities"
            :key="community.ID"
            :id="community.ID"
            :title="community.NAME"
            :description="community.PREVIEW_TEXT"
            :isLock="community.CLOSED ? community.CLOSED : false"
            :participient="community.PARTICIPIENT"
          />
        </template>

        <span v-else class="communities-widget-tabs__text-default"
          >Нет сообществ</span
        >
      </div>
    </div>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import CommunityCardMini from "@/components/communities/CommunityCardMini.vue";

export default {
  name: "CommunitiesWidgetTabs",

  components: {
    WidgetWrapper,
    TabsNav,
    CommunityCardMini,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Сообщества",
    },
  },

  data() {
    return {
      tabs: [
        {
          name: "Все",
        },
        {
          name: "Мои",
        },
      ],

      tabsActive: {
        name: "Все",
      },

      isLoading: false,

      allСommunities: [],
      myСommunities: [],

      textdefault: "Нет сообществ",
    };
  },

  computed: {
    communities() {
      if (this.tabsActive.name === "Все") {
        return this.allСommunities;
      } else if (this.tabsActive.name === "Мои") {
        return this.myСommunities;
      } else {
        return [];
      }
    },
  },

  methods: {
    goToAll() {
      this.$router.push(`/communities`);
    },

    async getCommunities() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/group/widget`,
        });

        this.allСommunities = response.data.all;
        this.myСommunities = response.data.my;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {},

  mounted() {
    this.getCommunities();
  },
};
</script>

<style scoped lang="scss">
.communities-widget-tabs {
  &__content {
  }

  &__tabs-nav {
    margin: {
      top: var(--v-rhythm-4);
      right: 10px;
      bottom: var(--v-rhythm-2);
      left: 10px;
    }
  }

  &__main {
    max-height: 424px;
    padding: var(--v-rhythm-2) var(--v-rhythm-4) var(--v-rhythm-6);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);

    overflow-y: auto;
  }

  &__text-default {
    @extend .body-2;
    color: var(--gray500);
  }
}
</style>