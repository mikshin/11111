<template>
  <div class="page-search">
    <AppPage class="page-search__app-page" :hasWhiteHeader="true">
      <div class="page-search__header">
        <AppSearch class="page-search__search" />

        <PageSearchCategories
          class="page-search__categories"
          v-if="searchResults.length > 1"
          :categories="categories"
          :activeCategory="activeCategory"
          @changeCategory="changeCategory"
        />
      </div>
      <MainSidebar class="page-search__main-sidebar">
        <template #main>
          <div class="page-search__main" :class="{ loading: isLoading }">
            <p
              class="page-search__main-text-default"
              v-if="searchResults.length === 0"
            >
              По вашему запросу ничего не найдено.
            </p>

            <template v-else>
              <div class="page-search__results">
                <SearchResult
                  class="page-search__results-item"
                  v-for="searchResult of filteredCategory"
                  :key="searchResult.type"
                  :type="searchResult.type"
                  :title="searchResult.title"
                  :quantity="searchResult.total"
                  :isMore="!searchResult.end"
                  @showMore="fetchMoreResults"
                >
                  <template v-if="searchResult.title === 'Новости'">
                    <NewsTemplate
                      class="search-result__item search-result__item--new"
                      v-for="item in searchResult.results"
                      :key="item.ID"
                      :data="item"
                    />
                  </template>
                  <template v-else-if="searchResult.title === 'Сотрудники'">
                    <PersonCard
                      class="search-result__item"
                      v-for="item in searchResult.results"
                      :key="item.ID"
                      :personData="item"
                    />
                  </template>
                  <template v-else-if="searchResult.title === 'Документы'">
                    <SearchDocs :docs="searchResult.results" />
                  </template>
                  <template v-else-if="searchResult.title === 'Проекты'">
                    <SearchProjects :projects="searchResult.results" />
                  </template>
                  <template v-else-if="searchResult.title === 'Мероприятия'">
                    <SearchEvents
                      :events="searchResult.results"
                      @updateEventsList="fetchSearchResults"
                    />
                  </template>
                  <template v-else-if="searchResult.title === 'Сообщества'">
                    <SearchCommunities :communities="searchResult.results" />
                  </template>
                  <template v-else-if="searchResult.title === 'Конкурсы'">
                    <SearchContests :contests="searchResult.results" />
                  </template>
                  <template v-else-if="searchResult.title === 'Объявления'">
                    <SearchAdvertisements
                      :advertisements="searchResult.results"
                    />
                  </template>
                </SearchResult>
              </div>
            </template>
          </div>
        </template>
        <template #sidebar>
          <div class="page-search__sidebar">
            <PageSearchFilter
              class="page-search__filter"
              v-show="userSearchQuery"
              :activeCategory="activeCategoryCode"
              @filterSubmit="filterSubmit"
              @filterReset="filterReset"
              :key="filterKey"
            />
          </div>
        </template>
      </MainSidebar>
    </AppPage>
  </div>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";

import axios from "axios";
import AppSearch from "@/components/UI/search/AppSearch.vue";
import SearchResult from "@/components/search/SearchResult.vue";
import SearchDocs from "@/components/search/SearchDocs.vue";
import SearchProjects from "@/components/search/SearchProjects.vue";
import SearchEvents from "@/components/search/SearchEvents.vue";
import SearchCommunities from "@/components/search/SearchCommunities.vue";
import SearchContests from "@/components/search/SearchContests.vue";
import SearchAdvertisements from "@/components/search/SearchAdvertisements.vue";
import PageSearchFilter from "@/components/search/PageSearchFilter.vue";
import PageSearchCategories from "@/components/search/PageSearchCategories.vue";
import { mapGetters } from "vuex";
import NewsTemplate from "@/components/pages/news/newsTemplate.vue";
import PersonCard from "@/components/person-cards/PersonCard.vue";

