<template>
  <div class="app-page" :class="{ 'app-page--white': hasWhiteHeader }">
    <div class="app-page__container container">
      <template v-if="!isLoading">
        <div
          class="app-page__header"
          :class="{ 'app-page__header--white': hasWhiteHeader }"
          v-if="!noBreadcrumbs || !noTitle"
        >
          <template v-if="!noBreadcrumbs">
            <Breadcrumbs
              v-if="breadcrumbsAnotherName"
              class="app-page__breadcrumbs"
              :dopName="breadcrumbsDopName"
              :anotherName="breadcrumbsAnotherName"
              :fullPath="breadcrumbsFullPath"
            />
            <Breadcrumbs
              v-else
              class="app-page__breadcrumbs"
              :dopName="breadcrumbsDopName"
              :anotherName="breadcrumbsAnotherName"
              :fullPath="breadcrumbsFullPath"
            />
          </template>
          <div class="app-page__title main-title" v-if="!noTitle">
            {{ title }}
          </div>
        </div>
        <slot></slot>
      </template>

      <div class="app-page__text-default page-text-default" v-else>
        Загрузка...
      </div>
    </div>

    <ToTop />
  </div>
</template>

<script>
import Breadcrumbs from "@/components/UI/breadcrumbs.vue";
import ToTop from "@/components/UI/ToTop.vue";

export default {
  name: "AppPage",

  components: {
    Breadcrumbs,
    ToTop,
  },

  props: {
    pageTitle: {
      type: String,
      required: false,
    },

    breadcrumbsDopName: {
      type: String,
      required: false,
    },

    breadcrumbsAnotherName: {
      type: String,
      required: false,
    },

    breadcrumbsFullPath: {
      type: Array,
      required: false,
    },

    hasWhiteHeader: {
      type: Boolean,
      required: false,
      default: false,
    },

    noTitle: {
      type: Boolean,
      required: false,
      default: false,
    },

    noBreadcrumbs: {
      type: Boolean,
      required: false,
      default: false,
    },

    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    title() {
      return this.pageTitle ? this.pageTitle : this.$route.name;
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.app-page {
  &--white {
    --app-page-padding-top: var(--v-rhythm-8);

    margin-top: calc(-1 * var(--app-page-padding-top));
  }

  &__container {
  }

  &__text-default {
    text-align: center;
  }

  &__header {
    position: relative;

    padding-bottom: var(--v-rhythm-8);

    &--white {
      padding-top: var(--app-page-padding-top);

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
      }
    }
  }

  &__breadcrumbs {
    margin-bottom: var(--v-rhythm-6);

    &:last-child {
      margin-bottom: unset;
    }
  }

  &__title {
    margin-bottom: 0;
  }
}
</style>