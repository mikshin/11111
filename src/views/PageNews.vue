<template>
  <AppPage class="page-news">
    <MainSidebar class="page-news__main-sidebar">
      <template #main>
        <div class="page-news__news-list" :class="{ loading: isLoading }">
          <template v-if="newsList.length">
            <NewsTemplate
              class="page-news__news-template"
              v-for="(item, i) in newsList"
              :key="i"
              :data="item"
            />

            <div v-intersection="getMoreNews" v-if="!isEnd"></div>
          </template>

          <span class="page-news__text-default" v-else
            >Новостей не найдено</span
          >
        </div>
      </template>
      <template #sidebar>
        <FilterTemplate
          class="page-news__filter"
          :class="{ loading: filterIsLoading }"
          @onUpdate="filterSubmit"
          :filter="filterSidebar"
        />
      </template>
    </MainSidebar>
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import NewsTemplate from "@/components/pages/news/newsTemplate.vue";
import FilterTemplate from "@/components/UI/filter/FilterTemplate.vue";
import axios from "axios";

export default {
  name: "PageNews",

  components: {
    AppPage,
    MainSidebar,
    NewsTemplate,
    FilterTemplate,
  },

  data() {
    return {
      isLoading: false,
      newsList: [],
      isEnd: true,
      filter: null,

      filterIsLoading: false,
      filterSidebar: [
        {
          name: "THEME",
          placeholder: "Рубрика",
          type: "select",
          multiple: true,
          selectValue: [],
        },
        {
          name: "Дата публикации",
          type: "period",
        },
        {
          name: "Содержание новости",
          type: "label",
        },
        {
          name: "MEDIALIBRARY",
          placeholder: "Фотогаларея",
          type: "checkbox",
        },
        {
          name: "VIDEOFILE",
          placeholder: "Видео",
          type: "checkbox",
        },
        {
          name: "AUDIOFILE",
          placeholder: "Аудио",
          type: "checkbox",
        },
        {
          name: "FILE",
          placeholder: "Документы",
          type: "checkbox",
        },
      ],
    };
  },

  computed: {},

  methods: {
    async getNews() {
      this.newsList = await this.loadNews(0);
    },

    async getMoreNews() {
      this.newsList = [
        ...this.newsList,
        ...(await this.loadNews(this.newsList.length)),
      ];
    },

    async loadNews(startFrom) {
      try {
        this.isLoading = true;
        this.isEnd = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/news`,
          params: {
            count: 6,
            startFrom: startFrom,
          },
          data: {
            filter: this.filter,
          },
        });

        this.isEnd = response.data.end;
        return response.data.data || [];
      } catch (error) {
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    filterSubmit(data) {
      this.filter = data.data;

      this.getNews();
    },

    // !TODO Переделать получение фильтров
    async getFilter() {
      try {
        this.filterIsLoading = true;

        const response = await axios({
          method: "get",
          url: `/mobileapp/api/news/getFilter`,
        });

        for (let item in response.data.THEME) {
          this.filterSidebar[0].selectValue.push({
            label: response.data.THEME[item],
            code: item,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.filterIsLoading = false;
      }
    },
  },

  mounted() {
    this.getNews();
    this.getFilter();
  },
};
</script>

<style lang="scss" scoped>
.page-news {
  &__news-template {
    margin-left: var(--negativeMainPadding);
  }

  &__text-default {
    @extend .h2;
    color: var(--gray500);
  }

  @include laptop {
    &__news-template {
      margin-left: 0;
    }
  }
}
</style>