export default {
  name: "PageSearch",

  components: {
    AppPage,
    MainSidebar,
    AppSearch,
    SearchResult,
    NewsTemplate,
    PersonCard,
    SearchDocs,
    SearchProjects,
    SearchEvents,
    SearchCommunities,
    SearchContests,
    SearchAdvertisements,
    PageSearchFilter,
    PageSearchCategories,
  },

  data() {
    return {
      searchResults: [],
      isLoading: false,
      activeCategory: "",
      parametrsFilter: null,
      searchId: null,
      filterKey: 0,
    };
  },

  computed: {
    categories() {
      return this.searchResults.map((item) => item.title);
    },

    ...mapGetters(["userSearchQuery"]),

    filteredCategory() {
      return this.activeCategory
        ? this.searchResults.filter(
            (item) => item.title === this.activeCategory
          )
        : this.searchResults;
    },

    activeCategoryCode() {
      if (this.activeCategory === "Новости") {
        return "news";
      } else if (this.activeCategory === "Сотрудники") {
        return "users";
      } else if (this.activeCategory === "Документы") {
        return "documents";
      } else if (this.activeCategory === "Мероприятия") {
        return "events";
      } else if (this.activeCategory === "Проекты") {
        return "projects";
      } else if (this.activeCategory === "Конкурсы") {
        return "contests";
      } else if (this.activeCategory === "Сообщества") {
        return "communities";
      } else if (this.activeCategory === "Объявления") {
        return "adverts";
      } else {
        return "";
      }
    },
  },

  watch: {
    userSearchQuery() {
      this.parametrsFilter = null;
      this.filterKey++;
      this.fetchSearchResults();
    },
  },

  methods: {
    checkResultForActiveCategory() {
      if (this.activeCategory) {
        if (!this.categories.includes(this.activeCategory)) {
          this.activeCategory = "";
        }
      } else if (this.categories.length === 1) {
        this.activeCategory = this.categories[0];
      }
    },

    changeCategory(category) {
      this.activeCategory = category;
    },

    async fetchResults(entity, startFrom = 0) {
      try {
        this.isLoading = true;
        const path = this.$router.currentRoute.path;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/search/?count=2&startFrom=${startFrom}`,
          data: {
            QUERY: this.userSearchQuery,
            ENTITY: entity,
            EXTRA_FILTER: this.parametrsFilter,
          },
        });
        if (path === this.$router.currentRoute.path) {
          this.sendStatistics(0);
        }
        return response.data;
      } catch (error) {
        if (error.response.status === 404) {
          this.sendStatistics(1);
        } else {
          this.sendStatisticsBroken();
        }
      } finally {
        this.isLoading = false;
      }
    },

    async sendStatistics(isEmpty) {
      try {
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/statistic/addSearch`,
          data: {
            query: this.userSearchQuery,
            empty: isEmpty,
          },
        });
        this.searchId = response.data.SEARCH_ID;
      } catch (error) {
        this.searchId = null;
      }
    },

    sendStatisticsBroken() {
      axios({
        method: "post",
        url: `/mobileapp/api/statistic/addBroken`,
        data: {
          query: this.userSearchQuery,
        },
      });
    },

    async fetchSearchResults(entity) {
      const results = await this.fetchResults(entity);

      if (results) {
        this.searchResults = results.data;
        // Если есть активная категория, то проверяем есть ли она в результатах поиска. Если нет, то обнуляем активную категорию.
        this.checkResultForActiveCategory();
      } else {
        this.searchResults = [];
      }
    },

    async fetchMoreResults(type) {
      const entityObj = this.getEntity(type);

      const results = await this.fetchResults(
        type.toLowerCase(),
        entityObj.results.length
      );

      const responseEntity = results.data[0];

      entityObj.results = [...entityObj.results, ...responseEntity.results];
      entityObj.end = responseEntity.end;
    },

    getEntity(type) {
      return this.searchResults.find((item) => item.type === type);
    },

    async filterSubmit(data) {
      this.parametrsFilter = data.parametrsFilter;

      const results = await this.fetchResults(
        data.activeCategory ? data.activeCategory : null
      );

      if (results) {
        this.searchResults = results.data;
      } else {
        this.searchResults = [];
      }
    },

    filterReset(parametrsFilter) {
      this.parametrsFilter = parametrsFilter;
      this.fetchSearchResults();
    },
  },

  mounted() {
    // Если строка поиска не пустая, то делаем поисковый запрос
    if (this.userSearchQuery.length > 2) {
      // Если переход осуществляется со страницы оргструктуры, то поиск изначально должен идти по сотрудникам
      this.$router.history._startLocation === "/orgstructure"
        ? this.fetchSearchResults("users")
        : this.fetchSearchResults();
    }

    // Сбор статистики
    axios.post("mobileapp/api/statistic/add", {
      ACTION_CODE: "search",
      MODULE: "search",
      EXTRA_PARAMS: {
        TITLE: "Поиск",
        URL: "/page-search",
      },
    });
  },

  beforeRouteLeave(to, from, next) {
    if (
      (to.name === "Новость" ||
        to.name === "Личный кабинет" ||
        to.name === "Проект" ||
        to.name === "Конкурс" ||
        to.name === "Объявление" ||
        to.name === "Сообщество") &&
      this.searchId
    ) {
      // SEA-1689
      axios({
        method: "post",
        url: `/mobileapp/api/statistic/addTransition`,
        data: {
          queryId: this.searchId,
          url: to.fullPath,
        },
      });

      this.searchId = null;
    }

    if (this.isLoading) this.sendStatisticsBroken();

    next();
  },
};
</script>

<style lang="scss" scoped>
.page-search {
  &__header {
    position: relative;

    padding-bottom: var(--v-rhythm-8);

    &:not(:last-child) {
      margin-bottom: var(--v-rhythm-12);
    }

    &::before {
      content: "";

      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      z-index: -1;

      width: 100vw;
      height: 100%;

      background-color: var(--white900);
      border-bottom: 1px solid var(--gray200);
    }
  }

  &__search {
    &:not(:last-child) {
      margin-bottom: var(--v-rhythm-6);
    }
  }

  &__categories {
  }

  &__main {
    &-container {
      display: flex;
      gap: var(--v-rhythm-8);
    }
  }

  &__main-text-default {
    @extend .h3;
    color: var(--gray500);
  }

  &__results {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-12);

    &-item {
    }
  }

  &__sidebar {
    position: relative;

    width: 100%;
    height: 100%;
  }

  &__filter {
  }

  ::v-deep {
    b {
      color: var(--red900);
      font-weight: inherit;
    }
  }

  @include laptop {
    &__sidebar {
      padding-top: 0;
    }
  }
}
</style>
