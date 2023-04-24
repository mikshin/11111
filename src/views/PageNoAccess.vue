<template>
  <AppPage
    class="page-no-access"
    :noTitle="true"
    :breadcrumbsFullPath="breadcrumbs ? breadcrumbs : null"
  >
    <div class="page-no-access__content">
      <div class="page-no-access__description page-text-default">
        {{ description }}
      </div>
      <router-link :to="urlBtn" class="page-no-access__btn primary-btn">{{
        TextBtn
      }}</router-link>
    </div>
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";

export default {
  name: "PageNoAccess",

  components: {
    AppPage,
  },

  props: {
    breadcrumbs: {
      type: Array,
      required: false,
      default: function () {
        return [
          {
            name: "Нет доступа",
          },
        ];
      },
    },

    urlBtn: {
      type: String,
      required: false,
      default: "/",
    },

    TextBtn: {
      type: String,
      required: false,
      default: "На главную",
    },

    description: {
      type: String,
      required: false,
      default: "Недостаточно прав для просмотра элемента",
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.page-no-access {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
    align-items: flex-start;
  }

  &__description {
  }

  &__btn {
  }
}
</style>