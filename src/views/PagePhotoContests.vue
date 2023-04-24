<template>
  <AppPage class="page-photo-contests">
    <CardsList />
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import CardsList from "@/components/photo-contests-list/CardsList.vue";

export default {
  name: "PagePhotoContests",

  components: {
    AppPage,
    CardsList,
  },

  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.page-photo-contests {
  &__empty {
    @extend .h2;
    display: block;

    width: 100%;

    color: var(--gray500);
  }
}
</style>
