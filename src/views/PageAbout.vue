<template>
  <AppPage class="page-about" :class="{ loading: isLoading }">
    <ul class="metrics" v-if="metrics">
      <li class="metrics__item" v-for="(metric, i) in metrics" :key="i">
        <span class="metrics__name" v-html="metric.NAME"></span>
        <span class="metrics__text">{{ metric.TEXT }}</span>
      </li>
    </ul>

    <div class="actual">
      <ForNewEmployee :sliderCardsInfo="sliderCardsInfo" />
    </div>

    <div class="post" v-if="post"><AboutContent :data="post" /></div>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import ForNewEmployee from "@widgets/ForNewEmployee.vue";
import AboutContent from "@/components/pages/about/AboutContent.vue";

export default {
  name: "PageAbout",

  components: {
    AppPage,
    ForNewEmployee,
    AboutContent,
  },

  data() {
    return {
      sliderCardsInfo: {
        name: "Актуальное",
        url: "/mobileapp/api/aboutCompany/actualPageList",
        detailUrl: "/mobileapp/api/aboutCompany/actualPageDetail?pageId=",
      },
      metrics: [],
      post: undefined,
      isLoading: true,
    };
  },

  methods: {
    getMetrics() {
      axios.get("/mobileapp/api/aboutCompany/metricList").then((response) => {
        this.metrics = response.data;
        if (this.post) this.isLoading = false;
      });
    },

    getPost() {
      axios.get("/mobileapp/api/aboutCompany/mainInfo").then((response) => {
        this.post = response.data;
        if (this.metrics) this.isLoading = false;
      });
    },
  },

  computed: {},

  watch: {},

  mounted() {
    this.getMetrics();
    this.getPost();
  },
};
</script>

<style lang="scss" scoped>
.metrics {
  display: flex;
  padding-bottom: var(--v-rhythm-10);

  @include laptop {
    flex-wrap: wrap;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;
    padding-right: var(--v-rhythm-2);
    padding-bottom: var(--v-rhythm-4);
    @include laptop {
      width: 50%;
      flex: unset;
    }
    @include phones {
      width: 100%;
    }
  }
  &__name {
    @extend .h3;
    color: var(--red900);
    display: flex;
    padding-right: 8px;
    &::v-deep {
      b {
        @extend .h1;
        font-weight: 700;
      }
    }
  }
  &__text {
    @extend .subtitle-2;
    color: var(--gray500);
    display: flex;
    flex: 1;
  }
}
</style>