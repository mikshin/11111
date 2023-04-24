<template>
  <div class="widget-communities">
    <div class="widget-communities__title main-title">{{ name }}</div>
    <TabsNav
      class="widget-communities__tabs"
      :tabs="tabs"
      :activeTabObj="activeTab"
      @changeTab="tabChangeHandler"
    />
    <div
      class="widget-communities__cards"
      :class="{
        loading: isLoading,
      }"
    >
      <div
        class="widget-communities__cards-list"
        v-if="activeCommunities && activeCommunities.length"
      >
        <CommunityCard
          class="widget-communities__card"
          v-for="community in activeCommunities"
          :key="community.ID"
          :communityData="community"
        />
      </div>
      <div v-else class="widget-text-default">Сообществ нет</div>
    </div>

    <router-link
      to="/communities"
      class="widget-communities__all-link primary-btn"
      >Все сообщества</router-link
    >
  </div>
</template>

<script>
import axios from "axios";

import TabsNav from "@UI/tabs/TabsNav.vue";
import CommunityCard from "@/components/communities/CommunityCard.vue";

export default {
  name: "WidgetCommunities",

  components: {
    TabsNav,
    CommunityCard,
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
      isLoading: true,
      communities: {
        all: null,
        my: null,
      },
      tabs: [
        {
          name: "Все",
        },
        {
          name: "Мои",
        },
      ],
      activeTab: {
        name: "Все",
      },
    };
  },

  computed: {
    activeCommunities() {
      switch (this.activeTab.name) {
        case "Мои":
          return this.communities.my;
        default:
          return this.communities.all;
      }
    },
  },

  methods: {
    async getCommunities() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/group/widget`,
        });

        this.communities.all = response.data.all;
        this.communities.my = response.data.my;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    tabChangeHandler(e) {
      this.activeTab = e;
    },
  },

  watch: {},

  mounted() {
    this.getCommunities();
  },
};
</script>

<style scoped lang="scss">
.widget-communities {
  &__title {
  }

  &__tabs {
    margin-bottom: 26px;
  }

  &__cards {
    margin-bottom: var(--v-rhythm-10);
  }

  &__cards-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--v-rhythm-8);
  }

  &__all-link {
    width: max-content;
    max-width: 100%;
  }

  @include phones {
    &__cards-list {
      display: flex;
      flex-direction: column;
      gap: var(--v-rhythm-4);
    }
  }
}
</style>
