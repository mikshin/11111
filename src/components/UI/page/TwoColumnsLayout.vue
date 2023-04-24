<template>
  <AppPage
    class="two-columns-template"
    :class="{
      'mobile-reversed': isMobileReverse,
    }"
    :breadcrumbsAnotherName="breadcrumbsAnotherName"
    :breadcrumbsFullPath="breadcrumbsFullPath"
    :noTitle="noTitle"
  >
    <div class="two-columns-template__columns">
      <div class="two-columns-template__column">
        <slot name="left"></slot>
      </div>
      <div class="two-columns-template__column">
        <slot name="right"></slot>
      </div>
    </div>
  </AppPage>
</template>

<script>
import AppPage from "./AppPage.vue";

export default {
  name: "TwoColumnsLayout",

  components: { AppPage },

  props: {
    breadcrumbsAnotherName: {
      type: String,
      default: null,
    },
    breadcrumbsFullPath: {
      type: Array,
      required: false,
    },
    noTitle: {
      type: Boolean,
      default: true,
    },
    isMobileReverse: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.two-columns-template {
  &__columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--v-rhythm-8);
  }

  @include laptop {
    &__columns {
      grid-template-columns: 100%;

      .mobile-reversed & {
        display: flex;
        flex-direction: column-reverse;
      }
    }
  }
}
</style>
