<template>
  <div class="section-comments-header">
    <div class="section-comments-header__inner">
      <span class="section-comments-header__title">{{ title }}</span>
      <div class="section-comments-header__wrapper-count" v-if="instance">
        <UniversalViewsCounter
          :endpoint="viewsEndPoints"
          :counter="instance.VIEW_COUNT"
          :urlId="instance.ID"
        />
        <UniversalLikesCounter
          :endpoint="likesEndPoints"
          :counter="instance.LIKE_COUNT"
          :urlId="instance.ID"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { sklonenie } from "@/assets/scripts/scripts.js";
import UniversalViewsCounter from "@/components/UI/counter/UnviversalCounter/UniversalViewsCounter.vue";
import UniversalLikesCounter from "@/components/UI/counter/UnviversalCounter/UniversalLikesCounter.vue";
export default {
  name: "SectionCommentsHeader",

  components: {
    UniversalViewsCounter,
    UniversalLikesCounter,
  },

  props: {
    quantity: {
      type: Number,
      required: true,
    },

    instance: {
      type: Object,
      required: false,
    },
    likesEndPoints: {
      type: Object,
      required: false,
    },
    viewsEndPoints: {
      type: Object,
      required: false,
    },
    commentsEndPoints: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    title() {
      return `${this.quantity} ${sklonenie(this.quantity, [
        "комментарий",
        "комментария",
        "комментариев",
      ])}`;
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.section-comments-header {
  --height-shadow: var(--v-rhythm-4);

  padding-bottom: var(--height-shadow);

  overflow: hidden;

  &__inner {
    padding: var(--v-rhythm-6) 0;

    display: flex;
    flex-wrap: wrap;
    gap: var(--v-rhythm-4);
    justify-content: space-between;
    align-items: center;

    border-top: 2px solid var(--gray300);
    box-shadow: var(--boxShadowList);
  }

  &__title {
    @extend .h3;
    color: var(--gray900);
  }

  &__counters {
  }

  &__wrapper-count {
    display: flex;
  }
}
</style>