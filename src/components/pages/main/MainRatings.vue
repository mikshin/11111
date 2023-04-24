<template>
  <div class="main-ratings">
    <div class="main-ratings__title">{{ name }}</div>
    <div class="main-ratings__content" :class="{ loading: isLoading }">
      <TabsNav
        class="main-ratings__tabs-nav"
        :tabs="tabs"
        v-if="tabs.length"
        @changeTab="(e) => (activeTab = e)"
      />
      <template v-for="(item, i) in rating">
        <div
          class="main-ratings__tabs-content"
          :key="i"
          v-if="item.name === activeTab.name"
        >
          <template v-for="(obj, k) in item.raitingCard">
            <RatingList class="main-ratings__rating" :data="obj" :key="k" />
          </template>
        </div>
      </template>
    </div>
    <router-link class="main-ratings__btn primary-btn" to="rating">
      <span>Все рейтинги</span></router-link
    >
  </div>
</template>

<script>
import axios from "axios";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import RatingList from "@/components/pages/rating/RatingList.vue";

export default {
  name: "MainRatings",

  components: {
    RatingList,
    TabsNav,
  },

  props: {
    name: null,
  },

  data() {
    return {
      data: {},
      isLoading: false,
      rating: [],
      activeTab: "",
      tabs: [],
    };
  },

  methods: {
    createTabs() {
      for (let tab of this.data) {
        if (tab) {
          this.tabs.push({
            name: tab.ratings[0].name,
            tooltip: tab.ratings[0].raitingCard[0].DESCRIPTION,
          });
          this.rating.push({
            name: tab.ratings[0].name,
            raitingCard: tab.ratings[0].raitingCard,
          });
        }
      }
      this.activeTabName = this.tabs[0].name;
    },

    async getData() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/raiting/?widget=Y`,
        });
        if (response.data) {
          this.data = response.data;
          this.createTabs();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.main-ratings {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--v-rhythm-6);

  &__title {
    @extend .h1;
    color: var(--gray500);
  }

  &__content {
    width: 100%;
  }

  &__tabs-nav {
  }

  &__tabs-content {
  }

  &__rating {
  }

  &__btn {
  }
}
</style>
